import type { ReadingSchedule } from "@/lib/types";

export type DevotionalAuthorRole = "admin" | "leader";

export type ScheduleDevotional = {
  dateKey: string;
  content: string;
  authorRole: DevotionalAuthorRole;
  authorName: string;
  updatedAt: string;
};

/** Renungan resmi per tanggal — hilang saat refresh (demo). */
const devotionals = new Map<string, ScheduleDevotional>();

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeScheduleDevotionals(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getScheduleDevotional(
  dateKey: string,
): ScheduleDevotional | null {
  return devotionals.get(dateKey) ?? null;
}

export function saveScheduleDevotional(input: {
  dateKey: string;
  content: string;
  authorRole: DevotionalAuthorRole;
  authorName: string;
}): ScheduleDevotional {
  const entry: ScheduleDevotional = {
    dateKey: input.dateKey,
    content: input.content.trim(),
    authorRole: input.authorRole,
    authorName: input.authorName,
    updatedAt: new Date().toISOString(),
  };
  devotionals.set(input.dateKey, entry);
  notify();
  return entry;
}

export function clearScheduleDevotional(dateKey: string) {
  devotionals.delete(dateKey);
  notify();
}

/** Gabungkan renungan custom ke jadwal (jika ada). */
export function resolveScheduleReading(
  schedule: ReadingSchedule,
): ReadingSchedule {
  const custom = getScheduleDevotional(schedule.scheduledDate);
  if (!custom?.content) return schedule;
  return {
    ...schedule,
    devotional: custom.content,
  };
}

export function authorRoleLabel(role: DevotionalAuthorRole) {
  return role === "admin" ? "Admin" : "Ketua kelompok";
}
