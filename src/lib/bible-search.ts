import { BIBLE_BOOKS, OLD_TESTAMENT_SIZE, type BibleBook } from "./bible-books";
import { getChapterCount } from "./bible-chapters";
import { parsePassage } from "./passage-parser";
import {
  BIBLE_BOOK_MATCH_MIN_SCORE,
  normalizeSearch,
  scoreBookMatch,
} from "./search-utils";

export type BibleSearchHit = {
  kind: "book" | "chapter";
  bookAbbr: string;
  bookName: string;
  chapter: number;
  label: string;
  subtitle: string;
  reference: string;
};


function testamentLabel(bookAbbr: string) {
  const index = BIBLE_BOOKS.findIndex((book) => book.abbr === bookAbbr);
  return index >= 0 && index < OLD_TESTAMENT_SIZE
    ? "Perjanjian Lama"
    : "Perjanjian Baru";
}

function toChapterHit(
  book: BibleBook,
  chapter: number,
): BibleSearchHit | null {
  const max = getChapterCount(book.abbr);
  if (chapter < 1 || chapter > max) return null;
  const reference = `${book.name} ${chapter}`;
  return {
    kind: "chapter",
    bookAbbr: book.abbr,
    bookName: book.name,
    chapter,
    label: reference,
    subtitle: `${testamentLabel(book.abbr)} · ${max} pasal`,
    reference,
  };
}

function toBookHit(book: BibleBook): BibleSearchHit {
  const max = getChapterCount(book.abbr);
  return {
    kind: "book",
    bookAbbr: book.abbr,
    bookName: book.name,
    chapter: 1,
    label: book.name,
    subtitle: `${testamentLabel(book.abbr)} · ${max} pasal`,
    reference: `${book.name} 1`,
  };
}

/** Cari kitab / pasal dari teks bebas, mis. "Yohanes 3", "Kej", "Mazmur". */
export function searchBible(query: string, limit = 8): BibleSearchHit[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const q = normalizeSearch(trimmed);
  const scored: { hit: BibleSearchHit; score: number }[] = [];
  const seen = new Set<string>();

  function push(hit: BibleSearchHit | null, score: number) {
    if (!hit || score < BIBLE_BOOK_MATCH_MIN_SCORE) return;
    const key = `${hit.bookAbbr}:${hit.chapter}:${hit.kind}`;
    if (seen.has(key)) return;
    seen.add(key);
    scored.push({ hit, score });
  }

  const parsed = parsePassage(trimmed);
  if (parsed) {
    const book = BIBLE_BOOKS.find((item) => item.abbr === parsed.bookAbbr);
    if (book) push(toChapterHit(book, parsed.chapter), 100);
  }

  // "Yohanes 3" tanpa parse sempurna, atau sisa angka setelah nama kitab
  const trailingNumber = trimmed.match(/^(.+?)\s+(\d+)\s*$/);
  if (trailingNumber) {
    const bookQuery = normalizeSearch(trailingNumber[1]);
    const chapter = Number(trailingNumber[2]);
    for (const book of BIBLE_BOOKS) {
      const matchScore = scoreBookMatch(bookQuery, book);
      if (matchScore < BIBLE_BOOK_MATCH_MIN_SCORE) continue;
      push(toChapterHit(book, chapter), matchScore + 10);
    }
  }

  for (const book of BIBLE_BOOKS) {
    const matchScore = scoreBookMatch(q, book);
    if (matchScore < BIBLE_BOOK_MATCH_MIN_SCORE) continue;
    push(toBookHit(book), matchScore);
  }

  scored.sort((a, b) => b.score - a.score || a.hit.label.localeCompare(b.hit.label, "id"));

  return scored.slice(0, limit).map(({ hit }) => hit);
}
