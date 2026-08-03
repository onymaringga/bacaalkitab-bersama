"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, Flame, Users } from "lucide-react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { MemberAvatar } from "@/components/ui/member-avatar";
import { demoGroups } from "@/lib/demo-data";
import {
  formatLastActive,
  getMemberById,
  getMemberByName,
} from "@/lib/group-members";
import { getRoleLabel } from "@/lib/role-label";
import { cn } from "@/lib/utils";

type MemberProfilePeekProps = {
  name: string;
  memberId?: string;
  currentUser?: boolean;
  groupName?: string;
  className?: string;
  avatarClassName?: string;
  fallbackClassName?: string;
  children?: ReactNode;
};

const TODAY_META = {
  completed: {
    label: "Sudah baca hari ini",
    className:
      "bg-[var(--status-success-bg)] text-[var(--status-success-text)]",
    Icon: CheckCircle2,
  },
  pending: {
    label: "Belum baca hari ini",
    className: "bg-[var(--m-wash)] text-[var(--m-ink-soft)]",
    Icon: Circle,
  },
  missed: {
    label: "Terlewat hari ini",
    className: "bg-[var(--status-warning-bg)] text-[var(--status-warning-text)]",
    Icon: Circle,
  },
} as const;

/** Hover sneak peek profil di timeline / daftar anggota. */
export function MemberProfilePeek({
  name,
  memberId,
  currentUser = false,
  groupName,
  className,
  avatarClassName,
  fallbackClassName,
  children,
}: MemberProfilePeekProps) {
  const member =
    (memberId ? getMemberById(memberId) : undefined) ?? getMemberByName(name);
  const group =
    member != null
      ? demoGroups.find((item) => item.id === member.groupId)
      : undefined;
  const resolvedGroupName = group?.name ?? groupName;
  const lastActive = member?.lastActiveAt
    ? formatLastActive(member.lastActiveAt)
    : null;
  const profileHref = member ? `/profil/anggota/${member.id}` : undefined;
  const today = member ? TODAY_META[member.todayStatus] : null;

  return (
    <HoverCard openDelay={160} closeDelay={140}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className={cn(
            "rounded-full outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--m-accent)]/40",
            className,
          )}
          aria-label={`Lihat profil ${name}`}
        >
          {children ?? (
            <MemberAvatar
              name={name}
              memberId={member?.id ?? memberId}
              currentUser={currentUser || Boolean(member?.isCurrentUser)}
              className={avatarClassName}
              fallbackClassName={fallbackClassName}
            />
          )}
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        side="bottom"
        align="start"
        sideOffset={10}
        className="w-[18.5rem] overflow-hidden border-[var(--m-line)]/70 bg-white p-0 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.28)]"
      >
        <div className="bg-gradient-to-br from-[var(--m-wash)]/80 via-white to-white px-4 pt-4 pb-3.5">
          <div className="flex items-center gap-3">
            <MemberAvatar
              name={name}
              memberId={member?.id ?? memberId}
              currentUser={currentUser || Boolean(member?.isCurrentUser)}
              className="size-12 shrink-0 ring-2 ring-white shadow-sm"
              fallbackClassName="bg-[var(--m-wash)] text-sm font-semibold text-[var(--m-ink)]"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.95rem] font-semibold leading-snug text-[var(--m-ink)]">
                {name}
              </p>
              {member ? (
                <p className="mt-0.5 truncate text-[11px] font-medium text-[var(--m-ink-soft)]">
                  {getRoleLabel(member.role)}
                  {resolvedGroupName ? ` · ${resolvedGroupName}` : ""}
                </p>
              ) : resolvedGroupName ? (
                <p className="mt-0.5 inline-flex max-w-full items-center gap-1 truncate text-[11px] font-medium text-[var(--m-ink-soft)]">
                  <Users className="size-3 shrink-0" />
                  <span className="truncate">{resolvedGroupName}</span>
                </p>
              ) : (
                <p className="mt-0.5 text-[11px] text-[var(--m-ink-soft)]">
                  Anggota komunitas
                </p>
              )}
            </div>
          </div>
        </div>

        {member ? (
          <div className="grid grid-cols-2 gap-px border-y border-[var(--m-line)]/60 bg-[var(--m-line)]/40">
            <div className="bg-white px-4 py-3">
              <p className="text-[10px] font-semibold tracking-[0.08em] text-[var(--m-ink-soft)] uppercase">
                Streak
              </p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums text-[var(--m-ink)]">
                <Flame className="size-3.5 text-amber-500" aria-hidden />
                {member.streakDays} hari
              </p>
            </div>
            <div className="bg-white px-4 py-3">
              <p className="text-[10px] font-semibold tracking-[0.08em] text-[var(--m-ink-soft)] uppercase">
                Progress
              </p>
              <p className="mt-1 text-sm font-semibold tabular-nums text-[var(--m-ink)]">
                {member.completionRate}%
              </p>
            </div>
          </div>
        ) : null}

        <div className="space-y-3 px-4 py-3.5">
          {today ? (
            <p
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                today.className,
              )}
            >
              <today.Icon className="size-3" aria-hidden />
              {today.label}
            </p>
          ) : null}

          {lastActive ? (
            <p className="text-[11px] leading-relaxed text-[var(--m-ink-soft)]">
              Terakhir aktif · {lastActive}
            </p>
          ) : null}

          {profileHref ? (
            <Link
              href={profileHref}
              className="group inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--m-wash)] text-xs font-semibold text-[var(--m-accent)] transition hover:bg-[var(--m-accent)] hover:text-white"
            >
              Lihat profil
              <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
            </Link>
          ) : null}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
