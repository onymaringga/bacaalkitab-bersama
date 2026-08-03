/** Pecah ayat jadi halaman kertas berdasarkan kapasitas teks & ukuran layar. */

import type { BiblePassageResult } from "@/lib/bible-api";
import { chapterFromSectionTitle } from "@/lib/bible-compare";

export type PaperVerse = {
  verse: number;
  endVerse?: number;
  content: string;
  chapter?: number;
};

/** Ubah hasil API jadi daftar ayat untuk kertas fullscreen. */
export function passageResultToPaperVerses(
  data: BiblePassageResult | null | undefined,
): PaperVerse[] {
  if (!data) return [];
  if (data.sections && data.sections.length > 0) {
    return data.sections.flatMap((section) => {
      const sectionChapter = chapterFromSectionTitle(
        section.title,
        data.book,
        data.chapter,
      );
      return section.verses
        .filter((verse) => verse.type !== "title")
        .map((verse) => ({
          verse: verse.verse,
          endVerse: verse.endVerse,
          content: verse.content,
          chapter: sectionChapter,
        }));
    });
  }
  return data.verses
    .filter((verse) => verse.type !== "title")
    .map((verse) => ({
      verse: verse.verse,
      endVerse: verse.endVerse,
      content: verse.content,
      chapter: data.chapter,
    }));
}

/** Ambil ayat di sisi kanan yang cocok dengan rentang halaman kiri. */
export function matchPaperVersesByRefs(
  source: PaperVerse[],
  refs: PaperVerse[],
): PaperVerse[] {
  if (refs.length === 0) return [];
  const keys = new Set(
    refs.map((item) => `${item.chapter ?? 0}:${item.verse}`),
  );
  return source.filter((item) => keys.has(`${item.chapter ?? 0}:${item.verse}`));
}

export type PaperPage = {
  id: string;
  verses: PaperVerse[];
};

export type PaperPageSize = {
  width: number;
  height: number;
};

/** Fallback kalau ukuran halaman tidak diketahui. */
const CHARS_PER_PAGE_FALLBACK: Record<string, number> = {
  sm: 1600,
  md: 1350,
  lg: 1100,
  xl: 900,
  xxl: 720,
};

/**
 * Estimasi kapasitas karakter dari area halaman yang bisa dipakai.
 * Fullscreen → lebih banyak ayat per halaman (sedikit space kosong).
 */
export function estimateCharsPerPaperPage(
  fontSizeId: string,
  size?: PaperPageSize | null,
): number {
  if (!size || size.width < 200 || size.height < 200) {
    return CHARS_PER_PAGE_FALLBACK[fontSizeId] ?? 1350;
  }

  const fontPx =
    (
      {
        sm: 16,
        md: 18,
        lg: 21,
        xl: 24,
        xxl: 28,
      } as Record<string, number>
    )[fontSizeId] ?? 18;

  // Header + padding kertas
  const usableW = Math.max(240, size.width - 96);
  const usableH = Math.max(280, size.height - 150);
  const lineHeight = fontPx * 1.55;
  const charsPerLine = Math.max(28, Math.floor(usableW / (fontPx * 0.52)));
  const lines = Math.max(8, Math.floor(usableH / lineHeight));
  // 0.9 = sedikit ruang napas; jangan overflow ke bawah
  const budget = Math.round(charsPerLine * lines * 0.9);

  return Math.max(700, Math.min(4000, budget));
}

export function paginateVersesForPaper(
  verses: PaperVerse[],
  fontSizeId: string,
  pageSize?: PaperPageSize | null,
): PaperPage[] {
  if (verses.length === 0) {
    return [{ id: "empty", verses: [] }];
  }

  const budget = estimateCharsPerPaperPage(fontSizeId, pageSize);
  const pages: PaperPage[] = [];
  let current: PaperVerse[] = [];
  let used = 0;

  for (const item of verses) {
    const weight = Math.max(20, item.content.length + 6);
    if (current.length > 0 && used + weight > budget) {
      pages.push({
        id: `p-${pages.length}-${current[0]!.verse}`,
        verses: current,
      });
      current = [];
      used = 0;
    }
    current.push(item);
    used += weight;
  }

  if (current.length > 0) {
    pages.push({
      id: `p-${pages.length}-${current[0]!.verse}`,
      verses: current,
    });
  }

  return pages;
}
