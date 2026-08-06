import {
  appendMergedChapterSections,
  sanitizePassageResult,
  type BiblePassageResult,
  type BibleVerse,
  type PassageSection,
} from "@/lib/bible-api";
import { BIBLE_VERSIONS, type BibleVersionCode } from "@/lib/bible-books";
import { parsePassage } from "@/lib/passage-parser";

const memoryCache = new Map<string, BiblePassageResult>();

/** Persist across sessions — sessionStorage hilang saat tab ditutup. */
const LOCAL_KEY = "bacaalkitab-passage-cache-v2";
const LEGACY_SESSION_PREFIX = "bab-passage-cache:";
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 hari

type StoredEntry = {
  savedAt: number;
  data: BiblePassageResult;
};

type StoredMap = Record<string, StoredEntry>;

let storeCache: StoredMap | null = null;
const inFlight = new Map<string, Promise<BiblePassageResult | null>>();
let prefetchRunning = false;

/** Samakan en-dash/em-dash jadi hyphen supaya kunci cache konsisten. */
export function normalizePassageCacheRef(passage: string) {
  return passage
    .trim()
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ");
}

export function passageCacheKey(passage: string, version: string) {
  return `${version}::${normalizePassageCacheRef(passage)}`;
}

function readStore(): StoredMap {
  if (typeof window === "undefined") return {};
  if (storeCache) return storeCache;
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    if (!raw) {
      storeCache = {};
      return storeCache;
    }
    const parsed = JSON.parse(raw) as StoredMap;
    storeCache = parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    storeCache = {};
  }
  return storeCache;
}

function writeStore(next: StoredMap) {
  if (typeof window === "undefined") return;
  storeCache = next;
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
  } catch {
    // Quota penuh: buang entri paling lama lalu coba lagi
    const entries = Object.entries(next).sort(
      (a, b) => a[1].savedAt - b[1].savedAt,
    );
    const trimmed = Object.fromEntries(entries.slice(Math.floor(entries.length / 3)));
    storeCache = trimmed;
    try {
      window.localStorage.setItem(LOCAL_KEY, JSON.stringify(trimmed));
    } catch {
      /* ignore */
    }
  }
}

function migrateLegacySessionEntry(
  passage: string,
  version: string,
): BiblePassageResult | null {
  if (typeof window === "undefined") return null;
  const key = passageCacheKey(passage, version);
  try {
    const raw = window.sessionStorage.getItem(LEGACY_SESSION_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BiblePassageResult;
    setCachedPassage(passage, version, parsed);
    window.sessionStorage.removeItem(LEGACY_SESSION_PREFIX + key);
    return parsed;
  } catch {
    return null;
  }
}

export function getCachedPassage(
  passage: string,
  version: string,
): BiblePassageResult | null {
  const key = passageCacheKey(passage, version);
  const fromMemory = memoryCache.get(key);
  if (fromMemory) return sanitizePassageResult(fromMemory);

  if (typeof window === "undefined") return null;

  const store = readStore();
  const entry = store[key];
  if (entry?.data) {
    const age = Date.now() - (entry.savedAt || 0);
    if (age <= CACHE_TTL_MS) {
      const cleaned = sanitizePassageResult(entry.data);
      memoryCache.set(key, cleaned);
      return cleaned;
    }
  }

  const legacy = migrateLegacySessionEntry(passage, version);
  if (legacy) {
    const cleaned = sanitizePassageResult(legacy);
    memoryCache.set(key, cleaned);
    return cleaned;
  }

  return null;
}

export function setCachedPassage(
  passage: string,
  version: string,
  data: BiblePassageResult,
) {
  const cleaned = sanitizePassageResult(data);
  const key = passageCacheKey(passage, version);
  memoryCache.set(key, cleaned);
  if (typeof window === "undefined") return;

  const store = readStore();
  writeStore({
    ...store,
    [key]: { savedAt: Date.now(), data: cleaned },
  });
}

export function getPassageCacheStats() {
  if (typeof window === "undefined") {
    return { count: 0, bytesApprox: 0 };
  }
  const store = readStore();
  const raw = window.localStorage.getItem(LOCAL_KEY) ?? "";
  return {
    count: Object.keys(store).length,
    bytesApprox: raw.length,
  };
}

/**
 * Ambil dari cache, termasuk menyusun rentang pasal (mis. "Kejadian 37-38")
 * dari pasal tunggal yang sudah diunduh ("Kejadian 37" + "Kejadian 38").
 */
export function resolveCachedPassage(
  passage: string,
  version: string,
): BiblePassageResult | null {
  const direct = getCachedPassage(passage, version);
  if (direct) return direct;

  const parsed = parsePassage(passage.replace(/[–—]/g, "-"));
  if (!parsed) return null;

  const endChapter = parsed.endChapter ?? parsed.chapter;
  if (endChapter <= parsed.chapter) {
    if (parsed.wholeChapter) {
      const single = `${parsed.bookName} ${parsed.chapter}`;
      if (
        normalizePassageCacheRef(single) !== normalizePassageCacheRef(passage)
      ) {
        return getCachedPassage(single, version);
      }
    }
    return null;
  }

  const chapterResults: BiblePassageResult[] = [];
  for (let chapter = parsed.chapter; chapter <= endChapter; chapter += 1) {
    const cached = getCachedPassage(`${parsed.bookName} ${chapter}`, version);
    if (!cached) return null;
    chapterResults.push(cached);
  }

  const merged = mergeCachedChapterPassages(
    parsed.reference,
    version,
    parsed.bookName,
    parsed.chapter,
    chapterResults,
  );
  setCachedPassage(passage, version, merged);
  return merged;
}

function mergeCachedChapterPassages(
  reference: string,
  version: string,
  book: string,
  startChapter: number,
  chapters: BiblePassageResult[],
): BiblePassageResult {
  const verses: BibleVerse[] = [];
  const sections: PassageSection[] = [];
  let source: "api" | "fallback" = "api";

  for (const chapter of chapters) {
    if (chapter.source === "fallback") source = "fallback";
    const cleaned = sanitizePassageResult(chapter);
    appendMergedChapterSections(
      sections,
      cleaned,
      book,
      chapter.chapter,
      true,
    );
    verses.push(...cleaned.verses);
  }

  const versionCode = (
    version in BIBLE_VERSIONS ? version : "tb"
  ) as BibleVersionCode;

  return sanitizePassageResult({
    reference,
    version: versionCode,
    versionName: BIBLE_VERSIONS[versionCode],
    book,
    chapter: startChapter,
    sections,
    verses,
    source,
  });
}

async function fetchAndCachePassage(
  passage: string,
  version: string,
): Promise<BiblePassageResult | null> {
  const key = passageCacheKey(passage, version);
  const existing = inFlight.get(key);
  if (existing) return existing;

  const task = (async () => {
    try {
      const response = await fetch(
        `/api/bible/passage?passage=${encodeURIComponent(passage)}&ver=${version}`,
      );
      if (!response.ok) return null;
      const payload = (await response.json()) as
        | BiblePassageResult
        | { error: string };
      if ("error" in payload) return null;
      setCachedPassage(passage, version, payload);
      return payload;
    } catch {
      return null;
    } finally {
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, task);
  return task;
}

/** Ambil pasal dari cache atau fetch API (client). */
export async function loadPassageClient(
  passage: string,
  version: string,
): Promise<BiblePassageResult | null> {
  const cached = resolveCachedPassage(passage, version);
  if (cached) return cached;
  return fetchAndCachePassage(passage, version);
}

export function prefetchPassage(passage: string, version: string) {
  if (typeof window === "undefined") return;
  if (!passage || passage === "Belum dijadwalkan") return;
  if (resolveCachedPassage(passage, version)) return;

  // Prefetch rentang → unduh per pasal supaya selaras dengan unduhan kitab
  const parsed = parsePassage(passage.replace(/[–—]/g, "-"));
  if (parsed?.endChapter && parsed.endChapter > parsed.chapter) {
    for (let chapter = parsed.chapter; chapter <= parsed.endChapter; chapter += 1) {
      const single = `${parsed.bookName} ${chapter}`;
      if (!getCachedPassage(single, version)) {
        void fetchAndCachePassage(single, version);
      }
    }
    return;
  }

  void fetchAndCachePassage(passage, version);
}

/**
 * Unduh beberapa pasal berurutan (concurrency terbatas) ke cache lokal.
 * Dipakai untuk bacaan jadwal supaya buka Alkitab lebih cepat offline/lambat jaringan.
 */
export async function prefetchPassages(
  passages: string[],
  version: string,
  options?: {
    concurrency?: number;
    onProgress?: (done: number, total: number, current?: string) => void;
    /** Izinkan jalan bersamaan (unduh manual user). */
    force?: boolean;
  },
) {
  if (typeof window === "undefined") return { fetched: 0, skipped: 0 };
  if (prefetchRunning && !options?.force) return { fetched: 0, skipped: 0 };

  const unique = [
    ...new Set(
      passages
        .map((item) => item.trim())
        .filter((item) => item && item !== "Belum dijadwalkan")
        .flatMap((item) => expandPassageToChapterRefs(item)),
    ),
  ];
  const pending = unique.filter((passage) => !getCachedPassage(passage, version));
  const skipped = unique.length - pending.length;
  if (pending.length === 0) {
    options?.onProgress?.(unique.length, unique.length);
    return { fetched: 0, skipped };
  }

  const ownLock = !prefetchRunning;
  if (ownLock) prefetchRunning = true;
  const concurrency = Math.max(1, Math.min(options?.concurrency ?? 2, 3));
  let done = skipped;
  let fetched = 0;

  try {
    let index = 0;
    async function worker() {
      while (index < pending.length) {
        const current = pending[index];
        index += 1;
        options?.onProgress?.(done, unique.length, current);
        const result = await fetchAndCachePassage(current, version);
        if (result) fetched += 1;
        done += 1;
        options?.onProgress?.(done, unique.length, current);
      }
    }
    await Promise.all(
      Array.from({ length: Math.min(concurrency, pending.length) }, () =>
        worker(),
      ),
    );
  } finally {
    if (ownLock) prefetchRunning = false;
  }

  return { fetched, skipped };
}

/** Pecah "Kejadian 37-38" jadi ["Kejadian 37", "Kejadian 38"]. */
export function expandPassageToChapterRefs(passage: string): string[] {
  const parsed = parsePassage(passage.replace(/[–—]/g, "-"));
  if (!parsed) return [passage];
  const end = parsed.endChapter ?? parsed.chapter;
  if (end <= parsed.chapter) {
    return parsed.wholeChapter
      ? [`${parsed.bookName} ${parsed.chapter}`]
      : [parsed.reference];
  }
  const refs: string[] = [];
  for (let chapter = parsed.chapter; chapter <= end; chapter += 1) {
    refs.push(`${parsed.bookName} ${chapter}`);
  }
  return refs;
}

/** Prefetch bacaan jadwal program (Genesis Juli, dll.). */
export async function prefetchSchedulePassages(
  version: string,
  passages: string[],
) {
  return prefetchPassages(passages, version, { concurrency: 2 });
}
