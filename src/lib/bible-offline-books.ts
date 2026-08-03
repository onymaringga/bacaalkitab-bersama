import {
  BIBLE_BOOKS,
  getNewTestamentBooks,
  getOldTestamentBooks,
  type BibleBook,
  type BibleVersionCode,
} from "@/lib/bible-books";
import { getChapterCount } from "@/lib/bible-chapters";
import {
  getCachedPassage,
  getPassageCacheStats,
  prefetchPassages,
} from "@/lib/bible-passage-cache";

export function getBookChapterPassages(book: BibleBook): string[] {
  const count = getChapterCount(book.abbr);
  return Array.from({ length: count }, (_, index) => `${book.name} ${index + 1}`);
}

export function countCachedBookChapters(
  book: BibleBook,
  version: BibleVersionCode,
): { cached: number; total: number } {
  const passages = getBookChapterPassages(book);
  const cached = passages.filter((passage) =>
    Boolean(getCachedPassage(passage, version)),
  ).length;
  return { cached, total: passages.length };
}

export function isBookFullyCached(
  book: BibleBook,
  version: BibleVersionCode,
): boolean {
  const { cached, total } = countCachedBookChapters(book, version);
  return total > 0 && cached >= total;
}

export function buildPassagesForBooks(bookAbbrs: string[]): string[] {
  const passages: string[] = [];
  for (const abbr of bookAbbrs) {
    const book = BIBLE_BOOKS.find((item) => item.abbr === abbr);
    if (!book) continue;
    passages.push(...getBookChapterPassages(book));
  }
  return passages;
}

export function estimateChapterCount(bookAbbrs: string[]): number {
  return bookAbbrs.reduce((sum, abbr) => sum + getChapterCount(abbr), 0);
}

/** Pasal yang belum ada di cache untuk kitab terpilih. */
export function countPendingChapters(
  bookAbbrs: string[],
  version: BibleVersionCode,
): { pending: number; alreadyCached: number; total: number } {
  const passages = buildPassagesForBooks(bookAbbrs);
  let alreadyCached = 0;
  for (const passage of passages) {
    if (getCachedPassage(passage, version)) alreadyCached += 1;
  }
  return {
    pending: passages.length - alreadyCached,
    alreadyCached,
    total: passages.length,
  };
}

/** Estimasi kasar ukuran unduhan dari rata-rata cache yang ada. */
export function estimateDownloadBytes(pendingChapters: number): number {
  const stats = getPassageCacheStats();
  const avg =
    stats.count > 0 ? stats.bytesApprox / stats.count : 12_000; // ~12KB fallback
  return Math.round(avg * pendingChapters);
}

export function formatCacheBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getOfflineCacheSummary() {
  const stats = getPassageCacheStats();
  return {
    ...stats,
    label: formatCacheBytes(stats.bytesApprox),
  };
}

/** Unduh pasal-pasal kitab ke cache lokal (skip yang sudah ada). */
export async function downloadBibleBooks(
  bookAbbrs: string[],
  version: BibleVersionCode,
  options?: {
    concurrency?: number;
    onProgress?: (done: number, total: number, current?: string) => void;
  },
) {
  const passages = buildPassagesForBooks(bookAbbrs);
  return prefetchPassages(passages, version, {
    concurrency: options?.concurrency ?? 2,
    onProgress: options?.onProgress,
    force: true,
  });
}

export const QUICK_DOWNLOAD_SETS: {
  id: string;
  label: string;
  bookAbbrs: string[];
}[] = [
  {
    id: "injil",
    label: "4 Injil",
    bookAbbrs: ["Mat", "Mrk", "Luk", "Yoh"],
  },
  {
    id: "kejadian",
    label: "Kejadian",
    bookAbbrs: ["Kej"],
  },
  {
    id: "mazmur",
    label: "Mazmur",
    bookAbbrs: ["Maz"],
  },
  {
    id: "pb",
    label: "Perjanjian Baru",
    bookAbbrs: getNewTestamentBooks().map((book) => book.abbr),
  },
];

export { getOldTestamentBooks, getNewTestamentBooks, BIBLE_BOOKS };
