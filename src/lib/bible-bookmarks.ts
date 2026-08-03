"use client";

export type BibleBookmark = {
  id: string;
  /** Key yang sama dengan highlight: `passage::version` */
  passageKey: string;
  /** Label tampilan, mis. "Kejadian 36" */
  passageLabel: string;
  verse: number;
  /** Ayat akhir jika bookmark mencakup lebih dari satu ayat */
  endVerse?: number;
  text: string;
  createdAt: number;
};

const STORAGE_KEY = "bacaalkitab-verse-bookmarks";
const EVENT = "bible-bookmarks-updated";

export const EMPTY_BOOKMARKS: BibleBookmark[] = [];

let cachedRaw: string | null = null;
let cachedAll: BibleBookmark[] = EMPTY_BOOKMARKS;
let hasCache = false;
let allListCacheRaw: string | null = null;
let allListCache: BibleBookmark[] = EMPTY_BOOKMARKS;

const passageCache = new Map<string, BibleBookmark[]>();

function readAll(): BibleBookmark[] {
  if (typeof window === "undefined") return EMPTY_BOOKMARKS;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (hasCache && raw === cachedRaw) return cachedAll;
  cachedRaw = raw;
  hasCache = true;
  if (!raw) {
    cachedAll = EMPTY_BOOKMARKS;
    return cachedAll;
  }
  try {
    const parsed = JSON.parse(raw) as BibleBookmark[];
    cachedAll = Array.isArray(parsed) ? parsed : EMPTY_BOOKMARKS;
  } catch {
    cachedAll = EMPTY_BOOKMARKS;
  }
  return cachedAll;
}

function writeAll(next: BibleBookmark[]) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(next);
  window.localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedAll = next.length === 0 ? EMPTY_BOOKMARKS : next;
  hasCache = true;
  passageCache.clear();
  allListCacheRaw = null;
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeBibleBookmarks(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const wrapped = () => {
    hasCache = false;
    passageCache.clear();
    allListCacheRaw = null;
    onChange();
  };
  window.addEventListener(EVENT, wrapped);
  window.addEventListener("storage", wrapped);
  return () => {
    window.removeEventListener(EVENT, wrapped);
    window.removeEventListener("storage", wrapped);
  };
}

export function getBookmarksForPassage(passageKey: string): BibleBookmark[] {
  const cached = passageCache.get(passageKey);
  if (cached) return cached;
  const filtered = readAll()
    .filter((item) => item.passageKey === passageKey)
    .sort((a, b) => a.verse - b.verse || b.createdAt - a.createdAt);
  const result = filtered.length === 0 ? EMPTY_BOOKMARKS : filtered;
  passageCache.set(passageKey, result);
  return result;
}

export function getAllBibleBookmarks(): BibleBookmark[] {
  const all = readAll();
  const raw = cachedRaw ?? "";
  if (allListCacheRaw === raw) return allListCache;
  const sorted = [...all].sort((a, b) => b.createdAt - a.createdAt);
  allListCacheRaw = raw;
  allListCache = sorted.length === 0 ? EMPTY_BOOKMARKS : sorted;
  return allListCache;
}

export function getServerBibleBookmarks(): BibleBookmark[] {
  return EMPTY_BOOKMARKS;
}

export function isVerseBookmarked(passageKey: string, verse: number) {
  return getBookmarksCoveringVerse(passageKey, verse).length > 0;
}

/** Bookmark yang mencakup nomor ayat tertentu. */
export function getBookmarksCoveringVerse(passageKey: string, verse: number) {
  return getBookmarksForPassage(passageKey).filter(
    (item) =>
      verse >= item.verse && verse <= (item.endVerse ?? item.verse),
  );
}

export function addBibleBookmark(input: {
  passageKey: string;
  passageLabel: string;
  verse: number;
  endVerse?: number;
  text: string;
}): BibleBookmark {
  const text = input.text.trim();
  const bookmark: BibleBookmark = {
    id: `bm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    passageKey: input.passageKey,
    passageLabel: input.passageLabel.trim(),
    verse: input.verse,
    endVerse:
      input.endVerse && input.endVerse > input.verse
        ? input.endVerse
        : undefined,
    text: text.slice(0, 2000),
    createdAt: Date.now(),
  };

  // Hindari duplikat persis (ayat + teks sama di pasal yang sama)
  const existing = readAll().filter(
    (item) =>
      !(
        item.passageKey === bookmark.passageKey &&
        item.verse === bookmark.verse &&
        (item.endVerse ?? item.verse) ===
          (bookmark.endVerse ?? bookmark.verse) &&
        item.text === bookmark.text
      ),
  );
  writeAll([bookmark, ...existing]);
  return bookmark;
}

export function removeBibleBookmark(id: string) {
  writeAll(readAll().filter((item) => item.id !== id));
}

export function removeBookmarksForVerses(
  passageKey: string,
  verses: number[],
) {
  const verseSet = new Set(verses);
  writeAll(
    readAll().filter(
      (item) =>
        item.passageKey !== passageKey ||
        !verseSet.has(item.verse),
    ),
  );
}

export function formatBookmarkReference(bookmark: BibleBookmark) {
  const end = bookmark.endVerse ?? bookmark.verse;
  if (end === bookmark.verse) {
    return `${bookmark.passageLabel}:${bookmark.verse}`;
  }
  return `${bookmark.passageLabel}:${bookmark.verse}–${end}`;
}
