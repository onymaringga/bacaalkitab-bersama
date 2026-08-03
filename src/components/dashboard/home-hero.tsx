"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Crown } from "lucide-react";

import { useRolePreview } from "@/components/role-preview/role-preview-provider";
import { Button } from "@/components/ui/button";
import { copy } from "@/lib/copy";
import { demoGroups, demoTodayReading, demoUser } from "@/lib/demo-data";
import { formatDisplayDate } from "@/lib/format-date";
import {
  demoUserGroupIds,
  getGroupSummary,
} from "@/lib/group-members";
import {
  getPersonalYearToDateProgress,
  isDateComplete,
} from "@/lib/reading-progress";
import { getTodayKey } from "@/lib/reading-status";
import { cn } from "@/lib/utils";

export function HomeHero() {
  const { isLeaderView } = useRolePreview();
  const [, refresh] = useState(0);
  const todayKey = getTodayKey();
  const firstName = demoUser.name.split(" ")[0];

  useEffect(() => {
    const handleUpdate = () => refresh((value) => value + 1);
    window.addEventListener("reading-progress-updated", handleUpdate);
    return () => window.removeEventListener("reading-progress-updated", handleUpdate);
  }, []);

  const todayComplete = isDateComplete(todayKey);
  const yearToDate = getPersonalYearToDateProgress();
  const primaryGroup = demoGroups.find((group) =>
    demoUserGroupIds.includes(group.id),
  );
  const groupSummary = primaryGroup ? getGroupSummary(primaryGroup.id) : null;
  const todayProgress = groupSummary
    ? Math.round((groupSummary.completedToday / groupSummary.memberCount) * 100)
    : 0;

  const statusLine = isLeaderView
    ? primaryGroup?.name
    : todayComplete
      ? copy.home.subtitleDone
      : copy.home.subtitle;

  return (
    <section className="mb-4 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="relative px-4 pb-3 pt-4">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-primary/[0.08] to-transparent"
          aria-hidden
        />
        <div className="relative space-y-2">
          <p className="text-xs font-medium capitalize text-muted-foreground">
            {formatDisplayDate(todayKey)}
          </p>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-[1.625rem] font-bold leading-tight tracking-tight text-foreground">
                {copy.home.greeting(firstName)}
              </h1>
              {isLeaderView ? (
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  <Crown className="size-3" />
                  {copy.leader.panel}
                </div>
              ) : null}
              {statusLine ? (
                <p
                  className={cn(
                    "mt-1.5 text-sm leading-snug",
                    todayComplete && !isLeaderView
                      ? "font-medium text-[var(--status-success-text)]"
                      : "text-muted-foreground",
                  )}
                >
                  {statusLine}
                </p>
              ) : null}
              {!isLeaderView ? (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {copy.home.encouragement}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-4 mb-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-border">
        {isLeaderView && groupSummary ? (
          <>
            <HeroStat
              label={copy.leader.readTodayLabel}
              value={`${todayProgress}%`}
              detail={`${groupSummary.completedToday}/${groupSummary.memberCount} ${copy.common.members}`}
            />
            <HeroStat
              label={copy.leader.yearToDateLabel}
              value={`${groupSummary.averageYearToDateRate}%`}
              detail={copy.leader.yearToDateDetail}
            />
          </>
        ) : (
          <>
            <HeroStat
              label={copy.home.progress.today}
              value={`${todayComplete ? 100 : 0}%`}
              detail={
                todayComplete
                  ? copy.home.progress.todayDone
                  : copy.home.progress.todayNotYet
              }
              tone={todayComplete ? "success" : "default"}
            />
            <HeroStat
              label={copy.home.progress.yearToDate}
              value={`${yearToDate.rate}%`}
              detail={copy.home.progress.yearToDateDetail(
                yearToDate.completed,
                yearToDate.totalDays,
              )}
            />
          </>
        )}
      </div>

      {isLeaderView ? (
        <div className="border-t border-border px-4 py-3">
          <Button asChild className="h-10 w-full rounded-lg font-semibold">
            <Link href="/kelompok">
              {copy.leader.viewAll}
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="border-t border-border px-4 py-3">
          <Button asChild className="h-10 w-full rounded-lg font-semibold">
            <Link
              href={
                todayComplete
                  ? `/catatan?from=complete&passage=${encodeURIComponent(demoTodayReading.passage)}`
                  : `/baca?tab=alkitab&passage=${encodeURIComponent(demoTodayReading.passage)}`
              }
            >
              {todayComplete
                ? copy.home.writeReflection
                : copy.home.continueReading}
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}

function HeroStat({
  label,
  value,
  detail,
  tone = "default",
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: "default" | "success";
}) {
  return (
    <div className="bg-card px-3.5 py-3">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 text-2xl font-bold leading-none tracking-tight",
          tone === "success" && "text-[var(--status-success-text)]",
          tone === "default" && "text-foreground",
        )}
      >
        {value}
      </p>
      {detail ? (
        <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
          {detail}
        </p>
      ) : null}
    </div>
  );
}
