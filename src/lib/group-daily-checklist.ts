import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

import { listMonthOptions, toMonthKey } from "@/lib/calendar-utils";
import { demoSchedule } from "@/lib/demo-data";
import { compareGroupMembers, getMembersByGroup } from "@/lib/group-members";
import { getMemberReadingHistory } from "@/lib/member-reading-history";
import type { MemberReadingDayStatus } from "@/lib/types";

export type GroupDayMemberStatus = {
  id: string;
  name: string;
  role?: "leader" | "member";
  isCurrentUser?: boolean;
  status: MemberReadingDayStatus;
};

export type GroupDayChecklistItem = {
  date: string;
  passage: string;
  title: string;
  completedCount: number;
  totalMembers: number;
  pct: number;
  myStatus: MemberReadingDayStatus;
  members: GroupDayMemberStatus[];
};

export function getGroupChecklistMonthOptions() {
  return listMonthOptions(demoSchedule);
}

/** Progress bacaan harian kelompok untuk satu bulan (default: bulan ini). */
export function getGroupDailyChecklist(
  groupId: string,
  monthKey = toMonthKey(new Date()),
): GroupDayChecklistItem[] {
  const members = getMembersByGroup(groupId);
  if (members.length === 0) return [];

  const histories = new Map(
    members.map((member) => [member.id, getMemberReadingHistory(member)]),
  );

  const monthStart = startOfMonth(parseISO(`${monthKey}-01`));
  const monthEnd = endOfMonth(monthStart);
  const dateKeys = eachDayOfInterval({ start: monthStart, end: monthEnd })
    .map((date) => format(date, "yyyy-MM-dd"))
    .reverse();

  const scheduleByDate = new Map(
    demoSchedule.map((item) => [item.scheduledDate, item] as const),
  );

  const items: GroupDayChecklistItem[] = [];

  for (const dateKey of dateKeys) {
    const schedule = scheduleByDate.get(dateKey);
    if (!schedule) continue;
    if (schedule.passage === "Belum dijadwalkan") continue;

    const dayMembers: GroupDayMemberStatus[] = members
      .map((member) => {
        const history = histories.get(member.id) ?? [];
        const day = history.find((entry) => entry.date === dateKey);
        return {
          id: member.id,
          name: member.name,
          role: member.role,
          isCurrentUser: member.isCurrentUser,
          status: day?.status ?? "pending",
        };
      })
      .sort(compareGroupMembers);

    const completedCount = dayMembers.filter(
      (member) => member.status === "completed",
    ).length;
    const me = dayMembers.find((member) => member.isCurrentUser);

    items.push({
      date: dateKey,
      passage: schedule.passage,
      title: schedule.title,
      completedCount,
      totalMembers: members.length,
      pct: Math.round((completedCount / members.length) * 100),
      myStatus: me?.status ?? "pending",
      members: dayMembers,
    });
  }

  return items;
}
