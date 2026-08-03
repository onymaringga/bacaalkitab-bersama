"use client";

import { useMemo, useState } from "react";

import { MonthPeriodNav } from "@/components/schedule/month-period-nav";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  buildDayCells,
  countStatuses,
  getWeekdayLabels,
  listMonthOptions,
  parseMonthKey,
  STATUS_COLORS,
  STATUS_LABELS,
  toMonthKey,
} from "@/lib/calendar-utils";
import { formatShortDate } from "@/lib/format-date";
import { copy } from "@/lib/copy";
import { schedulesByDate } from "@/lib/reading-progress";
import type { ReadingSchedule } from "@/lib/types";
import { cn } from "@/lib/utils";

type ReadingCalendarProps = {
  schedules: ReadingSchedule[];
  completedDates: Set<string>;
  onSelectDate: (dateKey: string, schedule?: ReadingSchedule) => void;
};

/** Ringkas label pasal di sel kalender (desktop). */
function compactPassageLabel(passage: string) {
  const trimmed = passage.replace(/\s+/g, " ").trim();
  if (trimmed === "Belum dijadwalkan") return "Belum diisi";
  if (trimmed.length <= 14) return trimmed.replace(/-/g, "–");
  const match = trimmed.match(/^(.+?)\s+(\d+(?:\s*[-–]\s*\d+)?)$/);
  if (!match) return trimmed;
  const [, book, chapters] = match;
  const shortBook =
    book.length > 6 ? `${book.slice(0, 3).replace(/\.$/, "")}.` : book;
  return `${shortBook} ${chapters.replace(/\s*-\s*/g, "–")}`;
}

export function ReadingCalendar({
  schedules,
  completedDates,
  onSelectDate,
}: ReadingCalendarProps) {
  const monthOptions = useMemo(() => listMonthOptions(schedules), [schedules]);
  const [monthKey, setMonthKey] = useState(() => {
    const nowKey = toMonthKey(new Date());
    if (monthOptions.some((option) => option.key === nowKey)) return nowKey;
    return monthOptions[0]?.key ?? toMonthKey(new Date());
  });

  const month = parseMonthKey(monthKey);
  const scheduleMap = useMemo(() => schedulesByDate(schedules), [schedules]);
  const cells = useMemo(
    () => buildDayCells(month, scheduleMap, completedDates),
    [month, scheduleMap, completedDates],
  );
  const stats = useMemo(() => countStatuses(cells), [cells]);
  const weekdayLabels = getWeekdayLabels();

  return (
    <TooltipProvider delayDuration={180}>
      <div className="space-y-3 sm:space-y-4">
        <MonthPeriodNav
          value={monthKey}
          options={monthOptions}
          onChange={setMonthKey}
          className="flex w-full items-center gap-1 rounded-2xl border border-[var(--m-line)] bg-[var(--m-wash)]/40 p-1"
        />

        <div
          className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-[var(--m-wash)]/25 p-1.5 sm:bg-transparent sm:p-0 sm:border-0"
          role="grid"
          aria-label={copy.schedule.calendarTitle}
        >
          <div className="grid grid-cols-7 gap-0.5 sm:gap-2" role="row">
            {weekdayLabels.map((label) => (
              <div
                key={label}
                role="columnheader"
                className="py-1.5 text-center text-[10px] font-semibold tracking-[0.06em] text-[var(--m-ink-soft)] uppercase sm:py-1 sm:text-[11px] sm:tracking-[0.08em]"
              >
                <span className="sm:hidden">{label.charAt(0)}</span>
                <span className="hidden sm:inline">{label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5 sm:gap-2" role="rowgroup">
            {cells.map((cell) => {
              const colors = STATUS_COLORS[cell.status];
              const hasSchedule = Boolean(cell.schedule);
              const passageLabel =
                cell.schedule && cell.schedule.passage
                  ? compactPassageLabel(cell.schedule.passage)
                  : null;
              const labelParts = [
                formatShortDate(cell.dateKey),
                STATUS_LABELS[cell.status],
                cell.schedule?.passage,
                cell.schedule?.title,
              ].filter(Boolean);

              if (!cell.inMonth) {
                return (
                  <div
                    key={cell.dateKey}
                    className="aspect-square min-h-0 sm:aspect-auto sm:min-h-16"
                    aria-hidden
                  />
                );
              }

              return (
                <div key={cell.dateKey} className="min-w-0" role="gridcell">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() =>
                          onSelectDate(cell.dateKey, cell.schedule)
                        }
                        className={cn(
                          "group relative flex w-full flex-col text-left transition-colors duration-150",
                          "aspect-square items-center justify-center gap-0.5 rounded-xl px-0.5 py-1",
                          "sm:aspect-auto sm:min-h-16 sm:items-stretch sm:justify-start sm:gap-1 sm:rounded-2xl sm:px-2 sm:py-2",
                          colors.bg,
                          colors.text,
                          "ring-1",
                          colors.ring,
                          hasSchedule && "cursor-pointer active:scale-[0.97]",
                          "sm:hover:-translate-y-0.5 sm:hover:shadow-[var(--shadow-soft)] sm:hover:ring-[var(--m-accent)]/35",
                          cell.status === "today" &&
                            "ring-2 ring-[var(--m-accent)] shadow-sm sm:shadow-[var(--shadow-soft)]",
                        )}
                        aria-label={labelParts.join(" · ")}
                      >
                        <span className="flex w-full items-center justify-center gap-1 sm:justify-between">
                          <span
                            className={cn(
                              "inline-flex size-7 items-center justify-center rounded-full text-[12px] font-bold tabular-nums sm:rounded-lg sm:text-xs",
                              cell.status === "today" &&
                                "bg-[var(--m-accent)] text-white",
                              cell.status === "completed" &&
                                "bg-emerald-600/15 text-emerald-800",
                              cell.status === "missed" &&
                                "bg-red-500/12 text-red-800",
                              cell.status === "upcoming" &&
                                hasSchedule &&
                                "bg-white/70 text-[var(--m-ink)] sm:bg-transparent",
                              cell.status === "none" &&
                                "text-[var(--m-ink-soft)]",
                            )}
                          >
                            {cell.date.getDate()}
                          </span>
                          {cell.schedule && cell.status !== "none" ? (
                            <span
                              className={cn(
                                "hidden size-2 shrink-0 rounded-full sm:block",
                                colors.dot,
                              )}
                              aria-hidden
                            />
                          ) : null}
                        </span>

                        {cell.schedule && cell.status !== "none" ? (
                          <span
                            className={cn(
                              "size-1 rounded-full sm:hidden",
                              colors.dot,
                            )}
                            aria-hidden
                          />
                        ) : (
                          <span className="size-1 sm:hidden" aria-hidden />
                        )}

                        {passageLabel ? (
                          <span className="mt-auto hidden line-clamp-2 text-[10px] leading-snug font-semibold sm:block">
                            {passageLabel}
                          </span>
                        ) : (
                          <span className="mt-auto hidden text-[8px] leading-none opacity-35 sm:block">
                            —
                          </span>
                        )}

                        <span
                          className={cn(
                            "absolute inset-x-1 bottom-0.5 h-0.5 rounded-full opacity-90 sm:inset-x-0 sm:bottom-0 sm:rounded-none",
                            cell.status === "completed" && "bg-emerald-500",
                            cell.status === "missed" && "bg-red-400",
                            cell.status === "today" && "bg-[var(--m-accent)]",
                            cell.status === "upcoming" &&
                              "bg-[var(--m-ink-soft)]/30",
                            cell.status === "none" && "bg-transparent",
                          )}
                          aria-hidden
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="hidden max-w-[16rem] space-y-1 px-3 py-2.5 text-left sm:block"
                    >
                      <p className="text-[11px] font-semibold tracking-wide uppercase opacity-80">
                        {formatShortDate(cell.dateKey)} ·{" "}
                        {STATUS_LABELS[cell.status]}
                      </p>
                      {cell.schedule ? (
                        <>
                          <p className="text-sm font-semibold leading-snug">
                            {cell.schedule.passage}
                          </p>
                          <p className="text-xs leading-snug opacity-85">
                            {cell.schedule.title}
                          </p>
                          <p className="pt-0.5 text-[11px] opacity-70">
                            Klik untuk melihat detail
                          </p>
                        </>
                      ) : (
                        <p className="text-xs opacity-85">
                          Tidak ada bacaan terjadwal
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-0.5 sm:grid sm:grid-cols-3 sm:gap-2 sm:overflow-visible">
          <LegendItem
            status="completed"
            label={STATUS_LABELS.completed}
            count={stats.completed}
          />
          <LegendItem
            status="missed"
            label={STATUS_LABELS.missed}
            count={stats.missed}
          />
          <LegendItem
            status="upcoming"
            label={STATUS_LABELS.upcoming}
            count={stats.upcoming}
          />
        </div>

        <p className="text-center text-[11px] text-[var(--m-ink-soft)] sm:hidden">
          Ketuk tanggal untuk melihat bacaan
        </p>
      </div>
    </TooltipProvider>
  );
}

function LegendItem({
  status,
  label,
  count,
}: {
  status: keyof typeof STATUS_COLORS;
  label: string;
  count: number;
}) {
  const colors = STATUS_COLORS[status];

  return (
    <div className="flex min-w-[7.5rem] flex-1 items-center gap-2 rounded-xl border border-[var(--m-line)] bg-white/90 px-2.5 py-2 sm:min-w-0">
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-lg",
          colors.bg,
        )}
      >
        <span className={cn("size-2 rounded-full", colors.dot)} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] leading-tight text-[var(--m-ink-soft)] sm:text-[11px]">
          {label}
        </p>
        <p className="text-sm font-semibold tabular-nums text-[var(--m-ink)]">
          {count}
          <span className="ml-0.5 text-[10px] font-medium text-[var(--m-ink-soft)] sm:text-[11px]">
            {copy.schedule.statsDaysUnit}
          </span>
        </p>
      </div>
    </div>
  );
}
