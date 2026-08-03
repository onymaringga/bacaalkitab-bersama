/** Preferensi tema tampilan baca Alkitab (disimpan lokal). */

export type BibleReadingThemeId = "classic" | "kindle" | "night";

export type BibleReadingThemeOption = {
  id: BibleReadingThemeId;
  label: string;
  description: string;
};

export const BIBLE_READING_THEME_OPTIONS: BibleReadingThemeOption[] = [
  {
    id: "classic",
    label: "Standar",
    description: "Tampilan terang",
  },
  {
    id: "kindle",
    label: "Kindle",
    description: "Halaman e-reader: sepia, serif",
  },
  {
    id: "night",
    label: "Gelap",
    description: "Mode malam — nyaman di cahaya redup",
  },
];

const STORAGE_KEY = "bacaalkitab-bible-reading-theme";
const EVENT = "bible-reading-theme-updated";
const DEFAULT_THEME: BibleReadingThemeId = "classic";

const IDS = new Set<BibleReadingThemeId>(
  BIBLE_READING_THEME_OPTIONS.map((item) => item.id),
);

let cachedRaw: string | null = null;
let cachedTheme: BibleReadingThemeId = DEFAULT_THEME;
let hasCache = false;

function isBibleReadingThemeId(value: string): value is BibleReadingThemeId {
  return IDS.has(value as BibleReadingThemeId);
}

export function getBibleReadingThemeOption(id: BibleReadingThemeId) {
  return (
    BIBLE_READING_THEME_OPTIONS.find((item) => item.id === id) ??
    BIBLE_READING_THEME_OPTIONS[0]!
  );
}

export function readBibleReadingTheme(): BibleReadingThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (hasCache && raw === cachedRaw) return cachedTheme;
  cachedRaw = raw;
  hasCache = true;
  if (raw && isBibleReadingThemeId(raw)) {
    cachedTheme = raw;
    return cachedTheme;
  }
  cachedTheme = DEFAULT_THEME;
  return cachedTheme;
}

export function writeBibleReadingTheme(theme: BibleReadingThemeId) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, theme);
  cachedRaw = theme;
  cachedTheme = theme;
  hasCache = true;
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeBibleReadingTheme(onChange: () => void) {
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

export function getServerBibleReadingTheme(): BibleReadingThemeId {
  return DEFAULT_THEME;
}

/**
 * Terapkan tema Gelap/Kindle ke chrome halaman (.member-web + html)
 * saat pembaca Alkitab aktif. Panggil dengan null untuk membersihkan.
 */
export function applyBiblePageTheme(theme: BibleReadingThemeId | null) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  const root = document.querySelector(".member-web");
  const immersive = theme === "night" || theme === "kindle";

  if (immersive && theme) {
    html.setAttribute("data-bible-page-theme", theme);
    html.style.colorScheme = theme === "night" ? "dark" : "light";
    root?.setAttribute("data-bible-page-theme", theme);
  } else {
    html.removeAttribute("data-bible-page-theme");
    html.style.colorScheme = "";
    root?.removeAttribute("data-bible-page-theme");
  }
}

export function toggleBibleReadingTheme(
  current: BibleReadingThemeId,
): BibleReadingThemeId {
  const order = BIBLE_READING_THEME_OPTIONS.map((item) => item.id);
  const index = order.indexOf(current);
  return order[(index + 1) % order.length]!;
}
