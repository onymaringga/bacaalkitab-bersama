export const JOURNAL_MOODS = [
  { id: "senang", emoji: "😊", label: "Senang" },
  { id: "bersyukur", emoji: "🙏", label: "Bersyukur" },
  { id: "tenang", emoji: "😌", label: "Tenang" },
  { id: "sedih", emoji: "😢", label: "Sedih" },
  { id: "cemas", emoji: "😰", label: "Cemas" },
  { id: "lelah", emoji: "😴", label: "Lelah" },
  { id: "harap", emoji: "🌱", label: "Penuh harap" },
  { id: "marah", emoji: "😤", label: "Marah" },
] as const;

export const JOURNAL_COLORS = [
  { id: "white", value: "#ffffff", label: "Putih" },
  { id: "cream", value: "#fffbeb", label: "Krem" },
  { id: "kraft", value: "#f5e6c8", label: "Kraft" },
  { id: "rose", value: "#fff1f2", label: "Mawar" },
  { id: "sky", value: "#eff6ff", label: "Langit" },
  { id: "mint", value: "#ecfdf5", label: "Mint" },
  { id: "lavender", value: "#f5f3ff", label: "Ungu" },
  { id: "peach", value: "#fff7ed", label: "Persik" },
  { id: "lemon", value: "#fefce8", label: "Lemon" },
  { id: "sage", value: "#f0fdf4", label: "Sage" },
  { id: "slate", value: "#1e293b", label: "Gelap" },
  { id: "night", value: "#0f172a", label: "Malam" },
] as const;

export const JOURNAL_TEXT_COLORS = [
  "#1e293b",
  "#dc2626",
  "#2563eb",
  "#059669",
  "#9333ea",
  "#ea580c",
] as const;

export const JOURNAL_FONT_SIZES = [13, 15, 18, 22, 28] as const;

export type JournalFontFamilyId = "display" | "sans" | "serif" | "script" | "mono";

export const JOURNAL_FONT_FAMILIES: {
  id: JournalFontFamilyId;
  label: string;
  family: string;
}[] = [
  {
    id: "display",
    label: "Elegan",
    family: 'var(--font-member-display), Georgia, "Times New Roman", serif',
  },
  {
    id: "sans",
    label: "Modern",
    family: 'var(--font-member-sans), system-ui, sans-serif',
  },
  {
    id: "serif",
    label: "Klasik",
    family: 'Georgia, "Times New Roman", serif',
  },
  {
    id: "script",
    label: "Tulis tangan",
    family: 'var(--font-member-script), "Segoe Script", cursive',
  },
  {
    id: "mono",
    label: "Mesin tik",
    family: 'ui-monospace, "Courier New", monospace',
  },
];

export function getJournalFontFamily(id?: string) {
  return (
    JOURNAL_FONT_FAMILIES.find((font) => font.id === id)?.family ??
    JOURNAL_FONT_FAMILIES[0]!.family
  );
}

export function getDefaultJournalFontFamily(element: {
  fontFamily?: string;
  passageRef?: string;
}) {
  if (element.fontFamily) return element.fontFamily as JournalFontFamilyId;
  return element.passageRef ? "sans" : "display";
}

export const JOURNAL_STICKERS = [
  "✨",
  "🙏",
  "💛",
  "🌿",
  "☀️",
  "🌧️",
  "❤️",
  "🕊️",
  "📖",
  "🌸",
  "⭐",
  "🎵",
  "💪",
  "🌈",
  "🕯️",
  "🍃",
  "💫",
  "🤍",
] as const;

export function getMoodLabel(id: string) {
  return JOURNAL_MOODS.find((m) => m.id === id)?.label ?? id;
}

export function getMoodEmoji(id: string) {
  return JOURNAL_MOODS.find((m) => m.id === id)?.emoji ?? "📝";
}

/** Payload sementara saat menambah ayat dari pembaca Alkitab ke jurnal. */
export const JOURNAL_VERSE_INSERT_KEY = "journal-verse-insert";

export type JournalVerseInsertPayload = {
  content: string;
  passageRef: string;
  passageLabel: string;
};
