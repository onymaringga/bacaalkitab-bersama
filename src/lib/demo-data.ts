import { format } from "date-fns";

import type {
  DemoNotification,
  DemoProgram,
  Group,
  GroupReflection,
  PersonalNote,
} from "./types";
import { demoSchedule, getDefaultCompletedDates } from "./reading-progress";

export { demoSchedule, getDefaultCompletedDates, demoProgramScheduleMeta } from "./reading-progress";

export const demoUser = {
  name: "Ony Naraulita Maringga",
  email: "onynaraulita@gmail.com",
  role: "member" as const,
};

export const demoProgram: DemoProgram = {
  id: "program-1",
  name: "Bible in One Year 2024",
  organization: "Christian Community A",
};

export const demoTodayReading =
  demoSchedule.find(
    (item) =>
      item.scheduledDate === format(new Date(), "yyyy-MM-dd") &&
      item.passage !== "Belum dijadwalkan",
  ) ??
  demoSchedule.find((item) => item.passage !== "Belum dijadwalkan") ??
  demoSchedule[0];

export const demoGroups: Group[] = [
  {
    id: "group-1",
    name: "TG-16",
    description: "Kelompok baca Alkitab TG-16 — saling mendukung dalam konsistensi harian.",
    memberCount: 8,
    leaderName: "Pingkan Prisilia Istra Langi",
  },
  {
    id: "group-2",
    name: "Group 02",
    description: "Renungan mingguan + saling dorong dalam perjalanan iman.",
    memberCount: 24,
    leaderName: "Bang Daniel",
  },
  {
    id: "group-3",
    name: "Youth Nazareth",
    description: "Kelompok muda — baca singkat, diskusi ringan.",
    memberCount: 16,
    leaderName: "Kak Ruth",
  },
  {
    id: "group-4",
    name: "Keluarga Sion",
    description: "Bacaan keluarga di pagi hari.",
    memberCount: 8,
    leaderName: "Pak Andi",
  },
];

export const demoNotes: PersonalNote[] = [
  {
    id: "note-1",
    scheduleId: "sched-0",
    passage: "Matius 18:21-35",
    content:
      "Tuhan, bantu aku melepaskan kesal terhadap teman kantor. Aku mau belajar mengampuni seperti Engkau mengampuni aku.",
    updatedAt: "2026-07-04",
    visibility: "private",
  },
];

export const demoGroupReflections: GroupReflection[] = [
  {
    id: "refl-1",
    authorName: "Pingkan Prisilia Istra Langi",
    content:
      "Hari ini ayat tentang pengampunan sangat mengena. Aku belajar bahwa mengampuni adalah keputusan, bukan perasaan.",
    time: "Hari ini · 07:12",
    visibility: "group",
    groupId: "group-1",
    groupName: "TG-16",
    passage: "Kejadian 36",
  },
  {
    id: "refl-2",
    authorName: "Megan Graciela Nauli",
    content:
      "Syukur bisa baca bareng. Semoga kita terus saling mengingatkan dengan lembut.",
    time: "Hari ini · 08:40",
    visibility: "group",
    groupId: "group-1",
    groupName: "TG-16",
  },
  {
    id: "refl-3",
    authorName: "Devitha Permatasari",
    content:
      "Aku baru sadar konsistensi kecil tiap hari jauh lebih menolong daripada mengejar semuanya sekaligus.",
    time: "Hari ini · 09:05",
    visibility: "group",
    groupId: "group-1",
    groupName: "TG-16",
  },
  {
    id: "refl-4",
    authorName: "Yessica Sardina Purba",
    content:
      "Doa singkat setelah baca membantu hatiku lebih tenang sebelum mulai kerja.",
    time: "Hari ini · 10:18",
    visibility: "group",
    groupId: "group-1",
    groupName: "TG-16",
  },
  {
    id: "refl-5",
    authorName: "Grace Wijaya",
    content:
      "Bacaan hari ini mengingatkanku untuk tidak buru-buru menilai orang lain. Tuhan melihat hati.",
    time: "Hari ini · 06:55",
    visibility: "group",
    groupId: "group-2",
    groupName: "Group 02",
    passage: "Kejadian 36",
  },
  {
    id: "refl-6",
    authorName: "Michael Chen",
    content:
      "Seringkali aku ingin hasil instan. Pasal ini mengajarkan untuk setia dalam proses yang Tuhan rancang.",
    time: "Kemarin · 21:10",
    visibility: "group",
    groupId: "group-2",
    groupName: "Group 02",
  },
  {
    id: "refl-7",
    authorName: "Kak Ruth",
    content:
      "Anak muda di kelompokku mulai terbuka membagikan renungan. Itu yang paling membahagiakan sebagai pendamping.",
    time: "Kemarin · 19:40",
    visibility: "group",
    groupId: "group-3",
    groupName: "Youth Nazareth",
  },
  {
    id: "refl-8",
    authorName: "Lidya Simbolon",
    content:
      "Ayat kunci hari ini aku tulis di notes HP. Mau kuingat saat stres datang di siang hari.",
    time: "Kemarin · 12:05",
    visibility: "group",
    groupId: "group-2",
    groupName: "Group 02",
  },
  {
    id: "refl-9",
    authorName: "Pak Andi",
    content:
      "Kami baca pagi bersama anak-anak. Mereka bertanya sederhana, tapi justru itu yang menembus hatiku.",
    time: "2 hari lalu · 06:20",
    visibility: "group",
    groupId: "group-4",
    groupName: "Keluarga Sion",
  },
  {
    id: "refl-10",
    authorName: "Anita Putri",
    content:
      "Belajar bahwa ketaatan kecil hari ini bisa jadi fondasi keputusan besar di kemudian hari.",
    time: "2 hari lalu · 08:15",
    visibility: "group",
    groupId: "group-2",
    groupName: "Group 02",
  },
];

export const demoNotifications: DemoNotification[] = [
  {
    id: "notif-1",
    type: "encouragement",
    title: "Dorongan dari Pingkan",
    body: "Kelompokmu sudah berjalan jauh minggu ini. Tetap setia — satu pasal lagi hari ini.",
    time: "2 jam lalu",
  },
  {
    id: "notif-2",
    type: "reminder",
    title: "Pengingat baca lembut",
    body: `Bacaan hari ini: ${demoTodayReading.passage}. Luangkan waktu singkat untuk Firman.`,
    time: "Pagi ini",
  },
  {
    id: "notif-3",
    type: "reflection",
    title: "Renungan baru di kelompok",
    body: "Pingkan membagikan renungan tentang pengampunan.",
    time: "Kemarin",
  },
  {
    id: "notif-4",
    type: "announcement",
    title: "Jadwal zoom kelompok",
    body: "Sharing kelompok dipindah ke Kamis pukul 19.30. Siapkan satu insight singkat dari bacaan minggu ini.",
    time: "Kemarin",
  },
  {
    id: "notif-5",
    type: "reminder",
    title: "Lanjutkan bacaan kemarin",
    body: "Masih ada satu pasal yang menunggu. Baca sebentar saja sudah cukup untuk hari ini.",
    time: "2 hari lalu",
  },
  {
    id: "notif-6",
    type: "encouragement",
    title: "Semangat dari Megan",
    body: "Terima kasih sudah rajin baca minggu ini. Kehadiranmu menguatkan kelompok.",
    time: "3 hari lalu",
  },
  {
    id: "notif-7",
    type: "announcement",
    title: "Update program baca",
    body: "Mulai Senin depan kita masuk rangkaian kitab Keluaran. Jadwal lengkap sudah tersedia di menu Baca.",
    time: "4 hari lalu",
  },
  {
    id: "notif-8",
    type: "reflection",
    title: "Yessica membagikan renungan",
    body: "“Doa singkat setelah baca membantu hatiku lebih tenang sebelum mulai kerja.”",
    time: "5 hari lalu",
  },
];
