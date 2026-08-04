export type JournalPaperType = "grid" | "lined" | "dotted" | "blank";

export const JOURNAL_PAPER_TYPES: { id: JournalPaperType; label: string }[] = [
  { id: "grid", label: "Kotak" },
  { id: "lined", label: "Garis" },
  { id: "dotted", label: "Titik" },
  { id: "blank", label: "Polos" },
];

export function isJournalPaperType(value: unknown): value is JournalPaperType {
  return JOURNAL_PAPER_TYPES.some((type) => type.id === value);
}

export function normalizeJournalPaperType(value: unknown): JournalPaperType {
  return isJournalPaperType(value) ? value : "grid";
}

function isDarkPaperColor(hex: string) {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return false;
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.55;
}

type PaperPatternStyle = {
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  opacity?: number;
};

export function getJournalPaperPatternStyle(
  paperType: JournalPaperType,
  backgroundColor: string,
): PaperPatternStyle | null {
  if (paperType === "blank") return null;

  const dark = isDarkPaperColor(backgroundColor);
  const line = dark ? "rgba(255,255,255,0.1)" : "rgba(100,116,139,0.16)";
  const dot = dark ? "rgba(255,255,255,0.18)" : "rgba(100,116,139,0.22)";

  switch (paperType) {
    case "grid":
      return {
        backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
        opacity: 1,
      };
    case "lined":
      return {
        backgroundImage: `linear-gradient(${line} 1px, transparent 1px)`,
        backgroundSize: "100% 24px",
        backgroundPosition: "0 18px",
        opacity: 1,
      };
    case "dotted":
      return {
        backgroundImage: `radial-gradient(circle, ${dot} 1px, transparent 1px)`,
        backgroundSize: "18px 18px",
        opacity: 1,
      };
    default:
      return null;
  }
}

export function getJournalPaperPreviewStyle(
  paperType: JournalPaperType,
  backgroundColor: string,
) {
  const pattern = getJournalPaperPatternStyle(paperType, backgroundColor);
  return {
    backgroundColor,
    ...(pattern ?? {}),
  };
}
