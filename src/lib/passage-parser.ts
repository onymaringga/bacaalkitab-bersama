import { resolveBook } from "./bible-books";

export type ParsedPassage = {
  bookName: string;
  bookAbbr: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  reference: string;
  wholeChapter?: boolean;
  /** Jika diisi, bacaan mencakup pasal chapter s/d endChapter. */
  endChapter?: number;
};

const PASSAGE_WITH_VERSE_PATTERN =
  /^(.+?)\s+(\d+)\s*:\s*(\d+)(?:\s*-\s*(\d+))?\s*$/;

const PASSAGE_CHAPTER_RANGE_PATTERN = /^(.+?)\s+(\d+)\s*-\s*(\d+)\s*$/;

const PASSAGE_CHAPTER_ONLY_PATTERN = /^(.+?)\s+(\d+)\s*$/;

export function parsePassage(input: string): ParsedPassage | null {
  const trimmed = input.trim().replace(/[–—]/g, "-");

  const verseMatch = trimmed.match(PASSAGE_WITH_VERSE_PATTERN);
  if (verseMatch) {
    const [, bookPart, chapterPart, startPart, endPart] = verseMatch;
    const book = resolveBook(bookPart.trim());
    if (!book) return null;

    const chapter = Number(chapterPart);
    const startVerse = Number(startPart);
    const endVerse = endPart ? Number(endPart) : startVerse;

    if (
      !Number.isFinite(chapter) ||
      !Number.isFinite(startVerse) ||
      !Number.isFinite(endVerse) ||
      chapter < 1 ||
      startVerse < 1 ||
      endVerse < startVerse
    ) {
      return null;
    }

    return {
      bookName: book.name,
      bookAbbr: book.abbr,
      chapter,
      startVerse,
      endVerse,
      reference: formatPassageReference(book.name, chapter, startVerse, endVerse),
    };
  }

  const chapterRangeMatch = trimmed.match(PASSAGE_CHAPTER_RANGE_PATTERN);
  if (chapterRangeMatch) {
    const [, bookPart, startChapterPart, endChapterPart] = chapterRangeMatch;
    const book = resolveBook(bookPart.trim());
    if (!book) return null;

    const chapter = Number(startChapterPart);
    const endChapter = Number(endChapterPart);
    if (
      !Number.isFinite(chapter) ||
      !Number.isFinite(endChapter) ||
      chapter < 1 ||
      endChapter < chapter
    ) {
      return null;
    }

    return {
      bookName: book.name,
      bookAbbr: book.abbr,
      chapter,
      startVerse: 1,
      endVerse: Number.MAX_SAFE_INTEGER,
      wholeChapter: true,
      endChapter,
      reference:
        endChapter === chapter
          ? `${book.name} ${chapter}`
          : `${book.name} ${chapter}-${endChapter}`,
    };
  }

  const chapterMatch = trimmed.match(PASSAGE_CHAPTER_ONLY_PATTERN);
  if (chapterMatch) {
    const [, bookPart, chapterPart] = chapterMatch;
    const book = resolveBook(bookPart.trim());
    if (!book) return null;

    const chapter = Number(chapterPart);
    if (!Number.isFinite(chapter) || chapter < 1) return null;

    return {
      bookName: book.name,
      bookAbbr: book.abbr,
      chapter,
      startVerse: 1,
      endVerse: Number.MAX_SAFE_INTEGER,
      wholeChapter: true,
      reference: `${book.name} ${chapter}`,
    };
  }

  return null;
}

export function formatPassageReference(
  bookName: string,
  chapter: number,
  startVerse: number,
  endVerse?: number,
  wholeChapter = false,
) {
  if (wholeChapter) return `${bookName} ${chapter}`;
  if (!endVerse || endVerse === startVerse) {
    return `${bookName} ${chapter}:${startVerse}`;
  }
  return `${bookName} ${chapter}:${startVerse}-${endVerse}`;
}

export function buildPassageReference(input: {
  bookName: string;
  bookAbbr: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  wholeChapter?: boolean;
}): ParsedPassage {
  const wholeChapter = input.wholeChapter ?? false;

  return {
    bookName: input.bookName,
    bookAbbr: input.bookAbbr,
    chapter: input.chapter,
    startVerse: wholeChapter ? 1 : input.startVerse,
    endVerse: wholeChapter ? Number.MAX_SAFE_INTEGER : input.endVerse,
    wholeChapter,
    reference: formatPassageReference(
      input.bookName,
      input.chapter,
      input.startVerse,
      input.endVerse,
      wholeChapter,
    ),
  };
}

export function normalizePassageKey(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[–—−]/g, "-")
    .replace(/\s*-\s*/g, "-")
    .replace(/\s+/g, " ");
}
