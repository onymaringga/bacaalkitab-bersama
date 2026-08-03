import type { GroupMemberProgress, MemberTodayStatus } from "./types";
import { getAvatarUrlByMemberId } from "./member-avatars";

function hashSeed(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Demo last-active relatif ke sekarang agar label tetap masuk akal. */
export function computeDemoLastActiveAt(
  member: Pick<
    GroupMemberProgress,
    "id" | "todayStatus" | "isCurrentUser" | "lastActiveAt"
  >,
) {
  if (member.lastActiveAt) return member.lastActiveAt;

  const now = Date.now();
  if (member.isCurrentUser) {
    return new Date(now - 90_000).toISOString();
  }

  const seed = hashSeed(member.id);
  const status: MemberTodayStatus = member.todayStatus;

  if (status === "completed") {
    return new Date(now - (25 + (seed % 200)) * 60_000).toISOString();
  }
  if (status === "pending") {
    return new Date(now - (2 + (seed % 10)) * 3_600_000).toISOString();
  }
  return new Date(now - (2 + (seed % 5)) * 86_400_000).toISOString();
}

/** Label relatif Indonesia untuk last active. */
export function formatLastActive(iso: string | null | undefined) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;

  const now = Date.now();
  const diffMs = Math.max(0, now - date.getTime());
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHour = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24 && diffDay === 0) return `${diffHour} jam lalu`;
  if (diffDay === 1) {
    const clock = date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `Kemarin · ${clock}`;
  }
  if (diffDay < 7) return `${diffDay} hari lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

function withMemberExtras(member: GroupMemberProgress): GroupMemberProgress {
  const phone =
    member.phone ??
    (member.isCurrentUser
      ? "0812-3456-7890"
      : `0812${String(hashSeed(member.id) % 1_0000_0000).padStart(8, "0")}`);
  return {
    ...member,
    phone,
    avatarUrl: member.avatarUrl ?? getAvatarUrlByMemberId(member.id),
    lastActiveAt: computeDemoLastActiveAt(member),
  };
}

/** Anggota & progress demo untuk kelompok baca Alkitab (14 hari terakhir). */
export const demoGroupMembers: GroupMemberProgress[] = [
  {
    id: "member-1",
    groupId: "group-1",
    name: "Pingkan Prisilia Istra Langi",
    email: "pingkan@example.com",
    role: "leader",
    completedCount: 13,
    missedCount: 1,
    totalPastDays: 14,
    completionRate: 93,
    yearToDateRate: 86,
    streakDays: 7,
    lastReadDate: "2026-07-05",
    todayStatus: "completed",
  },
  {
    id: "member-2",
    groupId: "group-1",
    name: "Ony Naraulita Maringga",
    email: "onynaraulita@gmail.com",
    role: "member",
    completedCount: 10,
    missedCount: 3,
    totalPastDays: 14,
    completionRate: 71,
    yearToDateRate: 62,
    streakDays: 2,
    lastReadDate: "2026-07-05",
    todayStatus: "pending",
    isCurrentUser: true,
  },
  {
    id: "member-3",
    groupId: "group-1",
    name: "Devitha Permatasari",
    email: "devitha@example.com",
    role: "member",
    completedCount: 12,
    missedCount: 2,
    totalPastDays: 14,
    completionRate: 86,
    yearToDateRate: 79,
    streakDays: 4,
    lastReadDate: "2026-07-05",
    todayStatus: "completed",
  },
  {
    id: "member-4",
    groupId: "group-1",
    name: "Megan Graciela Nauli",
    email: "megan@example.com",
    role: "member",
    completedCount: 11,
    missedCount: 2,
    totalPastDays: 14,
    completionRate: 79,
    yearToDateRate: 72,
    streakDays: 3,
    lastReadDate: "2026-07-04",
    todayStatus: "completed",
  },
  {
    id: "member-5",
    groupId: "group-1",
    name: "Rafli Aronta Sitepu",
    email: "rafli@example.com",
    role: "member",
    completedCount: 9,
    missedCount: 4,
    totalPastDays: 14,
    completionRate: 64,
    yearToDateRate: 55,
    streakDays: 1,
    lastReadDate: "2026-07-05",
    todayStatus: "pending",
  },
  {
    id: "member-6",
    groupId: "group-1",
    name: "Christian Bisay",
    email: "christian@example.com",
    role: "member",
    completedCount: 8,
    missedCount: 5,
    totalPastDays: 14,
    completionRate: 57,
    yearToDateRate: 48,
    streakDays: 0,
    lastReadDate: "2026-07-03",
    todayStatus: "missed",
  },
  {
    id: "member-7",
    groupId: "group-1",
    name: "Yessica Sardina Purba",
    email: "yessica@example.com",
    role: "member",
    completedCount: 11,
    missedCount: 2,
    totalPastDays: 14,
    completionRate: 79,
    yearToDateRate: 70,
    streakDays: 3,
    lastReadDate: "2026-07-04",
    todayStatus: "pending",
  },
  {
    id: "member-8",
    groupId: "group-1",
    name: "Tyassari Kusumaningsih",
    email: "tyassari@example.com",
    role: "member",
    completedCount: 14,
    missedCount: 0,
    totalPastDays: 14,
    completionRate: 100,
    yearToDateRate: 91,
    streakDays: 14,
    lastReadDate: "2026-07-05",
    todayStatus: "completed",
  },
  {
    id: "member-9",
    groupId: "group-2",
    name: "Bang Daniel",
    email: "daniel@example.com",
    role: "leader",
    completedCount: 14,
    missedCount: 0,
    totalPastDays: 14,
    completionRate: 100,
    yearToDateRate: 95,
    streakDays: 14,
    lastReadDate: "2026-07-05",
    todayStatus: "completed",
  },
  {
    id: "member-10",
    groupId: "group-2",
    name: "Grace Wijaya",
    email: "grace@example.com",
    role: "member",
    completedCount: 9,
    missedCount: 4,
    totalPastDays: 14,
    completionRate: 64,
    yearToDateRate: 55,
    streakDays: 1,
    lastReadDate: "2026-07-05",
    todayStatus: "completed",
  },
  {
    id: "member-11",
    groupId: "group-2",
    name: "Michael Chen",
    email: "michael@example.com",
    role: "member",
    completedCount: 7,
    missedCount: 6,
    totalPastDays: 14,
    completionRate: 50,
    yearToDateRate: 41,
    streakDays: 0,
    lastReadDate: "2026-07-02",
    todayStatus: "pending",
  },
  {
    id: "member-12",
    groupId: "group-2",
    name: "Anita Putri",
    email: "anita@example.com",
    role: "member",
    completedCount: 12,
    missedCount: 1,
    totalPastDays: 14,
    completionRate: 86,
    yearToDateRate: 74,
    streakDays: 4,
    lastReadDate: "2026-07-05",
    todayStatus: "completed",
  },
  {
    id: "member-13",
    groupId: "group-2",
    name: "Joshua Lim",
    email: "joshua@example.com",
    role: "member",
    completedCount: 5,
    missedCount: 8,
    totalPastDays: 14,
    completionRate: 36,
    yearToDateRate: 29,
    streakDays: 0,
    lastReadDate: "2026-06-30",
    todayStatus: "missed",
  },
  {
    id: "member-14",
    groupId: "group-2",
    name: "Lidya Simbolon",
    email: "lidya@example.com",
    role: "member",
    completedCount: 11,
    missedCount: 2,
    totalPastDays: 14,
    completionRate: 79,
    yearToDateRate: 68,
    streakDays: 3,
    lastReadDate: "2026-07-04",
    todayStatus: "completed",
  },
];

export const demoUserGroupIds = ["group-1"];

/** Urutan tampilan: ketua → user sendiri → nama A–Z. */
export function compareGroupMembers<
  T extends { name: string; role?: string; isCurrentUser?: boolean },
>(a: T, b: T) {
  const aLeader = a.role === "leader";
  const bLeader = b.role === "leader";
  if (aLeader !== bLeader) return aLeader ? -1 : 1;

  const aSelf = Boolean(a.isCurrentUser);
  const bSelf = Boolean(b.isCurrentUser);
  if (aSelf !== bSelf) return aSelf ? -1 : 1;

  return a.name.localeCompare(b.name, "id", { sensitivity: "base" });
}

export function getMembersByGroup(groupId: string) {
  return demoGroupMembers
    .filter((member) => member.groupId === groupId)
    .map(withMemberExtras)
    .sort(compareGroupMembers);
}

export function getMemberById(memberId: string) {
  const member = demoGroupMembers.find((item) => item.id === memberId);
  if (!member) return undefined;
  return withMemberExtras(member);
}

/** Cari anggota demo berdasarkan nama (case-insensitive). */
export function getMemberByName(name: string) {
  const needle = name.trim().toLowerCase();
  if (!needle) return undefined;
  const member = demoGroupMembers.find(
    (item) => item.name.trim().toLowerCase() === needle,
  );
  if (!member) return undefined;
  return withMemberExtras(member);
}

export function getGroupSummary(groupId: string) {
  const members = getMembersByGroup(groupId);
  const avgRate =
    members.length === 0
      ? 0
      : Math.round(
          members.reduce((sum, member) => sum + member.completionRate, 0) /
            members.length,
        );
  const avgYearToDate =
    members.length === 0
      ? 0
      : Math.round(
          members.reduce((sum, member) => sum + member.yearToDateRate, 0) /
            members.length,
        );

  return {
    memberCount: members.length,
    averageCompletionRate: avgRate,
    averageYearToDateRate: avgYearToDate,
    completedToday: members.filter((m) => m.todayStatus === "completed").length,
    pendingToday: members.filter((m) => m.todayStatus === "pending").length,
    missedToday: members.filter((m) => m.todayStatus === "missed").length,
  };
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
