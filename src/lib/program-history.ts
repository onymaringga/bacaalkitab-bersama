import { demoProgram } from "@/lib/demo-data";
import {
  DEMO_PROGRAM_END,
  DEMO_PROGRAM_START,
} from "@/lib/reading-progress";
import type { DemoProgram } from "@/lib/types";

export type ProgramStatus = "active" | "completed";

export type ProgramRecord = DemoProgram & {
  startDate: string;
  endDate: string;
  status: ProgramStatus;
  participantCount: number;
  groupCount: number;
  completionRate: number;
  certificateCount: number;
  summary: string;
  /** Deskripsi lebih panjang untuk halaman detail */
  description: string;
  /** Target peserta (mis. seluruh komunitas, youth) */
  audience: string;
  /** Irama bacaan harian */
  readingPace: string;
  /** Fokus tema program */
  focusAreas: string[];
  /** Kitab / rangkaian bacaan utama */
  readingTrack: string;
};

/** Program yang sedang berjalan. */
export const demoActiveProgram: ProgramRecord = {
  ...demoProgram,
  startDate: DEMO_PROGRAM_START,
  endDate: DEMO_PROGRAM_END,
  status: "active",
  participantCount: 58,
  groupCount: 4,
  completionRate: 72,
  certificateCount: 0,
  summary:
    "Program baca Alkitab jangka panjang — dimulai dari Kejadian, fokus konsistensi harian.",
  description:
    "Program komunitas untuk membangun kebiasaan baca Alkitab setiap hari. Dimulai dari kitab Kejadian (Juli 2026), lalu dilanjutkan sesuai jadwal yang diisi admin. Setiap peserta mengikuti jadwal resmi, menulis renungan pribadi, dan saling mendukung di dalam kelompok.",
  audience: "Seluruh komunitas",
  readingPace: "1–2 pasal / hari",
  focusAreas: ["Konsistensi harian", "Renungan pribadi", "Saling menguatkan"],
  readingTrack: "Kejadian (Juli 2026) · jadwal lanjutan menyusul",
};

/** Program yang sudah selesai (riwayat). */
export const demoPastPrograms: ProgramRecord[] = [
  {
    id: "program-past-1",
    name: "Advent Journey 2025",
    organization: demoProgram.organization,
    startDate: "2025-12-01",
    endDate: "2025-12-24",
    status: "completed",
    participantCount: 42,
    groupCount: 3,
    completionRate: 88,
    certificateCount: 36,
    summary:
      "24 hari bacaan Advent — singkat, hangat, cocok untuk keluarga dan youth.",
    description:
      "Perjalanan Advent singkat dengan bacaan harian yang ringan. Dirancang agar keluarga dan youth bisa ikut bersama tanpa beban jadwal yang berat, sambil menantikan Natal dengan hati yang lebih tenang.",
    audience: "Keluarga & youth",
    readingPace: "Bacaan singkat / hari",
    focusAreas: ["Menanti Natal", "Keluarga", "Harapan"],
    readingTrack: "Nubuat & kisah kelahiran",
  },
  {
    id: "program-past-2",
    name: "Lent Reflection 2025",
    organization: demoProgram.organization,
    startDate: "2025-03-05",
    endDate: "2025-04-20",
    status: "completed",
    participantCount: 51,
    groupCount: 4,
    completionRate: 79,
    certificateCount: 41,
    summary:
      "Perjalanan puasa dan renungan — fokus pengampunan dan pembaharuan hati.",
    description:
      "Program masa Prapaskah dengan penekanan pada pengampunan, pertobatan, dan pembaharuan hati. Peserta diajak membaca dengan tempo yang tenang dan merefleksikan hidup bersama kelompok.",
    audience: "Seluruh komunitas",
    readingPace: "1 bacaan + renungan / hari",
    focusAreas: ["Pengampunan", "Pertobatan", "Pembaharuan"],
    readingTrack: "Injil & Mazmur pilihan",
  },
  {
    id: "program-past-3",
    name: "Bible in One Year 2024",
    organization: demoProgram.organization,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "completed",
    participantCount: 67,
    groupCount: 5,
    completionRate: 64,
    certificateCount: 29,
    summary:
      "Program tahunan pertama komunitas — fondasi kebiasaan baca bersama.",
    description:
      "Program tahunan pertama yang menjadi fondasi komunitas baca Alkitab bersama. Fokusnya membangun ritme jangka panjang, bukan kecepatan menyelesaikan seluruh Alkitab dalam waktu singkat.",
    audience: "Seluruh komunitas",
    readingPace: "1–2 pasal / hari",
    focusAreas: ["Kebiasaan jangka panjang", "Disiplin rohani", "Komunitas"],
    readingTrack: "Rencana baca setahun",
  },
  {
    id: "program-past-4",
    name: "Youth Summer Read 2024",
    organization: demoProgram.organization,
    startDate: "2024-06-15",
    endDate: "2024-08-15",
    status: "completed",
    participantCount: 28,
    groupCount: 2,
    completionRate: 91,
    certificateCount: 25,
    summary:
      "Program singkat untuk pemuda — bacaan ringan + diskusi mingguan.",
    description:
      "Program musim panas untuk pemuda dengan bacaan ringan dan diskusi mingguan. Dirancang agar mudah diikuti di sela aktivitas sekolah/kuliah atau liburan.",
    audience: "Pemuda",
    readingPace: "Bacaan ringan / hari + diskusi minggu",
    focusAreas: ["Pemuda", "Diskusi", "Persahabatan iman"],
    readingTrack: "Surat & kisah pilihan",
  },
];

export function getAllPrograms(): ProgramRecord[] {
  return [demoActiveProgram, ...demoPastPrograms];
}

export function getProgramById(programId: string): ProgramRecord | undefined {
  return getAllPrograms().find((program) => program.id === programId);
}

export function getPastPrograms(): ProgramRecord[] {
  return demoPastPrograms;
}
