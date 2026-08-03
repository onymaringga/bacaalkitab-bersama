import { BIBLE_BOOKS, OLD_TESTAMENT_SIZE, type BibleBook } from "./bible-books";
import { getChapterCount } from "./bible-chapters";
import { parsePassage } from "./passage-parser";

export type BibleSearchHit = {
  kind: "book" | "chapter";
  bookAbbr: string;
  bookName: string;
  chapter: number;
  label: string;
  subtitle: string;
  reference: string;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function bookMatches(book: BibleBook, query: string) {
  const keys = [book.name, book.abbr, ...book.aliases].map(normalize);
  return keys.some(
    (key) => key.includes(query) || query.includes(key) || key.startsWith(query),
  );
}

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

  const q = normalize(trimmed);
  const hits: BibleSearchHit[] = [];
  const seen = new Set<string>();

  function push(hit: BibleSearchHit | null) {
    if (!hit || hits.length >= limit) return;
    const key = `${hit.bookAbbr}:${hit.chapter}:${hit.kind}`;
    if (seen.has(key)) return;
    seen.add(key);
    hits.push(hit);
  }

  const parsed = parsePassage(trimmed);
  if (parsed) {
    const book = BIBLE_BOOKS.find((item) => item.abbr === parsed.bookAbbr);
    if (book) push(toChapterHit(book, parsed.chapter));
  }

  // "Yohanes 3" tanpa parse sempurna, atau sisa angka setelah nama kitab
  const trailingNumber = trimmed.match(/^(.+?)\s+(\d+)\s*$/);
  if (trailingNumber) {
    const bookQuery = normalize(trailingNumber[1]);
    const chapter = Number(trailingNumber[2]);
    for (const book of BIBLE_BOOKS) {
      if (!bookMatches(book, bookQuery)) continue;
      push(toChapterHit(book, chapter));
    }
  }

  for (const book of BIBLE_BOOKS) {
    if (!bookMatches(book, q)) continue;
    push(toBookHit(book));
  }

  // Jika query hanya angka dan kitab sudah dipilih di UI — handled by caller.

  return hits;
}
