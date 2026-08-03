export type HighlightColorId =
  | "yellow"
  | "green"
  | "blue"
  | "pink"
  | "purple";

export type BibleHighlight = {
  id: string;
  passageKey: string;
  verse: number;
  start: number;
  end: number;
  color: HighlightColorId;
  createdAt: number;
};

export const HIGHLIGHT_COLORS: {
  id: HighlightColorId;
  label: string;
  /** Kelas latar pada teks yang di-highlight */
  markClass: string;
  /** Kelas swatch di toolbar */
  swatchClass: string;
}[] = [
  {
    id: "yellow",
    label: "Kuning",
    markClass: "bg-amber-200 text-[var(--m-ink)]",
    swatchClass: "bg-amber-300",
  },
  {
    id: "green",
    label: "Hijau",
    markClass: "bg-emerald-200 text-[var(--m-ink)]",
    swatchClass: "bg-emerald-300",
  },
  {
    id: "blue",
    label: "Biru",
    markClass: "bg-sky-200 text-[var(--m-ink)]",
    swatchClass: "bg-sky-300",
  },
  {
    id: "pink",
    label: "Merah muda",
    markClass: "bg-pink-200 text-[var(--m-ink)]",
    swatchClass: "bg-pink-300",
  },
  {
    id: "purple",
    label: "Ungu",
    markClass: "bg-violet-200 text-[var(--m-ink)]",
    swatchClass: "bg-violet-300",
  },
];

/** Warna lama (sudah tidak dipilih) — tetap dirender jika ada data tersimpan. */
const LEGACY_HIGHLIGHT_COLORS: Record<
  string,
  { markClass: string; swatchClass: string; label: string }
> = {
  orange: {
    label: "Oranye",
    markClass: "bg-orange-200 text-[var(--m-ink)]",
    swatchClass: "bg-orange-300",
  },
  lavender: {
    label: "Ungu",
    markClass: "bg-violet-200 text-[var(--m-ink)]",
    swatchClass: "bg-violet-300",
  },
};

const STORAGE_KEY = "bacaalkitab-passage-highlights";

/** Referensi stabil untuk useSyncExternalStore (jangan buat `[]` baru tiap panggilan). */
export const EMPTY_HIGHLIGHTS: BibleHighlight[] = [];

let cachedRaw: string | null = null;
let cachedAll: BibleHighlight[] = EMPTY_HIGHLIGHTS;
let hasCache = false;

function readAll(): BibleHighlight[] {
  if (typeof window === "undefined") return EMPTY_HIGHLIGHTS;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (hasCache && raw === cachedRaw) return cachedAll;
  cachedRaw = raw;
  hasCache = true;
  if (!raw) {
    cachedAll = EMPTY_HIGHLIGHTS;
    return cachedAll;
  }
  try {
    const parsed = JSON.parse(raw) as BibleHighlight[];
    cachedAll = Array.isArray(parsed) ? parsed : EMPTY_HIGHLIGHTS;
  } catch {
    cachedAll = EMPTY_HIGHLIGHTS;
  }
  return cachedAll;
}

function writeAll(next: BibleHighlight[]) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(next);
  window.localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedAll = next;
  hasCache = true;
  verseCache.clear();
  passageCache.clear();
  window.dispatchEvent(new Event("bible-highlights-updated"));
}

export function makePassageHighlightKey(passage: string, version: string) {
  return `${passage.trim().toLowerCase().replace(/\s+/g, " ")}::${version}`;
}

const verseCache = new Map<string, BibleHighlight[]>();
const passageCache = new Map<string, BibleHighlight[]>();

function verseCacheKey(passageKey: string, verse: number) {
  return `${passageKey}#${verse}`;
}

export function getHighlightsForPassage(passageKey: string) {
  const cached = passageCache.get(passageKey);
  if (cached) return cached;
  const filtered = readAll()
    .filter((item) => item.passageKey === passageKey)
    .sort((a, b) => a.verse - b.verse || a.start - b.start);
  const next = filtered.length === 0 ? EMPTY_HIGHLIGHTS : filtered;
  passageCache.set(passageKey, next);
  return next;
}

export function getHighlightsForVerse(passageKey: string, verse: number) {
  const key = verseCacheKey(passageKey, verse);
  const cached = verseCache.get(key);
  if (cached) return cached;
  const filtered = getHighlightsForPassage(passageKey).filter(
    (item) => item.verse === verse,
  );
  const next = filtered.length === 0 ? EMPTY_HIGHLIGHTS : filtered;
  verseCache.set(key, next);
  return next;
}

export function subscribeBibleHighlights(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const wrapped = () => {
    verseCache.clear();
    passageCache.clear();
    hasCache = false;
    onChange();
  };
  window.addEventListener("bible-highlights-updated", wrapped);
  window.addEventListener("storage", wrapped);
  return () => {
    window.removeEventListener("bible-highlights-updated", wrapped);
    window.removeEventListener("storage", wrapped);
  };
}

export function getHighlightColor(id: HighlightColorId | string) {
  const current = HIGHLIGHT_COLORS.find((color) => color.id === id);
  if (current) return current;
  const legacy = LEGACY_HIGHLIGHT_COLORS[id];
  if (legacy) {
    return { id: id as HighlightColorId, ...legacy };
  }
  return HIGHLIGHT_COLORS[0]!;
}

/** Gabungkan/timpa range yang overlap di ayat yang sama. */
function mergeHighlights(
  existing: BibleHighlight[],
  incoming: BibleHighlight,
): BibleHighlight[] {
  const others = existing.filter(
    (item) =>
      !(
        item.passageKey === incoming.passageKey &&
        item.verse === incoming.verse &&
        item.start < incoming.end &&
        item.end > incoming.start
      ),
  );

  const sameVerse = existing.filter(
    (item) =>
      item.passageKey === incoming.passageKey &&
      item.verse === incoming.verse &&
      item.start < incoming.end &&
      item.end > incoming.start,
  );

  // Potong sisa highlight yang overlap di kiri/kanan
  const remnants: BibleHighlight[] = [];
  for (const item of sameVerse) {
    if (item.start < incoming.start) {
      remnants.push({
        ...item,
        id: `${item.id}-l`,
        end: incoming.start,
      });
    }
    if (item.end > incoming.end) {
      remnants.push({
        ...item,
        id: `${item.id}-r`,
        start: incoming.end,
      });
    }
  }

  return [...others, ...remnants, incoming].sort(
    (a, b) => a.verse - b.verse || a.start - b.start,
  );
}

export function addBibleHighlight(input: {
  passageKey: string;
  verse: number;
  start: number;
  end: number;
  color: HighlightColorId;
}) {
  const created = addBibleHighlights([input]);
  return created[0] ?? null;
}

export function addBibleHighlights(
  inputs: Array<{
    passageKey: string;
    verse: number;
    start: number;
    end: number;
    color: HighlightColorId;
  }>,
) {
  const created: BibleHighlight[] = [];
  let next = readAll();
  const now = Date.now();

  inputs.forEach((input, index) => {
    if (input.end <= input.start) return;
    const highlight: BibleHighlight = {
      id: `hl-${now}-${index}-${Math.random().toString(36).slice(2, 7)}`,
      passageKey: input.passageKey,
      verse: input.verse,
      start: input.start,
      end: input.end,
      color: input.color,
      createdAt: now,
    };
    next = mergeHighlights(next, highlight);
    created.push(highlight);
  });

  if (created.length > 0) writeAll(next);
  return created;
}

export function removeHighlightsInRanges(
  inputs: Array<{
    passageKey: string;
    verse: number;
    start: number;
    end: number;
  }>,
) {
  let next = readAll();
  for (const input of inputs) {
    next = next.flatMap((item) => {
      if (
        item.passageKey !== input.passageKey ||
        item.verse !== input.verse ||
        item.start >= input.end ||
        item.end <= input.start
      ) {
        return [item];
      }
      const parts: BibleHighlight[] = [];
      if (item.start < input.start) {
        parts.push({ ...item, id: `${item.id}-l`, end: input.start });
      }
      if (item.end > input.end) {
        parts.push({ ...item, id: `${item.id}-r`, start: input.end });
      }
      return parts;
    });
  }
  writeAll(next);
}

export function removeBibleHighlight(id: string) {
  writeAll(readAll().filter((item) => item.id !== id));
}

export function removeHighlightsInRange(input: {
  passageKey: string;
  verse: number;
  start: number;
  end: number;
}) {
  removeHighlightsInRanges([input]);
}

export type TextSegment = {
  text: string;
  highlightId?: string;
  color?: HighlightColorId;
};

export function buildHighlightedSegments(
  text: string,
  highlights: BibleHighlight[],
): TextSegment[] {
  if (!text) return [];
  const sorted = [...highlights]
    .filter((h) => h.start < text.length && h.end > 0)
    .map((h) => ({
      ...h,
      start: Math.max(0, Math.min(h.start, text.length)),
      end: Math.max(0, Math.min(h.end, text.length)),
    }))
    .filter((h) => h.end > h.start)
    .sort((a, b) => a.start - b.start);

  if (sorted.length === 0) return [{ text }];

  const segments: TextSegment[] = [];
  let cursor = 0;

  for (const hit of sorted) {
    if (hit.start > cursor) {
      segments.push({ text: text.slice(cursor, hit.start) });
    }
    const from = Math.max(hit.start, cursor);
    if (hit.end > from) {
      segments.push({
        text: text.slice(from, hit.end),
        highlightId: hit.id,
        color: hit.color,
      });
      cursor = hit.end;
    }
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor) });
  }

  return segments;
}
