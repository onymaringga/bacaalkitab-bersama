import { BIBLE_BOOKS } from "./bible-books";
import { getChapterCount } from "./bible-chapters";
import { parsePassage } from "./passage-parser";

const STORAGE_KEY = "bacaalkitab-opened-chapters";

/** bookAbbr → daftar nomor pasal yang sudah dibuka */
type OpenedMap = Record<string, number[]>;

let cachedRaw: string | null = null;
let cachedMap: OpenedMap = {};
let hasCache = false;

function readMap(): OpenedMap {
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
    const parsed = JSON.parse(raw) as OpenedMap;
    cachedMap = parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    cachedMap = {};
  }
  return cachedMap;
}

function writeMap(next: OpenedMap) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(next);
  window.localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedMap = next;
  hasCache = true;
  window.dispatchEvent(new Event("bible-opened-updated"));
}

export function subscribeOpenedChapters(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const wrapped = () => {
    hasCache = false;
    onChange();
  };
  window.addEventListener("bible-opened-updated", wrapped);
  window.addEventListener("storage", wrapped);
  return () => {
    window.removeEventListener("bible-opened-updated", wrapped);
    window.removeEventListener("storage", wrapped);
  };
}

export function getOpenedChapters(bookAbbr: string): number[] {
  const list = readMap()[bookAbbr] ?? [];
  return [...list].sort((a, b) => a - b);
}

export function isChapterOpened(bookAbbr: string, chapter: number) {
  return (readMap()[bookAbbr] ?? []).includes(chapter);
}

export function markChapterOpened(bookAbbr: string, chapter: number) {
  if (!bookAbbr || !Number.isFinite(chapter) || chapter < 1) return;
  const max = getChapterCount(bookAbbr);
  if (chapter > max) return;

  const map = { ...readMap() };
  const current = new Set(map[bookAbbr] ?? []);
  if (current.has(chapter)) return;
  current.add(chapter);
  map[bookAbbr] = [...current].sort((a, b) => a - b);
  writeMap(map);
}

export function markPassageOpened(reference: string) {
  const parsed = parsePassage(reference);
  if (!parsed) return;
  markChapterOpened(parsed.bookAbbr, parsed.chapter);
  if (parsed.endChapter && parsed.endChapter > parsed.chapter) {
    for (let c = parsed.chapter + 1; c <= parsed.endChapter; c += 1) {
      markChapterOpened(parsed.bookAbbr, c);
    }
  }
  rememberLastOpenedPassage(
    parsed.wholeChapter && !parsed.endChapter
      ? `${parsed.bookName} ${parsed.chapter}`
      : parsed.reference,
  );
}

const LAST_PASSAGE_KEY = "bacaalkitab-last-opened-passage";

export function rememberLastOpenedPassage(reference: string) {
  if (typeof window === "undefined") return;
  const trimmed = reference.trim();
  if (!trimmed || !parsePassage(trimmed)) return;
  try {
    window.localStorage.setItem(LAST_PASSAGE_KEY, trimmed);
  } catch {
    /* ignore */
  }
}

export function readLastOpenedPassage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LAST_PASSAGE_KEY)?.trim();
    if (!raw) return null;
    return parsePassage(raw) ? raw : null;
  } catch {
    return null;
  }
}

export type BookOpenProgress = {
  bookAbbr: string;
  bookName: string;
  opened: number;
  total: number;
  percent: number;
  openedChapters: number[];
};

export function getBookOpenProgress(bookAbbr: string): BookOpenProgress {
  const book = BIBLE_BOOKS.find((item) => item.abbr === bookAbbr);
  const total = getChapterCount(bookAbbr);
  const openedChapters = getOpenedChapters(bookAbbr);
  const opened = openedChapters.length;
  return {
    bookAbbr,
    bookName: book?.name ?? bookAbbr,
    opened,
    total,
    percent: total > 0 ? Math.round((opened / total) * 100) : 0,
    openedChapters,
  };
}

export function getAllBooksOpenProgress(): BookOpenProgress[] {
  return BIBLE_BOOKS.map((book) => getBookOpenProgress(book.abbr));
}

/** Snapshot stabil untuk useSyncExternalStore getServerSnapshot */
const EMPTY_PROGRESS: BookOpenProgress[] = BIBLE_BOOKS.map((book) => ({
  bookAbbr: book.abbr,
  bookName: book.name,
  opened: 0,
  total: getChapterCount(book.abbr),
  percent: 0,
  openedChapters: [],
}));

let progressCacheKey = "";
let progressCache: BookOpenProgress[] = EMPTY_PROGRESS;

export function getAllBooksOpenProgressCached(): BookOpenProgress[] {
  const map = readMap();
  const key = JSON.stringify(map);
  if (key === progressCacheKey) return progressCache;
  progressCacheKey = key;
  progressCache = getAllBooksOpenProgress();
  return progressCache;
}

export function getServerBooksOpenProgress() {
  return EMPTY_PROGRESS;
}
