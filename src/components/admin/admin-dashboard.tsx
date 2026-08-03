"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HeartPulse } from "lucide-react";

import type { DemoSession } from "@/lib/demo-auth";
import { AdminGroupsPanel } from "@/components/admin/admin-groups-panel";
import { AdminOverviewCharts } from "@/components/admin/admin-overview-charts";
import { AdminProgramPanel } from "@/components/admin/admin-program-panel";
import { AdminSchedulePanel } from "@/components/admin/admin-schedule-panel";
import {
  AdminShell,
  type AdminNavId,
} from "@/components/admin/admin-shell";
import { AdminUsersPanel } from "@/components/admin/admin-users-panel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { copy } from "@/lib/copy";
import { demoGroups, demoProgram } from "@/lib/demo-data";
import { formatShortDate } from "@/lib/format-date";
import { demoGroupMembers, getGroupSummary } from "@/lib/group-members";
import { demoProgramScheduleMeta } from "@/lib/reading-progress";
import {
  getUrgencyMeta,
  urgencyFromRate,
  type UrgencyLevel,
} from "@/lib/urgency";
import { cn } from "@/lib/utils";

type AdminDashboardProps = {
  session: DemoSession;
  onLogout: () => void;
};

type AdminTab = AdminNavId;

function isAdminTab(value: string | null): value is AdminTab {
  return (
    value === "overview" ||
    value === "schedule" ||
    value === "program" ||
    value === "groups" ||
    value === "users"
  );
}

function safePct(completed: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 100);
}

const FALLBACK_TODAY_PCT: Record<string, number> = {
  "group-1": 70,
  "group-2": 58,
  "group-3": 81,
  "group-4": 63,
};

type GroupProgressRow = {
  id: string;
  name: string;
  leaderName: string;
  total: number;
  completed: number;
  pct: number;
  highlight: "leading" | "attention";
};

function getGroupProgressRows(): GroupProgressRow[] {
  return demoGroups.map((group) => {
    const groupSummary = getGroupSummary(group.id);
    const total =
      groupSummary.memberCount > 0
        ? groupSummary.memberCount
        : group.memberCount;
    const completed =
      groupSummary.memberCount > 0
        ? groupSummary.completedToday
        : Math.round((total * (FALLBACK_TODAY_PCT[group.id] ?? 65)) / 100);
    return {
      id: group.id,
      name: group.name,
      leaderName: group.leaderName,
      total,
      completed,
      pct: safePct(completed, total),
      highlight: "leading" as const,
    };
  });
}

/** Hanya kelompok dengan pencapaian tertinggi & terendah hari ini. */
function getHighlightedGroupProgress(): GroupProgressRow[] {
  const rows = getGroupProgressRows();
  if (rows.length === 0) return [];
  if (rows.length === 1) {
    return [{ ...rows[0], highlight: "leading" }];
  }

  let best = rows[0];
  let worst = rows[0];
  for (const row of rows) {
    if (row.pct > best.pct) best = row;
    if (row.pct < worst.pct) worst = row;
  }

  if (best.id === worst.id) {
    return [{ ...best, highlight: "leading" }];
  }

  return [
    { ...worst, highlight: "attention" },
    { ...best, highlight: "leading" },
  ];
}

export function AdminDashboard({ session, onLogout }: AdminDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tab: AdminTab = isAdminTab(tabParam) ? tabParam : "overview";

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!isAdminTab(hash)) return;
    if (isAdminTab(tabParam) && tabParam === hash) return;
    router.replace(`/admin?tab=${hash}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only hash migrate
  }, []);

  const totals = demoGroups.reduce(
    (acc, group) => {
      const summary = getGroupSummary(group.id);
      return {
        members: acc.members + summary.memberCount,
        completed: acc.completed + summary.completedToday,
      };
    },
    { members: 0, completed: 0 },
  );
  const completionRate = safePct(totals.completed, totals.members);

  const metrics: {
    label: string;
    value: string;
    hint: string;
    urgency: UrgencyLevel;
  }[] = [
    {
      label: copy.admin.health.participants,
      value: String(totals.members),
      hint: "Seluruh peserta program",
      urgency: "ok",
    },
    {
      label: copy.admin.health.activeReaders,
      value: String(totals.completed),
      hint: "Sudah baca hari ini",
      urgency: urgencyFromRate(completionRate),
    },
    {
      label: copy.admin.health.completionRate,
      value: `${completionRate}%`,
      hint: "Penyelesaian hari ini",
      urgency: urgencyFromRate(completionRate),
    },
    {
      label: copy.admin.health.weeklyActive,
      value: "84%",
      hint: "Aktif 7 hari terakhir",
      urgency: urgencyFromRate(84),
    },
    {
      label: copy.admin.health.reflections,
      value: "67%",
      hint: "Partisipasi renungan",
      urgency: urgencyFromRate(67),
    },
    {
      label: copy.admin.health.groupEngagement,
      value: "Baik",
      hint: "Rata-rata antar kelompok",
      urgency: "watch",
    },
  ];

  const userCount = demoGroupMembers.length;
  const highlightedGroups = getHighlightedGroupProgress();

  const titles: Record<AdminTab, { title: string; subtitle: string }> = {
    overview: {
      title: "Dashboard Program",
      subtitle: copy.admin.subtitle,
    },
    schedule: {
      title: "Jadwal baca",
      subtitle: `${formatShortDate(demoProgramScheduleMeta.startDate)} – ${formatShortDate(demoProgramScheduleMeta.endDate)} · ${demoProgramScheduleMeta.totalDays} hari`,
    },
    program: {
      title: "Program",
      subtitle: "Program aktif, riwayat, dan heatmap penyelesaian bacaan.",
    },
    groups: {
      title: copy.admin.groups.title,
      subtitle: copy.admin.groups.description,
    },
    users: {
      title: "Daftar Peserta",
      subtitle: `${userCount} user terdaftar di program ini`,
    },
  };

  return (
    <AdminShell session={session} onLogout={onLogout} activeNav={tab}>
      <header className="mb-5 space-y-4 lg:mb-8 lg:space-y-3">
        <div className="hidden lg:block">
          <p className="admin-kicker text-[var(--a-accent)]">
            {demoProgram.organization}
          </p>
          <h2 className="admin-display mt-2 text-[clamp(1.75rem,2.5vw,2.35rem)] leading-[1.1] text-[var(--a-ink)]">
            {titles[tab].title}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--a-ink-soft)]">
            {titles[tab].subtitle}
          </p>
          <p className="mt-3 text-xs font-semibold text-[var(--a-ink)]/70">
            {demoProgram.name}
          </p>
        </div>

        <div className="space-y-3 lg:hidden">
          <p className="text-sm text-[var(--a-ink-soft)]">
            {demoProgram.organization} · {demoProgram.name}
          </p>
          <div className="rounded-2xl border border-[var(--a-line)] bg-white/80 px-4 py-3">
            <p className="text-sm font-semibold text-[var(--a-ink)]">
              {session.name}
            </p>
            <p className="text-xs text-[var(--a-ink-soft)]">
              @{session.username}
            </p>
          </div>
          <div>
            <h2 className="admin-display text-2xl text-[var(--a-ink)]">
              {titles[tab].title}
            </h2>
            <p className="mt-1 text-sm text-[var(--a-ink-soft)]">
              {titles[tab].subtitle}
            </p>
          </div>
        </div>
      </header>

      {tab === "overview" ? (
        <>
          <section className="mb-4 lg:mb-8">
            <div className="mb-3 flex items-center gap-2">
              <HeartPulse className="size-4 text-[var(--a-accent)]" />
              <h3 className="admin-display text-lg text-[var(--a-ink)]">
                {copy.admin.health.title}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 lg:gap-4">
              {metrics.map((metric) => {
                const urgency = getUrgencyMeta(metric.urgency);
                return (
                  <Card
                    key={metric.label}
                    className={cn(
                      "relative overflow-hidden border bg-white/90 shadow-none",
                      urgency.border,
                    )}
                  >
                    <span
                      className={cn(
                        "absolute inset-y-0 left-0 w-1",
                        urgency.dot,
                      )}
                      aria-hidden
                    />
                    <CardHeader className="pb-1 pl-4 lg:pb-2 lg:pl-5">
                      <CardDescription className="text-[11px] text-[var(--a-ink-soft)] lg:text-sm">
                        {metric.label}
                      </CardDescription>
                      <CardTitle className="admin-display text-xl tracking-tight text-[var(--a-ink)] lg:text-3xl">
                        {metric.value}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="hidden pl-4 lg:block lg:pl-5">
                      <p className="text-xs text-[var(--a-ink-soft)]">
                        {metric.hint}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <AdminOverviewCharts />

          <section className="mb-4 lg:mb-8">
            <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="admin-display text-lg text-[var(--a-ink)]">
                  Progress antar kelompok
                </h3>
                <p className="mt-0.5 text-xs text-[var(--a-ink-soft)]">
                  Sorotan hari ini — pencapaian tertinggi dan yang perlu
                  perhatian.
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.replace("/admin?tab=groups")}
                className="text-xs font-semibold text-[var(--a-accent)] hover:underline"
              >
                Lihat semua kelompok →
              </button>
            </div>
            <Card className="border-[var(--a-line)] bg-white/90 shadow-none">
              <CardContent className="divide-y divide-[var(--a-line)] p-0">
                {highlightedGroups.map((group) => {
                  const urgency = getUrgencyMeta(urgencyFromRate(group.pct));
                  const highlightLabel =
                    group.highlight === "leading"
                      ? "Terdepan"
                      : "Perlu perhatian";
                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() =>
                        router.push(`/admin/kelompok/${group.id}`)
                      }
                      className={cn(
                        "flex w-full flex-col gap-2 px-4 py-3.5 text-left transition-colors hover:bg-[var(--a-wash)]/50 sm:flex-row sm:items-center sm:gap-4 lg:px-5 lg:py-4",
                        group.highlight === "attention" && urgency.wash,
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "size-2.5 shrink-0 rounded-full",
                              urgency.dot,
                            )}
                            title={urgency.label}
                          />
                          <p className="font-semibold text-[var(--a-ink)]">
                            {group.name}
                          </p>
                          <span
                            className={cn(
                              "rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                              group.highlight === "leading"
                                ? "bg-[var(--status-success-bg)] text-[var(--status-success-text)]"
                                : urgency.badge,
                            )}
                          >
                            {highlightLabel}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[var(--a-ink-soft)]">
                          Ketua: {group.leaderName} · {group.total} anggota ·{" "}
                          {group.completed}/{group.total} baca hari ini
                        </p>
                      </div>
                      <div className="w-full sm:w-40">
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-[var(--a-ink-soft)]">
                            Hari ini
                          </span>
                          <span
                            className={cn(
                              "font-semibold",
                              group.highlight === "leading" &&
                                "text-[var(--status-success-text)]",
                              group.highlight === "attention" &&
                                "text-[var(--status-danger-text)]",
                            )}
                          >
                            {group.pct}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              urgency.bar,
                            )}
                            style={{ width: `${group.pct}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </section>
        </>
      ) : null}

      {tab === "users" ? <AdminUsersPanel /> : null}

      {tab === "program" ? <AdminProgramPanel /> : null}

      {tab === "groups" ? <AdminGroupsPanel /> : null}

      {tab === "schedule" ? <AdminSchedulePanel /> : null}
    </AdminShell>
  );
}
