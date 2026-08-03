"use client";

import { normalizePassageKey } from "@/lib/passage-parser";

const NOTES_KEY = "bacaalkitab-chapter-notes";

export type ChapterNoteRecord = {
  content: string;
  updatedAt: string;
};

export type ChapterNoteListItem = {
  reference: string;
  content: string;
  updatedAt: string;
};

type NotesMap = Record<string, ChapterNoteRecord>;

const EMPTY_MAP: NotesMap = {};
export const EMPTY_CHAPTER_NOTES: ChapterNoteListItem[] = [];

let cachedRaw: string | null = null;
let cachedMap: NotesMap = EMPTY_MAP;
let hasCache = false;

let listCacheRaw: string | null = null;
let listCache: ChapterNoteListItem[] = EMPTY_CHAPTER_NOTES;

function readMap(): NotesMap {
  if (typeof window === "undefined") return EMPTY_MAP;
  const raw = window.localStorage.getItem(NOTES_KEY);
  if (hasCache && raw === cachedRaw) return cachedMap;
  cachedRaw = raw;
  hasCache = true;
  listCacheRaw = null;
  if (!raw) {
    cachedMap = EMPTY_MAP;
    return cachedMap;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    cachedMap =
      parsed && typeof parsed === "object" ? (parsed as NotesMap) : EMPTY_MAP;
  } catch {
    cachedMap = EMPTY_MAP;
  }
  return cachedMap;
}

function writeMap(map: NotesMap) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(map);
  window.localStorage.setItem(NOTES_KEY, raw);
  cachedRaw = raw;
  cachedMap = map;
  hasCache = true;
  listCacheRaw = null;
  window.dispatchEvent(new Event("bible-chapter-notes-updated"));
}

export function makeChapterNoteKey(reference: string) {
  return normalizePassageKey(reference);
}

export function readChapterNote(reference: string): ChapterNoteRecord | null {
  const map = readMap();
  return map[makeChapterNoteKey(reference)] ?? null;
}

/** Snapshot string stabil untuk useSyncExternalStore. */
export function getChapterNoteSnapshot(reference: string): string {
  const note = readChapterNote(reference);
  if (!note) return "";
  return `${note.updatedAt}\n${note.content}`;
}

export function parseChapterNoteSnapshot(
  snapshot: string,
): ChapterNoteRecord | null {
  if (!snapshot) return null;
  const split = snapshot.indexOf("\n");
  if (split < 0) return null;
  return {
    updatedAt: snapshot.slice(0, split),
    content: snapshot.slice(split + 1),
  };
}

export function saveChapterNote(reference: string, content: string) {
  const map = { ...readMap() };
  map[makeChapterNoteKey(reference)] = {
    content,
    updatedAt: new Date().toISOString(),
  };
  writeMap(map);
}

export function clearChapterNote(reference: string) {
  const map = { ...readMap() };
  delete map[makeChapterNoteKey(reference)];
  writeMap(map);
}

export function subscribeChapterNotes(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const wrapped = () => {
    hasCache = false;
    listCacheRaw = null;
    onChange();
  };
  window.addEventListener("bible-chapter-notes-updated", wrapped);
  window.addEventListener("storage", wrapped);
  return () => {
    window.removeEventListener("bible-chapter-notes-updated", wrapped);
    window.removeEventListener("storage", wrapped);
  };
}

export function listChapterNotes(): ChapterNoteListItem[] {
  const map = readMap();
  const raw = cachedRaw ?? "";
  if (listCacheRaw === raw) return listCache;

  const next = Object.entries(map)
    .map(([reference, note]) => ({
      reference,
      content: note.content,
      updatedAt: note.updatedAt,
    }))
    .filter((item) => item.content.trim().length > 0)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

  listCacheRaw = raw;
  listCache = next.length === 0 ? EMPTY_CHAPTER_NOTES : next;
  return listCache;
}

export function getServerChapterNotes(): ChapterNoteListItem[] {
  return EMPTY_CHAPTER_NOTES;
}
