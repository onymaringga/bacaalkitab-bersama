/** Rekomendasi sumber belajar renungan / tafsiran per kitab+pasal. */

import { BIBLE_BOOKS } from "@/lib/bible-books";
import { parsePassage } from "@/lib/passage-parser";

export type StudyResource = {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  lang: "id" | "en";
};

/** Slug Inggris untuk situs tafsiran (Enduring Word, BibleHub). */
const ENGLISH_SLUG: Record<string, string> = {
  Kej: "genesis",
  Kel: "exodus",
  Im: "leviticus",
  Bil: "numbers",
  Ul: "deuteronomy",
  Jos: "joshua",
  Hk: "judges",
  Rut: "ruth",
  "1Sa": "1-samuel",
  "2Sa": "2-samuel",
  "1Ra": "1-kings",
  "2Ra": "2-kings",
  "1Ta": "1-chronicles",
  "2Ta": "2-chronicles",
  Ezr: "ezra",
  Ne: "nehemiah",
  Est: "esther",
  Ay: "job",
  Maz: "psalm",
  Pnh: "proverbs",
  Pkh: "ecclesiastes",
  Kid: "song-of-solomon",
  Yes: "isaiah",
  Yer: "jeremiah",
  Rat: "lamentations",
  Yeh: "ezekiel",
  Dan: "daniel",
  Ho: "hosea",
  Yo: "joel",
  Am: "amos",
  Ob: "obadiah",
  Yun: "jonah",
  Mi: "micah",
  Na: "nahum",
  Hab: "habakkuk",
  Zef: "zephaniah",
  Hag: "haggai",
  Za: "zechariah",
  Mal: "malachi",
  Mat: "matthew",
  Mrk: "mark",
  Luk: "luke",
  Yoh: "john",
  Kis: "acts",
  Rom: "romans",
  "1Ko": "1-corinthians",
  "2Ko": "2-corinthians",
  Gal: "galatians",
  Ef: "ephesians",
  Fil: "philippians",
  Kol: "colossians",
  "1Te": "1-thessalonians",
  "2Te": "2-thessalonians",
  "1Ti": "1-timothy",
  "2Ti": "2-timothy",
  Tit: "titus",
  Flm: "philemon",
  Ibr: "hebrews",
  Yaa: "james",
  "1Pe": "1-peter",
  "2Pe": "2-peter",
  "1Yo": "1-john",
  "2Yo": "2-john",
  "3Yo": "3-john",
  Yud: "jude",
  Why: "revelation",
};

/** Nama Inggris untuk query Bible Gateway / Google. */
const ENGLISH_NAME: Record<string, string> = {
  Kej: "Genesis",
  Kel: "Exodus",
  Im: "Leviticus",
  Bil: "Numbers",
  Ul: "Deuteronomy",
  Jos: "Joshua",
  Hk: "Judges",
  Rut: "Ruth",
  "1Sa": "1 Samuel",
  "2Sa": "2 Samuel",
  "1Ra": "1 Kings",
  "2Ra": "2 Kings",
  "1Ta": "1 Chronicles",
  "2Ta": "2 Chronicles",
  Ezr: "Ezra",
  Ne: "Nehemiah",
  Est: "Esther",
  Ay: "Job",
  Maz: "Psalm",
  Pnh: "Proverbs",
  Pkh: "Ecclesiastes",
  Kid: "Song of Solomon",
  Yes: "Isaiah",
  Yer: "Jeremiah",
  Rat: "Lamentations",
  Yeh: "Ezekiel",
  Dan: "Daniel",
  Ho: "Hosea",
  Yo: "Joel",
  Am: "Amos",
  Ob: "Obadiah",
  Yun: "Jonah",
  Mi: "Micah",
  Na: "Nahum",
  Hab: "Habakkuk",
  Zef: "Zephaniah",
  Hag: "Haggai",
  Za: "Zechariah",
  Mal: "Malachi",
  Mat: "Matthew",
  Mrk: "Mark",
  Luk: "Luke",
  Yoh: "John",
  Kis: "Acts",
  Rom: "Romans",
  "1Ko": "1 Corinthians",
  "2Ko": "2 Corinthians",
  Gal: "Galatians",
  Ef: "Ephesians",
  Fil: "Philippians",
  Kol: "Colossians",
  "1Te": "1 Thessalonians",
  "2Te": "2 Thessalonians",
  "1Ti": "1 Timothy",
  "2Ti": "2 Timothy",
  Tit: "Titus",
  Flm: "Philemon",
  Ibr: "Hebrews",
  Yaa: "James",
  "1Pe": "1 Peter",
  "2Pe": "2 Peter",
  "1Yo": "1 John",
  "2Yo": "2 John",
  "3Yo": "3 John",
  Yud: "Jude",
  Why: "Revelation",
};

function resolveBookMeta(bookAbbr: string) {
  const book = BIBLE_BOOKS.find((item) => item.abbr === bookAbbr);
  const slug = ENGLISH_SLUG[bookAbbr];
  const englishName = ENGLISH_NAME[bookAbbr];
  if (!book || !slug || !englishName) return null;
  return { book, slug, englishName };
}

/**
 * 3 rekomendasi sumber di internet untuk memperdalam renungan
 * sesuai kitab & pasal yang sedang dibaca.
 */
export function getDevotionalStudyResources(
  passage: string,
): StudyResource[] {
  const parsed = parsePassage(passage);
  if (!parsed) return [];

  const meta = resolveBookMeta(parsed.bookAbbr);
  if (!meta) return [];

  const { book, slug, englishName } = meta;
  const chapter = parsed.chapter;
  const label = `${book.name} ${chapter}`;
  const sabdaPassage = encodeURIComponent(`${book.abbr} ${chapter}`);
  const googleQuery = encodeURIComponent(
    `renungan ${book.name} ${chapter} tafsiran Alkitab`,
  );

  return [
    {
      id: "sabda",
      title: `Tafsiran ${label}`,
      description: "Catatan & tafsiran pasal di Alkitab SABDA (Indonesia).",
      source: "Alkitab SABDA",
      lang: "id",
      url: `https://alkitab.sabda.org/commentary.php?passage=${sabdaPassage}`,
    },
    {
      id: "enduring-word",
      title: `Commentary ${englishName} ${chapter}`,
      description:
        "Tafsiran pasal demi pasal (Enduring Word) — bagus untuk memperdalam konteks.",
      source: "Enduring Word",
      lang: "en",
      url: `https://enduringword.com/bible-commentary/${slug}-${chapter}/`,
    },
    {
      id: "web-search",
      title: `Cari renungan ${label}`,
      description:
        "Hasil pencarian renungan & studi Alkitab di internet untuk pasal ini.",
      source: "Pencarian web",
      lang: "id",
      url: `https://www.google.com/search?q=${googleQuery}`,
    },
  ];
}
