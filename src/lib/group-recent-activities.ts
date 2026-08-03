import { format, parseISO, subDays } from "date-fns";

import {
  formatTimelineTime,
  getServerTimelineForGroup,
  getTimelineForGroup,
  type TimelinePost,
} from "@/lib/community-timeline";
import { formatLastActive, getMembersByGroup } from "@/lib/group-members";
import { getMemberReadingHistory } from "@/lib/member-reading-history";
import type { GroupMemberProgress } from "@/lib/types";

export type GroupActivityKind = "read" | "reflection" | "share" | "post";

export type GroupActivityItem = {
  id: string;
  kind: GroupActivityKind;
  memberId: string | null;
  memberName: string;
  isCurrentUser: boolean;
  /** Frasa aksi singkat, mis. "selesai baca" */
  action: string;
  detail: string;
  createdAt: string;
  timeLabel: string;
  href: string;
};

/** Referensi stabil untuk useSyncExternalStore. */
const EMPTY_ACTIVITIES: GroupActivityItem[] = [];

type ActivitiesCacheEntry = {
  source: TimelinePost[];
  items: GroupActivityItem[];
};

const activitiesCache = new Map<string, ActivitiesCacheEntry>();
const serverActivitiesCache = new Map<string, GroupActivityItem[]>();

function cacheKey(
  groupId: string,
  limit: number,
  kindsKey = "all",
) {
  return `${groupId}::${limit}::${kindsKey}`;
}

function hashSeed(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function readingCreatedAt(memberId: string, dateKey: string) {
  const seed = hashSeed(`${memberId}:${dateKey}`);
  const hour = 6 + (seed % 14);
  const minute = seed % 60;
  return parseISO(
    `${dateKey}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`,
  ).toISOString();
}

function findMemberByName(
  members: GroupMemberProgress[],
  authorName: string,
): GroupMemberProgress | undefined {
  const needle = authorName.trim().toLowerCase();
  return members.find((m) => m.name.trim().toLowerCase() === needle);
}

function activityFromTimeline(
  post: TimelinePost,
  members: GroupMemberProgress[],
): GroupActivityItem {
  const member = findMemberByName(members, post.authorName);
  const kind: GroupActivityKind =
    post.kind === "reflection"
      ? "reflection"
      : post.kind === "share"
        ? "share"
        : "post";

  const action =
    kind === "reflection"
      ? "menulis refleksi"
      : kind === "share"
        ? "membagikan refleksi"
        : "membagikan kabar";

  const snippet = post.content.replace(/\s+/g, " ").trim();
  const detail =
    post.passage?.trim() ||
    (snippet.length > 64 ? `${snippet.slice(0, 64)}…` : snippet) ||
    "Kelompok";

  return {
    id: `timeline-${post.id}`,
    kind,
    memberId: member?.id ?? null,
    memberName: post.authorName,
    isCurrentUser: Boolean(member?.isCurrentUser || post.isMine),
    action,
    detail,
    createdAt: post.createdAt,
    timeLabel: post.time || formatTimelineTime(post.createdAt),
    href: member
      ? `/profil/anggota/${member.id}`
      : post.passage
        ? `/baca?tab=alkitab&passage=${encodeURIComponent(post.passage)}`
        : "/kelompok",
  };
}

function readingActivitiesForMember(
  member: GroupMemberProgress,
  sinceKey: string,
): GroupActivityItem[] {
  const history = getMemberReadingHistory(member);
  const items: GroupActivityItem[] = [];

  for (const day of history) {
    if (day.status !== "completed") continue;
    if (day.date < sinceKey) continue;

    const createdAt = readingCreatedAt(member.id, day.date);
    items.push({
      id: `read-${member.id}-${day.date}`,
      kind: "read",
      memberId: member.id,
      memberName: member.name,
      isCurrentUser: Boolean(member.isCurrentUser),
      action: "selesai baca",
      detail: day.passage || day.title || "Bacaan terjadwal",
      createdAt,
      timeLabel: formatLastActive(createdAt) ?? formatTimelineTime(createdAt),
      href: day.passage
        ? `/baca?tab=alkitab&passage=${encodeURIComponent(day.passage)}&date=${encodeURIComponent(day.date)}`
        : `/profil/anggota/${member.id}`,
    });
  }

  return items;
}

function buildActivities(
  groupId: string,
  timeline: TimelinePost[],
  limit: number,
  kinds?: GroupActivityKind[],
): GroupActivityItem[] {
  const members = getMembersByGroup(groupId);
  if (members.length === 0) return EMPTY_ACTIVITIES;

  const allow = kinds?.length ? new Set(kinds) : null;
  const sinceKey = format(subDays(new Date(), 6), "yyyy-MM-dd");
  const items: GroupActivityItem[] = [];

  if (!allow || allow.has("read")) {
    for (const member of members) {
      items.push(...readingActivitiesForMember(member, sinceKey));
    }
  }

  if (!allow || allow.has("post") || allow.has("reflection") || allow.has("share")) {
    for (const post of timeline) {
      const item = activityFromTimeline(post, members);
      if (allow && !allow.has(item.kind)) continue;
      items.push(item);
    }
  }

  items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const seen = new Set<string>();
  const unique: GroupActivityItem[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    unique.push(item);
    if (unique.length >= limit) break;
  }
  return unique.length === 0 ? EMPTY_ACTIVITIES : unique;
}

export function getGroupRecentActivities(
  groupId: string,
  limit = 7,
  kinds?: GroupActivityKind[],
): GroupActivityItem[] {
  const timeline = getTimelineForGroup(groupId);
  const kindsKey = kinds?.length ? [...kinds].sort().join("+") : "all";
  const key = cacheKey(groupId, limit, kindsKey);
  const cached = activitiesCache.get(key);
  if (cached && cached.source === timeline) return cached.items;

  const items = buildActivities(groupId, timeline, limit, kinds);
  activitiesCache.set(key, { source: timeline, items });
  return items;
}

export function getServerGroupRecentActivities(
  groupId: string,
  limit = 7,
  kinds?: GroupActivityKind[],
): GroupActivityItem[] {
  const kindsKey = kinds?.length ? [...kinds].sort().join("+") : "all";
  const key = cacheKey(groupId, limit, kindsKey);
  const cached = serverActivitiesCache.get(key);
  if (cached) return cached;

  const items = buildActivities(
    groupId,
    getServerTimelineForGroup(groupId),
    limit,
    kinds,
  );
  serverActivitiesCache.set(key, items);
  return items;
}
