"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  ListChecks,
  X,
} from "lucide-react";

import { MonthPeriodNav } from "@/components/schedule/month-period-nav";
import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/components/ui/member-avatar";
import { toMonthKey } from "@/lib/calendar-utils";
import {
  getGroupChecklistMonthOptions,
  getGroupDailyChecklist,
  type GroupDayChecklistItem,
} from "@/lib/group-daily-checklist";
import { formatReadingDayLabel } from "@/lib/member-reading-history";
import type { MemberReadingDayStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<MemberReadingDayStatus, string> = {
  completed: "Selesai",
  missed: "Terlewat",
  pending: "Belum",
};

type GroupDailyChecklistProps = {
  groupId: string;
  /** Tampilkan lebih banyak baris di desktop. */
  initialVisible?: number;
  className?: string;
};

export function GroupDailyChecklist({
  groupId,
  initialVisible = 5,
  className,
}: GroupDailyChecklistProps) {
  const monthOptions = useMemo(() => getGroupChecklistMonthOptions(), []);
  const [monthKey, setMonthKey] = useState(() => {
    const todayMonth = toMonthKey(new Date());
    if (monthOptions.some((option) => option.key === todayMonth)) {
      return todayMonth;
    }
    return monthOptions[0]?.key ?? todayMonth;
  });

  const days = useMemo(
    () => getGroupDailyChecklist(groupId, monthKey),
    [groupId, monthKey],
  );
  const [expanded, setExpanded] = useState(false);
  const [openDate, setOpenDate] = useState<string | null>(null);

  useEffect(() => {
    setExpanded(false);
    setOpenDate(days[0]?.date ?? null);
  }, [monthKey, days]);

  useEffect(() => {
    if (monthOptions.length === 0) return;
    if (monthOptions.some((option) => option.key === monthKey)) return;
    setMonthKey(monthOptions[0]?.key ?? toMonthKey(new Date()));
  }, [monthOptions, monthKey]);

  const visible = expanded ? days : days.slice(0, initialVisible);
  const hiddenCount = Math.max(days.length - initialVisible, 0);
  const doneDays = days.filter((day) => day.myStatus === "completed").length;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90",
        className,
      )}
    >
      <div className="space-y-3 border-b border-[var(--m-line)] px-4 py-3.5 lg:px-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-semibold text-[var(--m-ink)]">
              <ListChecks className="size-4 text-[var(--m-accent)]" />
              Checklist bacaan harian
            </h2>
            <p className="mt-0.5 text-xs text-[var(--m-ink-soft)]">
              Progress kamu dan kelompok per bulan · {doneDays}/{days.length}{" "}
              hari kamu selesai
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[var(--m-ink-soft)]">
            <LegendDot tone="done" label="Selesai" />
            <LegendDot tone="missed" label="Terlewat" />
            <LegendDot tone="pending" label="Belum" />
          </div>
        </div>

        <MonthPeriodNav
          value={monthKey}
          options={monthOptions}
          onChange={setMonthKey}
        />
      </div>

      {days.length === 0 ? (
        <div className="px-4 py-8 text-center lg:px-5">
          <ListChecks className="mx-auto size-8 text-[var(--m-ink-soft)]/50" />
          <p className="mt-3 text-sm text-[var(--m-ink-soft)]">
            Belum ada bacaan terjadwal di bulan ini.
          </p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-[var(--m-line)]">
            {visible.map((day) => (
              <DayChecklistRow
                key={day.date}
                day={day}
                open={openDate === day.date}
                onToggle={() =>
                  setOpenDate((current) =>
                    current === day.date ? null : day.date,
                  )
                }
              />
            ))}
          </ul>

          {hiddenCount > 0 ? (
            <div className="border-t border-[var(--m-line)] px-4 py-2.5 lg:px-5">
              <Button
                type="button"
                variant="ghost"
                className="h-9 w-full gap-1 text-sm font-semibold text-[var(--m-accent)] hover:bg-[var(--m-wash)] hover:text-[var(--m-accent)]"
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded
                  ? "Tampilkan lebih sedikit"
                  : `Lihat ${hiddenCount} hari lagi`}
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    expanded && "rotate-180",
                  )}
                />
              </Button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

function DayChecklistRow({
  day,
  open,
  onToggle,
}: {
  day: GroupDayChecklistItem;
  open: boolean;
  onToggle: () => void;
}) {
  const isToday = formatReadingDayLabel(day.date) === "Hari ini";
  const bibleHref = `/baca?tab=alkitab&passage=${encodeURIComponent(day.passage)}`;

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[var(--m-wash)]/40 lg:px-5"
      >
        <MyStatusMark status={day.myStatus} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-[var(--m-ink)]">
              {formatReadingDayLabel(day.date)}
            </p>
            {isToday ? (
              <span className="rounded-md bg-[var(--m-wash)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--m-accent)]">
                Hari ini
              </span>
            ) : null}
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                day.myStatus === "completed" &&
                  "bg-[var(--status-success-bg)] text-[var(--status-success-text)]",
                day.myStatus === "missed" &&
                  "bg-[var(--status-danger-bg)] text-[var(--status-danger-text)]",
                day.myStatus === "pending" &&
                  "bg-[var(--m-wash)] text-[var(--m-ink-soft)]",
              )}
            >
              Kamu · {STATUS_LABEL[day.myStatus]}
            </span>
          </div>
          <p className="mt-0.5 text-sm font-medium text-[var(--m-accent)]">
            {day.passage}
          </p>

          <div className="mt-2.5">
            <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
              <span className="text-[var(--m-ink-soft)]">
                Kelompok {day.completedCount}/{day.totalMembers} selesai
              </span>
              <span className="font-semibold tabular-nums text-[var(--m-ink)]">
                {day.pct}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--m-wash)]">
              <div
                className="h-full rounded-full bg-[var(--m-accent)] transition-all"
                style={{ width: `${day.pct}%` }}
              />
            </div>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "mt-1 size-4 shrink-0 text-[var(--m-ink-soft)]/50 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div className="border-t border-[var(--m-line)] bg-[var(--m-wash)]/25 px-4 py-3 lg:px-5">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
              Anggota hari ini
            </p>
            {day.myStatus !== "completed" && isToday ? (
              <Link
                href={bibleHref}
                className="text-xs font-semibold text-[var(--m-accent)] hover:underline"
              >
                Lanjut baca →
              </Link>
            ) : null}
          </div>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {day.members.map((member) => (
              <li
                key={member.id}
                className="flex items-center gap-2.5 rounded-xl bg-white/80 px-2.5 py-2"
              >
                <MemberCheck status={member.status} />
                <MemberAvatar
                  name={member.name}
                  memberId={member.id}
                  currentUser={member.isCurrentUser}
                  className="size-7 shrink-0"
                  fallbackClassName={cn(
                    "text-[10px] font-bold",
                    member.isCurrentUser
                      ? "bg-[var(--m-accent)] text-white"
                      : "bg-[var(--m-wash)] text-[var(--m-ink)]",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--m-ink)]">
                    {member.name}
                    {member.isCurrentUser ? " (kamu)" : ""}
                  </p>
                  <p className="text-[11px] text-[var(--m-ink-soft)]">
                    {STATUS_LABEL[member.status]}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

function MyStatusMark({ status }: { status: MemberReadingDayStatus }) {
  if (status === "completed") {
    return (
      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-[var(--status-success-bg)] text-[var(--status-success-text)]">
        <Check className="size-3.5 stroke-[2.5]" />
      </span>
    );
  }
  if (status === "missed") {
    return (
      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-[var(--status-danger-bg)] text-[var(--status-danger-text)]">
        <X className="size-3.5 stroke-[2.5]" />
      </span>
    );
  }
  return (
    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border border-[var(--m-line)] bg-white text-[var(--m-ink-soft)]">
      <Circle className="size-3" />
    </span>
  );
}

function MemberCheck({ status }: { status: MemberReadingDayStatus }) {
  if (status === "completed") {
    return (
      <CheckCircle2 className="size-4 shrink-0 text-[var(--status-success-text)]" />
    );
  }
  if (status === "missed") {
    return (
      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[var(--status-danger-bg)]">
        <X className="size-2.5 text-[var(--status-danger-text)]" />
      </span>
    );
  }
  return <Circle className="size-4 shrink-0 text-[var(--m-ink-soft)]/45" />;
}

function LegendDot({
  tone,
  label,
}: {
  tone: "done" | "missed" | "pending";
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn(
          "size-2.5 rounded-sm",
          tone === "done" && "bg-[var(--status-success-text)]",
          tone === "missed" && "bg-[var(--status-danger-text)]",
          tone === "pending" && "border border-[var(--m-line)] bg-white",
        )}
      />
      {label}
    </span>
  );
}
