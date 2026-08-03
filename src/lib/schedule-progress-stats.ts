import {
  getBooksWithCompletedChapterCount,
  getTotalCompletedChapterCount,
} from "@/lib/bible-completed-chapters";
import { getDayReadingStatus } from "@/lib/reading-status";
import { parsePassage } from "@/lib/passage-parser";
import type { ReadingSchedule } from "@/lib/types";

export type ScheduleProgressStats = {
  chaptersRead: number;
  daysCompleted: number;
  daysMissed: number;
  avgChaptersPerBook: number;
  booksTouched: number;
};

function chapterCountInPassage(passage: string): {
  count: number;
  bookAbbr: string | null;
} {
  const parsed = parsePassage(passage);
  if (!parsed) return { count: 0, bookAbbr: null };
  const end = parsed.endChapter ?? parsed.chapter;
  return {
    count: Math.max(0, end - parsed.chapter + 1),
    bookAbbr: parsed.bookAbbr,
  };
}

/** Ringkasan progress jadwal + pasal (untuk halaman Jadwal Baca). */
export function getScheduleProgressStats(
  schedules: ReadingSchedule[],
  completedDates: Set<string>,
): ScheduleProgressStats {
  let daysCompleted = 0;
  let daysMissed = 0;
  let scheduleChapters = 0;
  const chaptersByBook = new Map<string, number>();

  for (const item of schedules) {
    if (item.passage === "Belum dijadwalkan") continue;
    const status = getDayReadingStatus(
      item.scheduledDate,
      true,
      completedDates,
    );

    if (status === "completed") {
      daysCompleted += 1;
      const { count, bookAbbr } = chapterCountInPassage(item.passage);
      scheduleChapters += count;
      if (bookAbbr && count > 0) {
        chaptersByBook.set(
          bookAbbr,
          (chaptersByBook.get(bookAbbr) ?? 0) + count,
        );
      }
    } else if (status === "missed") {
      daysMissed += 1;
    }
  }

  const bibleChapters = getTotalCompletedChapterCount();
  const bibleBooks = getBooksWithCompletedChapterCount();
  const chaptersRead = Math.max(scheduleChapters, bibleChapters);
  const booksTouched = Math.max(chaptersByBook.size, bibleBooks);
  const avgChaptersPerBook =
    booksTouched === 0
      ? 0
      : Math.round((chaptersRead / booksTouched) * 10) / 10;

  return {
    chaptersRead,
    daysCompleted,
    daysMissed,
    avgChaptersPerBook,
    booksTouched,
  };
}

export function formatAvgChapters(value: number) {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1);
}

/** Dipakai supaya React re-render saat storage berubah. */
export function subscribeScheduleProgress(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const events = [
    "reading-progress-updated",
    "bible-completed-updated",
    "storage",
  ] as const;
  for (const event of events) {
    window.addEventListener(event, onChange);
  }
  return () => {
    for (const event of events) {
      window.removeEventListener(event, onChange);
    }
  };
}
