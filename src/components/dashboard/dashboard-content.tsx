"use client";

import Link from "next/link";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { CheckCircle2, ChevronRight, Info } from "lucide-react";
import { useMemo, useSyncExternalStore } from "react";

import { useDemoAuth } from "@/components/auth/demo-auth-provider";
import { CommunityTimeline } from "@/components/dashboard/community-timeline";
import { DailyBibleFactCard } from "@/components/dashboard/daily-bible-fact-card";
import { ReadingWeekPanel } from "@/components/dashboard/reading-week-panel";
import { DashboardGroupSnapshot } from "@/components/group/dashboard-group-snapshot";
import { useRolePreview } from "@/components/role-preview/role-preview-provider";
import { MemberAvatar } from "@/components/ui/member-avatar";
import { Button } from "@/components/ui/button";
import { ReadingTimeLabel } from "@/components/ui/reading-time-label";
import { copy } from "@/lib/copy";
import {
  demoGroups,
  demoProgram,
  demoTodayReading,
  demoUser,
} from "@/lib/demo-data";
import { formatDisplayDate, formatShortDate } from "@/lib/format-date";
import { useUserGroupIds } from "@/hooks/use-user-group-ids";
import {
  getGroupSummary,
  getMembersByGroup,
} from "@/lib/group-members";
import { estimateReadingTimeForPassage } from "@/lib/reading-time";
import {
  DEMO_PROGRAM_END,
  DEMO_PROGRAM_START,
  countMissedAssignedDays,
  demoSchedule,
  getNextScheduledReading,
  isDateComplete,
  readCompletedDates,
} from "@/lib/reading-progress";
import { subscribeScheduleProgress } from "@/lib/schedule-progress-stats";
import { getReadingKeyVerse } from "@/lib/reading-key-verse";
import { getTodayKey } from "@/lib/reading-status";

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

export function DashboardContent() {
  const { session } = useDemoAuth();
  const { isLeaderView } = useRolePreview();
  const todayKey = getTodayKey();
  const todayComplete = isDateComplete(todayKey);
  const completedDatesKey = useSyncExternalStore(
    subscribeScheduleProgress,
    () => readCompletedDates().join(","),
    () => "",
  );
  const missedDays = useMemo(() => {
    void completedDatesKey;
    return countMissedAssignedDays(todayKey);
  }, [completedDatesKey, todayKey]);
  const displayName = session?.name ?? demoUser.name;
  const firstName = displayName.split(" ")[0];
  const program = getProgramProgress(todayKey);
  const hasReading =
    Boolean(demoTodayReading.passage) &&
    demoTodayReading.passage !== "Belum dijadwalkan";
  const readingKeyVerse = hasReading
    ? getReadingKeyVerse(demoTodayReading.passage)
    : null;

  const userGroupIds = useUserGroupIds();
  const primaryGroup = demoGroups.find((group) =>
    userGroupIds.includes(group.id),
  );
  const summary = primaryGroup ? getGroupSummary(primaryGroup.id) : null;
  const members = primaryGroup ? getMembersByGroup(primaryGroup.id) : [];
  const groupPct = summary
    ? Math.round((summary.completedToday / summary.memberCount) * 100)
    : 0;

  const bibleHref = hasReading
    ? `/baca?tab=alkitab&passage=${encodeURIComponent(demoTodayReading.passage)}`
    : "/baca";
  const primaryCta = hasReading
    ? { href: bibleHref, label: copy.home.readTodayCta }
    : { href: "/jadwal", label: "Lihat jadwal" };
  const nextReading = getNextScheduledReading(todayKey);
  const nextBibleHref = nextReading
    ? `/baca?tab=alkitab&passage=${encodeURIComponent(nextReading.passage)}&date=${encodeURIComponent(nextReading.scheduledDate)}`
    : null;

  return (
    <div className="mx-auto w-full min-w-0 max-w-5xl space-y-6 lg:space-y-8">
      <header className="member-web-animate-in flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium capitalize text-[var(--m-ink-soft)]">
            {formatDisplayDate(todayKey)}
          </p>
          <h1 className="member-web-display mt-1 text-[clamp(1.65rem,3vw,2.35rem)] leading-[1.12] text-[var(--m-ink)]">
            {copy.home.greeting(firstName)}
          </h1>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-[var(--m-ink-soft)]">
            {isLeaderView
              ? copy.home.subtitleLeader
              : todayComplete
                ? copy.home.subtitleDone
                : copy.home.subtitle}
          </p>
        </div>
      </header>

      {missedDays > 0 && !isLeaderView ? (
        <div
          role="status"
          className="member-web-animate-in-delay flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--status-warning-text)]/25 bg-[var(--status-warning-bg)]/60 px-4 py-3 sm:px-5"
        >
          <div className="flex min-w-0 items-start gap-2.5">
            <Info
              className="mt-0.5 size-4 shrink-0 text-[var(--status-warning-text)]"
              aria-hidden
            />
            <div className="min-w-0">
              <p className="font-semibold text-[var(--status-warning-text)]">
                {copy.home.missedDaysLabel(missedDays)}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-[var(--status-warning-text)]/90">
                {copy.home.missedDaysHint(missedDays)}
              </p>
            </div>
          </div>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-9 shrink-0 rounded-xl border-[var(--status-warning-text)]/30 bg-white/80 font-semibold text-[var(--status-warning-text)] hover:bg-white"
          >
            <Link href="/jadwal">
              {copy.home.missedDaysCta}
              <ChevronRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      ) : null}

      {isLeaderView ? (
        <div className="member-web-animate-in-delay lg:hidden">
          <DashboardGroupSnapshot />
        </div>
      ) : null}

      {/* Bacaan hari ini */}
      <div className="member-web-animate-in-delay min-w-0">
        <section className="relative min-h-0 min-w-0 overflow-hidden rounded-3xl">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&h=900&fit=crop)",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, oklch(0.2 0.05 255 / 0.92) 0%, oklch(0.26 0.06 250 / 0.72) 48%, oklch(0.32 0.04 240 / 0.4) 100%)",
            }}
            aria-hidden
          />
          <div className="relative flex h-full min-h-[15rem] flex-col justify-end p-5 sm:min-h-[16.5rem] sm:p-6 lg:min-h-[18rem] lg:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-white/70 uppercase">
                {copy.home.todayReading}
              </p>
              {todayComplete ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-semibold text-white">
                  <CheckCircle2 className="size-3" />
                  Selesai
                </span>
              ) : missedDays > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-400/25 px-2 py-0.5 text-[11px] font-semibold text-amber-100">
                  {copy.home.missedDaysLabel(missedDays)}
                </span>
              ) : null}
            </div>

            <p className="member-web-display mt-2.5 text-[clamp(1.5rem,3.2vw,2.35rem)] leading-[1.08] text-white">
              {hasReading ? demoTodayReading.passage : "Belum dijadwalkan"}
            </p>
            {hasReading ? (
              <ReadingTimeLabel
                className="mt-1.5"
                tone="onDark"
                label={estimateReadingTimeForPassage(demoTodayReading.passage)}
              />
            ) : null}
            <p className="mt-1.5 line-clamp-2 max-w-xl text-sm leading-relaxed text-white/80">
              {hasReading
                ? demoTodayReading.title
                : "Bacaan hari ini belum diisi. Cek jadwal atau kembali nanti."}
            </p>

            {hasReading && readingKeyVerse ? (
              <blockquote className="mt-4 max-w-4xl border-l-2 border-white/35 pl-3 lg:max-w-5xl">
                <p className="member-web-display-italic line-clamp-4 text-[0.9rem] leading-relaxed text-white/90 sm:line-clamp-3 sm:text-[0.95rem]">
                  &ldquo;{readingKeyVerse.text}&rdquo;
                </p>
                <cite className="mt-1.5 block text-[11px] font-semibold not-italic tracking-wide text-white/65">
                  {readingKeyVerse.reference}
                </cite>
              </blockquote>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-2.5">
              <Button
                asChild
                size="lg"
                className="h-11 rounded-xl bg-white px-5 font-semibold text-[var(--m-ink)] hover:bg-white/90"
              >
                <Link href={primaryCta.href}>
                  {primaryCta.label}
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
              {todayComplete && hasReading ? (
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="h-11 rounded-xl border border-white/25 bg-white/10 font-semibold text-white hover:bg-white/20 hover:text-white"
                >
                  <Link
                    href={`/catatan?from=complete&passage=${encodeURIComponent(demoTodayReading.passage)}`}
                  >
                    {copy.home.writeReflection}
                  </Link>
                </Button>
              ) : nextBibleHref ? (
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="h-11 rounded-xl border border-white/25 bg-white/10 font-semibold text-white hover:bg-white/20 hover:text-white"
                >
                  <Link href={nextBibleHref}>{copy.home.readTomorrow}</Link>
                </Button>
              ) : (
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="h-11 rounded-xl border border-white/25 bg-white/10 font-semibold text-white hover:bg-white/20 hover:text-white"
                >
                  <Link href={hasReading ? "/jadwal" : "/baca"}>
                    {hasReading ? "Lihat jadwal" : "Buka Alkitab"}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Mobile: streak / kelompok / program di atas timeline · Desktop: timeline | sidebar */}
      <div className="member-web-animate-in-delay grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(17rem,0.85fr)] lg:items-start">
        <div className="order-1 flex min-w-0 flex-col gap-4 lg:order-2">
          <ReadingWeekPanel />

          {primaryGroup && summary ? (
            <section className="rounded-2xl border border-[var(--m-line)] bg-white/90 px-4 py-4 sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                    Kelompok saya
                  </p>
                  <p className="mt-1 truncate font-semibold text-[var(--m-ink)]">
                    {primaryGroup.name}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--m-ink-soft)]">
                    {copy.groups.leader(primaryGroup.leaderName)}
                  </p>
                </div>
                <Link
                  href="/kelompok"
                  className="shrink-0 text-xs font-semibold text-[var(--m-accent)] hover:underline"
                >
                  Lihat →
                </Link>
              </div>

              <div className="mt-3.5 flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  {members.slice(0, 4).map((member) => (
                    <MemberAvatar
                      key={member.id}
                      name={member.name}
                      memberId={member.id}
                      currentUser={member.isCurrentUser}
                      className="size-7 border-2 border-white sm:size-8"
                      fallbackClassName="bg-[var(--m-wash)] text-[10px] font-semibold text-[var(--m-ink)]"
                    />
                  ))}
                </div>
                <span className="text-xs text-[var(--m-ink-soft)]">
                  {summary.memberCount} {copy.common.members}
                </span>
              </div>

              <div className="mt-3.5">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-[var(--m-ink-soft)]">
                    {summary.completedToday}/{summary.memberCount} sudah baca
                    hari ini
                  </span>
                  <span className="font-semibold tabular-nums text-[var(--m-accent)]">
                    {groupPct}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill transition-all duration-700"
                    style={{ width: `${groupPct}%` }}
                  />
                </div>
              </div>
            </section>
          ) : null}

          <section className="rounded-2xl border border-[var(--m-line)] bg-white/90 px-4 py-4 sm:px-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                  Program aktif
                </p>
                <p className="mt-1 truncate font-semibold text-[var(--m-ink)]">
                  {demoProgram.name}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold tabular-nums text-[var(--m-accent)]">
                {program.pct}%
              </p>
            </div>
            <div className="progress-bar mt-3">
              <div
                className="progress-bar-fill transition-all duration-700"
                style={{ width: `${program.pct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-[var(--m-ink-soft)]">
              Hari ke-{Math.max(program.day, 0)} dari {program.total}
              {program.day > 0 ? (
                <>
                  {" "}
                  · {formatShortDate(DEMO_PROGRAM_START)} –{" "}
                  {formatShortDate(DEMO_PROGRAM_END)}
                </>
              ) : null}
            </p>
          </section>

          <DailyBibleFactCard />
        </div>

        <CommunityTimeline className="order-2 lg:order-1" />
      </div>

      {isLeaderView ? (
        <div className="hidden lg:block">
          <DashboardGroupSnapshot />
        </div>
      ) : null}
    </div>
  );
}
