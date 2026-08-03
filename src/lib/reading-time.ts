/** Estimasi waktu baca Alkitab (kata ÷ WPM). */

import { parsePassage } from "@/lib/passage-parser";

/**
 * Tempo baca Firman lebih pelan dari artikel (Medium ~200–265).
 * ~130 WPM mendekati baca + sedikit merenung.
 */
const WORDS_PER_MINUTE = 130;

/** Rata-rata kasar jika teks penuh belum dimuat. */
const WORDS_PER_VERSE_ESTIMATE = 20;
const VERSES_PER_CHAPTER_ESTIMATE = 26;

export function countWords(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export function estimateReadingMinutes(wordCount: number) {
  if (wordCount <= 0) return 0;
  // ceil: lebih aman sedikit lebih lama daripada terlalu pendek
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

/** Label singkat: "1 mnt baca", "5 mnt baca". */
export function formatReadingTimeLabel(minutes: number) {
  if (minutes <= 0) return "";
  return `${minutes} mnt baca`;
}

export function readingTimeFromTexts(texts: Iterable<string>) {
  let words = 0;
  for (const text of texts) {
    words += countWords(text);
  }
  return formatReadingTimeLabel(estimateReadingMinutes(words));
}

export function readingTimeFromWordCount(wordCount: number) {
  return formatReadingTimeLabel(estimateReadingMinutes(wordCount));
}

/** Estimasi dari jumlah ayat (saat teks belum tersedia). */
export function readingTimeFromVerseCount(verseCount: number) {
  if (verseCount <= 0) return "";
  return readingTimeFromWordCount(verseCount * WORDS_PER_VERSE_ESTIMATE);
}

/** Estimasi dari jumlah pasal. */
export function readingTimeFromChapterCount(chapterCount: number) {
  if (chapterCount <= 0) return "";
  return readingTimeFromVerseCount(
    chapterCount * VERSES_PER_CHAPTER_ESTIMATE,
  );
}

/** Estimasi dari label bacaan (mis. "Kejadian 37–38") tanpa muat teks. */
export function estimateReadingTimeForPassage(passage: string) {
  const trimmed = passage.trim();
  if (!trimmed || trimmed === "Belum dijadwalkan") return "";

  const parsed = parsePassage(trimmed);
  if (!parsed) return readingTimeFromChapterCount(1);

  if (parsed.endChapter && parsed.endChapter > parsed.chapter) {
    return readingTimeFromChapterCount(
      parsed.endChapter - parsed.chapter + 1,
    );
  }

  if (parsed.wholeChapter) {
    return readingTimeFromChapterCount(1);
  }

  const verseCount = Math.max(1, parsed.endVerse - parsed.startVerse + 1);
  return readingTimeFromVerseCount(verseCount);
}
