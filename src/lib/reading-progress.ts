import {
  addDays,
  differenceInCalendarDays,
  format,
  parseISO,
  startOfYear,
} from "date-fns";

import type { ReadingSchedule } from "./types";
import { getReflectionPromptForDay } from "./reflection-prompts";

const STORAGE_KEY = "bacaalkitab-reading-progress";

/** Rentang program — Jul 2026 s/d Mar 2028. */
export const DEMO_PROGRAM_START = "2026-07-01";
export const DEMO_PROGRAM_END = "2028-03-31";

/**
 * Bacaan yang sudah diisi. Tanggal lain dalam rentang program
 * tetap masuk jadwal sebagai slot kosong (“Belum dijadwalkan”).
 */
const ASSIGNED_PASSAGES: Record<string, string> = {
  "2026-07-01": "Kejadian 1-2",
  "2026-07-02": "Kejadian 3-4",
  "2026-07-03": "Kejadian 5-6",
  "2026-07-04": "Kejadian 7-8",
  "2026-07-05": "Kejadian 9-10",
  "2026-07-06": "Kejadian 11-12",
  "2026-07-07": "Kejadian 13-14",
  "2026-07-08": "Kejadian 15-16",
  "2026-07-09": "Kejadian 17-18",
  "2026-07-10": "Kejadian 19",
  "2026-07-11": "Kejadian 20-21",
  "2026-07-12": "Kejadian 22-23",
  "2026-07-13": "Kejadian 24",
  "2026-07-14": "Kejadian 25",
  "2026-07-15": "Kejadian 26",
  "2026-07-16": "Kejadian 27",
  "2026-07-17": "Kejadian 28-29",
  "2026-07-18": "Kejadian 30",
  "2026-07-19": "Kejadian 31",
  "2026-07-20": "Kejadian 32-33",
  "2026-07-21": "Kejadian 34-35",
  "2026-07-22": "Kejadian 36",
  "2026-07-23": "Kejadian 37-38",
  "2026-07-24": "Kejadian 39-40",
  "2026-07-25": "Kejadian 41",
  "2026-07-26": "Kejadian 42",
  "2026-07-27": "Kejadian 43",
  "2026-07-28": "Kejadian 44",
  "2026-07-29": "Kejadian 45-46",
  "2026-07-30": "Kejadian 47-48",
  "2026-07-31": "Kejadian 49-50",
};

function buildProgramSchedule(
  startKey: string,
  endKey: string,
): ReadingSchedule[] {
  const start = parseISO(startKey);
  const end = parseISO(endKey);
  const totalDays = differenceInCalendarDays(end, start) + 1;
  const schedules: ReadingSchedule[] = [];

  for (let day = 0; day < totalDays; day += 1) {
    const date = addDays(start, day);
    const dateKey = format(date, "yyyy-MM-dd");
    const dayNumber = day + 1;
    const passage = ASSIGNED_PASSAGES[dateKey] ?? "";
    const hasPassage = passage.length > 0;

    schedules.push({
      id: `sched-${dateKey}`,
      scheduledDate: dateKey,
      title: `Hari ${dayNumber}`,
      passage: hasPassage ? passage : "Belum dijadwalkan",
      // Kosong sampai admin/ketua menulis renungan resmi.
      devotional: hasPassage
        ? ""
        : "Bacaan untuk hari ini belum ditetapkan. Admin dapat mengisi jadwal dari panel Jadwal baca.",
      reflectionPrompt: getReflectionPromptForDay({
        dateKey,
        dayNumber,
        hasPassage,
      }),
    });
  }

  return schedules;
}

export const demoSchedule = buildProgramSchedule(
  DEMO_PROGRAM_START,
  DEMO_PROGRAM_END,
);

export const demoProgramScheduleMeta = {
  startDate: DEMO_PROGRAM_START,
  endDate: DEMO_PROGRAM_END,
  totalDays: demoSchedule.length,
  assignedDays: Object.keys(ASSIGNED_PASSAGES).length,
  planName: "Kejadian & rencana lanjutan",
};

export function getDefaultCompletedDates(): string[] {
  const today = new Date();
  const todayKey = format(today, "yyyy-MM-dd");
  const completed = new Set<string>();

  // Demo: bacaan assigned lebih dari 7 hari lalu dianggap sudah selesai.
  for (const dateKey of Object.keys(ASSIGNED_PASSAGES)) {
    if (dateKey >= todayKey) continue;
    if (dateKey < DEMO_PROGRAM_START || dateKey > DEMO_PROGRAM_END) continue;
    const age = differenceInCalendarDays(today, parseISO(dateKey));
    if (age > 7) completed.add(dateKey);
  }

  // Dalam 7 hari terakhir: beberapa selesai, beberapa sengaja terlewat.
  for (const offset of [-7, -6, -5, -3, -2]) {
    const dateKey = format(addDays(today, offset), "yyyy-MM-dd");
    if (
      dateKey >= DEMO_PROGRAM_START &&
      dateKey <= DEMO_PROGRAM_END &&
      ASSIGNED_PASSAGES[dateKey]
    ) {
      completed.add(dateKey);
    }
  }

  return [...completed].sort();
}

export function readCompletedDates(): string[] {
  if (typeof window === "undefined") return getDefaultCompletedDatesCached();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Jangan write di getSnapshot path — seed sekali lewat cache memori saja.
      return getDefaultCompletedDatesCached();
    }
    if (completedRawCache === raw && completedListCache) {
      return completedListCache;
    }
    const parsed = JSON.parse(raw) as unknown;
    const list = Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : getDefaultCompletedDatesCached();
    completedRawCache = raw;
    completedListCache = list;
    return list;
  } catch {
    return getDefaultCompletedDatesCached();
  }
}

let defaultCompletedCache: string[] | null = null;
let defaultCompletedDay = "";
let completedRawCache: string | null = null;
let completedListCache: string[] | null = null;

function getDefaultCompletedDatesCached(): string[] {
  const day = format(new Date(), "yyyy-MM-dd");
  if (defaultCompletedCache && defaultCompletedDay === day) {
    return defaultCompletedCache;
  }
  defaultCompletedDay = day;
  defaultCompletedCache = getDefaultCompletedDates();
  return defaultCompletedCache;
}

export function writeCompletedDates(dates: string[]) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(dates);
  localStorage.setItem(STORAGE_KEY, raw);
  completedRawCache = raw;
  completedListCache = dates;
  window.dispatchEvent(new Event("reading-progress-updated"));
}

export function markDateComplete(dateKey: string) {
  const current = new Set(readCompletedDates());
  current.add(dateKey);
  writeCompletedDates([...current].sort());
}

export function markDateIncomplete(dateKey: string) {
  const current = readCompletedDates().filter((date) => date !== dateKey);
  writeCompletedDates(current);
}

export function isDateComplete(dateKey: string) {
  return readCompletedDates().includes(dateKey);
}

export function schedulesByDate(schedules: ReadingSchedule[]) {
  return new Map(schedules.map((item) => [item.scheduledDate, item]));
}

export function getYearStartKey(reference = new Date()) {
  return format(startOfYear(reference), "yyyy-MM-dd");
}

/** Hari baca sejak 1 Januari hingga hari ini (inklusif). */
export function getScheduledDaysSinceYearStart(reference = new Date()) {
  return differenceInCalendarDays(reference, startOfYear(reference)) + 1;
}

export function getPersonalYearToDateProgress(reference = new Date()) {
  const yearStart = getYearStartKey(reference);
  const todayKey = format(reference, "yyyy-MM-dd");
  const totalDays = getScheduledDaysSinceYearStart(reference);
  const completed = readCompletedDates().filter(
    (dateKey) => dateKey >= yearStart && dateKey <= todayKey,
  ).length;
  const rate = totalDays === 0 ? 0 : Math.round((completed / totalDays) * 100);

  return { rate, completed, totalDays };
}

/** Daftar pasal terjadwal yang sudah diisi (untuk prefetch offline). */
export function getAssignedSchedulePassages(): string[] {
  return [...new Set(Object.values(ASSIGNED_PASSAGES))];
}

/** True jika hari itu punya bacaan resmi (bukan slot kosong). */
export function hasAssignedPassage(dateKey: string) {
  return Boolean(ASSIGNED_PASSAGES[dateKey]);
}

/**
 * Bacaan terjadwal berikutnya setelah `fromDateKey` (default: hari ini).
 * Hanya mengembalikan slot yang sudah diisi pasal.
 */
export function getNextScheduledReading(
  fromDateKey = format(new Date(), "yyyy-MM-dd"),
): ReadingSchedule | null {
  const next = demoSchedule.find(
    (item) =>
      item.scheduledDate > fromDateKey &&
      item.passage !== "Belum dijadwalkan" &&
      hasAssignedPassage(item.scheduledDate),
  );
  return next ?? null;
}

/** Bacaan terjadwal sebelumnya sebelum `fromDateKey`. */
export function getPreviousScheduledReading(
  fromDateKey: string,
): ReadingSchedule | null {
  const assigned = getAssignedScheduleReadings();
  for (let index = assigned.length - 1; index >= 0; index -= 1) {
    const item = assigned[index]!;
    if (item.scheduledDate < fromDateKey) return item;
  }
  return null;
}

/** Bacaan untuk tanggal tertentu, jika sudah diisi. */
export function getScheduledReadingForDate(
  dateKey: string,
): ReadingSchedule | null {
  const item = demoSchedule.find((entry) => entry.scheduledDate === dateKey);
  if (!item || item.passage === "Belum dijadwalkan") return null;
  return item;
}

/** Tanggal jadwal pertama yang cocok dengan referensi pasal. */
export function getScheduleDateForPassage(passage: string): string | undefined {
  if (!passage || passage === "Belum dijadwalkan") return undefined;
  const match = getAssignedScheduleReadings().find(
    (item) => item.passage === passage,
  );
  return match?.scheduledDate;
}

/** Semua bacaan terjadwal yang sudah diisi pasal (urut tanggal naik). */
export function getAssignedScheduleReadings(): ReadingSchedule[] {
  return demoSchedule.filter(
    (item) =>
      item.passage !== "Belum dijadwalkan" &&
      hasAssignedPassage(item.scheduledDate),
  );
}

/** Jumlah hari jadwal assigned yang sudah lewat dan belum selesai. */
export function countMissedAssignedDays(
  todayKey = format(new Date(), "yyyy-MM-dd"),
) {
  const completed = new Set(readCompletedDates());
  let missed = 0;

  for (const item of getAssignedScheduleReadings()) {
    if (item.scheduledDate >= todayKey) continue;
    if (completed.has(item.scheduledDate)) continue;
    missed += 1;
  }

  return missed;
}

function normalizeScheduleQuery(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Cari bacaan terjadwal lewat tanggal, label tanggal, judul hari, atau pasal. */
export function searchAssignedSchedule(
  query: string,
  limit = 12,
): ReadingSchedule[] {
  const q = normalizeScheduleQuery(query);
  if (!q) return getAssignedScheduleReadings().slice(0, limit);

  const results: ReadingSchedule[] = [];
  for (const item of getAssignedScheduleReadings()) {
    const haystacks = [
      item.scheduledDate,
      item.title,
      item.passage,
      format(parseISO(item.scheduledDate), "d MMM yyyy"),
      format(parseISO(item.scheduledDate), "d MMMM yyyy"),
      format(parseISO(item.scheduledDate), "EEEE d MMM yyyy"),
      format(parseISO(item.scheduledDate), "d/M/yyyy"),
      format(parseISO(item.scheduledDate), "d-M-yyyy"),
    ].map(normalizeScheduleQuery);

    if (haystacks.some((hay) => hay.includes(q) || q.includes(hay))) {
      results.push(item);
      if (results.length >= limit) break;
    }
  }
  return results;
}

/** Streak baca berturut-turut sampai hari ini (atau kemarin jika hari ini belum). */
export function getCurrentReadingStreak(
  todayKey = format(new Date(), "yyyy-MM-dd"),
) {
  const completed = new Set(readCompletedDates());
  let streak = 0;
  let cursor = parseISO(todayKey);

  if (!completed.has(todayKey)) {
    cursor = addDays(cursor, -1);
  }

  for (let i = 0; i < 400; i += 1) {
    const key = format(cursor, "yyyy-MM-dd");
    if (!completed.has(key)) break;
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

/** Streak terpanjang dari seluruh riwayat selesai baca. */
export function getLongestReadingStreak() {
  const dates = [...readCompletedDates()].sort();
  if (dates.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i += 1) {
    const prev = parseISO(dates[i - 1]);
    const next = parseISO(dates[i]);
    if (differenceInCalendarDays(next, prev) === 1) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

export function getCompletedReadingCount() {
  return readCompletedDates().length;
}

/** Estimasi jam baca sederhana (~12 menit per hari selesai). */
export function getEstimatedReadingHours() {
  const minutes = getCompletedReadingCount() * 12;
  return Math.round((minutes / 60) * 10) / 10;
}

export function getRecentCompletedReadings(limit = 5) {
  return [...readCompletedDates()]
    .sort((a, b) => (a < b ? 1 : -1))
    .slice(0, limit)
    .map((dateKey) => ({
      dateKey,
      passage: getScheduledReadingForDate(dateKey)?.passage ?? null,
    }));
}
