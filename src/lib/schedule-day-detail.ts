import { format } from "date-fns";

import { demoGroups, demoSchedule } from "@/lib/demo-data";
import { demoGroupMembers, getInitials, getMemberById } from "@/lib/group-members";
import {
  getScheduleDevotional,
  resolveScheduleReading,
} from "@/lib/schedule-devotional";
import type {
  MemberReadingDayStatus,
  ReadingSchedule,
  ReflectionVisibility,
} from "@/lib/types";

export type ScheduleDayParticipant = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  groupId: string;
  groupName: string;
  status: MemberReadingDayStatus;
  initials: string;
};

export type ScheduleDayReflection = {
  id: string;
  memberId: string;
  memberName: string;
  groupName: string;
  content: string;
  visibility: ReflectionVisibility;
  initials: string;
};

export type ScheduleDayDetail = {
  schedule: ReadingSchedule;
  /** Renungan resmi (custom) jika ada */
  officialDevotional: ReturnType<typeof getScheduleDevotional>;
  todayKey: string;
  isFuture: boolean;
  isToday: boolean;
  participants: ScheduleDayParticipant[];
  reflections: ScheduleDayReflection[];
  completedCount: number;
  missedCount: number;
  pendingCount: number;
  totalCount: number;
  completionPct: number | null;
};

const REFLECTION_SAMPLES = [
  "Ayat ini mengingatkan aku untuk lebih sabar di tempat kerja. Tuhan, tolong aku mengampuni dengan tulus.",
  "Hari ini aku belajar bahwa kasih bukan soal perasaan saja, tapi keputusan. Mau berusaha lagi.",
  "Bagagian ini sangat menghibur. Rasanya Tuhan dekat saat aku khawatir soal masa depan.",
  "Aku baru sadar sering mengandalkan kekuatan sendiri. Mau belajar berserah lagi.",
  "Renungan singkat: jangan menunda kebaikan kecil. Satu ayat sudah cukup menggerakkan.",
  "Terima kasih untuk kelompok yang saling mengingatkan. Bacaan hari ini terasa lebih hidup.",
  "Yang paling menohok: tentang kerendahan hati. Mohon Tuhan membentuk hatiku.",
  "Aku menulis ini biar tidak lupa — Tuhan setia, bahkan saat aku goyah.",
];

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function statusForMember(
  memberId: string,
  dateKey: string,
  todayKey: string,
): MemberReadingDayStatus {
  if (dateKey > todayKey) return "pending";

  const hash = hashString(`${memberId}:${dateKey}`);
  const roll = hash % 100;

  if (dateKey === todayKey) {
    if (roll < 55) return "completed";
    if (roll < 80) return "pending";
    return "missed";
  }

  if (roll < 68) return "completed";
  if (roll < 88) return "missed";
  return "pending";
}

function visibilityFor(
  memberId: string,
  dateKey: string,
): ReflectionVisibility {
  const roll = hashString(`vis:${memberId}:${dateKey}`) % 3;
  if (roll === 0) return "group";
  if (roll === 1) return "leader";
  return "private";
}

export function getScheduleByDate(dateKey: string) {
  const schedule = demoSchedule.find((item) => item.scheduledDate === dateKey);
  return schedule ? resolveScheduleReading(schedule) : undefined;
}

export function getScheduleDayDetail(dateKey: string): ScheduleDayDetail | null {
  const base = demoSchedule.find((item) => item.scheduledDate === dateKey);
  if (!base) return null;
  const schedule = resolveScheduleReading(base);
  const officialDevotional = getScheduleDevotional(dateKey);

  const todayKey = format(new Date(), "yyyy-MM-dd");
  const isFuture = dateKey > todayKey;
  const isToday = dateKey === todayKey;

  const participants: ScheduleDayParticipant[] = demoGroupMembers.map(
    (raw) => {
      const member = getMemberById(raw.id) ?? raw;
      const group = demoGroups.find((g) => g.id === member.groupId);
      return {
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        groupId: member.groupId,
        groupName: group?.name ?? "Tanpa kelompok",
        status: statusForMember(member.id, dateKey, todayKey),
        initials: getInitials(member.name),
      };
    },
  );

  const completed = participants.filter((p) => p.status === "completed");
  const missed = participants.filter((p) => p.status === "missed");
  const pending = participants.filter((p) => p.status === "pending");

  const reflections: ScheduleDayReflection[] = [];

  if (!isFuture) {
    for (const person of completed) {
      const hash = hashString(`note:${person.id}:${dateKey}`);
      // ~65% completed readers wrote a reflection visible to admin
      if (hash % 100 >= 65) continue;

      const visibility = visibilityFor(person.id, dateKey);
      // Admin can see all for program health demo; still label visibility
      reflections.push({
        id: `refl-${person.id}-${dateKey}`,
        memberId: person.id,
        memberName: person.name,
        groupName: person.groupName,
        content: REFLECTION_SAMPLES[hash % REFLECTION_SAMPLES.length],
        visibility,
        initials: person.initials,
      });
    }
  }

  const totalCount = participants.length;
  const completedCount = completed.length;
  const completionPct =
    isFuture || totalCount === 0
      ? null
      : Math.round((completedCount / totalCount) * 100);

  return {
    schedule,
    officialDevotional,
    todayKey,
    isFuture,
    isToday,
    participants: [...participants].sort((a, b) => {
      const order = { completed: 0, pending: 1, missed: 2 };
      const byStatus = order[a.status] - order[b.status];
      if (byStatus !== 0) return byStatus;
      return a.name.localeCompare(b.name);
    }),
    reflections,
    completedCount,
    missedCount: missed.length,
    pendingCount: pending.length,
    totalCount,
    completionPct,
  };
}

export function visibilityLabel(visibility: ReflectionVisibility) {
  if (visibility === "group") return "Kelompok";
  if (visibility === "leader") return "Ketua";
  return "Pribadi";
}
