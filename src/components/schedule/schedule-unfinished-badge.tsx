"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { copy } from "@/lib/copy";
import { countUnfinishedAssignedDays } from "@/lib/reading-progress";
import { getTodayKey } from "@/lib/reading-status";
import { subscribeScheduleProgress } from "@/lib/schedule-progress-stats";
import { cn } from "@/lib/utils";

type ScheduleUnfinishedBadgeProps = {
  className?: string;
  size?: "sm" | "md";
};

function getServerUnfinishedScheduleCount() {
  return countUnfinishedAssignedDays(getTodayKey());
}

export function useUnfinishedScheduleCount() {
  return useSyncExternalStore(
    subscribeScheduleProgress,
    () => countUnfinishedAssignedDays(getTodayKey()),
    getServerUnfinishedScheduleCount,
  );
}

export function ScheduleUnfinishedBadge({
  className,
  size = "sm",
}: ScheduleUnfinishedBadgeProps) {
  const count = useUnfinishedScheduleCount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || count <= 0) return null;

  const label = count > 99 ? "99+" : String(count);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-red-500 font-bold text-white tabular-nums ring-2 ring-[var(--m-paper)] dark:ring-zinc-900",
        size === "sm" && "h-4 min-w-4 px-1 text-[10px] leading-none",
        size === "md" && "h-5 min-w-5 px-1.5 text-[11px] leading-none",
        className,
      )}
      aria-label={copy.schedule.unfinishedDaysBadgeAria(count)}
    >
      {label}
    </span>
  );
}
