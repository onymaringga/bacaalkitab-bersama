"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Circle,
  Heart,
  MessageSquareText,
  NotebookPen,
  XCircle,
} from "lucide-react";

import { useRolePreview } from "@/components/role-preview/role-preview-provider";
import { Badge } from "@/components/ui/badge";
import { MemberAvatar } from "@/components/ui/member-avatar";
import { SendReminderButton } from "@/components/ui/send-reminder-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TitleWithHint } from "@/components/ui/title-with-hint";
import {
  getServerTimelineForAuthor,
  getTimelineForAuthor,
  getTimelineLikeState,
  getTimelineLikesSnapshot,
  getServerTimelineLikesSnapshot,
  subscribeCommunityTimeline,
  toggleTimelineLike,
  type TimelinePost,
} from "@/lib/community-timeline";
import {
  formatReadingDayLabel,
  getMemberReadingHistory,
  getRecentTrend,
  getTimelineDays,
} from "@/lib/member-reading-history";
import { copy } from "@/lib/copy";
import { getRoleLabel } from "@/lib/role-label";
import type {
  GroupMemberProgress,
  MemberReadingDay,
  MemberReadingDayStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const DAY_STATUS_LABELS = copy.members.dayStatus;

const DAY_STATUS_VARIANT: Record<
  MemberReadingDayStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  completed: "default",
  missed: "destructive",
  pending: "secondary",
};

type MemberDetailViewProps = {
  member: GroupMemberProgress;
  groupName: string;
};

export function MemberDetailView({ member, groupName }: MemberDetailViewProps) {
  const { isLeaderView } = useRolePreview();
  const history = getMemberReadingHistory(member);
  const trend = getRecentTrend(history);
  const timeline = getTimelineDays(history);

  return (
    <div className="space-y-4">
      <Card className={cn(member.isCurrentUser && "border-primary/30 ring-1 ring-primary/20")}>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-start gap-3">
            <MemberAvatar
              name={member.name}
              memberId={member.id}
              currentUser={member.isCurrentUser}
              className="size-10"
              fallbackClassName="bg-primary/10 text-primary text-base font-semibold"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold leading-tight">
                  {member.name}
                  {member.isCurrentUser ? (
                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                      {copy.common.you}
                    </span>
                  ) : null}
                </h1>
                <Badge variant={member.role === "leader" ? "default" : "outline"}>
                  {getRoleLabel(member.role)}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{member.email}</p>
              <p className="mt-1 text-xs text-muted-foreground">{groupName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatBox
              label={copy.members.stats.progress}
              value={`${member.completionRate}%`}
            />
            <StatBox
              label={copy.members.stats.streak}
              value={copy.members.stats.streakDays(member.streakDays)}
            />
            <StatBox
              label={copy.members.stats.completed}
              value={String(member.completedCount)}
              tone="success"
            />
            <StatBox
              label={copy.members.stats.missed}
              value={String(member.missedCount)}
              tone="danger"
            />
          </div>

          {isLeaderView &&
          !member.isCurrentUser &&
          (member.todayStatus === "pending" || member.todayStatus === "missed") ? (
          <SendReminderButton
              recipientName={member.name}
              recipientEmail={member.email}
              recipientPhone={member.phone}
              className="w-full"
              successMessage={`Pengingat terkirim ke ${member.name}`}
            >
              <Bell className="size-4" />
              {copy.members.sendReminder}
            </SendReminderButton>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid items-start gap-4 sm:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="size-4 shrink-0" />
              <TitleWithHint
                title={copy.members.detail.last14}
                hint={copy.members.detail.trendSummary(
                  trend.completed,
                  trend.missed,
                  trend.pending,
                )}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {timeline.map((day) => (
                <TimelineDot key={day.date} day={day} />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
              <LegendDot tone="success" label={copy.members.legend.completed} />
              <LegendDot tone="danger" label={copy.members.legend.missed} />
              <LegendDot tone="muted" label={copy.members.legend.pending} />
            </div>
          </CardContent>
        </Card>

        <ReadingHistorySection history={history} />
      </div>

      <MemberPostsTimeline
        authorName={member.name}
        currentUser={Boolean(member.isCurrentUser)}
      />
    </div>
  );
}

function MemberPostsTimeline({
  authorName,
  currentUser,
}: {
  authorName: string;
  currentUser: boolean;
}) {
  const getSnapshot = useCallback(
    () => getTimelineForAuthor(authorName),
    [authorName],
  );
  const getServerSnapshot = useCallback(
    () => getServerTimelineForAuthor(authorName),
    [authorName],
  );
  const feed = useSyncExternalStore(
    subscribeCommunityTimeline,
    getSnapshot,
    getServerSnapshot,
  );
  const likesKey = useSyncExternalStore(
    subscribeCommunityTimeline,
    getTimelineLikesSnapshot,
    getServerTimelineLikesSnapshot,
  );

  const likesById = useMemo(() => {
    void likesKey;
    const map = new Map<string, { count: number; likedByMe: boolean }>();
    for (const item of feed) {
      map.set(item.id, getTimelineLikeState(item.id));
    }
    return map;
  }, [feed, likesKey]);

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className="border-b border-border pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquareText className="size-4 shrink-0" />
          <TitleWithHint
            title={copy.members.detail.postsTitle}
            hint={copy.members.detail.postsSubtitle}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {feed.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            {copy.members.detail.postsEmpty}
          </p>
        ) : (
          <ul className="max-h-[min(28rem,55dvh)] divide-y divide-border overflow-y-auto overscroll-contain">
            {feed.map((item) => (
              <MemberTimelineItem
                key={item.id}
                item={item}
                currentUser={currentUser}
                like={likesById.get(item.id) ?? { count: 0, likedByMe: false }}
                onLike={() => toggleTimelineLike(item.id)}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function MemberTimelineItem({
  item,
  currentUser,
  like,
  onLike,
}: {
  item: TimelinePost;
  currentUser: boolean;
  like: { count: number; likedByMe: boolean };
  onLike: () => void;
}) {
  const kindLabel =
    item.kind === "reflection"
      ? "Refleksi diri"
      : item.kind === "share"
        ? "Renungan"
        : item.kind === "post"
          ? "Postingan"
          : null;

  return (
    <li className="px-4 py-4">
      <div className="flex gap-3">
        <MemberAvatar
          name={item.authorName}
          currentUser={currentUser || item.isMine}
          className="size-9 shrink-0"
          fallbackClassName="bg-primary/10 text-xs font-semibold text-primary"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <p className="text-sm font-semibold text-foreground">
              {item.authorName}
            </p>
            {kindLabel ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                {item.kind === "reflection" ? (
                  <NotebookPen className="size-3" />
                ) : null}
                {kindLabel}
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-muted-foreground">
            <span>{item.time}</span>
            {item.passage ? (
              <>
                <span aria-hidden>·</span>
                <Link
                  href={`/baca?tab=alkitab&passage=${encodeURIComponent(item.passage)}`}
                  className="inline-flex min-w-0 items-center gap-1 font-medium hover:text-primary"
                >
                  <BookOpen className="size-3 shrink-0" />
                  <span className="truncate">{item.passage}</span>
                </Link>
              </>
            ) : null}
          </p>

          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {item.content}
          </p>

          <div className="mt-3">
            <button
              type="button"
              onClick={onLike}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition",
                like.likedByMe
                  ? "bg-rose-50 text-rose-600"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
              )}
            >
              <Heart
                className={cn("size-3.5", like.likedByMe && "fill-current")}
              />
              {like.count > 0 ? like.count : "Suka"}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

function StatBox({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "success" | "danger" | "neutral";
}) {
  return (
    <div
      className={cn(
        "rounded-xl px-3 py-2 text-center",
        tone === "success" && "bg-[var(--status-success-bg)]",
        tone === "danger" && "bg-[var(--status-danger-bg)]",
        tone === "neutral" && "bg-muted/60",
      )}
    >
      <p
        className={cn(
          "text-lg font-semibold",
          tone === "success" && "text-[var(--status-success-text)]",
          tone === "danger" && "text-[var(--status-danger-text)]",
        )}
      >
        {value}
      </p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

function TimelineDot({ day }: { day: MemberReadingDay }) {
  const date = new Date(`${day.date}T12:00:00`);

  return (
    <div className="flex min-w-[2.25rem] flex-col items-center gap-1">
      <div
        title={`${day.date} — ${DAY_STATUS_LABELS[day.status]}`}
        className={cn(
          "size-8 rounded-full border-2",
          day.status === "completed" &&
            "border-[var(--status-success-text)] bg-[var(--status-success-bg)]",
          day.status === "missed" &&
            "border-[var(--status-danger-text)] bg-[var(--status-danger-bg)]",
          day.status === "pending" && "border-muted-foreground/30 bg-muted/50",
        )}
      />
      <span className="text-[10px] text-muted-foreground">{date.getDate()}</span>
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
          "size-2.5 rounded-full",
          tone === "success" && "bg-[var(--status-success-text)]",
          tone === "danger" && "bg-[var(--status-danger-text)]",
          tone === "muted" && "bg-muted-foreground/40",
        )}
      />
      {label}
    </span>
  );
}

function ReadingHistorySection({ history }: { history: MemberReadingDay[] }) {
  const [expanded, setExpanded] = useState(false);
  const initialCount = 3;
  const hiddenCount = Math.max(history.length - initialCount, 0);
  const visibleHistory = expanded ? history : history.slice(0, initialCount);

  return (
    <Card className="min-w-0">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="size-4 shrink-0" />
          <TitleWithHint
            title={copy.members.detail.history}
            hint={copy.members.detail.historyHint}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {visibleHistory.map((day) => (
          <ReadingDayRow key={day.date} day={day} />
        ))}

        {hiddenCount > 0 ? (
          <Button
            type="button"
            variant="ghost"
            className="h-9 w-full gap-1 text-sm font-medium text-primary"
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded
              ? copy.members.detail.seeLess
              : copy.members.detail.seeMore(hiddenCount)}
            <ChevronDown
              className={cn("size-4 transition-transform", expanded && "rotate-180")}
            />
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ReadingDayRow({ day }: { day: MemberReadingDay }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/70 px-3 py-3">
      <div className="mt-0.5 shrink-0">
        {day.status === "completed" ? (
          <CheckCircle2 className="size-4 text-[var(--status-success-text)]" />
        ) : day.status === "missed" ? (
          <XCircle className="size-4 text-[var(--status-danger-text)]" />
        ) : (
          <Circle className="size-4 text-muted-foreground" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">{formatReadingDayLabel(day.date)}</p>
          <Badge variant={DAY_STATUS_VARIANT[day.status]} className="text-[10px]">
            {DAY_STATUS_LABELS[day.status]}
          </Badge>
        </div>
        <p className="mt-0.5 text-sm font-semibold text-primary">{day.passage}</p>
        <p className="text-xs text-muted-foreground">{day.title}</p>
      </div>
    </div>
  );
}
