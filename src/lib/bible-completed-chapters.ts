"use client";

import { getChapterCount } from "./bible-chapters";
import { markChapterOpened } from "./bible-opened-chapters";
import { parsePassage } from "./passage-parser";

const STORAGE_KEY = "bacaalkitab-completed-chapters";

/** bookAbbr → daftar nomor pasal yang ditandai selesai */
type CompletedMap = Record<string, number[]>;

let cachedRaw: string | null = null;
let cachedMap: CompletedMap = {};
let hasCache = false;

function readMap(): CompletedMap {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (hasCache && raw === cachedRaw) return cachedMap;
  cachedRaw = raw;
  hasCache = true;
  if (!raw) {
    cachedMap = {};
    return cachedMap;
  }
  try {
    const parsed = JSON.parse(raw) as CompletedMap;
    cachedMap = parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    cachedMap = {};
  }
  return cachedMap;
}

function writeMap(next: CompletedMap) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(next);
  window.localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedMap = next;
  hasCache = true;
  window.dispatchEvent(new Event("bible-completed-updated"));
}

export function subscribeCompletedChapters(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const wrapped = () => {
    hasCache = false;
    onChange();
  };
  window.addEventListener("bible-completed-updated", wrapped);
  window.addEventListener("storage", wrapped);
  return () => {
    window.removeEventListener("bible-completed-updated", wrapped);
    window.removeEventListener("storage", wrapped);
  };
}

export function getCompletedChapters(bookAbbr: string): number[] {
  const list = readMap()[bookAbbr] ?? [];
  return [...list].sort((a, b) => a - b);
}

export function isChapterComplete(bookAbbr: string, chapter: number) {
  return (readMap()[bookAbbr] ?? []).includes(chapter);
}

export function markChapterComplete(bookAbbr: string, chapter: number) {
  if (!bookAbbr || !Number.isFinite(chapter) || chapter < 1) return;
  const max = getChapterCount(bookAbbr);
  if (chapter > max) return;

  const map = { ...readMap() };
  const current = new Set(map[bookAbbr] ?? []);
  if (current.has(chapter)) return;
  current.add(chapter);
  map[bookAbbr] = [...current].sort((a, b) => a - b);
  writeMap(map);
  markChapterOpened(bookAbbr, chapter);
}

export function unmarkChapterComplete(bookAbbr: string, chapter: number) {
  const map = { ...readMap() };
  const current = (map[bookAbbr] ?? []).filter((item) => item !== chapter);
  if (current.length === 0) delete map[bookAbbr];
  else map[bookAbbr] = current;
  writeMap(map);
}

export function isPassageComplete(reference: string) {
  const parsed = parsePassage(reference);
  if (!parsed) return false;
  const end = parsed.endChapter ?? parsed.chapter;
  for (let chapter = parsed.chapter; chapter <= end; chapter += 1) {
    if (!isChapterComplete(parsed.bookAbbr, chapter)) return false;
  }
  return true;
}

export function markPassageComplete(reference: string) {
  const parsed = parsePassage(reference);
  if (!parsed) return;
  const end = parsed.endChapter ?? parsed.chapter;
  for (let chapter = parsed.chapter; chapter <= end; chapter += 1) {
    markChapterComplete(parsed.bookAbbr, chapter);
  }
}

export function unmarkPassageComplete(reference: string) {
  const parsed = parsePassage(reference);
  if (!parsed) return;
  const end = parsed.endChapter ?? parsed.chapter;
  for (let chapter = parsed.chapter; chapter <= end; chapter += 1) {
    unmarkChapterComplete(parsed.bookAbbr, chapter);
  }
}

export function getCompletedChaptersSnapshot() {
  return JSON.stringify(readMap());
}

export function getServerCompletedChaptersSnapshot() {
  return "{}";
}

/** Total pasal yang ditandai selesai di semua kitab. */
export function getTotalCompletedChapterCount() {
  return Object.values(readMap()).reduce((sum, chapters) => sum + chapters.length, 0);
}

/** Jumlah kitab yang punya minimal 1 pasal selesai. */
export function getBooksWithCompletedChapterCount() {
  return Object.values(readMap()).filter((chapters) => chapters.length > 0).length;
}
