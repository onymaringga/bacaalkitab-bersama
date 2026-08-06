import type { BiblePassageResult } from "@/lib/bible-api";
import {
  BIBLE_VERSIONS,
  BIBLE_VERSION_SHORT,
  type BibleVersionCode,
} from "@/lib/bible-books";
import { BIBLE_VERSION_OPTIONS } from "@/lib/bible-version-preference";

export type CompareVerseRef = {
  chapter: number;
  verse: number;
};

export type CompareVerseResult = CompareVerseRef & {
  content: string;
};

/** Chapter dari judul section multi-pasal ("Kejadian 34"), else fallback. */
export function chapterFromSectionTitle(
  title: string | undefined,
  bookName: string,
  fallback: number,
): number {
  if (!title?.trim()) return fallback;
  const escaped = bookName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = title
    .trim()
    .match(new RegExp(`^${escaped}\\s+(\\d+)(?:\\s*[·\\-—]\\s*.+)?$`, "i"));
  if (match) {
    const chapter = Number(match[1]);
    if (Number.isFinite(chapter) && chapter > 0) return chapter;
  }
  return fallback;
}

export function defaultCompareVersion(
  current: BibleVersionCode,
): BibleVersionCode {
  if (current !== "tb") return "tb";
  return "bis";
}

export function compareVersionOptions(current: BibleVersionCode) {
  return BIBLE_VERSION_OPTIONS.filter((option) => option.code !== current);
}

export function formatCompareCitation(
  bookName: string,
  refs: CompareVerseRef[] | null | undefined,
) {
  if (!refs || refs.length === 0) return bookName;

  const byChapter = new Map<number, number[]>();
  for (const ref of refs) {
    const list = byChapter.get(ref.chapter) ?? [];
    list.push(ref.verse);
    byChapter.set(ref.chapter, list);
  }

  const parts = [...byChapter.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([chapter, verses]) => {
      const sorted = [...new Set(verses)].sort((a, b) => a - b);
      const start = sorted[0]!;
      const end = sorted[sorted.length - 1]!;
      return start === end
        ? `${bookName} ${chapter}:${start}`
        : `${bookName} ${chapter}:${start}–${end}`;
    });

  return parts.join(" · ");
}

export function pickVersesForCompare(
  data: BiblePassageResult,
  selected: CompareVerseRef[],
): CompareVerseResult[] {
  if (selected.length === 0) return [];

  const wanted = new Set(
    selected.map((item) => `${item.chapter}:${item.verse}`),
  );
  const found: CompareVerseResult[] = [];
  const seen = new Set<string>();

  function push(chapter: number, verse: number, content: string) {
    const key = `${chapter}:${verse}`;
    if (!wanted.has(key) || seen.has(key)) return;
    const text = content.trim();
    if (!text) return;
    seen.add(key);
    found.push({ chapter, verse, content: text });
  }

  if (data.sections && data.sections.length > 0) {
    for (const section of data.sections) {
      const chapter = chapterFromSectionTitle(
        section.title,
        data.book,
        data.chapter,
      );
      for (const item of section.verses) {
        if (item.type === "title") continue;
        push(chapter, item.verse, item.content);
      }
    }
  } else {
    for (const item of data.verses) {
      if (item.type === "title") continue;
      push(data.chapter, item.verse, item.content);
    }
  }

  return found.sort((a, b) =>
    a.chapter === b.chapter ? a.verse - b.verse : a.chapter - b.chapter,
  );
}

export function versionLabel(code: BibleVersionCode) {
  return `${BIBLE_VERSION_SHORT[code]} · ${BIBLE_VERSIONS[code]}`;
}
