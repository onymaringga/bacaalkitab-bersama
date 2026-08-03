"use client";

import { listChapterNotes, subscribeChapterNotes, clearChapterNote } from "@/lib/bible-chapter-notes";
import { demoGroupReflections, demoUser } from "@/lib/demo-data";
import { getMembersByGroup } from "@/lib/group-members";
import {
  getReflectionChatMessages,
  isDeletedChatMessage,
  isReflectionShareMessage,
  softDeleteOwnChatMessage,
  subscribeReflectionChat,
} from "@/lib/group-reflection-chat";

const POSTS_KEY = "bacaalkitab-timeline-posts";
const LIKES_KEY = "bacaalkitab-timeline-likes";
const EVENT = "community-timeline-updated";

export type TimelinePostKind = "post" | "reflection" | "share";

export type TimelinePost = {
  id: string;
  kind: TimelinePostKind;
  authorName: string;
  content: string;
  /** ISO timestamp for sorting */
  createdAt: string;
  /** Label tampilan, mis. "Hari ini · 09:05" */
  time: string;
  passage?: string;
  groupName?: string;
  groupId?: string;
  isMine?: boolean;
};

export type StoredTimelinePost = {
  id: string;
  content: string;
  createdAt: string;
  authorName?: string;
  groupId?: string;
  groupName?: string;
};

type LikesMap = Record<string, { count: number; likedByMe: boolean }>;

const EMPTY_POSTS: StoredTimelinePost[] = [];
const EMPTY_LIKES: LikesMap = {};

let postsCacheRaw: string | null = null;
let postsCache: StoredTimelinePost[] = EMPTY_POSTS;
let postsHasCache = false;

let likesCacheRaw: string | null = null;
let likesCache: LikesMap = EMPTY_LIKES;
let likesHasCache = false;

let feedCache: TimelinePost[] | null = null;
let feedCacheKey: string | null = null;

const EMPTY_TIMELINE: TimelinePost[] = [];
const authorTimelineCache = new Map<string, TimelinePost[]>();
let authorTimelineSource: TimelinePost[] | null = null;
const groupTimelineCache = new Map<string, TimelinePost[]>();
let groupTimelineSource: TimelinePost[] | null = null;
const serverAuthorTimelineCache = new Map<string, TimelinePost[]>();
const serverGroupTimelineCache = new Map<string, TimelinePost[]>();

function emit() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(EVENT));
}

function readPosts(): StoredTimelinePost[] {
  if (typeof window === "undefined") return EMPTY_POSTS;
  const raw = window.localStorage.getItem(POSTS_KEY);
  if (postsHasCache && raw === postsCacheRaw) return postsCache;
  postsCacheRaw = raw;
  postsHasCache = true;
  if (!raw) {
    postsCache = EMPTY_POSTS;
    return postsCache;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    postsCache = Array.isArray(parsed)
      ? (parsed as StoredTimelinePost[]).filter(
          (item) =>
            item &&
            typeof item.id === "string" &&
            typeof item.content === "string" &&
            typeof item.createdAt === "string",
        )
      : EMPTY_POSTS;
  } catch {
    postsCache = EMPTY_POSTS;
  }
  return postsCache;
}

function writePosts(posts: StoredTimelinePost[]) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(posts);
  window.localStorage.setItem(POSTS_KEY, raw);
  postsCacheRaw = raw;
  postsCache = posts;
  postsHasCache = true;
  feedCache = null;
  feedCacheKey = null;
  authorTimelineCache.clear();
  authorTimelineSource = null;
  groupTimelineCache.clear();
  groupTimelineSource = null;
  emit();
}

function readLikes(): LikesMap {
  if (typeof window === "undefined") return EMPTY_LIKES;
  const raw = window.localStorage.getItem(LIKES_KEY);
  if (likesHasCache && raw === likesCacheRaw) return likesCache;
  likesCacheRaw = raw;
  likesHasCache = true;
  if (!raw) {
    likesCache = EMPTY_LIKES;
    return likesCache;
  }
  try {
    const parsed = JSON.parse(raw) as LikesMap;
    likesCache =
      parsed && typeof parsed === "object" ? parsed : EMPTY_LIKES;
  } catch {
    likesCache = EMPTY_LIKES;
  }
  return likesCache;
}

function writeLikes(likes: LikesMap) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(likes);
  window.localStorage.setItem(LIKES_KEY, raw);
  likesCacheRaw = raw;
  likesCache = likes;
  likesHasCache = true;
  emit();
}

export function formatTimelineTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startThat = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const dayDiff = Math.round(
    (startToday.getTime() - startThat.getTime()) / 86_400_000,
  );
  const clock = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (dayDiff === 0) return `Hari ini · ${clock}`;
  if (dayDiff === 1) return `Kemarin · ${clock}`;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Seed waktu relatif untuk demo agar bisa diurutkan — fixed, bukan Date.now(). */
const DEMO_TIME_BASE = Date.parse("2026-07-22T12:00:00.000Z");

function demoCreatedAt(index: number) {
  return new Date(DEMO_TIME_BASE - index * 3_600_000).toISOString();
}

function buildFeed(): TimelinePost[] {
  const userPosts: TimelinePost[] = readPosts().map((post) => ({
    id: post.id,
    kind: "post" as const,
    authorName: post.authorName || demoUser.name,
    content: post.content,
    createdAt: post.createdAt,
    time: formatTimelineTime(post.createdAt),
    groupId: post.groupId,
    groupName: post.groupName,
    isMine: true,
  }));

  const reflections: TimelinePost[] = listChapterNotes().map((note) => ({
    id: `note-${note.reference}-${note.updatedAt}`,
    kind: "reflection" as const,
    authorName: demoUser.name,
    content: note.content,
    createdAt: note.updatedAt,
    time: formatTimelineTime(note.updatedAt),
    passage: note.reference,
    isMine: true,
  }));

  const shares: TimelinePost[] = getReflectionChatMessages()
    .filter(
      (message) =>
        !isDeletedChatMessage(message) &&
        Boolean(message.content?.trim()),
    )
    .map((message) => {
      const createdMs =
        typeof message.createdAt === "number" && Number.isFinite(message.createdAt)
          ? message.createdAt
          : DEMO_TIME_BASE;
      const createdAt = new Date(createdMs).toISOString();
      const isShare = isReflectionShareMessage(message);
      return {
        id: `${isShare ? "share" : "chat"}-${message.id}`,
        kind: (isShare ? "share" : "post") as TimelinePostKind,
        authorName: message.authorName || demoUser.name,
        content: message.content,
        createdAt,
        time: message.time || formatTimelineTime(createdAt),
        passage: message.passage,
        groupName: isShare ? "Kelompokku" : undefined,
        isMine: Boolean(message.isMine),
      };
    });

  const demo: TimelinePost[] = demoGroupReflections
    .filter((item) => item.visibility === "group")
    .map((item, index) => ({
      id: item.id,
      kind: "share" as const,
      authorName: item.authorName,
      content: item.content,
      createdAt: demoCreatedAt(index + 2),
      time: item.time,
      passage: item.passage,
      groupName: item.groupName,
      groupId: item.groupId,
      isMine: false,
    }));

  const merged = [...userPosts, ...reflections, ...shares, ...demo];
  const seen = new Set<string>();
  const unique: TimelinePost[] = [];
  for (const item of merged) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    unique.push(item);
  }

  return unique.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getCommunityTimeline(): TimelinePost[] {
  const posts = readPosts();
  const notes = listChapterNotes();
  const messages = getReflectionChatMessages();
  const key = [
    posts.map((p) => `${p.id}:${p.content.length}`).join(","),
    notes.map((n) => `${n.reference}:${n.updatedAt}`).join(","),
    messages
      .map(
        (m) =>
          `${m.id}:${m.deleted ? "d" : "a"}:${m.kind ?? ""}:${m.content?.length ?? 0}`,
      )
      .join(","),
  ].join("|");

  if (feedCache && feedCacheKey === key) return feedCache;
  feedCacheKey = key;
  feedCache = buildFeed();
  return feedCache;
}

/** Timeline milik satu anggota (refleksi, share, postingan). */
export function getTimelineForAuthor(authorName: string): TimelinePost[] {
  const needle = authorName.trim().toLowerCase();
  if (!needle) return EMPTY_TIMELINE;

  const source = getCommunityTimeline();
  if (authorTimelineSource !== source) {
    authorTimelineCache.clear();
    authorTimelineSource = source;
  }

  const cached = authorTimelineCache.get(needle);
  if (cached) return cached;

  const next = source.filter(
    (item) => item.authorName.trim().toLowerCase() === needle,
  );
  authorTimelineCache.set(needle, next);
  return next;
}

export function getServerTimelineForAuthor(authorName: string): TimelinePost[] {
  const needle = authorName.trim().toLowerCase();
  if (!needle) return EMPTY_TIMELINE;

  const cached = serverAuthorTimelineCache.get(needle);
  if (cached) return cached;

  const next = SERVER_TIMELINE.filter(
    (item) => item.authorName.trim().toLowerCase() === needle,
  );
  serverAuthorTimelineCache.set(needle, next);
  return next;
}

/** Timeline khusus satu kelompok (refleksi & postingan anggota). */
export function getTimelineForGroup(groupId: string): TimelinePost[] {
  if (!groupId) return EMPTY_TIMELINE;

  const source = getCommunityTimeline();
  if (groupTimelineSource !== source) {
    groupTimelineCache.clear();
    groupTimelineSource = source;
  }

  const cached = groupTimelineCache.get(groupId);
  if (cached) return cached;

  const memberNames = new Set(
    getMembersByGroup(groupId).map((member) =>
      member.name.trim().toLowerCase(),
    ),
  );

  const next = source.filter((item) => {
    if (item.groupId === groupId) return true;
    return memberNames.has(item.authorName.trim().toLowerCase());
  });
  groupTimelineCache.set(groupId, next);
  return next;
}

export function getServerTimelineForGroup(groupId: string): TimelinePost[] {
  if (!groupId) return EMPTY_TIMELINE;

  const cached = serverGroupTimelineCache.get(groupId);
  if (cached) return cached;

  const memberNames = new Set(
    getMembersByGroup(groupId).map((member) =>
      member.name.trim().toLowerCase(),
    ),
  );
  const next = SERVER_TIMELINE.filter((item) => {
    if (item.groupId === groupId) return true;
    return memberNames.has(item.authorName.trim().toLowerCase());
  });
  serverGroupTimelineCache.set(groupId, next);
  return next;
}

const SERVER_TIMELINE: TimelinePost[] = demoGroupReflections
  .filter((item) => item.visibility === "group")
  .map((item, index) => ({
    id: item.id,
    kind: "share" as const,
    authorName: item.authorName,
    content: item.content,
    createdAt: demoCreatedAt(index + 2),
    time: item.time,
    passage: item.passage,
    groupName: item.groupName,
    groupId: item.groupId,
    isMine: false,
  }));

export function getServerCommunityTimeline(): TimelinePost[] {
  return SERVER_TIMELINE;
}

export function createTimelinePost(
  content: string,
  authorName?: string,
  meta?: { groupId?: string; groupName?: string },
) {
  const trimmed = content.trim();
  if (!trimmed) return null;
  const post: StoredTimelinePost = {
    id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    content: trimmed.slice(0, 2000),
    createdAt: new Date().toISOString(),
    authorName: authorName?.trim() || demoUser.name,
    groupId: meta?.groupId,
    groupName: meta?.groupName,
  };
  writePosts([post, ...readPosts()]);
  return post;
}

export function deleteTimelinePost(id: string) {
  writePosts(readPosts().filter((post) => post.id !== id));
  const likes = { ...readLikes() };
  delete likes[id];
  writeLikes(likes);
}

/** Hapus item milik sendiri dari timeline (post / refleksi / share). */
export function removeOwnTimelineItem(item: TimelinePost): boolean {
  if (!item.isMine) return false;

  if (item.kind === "post") {
    if (item.id.startsWith("chat-")) {
      const messageId = item.id.slice("chat-".length);
      const ok = softDeleteOwnChatMessage(messageId);
      if (ok) {
        const likes = { ...readLikes() };
        delete likes[item.id];
        writeLikes(likes);
      }
      return ok;
    }
    deleteTimelinePost(item.id);
    return true;
  }

  if (item.kind === "reflection") {
    if (!item.passage) return false;
    clearChapterNote(item.passage);
    const likes = { ...readLikes() };
    delete likes[item.id];
    writeLikes(likes);
    return true;
  }

  if (item.kind === "share") {
    const messageId = item.id.startsWith("share-")
      ? item.id.slice("share-".length)
      : item.id;
    const ok = softDeleteOwnChatMessage(messageId);
    if (ok) {
      const likes = { ...readLikes() };
      delete likes[item.id];
      writeLikes(likes);
    }
    return ok;
  }

  return false;
}

export function getTimelineLikeState(postId: string) {
  const entry = readLikes()[postId];
  return {
    count: entry?.count ?? 0,
    likedByMe: Boolean(entry?.likedByMe),
  };
}

export function toggleTimelineLike(postId: string) {
  const likes = { ...readLikes() };
  const current = likes[postId] ?? { count: 0, likedByMe: false };
  if (current.likedByMe) {
    likes[postId] = {
      count: Math.max(0, current.count - 1),
      likedByMe: false,
    };
  } else {
    likes[postId] = {
      count: current.count + 1,
      likedByMe: true,
    };
  }
  writeLikes(likes);
  return likes[postId];
}

export function getTimelineLikesSnapshot() {
  return JSON.stringify(readLikes());
}

export function getServerTimelineLikesSnapshot() {
  return "{}";
}

export function subscribeCommunityTimeline(onChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const wrapped = () => {
    postsHasCache = false;
    likesHasCache = false;
    feedCache = null;
    feedCacheKey = null;
    authorTimelineCache.clear();
    authorTimelineSource = null;
    groupTimelineCache.clear();
    groupTimelineSource = null;
    onChange();
  };

  window.addEventListener(EVENT, wrapped);
  window.addEventListener("storage", wrapped);
  const unsubNotes = subscribeChapterNotes(wrapped);
  const unsubChat = subscribeReflectionChat(wrapped);

  return () => {
    window.removeEventListener(EVENT, wrapped);
    window.removeEventListener("storage", wrapped);
    unsubNotes();
    unsubChat();
  };
}
