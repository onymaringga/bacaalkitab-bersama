"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Circle,
  XCircle,
} from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { useDemoAuth } from "@/components/auth/demo-auth-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LoadingModal } from "@/components/ui/loading-screen";
import { SendReminderButton } from "@/components/ui/send-reminder-dialog";
import { demoGroups, demoProgram } from "@/lib/demo-data";
import { formatShortDate } from "@/lib/format-date";
import { getInitials, getMemberById } from "@/lib/group-members";
import {
  formatReadingDayLabel,
  getMemberReadingHistory,
  getRecentTrend,
  getTimelineDays,
} from "@/lib/member-reading-history";
import { getRoleLabel } from "@/lib/role-label";
import { copy } from "@/lib/copy";
import type {
  MemberReadingDay,
  MemberReadingDayStatus,
  MemberTodayStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const DAY_STATUS_LABELS = copy.members.dayStatus;

const todayStatusLabel: Record<MemberTodayStatus, string> = {
  completed: "Sudah baca",
  pending: "Belum baca",
  missed: "Terlewat",
};

type AdminUserDetailProps = {
  userId: string;
};

export function AdminUserDetail({ userId }: AdminUserDetailProps) {
  const router = useRouter();
  const { session, isAdmin, ready, logout } = useDemoAuth();
  const member = getMemberById(userId);

  useEffect(() => {
    if (!ready) return;
    if (!isAdmin) router.replace("/login");
  }, [ready, isAdmin, router]);

  if (!ready || !isAdmin || !session) {
    return (
      <LoadingModal
        label="Memuat detail peserta"
        hint="Mengambil riwayat bacaan dan progress…"
      />
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!member) {
    return (
      <AdminShell
        session={session}
        onLogout={handleLogout}
        activeNav="users"
      >
        <BackLink />
        <div className="mt-6 rounded-2xl border border-[var(--a-line)] bg-white/90 p-6">
          <h1 className="admin-display text-2xl text-[var(--a-ink)]">
            Peserta tidak ditemukan
          </h1>
          <p className="mt-2 text-sm text-[var(--a-ink-soft)]">
            User dengan ID ini tidak ada di data demo.
          </p>
        </div>
      </AdminShell>
    );
  }

  const group = demoGroups.find((g) => g.id === member.groupId);
  const groupName = group?.name ?? "Tanpa kelompok";
  const history = getMemberReadingHistory(member);
  const trend = getRecentTrend(history);
  const timeline = getTimelineDays(history);

  return (
    <AdminShell session={session} onLogout={handleLogout} activeNav="users">
      <BackLink />

      {/* Profile */}
      <header className="mt-5 flex flex-col gap-5 lg:mt-2 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <div className="flex min-w-0 items-start gap-4">
          <Avatar className="size-14 shrink-0 md:size-16">
            <AvatarFallback className="bg-[var(--a-accent)] text-lg font-bold text-white md:text-xl">
              {getInitials(member.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="admin-kicker text-[var(--a-accent)]">
              {demoProgram.organization}
            </p>
            <h1 className="admin-display mt-1 text-[clamp(1.65rem,2.5vw,2.15rem)] leading-[1.1] text-[var(--a-ink)]">
              {member.name}
            </h1>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-[var(--a-ink-soft)]">
              <span className="font-medium text-[var(--a-ink)]">
                {getRoleLabel(member.role)}
              </span>
              <span className="text-[var(--a-line)]" aria-hidden>
                ·
              </span>
              <a
                href={`mailto:${member.email}`}
                className="truncate hover:text-[var(--a-accent)]"
              >
                {member.email}
              </a>
              <span className="text-[var(--a-line)]" aria-hidden>
                ·
              </span>
              {group ? (
                <Link
                  href={`/admin/kelompok/${group.id}`}
                  className="hover:text-[var(--a-accent)]"
                >
                  {groupName}
                </Link>
              ) : (
                <span>{groupName}</span>
              )}
            </div>
            <p className="mt-3">
              <span
                className={cn(
                  "inline-flex rounded-md px-2 py-0.5 text-xs font-semibold",
                  member.todayStatus === "completed" &&
                    "bg-[var(--status-success-bg)] text-[var(--status-success-text)]",
                  member.todayStatus === "missed" &&
                    "bg-[var(--status-danger-bg)] text-[var(--status-danger-text)]",
                  member.todayStatus === "pending" &&
                    "bg-[var(--a-wash)] text-[var(--a-ink-soft)]",
                )}
              >
                Hari ini: {todayStatusLabel[member.todayStatus]}
              </span>
            </p>
          </div>
        </div>

        <SendReminderButton
          recipientName={member.name}
          recipientEmail={member.email}
          recipientPhone={member.phone}
          className="h-10 w-full shrink-0 rounded-xl font-semibold lg:w-auto lg:px-4"
          successMessage={`Pengingat terkirim ke ${member.name}`}
        />
      </header>

      {/* Stats — one strip */}
      <section className="mt-6 grid grid-cols-2 overflow-hidden rounded-2xl border border-[var(--a-line)] bg-white/90 md:grid-cols-4">
        <StatCell label="14 hari" value={`${member.completionRate}%`} />
        <StatCell
          label="Tahun ini"
          value={`${member.yearToDateRate}%`}
          className="border-l border-[var(--a-line)]"
        />
        <StatCell
          label="Streak"
          value={`${member.streakDays} hari`}
          className="border-t border-[var(--a-line)] md:border-t-0 md:border-l"
        />
        <StatCell
          label="Terlewat"
          value={String(member.missedCount)}
          className="border-t border-l border-[var(--a-line)] md:border-t-0"
        />
      </section>

      {/* Timeline */}
      <section className="mt-5 rounded-2xl border border-[var(--a-line)] bg-white/90 px-4 py-4 lg:px-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="admin-display text-base text-[var(--a-ink)]">
            14 hari terakhir
          </h2>
          <p className="text-xs text-[var(--a-ink-soft)]">
            {trend.completed} selesai · {trend.missed} terlewat ·{" "}
            {trend.pending} menunggu
          </p>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-x-1 gap-y-2.5 sm:gap-x-2">
          {timeline.map((day) => (
            <TimelineDot key={day.date} day={day} />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-[var(--a-line)] pt-3 text-[11px] text-[var(--a-ink-soft)]">
          <LegendDot tone="success" label="Selesai" />
          <LegendDot tone="danger" label="Terlewat" />
          <LegendDot tone="muted" label="Menunggu" />
        </div>
      </section>

      {/* History */}
      <section className="mt-5 overflow-hidden rounded-2xl border border-[var(--a-line)] bg-white/90">
        <div className="border-b border-[var(--a-line)] px-4 py-3.5 lg:px-5">
          <h2 className="admin-display text-base text-[var(--a-ink)]">
            Riwayat bacaan
          </h2>
          <p className="mt-0.5 text-xs text-[var(--a-ink-soft)]">
            Pasal dan status harian
          </p>
        </div>
        <ReadingHistoryList history={history} />
      </section>
    </AdminShell>
  );
}

function BackLink() {
  return (
    <Link
      href="/admin?tab=users"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--a-accent)] transition-colors hover:text-[#2563eb]"
    >
      <ArrowLeft className="size-4" />
      Kembali ke daftar peserta
    </Link>
  );
}

function StatCell({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("px-4 py-3.5 md:px-5 md:py-4", className)}>
      <p className="text-[11px] text-[var(--a-ink-soft)]">{label}</p>
      <p className="admin-display mt-0.5 text-xl text-[var(--a-ink)] md:text-2xl">
        {value}
      </p>
    </div>
  );
}

function TimelineDot({ day }: { day: MemberReadingDay }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        title={`${formatShortDate(day.date)} — ${DAY_STATUS_LABELS[day.status]}`}
        className={cn(
          "size-6 rounded-full border-2 sm:size-7",
          day.status === "completed" &&
            "border-[var(--status-success-text)] bg-[var(--status-success-bg)]",
          day.status === "missed" &&
            "border-[var(--status-danger-text)] bg-[var(--status-danger-bg)]",
          day.status === "pending" &&
            "border-[var(--a-line)] bg-[var(--a-wash)]",
        )}
      />
      <span className="text-[10px] tabular-nums text-[var(--a-ink-soft)]">
        {new Date(`${day.date}T12:00:00`).getDate()}
      </span>
    </div>
  );
}

function LegendDot({
  tone,
  label,
}: {
  tone: "success" | "danger" | "muted";
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn(
          "size-2 rounded-full",
          tone === "success" && "bg-[var(--status-success-text)]",
          tone === "danger" && "bg-[var(--status-danger-text)]",
          tone === "muted" && "bg-[var(--a-ink-soft)]/40",
        )}
      />
      {label}
    </span>
  );
}

function ReadingHistoryList({ history }: { history: MemberReadingDay[] }) {
  const [expanded, setExpanded] = useState(false);
  const initialCount = 7;
  const hiddenCount = Math.max(history.length - initialCount, 0);
  const visible = expanded ? history : history.slice(0, initialCount);

  return (
    <div>
      <ul className="divide-y divide-[var(--a-line)]">
        {visible.map((day) => (
          <li key={day.date}>
            <ReadingDayRow day={day} />
          </li>
        ))}
      </ul>
      {hiddenCount > 0 ? (
        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-1.5 border-t border-[var(--a-line)] text-sm font-semibold text-[var(--a-accent)] transition-colors hover:bg-[var(--a-wash)]/50"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded
            ? copy.members.detail.seeLess
            : copy.members.detail.seeMore(hiddenCount)}
          <ChevronDown
            className={cn(
              "size-4 transition-transform",
              expanded && "rotate-180",
            )}
          />
        </button>
      ) : null}
    </div>
  );
}

function ReadingDayRow({ day }: { day: MemberReadingDay }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5 lg:px-5">
      <div className="mt-0.5 shrink-0">
        {day.status === "completed" ? (
          <CheckCircle2 className="size-4 text-[var(--status-success-text)]" />
        ) : day.status === "missed" ? (
          <XCircle className="size-4 text-[var(--status-danger-text)]" />
        ) : (
          <Circle className="size-4 text-[var(--a-ink-soft)]" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-[var(--a-ink)]">
            {formatReadingDayLabel(day.date)}
          </p>
          <StatusPill status={day.status} />
        </div>
        <p className="mt-0.5 text-sm font-semibold text-[var(--a-accent)]">
          {day.passage}
        </p>
        <p className="mt-0.5 text-xs text-[var(--a-ink-soft)]">
          {day.title.replace(/^Hari \d+ — /, "")}
        </p>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: MemberReadingDayStatus }) {
  return (
    <span
      className={cn(
        "rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
        status === "completed" &&
          "bg-[var(--status-success-bg)] text-[var(--status-success-text)]",
        status === "missed" &&
          "bg-[var(--status-danger-bg)] text-[var(--status-danger-text)]",
        status === "pending" && "bg-[var(--a-wash)] text-[var(--a-ink-soft)]",
      )}
    >
      {DAY_STATUS_LABELS[status]}
    </span>
  );
}
