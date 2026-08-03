/** Preferensi ukuran font teks Alkitab (disimpan lokal). */

export type BibleFontSizeId = "sm" | "md" | "lg" | "xl" | "xxl";

export type BibleFontSizeOption = {
  id: BibleFontSizeId;
  label: string;
  /** Kelas ukuran teks ayat */
  verseClass: string;
  /** Kelas nomor ayat */
  verseNumberClass: string;
};

export const BIBLE_FONT_SIZE_OPTIONS: BibleFontSizeOption[] = [
  {
    id: "sm",
    label: "Kecil",
    verseClass: "text-[1rem] leading-7 sm:text-[1.05rem] sm:leading-7",
    verseNumberClass: "text-[10px]",
  },
  {
    id: "md",
    label: "Sedang",
    verseClass: "text-[1.05rem] leading-8 sm:text-[1.125rem] sm:leading-8",
    verseNumberClass: "text-xs",
  },
  {
    id: "lg",
    label: "Besar",
    verseClass: "text-[1.2rem] leading-8 sm:text-[1.3rem] sm:leading-9",
    verseNumberClass: "text-xs",
  },
  {
    id: "xl",
    label: "Lebih besar",
    verseClass: "text-[1.4rem] leading-9 sm:text-[1.5rem] sm:leading-9",
    verseNumberClass: "text-sm",
  },
  {
    id: "xxl",
    label: "Sangat besar",
    verseClass: "text-[1.6rem] leading-9 sm:text-[1.75rem] sm:leading-10",
    verseNumberClass: "text-sm",
  },
];

const STORAGE_KEY = "bacaalkitab-bible-font-size";
const EVENT = "bible-font-size-updated";
const DEFAULT_SIZE: BibleFontSizeId = "md";

const IDS = new Set<BibleFontSizeId>(
  BIBLE_FONT_SIZE_OPTIONS.map((item) => item.id),
);

let cachedRaw: string | null = null;
let cachedSize: BibleFontSizeId = DEFAULT_SIZE;
let hasCache = false;

function isBibleFontSizeId(value: string): value is BibleFontSizeId {
  return IDS.has(value as BibleFontSizeId);
}

export function getBibleFontSizeOption(id: BibleFontSizeId) {
  return (
    BIBLE_FONT_SIZE_OPTIONS.find((item) => item.id === id) ??
    BIBLE_FONT_SIZE_OPTIONS[1]!
  );
}

export function readBibleFontSize(): BibleFontSizeId {
  if (typeof window === "undefined") return DEFAULT_SIZE;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (hasCache && raw === cachedRaw) return cachedSize;
  cachedRaw = raw;
  hasCache = true;
  if (raw && isBibleFontSizeId(raw)) {
    cachedSize = raw;
    return cachedSize;
  }
  cachedSize = DEFAULT_SIZE;
  return cachedSize;
}

export function writeBibleFontSize(size: BibleFontSizeId) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, size);
  cachedRaw = size;
  cachedSize = size;
  hasCache = true;
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeBibleFontSize(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const wrapped = () => {
    hasCache = false;
    onChange();
  };
  window.addEventListener(EVENT, wrapped);
  window.addEventListener("storage", wrapped);
  return () => {
    window.removeEventListener(EVENT, wrapped);
    window.removeEventListener("storage", wrapped);
  };
}

export function getServerBibleFontSize(): BibleFontSizeId {
  return DEFAULT_SIZE;
}

export function stepBibleFontSize(
  current: BibleFontSizeId,
  direction: -1 | 1,
): BibleFontSizeId {
  const index = BIBLE_FONT_SIZE_OPTIONS.findIndex((item) => item.id === current);
  const next = Math.min(
    BIBLE_FONT_SIZE_OPTIONS.length - 1,
    Math.max(0, (index < 0 ? 1 : index) + direction),
  );
  return BIBLE_FONT_SIZE_OPTIONS[next]!.id;
}
