import { copy } from "@/lib/copy";

export type DayReadingStatus =
  | "none"
  | "completed"
  | "missed"
  | "today"
  | "upcoming";

export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayKey() {
  return formatDateKey(new Date());
}

export function getDayReadingStatus(
  dateKey: string,
  hasSchedule: boolean,
  completedDates: Set<string>,
): DayReadingStatus {
  if (!hasSchedule) return "none";

  const today = getTodayKey();
  if (completedDates.has(dateKey)) return "completed";
  if (dateKey < today) return "missed";
  if (dateKey === today) return "today";
  return "upcoming";
}

export const STATUS_LABELS: Record<DayReadingStatus, string> =
  copy.schedule.status;

export const STATUS_COLORS: Record<
  DayReadingStatus,
  { bg: string; text: string; ring?: string; dot?: string }
> = {
  none: { bg: "bg-transparent", text: "text-muted-foreground/40" },
  completed: {
    bg: "bg-[var(--status-success-bg)]",
    text: "text-[var(--status-success-text)]",
    ring: "ring-[var(--status-success-ring)]",
    dot: "bg-emerald-500",
  },
  missed: {
    bg: "bg-[var(--status-danger-bg)]",
    text: "text-[var(--status-danger-text)]",
    ring: "ring-[var(--status-danger-ring)]",
    dot: "bg-red-500",
  },
  today: {
    bg: "bg-[var(--status-today-bg)]",
    text: "text-[var(--m-accent)]",
    ring: "ring-[var(--m-accent)]/40",
    dot: "bg-[var(--m-accent)]",
  },
  upcoming: {
    bg: "bg-[var(--m-wash)]/55",
    text: "text-[var(--m-ink-soft)]",
    ring: "ring-[var(--m-line)]",
    dot: "bg-[var(--m-ink-soft)]/45",
  },
};
