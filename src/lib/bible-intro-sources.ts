/**
 * Sumber rujukan pengantar kitab — untuk transparansi “dari mana informasinya”.
 * Konten Sejarah Kitab disusun sebagai sintesis ringkas bagi pembaca awam,
 * bukan kutipan literal satu-satunya sumber.
 */

export type BibleIntroSourceId =
  | "fee-stuart-book"
  | "carson-moo-nt"
  | "longman-dillard-ot"
  | "esv-study"
  | "niv-study"
  | "lai-pengantar"
  | "sabda-ensiklopedia"
  | "tradisi-gereja"
  | "josephus"
  | "eusebius";

export type BibleIntroSource = {
  id: BibleIntroSourceId;
  title: string;
  credit: string;
  detail: string;
  url?: string;
};

export const BIBLE_INTRO_SOURCES: BibleIntroSource[] = [
  {
    id: "fee-stuart-book",
    title: "How to Read the Bible Book by Book",
    credit: "Gordon D. Fee & Douglas Stuart",
    detail:
      "Pengantar populer per kitab: latar, tema, dan cara membaca — banyak dipakai di kelas Alkitab.",
  },
  {
    id: "carson-moo-nt",
    title: "An Introduction to the New Testament",
    credit: "D.A. Carson & Douglas J. Moo",
    detail:
      "Pengantar akademis PB: kepengarangan, tanggal, tujuan, dan isu penafsiran utama.",
  },
  {
    id: "longman-dillard-ot",
    title: "An Introduction to the Old Testament",
    credit: "Tremper Longman III & Raymond B. Dillard",
    detail:
      "Pengantar akademis PL: konteks sejarah, sastra, dan teologi tiap kitab.",
  },
  {
    id: "esv-study",
    title: "ESV Study Bible — Book Introductions",
    credit: "Crossway (tim editor)",
    detail:
      "Ringkasan pengantar per kitab: penulis, tanggal, tujuan, garis besar, dan tema.",
  },
  {
    id: "niv-study",
    title: "NIV Study Bible — Introductions",
    credit: "Zondervan (tim editor)",
    detail:
      "Pengantar studi yang ringkas untuk latar belakang dan struktur kitab.",
  },
  {
    id: "lai-pengantar",
    title: "Pengantar kitab (tradisi terbitan Alkitab Indonesia)",
    credit: "Lembaga Alkitab Indonesia & tradisi pengantar TB/BIS",
    detail:
      "Ringkasan latar yang umum dipakai dalam edisi Alkitab berbahasa Indonesia (bukan dogma tunggal).",
  },
  {
    id: "sabda-ensiklopedia",
    title: "Ensiklopedia / modul studi Alkitab SABDA",
    credit: "Yayasan Lembaga SABDA",
    detail:
      "Artikel latar kitab dan istilah Alkitab dalam ekosistem studi digital Indonesia.",
    url: "https://alkitab.sabda.org/",
  },
  {
    id: "tradisi-gereja",
    title: "Tradisi Gereja mula-mula",
    credit: "Kesaksian bapa gereja & kanon (ringkas)",
    detail:
      "Atribusi kepengarangan klasik (mis. keempat Injil, surat Paulus) sebagaimana diwariskan tradisi.",
  },
  {
    id: "josephus",
    title: "Antiquities / Wars (latar Yahudi abad ke-1)",
    credit: "Flavius Josephus",
    detail:
      "Sumber sekunder untuk konteks sejarah Yahudi–Romawi yang relevan bagi PB dan akhir PL.",
  },
  {
    id: "eusebius",
    title: "Historia Ecclesiastica",
    credit: "Eusebius dari Kaisarea",
    detail:
      "Sejarah gereja abad ke-4 yang mencatat tradisi tentang rasul dan penulisan kitab.",
  },
];

const byId = new Map(
  BIBLE_INTRO_SOURCES.map((source) => [source.id, source] as const),
);

export function getBibleIntroSource(
  id: BibleIntroSourceId,
): BibleIntroSource | null {
  return byId.get(id) ?? null;
}

export function resolveBibleIntroSources(
  ids: BibleIntroSourceId[] | null | undefined,
) {
  if (!ids?.length) return [];
  return ids
    .map((id) => getBibleIntroSource(id))
    .filter(Boolean) as BibleIntroSource[];
}

/** Sumber default bila kitab belum menambahkan daftar khusus. */
export const DEFAULT_OT_SOURCE_IDS: BibleIntroSourceId[] = [
  "longman-dillard-ot",
  "fee-stuart-book",
  "esv-study",
  "lai-pengantar",
  "sabda-ensiklopedia",
];

export const DEFAULT_NT_SOURCE_IDS: BibleIntroSourceId[] = [
  "carson-moo-nt",
  "fee-stuart-book",
  "esv-study",
  "tradisi-gereja",
  "lai-pengantar",
  "sabda-ensiklopedia",
];
