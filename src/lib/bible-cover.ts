"use client";

export type BibleCoverColorId =
  | "navy"
  | "burgundy"
  | "forest"
  | "charcoal"
  | "camel"
  | "plum"
  | "black";

export type BibleCoverImageId =
  | "none"
  | "cross"
  | "dove"
  | "fish"
  | "wheat"
  | "custom";

export type BibleCoverPrefs = {
  colorId: BibleCoverColorId;
  title: string;
  subtitle: string;
  imageId: BibleCoverImageId;
  /** Data URL jika imageId = custom */
  customImageDataUrl?: string;
};

export const BIBLE_COVER_COLORS: {
  id: BibleCoverColorId;
  label: string;
  base: string;
  deep: string;
  edge: string;
  foil: string;
}[] = [
  {
    id: "navy",
    label: "Navy",
    base: "#1e3a5f",
    deep: "#132849",
    edge: "#0c1a30",
    foil: "#d4af37",
  },
  {
    id: "burgundy",
    label: "Maroon",
    base: "#6b1e2a",
    deep: "#4a121c",
    edge: "#2e0b12",
    foil: "#e8c872",
  },
  {
    id: "forest",
    label: "Hijau tua",
    base: "#1f4d3a",
    deep: "#143528",
    edge: "#0c2118",
    foil: "#d7c48a",
  },
  {
    id: "charcoal",
    label: "Abu",
    base: "#2f343b",
    deep: "#1d2126",
    edge: "#12151a",
    foil: "#c9b896",
  },
  {
    id: "camel",
    label: "Cokelat",
    base: "#8a5a32",
    deep: "#6a4224",
    edge: "#3f2614",
    foil: "#f0e2c0",
  },
  {
    id: "plum",
    label: "Ungu",
    base: "#4a2c5a",
    deep: "#321c3e",
    edge: "#1e1026",
    foil: "#e4c96b",
  },
  {
    id: "black",
    label: "Hitam",
    base: "#1a1a1a",
    deep: "#0d0d0d",
    edge: "#050505",
    foil: "#c9a227",
  },
];

export const BIBLE_COVER_IMAGES: {
  id: Exclude<BibleCoverImageId, "custom">;
  label: string;
}[] = [
  { id: "none", label: "Tanpa gambar" },
  { id: "cross", label: "Salib" },
  { id: "dove", label: "Merpati" },
  { id: "fish", label: "Ikan" },
  { id: "wheat", label: "Gandum" },
];

export const DEFAULT_BIBLE_COVER: BibleCoverPrefs = {
  colorId: "navy",
  title: "Alkitab",
  subtitle: "Firman-Mu pelita bagi kakiku",
  imageId: "cross",
};

const STORAGE_KEY = "bacaalkitab-bible-cover-v1";
const EVENT = "bible-cover-updated";

let cachedRaw: string | null = null;
let cachedPrefs: BibleCoverPrefs = DEFAULT_BIBLE_COVER;
let hasCache = false;

function isColorId(value: unknown): value is BibleCoverColorId {
  return BIBLE_COVER_COLORS.some((item) => item.id === value);
}

function isImageId(value: unknown): value is BibleCoverImageId {
  return (
    value === "custom" ||
    BIBLE_COVER_IMAGES.some((item) => item.id === value)
  );
}

function normalizePrefs(raw: unknown): BibleCoverPrefs {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_BIBLE_COVER };
  const data = raw as Partial<BibleCoverPrefs>;
  return {
    colorId: isColorId(data.colorId) ? data.colorId : DEFAULT_BIBLE_COVER.colorId,
    title:
      typeof data.title === "string" && data.title.trim()
        ? data.title.slice(0, 48)
        : DEFAULT_BIBLE_COVER.title,
    subtitle:
      typeof data.subtitle === "string"
        ? data.subtitle.slice(0, 80)
        : DEFAULT_BIBLE_COVER.subtitle,
    imageId: isImageId(data.imageId) ? data.imageId : DEFAULT_BIBLE_COVER.imageId,
    customImageDataUrl:
      typeof data.customImageDataUrl === "string"
        ? data.customImageDataUrl
        : undefined,
  };
}

export function getBibleCoverColor(id: BibleCoverColorId) {
  return (
    BIBLE_COVER_COLORS.find((item) => item.id === id) ?? BIBLE_COVER_COLORS[0]!
  );
}

export function readBibleCover(): BibleCoverPrefs {
  if (typeof window === "undefined") return DEFAULT_BIBLE_COVER;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (hasCache && raw === cachedRaw) return cachedPrefs;
  cachedRaw = raw;
  hasCache = true;
  if (!raw) {
    cachedPrefs = { ...DEFAULT_BIBLE_COVER };
    return cachedPrefs;
  }
  try {
    cachedPrefs = normalizePrefs(JSON.parse(raw));
  } catch {
    cachedPrefs = { ...DEFAULT_BIBLE_COVER };
  }
  return cachedPrefs;
}

export function writeBibleCover(prefs: BibleCoverPrefs) {
  if (typeof window === "undefined") return;
  const next = normalizePrefs(prefs);
  const raw = JSON.stringify(next);
  window.localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedPrefs = next;
  hasCache = true;
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeBibleCover(onChange: () => void) {
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

export function getServerBibleCover(): BibleCoverPrefs {
  return DEFAULT_BIBLE_COVER;
}

/** Kompres gambar upload supaya muat di localStorage. */
export async function fileToCoverDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const maxSide = 720;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak tersedia");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.82);
}
