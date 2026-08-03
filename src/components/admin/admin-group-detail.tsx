"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  HeartHandshake,
  Mail,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { useDemoAuth } from "@/components/auth/demo-auth-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LoadingModal } from "@/components/ui/loading-screen";
import { demoGroupReflections, demoProgram } from "@/lib/demo-data";
import { getGroupById } from "@/lib/group-registry";
import {
  getGroupSummary,
  getInitials,
  getMembersByGroup,
} from "@/lib/group-members";
import { getRoleLabel } from "@/lib/role-label";
import type { MemberTodayStatus } from "@/lib/types";
import {
  getUrgencyMeta,
  urgencyFromRate,
} from "@/lib/urgency";
import { cn } from "@/lib/utils";

const todayStatusLabel: Record<MemberTodayStatus, string> = {
  completed: "Sudah baca",
  pending: "Belum baca",
  missed: "Terlewat",
};

type AdminGroupDetailProps = {
  groupId: string;
};

export function AdminGroupDetail({ groupId }: AdminGroupDetailProps) {
  const router = useRouter();
  const { session, isAdmin, ready, logout } = useDemoAuth();
  const group = getGroupById(groupId);
  const [focusAttention, setFocusAttention] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!isAdmin) router.replace("/login");
  }, [ready, isAdmin, router]);

  const members = useMemo(() => getMembersByGroup(groupId), [groupId]);
  const attentionMembers = useMemo(
    () =>
      members.filter(
        (member) =>
          member.todayStatus === "pending" || member.todayStatus === "missed",
      ),
    [members],
  );

  if (!ready || !isAdmin || !session) {
    return (
      <LoadingModal
        label="Memuat detail kelompok"
        hint="Menyiapkan anggota dan progress…"
      />
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!group) {
    return (
      <AdminShell
        session={session}
        onLogout={handleLogout}
        activeNav="groups"
      >
        <BackLink />
        <div className="mt-6 rounded-2xl border border-[var(--a-line)] bg-white/90 p-6">
          <h1 className="admin-display text-2xl text-[var(--a-ink)]">
            Kelompok tidak ditemukan
          </h1>
          <p className="mt-2 text-sm text-[var(--a-ink-soft)]">
            ID kelompok ini tidak ada di data demo.
          </p>
        </div>
      </AdminShell>
    );
  }

  const summary = getGroupSummary(group.id);
  const attentionCount = summary.missedToday + summary.pendingToday;
  const memberTotal =
    summary.memberCount > 0 ? summary.memberCount : group.memberCount;
  const todayRate =
    memberTotal > 0
      ? Math.round((summary.completedToday / memberTotal) * 100)
      : 0;
  const urgency = getUrgencyMeta(
    urgencyFromRate(
      summary.memberCount > 0 ? summary.averageCompletionRate : todayRate || 65,
    ),
  );

  const scrollToAttention = () => {
    if (attentionCount === 0) return;
    setFocusAttention(true);
    requestAnimationFrame(() => {
      document
        .getElementById("perlu-perhatian")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <AdminShell session={session} onLogout={handleLogout} activeNav="groups">
      <BackLink />

      <header className="mt-5 mb-6 lg:mt-2 lg:mb-8">
        <p className="admin-kicker text-[var(--a-accent)]">
          {demoProgram.organization}
        </p>
        <h1 className="admin-display mt-2 text-[clamp(1.75rem,2.5vw,2.35rem)] leading-[1.1] text-[var(--a-ink)]">
          {group.name}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--a-ink-soft)]">
          {group.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-[var(--a-ink)] ring-1 ring-[var(--a-line)]">
            Ketua: {group.leaderName}
          </span>
          <span
            className={cn(
              "rounded-lg px-2.5 py-1 text-xs font-semibold",
              urgency.badge,
            )}
          >
            {urgency.label}
          </span>
          <span className="text-xs text-[var(--a-ink-soft)]">
            {demoProgram.name}
          </span>
        </div>
      </header>

      <section className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 lg:mb-6">
        <StatCard label="Anggota" value={String(memberTotal)} />
        <StatCard
          label="Rata-rata 14 hari"
          value={
            summary.memberCount > 0
              ? `${summary.averageCompletionRate}%`
              : "—"
          }
        />
        <StatCard
          label="Sudah baca hari ini"
          value={`${summary.completedToday}/${memberTotal}`}
          tone="success"
        />
        <StatCard
          label="Perlu perhatian"
          value={String(attentionCount)}
          tone={
            summary.missedToday > 0
              ? "danger"
              : summary.pendingToday > 0
                ? "warning"
                : "default"
          }
          onClick={attentionCount > 0 ? scrollToAttention : undefined}
          hint={attentionCount > 0 ? "Lihat daftar ↓" : undefined}
        />
      </section>

      {attentionMembers.length > 0 ? (
        <section
          id="perlu-perhatian"
          className={cn(
            "mb-4 scroll-mt-24 overflow-hidden rounded-2xl border bg-white/90 lg:mb-6",
            focusAttention
              ? "border-[var(--status-warning-text)]/40 ring-2 ring-[var(--status-warning-text)]/25"
              : "border-[var(--a-line)]",
          )}
        >
          <div className="flex items-center gap-2 border-b border-[var(--a-line)] bg-[var(--status-warning-bg)]/50 px-4 py-3.5 lg:px-5">
            <HeartHandshake className="size-4 text-[var(--status-warning-text)]" />
            <div className="min-w-0 flex-1">
              <h2 className="admin-display text-lg text-[var(--a-ink)]">
                Perlu perhatian
              </h2>
              <p className="text-xs text-[var(--a-ink-soft)]">
                {attentionMembers.length} anggota belum menyelesaikan bacaan
                hari ini.
              </p>
            </div>
            <span className="font-mono text-xs font-semibold text-[var(--status-warning-text)]">
              {attentionMembers.length}
            </span>
          </div>
          <ul className="divide-y divide-[var(--a-line)]">
            {attentionMembers.map((member) => (
              <li key={member.id}>
                <Link
                  href={`/admin/users/${member.id}`}
                  className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--a-wash)]/50 lg:px-5"
                >
                  <Avatar className="size-10 shrink-0">
                    <AvatarFallback className="bg-[var(--a-accent)] text-sm font-bold text-white">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[var(--a-ink)]">
                      {member.name}
                    </p>
                    <StatusPill status={member.todayStatus} />
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-[var(--a-ink-soft)]" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mb-4 overflow-hidden rounded-2xl border border-[var(--a-line)] bg-white/90 lg:mb-6">
        <div className="flex items-center gap-2 border-b border-[var(--a-line)] bg-[var(--a-wash)]/60 px-4 py-3.5 lg:px-5">
          <Users className="size-4 text-[var(--a-accent)]" />
          <h2 className="admin-display text-lg text-[var(--a-ink)]">
            Anggota kelompok
          </h2>
          <span className="ml-auto font-mono text-xs text-[var(--a-ink-soft)]">
            {members.length}
          </span>
        </div>

        {members.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <UserRound className="mx-auto size-8 text-[var(--a-ink-soft)]/40" />
            <p className="mt-3 text-sm font-medium text-[var(--a-ink)]">
              Belum ada data anggota detail
            </p>
            <p className="mt-1 text-sm text-[var(--a-ink-soft)]">
              Kelompok ini punya {group.memberCount} anggota di ringkasan
              program.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--a-line)]">
            {members.map((member) => (
              <li key={member.id}>
                <Link
                  href={`/admin/users/${member.id}`}
                  className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--a-wash)]/50 lg:px-5"
                >
                  <Avatar className="size-10 shrink-0">
                    <AvatarFallback className="bg-[var(--a-accent)] text-sm font-bold text-white">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-[var(--a-ink)]">
                        {member.name}
                      </p>
                      <span className="rounded-md bg-[var(--a-wash)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--a-ink-soft)]">
                        {getRoleLabel(member.role)}
                      </span>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-[var(--a-ink-soft)]">
                      <Mail className="size-3 shrink-0" />
                      {member.email}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-[var(--a-ink)]">
                      {member.completionRate}%
                    </p>
                    <StatusPill status={member.todayStatus} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-[var(--a-line)] bg-white/90">
        <div className="flex items-center gap-2 border-b border-[var(--a-line)] bg-[var(--a-wash)]/60 px-4 py-3.5 lg:px-5">
          <BookOpen className="size-4 text-[var(--a-accent)]" />
          <h2 className="admin-display text-lg text-[var(--a-ink)]">
            Renungan terbaru
          </h2>
        </div>
        <ul className="divide-y divide-[var(--a-line)]">
          {demoGroupReflections.map((item) => (
            <li key={item.id} className="px-4 py-4 lg:px-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-semibold text-[var(--a-ink)]">
                  {item.authorName}
                </p>
                <p className="shrink-0 text-xs text-[var(--a-ink-soft)]">
                  {item.time}
                </p>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--a-ink-soft)]">
                {item.content}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </AdminShell>
  );
}

function BackLink() {
  return (
    <Link
      href="/admin?tab=groups"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--a-accent)] transition-colors hover:text-[#2563eb]"
    >
      <ArrowLeft className="size-4" />
      Kembali ke daftar kelompok
    </Link>
  );
}

function StatCard({
  label,
  value,
  tone = "default",
  onClick,
  hint,
}: {
  label: string;
  value: string;
  tone?: "default" | "success" | "warning" | "danger";
  onClick?: () => void;
  hint?: string;
}) {
  const content = (
    <>
      <p className="text-[11px] text-[var(--a-ink-soft)] lg:text-xs">{label}</p>
      <p
        className={cn(
          "admin-display mt-1 text-xl text-[var(--a-ink)] lg:text-2xl",
          tone === "success" && "text-[var(--status-success-text)]",
          tone === "warning" && "text-[var(--status-warning-text)]",
          tone === "danger" && "text-[var(--status-danger-text)]",
        )}
      >
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-[10px] font-medium text-[var(--a-accent)]">
          {hint}
        </p>
      ) : null}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="rounded-2xl border border-[var(--a-line)] bg-white/90 px-4 py-3.5 text-left transition-colors hover:border-[var(--a-accent)]/40 hover:bg-[var(--a-wash)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--a-accent)]/40"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--a-line)] bg-white/90 px-4 py-3.5">
      {content}
    </div>
  );
}

function StatusPill({ status }: { status: MemberTodayStatus }) {
  const Icon =
    status === "completed"
      ? CheckCircle2
      : status === "missed"
        ? XCircle
        : Circle;

  return (
    <span
      className={cn(
        "mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold",
        status === "completed" && "text-[var(--status-success-text)]",
        status === "missed" && "text-[var(--status-danger-text)]",
        status === "pending" && "text-[var(--a-ink-soft)]",
      )}
    >
      <Icon className="size-3" />
      {todayStatusLabel[status]}
    </span>
  );
}
