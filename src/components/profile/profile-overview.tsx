"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { differenceInCalendarDays, parseISO } from "date-fns";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Flame,
  Heart,
  NotebookPen,
  PenLine,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { copy } from "@/lib/copy";
import {
  getServerChapterNotes,
  listChapterNotes,
  subscribeChapterNotes,
} from "@/lib/bible-chapter-notes";
import {
  getCommunityReflectionFeed,
  getServerCommunityReflectionFeed,
  subscribeCommunityReflectionFeed,
} from "@/lib/community-reflections";
import {
  demoGroups,
  demoProgram,
  demoTodayReading,
} from "@/lib/demo-data";
import { formatShortDate } from "@/lib/format-date";
import {
  demoUserGroupIds,
  getGroupSummary,
} from "@/lib/group-members";
import {
  DEMO_PROGRAM_END,
  DEMO_PROGRAM_START,
  demoSchedule,
  getCompletedReadingCount,
  getCurrentReadingStreak,
  getDefaultCompletedDates,
  getEstimatedReadingHours,
  getLongestReadingStreak,
  getRecentCompletedReadings,
  isDateComplete,
  readCompletedDates,
} from "@/lib/reading-progress";
import { getTodayKey } from "@/lib/reading-status";
import { cn } from "@/lib/utils";

const SERVER_COMPLETED = getDefaultCompletedDates();

let completedCacheKey: string | null = null;
let completedCache: string[] | null = null;

function getCompletedSnapshot() {
  const list = readCompletedDates();
  const key = list.join("|");
  if (completedCache && completedCacheKey === key) return completedCache;
  completedCacheKey = key;
  completedCache = list;
  return completedCache;
}

function subscribeCompleted(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const wrapped = () => {
    completedCacheKey = null;
    completedCache = null;
    onChange();
  };
  window.addEventListener("reading-progress-updated", wrapped);
  window.addEventListener("storage", wrapped);
  return () => {
    window.removeEventListener("reading-progress-updated", wrapped);
    window.removeEventListener("storage", wrapped);
  };
}

function getProgramProgress(todayKey: string) {
  const total = demoSchedule.length;
  const start = parseISO(DEMO_PROGRAM_START);
  const end = parseISO(DEMO_PROGRAM_END);
  const today = parseISO(todayKey);

  let day = differenceInCalendarDays(today, start) + 1;
  if (today < start) day = 0;
  if (today > end) day = total;

  const pct = total === 0 ? 0 : Math.round((day / total) * 100);
  return { day, total, pct };
}

type ActivityItem = {
  id: string;
  kind: "read" | "reflection" | "note";
  title: string;
  detail: string;
  time: string;
  href?: string;
};

type ProfileOverviewProps = {
  className?: string;
};

export function ProfileOverview({ className }: ProfileOverviewProps) {
  const todayKey = getTodayKey();
  const completedList = useSyncExternalStore(
    subscribeCompleted,
    getCompletedSnapshot,
    () => SERVER_COMPLETED,
  );
  const notes = useSyncExternalStore(
    subscribeChapterNotes,
    listChapterNotes,
    getServerChapterNotes,
  );
  const reflections = useSyncExternalStore(
    subscribeCommunityReflectionFeed,
    getCommunityReflectionFeed,
    getServerCommunityReflectionFeed,
  );

  const stats = useMemo(() => {
    void completedList;
    return {
      completedDays: getCompletedReadingCount(),
      currentStreak: getCurrentReadingStreak(todayKey),
      longestStreak: getLongestReadingStreak(),
      hours: getEstimatedReadingHours(),
      groups: demoUserGroupIds.length,
    };
  }, [completedList, todayKey]);

  const program = useMemo(() => getProgramProgress(todayKey), [todayKey]);
  const todayComplete = isDateComplete(todayKey);
  const hasReading =
    Boolean(demoTodayReading.passage) &&
    demoTodayReading.passage !== "Belum dijadwalkan";
  const bibleHref = hasReading
    ? `/baca?tab=alkitab&passage=${encodeURIComponent(demoTodayReading.passage)}`
    : "/baca";

  const primaryGroup =
    demoGroups.find((group) => demoUserGroupIds.includes(group.id)) ??
    demoGroups[0];
  const summary = primaryGroup ? getGroupSummary(primaryGroup.id) : null;

  const achievements = useMemo(() => {
    const myReflections = reflections.filter((item) => item.isMine).length;
    const noteCount = notes.length;
    return [
      {
        id: "streak-3",
        label: "3 hari beruntun",
        unlocked: stats.currentStreak >= 3 || stats.longestStreak >= 3,
        icon: Flame,
        tone: {
          surface: "bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100/90",
          medal: "bg-gradient-to-br from-orange-400 to-amber-600 text-white",
          glow: "bg-orange-400/40",
          caption: "text-orange-700/80",
        },
      },
      {
        id: "streak-7",
        label: "7 hari konsisten",
        unlocked: stats.longestStreak >= 7 || stats.completedDays >= 7,
        icon: BookOpen,
        tone: {
          surface: "bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-100/80",
          medal: "bg-gradient-to-br from-sky-500 to-teal-600 text-white",
          glow: "bg-sky-400/35",
          caption: "text-teal-700/80",
        },
      },
      {
        id: "reflect",
        label: "Tulis refleksi",
        unlocked: myReflections > 0 || noteCount > 0,
        icon: Heart,
        tone: {
          surface: "bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100/90",
          medal: "bg-gradient-to-br from-rose-400 to-pink-600 text-white",
          glow: "bg-rose-400/35",
          caption: "text-rose-700/80",
        },
      },
      {
        id: "group",
        label: "Aktif di kelompok",
        unlocked: stats.groups > 0,
        icon: Users,
        tone: {
          surface: "bg-gradient-to-br from-emerald-50 via-green-50 to-lime-100/80",
          medal: "bg-gradient-to-br from-emerald-500 to-green-700 text-white",
          glow: "bg-emerald-400/35",
          caption: "text-emerald-800/75",
        },
      },
    ];
  }, [notes.length, reflections, stats]);

  const activities = useMemo(() => {
    const items: ActivityItem[] = [];

    for (const reading of getRecentCompletedReadings(4)) {
      items.push({
        id: `read-${reading.dateKey}`,
        kind: "read",
        title: "Membaca Alkitab",
        detail: reading.passage ?? "Bacaan terjadwal",
        time: formatShortDate(reading.dateKey),
        href: reading.passage
          ? `/baca?tab=alkitab&passage=${encodeURIComponent(reading.passage)}&date=${encodeURIComponent(reading.dateKey)}`
          : "/jadwal",
      });
    }

    for (const note of notes.slice(0, 3)) {
      items.push({
        id: `note-${note.reference}-${note.updatedAt}`,
        kind: "note",
        title: "Refleksi diri",
        detail: note.reference,
        time: new Date(note.updatedAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        }),
        href: `/baca?tab=alkitab&passage=${encodeURIComponent(note.reference)}`,
      });
    }

    for (const item of reflections.filter((entry) => entry.isMine).slice(0, 3)) {
      items.push({
        id: `ref-${item.id}`,
        kind: "reflection",
        title: "Membagikan refleksi",
        detail: item.passage ?? item.content.slice(0, 48),
        time: item.time,
        href: "/catatan",
      });
    }

    return items.slice(0, 6);
  }, [notes, reflections, completedList]);

  return (
    <div className={cn("space-y-5", className)}>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        <StatTile
          icon={BookOpen}
          value={String(stats.completedDays)}
          label="Hari konsisten"
        />
        <StatTile
          icon={Flame}
          value={String(Math.max(stats.longestStreak, stats.currentStreak))}
          label="Streak terpanjang"
          accent="orange"
        />
        <StatTile
          icon={Clock3}
          value={stats.hours > 0 ? String(stats.hours) : "0"}
          label="Jam membaca"
        />
        <StatTile
          icon={Users}
          value={String(stats.groups)}
          label="Kelompok"
        />
      </div>

      {/* Journey */}
      <section className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--m-line)] px-4 py-3 sm:px-5">
          <h2 className="text-sm font-semibold text-[var(--m-ink)]">
            Perjalanan saya
          </h2>
          <Link
            href="/jadwal"
            className="inline-flex items-center gap-0.5 text-xs font-semibold text-[var(--m-accent)] hover:underline"
          >
            Lihat jadwal
            <ChevronRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] sm:items-stretch sm:p-5">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
              Program aktif
            </p>
            <p className="mt-1 font-semibold text-[var(--m-ink)]">
              {demoProgram.name}
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-xs text-[var(--m-ink-soft)]">
                Hari ke-{Math.max(program.day, 0)} dari {program.total}
              </p>
              <p className="text-sm font-semibold tabular-nums text-[var(--m-accent)]">
                {program.pct}%
              </p>
            </div>
            <div className="progress-bar mt-2">
              <div
                className="progress-bar-fill transition-all duration-700"
                style={{ width: `${program.pct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-[var(--m-ink-soft)]">
              {formatShortDate(DEMO_PROGRAM_START)} –{" "}
              {formatShortDate(DEMO_PROGRAM_END)}
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-xl bg-[var(--m-wash)]/70 px-4 py-3.5">
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                {copy.home.todayReading}
              </p>
              <p className="mt-1 text-base font-semibold text-[var(--m-ink)]">
                {hasReading ? demoTodayReading.passage : "Belum dijadwalkan"}
              </p>
              {todayComplete ? (
                <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                  <CheckCircle2 className="size-3.5" />
                  Sudah selesai hari ini
                </p>
              ) : null}
            </div>
            <Button
              asChild
              size="sm"
              className="mt-3 h-9 w-full rounded-xl font-semibold"
            >
              <Link href={todayComplete ? "/catatan" : bibleHref}>
                {todayComplete
                  ? copy.home.writeReflection
                  : copy.home.continueReading}
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
        {/* Group */}
        {primaryGroup && summary ? (
          <section className="flex h-full flex-col rounded-2xl border border-[var(--m-line)] bg-white/90">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--m-line)] px-4 py-3 sm:px-5">
              <h2 className="text-sm font-semibold text-[var(--m-ink)]">
                Kelompok saya
              </h2>
              <Link
                href="/kelompok"
                className="inline-flex items-center gap-0.5 text-xs font-semibold text-[var(--m-accent)] hover:underline"
              >
                Lihat
                <ChevronRight className="size-3.5" />
              </Link>
            </div>
            <div className="flex h-full flex-col justify-between gap-3 px-4 py-4 sm:px-5">
              <div>
                <p className="font-semibold text-[var(--m-ink)]">
                  {primaryGroup.name}
                </p>
                <p className="mt-0.5 text-xs text-[var(--m-ink-soft)]">
                  {summary.memberCount} anggota ·{" "}
                  {copy.groups.leader(primaryGroup.leaderName)}
                </p>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--m-ink-soft)]">
                  {primaryGroup.description}
                </p>
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px] text-[var(--m-ink-soft)]">
                  <span>Baca hari ini</span>
                  <span className="font-semibold tabular-nums text-[var(--m-ink)]">
                    {summary.completedToday}/{summary.memberCount}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--m-wash)]">
                  <div
                    className="h-full rounded-full bg-[var(--m-accent)] transition-all"
                    style={{
                      width: `${
                        summary.memberCount === 0
                          ? 0
                          : Math.round(
                              (summary.completedToday / summary.memberCount) *
                                100,
                            )
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* Achievements */}
        <section className="flex h-full flex-col rounded-2xl border border-[var(--m-line)] bg-white/90">
          <div className="border-b border-[var(--m-line)] px-4 py-3 sm:px-5">
            <h2 className="text-sm font-semibold text-[var(--m-ink)]">
              Pencapaian
            </h2>
          </div>
          <div className="grid flex-1 grid-cols-2 content-start gap-2.5 p-4 sm:gap-3 sm:p-5">
            {achievements.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "group relative flex items-center gap-2.5 overflow-hidden rounded-2xl px-3 py-2.5",
                    "border border-black/5",
                    "shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_6px_14px_-8px_rgba(20,30,50,0.35)]",
                    item.unlocked
                      ? item.tone.surface
                      : "bg-zinc-100/80 opacity-60 grayscale",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute -right-3 -top-4 size-14 rounded-full blur-2xl",
                      item.unlocked ? item.tone.glow : "bg-transparent",
                    )}
                  />
                  <span
                    className={cn(
                      "relative flex size-10 shrink-0 items-center justify-center rounded-full",
                      "shadow-[0_2px_0_rgba(255,255,255,0.35)_inset,0_4px_10px_-2px_rgba(0,0,0,0.28)]",
                      "ring-1 ring-white/40",
                      item.unlocked
                        ? item.tone.medal
                        : "bg-zinc-300 text-zinc-600",
                    )}
                  >
                    <Icon className="size-4 drop-shadow-sm" />
                  </span>
                  <div className="relative min-w-0">
                    <p className="text-xs font-semibold leading-snug text-[var(--m-ink)]">
                      {item.label}
                    </p>
                    <p
                      className={cn(
                        "mt-0.5 text-[10px] font-medium",
                        item.unlocked
                          ? item.tone.caption
                          : "text-[var(--m-ink-soft)]",
                      )}
                    >
                      {item.unlocked ? "Terbuka" : "Terkunci"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Activity */}
      <section className="rounded-2xl border border-[var(--m-line)] bg-white/90">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--m-line)] px-4 py-3 sm:px-5">
          <h2 className="text-sm font-semibold text-[var(--m-ink)]">
            Aktivitas saya
          </h2>
          <Link
            href="/catatan"
            className="inline-flex items-center gap-0.5 text-xs font-semibold text-[var(--m-accent)] hover:underline"
          >
            Renungan
            <ChevronRight className="size-3.5" />
          </Link>
        </div>

        {activities.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-[var(--m-ink-soft)] sm:px-5">
            Belum ada aktivitas. Mulai dari baca hari ini.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--m-line)]">
            {activities.map((item) => {
              const Icon =
                item.kind === "read"
                  ? BookOpen
                  : item.kind === "note"
                    ? NotebookPen
                    : PenLine;
              const body = (
                <div className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--m-wash)] text-[var(--m-accent)]">
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-[var(--m-ink)]">
                        {item.title}
                      </p>
                      <span className="shrink-0 text-[11px] text-[var(--m-ink-soft)]">
                        {item.time}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-[var(--m-ink-soft)]">
                      {item.detail}
                    </p>
                  </div>
                </div>
              );

              return (
                <li key={item.id}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="block transition-colors hover:bg-[var(--m-wash)]/40"
                    >
                      {body}
                    </Link>
                  ) : (
                    body
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatTile({
  icon: Icon,
  value,
  label,
  accent = "accent",
}: {
  icon: typeof BookOpen;
  value: string;
  label: string;
  accent?: "accent" | "orange";
}) {
  return (
    <div className="rounded-2xl border border-[var(--m-line)] bg-white/90 px-3.5 py-3.5 sm:px-4">
      <div
        className={cn(
          "mb-2.5 flex size-8 items-center justify-center rounded-xl",
          accent === "orange" ? "bg-orange-50 text-orange-500" : "bg-[var(--m-wash)] text-[var(--m-accent)]",
        )}
      >
        <Icon className="size-3.5" />
      </div>
      <p
        className={cn(
          "text-xl font-bold tabular-nums leading-none tracking-tight sm:text-2xl",
          accent === "orange" ? "text-orange-600" : "text-[var(--m-ink)]",
        )}
      >
        {value}
      </p>
      <p className="mt-1.5 text-[11px] leading-snug text-[var(--m-ink-soft)] sm:text-xs">
        {label}
      </p>
    </div>
  );
}
