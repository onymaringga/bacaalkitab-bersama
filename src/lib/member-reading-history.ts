import { format, subDays } from "date-fns";

import { demoSchedule } from "@/lib/demo-data";
import type { GroupMemberProgress, MemberReadingDay } from "@/lib/types";

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

function shuffleIndices(length: number, seed: number) {
  const indices = Array.from({ length }, (_, index) => index);
  let state = seed;

  for (let index = length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) | 0;
    const swapIndex = Math.abs(state) % (index + 1);
    [indices[index], indices[swapIndex]] = [indices[swapIndex], indices[index]];
  }

  return indices;
}

export function getMemberReadingHistory(
  member: GroupMemberProgress,
): MemberReadingDay[] {
  const today = new Date();
  const todayKey = format(today, "yyyy-MM-dd");
  const days: MemberReadingDay[] = [];

  for (let offset = 13; offset >= 0; offset -= 1) {
    const date = subDays(today, offset);
    const dateKey = format(date, "yyyy-MM-dd");
    const schedule = demoSchedule.find((item) => item.scheduledDate === dateKey);

    if (!schedule) continue;

    days.push({
      date: dateKey,
      passage: schedule.passage,
      title: schedule.title,
      status: "pending",
    });
  }

  const todayIndex = days.findIndex((day) => day.date === todayKey);
  const pastIndices = days
    .map((_, index) => index)
    .filter((index) => index !== todayIndex);

  const todayCompleted = member.todayStatus === "completed";
  const targetCompleted = Math.min(
    member.completedCount - (todayCompleted ? 1 : 0),
    pastIndices.length,
  );
  const targetMissed = Math.min(member.missedCount, pastIndices.length - targetCompleted);

  const shuffledPast = shuffleIndices(pastIndices.length, hashString(member.id));

  for (let index = 0; index < targetCompleted; index += 1) {
    const dayIndex = pastIndices[shuffledPast[index]];
    days[dayIndex].status = "completed";
  }

  for (let index = 0; index < targetMissed; index += 1) {
    const dayIndex = pastIndices[shuffledPast[targetCompleted + index]];
    days[dayIndex].status = "missed";
  }

  for (const day of days) {
    if (day.date === todayKey) {
      day.status =
        member.todayStatus === "completed"
          ? "completed"
          : member.todayStatus === "missed"
            ? "missed"
            : "pending";
    } else if (day.date > todayKey) {
      day.status = "pending";
    } else if (day.status === "pending") {
      day.status = "missed";
    }
  }

  return days.sort((a, b) => b.date.localeCompare(a.date));
}

export function formatReadingDayLabel(dateKey: string) {
  const date = new Date(`${dateKey}T12:00:00`);
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const yesterdayKey = format(subDays(new Date(), 1), "yyyy-MM-dd");

  if (dateKey === todayKey) return "Hari ini";
  if (dateKey === yesterdayKey) return "Kemarin";

  return format(date, "EEE, d MMM yyyy");
}

export function getRecentTrend(history: MemberReadingDay[]) {
  const lastSeven = history
    .filter((day) => day.date <= format(new Date(), "yyyy-MM-dd"))
    .slice(0, 7);

  return {
    completed: lastSeven.filter((day) => day.status === "completed").length,
    missed: lastSeven.filter((day) => day.status === "missed").length,
    pending: lastSeven.filter((day) => day.status === "pending").length,
  };
}

/** Untuk mini heatmap 14 hari — urutan dari lama ke baru. */
export function getTimelineDays(history: MemberReadingDay[]) {
  return [...history].reverse();
}
