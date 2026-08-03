"use client";

import { useMemo, useSyncExternalStore, type ReactNode } from "react";
import { format, subDays } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Flame, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

import { ProgressRing } from "@/components/ui/progress-ring";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DEMO_PROGRAM_START,
  getDefaultCompletedDates,
  getScheduledReadingForDate,
  hasAssignedPassage,
  readCompletedDates,
} from "@/lib/reading-progress";
import { getTodayKey } from "@/lib/reading-status";
import { cn } from "@/lib/utils";

const SERVER_COMPLETED_SNAPSHOT = getDefaultCompletedDates();

let cachedCompletedKey: string | null = null;
let cachedCompletedList: string[] | null = null;

type DayStatus = "completed" | "missed" | "pending" | "empty";

type DayCell = {
  dateKey: string;
  label: string;
  shortLabel: string;
  weekdayLabel: string;
  isToday: boolean;
  status: DayStatus;
};

function getCompletedSnapshot() {
  const list = readCompletedDates();
  const key = list.join("|");
  if (cachedCompletedList && cachedCompletedKey === key) {
    return cachedCompletedList;
  }
  cachedCompletedKey = key;
  cachedCompletedList = list;
  return cachedCompletedList;
}

function getServerCompletedSnapshot() {
  return SERVER_COMPLETED_SNAPSHOT;
}

function subscribeProgress(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const wrapped = () => {
    cachedCompletedKey = null;
    cachedCompletedList = null;
    onChange();
  };
  window.addEventListener("reading-progress-updated", wrapped);
  window.addEventListener("storage", wrapped);
  return () => {
    window.removeEventListener("reading-progress-updated", wrapped);
    window.removeEventListener("storage", wrapped);
  };
}

function buildLast14Days(completed: Set<string>, todayKey: string): DayCell[] {
  const today = new Date(`${todayKey}T12:00:00`);
  const rows: DayCell[] = [];

  for (let offset = 13; offset >= 0; offset -= 1) {
    const date = subDays(today, offset);
    const dateKey = format(date, "yyyy-MM-dd");
    const hasPassage =
      dateKey >= DEMO_PROGRAM_START && hasAssignedPassage(dateKey);
    const isToday = dateKey === todayKey;
    const done = completed.has(dateKey);

    let status: DayStatus = "empty";

    if (!hasPassage) {
      status = "empty";
    } else if (done) {
      status = "completed";
    } else if (isToday) {
      status = "pending";
    } else if (dateKey < todayKey) {
      status = "missed";
    } else {
      status = "pending";
    }

    rows.push({
      dateKey,
      label: format(date, "EEE, d MMM", { locale: localeId }),
      shortLabel: format(date, "d", { locale: localeId }),
      weekdayLabel: format(date, "EEE", { locale: localeId }),
      isToday,
      status,
    });
  }

  return rows;
}

function computeStreak(completed: Set<string>, todayKey: string) {
  let streak = 0;
  let cursor = new Date(`${todayKey}T12:00:00`);

  if (!completed.has(todayKey)) {
    cursor = subDays(cursor, 1);
  }

  for (let i = 0; i < 60; i += 1) {
    const key = format(cursor, "yyyy-MM-dd");
    if (key < DEMO_PROGRAM_START) break;
    if (!hasAssignedPassage(key)) {
      cursor = subDays(cursor, 1);
      continue;
    }
    if (!completed.has(key)) break;
    streak += 1;
    cursor = subDays(cursor, 1);
  }

  return streak;
}

function diligenceLabel(rate: number) {
  if (rate >= 85) return { title: "Sangat rajin", hint: "Konsistensimu menginspirasi." };
  if (rate >= 70) return { title: "Rajin", hint: "Terus jaga ritme bacamu." };
  if (rate >= 50) return { title: "Cukup baik", hint: "Sedikit lagi lebih konsisten." };
  if (rate >= 30) return { title: "Mulai bangkit", hint: "Satu pasal sehari sudah berarti." };
  return { title: "Perlu dorongan", hint: "Mulai lagi hari ini — tidak apa-apa." };
}

function statusLabel(status: DayStatus) {
  if (status === "completed") return "Selesai";
  if (status === "missed") return "Terlewat";
  if (status === "pending") return "Belum / hari ini";
  return "Tidak ada jadwal";
}

export function MemberDiligencePanel({ className }: { className?: string }) {
  const todayKey = getTodayKey();
  const completedList = useSyncExternalStore(
    subscribeProgress,
    getCompletedSnapshot,
    getServerCompletedSnapshot,
  );

  const completed = useMemo(
    () => new Set(completedList),
    [completedList],
  );

  const days = useMemo(
    () => buildLast14Days(completed, todayKey),
    [completed, todayKey],
  );

  const stats = useMemo(() => {
    const scheduled = days.filter((d) => d.status !== "empty");
    const done = scheduled.filter((d) => d.status === "completed").length;
    const missed = scheduled.filter((d) => d.status === "missed").length;
    const rate =
      scheduled.length === 0
        ? 0
        : Math.round((done / scheduled.length) * 100);
    const streak = computeStreak(completed, todayKey);
    return { done, missed, rate, streak, total: scheduled.length };
  }, [days, completed, todayKey]);

  const label = diligenceLabel(stats.rate);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--m-line)] px-4 py-3.5 sm:px-5">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 font-semibold text-[var(--m-ink)]">
            <TrendingUp className="size-4 shrink-0 text-[var(--m-accent)]" />
            Kerajinan bacaku
          </h2>
          <p className="mt-0.5 text-xs text-[var(--m-ink-soft)]">
            14 hari terakhir · {stats.done}/{stats.total} hari selesai
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--m-wash)] px-2.5 py-1 text-xs font-semibold text-[var(--m-accent)]">
          <Sparkles className="size-3.5" />
          {label.title}
        </div>
      </div>

      <div className="grid min-w-0 gap-5 p-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start sm:gap-6 sm:p-5">
        <div className="flex flex-col items-center gap-3 sm:items-start">
          <ProgressRing value={stats.rate} size={104} label="Tingkat kerajinan" />
          <p className="max-w-[11rem] text-center text-xs leading-relaxed text-[var(--m-ink-soft)] sm:text-left">
            {label.hint}
          </p>
        </div>

        <div className="min-w-0 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <StatChip
              icon={<Flame className="size-3.5 text-orange-500" />}
              label="Streak"
              value={`${stats.streak} hari`}
            />
            <StatChip label="Selesai" value={String(stats.done)} />
            <StatChip label="Terlewat" value={String(stats.missed)} />
          </div>

          <TooltipProvider delayDuration={150}>
            <div className="grid min-w-0 grid-cols-7 gap-1 sm:gap-1.5">
              {days.map((day) => (
                <DayPill key={day.dateKey} day={day} />
              ))}
            </div>
          </TooltipProvider>

          <div className="flex flex-wrap gap-3 text-[11px] text-[var(--m-ink-soft)]">
            <LegendSwatch className="bg-[var(--m-accent)]" label="Selesai" />
            <LegendSwatch
              className="border-2 border-[var(--m-accent)] bg-[var(--m-wash)]"
              label="Hari ini"
            />
            <LegendSwatch className="bg-[var(--status-warning-bg)]" label="Terlewat" />
          </div>
        </div>
      </div>
    </section>
  );
}

function DayPill({ day }: { day: DayCell }) {
  const reading = getScheduledReadingForDate(day.dateKey);
  const href = reading
    ? `/baca?tab=alkitab&passage=${encodeURIComponent(reading.passage)}&date=${encodeURIComponent(day.dateKey)}`
    : null;

  const content = (
    <div
      className={cn(
        "flex min-w-0 flex-col items-center justify-center rounded-xl px-0.5 py-2 text-center transition-colors sm:px-1",
        day.status === "completed" &&
          "bg-[var(--m-accent)] text-white shadow-sm",
        day.status === "missed" &&
          "bg-[var(--status-warning-bg)] text-[var(--status-warning-text)]",
        day.status === "pending" &&
          !day.isToday &&
          "bg-[var(--m-wash)] text-[var(--m-ink-soft)]",
        day.status === "pending" &&
          day.isToday &&
          "border-2 border-[var(--m-accent)] bg-[var(--m-wash)] text-[var(--m-accent)]",
        day.status === "empty" &&
          "border border-dashed border-[var(--m-line)] bg-transparent text-[var(--m-ink-soft)]/40",
        href && "hover:opacity-90 active:scale-[0.97]",
      )}
    >
      <span className="text-[9px] font-medium capitalize leading-none opacity-80">
        {day.weekdayLabel}
      </span>
      <span className="mt-1 text-sm font-bold tabular-nums leading-none">
        {day.shortLabel}
      </span>
    </div>
  );

  if (day.status === "empty" || !href || !reading) {
    return (
      <div aria-hidden className="opacity-60">
        {content}
      </div>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className="block w-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-accent)]/40"
          aria-label={`${day.label}: ${reading.passage} · ${statusLabel(day.status)}`}
        >
          {content}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        <p className="font-semibold capitalize">{day.label}</p>
        <p className="font-medium text-[var(--m-ink)]">{reading.passage}</p>
        <p className="text-[var(--m-ink-soft)]">{statusLabel(day.status)}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function StatChip({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--m-line)] bg-[var(--m-wash)]/40 px-2.5 py-2 text-center">
      <p className="flex items-center justify-center gap-1 text-[10px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
        {icon}
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold tabular-nums text-[var(--m-ink)]">
        {value}
      </p>
    </div>
  );
}

function LegendSwatch({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("size-2.5 rounded-sm", className)} aria-hidden />
      {label}
    </span>
  );
}
