"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  PenLine,
} from "lucide-react";

import { GroupDailyChecklist } from "@/components/group/group-daily-checklist";
import { GroupRecentActivities } from "@/components/group/group-recent-activities";
import { GroupTimelineFeed } from "@/components/group/group-timeline-feed";
import { useRolePreview } from "@/components/role-preview/role-preview-provider";
import { MemberAvatar } from "@/components/ui/member-avatar";
import { Button } from "@/components/ui/button";
import {
  defaultGroupReminderMessage,
  SendReminderButton,
} from "@/components/ui/send-reminder-dialog";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { copy } from "@/lib/copy";
import { demoGroups, demoTodayReading } from "@/lib/demo-data";
import { useUserGroupIds } from "@/hooks/use-user-group-ids";
import {
  formatLastActive,
  getGroupSummary,
  getMembersByGroup,
} from "@/lib/group-members";
import { getRoleLabel } from "@/lib/role-label";
import { cn } from "@/lib/utils";

type GroupTab = "overview" | "progress" | "anggota";
type FeedPane = "activity" | "timeline";

export function KelompokView() {
  const { isLeaderView } = useRolePreview();
  const [tab, setTab] = useState<GroupTab>("overview");
  const [feedPane, setFeedPane] = useState<FeedPane>("timeline");
  const userGroupIds = useUserGroupIds();
  const primaryGroup = demoGroups.find((group) =>
    userGroupIds.includes(group.id),
  );

  if (!primaryGroup) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-4 py-8 text-center">
        <p className="text-[0.65rem] font-semibold tracking-[0.12em] text-[var(--m-accent)] uppercase">
          {copy.nav.group}
        </p>
        <h1 className="member-web-display text-2xl text-[var(--m-ink)]">
          {copy.groups.noGroupTitle}
        </h1>
        <p className="text-sm leading-relaxed text-[var(--m-ink-soft)]">
          {copy.groups.noGroupHint}
        </p>
        <Button asChild className="mt-2 rounded-xl">
          <Link href="/dashboard">{copy.groups.noGroupCta}</Link>
        </Button>
      </div>
    );
  }

  const summary = getGroupSummary(primaryGroup.id);
  const members = getMembersByGroup(primaryGroup.id);
  const todayPct = Math.round(
    (summary.completedToday / summary.memberCount) * 100,
  );
  const attentionMembers = members.filter(
    (m) => m.todayStatus === "pending" || m.todayStatus === "missed",
  );
  const reflectionHref = `/catatan?from=complete&passage=${encodeURIComponent(demoTodayReading.passage)}`;
  const readingHref = `/baca?tab=alkitab&passage=${encodeURIComponent(demoTodayReading.passage)}`;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4 lg:space-y-5">
      <header className="member-web-animate-in space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold tracking-[0.12em] text-[var(--m-accent)] uppercase">
              {copy.nav.group}
            </p>
            <h1 className="member-web-display mt-1 text-[clamp(1.45rem,2.4vw,1.9rem)] leading-tight text-[var(--m-ink)]">
              {primaryGroup.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--m-ink-soft)]">
              <span>
                {summary.memberCount} {copy.common.members}
              </span>
              <span aria-hidden>·</span>
              <span>{copy.groups.leader(primaryGroup.leaderName)}</span>
            </div>
          </div>

          <div className="flex -space-x-2 shrink-0">
            {members.slice(0, 5).map((member) => (
              <MemberAvatar
                key={member.id}
                name={member.name}
                memberId={member.id}
                currentUser={member.isCurrentUser}
                className="size-8 border-2 border-[var(--m-paper)] sm:size-9"
                fallbackClassName="bg-[var(--m-wash)] text-[10px] font-semibold text-[var(--m-ink)]"
              />
            ))}
            {members.length > 5 ? (
              <span className="flex size-8 items-center justify-center rounded-full border-2 border-[var(--m-paper)] bg-[var(--m-wash)] text-[10px] font-semibold text-[var(--m-ink-soft)] sm:size-9">
                +{members.length - 5}
              </span>
            ) : null}
          </div>
        </div>

        <Link
          href={readingHref}
          className="flex items-center gap-3 rounded-2xl border border-[var(--m-line)] bg-white/90 px-3.5 py-3 transition-colors hover:bg-[var(--m-wash)]/40 sm:px-4"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--m-accent)]/10 text-[var(--m-accent)]">
            <BookOpen className="size-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
              {copy.groups.todayPassage}
            </p>
            <p className="truncate text-sm font-semibold text-[var(--m-ink)]">
              {demoTodayReading.passage}
            </p>
          </div>
          <ArrowRight className="size-4 shrink-0 text-[var(--m-ink-soft)]" />
        </Link>
      </header>

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as GroupTab)}
        className="member-web-animate-in-delay space-y-4"
      >
        <div className="space-y-2.5">
          <TabsList className="grid h-10 w-full grid-cols-3 gap-0.5 rounded-xl border border-[var(--m-line)] bg-white/90 p-1 sm:inline-flex sm:w-fit">
            <TabsTrigger
              value="overview"
              className="rounded-lg px-2 text-xs sm:flex-none sm:px-4 sm:text-sm data-active:bg-[var(--m-accent)] data-active:text-white data-active:shadow-none"
            >
              {copy.groups.tabOverview}
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="rounded-lg px-2 text-xs sm:flex-none sm:px-4 sm:text-sm data-active:bg-[var(--m-accent)] data-active:text-white data-active:shadow-none"
            >
              {copy.groups.tabProgress}
            </TabsTrigger>
            <TabsTrigger
              value="anggota"
              className="gap-1 rounded-lg px-2 text-xs sm:flex-none sm:gap-1.5 sm:px-4 sm:text-sm data-active:bg-[var(--m-accent)] data-active:text-white data-active:shadow-none"
            >
              {copy.groups.tabMembers}
              <span className="rounded-md bg-black/10 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums">
                {summary.memberCount}
              </span>
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" className="h-9 rounded-xl font-semibold">
              <Link href={reflectionHref}>
                <PenLine className="size-3.5" />
                {copy.groups.writeReflection}
              </Link>
            </Button>
            {isLeaderView ? (
              <SendReminderButton
                recipientName={primaryGroup.name}
                recipientLabel={`kelompok ${primaryGroup.name}`}
                recipientEmail={members
                  .filter((m) => !m.isCurrentUser)
                  .map((m) => m.email)}
                defaultMessage={defaultGroupReminderMessage(primaryGroup.name)}
                variant="outline"
                size="sm"
                className="h-9 rounded-xl font-semibold"
                successMessage="Pengingat lembut terkirim via email ke grup"
              >
                {copy.groups.sendReminder}
              </SendReminderButton>
            ) : null}
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <section className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
            <div className="grid sm:grid-cols-[1.15fr_0.85fr]">
              <div className="flex items-center gap-3.5 px-4 py-4 sm:px-5">
                <ProgressRing value={todayPct} size={64} />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold tracking-wide text-[var(--m-accent)] uppercase">
                    {copy.groups.todayRead}
                  </p>
                  <p className="mt-0.5 text-2xl font-semibold tabular-nums text-[var(--m-ink)]">
                    {summary.completedToday}
                    <span className="text-base font-medium text-[var(--m-ink-soft)]">
                      /{summary.memberCount}
                    </span>
                  </p>
                  <p className="text-xs text-[var(--m-ink-soft)]">
                    {todayPct}% anggota sudah baca hari ini
                  </p>
                </div>
              </div>
              <div className="border-t border-[var(--m-line)] px-4 py-4 sm:border-t-0 sm:border-l sm:px-5">
                <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                  {copy.groups.avg14Days}
                </p>
                <p className="member-web-display mt-1 text-[1.75rem] leading-none text-[var(--m-ink)]">
                  {summary.averageCompletionRate}%
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--m-ink-soft)]">
                  Konsistensi baca kelompok secara keseluruhan
                </p>
              </div>
            </div>
          </section>

          {isLeaderView && attentionMembers.length > 0 ? (
            <button
              type="button"
              onClick={() => setTab("anggota")}
              className="flex w-full items-center gap-3 rounded-xl border border-[var(--status-warning-text)]/20 bg-[var(--status-warning-bg)]/40 px-3.5 py-2.5 text-left transition hover:bg-[var(--status-warning-bg)]/55"
            >
              <AlertTriangle
                className="size-4 shrink-0 text-[var(--status-warning-text)]"
                aria-hidden
              />
              <p className="min-w-0 flex-1 text-sm text-[var(--m-ink)]">
                <span className="font-semibold">
                  {copy.groups.membersNeedAttention(attentionMembers.length)}
                </span>
              </p>
              <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-[var(--m-accent)]">
                {copy.groups.attentionCta}
                <ArrowRight className="size-3.5" />
              </span>
            </button>
          ) : null}

          {/* Mobile: satu feed per layar */}
          <div className="space-y-3 lg:hidden">
            <div
              role="tablist"
              aria-label="Feed kelompok"
              className="grid grid-cols-2 gap-0.5 rounded-xl border border-[var(--m-line)] bg-white/90 p-1"
            >
              {(
                [
                  { id: "timeline" as const, label: copy.groups.feedTimeline },
                  { id: "activity" as const, label: copy.groups.feedActivity },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={feedPane === item.id}
                  onClick={() => setFeedPane(item.id)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-xs font-semibold transition",
                    feedPane === item.id
                      ? "bg-[var(--m-accent)] text-white"
                      : "text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {feedPane === "timeline" ? (
              <GroupTimelineFeed
                groupId={primaryGroup.id}
                groupName={primaryGroup.name}
                className="min-h-[22rem]"
              />
            ) : (
              <GroupRecentActivities
                groupId={primaryGroup.id}
                kinds={["read"]}
                limit={7}
                onViewMembers={() => setTab("anggota")}
                className="min-h-[22rem]"
              />
            )}
          </div>

          {/* Desktop: berdampingan */}
          <section className="hidden gap-4 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)] lg:items-stretch">
            <GroupRecentActivities
              groupId={primaryGroup.id}
              kinds={["read"]}
              limit={7}
              onViewMembers={() => setTab("anggota")}
              className="h-full min-h-0 max-h-[34rem]"
            />
            <GroupTimelineFeed
              groupId={primaryGroup.id}
              groupName={primaryGroup.name}
              className="h-full min-h-0 max-h-[34rem]"
            />
          </section>
        </TabsContent>

        <TabsContent value="progress" className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--m-line)] bg-white/90 px-3.5 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--m-ink)]">
                {copy.groups.tabProgress}
              </p>
              <p className="text-xs text-[var(--m-ink-soft)]">
                {copy.groups.progressTodaySummary(
                  summary.completedToday,
                  summary.memberCount,
                  todayPct,
                )}
              </p>
            </div>
            <ProgressRing value={todayPct} size={44} />
          </div>
          <p className="text-sm text-[var(--m-ink-soft)]">
            {copy.groups.encouragement}
          </p>
          <GroupDailyChecklist groupId={primaryGroup.id} initialVisible={7} />
        </TabsContent>

        <TabsContent value="anggota" className="space-y-3">
          {isLeaderView && attentionMembers.length > 0 ? (
            <div className="rounded-xl border border-[var(--status-warning-text)]/20 bg-[var(--status-warning-bg)]/35 px-3.5 py-2.5 text-sm text-[var(--m-ink)]">
              <span className="font-semibold">{attentionMembers.length}</span>{" "}
              anggota belum menyelesaikan bacaan hari ini.
            </div>
          ) : null}

          <section className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
            <div className="border-b border-[var(--m-line)] px-4 py-3 lg:px-5">
              <h2 className="text-sm font-semibold text-[var(--m-ink)]">
                {copy.groups.tabMembers}
              </h2>
              <p className="text-xs text-[var(--m-ink-soft)]">
                {summary.memberCount} anggota · status bacaan hari ini
              </p>
            </div>
            <ul className="divide-y divide-[var(--m-line)]">
              {members.map((member) => {
                const statusLabel =
                  member.todayStatus === "completed"
                    ? "Sudah baca"
                    : member.todayStatus === "missed"
                      ? "Terlewat"
                      : "Belum baca";
                return (
                  <li key={member.id}>
                    <Link
                      href={`/profil/anggota/${member.id}`}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--m-wash)]/40 lg:px-5"
                    >
                      <MemberAvatar
                        name={member.name}
                        memberId={member.id}
                        currentUser={member.isCurrentUser}
                        className="size-9 shrink-0"
                        fallbackClassName={cn(
                          "text-xs font-semibold",
                          member.isCurrentUser
                            ? "bg-[var(--m-accent)] text-white"
                            : "bg-[var(--m-wash)] text-[var(--m-ink)]",
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[var(--m-ink)]">
                          {member.name}
                          {member.isCurrentUser ? " (kamu)" : ""}
                        </p>
                        <p className="text-[11px] text-[var(--m-ink-soft)]">
                          {getRoleLabel(member.role)} · {member.completionRate}%
                          selesai
                        </p>
                        <p className="text-[11px] text-[var(--m-ink-soft)]/80">
                          {copy.members.stats.lastActive(
                            formatLastActive(member.lastActiveAt) ??
                              copy.members.stats.neverActive,
                          )}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          member.todayStatus === "completed"
                            ? "bg-[var(--status-success-bg)] text-[var(--status-success-text)]"
                            : member.todayStatus === "missed"
                              ? "bg-[var(--status-warning-bg)] text-[var(--status-warning-text)]"
                              : "bg-[var(--m-wash)] text-[var(--m-ink-soft)]",
                        )}
                      >
                        {statusLabel}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
