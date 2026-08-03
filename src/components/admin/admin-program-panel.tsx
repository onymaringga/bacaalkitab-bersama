"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Award,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";

import { formatShortDate } from "@/lib/format-date";
import {
  demoActiveProgram,
  getPastPrograms,
  type ProgramRecord,
} from "@/lib/program-history";
import {
  DEMO_PROGRAM_END,
  DEMO_PROGRAM_START,
  demoSchedule,
} from "@/lib/reading-progress";
import { getScheduleDayDetail } from "@/lib/schedule-day-detail";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const HEAT_LEVELS = [
  { min: 0, label: "0–24%", color: "#fecaca", text: "#991b1b" },
  { min: 25, label: "25–49%", color: "#fde68a", text: "#92400e" },
  { min: 50, label: "50–74%", color: "#93c5fd", text: "#1e3a8a" },
  { min: 75, label: "75–100%", color: "#2563eb", text: "#ffffff" },
] as const;

function heatStyle(
  pct: number | null,
  isFuture: boolean,
): { backgroundColor: string; color: string; border?: string } {
  if (pct === null || isFuture) {
    return {
      backgroundColor: "#eef2ff",
      color: "#64748b",
      border: "1px dashed #c7d2fe",
    };
  }
  if (pct >= 75)
    return {
      backgroundColor: HEAT_LEVELS[3].color,
      color: HEAT_LEVELS[3].text,
    };
  if (pct >= 50)
    return {
      backgroundColor: HEAT_LEVELS[2].color,
      color: HEAT_LEVELS[2].text,
    };
  if (pct >= 25)
    return {
      backgroundColor: HEAT_LEVELS[1].color,
      color: HEAT_LEVELS[1].text,
    };
  return {
    backgroundColor: HEAT_LEVELS[0].color,
    color: HEAT_LEVELS[0].text,
  };
}

function clampMonth(date: Date) {
  const start = startOfMonth(parseISO(DEMO_PROGRAM_START));
  const end = startOfMonth(parseISO(DEMO_PROGRAM_END));
  if (date < start) return start;
  if (date > end) return end;
  return startOfMonth(date);
}

export function AdminProgramPanel() {
  const router = useRouter();
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const [month, setMonth] = useState(() =>
    clampMonth(
      parseISO(todayKey <= DEMO_PROGRAM_END ? todayKey : DEMO_PROGRAM_START),
    ),
  );

  const scheduleKeys = useMemo(
    () => new Set(demoSchedule.map((item) => item.scheduledDate)),
    [],
  );

  const dayStats = useMemo(() => {
    const map = new Map<
      string,
      { pct: number | null; completed: number; total: number }
    >();
    for (const item of demoSchedule) {
      const detail = getScheduleDayDetail(item.scheduledDate);
      map.set(item.scheduledDate, {
        pct: detail?.completionPct ?? null,
        completed: detail?.completedCount ?? 0,
        total: detail?.totalCount ?? 0,
      });
    }
    return map;
  }, []);

  const cells = useMemo(() => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const days = eachDayOfInterval({
      start: startOfWeek(monthStart, { weekStartsOn: 0 }),
      end: endOfWeek(monthEnd, { weekStartsOn: 0 }),
    });

    return days.map((date) => {
      const dateKey = format(date, "yyyy-MM-dd");
      const inMonth = isSameMonth(date, month);
      const inProgram = scheduleKeys.has(dateKey);
      const stats = dayStats.get(dateKey);
      const isFuture = dateKey > todayKey;
      return {
        date,
        dateKey,
        inMonth,
        inProgram,
        isToday: dateKey === todayKey,
        isFuture,
        pct: stats?.pct ?? null,
        completed: stats?.completed ?? 0,
        total: stats?.total ?? 0,
      };
    });
  }, [month, scheduleKeys, dayStats, todayKey]);

  const monthLabel = format(month, "MMMM yyyy", { locale: localeId });
  const canPrev =
    startOfMonth(month) > startOfMonth(parseISO(DEMO_PROGRAM_START));
  const canNext =
    startOfMonth(month) < startOfMonth(parseISO(DEMO_PROGRAM_END));

  const monthProgramDays = cells.filter((c) => c.inMonth && c.inProgram);
  const scored = monthProgramDays.filter((c) => c.pct !== null);
  const monthAvg =
    scored.length === 0
      ? null
      : Math.round(
          scored.reduce((sum, c) => sum + (c.pct ?? 0), 0) / scored.length,
        );

  const pastPrograms = getPastPrograms();
  const active = demoActiveProgram;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
      {/* Left: programs */}
      <div className="space-y-4">
        <section className="overflow-hidden rounded-2xl border border-[var(--a-line)] bg-white/90">
          <div className="border-b border-[var(--a-line)] bg-[var(--a-wash)]/50 px-4 py-3.5 lg:px-5">
            <p className="admin-kicker text-[var(--a-accent)]">Sedang berjalan</p>
            <h3 className="admin-display mt-1 text-lg text-[var(--a-ink)]">
              Program aktif
            </h3>
          </div>
          <Link
            href={`/admin/program/${active.id}`}
            className="block px-4 py-5 transition-colors hover:bg-[var(--a-wash)]/40 lg:px-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="admin-display text-xl text-[var(--a-ink)]">
                {active.name}
              </h4>
              <span className="rounded-md bg-[var(--status-success-bg)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--status-success-text)]">
                Berjalan
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--a-ink-soft)]">
              {active.summary}
            </p>
            <p className="mt-3 text-xs text-[var(--a-ink-soft)]">
              {formatShortDate(active.startDate)} –{" "}
              {formatShortDate(active.endDate)}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <MiniStat
                icon={Users}
                label="Peserta"
                value={String(active.participantCount)}
              />
              <MiniStat
                icon={Users}
                label="Kelompok"
                value={String(active.groupCount)}
              />
              <MiniStat
                icon={Award}
                label="Progress"
                value={`${active.completionRate}%`}
              />
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-[var(--a-ink-soft)]">Penyelesaian</span>
                <span className="font-semibold text-[var(--a-accent)]">
                  {active.completionRate}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="h-full rounded-full bg-[var(--a-accent)] transition-all"
                  style={{ width: `${active.completionRate}%` }}
                />
              </div>
            </div>

            <p className="mt-4 text-xs font-semibold text-[var(--a-accent)]">
              Lihat detail & peserta →
            </p>
          </Link>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[var(--a-line)] bg-white/90">
          <div className="border-b border-[var(--a-line)] bg-[var(--a-wash)]/50 px-4 py-3.5 lg:px-5">
            <p className="admin-kicker text-[var(--a-accent)]">Riwayat</p>
            <h3 className="admin-display mt-1 text-lg text-[var(--a-ink)]">
              Program sebelumnya
            </h3>
          </div>
          <ul className="divide-y divide-[var(--a-line)]">
            {pastPrograms.map((program) => (
              <li key={program.id}>
                <PastProgramRow program={program} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Right: heatmap */}
      <section className="overflow-hidden rounded-2xl border border-[var(--a-line)] bg-white/90 lg:sticky lg:top-8">
        <div className="border-b border-[var(--a-line)] bg-[var(--a-wash)]/50 px-4 py-3.5 lg:px-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="admin-kicker text-[var(--a-accent)]">
                Accomplishment
              </p>
              <h3 className="admin-display mt-1 flex items-center gap-2 text-lg text-[var(--a-ink)]">
                <CalendarDays className="size-4 text-[var(--a-accent)]" />
                Heatmap penyelesaian
              </h3>
              <p className="mt-1 text-xs text-[var(--a-ink-soft)]">
                {formatShortDate(DEMO_PROGRAM_START)} –{" "}
                {formatShortDate(DEMO_PROGRAM_END)}
              </p>
            </div>
            {monthAvg !== null ? (
              <div className="rounded-xl border border-[var(--a-line)] bg-white px-3 py-1.5 text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--a-ink-soft)]">
                  Rata-rata
                </p>
                <p className="admin-display text-base text-[var(--a-accent)]">
                  {monthAvg}%
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="px-4 py-4 lg:px-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={!canPrev}
              onClick={() => setMonth((m) => clampMonth(subMonths(m, 1)))}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-[var(--a-line)] bg-white text-[var(--a-ink)] transition-colors hover:bg-[var(--a-wash)] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Bulan sebelumnya"
            >
              <ChevronLeft className="size-4" />
            </button>
            <p className="admin-display text-base capitalize text-[var(--a-ink)]">
              {monthLabel}
            </p>
            <button
              type="button"
              disabled={!canNext}
              onClick={() => setMonth((m) => clampMonth(addMonths(m, 1)))}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-[var(--a-line)] bg-white text-[var(--a-ink)] transition-colors hover:bg-[var(--a-wash)] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Bulan berikutnya"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold text-[var(--a-ink-soft)]">
            {WEEKDAYS.map((label) => (
              <div key={label} className="py-1">
                {label}
              </div>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1.5">
            {cells.map((cell) => {
              if (!cell.inMonth) {
                return <div key={cell.dateKey} className="aspect-square" />;
              }

              if (!cell.inProgram) {
                return (
                  <div
                    key={cell.dateKey}
                    className="flex aspect-square items-center justify-center rounded-lg text-[11px] text-[var(--a-ink-soft)]/35"
                  >
                    {cell.date.getDate()}
                  </div>
                );
              }

              const title =
                cell.pct === null
                  ? `${formatShortDate(cell.dateKey)} · belum ada data`
                  : `${formatShortDate(cell.dateKey)} · ${cell.pct}% (${cell.completed}/${cell.total})`;

              return (
                <button
                  key={cell.dateKey}
                  type="button"
                  title={title}
                  onClick={() => router.push(`/admin/jadwal/${cell.dateKey}`)}
                  style={heatStyle(cell.pct, cell.isFuture)}
                  className={cn(
                    "relative flex aspect-square flex-col items-center justify-center rounded-lg text-[11px] font-semibold shadow-sm transition-transform hover:scale-[1.05] hover:ring-2 hover:ring-[var(--a-accent)]/35",
                    cell.isToday && "ring-2 ring-[var(--a-ink)] ring-offset-1",
                  )}
                >
                  <span className="leading-none">{cell.date.getDate()}</span>
                  {cell.pct !== null ? (
                    <span className="mt-0.5 text-[9px] font-bold leading-none opacity-90">
                      {cell.pct}%
                    </span>
                  ) : (
                    <span className="mt-0.5 text-[9px] leading-none opacity-60">
                      —
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[var(--a-line)] pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--a-ink-soft)]">
              Intensitas
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {HEAT_LEVELS.map((level) => (
                <span
                  key={level.label}
                  className="inline-flex items-center gap-1.5 text-[10px] text-[var(--a-ink-soft)]"
                >
                  <span
                    className="size-3 rounded-sm shadow-sm ring-1 ring-black/5"
                    style={{ backgroundColor: level.color }}
                  />
                  {level.label}
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 text-[10px] text-[var(--a-ink-soft)]">
                <span
                  className="size-3 rounded-sm"
                  style={{
                    backgroundColor: "#eef2ff",
                    border: "1px dashed #c7d2fe",
                  }}
                />
                Belum / mendatang
              </span>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-[var(--a-ink-soft)]">
            Klik tanggal untuk membuka detail jadwal hari itu.
          </p>
        </div>
      </section>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--a-line)] bg-[var(--a-wash)]/40 px-2.5 py-2">
      <p className="flex items-center gap-1 text-[10px] text-[var(--a-ink-soft)]">
        <Icon className="size-3" />
        {label}
      </p>
      <p className="admin-display mt-0.5 text-base text-[var(--a-ink)]">
        {value}
      </p>
    </div>
  );
}

function PastProgramRow({ program }: { program: ProgramRecord }) {
  return (
    <Link
      href={`/admin/program/${program.id}`}
      className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--a-wash)]/50 lg:px-5"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-[var(--a-ink)]">{program.name}</p>
          <span className="rounded-md bg-[var(--a-wash)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--a-ink-soft)]">
            Selesai
          </span>
        </div>
        <p className="mt-0.5 text-xs text-[var(--a-ink-soft)]">
          {formatShortDate(program.startDate)} –{" "}
          {formatShortDate(program.endDate)} · {program.certificateCount}{" "}
          sertifikat · {program.completionRate}%
        </p>
      </div>
      <ChevronRight className="size-4 shrink-0 text-[var(--a-ink-soft)]/50" />
    </Link>
  );
}
