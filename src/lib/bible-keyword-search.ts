import type { BiblePassageResult } from "@/lib/bible-api";
import { getBiblePassage } from "@/lib/bible-api";
import type { BibleVersionCode } from "@/lib/bible-books";
import { parsePassage } from "@/lib/passage-parser";

export type BibleKeywordHit = {
  reference: string;
  chapterReference: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  snippet: string;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function snippetAround(text: string, query: string, radius = 56) {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx < 0) {
    return text.length > radius * 2
      ? `${text.slice(0, radius * 2).trim()}…`
      : text;
  }
  const start = Math.max(0, idx - radius);
  const end = Math.min(text.length, idx + q.length + radius);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < text.length ? "…" : "";
  return `${prefix}${text.slice(start, end).trim()}${suffix}`;
}

/** Pasal yang sering relevan untuk kata kunci umum (TB). */
const KEYWORD_CHAPTER_HINTS: Record<string, string[]> = {
  kasih: ["Yohanes 3", "1 Yohanes 4", "1 Korintus 13", "Roma 5"],
  mengasihi: ["Yohanes 13", "1 Yohanes 4", "Matius 22"],
  iman: ["Ibrani 11", "Roma 5", "Yakobus 2", "Efesus 2"],
  pengampunan: ["Matius 18", "Matius 6", "Efesus 4", "Kolose 3"],
  mengampuni: ["Matius 18", "Matius 6", "Lukas 17"],
  doa: ["Matius 6", "Filipi 4", "Yakobus 5", "1 Tesalonika 5"],
  berdoa: ["Matius 6", "Lukas 11", "Filipi 4"],
  takut: ["Yesaya 41", "Mazmur 23", "2 Timotius 1", "Yosua 1"],
  damai: ["Yohanes 14", "Filipi 4", "Roma 5", "Yesaya 26"],
  pengharapan: ["Roma 5", "Roma 15", "Ibrani 6", "1 Petrus 1"],
  sukacita: ["Filipi 4", "Nehemia 8", "Mazmur 16", "Yohanes 15"],
  hikmat: ["Amsal 1", "Amsal 3", "Yakobus 1", "1 Korintus 1"],
  firman: ["Mazmur 119", "Yohanes 1", "Ibrani 4", "2 Timotius 3"],
  roh: ["Yohanes 14", "Roma 8", "Galatia 5", "Kisah Para Rasul 2"],
  kudus: ["1 Petrus 1", "Imamat 19", "Yesaya 6"],
  salib: ["1 Korintus 1", "Galatia 6", "Filipi 2"],
  bangkit: ["1 Korintus 15", "Lukas 24", "Roma 6"],
  kebangkitan: ["1 Korintus 15", "Yohanes 11"],
  dosa: ["Roma 3", "1 Yohanes 1", "Mazmur 51", "Roma 6"],
  anugerah: ["Efesus 2", "Roma 5", "2 Korintus 12"],
  "kasih karunia": ["Efesus 2", "Roma 5", "Titus 2"],
  kuat: ["Yesaya 40", "Filipi 4", "Yosua 1", "2 Korintus 12"],
  kuatlah: ["Yosua 1", "Yesaya 41", "Ulangan 31"],
  gembala: ["Mazmur 23", "Yohanes 10", "1 Petrus 5"],
  terang: ["Yohanes 1", "Yohanes 8", "Matius 5", "1 Yohanes 1"],
  roti: ["Yohanes 6", "Matius 4", "Matius 6"],
  air: ["Yohanes 4", "Yesaya 55", "Wahyu 22"],
  hidup: ["Yohanes 3", "Yohanes 10", "Yohanes 14", "Roma 6"],
  jalan: ["Yohanes 14", "Mazmur 119", "Amsal 3"],
  kebenaran: ["Yohanes 8", "Yohanes 14", "Yohanes 17"],
  bersyukur: ["1 Tesalonika 5", "Mazmur 100", "Kolose 3"],
  sabar: ["Yakobus 1", "Roma 12", "Galatia 5"],
  rendah: ["Filipi 2", "Yakobus 4", "1 Petrus 5"],
  sombong: ["Amsal 16", "Yakobus 4", "1 Petrus 5"],
  marah: ["Efesus 4", "Yakobus 1", "Amsal 15"],
  cemas: ["Filipi 4", "Matius 6", "1 Petrus 5"],
  kuatir: ["Matius 6", "Filipi 4", "1 Petrus 5"],
  lelah: ["Matius 11", "Yesaya 40", "Mazmur 23"],
  lemah: ["2 Korintus 12", "Yesaya 40", "Mazmur 73"],
};

function resolveHintChapters(query: string): string[] {
  const q = normalize(query);
  const chapters = new Set<string>();

  for (const [key, refs] of Object.entries(KEYWORD_CHAPTER_HINTS)) {
    if (q.includes(normalize(key)) || normalize(key).includes(q)) {
      for (const ref of refs) chapters.add(ref);
    }
  }

  // Token tunggal juga cocokkan sebagian
  for (const token of q.split(" ")) {
    if (token.length < 3) continue;
    for (const [key, refs] of Object.entries(KEYWORD_CHAPTER_HINTS)) {
      if (normalize(key).includes(token) || token.includes(normalize(key))) {
        for (const ref of refs) chapters.add(ref);
      }
    }
  }

  return [...chapters].slice(0, 6);
}

export function searchVersesInPassage(
  passage: BiblePassageResult,
  query: string,
  limit = 20,
): BibleKeywordHit[] {
  const q = normalize(query);
  if (q.length < 2) return [];

  const hits: BibleKeywordHit[] = [];
  for (const verse of passage.verses) {
    if (verse.type === "title") continue;
    const text = verse.content?.trim();
    if (!text) continue;
    if (!normalize(text).includes(q)) continue;

    hits.push({
      reference: `${passage.book} ${passage.chapter}:${verse.verse}`,
      chapterReference: `${passage.book} ${passage.chapter}`,
      book: passage.book,
      chapter: passage.chapter,
      verse: verse.verse,
      text,
      snippet: snippetAround(text, query),
    });
    if (hits.length >= limit) break;
  }
  return hits;
}

export function searchVersesInPassages(
  passages: BiblePassageResult[],
  query: string,
  limit = 24,
): BibleKeywordHit[] {
  const hits: BibleKeywordHit[] = [];
  const seen = new Set<string>();

  for (const passage of passages) {
    for (const hit of searchVersesInPassage(passage, query, limit)) {
      if (seen.has(hit.reference)) continue;
      seen.add(hit.reference);
      hits.push(hit);
      if (hits.length >= limit) return hits;
    }
  }
  return hits;
}

/** Cari kata kunci di pasal yang relevan (hint + fallback lewat getBiblePassage). */
export async function searchBibleKeywords(
  query: string,
  version: BibleVersionCode = "tb",
  limit = 24,
): Promise<BibleKeywordHit[]> {
  const q = normalize(query);
  if (q.length < 2) return [];

  const chapterRefs = resolveHintChapters(query);
  // Tambah pasal default yang sering dibaca bila hint kosong
  if (chapterRefs.length === 0) {
    chapterRefs.push(
      "Yohanes 3",
      "Mazmur 23",
      "Matius 6",
      "Roma 8",
      "Filipi 4",
      "Kejadian 1",
    );
  }

  const passages: BiblePassageResult[] = [];
  await Promise.all(
    chapterRefs.map(async (reference) => {
      const parsed = parsePassage(reference);
      if (!parsed) return;
      try {
        const result = await getBiblePassage(parsed, version);
        passages.push(result);
      } catch {
        /* skip */
      }
    }),
  );

  return searchVersesInPassages(passages, query, limit);
}

/** Cari di cache lokal perangkat (browser). */
export function searchCachedPassagesForKeyword(
  query: string,
  version: string,
  limit = 24,
): BibleKeywordHit[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem("bacaalkitab-passage-cache-v1");
    if (!raw) return [];
    const store = JSON.parse(raw) as Record<
      string,
      { data?: BiblePassageResult }
    >;
    const passages: BiblePassageResult[] = [];
    for (const [key, entry] of Object.entries(store)) {
      if (!key.startsWith(`${version}::`)) continue;
      if (entry?.data?.verses?.length) passages.push(entry.data);
    }
    return searchVersesInPassages(passages, query, limit);
  } catch {
    return [];
  }
}
