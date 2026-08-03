import { BIBLE_BOOKS } from "./bible-books";
import { buildPassageReference } from "./passage-parser";

/** Jumlah pasal per kitab (singkatan Beeble/SABDA). */
export const BIBLE_CHAPTER_COUNTS: Record<string, number> = {
  Kej: 50,
  Kel: 40,
  Im: 27,
  Bil: 36,
  Ul: 34,
  Jos: 24,
  Hk: 21,
  Rut: 4,
  "1Sa": 31,
  "2Sa": 24,
  "1Ra": 22,
  "2Ra": 25,
  "1Ta": 29,
  "2Ta": 36,
  Ezr: 10,
  Ne: 13,
  Est: 10,
  Ay: 42,
  Maz: 150,
  Pnh: 31,
  Pkh: 12,
  Kid: 8,
  Yes: 66,
  Yer: 52,
  Rat: 5,
  Yeh: 48,
  Dan: 12,
  Ho: 14,
  Yo: 3,
  Am: 9,
  Ob: 1,
  Yun: 4,
  Mi: 7,
  Na: 3,
  Hab: 3,
  Zef: 3,
  Hag: 2,
  Za: 14,
  Mal: 4,
  Mat: 28,
  Mrk: 16,
  Luk: 24,
  Yoh: 21,
  Kis: 28,
  Rom: 16,
  "1Ko": 16,
  "2Ko": 13,
  Gal: 6,
  Ef: 6,
  Fil: 4,
  Kol: 4,
  "1Te": 5,
  "2Te": 3,
  "1Ti": 6,
  "2Ti": 4,
  Tit: 3,
  Flm: 1,
  Ibr: 13,
  Yaa: 5,
  "1Pe": 5,
  "2Pe": 3,
  "1Yo": 5,
  "2Yo": 1,
  "3Yo": 1,
  Yud: 1,
  Why: 22,
};

/** Perkiraan ayat maksimum per pasal (Mazmur 119 = 176). */
export const MAX_VERSES_PER_CHAPTER = 176;

export type ChapterLocation = {
  bookAbbr: string;
  bookName: string;
  chapter: number;
  reference: string;
};

export function getChapterCount(bookAbbr: string) {
  return BIBLE_CHAPTER_COUNTS[bookAbbr] ?? 1;
}

export function getChapterOptions(bookAbbr: string) {
  const count = getChapterCount(bookAbbr);
  return Array.from({ length: count }, (_, index) => index + 1);
}

export function getVerseOptions(max = MAX_VERSES_PER_CHAPTER) {
  return Array.from({ length: max }, (_, index) => index + 1);
}

function toChapterLocation(bookAbbr: string, chapter: number): ChapterLocation | null {
  const book = BIBLE_BOOKS.find((item) => item.abbr === bookAbbr);
  if (!book) return null;

  const parsed = buildPassageReference({
    bookName: book.name,
    bookAbbr: book.abbr,
    chapter,
    startVerse: 1,
    endVerse: 1,
    wholeChapter: true,
  });

  return {
    bookAbbr: book.abbr,
    bookName: book.name,
    chapter,
    reference: parsed.reference,
  };
}

export function getPreviousChapter(
  bookAbbr: string,
  chapter: number,
): ChapterLocation | null {
  if (chapter > 1) {
    return toChapterLocation(bookAbbr, chapter - 1);
  }

  const bookIndex = BIBLE_BOOKS.findIndex((book) => book.abbr === bookAbbr);
  if (bookIndex <= 0) return null;

  const previousBook = BIBLE_BOOKS[bookIndex - 1];
  return toChapterLocation(previousBook.abbr, getChapterCount(previousBook.abbr));
}

export function getNextChapter(
  bookAbbr: string,
  chapter: number,
): ChapterLocation | null {
  const chapterCount = getChapterCount(bookAbbr);

  if (chapter < chapterCount) {
    return toChapterLocation(bookAbbr, chapter + 1);
  }

  const bookIndex = BIBLE_BOOKS.findIndex((book) => book.abbr === bookAbbr);
  if (bookIndex < 0 || bookIndex >= BIBLE_BOOKS.length - 1) return null;

  const nextBook = BIBLE_BOOKS[bookIndex + 1];
  return toChapterLocation(nextBook.abbr, 1);
}
