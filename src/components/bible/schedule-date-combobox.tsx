"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Check, CheckCircle2, ChevronsUpDown, Search } from "lucide-react";
import { Popover } from "radix-ui";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/ui/toast-host";
import { celebrateReadingComplete } from "@/lib/browser-notifications";
import {
  getCompletedChaptersSnapshot,
  getServerCompletedChaptersSnapshot,
  markPassageComplete,
  subscribeCompletedChapters,
  unmarkPassageComplete,
} from "@/lib/bible-completed-chapters";
import { copy } from "@/lib/copy";
import { formatDisplayDate, formatShortDate } from "@/lib/format-date";
import {
  getAssignedScheduleReadings,
  markDateComplete,
  markDateIncomplete,
  readCompletedDates,
  searchAssignedSchedule,
} from "@/lib/reading-progress";
import { parsePassage } from "@/lib/passage-parser";
import { getTodayKey } from "@/lib/reading-status";
import { subscribeScheduleProgress } from "@/lib/schedule-progress-stats";
import type { ReadingSchedule } from "@/lib/types";
import { cn } from "@/lib/utils";

type ScheduleDateComboboxProps = {
  value?: string;
  onChange: (reading: ReadingSchedule) => void;
  id?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
  /**
   * Jika false, value kosong tidak fallback ke bacaan hari ini.
   * Dipakai saat pasal dibuka di luar jadwal.
   */
  fallbackToDefault?: boolean;
  /** Teks di trigger saat tidak ada tanggal terdata. */
  unscheduledLabel?: string;
};

function resolveDefaultReading(readings: ReadingSchedule[], todayKey: string) {
  const exact = readings.find((item) => item.scheduledDate === todayKey);
  if (exact) return exact;
  const upcoming = readings.find((item) => item.scheduledDate >= todayKey);
  if (upcoming) return upcoming;
  return readings[readings.length - 1] ?? null;
}

function getCompletedDatesSnapshot() {
  return readCompletedDates().join(",");
}

function getServerCompletedDatesSnapshot() {
  return "";
}

/** Hitung status selesai dari snapshot store saja (hindari baca localStorage langsung → hydration mismatch). */
function isReadingDoneFromSnapshots(
  reading: ReadingSchedule,
  completedDatesKey: string,
  completedChaptersKey: string,
) {
  const completedDates = new Set(
    completedDatesKey ? completedDatesKey.split(",").filter(Boolean) : [],
  );
  if (completedDates.has(reading.scheduledDate)) return true;

  if (!reading.passage || reading.passage === "Belum dijadwalkan") {
    return false;
  }

  let chaptersMap: Record<string, number[]> = {};
  try {
    const parsed = JSON.parse(completedChaptersKey || "{}") as unknown;
    if (parsed && typeof parsed === "object") {
      chaptersMap = parsed as Record<string, number[]>;
    }
  } catch {
    chaptersMap = {};
  }

  const passage = parsePassage(reading.passage);
  if (!passage) return false;
  const end = passage.endChapter ?? passage.chapter;
  const chapters = chaptersMap[passage.bookAbbr] ?? [];
  for (let chapter = passage.chapter; chapter <= end; chapter += 1) {
    if (!chapters.includes(chapter)) return false;
  }
  return true;
}

export function ScheduleDateCombobox({
  value,
  onChange,
  id,
  placeholder = "Pilih tanggal bacaan",
  searchPlaceholder = "Cari tanggal atau pasal…",
  emptyLabel = "Tidak ada tanggal cocok",
  fallbackToDefault = true,
  unscheduledLabel = "Belum ada tanggal yang terdata",
}: ScheduleDateComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [confirmToggle, setConfirmToggle] = useState<{
    reading: ReadingSchedule;
    complete: boolean;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const todayKey = getTodayKey();

  const completedDatesKey = useSyncExternalStore(
    subscribeScheduleProgress,
    getCompletedDatesSnapshot,
    getServerCompletedDatesSnapshot,
  );
  const completedChaptersKey = useSyncExternalStore(
    subscribeCompletedChapters,
    getCompletedChaptersSnapshot,
    getServerCompletedChaptersSnapshot,
  );

  const readings = useMemo(() => getAssignedScheduleReadings(), []);
  const defaultReading = useMemo(
    () => resolveDefaultReading(readings, todayKey),
    [readings, todayKey],
  );
  const effectiveValue =
    value ?? (fallbackToDefault ? defaultReading?.scheduledDate : undefined);
  const selected =
    readings.find((item) => item.scheduledDate === effectiveValue) ?? null;

  const filtered = useMemo(
    () => (query.trim() ? searchAssignedSchedule(query, 40) : readings),
    [query, readings],
  );

  const doneByDate = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const reading of filtered) {
      map.set(
        reading.scheduledDate,
        isReadingDoneFromSnapshots(
          reading,
          completedDatesKey,
          completedChaptersKey,
        ),
      );
    }
    return map;
  }, [filtered, completedDatesKey, completedChaptersKey]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
      const targetDate = effectiveValue ?? todayKey;
      document
        .getElementById(`schedule-date-${targetDate}`)
        ?.scrollIntoView({ block: "center" });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open, effectiveValue, todayKey]);

  function selectReading(reading: ReadingSchedule) {
    onChange(reading);
    setOpen(false);
  }

  function requestToggleComplete(
    reading: ReadingSchedule,
    complete: boolean,
  ) {
    setOpen(false);
    setConfirmToggle({ reading, complete });
  }

  function confirmToggleComplete() {
    if (!confirmToggle) return;
    const { reading, complete } = confirmToggle;
    if (complete) {
      markDateComplete(reading.scheduledDate);
      if (reading.passage !== "Belum dijadwalkan") {
        markPassageComplete(reading.passage);
        void celebrateReadingComplete(reading.passage);
      }
      showToast(copy.schedule.markCompleteDone);
    } else {
      markDateIncomplete(reading.scheduledDate);
      if (reading.passage !== "Belum dijadwalkan") {
        unmarkPassageComplete(reading.passage);
      }
      showToast(copy.schedule.markIncompleteDone);
    }
    setConfirmToggle(null);
  }

  const selectedIsToday = selected?.scheduledDate === todayKey;
  const selectedIsDone = selected
    ? (doneByDate.get(selected.scheduledDate) ?? false)
    : false;

  return (
    <>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button
            type="button"
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-11 w-full justify-between gap-2 rounded-xl border-[var(--m-line)] bg-white px-3 font-normal shadow-none hover:bg-[var(--m-wash)]/40"
          >
            {selected ? (
              <span className="flex min-w-0 flex-1 items-center gap-2">
                <span className="min-w-0 truncate text-left text-sm leading-tight">
                  <span className="font-semibold text-[var(--m-ink)]">
                    {formatShortDate(selected.scheduledDate)}
                  </span>
                  <span className="text-[var(--m-ink-soft)]">
                    {" · "}
                    {selected.passage}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1">
                  {selectedIsToday ? (
                    <span className="rounded-md bg-[var(--m-wash)] px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-[var(--m-accent)] uppercase">
                      Hari ini
                    </span>
                  ) : null}
                  {selectedIsDone ? (
                    <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase">
                      <CheckCircle2 className="size-3" aria-hidden />
                      Selesai
                    </span>
                  ) : null}
                </span>
              </span>
            ) : (
              <span className="min-w-0 flex-1 truncate text-left text-sm text-[var(--m-ink-soft)]">
                {unscheduledLabel || placeholder}
              </span>
            )}
            <ChevronsUpDown className="size-4 shrink-0 text-[var(--m-ink-soft)]" />
          </Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={4}
            className="z-50 w-(--radix-popover-trigger-width) overflow-hidden rounded-xl bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <div className="border-b border-border p-2">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-9 rounded-lg pl-8"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && filtered[0]) {
                      event.preventDefault();
                      selectReading(filtered[0]);
                    }
                  }}
                />
              </div>
            </div>
            <ul className="max-h-64 overflow-y-auto p-1" role="listbox">
              {filtered.length === 0 ? (
                <li className="px-2 py-3 text-center text-sm text-muted-foreground">
                  {emptyLabel}
                </li>
              ) : (
                filtered.map((reading) => {
                  const isSelected = reading.scheduledDate === effectiveValue;
                  const isToday = reading.scheduledDate === todayKey;
                  const isDone = doneByDate.get(reading.scheduledDate) ?? false;
                  const isMissed = !isDone && reading.scheduledDate < todayKey;
                  return (
                    <li
                      key={reading.scheduledDate}
                      id={`schedule-date-${reading.scheduledDate}`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div
                        className={cn(
                          "flex w-full items-start gap-1 rounded-lg px-1 py-1.5 transition-colors",
                          isSelected && "bg-accent/60",
                        )}
                      >
                        <button
                          type="button"
                          aria-pressed={isDone}
                          aria-label={
                            isDone
                              ? copy.schedule.unmarkComplete
                              : copy.schedule.markComplete
                          }
                          className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-accent"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            requestToggleComplete(reading, !isDone);
                          }}
                          onPointerDown={(event) => {
                            event.stopPropagation();
                          }}
                        >
                          <span
                            className={cn(
                              "inline-flex size-4 items-center justify-center rounded-[4px] border-2",
                              isDone
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : isMissed
                                  ? "border-[var(--status-warning-text)]/70 bg-transparent text-transparent"
                                  : "border-muted-foreground/40 bg-transparent text-transparent",
                            )}
                            aria-hidden
                          >
                            <Check className="size-2.5" strokeWidth={3} />
                          </span>
                        </button>
                        <button
                          type="button"
                          className="flex min-w-0 flex-1 items-start gap-2 rounded-lg px-1 py-1 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
                          onClick={() => selectReading(reading)}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-baseline gap-x-1.5">
                              <span className="font-medium capitalize">
                                {formatDisplayDate(reading.scheduledDate)}
                              </span>
                              {isToday ? (
                                <span className="rounded-md bg-[var(--m-wash)] px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-[var(--m-accent)] uppercase">
                                  Hari ini
                                </span>
                              ) : null}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                              {reading.passage}
                            </span>
                          </span>
                          {isDone ? (
                            <span className="mt-0.5 inline-flex shrink-0 items-center gap-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase">
                              <CheckCircle2 className="size-3" />
                              Selesai
                            </span>
                          ) : null}
                          {isMissed ? (
                            <span className="mt-0.5 shrink-0 text-[10px] font-semibold tracking-wide text-[var(--status-warning-text)] uppercase">
                              Terlewat
                            </span>
                          ) : null}
                          <Check
                            className={cn(
                              "mt-0.5 size-4 shrink-0 text-primary",
                              isSelected ? "opacity-100" : "opacity-0",
                            )}
                          />
                        </button>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <Dialog
        open={confirmToggle != null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setConfirmToggle(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="z-[80] gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-sm"
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
                  ? copy.schedule.confirmMarkDescription(
                      confirmToggle.reading.passage !== "Belum dijadwalkan"
                        ? confirmToggle.reading.passage
                        : formatDisplayDate(
                            confirmToggle.reading.scheduledDate,
                          ),
                    )
                  : copy.schedule.confirmUnmarkDescription(
                      confirmToggle.reading.passage !== "Belum dijadwalkan"
                        ? confirmToggle.reading.passage
                        : formatDisplayDate(
                            confirmToggle.reading.scheduledDate,
                          ),
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
