import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { id as localeId } from "date-fns/locale";

import type { ReadingSchedule } from "@/lib/types";
import {
  getDayReadingStatus,
  STATUS_COLORS,
  STATUS_LABELS,
  type DayReadingStatus,
} from "@/lib/reading-status";

export { formatDateKey } from "@/lib/reading-status";

export function getCalendarDays(month: Date) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);

  return eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 0 }),
    end: endOfWeek(monthEnd, { weekStartsOn: 0 }),
  });
}

export function formatMonthLabel(month: Date) {
  return format(month, "MMMM yyyy", { locale: localeId });
}

/** Key bulan untuk picker: yyyy-MM */
export function toMonthKey(date: Date) {
  return format(date, "yyyy-MM");
}

export function parseMonthKey(key: string) {
  const [yearPart, monthPart] = key.split("-");
  const year = Number(yearPart);
  const monthIndex = Number(monthPart) - 1;
  if (!Number.isFinite(year) || !Number.isFinite(monthIndex)) {
    return startOfMonth(new Date());
  }
  return new Date(year, monthIndex, 1);
}

/** Daftar bulan dari rentang jadwal (atau fallback program demo). */
export function listMonthOptions(schedules: ReadingSchedule[]) {
  const dates = schedules
    .map((item) => item.scheduledDate)
    .filter(Boolean)
    .sort();

  let start = dates[0] ? startOfMonth(parseISO(dates[0])) : startOfMonth(new Date());
  let end = dates[dates.length - 1]
    ? startOfMonth(parseISO(dates[dates.length - 1]))
    : startOfMonth(new Date());

  if (end < start) {
    const swap = start;
    start = end;
    end = swap;
  }

  const options: { key: string; label: string }[] = [];
  let cursor = start;
  while (cursor <= end) {
    options.push({
      key: toMonthKey(cursor),
      label: formatMonthLabel(cursor),
    });
    cursor = addMonths(cursor, 1);
  }

  if (options.length === 0) {
    const now = startOfMonth(new Date());
    options.push({ key: toMonthKey(now), label: formatMonthLabel(now) });
  }

  return options;
}

export function getWeekdayLabels() {
  return ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
}

export function buildDayCells(
  month: Date,
  scheduleMap: Map<string, ReadingSchedule>,
  completedDates: Set<string>,
) {
  return getCalendarDays(month).map((date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const schedule = scheduleMap.get(dateKey);
    const status = getDayReadingStatus(
      dateKey,
      Boolean(schedule),
      completedDates,
    );

    return {
      date,
      dateKey,
      schedule,
      status,
      inMonth: isSameMonth(date, month),
    };
  });
}

export function countStatuses(
  cells: ReturnType<typeof buildDayCells>,
) {
  return cells.reduce(
    (acc, cell) => {
      if (!cell.inMonth || cell.status === "none") return acc;
      acc[cell.status] += 1;
      return acc;
    },
    {
      completed: 0,
      missed: 0,
      today: 0,
      upcoming: 0,
    } as Record<Exclude<DayReadingStatus, "none">, number>,
  );
}

export { STATUS_COLORS, STATUS_LABELS };
export { addMonths, subMonths, parseISO };
