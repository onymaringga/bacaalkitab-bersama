"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  CheckCircle2,
  Circle,
  List,
  CalendarDays,
  PenLine,
  Library,
} from "lucide-react";

import { useDemoAuth } from "@/components/auth/demo-auth-provider";
import { BibleBookGrid } from "@/components/bible/bible-book-grid";
import { useRolePreview } from "@/components/role-preview/role-preview-provider";
import { ReadingCalendar } from "@/components/schedule/reading-calendar";
import { MonthPeriodNav } from "@/components/schedule/month-period-nav";
import { ScheduleDevotionalEditor } from "@/components/schedule/schedule-devotional-editor";
import { ReadingCard } from "@/components/reading/reading-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { showToast } from "@/components/ui/toast-host";
import { ReadingTimeLabel } from "@/components/ui/reading-time-label";
import { celebrateReadingComplete } from "@/lib/browser-notifications";
import type { BibleBook } from "@/lib/bible-books";
import { buildPassageReference } from "@/lib/passage-parser";
import { estimateReadingTimeForPassage } from "@/lib/reading-time";
import { copy } from "@/lib/copy";
import { demoSchedule, demoUser } from "@/lib/demo-data";
import { formatDisplayDate, formatShortDate } from "@/lib/format-date";
import {
  listMonthOptions,
  toMonthKey,
} from "@/lib/calendar-utils";
import {
  markDateComplete,
  markDateIncomplete,
  readCompletedDates,
} from "@/lib/reading-progress";
import {
  markPassageComplete,
  unmarkPassageComplete,
} from "@/lib/bible-completed-chapters";
import { getDayReadingStatus, getTodayKey, STATUS_LABELS } from "@/lib/reading-status";
import {
  authorRoleLabel,
  getScheduleDevotional,
  resolveScheduleReading,
  subscribeScheduleDevotionals,
} from "@/lib/schedule-devotional";
import {
  formatAvgChapters,
  getScheduleProgressStats,
  subscribeScheduleProgress,
} from "@/lib/schedule-progress-stats";
import type { ReadingSchedule } from "@/lib/types";
import { cn } from "@/lib/utils";

type ScheduleViewMode = "calendar" | "list" | "books";
type ListStatusFilter = "all" | "missed" | "completed";

const VIEW_STORAGE_KEY = "bacaalkitab-jadwal-view";
const LIST_FILTER_STORAGE_KEY = "bacaalkitab-jadwal-list-filter";

function readStoredView(): ScheduleViewMode {
  if (typeof window === "undefined") return "calendar";
  try {
    const value = localStorage.getItem(VIEW_STORAGE_KEY);
    if (value === "list" || value === "books") return value;
    return "calendar";
  } catch {
    return "calendar";
  }
}

function readStoredListFilter(): ListStatusFilter {
  if (typeof window === "undefined") return "all";
  try {
    const value = localStorage.getItem(LIST_FILTER_STORAGE_KEY);
    if (value === "missed" || value === "completed" || value === "all") {
      return value;
    }
    return "all";
  } catch {
    return "all";
  }
}

/** Tanggal target scroll: hari ini, atau bacaan terdekat. */
function resolveListScrollDate(
  list: ReadingSchedule[],
  todayKey: string,
): string | null {
  if (list.length === 0) return null;
  if (list.some((item) => item.scheduledDate === todayKey)) return todayKey;
  const upcoming = list.find((item) => item.scheduledDate >= todayKey);
  if (upcoming) return upcoming.scheduledDate;
  return list[list.length - 1]?.scheduledDate ?? null;
}

export function JadwalView({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter();
  const { session } = useDemoAuth();
  const { isLeaderView } = useRolePreview();
  const [completedDates, setCompletedDates] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<
    ReadingSchedule | undefined
  >();
  const [devotionalOpen, setDevotionalOpen] = useState(false);
  const [confirmToggle, setConfirmToggle] = useState<{
    dateKey: string;
    complete: boolean;
    passage: string;
  } | null>(null);
  const [version, setVersion] = useState(0);
  const [viewMode, setViewMode] = useState<ScheduleViewMode>("calendar");
  const [listMonthKey, setListMonthKey] = useState(() =>
    toMonthKey(new Date()),
  );
  const [listStatusFilter, setListStatusFilter] =
    useState<ListStatusFilter>("all");

  useEffect(() => {
    setCompletedDates(new Set(readCompletedDates()));
    setViewMode(readStoredView());
    setListStatusFilter(readStoredListFilter());
  }, []);

  useEffect(() => {
    return subscribeScheduleProgress(() => {
      setCompletedDates(new Set(readCompletedDates()));
      setVersion((current) => current + 1);
    });
  }, []);

  useEffect(() => {
    return subscribeScheduleDevotionals(() => {
      setVersion((current) => current + 1);
    });
  }, []);

  function handleViewChange(mode: ScheduleViewMode) {
    setViewMode(mode);
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }

  function handleOpenBookChapter(book: BibleBook, chapterNum: number) {
    const parsed = buildPassageReference({
      bookName: book.name,
      bookAbbr: book.abbr,
      chapter: chapterNum,
      startVerse: 1,
      endVerse: 1,
      wholeChapter: true,
    });
    router.push(
      `/baca?browse=1&passage=${encodeURIComponent(parsed.reference)}`,
    );
  }

  const sortedSchedule = useMemo(
    () =>
      [...demoSchedule]
        .map(resolveScheduleReading)
        .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate)),
    [version],
  );

  /** List view: bacaan yang sudah diisi, difilter per bulan. */
  const monthOptions = useMemo(
    () => listMonthOptions(sortedSchedule),
    [sortedSchedule],
  );

  const listMonthItems = useMemo(() => {
    const assigned = sortedSchedule.filter(
      (item) => item.passage !== "Belum dijadwalkan",
    );
    const source = assigned.length > 0 ? assigned : sortedSchedule;
    return source.filter((item) =>
      item.scheduledDate.startsWith(listMonthKey),
    );
  }, [sortedSchedule, listMonthKey]);

  const listFilterCounts = useMemo(() => {
    let missed = 0;
    let completed = 0;
    for (const item of listMonthItems) {
      const status = getDayReadingStatus(
        item.scheduledDate,
        true,
        completedDates,
      );
      if (status === "missed") missed += 1;
      else if (status === "completed") completed += 1;
    }
    return {
      all: listMonthItems.length,
      missed,
      completed,
    };
  }, [listMonthItems, completedDates]);

  const listSchedule = useMemo(() => {
    if (listStatusFilter === "all") return listMonthItems;
    return listMonthItems.filter((item) => {
      const status = getDayReadingStatus(
        item.scheduledDate,
        true,
        completedDates,
      );
      if (listStatusFilter === "missed") return status === "missed";
      return status === "completed";
    });
  }, [listMonthItems, listStatusFilter, completedDates]);

  const todayKey = getTodayKey();

  function handleListFilterChange(filter: ListStatusFilter) {
    setListStatusFilter(filter);
    try {
      localStorage.setItem(LIST_FILTER_STORAGE_KEY, filter);
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    if (monthOptions.length === 0) return;
    if (monthOptions.some((option) => option.key === listMonthKey)) return;
    const todayMonth = toMonthKey(new Date());
    const fallback =
      monthOptions.find((option) => option.key === todayMonth)?.key ??
      monthOptions[0]?.key;
    if (fallback) setListMonthKey(fallback);
  }, [monthOptions, listMonthKey]);

  const listScrollDate = useMemo(
    () => resolveListScrollDate(listSchedule, todayKey),
    [listSchedule, todayKey],
  );

  useEffect(() => {
    if (viewMode !== "list" || !listScrollDate) return;

    const timer = window.setTimeout(() => {
      const el = document.getElementById(`jadwal-day-${listScrollDate}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [viewMode, listScrollDate]);

  function refreshCompleted() {
    setCompletedDates(new Set(readCompletedDates()));
  }

  function handleSelectDate(dateKey: string, schedule?: ReadingSchedule) {
    setSelectedDate(dateKey);
    setSelectedSchedule(
      schedule ? resolveScheduleReading(schedule) : undefined,
    );
  }

  function toggleComplete(dateKey: string, complete: boolean) {
    const schedule = sortedSchedule.find(
      (item) => item.scheduledDate === dateKey,
    );
    if (complete) {
      markDateComplete(dateKey);
      if (schedule && schedule.passage !== "Belum dijadwalkan") {
        markPassageComplete(schedule.passage);
        void celebrateReadingComplete(schedule.passage);
      }
      showToast(copy.schedule.markCompleteDone);
    } else {
      markDateIncomplete(dateKey);
      if (schedule && schedule.passage !== "Belum dijadwalkan") {
        unmarkPassageComplete(schedule.passage);
      }
      showToast(copy.schedule.markIncompleteDone);
    }
    refreshCompleted();
  }

  function requestToggleComplete(dateKey: string, complete: boolean) {
    const schedule = sortedSchedule.find(
      (item) => item.scheduledDate === dateKey,
    );
    setConfirmToggle({
      dateKey,
      complete,
      passage:
        schedule && schedule.passage !== "Belum dijadwalkan"
          ? schedule.passage
          : formatDisplayDate(dateKey),
    });
  }

  function confirmToggleComplete() {
    if (!confirmToggle) return;
    toggleComplete(confirmToggle.dateKey, confirmToggle.complete);
    setConfirmToggle(null);
  }

  const selectedStatus =
    selectedDate && selectedSchedule
      ? getDayReadingStatus(selectedDate, true, completedDates)
      : null;

  const selectedOfficial =
    selectedDate != null ? getScheduleDevotional(selectedDate) : null;
  const authorName = session?.name ?? demoUser.name;

  const resolvedSelected = selectedSchedule
    ? resolveScheduleReading(selectedSchedule)
    : undefined;

  const progressStats = useMemo(
    () => getScheduleProgressStats(sortedSchedule, completedDates),
    [sortedSchedule, completedDates, version],
  );

  const viewToggle = (
    <div
      role="group"
      aria-label={copy.schedule.viewToggleAria}
      className="inline-flex h-11 w-full max-w-full items-stretch rounded-xl border border-[var(--m-line)] bg-white/90 p-1 sm:w-auto"
    >
      {(
        [
          {
            id: "calendar" as const,
            label: copy.schedule.tabCalendar,
            Icon: CalendarDays,
          },
          {
            id: "list" as const,
            label: copy.schedule.tabList,
            Icon: List,
          },
          {
            id: "books" as const,
            label: copy.schedule.tabBooks,
            Icon: Library,
          },
        ] as const
      ).map(({ id, label, Icon }) => {
        const active = viewMode === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            aria-label={label}
            onClick={() => handleViewChange(id)}
            className={cn(
              "inline-flex h-full min-h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 text-sm font-semibold transition-colors sm:flex-none sm:px-3",
              active
                ? "bg-[var(--m-accent)] text-white"
                : "bg-transparent text-[var(--m-ink-soft)] hover:bg-[var(--m-wash)] hover:text-[var(--m-ink)]",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <header
        className={cn(
          "mb-4 lg:mb-5",
          !embedded && "member-web-animate-in lg:mb-6",
        )}
      >
        {!embedded ? (
          <div className="min-w-0">
            <p className="member-web-kicker text-[var(--m-accent)]">Program</p>
            <h1 className="member-web-display mt-1.5 text-[clamp(1.65rem,2.8vw,2.5rem)] leading-[1.1] text-[var(--m-ink)]">
              {copy.schedule.title}
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-[var(--m-ink-soft)]">
              {copy.schedule.subtitle}
            </p>
          </div>
        ) : (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--m-ink)]">
              {viewMode === "calendar"
                ? copy.schedule.calendarTitle
                : viewMode === "list"
                  ? copy.schedule.listTitle
                  : copy.schedule.booksTitle}
            </p>
            <p className="mt-0.5 text-xs text-[var(--m-ink-soft)]">
              {viewMode === "calendar"
                ? copy.schedule.calendarDescription
                : viewMode === "list"
                  ? copy.schedule.listDescription
                  : copy.schedule.booksDescription}
            </p>
          </div>
        )}
      </header>

      <section
        className={cn(
          "mb-4 lg:mb-5",
          !embedded && "member-web-animate-in",
        )}
        aria-label="Ringkasan progress baca"
      >
        <div className="grid grid-cols-4 gap-px overflow-hidden rounded-2xl border border-[var(--m-line)] bg-[var(--m-line)]">
          <div className="bg-white/95 px-2.5 py-3 sm:px-4 sm:py-3.5">
            <p className="text-[10px] leading-snug text-[var(--m-ink-soft)] sm:text-xs">
              {copy.schedule.statsChaptersLabel}
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-[var(--m-ink)] sm:text-2xl">
              {progressStats.chaptersRead}
              <span className="ml-0.5 text-[10px] font-medium text-[var(--m-ink-soft)] sm:ml-1 sm:text-xs">
                {copy.schedule.statsChaptersUnit}
              </span>
            </p>
          </div>
          <div className="bg-white/95 px-2.5 py-3 sm:px-4 sm:py-3.5">
            <p className="text-[10px] leading-snug text-[var(--m-ink-soft)] sm:text-xs">
              {copy.schedule.statsDaysDone}
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-emerald-700 sm:text-2xl">
              {progressStats.daysCompleted}
              <span className="ml-0.5 text-[10px] font-medium text-[var(--m-ink-soft)] sm:ml-1 sm:text-xs">
                {copy.schedule.statsDaysUnit}
              </span>
            </p>
          </div>
          <div className="bg-white/95 px-2.5 py-3 sm:px-4 sm:py-3.5">
            <p className="text-[10px] leading-snug text-[var(--m-ink-soft)] sm:text-xs">
              {copy.schedule.statsDaysMissed}
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-[var(--status-danger-text)] sm:text-2xl">
              {progressStats.daysMissed}
              <span className="ml-0.5 text-[10px] font-medium text-[var(--m-ink-soft)] sm:ml-1 sm:text-xs">
                {copy.schedule.statsDaysUnit}
              </span>
            </p>
          </div>
          <div className="bg-white/95 px-2.5 py-3 sm:px-4 sm:py-3.5">
            <p className="text-[10px] leading-snug text-[var(--m-ink-soft)] sm:text-xs">
              {copy.schedule.statsAvgPerBook}
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-[var(--m-ink)] sm:text-2xl">
              {formatAvgChapters(progressStats.avgChaptersPerBook)}
              <span className="ml-0.5 text-[10px] font-medium text-[var(--m-ink-soft)] sm:ml-1 sm:text-xs">
                {copy.schedule.statsAvgUnit}
              </span>
            </p>
          </div>
        </div>
      </section>

      <div className="member-web-animate-in-delay space-y-3">
        {viewMode === "list" && !embedded ? (
          <div className="px-0.5">
            <h2 className="font-semibold text-[var(--m-ink)]">
              {copy.schedule.listTitle}
            </h2>
            <p className="mt-0.5 text-xs text-[var(--m-ink-soft)]">
              {copy.schedule.listDescription}
            </p>
          </div>
        ) : null}

        <div
          className={cn(
            "overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90",
            viewMode === "list" && "shadow-[var(--shadow-soft)]",
          )}
        >
          <div className="flex justify-stretch border-b border-[var(--m-line)] px-3 py-3 sm:justify-start sm:px-5">
            {viewToggle}
          </div>

          {viewMode === "calendar" ? (
            <>
              {!embedded ? (
                <div className="border-b border-[var(--m-line)] px-4 py-2.5 sm:px-5 sm:py-3">
                  <h2 className="font-semibold text-[var(--m-ink)]">
                    {copy.schedule.calendarTitle}
                  </h2>
                  <p className="mt-0.5 text-xs text-[var(--m-ink-soft)]">
                    {copy.schedule.calendarDescription}
                  </p>
                </div>
              ) : null}
              <div className="p-2.5 sm:p-4">
                <ReadingCalendar
                  schedules={sortedSchedule}
                  completedDates={completedDates}
                  onSelectDate={handleSelectDate}
                />
              </div>
            </>
          ) : viewMode === "books" ? (
            <div className="p-4 sm:p-5">
              <BibleBookGrid onOpenChapter={handleOpenBookChapter} />
            </div>
          ) : (
            <div className="space-y-0">
              <div className="space-y-3 border-b border-[var(--m-line)] px-4 py-3 sm:px-5">
                <MonthPeriodNav
                  value={listMonthKey}
                  options={monthOptions}
                  onChange={setListMonthKey}
                />
                <div
                  className="grid grid-cols-3 gap-1 rounded-xl border border-[var(--m-line)] bg-[var(--m-wash)]/50 p-1"
                  role="tablist"
                  aria-label={copy.schedule.listFilterAria}
                >
                  {(
                    [
                      ["all", copy.schedule.listFilterAll],
                      ["missed", copy.schedule.listFilterMissed],
                      ["completed", copy.schedule.listFilterCompleted],
                    ] as const
                  ).map(([value, label]) => {
                    const count = listFilterCounts[value];
                    const active = listStatusFilter === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        aria-label={`${label}, ${count} hari`}
                        onClick={() => handleListFilterChange(value)}
                        className={cn(
                          "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-1.5 text-xs font-semibold transition-colors",
                          active
                            ? "bg-[var(--m-accent)] text-white"
                            : "text-[var(--m-ink-soft)] hover:bg-white/90 hover:text-[var(--m-ink)]",
                        )}
                      >
                        <span>{label}</span>
                        <span
                          className={cn(
                            "min-w-5 rounded-md px-1 py-0.5 text-center text-[10px] font-bold tabular-nums leading-none",
                            active
                              ? "bg-white/20 text-white"
                              : "bg-[var(--m-line)]/70 text-[var(--m-ink)]",
                          )}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {listSchedule.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-[var(--m-ink-soft)]">
                  {listStatusFilter === "all"
                    ? copy.schedule.listEmpty
                    : copy.schedule.listEmptyFiltered}
                </p>
              ) : (
            <ul className="max-h-[min(62dvh,32rem)] divide-y divide-[var(--m-line)] overflow-y-auto overscroll-contain">
              {listSchedule.map((reading) => {
                const status = getDayReadingStatus(
                  reading.scheduledDate,
                  true,
                  completedDates,
                );
                const completed = completedDates.has(reading.scheduledDate);
                const active = selectedDate === reading.scheduledDate;
                const isToday = reading.scheduledDate === todayKey;
                const isScrollTarget =
                  reading.scheduledDate === listScrollDate;

                return (
                  <li
                    key={reading.id}
                    id={`jadwal-day-${reading.scheduledDate}`}
                  >
                    <div
                      className={cn(
                        "flex w-full items-center gap-1.5 px-2 py-1.5 transition-colors sm:gap-2 sm:px-3",
                        active && "bg-[var(--m-wash)]/80",
                        isScrollTarget && !active && "bg-[var(--m-wash)]/45",
                        isToday &&
                          "ring-1 ring-inset ring-[var(--m-accent)]/25",
                      )}
                    >
                      <button
                        type="button"
                        aria-pressed={completed}
                        aria-label={
                          completed
                            ? copy.schedule.unmarkComplete
                            : copy.schedule.markComplete
                        }
                        className={cn(
                          "inline-flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                          completed
                            ? "hover:bg-emerald-50"
                            : "hover:bg-[var(--m-wash)]",
                        )}
                        onClick={() =>
                          requestToggleComplete(
                            reading.scheduledDate,
                            !completed,
                          )
                        }
                      >
                        <span
                          className={cn(
                            "inline-flex size-5 items-center justify-center rounded-[5px] border-2 transition-colors",
                            completed
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-[var(--m-ink-soft)]/55 bg-white text-transparent",
                          )}
                          aria-hidden
                        >
                          <Check className="size-3.5" strokeWidth={3} />
                        </span>
                      </button>
                      <button
                        type="button"
                        className="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-1.5 py-1.5 text-left transition-colors hover:bg-[var(--m-wash)]/55"
                        onClick={() =>
                          handleSelectDate(reading.scheduledDate, reading)
                        }
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span className="text-sm font-semibold text-[var(--m-ink)]">
                              {reading.title}
                            </span>
                            <span className="text-xs text-[var(--m-ink-soft)]">
                              {formatDisplayDate(reading.scheduledDate)}
                            </span>
                            {isToday ? (
                              <span className="text-[11px] font-bold tracking-wide text-[var(--m-accent)] uppercase">
                                Hari ini
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-0.5 truncate text-sm text-[var(--m-ink-soft)]">
                            {reading.passage}
                          </p>
                          {reading.passage !== "Belum dijadwalkan" ? (
                            <ReadingTimeLabel
                              className="mt-1"
                              label={estimateReadingTimeForPassage(
                                reading.passage,
                              )}
                            />
                          ) : null}
                        </div>
                        <StatusBadge status={status} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
              )}
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={Boolean(selectedDate)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDate(null);
            setSelectedSchedule(undefined);
          }
        }}
      >
        <DialogContent className="flex max-h-[min(90dvh,52rem)] w-full max-w-lg flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
          {selectedDate && resolvedSelected ? (
            <>
              <DialogHeader className="shrink-0 border-b border-[var(--m-line)] px-5 py-4 pr-12 text-left">
                <div className="flex items-start justify-between gap-3">
                  <DialogTitle className="text-lg font-semibold text-[var(--m-ink)]">
                    {resolvedSelected.title}
                  </DialogTitle>
                  {selectedStatus ? (
                    <StatusBadge status={selectedStatus} />
                  ) : null}
                </div>
                <DialogDescription className="sr-only">
                  {formatDisplayDate(resolvedSelected.scheduledDate)} ·{" "}
                  {resolvedSelected.passage}
                </DialogDescription>
              </DialogHeader>

              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
                <div className="space-y-1.5 text-center">
                  <p className="text-base font-semibold tracking-tight text-[var(--m-ink)] sm:text-lg">
                    {formatDisplayDate(resolvedSelected.scheduledDate)}
                    <span className="font-normal text-[var(--m-ink-soft)]">
                      {" "}
                      ·{" "}
                    </span>
                    {resolvedSelected.passage}
                  </p>
                  {resolvedSelected.passage !== "Belum dijadwalkan" ? (
                    <ReadingTimeLabel
                      className="justify-center"
                      label={estimateReadingTimeForPassage(
                        resolvedSelected.passage,
                      )}
                    />
                  ) : null}
                </div>

                {selectedStatus === "upcoming" &&
                resolvedSelected.passage !== "Belum dijadwalkan" ? (
                  <p className="rounded-xl bg-muted/50 px-3.5 py-2.5 text-xs leading-relaxed text-muted-foreground">
                    {copy.schedule.upcomingHint}
                  </p>
                ) : null}

                <ReadingCard
                  reading={{
                    ...resolvedSelected,
                    completed: completedDates.has(selectedDate),
                  }}
                  featured={selectedStatus === "today"}
                  allowEarlyRead={
                    selectedStatus === "upcoming" ||
                    selectedStatus === "missed" ||
                    selectedStatus === "completed"
                  }
                  isUpcoming={selectedStatus === "upcoming"}
                  embedded
                />

                {selectedOfficial ? (
                  <p className="text-xs text-muted-foreground">
                    Renungan oleh {selectedOfficial.authorName} ·{" "}
                    {authorRoleLabel(selectedOfficial.authorRole)}
                  </p>
                ) : null}

                {isLeaderView ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => setDevotionalOpen(true)}
                  >
                    <PenLine className="size-4" />
                    {selectedOfficial || resolvedSelected.devotional
                      ? "Edit renungan"
                      : "Tulis renungan"}
                  </Button>
                ) : null}

                {resolvedSelected.passage === "Belum dijadwalkan" ? (
                  <Button
                    className="w-full"
                    variant={
                      completedDates.has(selectedDate) ? "outline" : "default"
                    }
                    onClick={() =>
                      requestToggleComplete(
                        selectedDate,
                        !completedDates.has(selectedDate),
                      )
                    }
                  >
                    {completedDates.has(selectedDate) ? (
                      <>
                        <CheckCircle2 className="size-4" />
                        {copy.schedule.unmarkComplete}
                      </>
                    ) : (
                      <>
                        <Circle className="size-4" />
                        {copy.schedule.markComplete}
                      </>
                    )}
                  </Button>
                ) : null}
              </div>
            </>
          ) : selectedDate ? (
            <DialogHeader className="px-5 py-4 pr-12 text-left">
              <DialogTitle>{formatShortDate(selectedDate)}</DialogTitle>
              <DialogDescription>{copy.schedule.noSchedule}</DialogDescription>
            </DialogHeader>
          ) : null}
        </DialogContent>
      </Dialog>

      {selectedDate && resolvedSelected && isLeaderView ? (
        <ScheduleDevotionalEditor
          open={devotionalOpen}
          onOpenChange={setDevotionalOpen}
          dateKey={selectedDate}
          passage={resolvedSelected.passage}
          authorRole="leader"
          authorName={authorName}
          seedContent={resolvedSelected.devotional}
        />
      ) : null}

      <Dialog
        open={confirmToggle != null}
        onOpenChange={(open) => {
          if (!open) setConfirmToggle(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-sm"
        >
          <DialogHeader className="space-y-1 px-5 pt-5 text-left">
            <DialogTitle className="text-base font-semibold text-[var(--m-ink)]">
              {confirmToggle?.complete
                ? copy.schedule.confirmMarkTitle
                : copy.schedule.confirmUnmarkTitle}
            </DialogTitle>
            <DialogDescription className="text-sm text-[var(--m-ink-soft)]">
              {confirmToggle
                ? confirmToggle.complete
                  ? copy.schedule.confirmMarkDescription(confirmToggle.passage)
                  : copy.schedule.confirmUnmarkDescription(
                      confirmToggle.passage,
                    )
                : null}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse gap-2 px-5 py-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl"
              onClick={() => setConfirmToggle(null)}
            >
              {copy.schedule.confirmToggleCancel}
            </Button>
            <Button
              type="button"
              variant={confirmToggle?.complete ? "default" : "destructive"}
              className="h-10 rounded-xl"
              onClick={confirmToggleComplete}
            >
              {confirmToggle?.complete
                ? copy.schedule.confirmMarkYes
                : copy.schedule.confirmUnmarkYes}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function StatusBadge({
  status,
}: {
  status: ReturnType<typeof getDayReadingStatus>;
}) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "shrink-0",
        status === "completed" &&
          "bg-[var(--status-success-bg)] text-[var(--status-success-text)]",
        status === "missed" &&
          "bg-[var(--status-danger-bg)] text-[var(--status-danger-text)]",
        status === "today" && "bg-primary/15 text-primary",
      )}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}
