"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Activity,
  BookOpen,
  ChevronRight,
  MessageSquareText,
  PenLine,
} from "lucide-react";

import { MemberAvatar } from "@/components/ui/member-avatar";
import { copy } from "@/lib/copy";
import {
  getGroupRecentActivities,
  getServerGroupRecentActivities,
  type GroupActivityItem,
  type GroupActivityKind,
} from "@/lib/group-recent-activities";
import { subscribeCommunityTimeline } from "@/lib/community-timeline";
import { cn } from "@/lib/utils";

type GroupRecentActivitiesProps = {
  groupId: string;
  limit?: number;
  /** Filter jenis aktivitas — mis. hanya baca agar tidak dobel dengan timeline */
  kinds?: GroupActivityKind[];
  className?: string;
  onViewMembers?: () => void;
};

function ActivityIcon({ kind }: { kind: GroupActivityKind }) {
  if (kind === "read") return <BookOpen className="size-3.5" aria-hidden />;
  if (kind === "post") return <MessageSquareText className="size-3.5" aria-hidden />;
  return <PenLine className="size-3.5" aria-hidden />;
}

function ActivityRow({ item }: { item: GroupActivityItem }) {
  const displayName = item.isCurrentUser
    ? `${item.memberName} (kamu)`
    : item.memberName;

  return (
    <Link
      href={item.href}
      className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[var(--m-wash)]/45 lg:px-5"
    >
      <MemberAvatar
        name={item.memberName}
        memberId={item.memberId ?? undefined}
        currentUser={item.isCurrentUser}
        className="mt-0.5 size-9 shrink-0"
        fallbackClassName={cn(
          "text-[10px] font-semibold",
          item.isCurrentUser
            ? "bg-[var(--m-accent)] text-white"
            : "bg-[var(--m-wash)] text-[var(--m-ink)]",
        )}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="min-w-0 text-sm text-[var(--m-ink)]">
            <span className="font-semibold">{displayName}</span>{" "}
            <span className="font-normal text-[var(--m-ink-soft)]">
              {item.action}
            </span>
          </p>
          <span className="shrink-0 text-[11px] text-[var(--m-ink-soft)]">
            {item.timeLabel}
          </span>
        </div>
        <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-[var(--m-ink-soft)]">
          <span className="inline-flex size-4 shrink-0 items-center justify-center text-[var(--m-accent)]">
            <ActivityIcon kind={item.kind} />
          </span>
          <span className="truncate">{item.detail}</span>
        </p>
      </div>
    </Link>
  );
}

export function GroupRecentActivities({
  groupId,
  limit = 7,
  kinds,
  className,
  onViewMembers,
}: GroupRecentActivitiesProps) {
  const kindsKey = kinds?.length ? [...kinds].sort().join("+") : "all";

  const getSnapshot = useCallback(
    () => getGroupRecentActivities(groupId, limit, kinds),
    [groupId, limit, kindsKey],
  );

  const activities = useSyncExternalStore(
    subscribeCommunityTimeline,
    getSnapshot,
    () => getServerGroupRecentActivities(groupId, limit, kinds),
  );

  const empty = activities.length === 0;
  const readsOnly = kinds?.length === 1 && kinds[0] === "read";

  const subtitle = useMemo(() => {
    if (empty) {
      return readsOnly
        ? "Belum ada yang selesai baca."
        : "Belum ada aktivitas dari anggota.";
    }
    return readsOnly
      ? "Siapa saja yang baru menyelesaikan bacaan."
      : "Baca selesai, refleksi, dan kabar dari anggota.";
  }, [empty, readsOnly]);

  return (
    <section
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90",
        className,
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--m-line)] px-4 py-3 lg:px-5">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-[var(--m-ink)]">
            {readsOnly ? "Baru selesai baca" : copy.groups.recentActivity}
          </h2>
          <p className="text-xs text-[var(--m-ink-soft)]">{subtitle}</p>
        </div>
        {onViewMembers ? (
          <button
            type="button"
            onClick={onViewMembers}
            className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-[var(--m-accent)] hover:underline"
          >
            Anggota
            <ChevronRight className="size-3.5" />
          </button>
        ) : null}
      </div>

      {empty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-10 text-center lg:px-5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[var(--m-wash)] text-[var(--m-ink-soft)]">
            <Activity className="size-4 opacity-70" aria-hidden />
          </span>
          <p className="max-w-[16rem] text-sm leading-relaxed text-[var(--m-ink-soft)]">
            {readsOnly
              ? "Saat anggota menandai bacaan selesai, namanya muncul di sini."
              : "Saat anggota selesai baca atau bagikan refleksi, aktivitasnya muncul di sini."}
          </p>
        </div>
      ) : (
        <ul className="min-h-0 flex-1 divide-y divide-[var(--m-line)] overflow-y-auto overscroll-contain">
          {activities.map((item) => (
            <li key={item.id}>
              <ActivityRow item={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
