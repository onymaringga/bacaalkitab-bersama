"use client";

import { useMemo, useSyncExternalStore } from "react";
import { format, subDays } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Check, Flame } from "lucide-react";
import Link from "next/link";

import { copy } from "@/lib/copy";

import {
  DEMO_PROGRAM_START,
  countMissedAssignedDays,
  getDefaultCompletedDates,
  getScheduledReadingForDate,
  hasAssignedPassage,
  readCompletedDates,
} from "@/lib/reading-progress";
import { getTodayKey } from "@/lib/reading-status";
import { cn } from "@/lib/utils";

const SERVER_COMPLETED = getDefaultCompletedDates();

let cachedKey: string | null = null;
let cachedList: string[] | null = null;

type DayStatus = "completed" | "missed" | "pending" | "empty";

type DayRow = {
  dateKey: string;
  weekdayLabel: string;
  dayLabel: string;
  passage: string | null;
  isToday: boolean;
  status: DayStatus;
};

function getCompletedSnapshot() {
  const list = readCompletedDates();
  const key = list.join("|");
  if (cachedList && cachedKey === key) return cachedList;
  cachedKey = key;
  cachedList = list;
  return cachedList;
}

function getServerSnapshot() {
  return SERVER_COMPLETED;
}

function subscribe(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const wrapped = () => {
    cachedKey = null;
    cachedList = null;
    onChange();
  };
  window.addEventListener("reading-progress-updated", wrapped);
  window.addEventListener("storage", wrapped);
  return () => {
    window.removeEventListener("reading-progress-updated", wrapped);
    window.removeEventListener("storage", wrapped);
  };
}

/** Label hari singkat unik — pakai locale ID (Sen, Min, Sel…) bukan inisial ambigu. */
function weekdayShortLabel(date: Date) {
  return format(date, "EEE", { locale: localeId });
}

/** Tanggal bulan untuk membedakan hari dengan inisial sama. */
function dayOfMonthLabel(date: Date) {
  return format(date, "d", { locale: localeId });
}

function buildLast7Days(completed: Set<string>, todayKey: string): DayRow[] {
  const today = new Date(`${todayKey}T12:00:00`);
  const rows: DayRow[] = [];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = subDays(today, offset);
    const dateKey = format(date, "yyyy-MM-dd");
    const hasPassage =
      dateKey >= DEMO_PROGRAM_START && hasAssignedPassage(dateKey);
    const isToday = dateKey === todayKey;
    const done = completed.has(dateKey);
    const reading = hasPassage ? getScheduledReadingForDate(dateKey) : null;

    let status: DayStatus = "empty";
    if (!hasPassage) status = "empty";
    else if (done) status = "completed";
    else if (isToday) status = "pending";
    else if (dateKey < todayKey) status = "missed";
    else status = "pending";

    rows.push({
      dateKey,
      weekdayLabel: weekdayShortLabel(date),
      dayLabel: dayOfMonthLabel(date),
      passage: reading?.passage ?? null,
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

type ReadingWeekPanelProps = {
  className?: string;
};

export function ReadingWeekPanel({ className }: ReadingWeekPanelProps) {
  const todayKey = getTodayKey();
  const completedList = useSyncExternalStore(
    subscribe,
    getCompletedSnapshot,
    getServerSnapshot,
  );
  const completed = useMemo(
    () => new Set(completedList),
    [completedList],
  );
  const days = useMemo(
    () => buildLast7Days(completed, todayKey),
    [completed, todayKey],
  );
  const streak = useMemo(
    () => computeStreak(completed, todayKey),
    [completed, todayKey],
  );
  const missedDays = useMemo(
    () => countMissedAssignedDays(todayKey),
    [completedList, todayKey],
  );

  const encourage =
    streak >= 7
      ? {
          title: "Pertahankan streak-mu!",
          body: "Tuhan senang dengan ketekunanmu.",
        }
      : streak > 0
        ? {
            title: "Terus konsisten!",
            body: "Satu hari lagi membangun kebiasaan yang baik.",
          }
        : {
            title: "Mulai streak hari ini",
            body: "Baca sedikit saja — langkah kecil tetap berarti.",
          };

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90",
        className,
      )}
    >
      <div className="flex flex-col items-center px-4 py-4 text-center sm:px-5 sm:py-5">
        <div className="flex w-full items-center justify-center gap-1.5">
          <Flame
            className="size-4 shrink-0 text-orange-500"
            fill="currentColor"
          />
          <h2 className="text-sm font-semibold tracking-tight text-[var(--m-ink)]">
            Streak pribadi
          </h2>
        </div>

        <p className="mt-3 font-bold tabular-nums leading-none text-orange-500 text-[clamp(2.25rem,5vw,2.75rem)]">
          {streak}
        </p>
        <p className="mt-1 text-xs font-medium text-[var(--m-ink-soft)]">
          hari berturut-turut
        </p>

        {missedDays > 0 ? (
          <Link
            href="/jadwal"
            className="mt-2 text-xs font-semibold text-[var(--status-warning-text)] hover:underline"
          >
            {copy.home.missedDaysLabel(missedDays)} · {copy.home.missedDaysCta}
          </Link>
        ) : null}

        <div className="mt-4 grid w-full max-w-[16rem] grid-cols-7 gap-1">
          {days.map((day) => {
            const done = day.status === "completed";
            const href =
              day.passage && day.status !== "empty"
                ? `/baca?passage=${encodeURIComponent(day.passage)}&date=${encodeURIComponent(day.dateKey)}`
                : null;

            const cell = (
              <span className="flex flex-col items-center gap-1">
                <span
                  className={cn(
                    "text-[10px] font-semibold",
                    day.isToday
                      ? "text-[var(--m-accent)]"
                      : "text-[var(--m-ink-soft)]",
                  )}
                >
                  {day.weekdayLabel}
                </span>
                <span
                  className={cn(
                    "flex size-7 flex-col items-center justify-center rounded-full text-[10px] font-bold tabular-nums transition-colors",
                    done
                      ? "bg-emerald-600 text-white"
                      : "border-2 border-[var(--m-line)] bg-white text-[var(--m-ink-soft)]",
                    day.isToday && !done && "border-[var(--m-accent)] text-[var(--m-accent)]",
                  )}
                  title={format(new Date(`${day.dateKey}T12:00:00`), "EEEE, d MMM", {
                    locale: localeId,
                  })}
                >
                  {done ? (
                    <Check className="size-3.5 stroke-[2.5] text-white" />
                  ) : (
                    day.dayLabel
                  )}
                </span>
              </span>
            );

            return href ? (
              <Link
                key={day.dateKey}
                href={href}
                className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-accent)]/40"
                aria-label={`${format(new Date(`${day.dateKey}T12:00:00`), "EEEE, d MMMM", { locale: localeId })}${done ? " · sudah baca" : day.isToday ? " · hari ini" : ""}`}
              >
                {cell}
              </Link>
            ) : (
              <div
                key={day.dateKey}
                aria-label={
                  day.isToday
                    ? `${format(new Date(`${day.dateKey}T12:00:00`), "EEEE, d MMMM", { locale: localeId })} · hari ini`
                    : undefined
                }
              >
                {cell}
              </div>
            );
          })}
        </div>

        <div className="mt-4 w-full rounded-xl bg-emerald-50 px-3.5 py-3 text-left">
          <p className="text-sm font-semibold text-[var(--m-ink)]">
            {encourage.title}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-[var(--m-ink-soft)]">
            {encourage.body}
          </p>
        </div>
      </div>
    </section>
  );
}
