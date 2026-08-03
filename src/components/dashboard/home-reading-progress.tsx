"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { copy } from "@/lib/copy";
import {
  getPersonalYearToDateProgress,
  isDateComplete,
} from "@/lib/reading-progress";
import { getTodayKey } from "@/lib/reading-status";
import { cn } from "@/lib/utils";

export function HomeReadingProgress() {
  const [, refresh] = useState(0);

  useEffect(() => {
    const handleUpdate = () => refresh((value) => value + 1);
    window.addEventListener("reading-progress-updated", handleUpdate);
    return () => window.removeEventListener("reading-progress-updated", handleUpdate);
  }, []);

  const todayComplete = isDateComplete(getTodayKey());
  const todayRate = todayComplete ? 100 : 0;
  const yearToDate = getPersonalYearToDateProgress();

  return (
    <Card>
      <CardContent className="grid grid-cols-2 gap-2 pt-4">
        <ProgressStat
          label={copy.home.progress.today}
          value={`${todayRate}%`}
          detail={todayComplete ? copy.home.progress.todayDone : copy.home.progress.todayNotYet}
          tone={todayComplete ? "success" : "muted"}
        />
        <ProgressStat
          label={copy.home.progress.yearToDate}
          value={`${yearToDate.rate}%`}
          detail={copy.home.progress.yearToDateDetail(
            yearToDate.completed,
            yearToDate.totalDays,
          )}
        />
      </CardContent>
    </Card>
  );
}

function ProgressStat({
  label,
  value,
  detail,
  tone = "default",
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: "default" | "success" | "muted";
}) {
  return (
    <div className="rounded-lg bg-muted/60 px-3 py-2.5">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      <p
        className={cn(
          "text-xl font-bold leading-none",
          tone === "success" && "text-[var(--status-success-text)]",
          tone === "muted" && "text-foreground",
          tone === "default" && "text-foreground",
        )}
      >
        {value}
      </p>
      {detail ? (
        <p className="mt-1 text-[11px] text-muted-foreground">{detail}</p>
      ) : null}
    </div>
  );
}
