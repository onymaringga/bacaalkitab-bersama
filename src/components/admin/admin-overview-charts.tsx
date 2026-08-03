"use client";

import { useMemo } from "react";
import { format, subDays } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { demoGroups } from "@/lib/demo-data";
import { getGroupSummary } from "@/lib/group-members";
import { urgencyFromRate } from "@/lib/urgency";

const ACCENT = "#3b82f6";
const ACCENT_SOFT = "#93c5fd";
const INK_SOFT = "#5c6f8c";
const GRID = "oklch(0.88 0.03 255 / 0.7)";

const URGENCY_BAR: Record<string, string> = {
  ok: "#16a34a",
  watch: "#ca8a04",
  urgent: "#dc2626",
};

function buildDailyTrend(days = 14) {
  const today = new Date();
  const rates = [62, 58, 71, 68, 74, 52, 49, 77, 81, 73, 69, 84, 79, 76];

  return Array.from({ length: days }, (_, index) => {
    const date = subDays(today, days - 1 - index);
    return {
      dateKey: format(date, "yyyy-MM-dd"),
      label: format(date, "d MMM", { locale: localeId }),
      completion: rates[index] ?? 70,
      readers: Math.round(((rates[index] ?? 70) / 100) * 58),
    };
  });
}

function buildGroupBars() {
  const fallbackRates: Record<string, number> = {
    "group-1": 70,
    "group-2": 58,
    "group-3": 81,
    "group-4": 63,
  };

  return demoGroups.map((group) => {
    const summary = getGroupSummary(group.id);
    const hasMembers = summary.memberCount > 0;
    const total = hasMembers ? summary.memberCount : group.memberCount;
    const selesai = hasMembers
      ? summary.completedToday
      : Math.round((total * (fallbackRates[group.id] ?? 65)) / 100);
    const pct = total > 0 ? Math.round((selesai / total) * 100) : 0;

    return {
      name:
        group.name.length > 14 ? `${group.name.slice(0, 12)}…` : group.name,
      fullName: group.name,
      completion: pct,
      selesai,
      total,
    };
  });
}

function ChartTooltip({
  active,
  payload,
  label,
  suffix = "%",
}: {
  active?: boolean;
  payload?: Array<{
    value?: number;
    name?: string;
    payload?: Record<string, unknown>;
  }>;
  label?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0];
  const extra = row.payload;

  return (
    <div className="rounded-xl border border-[var(--a-line)] bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-[var(--a-ink)]">
        {(extra?.fullName as string | undefined) ?? label}
      </p>
      <p className="mt-1 text-[var(--a-accent)]">
        {row.value}
        {suffix}
        {typeof extra?.selesai === "number" && typeof extra?.total === "number"
          ? ` · ${extra.selesai}/${extra.total} baca`
          : null}
        {typeof extra?.readers === "number"
          ? ` · ${extra.readers} pembaca`
          : null}
      </p>
    </div>
  );
}

export function AdminOverviewCharts() {
  const daily = useMemo(() => buildDailyTrend(14), []);
  const groups = useMemo(() => buildGroupBars(), []);
  const avg =
    daily.length === 0
      ? 0
      : Math.round(
          daily.reduce((sum, item) => sum + item.completion, 0) / daily.length,
        );

  return (
    <section className="mb-4 grid gap-4 lg:mb-8 lg:grid-cols-5 lg:gap-5">
      <Card className="border-[var(--a-line)] bg-white/90 shadow-none lg:col-span-3">
        <CardContent className="p-4 lg:p-5">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="admin-kicker text-[var(--a-accent)]">
                14 hari terakhir
              </p>
              <h3 className="admin-display mt-1 text-lg text-[var(--a-ink)]">
                Tingkat penyelesaian harian
              </h3>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--a-ink-soft)]">
                Rata-rata
              </p>
              <p className="admin-display text-xl text-[var(--a-accent)]">
                {avg}%
              </p>
            </div>
          </div>
          <div className="h-52 w-full sm:h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={daily}
                margin={{ top: 8, right: 4, left: -18, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="adminAreaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={ACCENT} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke={GRID}
                  vertical={false}
                  strokeDasharray="3 6"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: INK_SOFT, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  minTickGap={28}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: INK_SOFT, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ stroke: ACCENT_SOFT, strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="completion"
                  name="Penyelesaian"
                  stroke={ACCENT}
                  strokeWidth={2.5}
                  fill="url(#adminAreaFill)"
                  activeDot={{
                    r: 5,
                    fill: ACCENT,
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[var(--a-line)] bg-white/90 shadow-none lg:col-span-2">
        <CardContent className="p-4 lg:p-5">
          <div className="mb-4">
            <p className="admin-kicker text-[var(--a-accent)]">Hari ini</p>
            <h3 className="admin-display mt-1 text-lg text-[var(--a-ink)]">
              Per kelompok
            </h3>
          </div>
          <div className="h-52 w-full sm:h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={groups}
                margin={{ top: 8, right: 4, left: -18, bottom: 4 }}
                barCategoryGap="22%"
              >
                <CartesianGrid
                  stroke={GRID}
                  vertical={false}
                  strokeDasharray="3 6"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: INK_SOFT, fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: INK_SOFT, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "oklch(0.92 0.03 255 / 0.45)" }}
                />
                <Bar
                  dataKey="completion"
                  name="Penyelesaian"
                  radius={[10, 10, 4, 4]}
                  maxBarSize={40}
                >
                  {groups.map((item) => (
                    <Cell
                      key={item.fullName}
                      fill={URGENCY_BAR[urgencyFromRate(item.completion)]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
