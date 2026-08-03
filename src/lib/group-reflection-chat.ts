import {
  demoGroupReflections,
  demoTodayReading,
  demoUser,
} from "@/lib/demo-data";
import type { GroupReflection } from "@/lib/types";
import { getTodayKey } from "@/lib/reading-status";

/** Tanggal yang sudah punya refleksi member — syarat buka chat. */
const REFLECTION_DATES_KEY = "bacaalkitab-reflection-written";
const REFLECTION_CONTENT_KEY = "bacaalkitab-reflection-by-date";
const MESSAGES_KEY = "bacaalkitab-reflection-chat-messages";
/** Legacy unlock key — dibersihkan supaya chat tidak terbuka tanpa refleksi. */
const LEGACY_UNLOCK_KEY = "bacaalkitab-reflection-chat-unlock";
const LAST_READ_KEY = "bacaalkitab-chat-last-read";

export type StoredDayReflection = {
  content: string;
  passage: string;
  updatedAt: string;
};

export type ChatMessageKind = "reflection" | "message";

export type ReflectionChatMessage = {
  id: string;
  authorName: string;
  content: string;
  time: string;
  isMine?: boolean;
  passage?: string;
  /** Refleksi bacaan yang dibagikan vs chat biasa. */
  kind?: ChatMessageKind;
  /** URL GIF (Giphy/Tenor/tautan https). */
  gifUrl?: string;
  /** Epoch ms — untuk batas hapus 15 menit. */
  createdAt?: number;
  /** Soft-delete: pesan tetap di room dengan tanda dihapus. */
  deleted?: boolean;
  deletedAt?: number;
};

export function isReflectionShareMessage(message: ReflectionChatMessage) {
  return message.kind === "reflection";
}

const DELETE_WINDOW_MS = 15 * 60 * 1000;
const EMPTY_DATES: string[] = [];
const EMPTY_MY_MESSAGES: ReflectionChatMessage[] = [];

export function getMessageCreatedAt(message: ReflectionChatMessage): number | null {
  if (typeof message.createdAt === "number" && Number.isFinite(message.createdAt)) {
    return message.createdAt;
  }
  // Legacy: id `mine-<timestamp>`
  const match = /^mine-(\d+)$/.exec(message.id);
  if (match) {
    const ts = Number(match[1]);
    return Number.isFinite(ts) ? ts : null;
  }
  return null;
}

export function canDeleteOwnChatMessage(
  message: ReflectionChatMessage,
  now = Date.now(),
) {
  if (!message.isMine || message.deleted) return false;
  const createdAt = getMessageCreatedAt(message);
  if (createdAt == null) return false;
  return now - createdAt < DELETE_WINDOW_MS;
}

export function isDeletedChatMessage(message: ReflectionChatMessage) {
  return Boolean(message.deleted);
}

export function getChatDeleteRemainingMs(
  message: ReflectionChatMessage,
  now = Date.now(),
) {
  const createdAt = getMessageCreatedAt(message);
  if (createdAt == null) return 0;
  return Math.max(0, DELETE_WINDOW_MS - (now - createdAt));
}

let datesRaw: string | null = null;
let datesCache: string[] = EMPTY_DATES;
let hasDatesCache = false;

let messagesRaw: string | null = null;
let myMessagesCache: ReflectionChatMessage[] = EMPTY_MY_MESSAGES;
let hasMyMessagesCache = false;

let cachedFeed: ReflectionChatMessage[] | null = null;
let cachedFeedKey: string | null = null;
let legacyCleaned = false;
let unreadCountCache: number | null = null;
let unreadCountKey: string | null = null;
let serverUnreadCountCache: number | null = null;

function invalidateChatCaches() {
  hasDatesCache = false;
  hasMyMessagesCache = false;
  cachedFeed = null;
  cachedFeedKey = null;
  unreadCountCache = null;
  unreadCountKey = null;
}

function notify() {
  if (typeof window === "undefined") return;
  invalidateChatCaches();
  window.dispatchEvent(new Event("reflection-chat-updated"));
}

export function subscribeReflectionChat(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const wrapped = () => {
    invalidateChatCaches();
    onChange();
  };
  window.addEventListener("reflection-chat-updated", wrapped);
  window.addEventListener("storage", wrapped);
  return () => {
    window.removeEventListener("reflection-chat-updated", wrapped);
    window.removeEventListener("storage", wrapped);
  };
}

function readReflectionDates(): string[] {
  if (typeof window === "undefined") return EMPTY_DATES;
  const raw = localStorage.getItem(REFLECTION_DATES_KEY);
  if (hasDatesCache && raw === datesRaw) return datesCache;
  datesRaw = raw;
  hasDatesCache = true;
  if (!raw) {
    datesCache = EMPTY_DATES;
    return datesCache;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    datesCache = Array.isArray(parsed)
      ? (parsed as string[])
      : EMPTY_DATES;
  } catch {
    datesCache = EMPTY_DATES;
  }
  return datesCache;
}

/** True hanya jika member sudah menulis refleksi untuk tanggal itu. */
export function hasWrittenReflection(dateKey = getTodayKey()) {
  return readReflectionDates().includes(dateKey);
}

function readReflectionContentMap(): Record<string, StoredDayReflection> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(REFLECTION_CONTENT_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, StoredDayReflection>;
  } catch {
    return {};
  }
}

function writeReflectionContentMap(map: Record<string, StoredDayReflection>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(REFLECTION_CONTENT_KEY, JSON.stringify(map));
    notify();
  } catch {
    /* ignore */
  }
}

/** Ambil isi refleksi yang disimpan untuk tanggal jadwal. */
export function getReflectionForDate(dateKey: string): StoredDayReflection | null {
  const entry = readReflectionContentMap()[dateKey];
  if (!entry?.content?.trim()) return null;
  return entry;
}

function storeReflectionForDate(input: {
  dateKey: string;
  content: string;
  passage: string;
}) {
  const map = { ...readReflectionContentMap() };
  map[input.dateKey] = {
    content: input.content,
    passage: input.passage,
    updatedAt: new Date().toISOString(),
  };
  writeReflectionContentMap(map);
}

function cleanupLegacyUnlockKey() {
  if (typeof window === "undefined" || legacyCleaned) return;
  legacyCleaned = true;
  try {
    localStorage.removeItem(LEGACY_UNLOCK_KEY);
  } catch {
    /* ignore */
  }
}

export function isReflectionChatUnlocked(dateKey = getTodayKey()) {
  if (typeof window === "undefined") return false;
  cleanupLegacyUnlockKey();
  return hasWrittenReflection(dateKey);
}

export function markReflectionWritten(dateKey = getTodayKey()) {
  if (typeof window === "undefined") return;
  try {
    const current = readReflectionDates();
    if (current.includes(dateKey)) return;
    const next = [...current, dateKey];
    const raw = JSON.stringify(next);
    localStorage.setItem(REFLECTION_DATES_KEY, raw);
    datesRaw = raw;
    datesCache = next;
    hasDatesCache = true;
    notify();
  } catch {
    /* ignore */
  }
}

/** @deprecated Gunakan markReflectionWritten — chat hanya terbuka setelah refleksi. */
export function unlockReflectionChat(dateKey = getTodayKey()) {
  markReflectionWritten(dateKey);
}

function readMyMessages(): ReflectionChatMessage[] {
  if (typeof window === "undefined") return EMPTY_MY_MESSAGES;
  const raw = localStorage.getItem(MESSAGES_KEY);
  if (hasMyMessagesCache && raw === messagesRaw) return myMessagesCache;
  messagesRaw = raw;
  hasMyMessagesCache = true;
  if (!raw) {
    myMessagesCache = EMPTY_MY_MESSAGES;
    return myMessagesCache;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    myMessagesCache = Array.isArray(parsed)
      ? (parsed as ReflectionChatMessage[])
      : EMPTY_MY_MESSAGES;
  } catch {
    myMessagesCache = EMPTY_MY_MESSAGES;
  }
  return myMessagesCache;
}

function writeMyMessages(next: ReflectionChatMessage[]) {
  const raw = JSON.stringify(next);
  localStorage.setItem(MESSAGES_KEY, raw);
  messagesRaw = raw;
  myMessagesCache = next;
  hasMyMessagesCache = true;
  notify();
}

export function saveMyReflectionMessage(input: {
  content: string;
  passage: string;
  shareToGroup: boolean;
  dateKey?: string;
}) {
  const dateKey = input.dateKey ?? getTodayKey();
  const trimmed = input.content.trim();
  if (!trimmed) return;

  markReflectionWritten(dateKey);
  storeReflectionForDate({
    dateKey,
    content: trimmed,
    passage: input.passage,
  });

  if (!input.shareToGroup || typeof window === "undefined") {
    return;
  }

  appendChatMessage({
    content: trimmed,
    passage: input.passage,
    kind: "reflection",
  });
}

/** Kirim pesan chat — hanya jika refleksi sudah ada (chat sudah terbuka). */
export function postGroupChatMessage(input: {
  content?: string;
  gifUrl?: string;
}) {
  const trimmed = (input.content ?? "").trim();
  const gifUrl = input.gifUrl?.trim();
  if ((!trimmed && !gifUrl) || typeof window === "undefined") return;
  if (!hasWrittenReflection()) return;

  appendChatMessage({
    content: trimmed || (gifUrl ? "GIF" : ""),
    gifUrl,
    kind: "message",
  });
}

function appendChatMessage(input: {
  content: string;
  passage?: string;
  kind: ChatMessageKind;
  gifUrl?: string;
}) {
  const createdAt = Date.now();
  const message: ReflectionChatMessage = {
    id: `mine-${createdAt}`,
    authorName: demoUser.name,
    content: input.content,
    time: "Baru saja",
    isMine: true,
    passage: input.passage,
    kind: input.kind,
    gifUrl: input.gifUrl,
    createdAt,
  };

  writeMyMessages([...readMyMessages(), message]);
}

/** Soft-delete pesan sendiri — hanya dalam 15 menit setelah dikirim. */
export function deleteOwnChatMessage(id: string): boolean {
  if (typeof window === "undefined") return false;
  const existing = readMyMessages();
  const target = existing.find((item) => item.id === id);
  if (!target || !canDeleteOwnChatMessage(target)) return false;
  return softDeleteOwnChatMessage(id);
}

/** Soft-delete pesan sendiri tanpa batas waktu (mis. hapus dari timeline). */
export function softDeleteOwnChatMessage(id: string): boolean {
  if (typeof window === "undefined") return false;
  const existing = readMyMessages();
  const target = existing.find((item) => item.id === id);
  if (!target || !target.isMine || target.deleted) return false;

  const deletedAt = Date.now();
  writeMyMessages(
    existing.map((item) =>
      item.id === id
        ? {
            ...item,
            deleted: true,
            deletedAt,
            content: "",
            passage: undefined,
            gifUrl: undefined,
          }
        : item,
    ),
  );
  return true;
}

const DEMO_SEED: ReflectionChatMessage[] = demoGroupReflections
  .filter((item) => item.visibility === "group")
  .map((item: GroupReflection, index) => ({
    id: item.id,
    authorName: item.authorName,
    content: item.content,
    time: item.time,
    isMine: false,
    passage: demoTodayReading.passage,
    kind: "reflection" as const,
    /** Waktu relatif agar bisa dihitung sebagai unread. */
    createdAt: Date.parse("2026-07-22T08:00:00.000Z") + index * 600_000,
  }));

/** Snapshot SSR — referensi stabil untuk useSyncExternalStore. */
export function getServerReflectionChatMessages(): ReflectionChatMessage[] {
  return DEMO_SEED;
}

function readChatLastReadAt(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LAST_READ_KEY);
    if (!raw) return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

/** Tandai semua pesan chat sudah dibaca (saat buka halaman chat). */
export function markChatAsRead(at = Date.now()) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LAST_READ_KEY, String(at));
    notify();
  } catch {
    /* ignore */
  }
}

/** Jumlah pesan orang lain yang belum dibaca. */
export function getUnreadChatCount(): number {
  const lastRead = readChatLastReadAt();
  const messages = getReflectionChatMessages();
  const key = `${lastRead ?? "none"}|${messages
    .map((item) => `${item.id}:${item.isMine ? "m" : "o"}:${item.deleted ? "d" : "a"}:${item.createdAt ?? 0}`)
    .join(",")}`;

  if (unreadCountCache != null && unreadCountKey === key) {
    return unreadCountCache;
  }

  const others = messages.filter(
    (item) => !item.isMine && !isDeletedChatMessage(item),
  );

  const count =
    lastRead == null
      ? others.length
      : others.filter((item) => {
          const createdAt = getMessageCreatedAt(item);
          if (createdAt == null) return false;
          return createdAt > lastRead;
        }).length;

  unreadCountKey = key;
  unreadCountCache = count;
  return count;
}

export function getServerUnreadChatCount() {
  if (serverUnreadCountCache != null) return serverUnreadCountCache;
  serverUnreadCountCache = DEMO_SEED.filter((item) => !item.isMine).length;
  return serverUnreadCountCache;
}

/** Pesan chat refleksi kelompok (demo + milik user yang dibagikan). */
export function getReflectionChatMessages(): ReflectionChatMessage[] {
  if (!hasWrittenReflection()) {
    return DEMO_SEED;
  }

  const mine = readMyMessages().filter((item) => item.isMine);
  const key = `open|${mine
    .map((item) => `${item.id}:${item.deleted ? "d" : "a"}`)
    .join("|")}`;
  if (cachedFeed && cachedFeedKey === key) {
    return cachedFeed;
  }

  // Kalau belum ada pesan sendiri, pakai DEMO_SEED apa adanya (referensi stabil).
  cachedFeedKey = key;
  cachedFeed = mine.length === 0 ? DEMO_SEED : [...DEMO_SEED, ...mine];
  return cachedFeed;
}
