export type UserRole = "admin" | "leader" | "member";

export type ReadingSchedule = {
  id: string;
  scheduledDate: string;
  title: string;
  passage: string;
  devotional: string;
  reflectionPrompt: string;
  completed?: boolean;
};

export type Group = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  leaderName: string;
};

export type GroupMemberRole = "leader" | "member";

export type MemberTodayStatus = "completed" | "pending" | "missed";

export type MemberReadingDayStatus = "completed" | "missed" | "pending";

export type MemberReadingDay = {
  date: string;
  passage: string;
  title: string;
  status: MemberReadingDayStatus;
};

export type GroupMemberProgress = {
  id: string;
  groupId: string;
  name: string;
  email: string;
  /** Nomor HP untuk pengingat WhatsApp (opsional). */
  phone?: string;
  role: GroupMemberRole;
  /** URL foto profil (demo). */
  avatarUrl?: string;
  completedCount: number;
  missedCount: number;
  totalPastDays: number;
  completionRate: number;
  yearToDateRate: number;
  streakDays: number;
  lastReadDate: string | null;
  /** Waktu terakhir aktif di app (ISO). Diisi otomatis untuk demo jika kosong. */
  lastActiveAt?: string | null;
  todayStatus: MemberTodayStatus;
  isCurrentUser?: boolean;
};

export type PersonalNote = {
  id: string;
  scheduleId: string;
  passage: string;
  content: string;
  updatedAt: string;
  visibility?: ReflectionVisibility;
};

export type ReflectionVisibility = "private" | "leader" | "group";

export type DemoNotification = {
  id: string;
  type: "reminder" | "encouragement" | "announcement" | "reflection";
  title: string;
  body: string;
  time: string;
};

export type DemoProgram = {
  id: string;
  name: string;
  organization: string;
};

export type GroupReflection = {
  id: string;
  authorName: string;
  content: string;
  time: string;
  visibility: ReflectionVisibility;
  /** Nama kelompok penulis — untuk feed lintas kelompok. */
  groupName?: string;
  groupId?: string;
  passage?: string;
};

export type DemoUser = {
  name: string;
  email: string;
  role: UserRole;
};
