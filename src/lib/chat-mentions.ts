import {
  demoUserGroupIds,
  getMembersByGroup,
} from "@/lib/group-members";
import type { GroupMemberProgress } from "@/lib/types";

export type MentionCandidate = {
  id: string;
  name: string;
  /** Token yang disisipkan setelah @, tanpa spasi. */
  handle: string;
  /** Alias lain yang dikenali saat mengetik & merender. */
  aliases?: string[];
  role: GroupMemberProgress["role"];
  isCurrentUser?: boolean;
};

/** Handle utama untuk mention seluruh kelompok. */
export const MENTION_ALL_HANDLE = "all";

const MENTION_ALL_ALIASES = ["all", "semua"];

export function getMentionHandles(candidate: MentionCandidate): string[] {
  const handles = new Set<string>([
    candidate.handle,
    ...(candidate.aliases ?? []),
  ]);
  return [...handles].filter(Boolean);
}

export function isMentionAllHandle(handle: string) {
  return MENTION_ALL_ALIASES.includes(handle.toLowerCase());
}

export function toMentionHandle(name: string) {
  return name
    .trim()
    .replace(/^Kak\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .join("")
    .replace(/[^A-Za-zÀ-ÿ0-9]/g, "");
}

export function getGroupMentionCandidates(
  groupId = demoUserGroupIds[0],
): MentionCandidate[] {
  const members = getMembersByGroup(groupId);
  const fromMembers = members.map((member) => ({
    id: member.id,
    name: member.name,
    handle: toMentionHandle(member.name) || member.id,
    role: member.role,
    isCurrentUser: member.isCurrentUser,
  }));

  return [
    {
      id: "all",
      name: "Semua anggota",
      handle: MENTION_ALL_HANDLE,
      aliases: ["semua"],
      role: "member",
    },
    ...fromMembers,
  ];
}

/** Query aktif setelah `@` terakhir (null jika tidak sedang mention). */
export function getActiveMentionQuery(
  text: string,
  caret = text.length,
): { start: number; query: string } | null {
  const before = text.slice(0, caret);
  const match = /(?:^|[\s([{"'])@([A-Za-zÀ-ÿ0-9._-]*)$/.exec(before);
  if (!match) return null;
  return {
    start: before.length - match[1].length - 1,
    query: match[1],
  };
}

export function filterMentionCandidates(
  candidates: MentionCandidate[],
  query: string,
) {
  const q = query.trim().toLowerCase();
  if (!q) return candidates;
  return candidates.filter((item) => {
    const handles = getMentionHandles(item);
    return (
      handles.some((handle) => handle.toLowerCase().includes(q)) ||
      item.name.toLowerCase().includes(q) ||
      (item.id === "all" &&
        (q === "a" ||
          q.startsWith("al") ||
          q.startsWith("se") ||
          q.includes("semua")))
    );
  });
}

export function insertMentionAtCaret(
  text: string,
  caret: number,
  handle: string,
): { text: string; caret: number } {
  const active = getActiveMentionQuery(text, caret);
  if (!active) {
    const insert = `@${handle} `;
    const next = text.slice(0, caret) + insert + text.slice(caret);
    return { text: next, caret: caret + insert.length };
  }

  const insert = `@${handle} `;
  const next =
    text.slice(0, active.start) + insert + text.slice(caret);
  return { text: next, caret: active.start + insert.length };
}

export type MentionSegment =
  | { type: "text"; value: string }
  | { type: "mention"; value: string; handle: string };

/** Pecah teks jadi segmen biasa + mention untuk di-render. */
export function parseMentionSegments(
  content: string,
  candidates: MentionCandidate[],
): MentionSegment[] {
  if (!content) return [];

  const handles = [...candidates]
    .flatMap((item) => getMentionHandles(item))
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  if (handles.length === 0) return [{ type: "text", value: content }];

  const pattern = new RegExp(
    `@(?:${handles.map(escapeRegExp).join("|")})\\b`,
    "g",
  );

  const segments: MentionSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) != null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        value: content.slice(lastIndex, match.index),
      });
    }
    const token = match[0];
    segments.push({
      type: "mention",
      value: token,
      handle: token.slice(1),
    });
    lastIndex = match.index + token.length;
  }

  if (lastIndex < content.length) {
    segments.push({ type: "text", value: content.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ type: "text", value: content }];
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
