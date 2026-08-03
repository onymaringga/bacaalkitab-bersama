export type UrgencyLevel = "ok" | "watch" | "urgent";

export type UrgencyMeta = {
  level: UrgencyLevel;
  label: string;
  /** Tailwind-friendly CSS variable classes */
  badge: string;
  dot: string;
  bar: string;
  border: string;
  wash: string;
};

const URGENCY: Record<UrgencyLevel, UrgencyMeta> = {
  ok: {
    level: "ok",
    label: "Sehat",
    badge:
      "bg-[var(--status-success-bg)] text-[var(--status-success-text)]",
    dot: "bg-[var(--status-success-text)]",
    bar: "bg-[var(--status-success-text)]",
    border: "border-[var(--status-success-ring)]",
    wash: "bg-[var(--status-success-bg)]/40",
  },
  watch: {
    level: "watch",
    label: "Perlu perhatian",
    badge:
      "bg-[var(--status-warning-bg)] text-[var(--status-warning-text)]",
    dot: "bg-[var(--status-warning-text)]",
    bar: "bg-[var(--status-warning-text)]",
    border: "border-[var(--status-warning-text)]/25",
    wash: "bg-[var(--status-warning-bg)]/50",
  },
  urgent: {
    level: "urgent",
    label: "Urgensi tinggi",
    badge: "bg-[var(--status-danger-bg)] text-[var(--status-danger-text)]",
    dot: "bg-[var(--status-danger-text)]",
    bar: "bg-[var(--status-danger-text)]",
    border: "border-[var(--status-danger-ring)]",
    wash: "bg-[var(--status-danger-bg)]/40",
  },
};

export function getUrgencyMeta(level: UrgencyLevel): UrgencyMeta {
  return URGENCY[level];
}

/** Semakin rendah persen, semakin urgent. */
export function urgencyFromRate(pct: number): UrgencyLevel {
  if (pct >= 75) return "ok";
  if (pct >= 50) return "watch";
  return "urgent";
}

export const URGENCY_LEGEND: UrgencyMeta[] = [
  URGENCY.ok,
  URGENCY.watch,
  URGENCY.urgent,
];
