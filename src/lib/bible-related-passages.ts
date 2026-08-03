/**
 * Bacaan terkait dari teks ayat yang dipilih/diblok.
 * Menggabungkan kata kunci teologis + pencarian pasal hint.
 */

import type { BibleVersionCode } from "@/lib/bible-books";
import {
  searchBibleKeywords,
  searchCachedPassagesForKeyword,
  type BibleKeywordHit,
} from "@/lib/bible-keyword-search";

const STOPWORDS = new Set(
  [
    "yang",
    "dan",
    "di",
    "ke",
    "dari",
    "ini",
    "itu",
    "ada",
    "untuk",
    "dengan",
    "pada",
    "atau",
    "juga",
    "akan",
    "sudah",
    "tidak",
    "adalah",
    "bahwa",
    "sebagai",
    "oleh",
    "dalam",
    "mereka",
    "kamu",
    "kita",
    "dia",
    "ia",
    "aku",
    "engkau",
    "kami",
    "nya",
    "lah",
    "kah",
    "pun",
    "sebab",
    "karena",
    "maka",
    "jika",
    "bila",
    "saat",
    "ketika",
    "telah",
    "sedang",
    "masih",
    "boleh",
    "harus",
    "dapat",
    "bisa",
    "agar",
    "supaya",
    "serta",
    "bahkan",
    "namun",
    "tetapi",
    "lalu",
    "kemudian",
    "seorang",
    "suatu",
    "para",
    "bagi",
    "atas",
    "bawah",
    "antara",
    "tanpa",
    "hingga",
    "sampai",
    "setelah",
    "sebelum",
    "the",
    "and",
    "of",
    "to",
    "in",
    "a",
    "is",
    "that",
    "be",
    "as",
    "for",
    "with",
    "his",
    "her",
    "him",
    "them",
    "you",
    "your",
    "from",
    "was",
    "are",
    "were",
    "have",
    "has",
    "had",
    "not",
    "but",
    "or",
    "an",
    "he",
    "she",
    "it",
    "we",
    "they",
    "this",
    "those",
    "these",
    "unto",
    "shall",
    "will",
    "said",
    "say",
    "says",
  ].map((w) => w.toLowerCase()),
);

/** Kata teologis yang diprioritaskan bila muncul di teks. */
const THEME_TERMS = [
  "kasih",
  "mengasihi",
  "iman",
  "percaya",
  "pengampunan",
  "mengampuni",
  "ampuni",
  "doa",
  "berdoa",
  "takut",
  "damai",
  "pengharapan",
  "harapan",
  "sukacita",
  "hikmat",
  "firman",
  "roh",
  "kudus",
  "salib",
  "bangkit",
  "kebangkitan",
  "dosa",
  "anugerah",
  "kasih karunia",
  "kuat",
  "gembala",
  "terang",
  "hidup",
  "jalan",
  "kebenaran",
  "bersyukur",
  "sabar",
  "lelah",
  "lemah",
  "kuatir",
  "cemas",
  "penebusan",
  "penebus",
  "perjanjian",
  "kerajaan",
  "surga",
  "surgawi",
  "nabi",
  "mesias",
  "kristus",
  "yesus",
  "tuhan",
  "allah",
  "bapa",
  "anak",
  "baptis",
  "pertobatan",
  "bertobat",
  "keselamatan",
  "selamat",
  "kebinasaan",
  "binasa",
  "kekal",
  "surgawi",
  "surga",
  "bumi",
  "ciptaan",
  "menciptakan",
  "berkat",
  "memberkati",
  "kutuk",
  "penghakiman",
  "menghakimi",
  "belas kasihan",
  "murah hati",
  "rendah hati",
  "sombong",
  "marah",
] as const;

function normalize(value: string | null | undefined) {
  if (!value) return "";
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type RelatedPassageHit = {
  id: string;
  reference: string;
  chapterReference: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  snippet: string;
  /** Kata kunci yang memicu kecocokan */
  matchedBy: string;
  source: "theme" | "keyword";
};

export type RelatedPassageExclude = {
  bookName?: string;
  verses: Array<{ chapter: number; verse: number }>;
};

/** Ambil kata kunci relevan dari teks ayat yang diblok. */
export function extractRelatedKeywords(selectedText: string, limit = 4): string[] {
  const normalized = normalize(selectedText);
  if (normalized.length < 3) return [];

  const found: string[] = [];
  const seen = new Set<string>();

  // Prioritas: frasa/tema teologis yang ada di teks
  for (const term of THEME_TERMS) {
    const n = normalize(term);
    if (n.length < 3) continue;
    if (!normalized.includes(n)) continue;
    if (seen.has(n)) continue;
    seen.add(n);
    found.push(term);
    if (found.length >= limit) return found;
  }

  // Cadangan: token unik panjang dari teks
  const tokens = normalized
    .split(" ")
    .filter((token) => token.length >= 4 && !STOPWORDS.has(token));

  const freq = new Map<string, number>();
  for (const token of tokens) {
    freq.set(token, (freq.get(token) ?? 0) + 1);
  }

  const ranked = [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .map(([token]) => token);

  for (const token of ranked) {
    if (seen.has(token)) continue;
    seen.add(token);
    found.push(token);
    if (found.length >= limit) break;
  }

  return found;
}

function isExcludedHit(hit: BibleKeywordHit, exclude: RelatedPassageExclude) {
  const bookNorm = normalize(exclude.bookName ?? "");
  const hitBook = normalize(hit.book);
  if (bookNorm && hitBook === bookNorm) {
    return exclude.verses.some(
      (item) => item.chapter === hit.chapter && item.verse === hit.verse,
    );
  }
  return false;
}

async function searchKeywordClient(
  query: string,
  version: BibleVersionCode,
  limit: number,
): Promise<BibleKeywordHit[]> {
  // Cache lokal dulu (cepat, offline-friendly)
  const cached = searchCachedPassagesForKeyword(query, version, limit);
  if (cached.length >= Math.min(4, limit)) return cached;

  try {
    const params = new URLSearchParams({
      q: query.slice(0, 80),
      ver: version,
    });
    const response = await fetch(`/api/bible/search?${params.toString()}`, {
      method: "GET",
      cache: "force-cache",
    });
    if (!response.ok) {
      return searchBibleKeywords(query, version, limit);
    }
    const data = (await response.json()) as { verses?: BibleKeywordHit[] };
    const verses = Array.isArray(data.verses) ? data.verses : [];
    if (verses.length > 0) return verses.slice(0, limit);
  } catch {
    /* fall through */
  }

  // Fallback server-side helper (SSR/edge) atau empty
  try {
    return await searchBibleKeywords(query, version, limit);
  } catch {
    return cached;
  }
}

/**
 * Cari bacaan terkait berdasarkan teks ayat yang diblok.
 */
export async function findRelatedPassagesFromBlockedText(options: {
  selectedText: string;
  version: BibleVersionCode;
  exclude: RelatedPassageExclude;
  limit?: number;
}): Promise<{ keywords: string[]; hits: RelatedPassageHit[] }> {
  const limit = options.limit ?? 8;
  const keywords = extractRelatedKeywords(options.selectedText, 4);
  if (keywords.length === 0) {
    return { keywords: [], hits: [] };
  }

  const seen = new Set<string>();
  const hits: RelatedPassageHit[] = [];

  for (const keyword of keywords) {
    if (hits.length >= limit) break;
    const results = await searchKeywordClient(
      keyword,
      options.version,
      Math.max(6, limit),
    );

    const isTheme = THEME_TERMS.some(
      (term) => normalize(term) === normalize(keyword),
    );

    for (const hit of results) {
      if (hits.length >= limit) break;
      if (seen.has(hit.reference)) continue;
      if (isExcludedHit(hit, options.exclude)) continue;
      // Hindari ayat yang hampir sama persis dengan teks yang diblok
      if (
        normalize(hit.text) === normalize(options.selectedText) ||
        (options.selectedText.length > 40 &&
          normalize(hit.text).includes(normalize(options.selectedText).slice(0, 40)))
      ) {
        continue;
      }

      seen.add(hit.reference);
      hits.push({
        id: `related:${hit.reference}:${keyword}`,
        reference: hit.reference,
        chapterReference: hit.chapterReference,
        book: hit.book,
        chapter: hit.chapter,
        verse: hit.verse,
        text: hit.text,
        snippet: hit.snippet,
        matchedBy: keyword,
        source: isTheme ? "theme" : "keyword",
      });
    }
  }

  return { keywords, hits };
}
