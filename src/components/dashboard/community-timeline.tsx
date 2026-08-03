"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowDownWideNarrow,
  BookOpen,
  Heart,
  NotebookPen,
  Trash2,
} from "lucide-react";

import { useDemoAuth } from "@/components/auth/demo-auth-provider";
import { MemberAvatar } from "@/components/ui/member-avatar";
import { MemberProfilePeek } from "@/components/ui/member-profile-peek";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/components/ui/toast-host";
import { copy } from "@/lib/copy";
import { demoUser } from "@/lib/demo-data";
import {
  createTimelinePost,
  getCommunityTimeline,
  getServerCommunityTimeline,
  getServerTimelineLikesSnapshot,
  getTimelineLikeState,
  getTimelineLikesSnapshot,
  removeOwnTimelineItem,
  subscribeCommunityTimeline,
  toggleTimelineLike,
  type TimelinePost,
} from "@/lib/community-timeline";
import { cn } from "@/lib/utils";

type CommunityTimelineProps = {
  className?: string;
};

type SortMode = "newest" | "popular";

const PAGE_SIZE = 7;
const MAX_LEN = 2000;

export function CommunityTimeline({ className }: CommunityTimelineProps) {
  const { session } = useDemoAuth();
  const displayName = session?.name ?? demoUser.name;
  const [draft, setDraft] = useState("");
  const [pendingDelete, setPendingDelete] = useState<TimelinePost | null>(null);
  const [sort, setSort] = useState<SortMode>("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const feed = useSyncExternalStore(
    subscribeCommunityTimeline,
    getCommunityTimeline,
    getServerCommunityTimeline,
  );
  const likesKey = useSyncExternalStore(
    subscribeCommunityTimeline,
    getTimelineLikesSnapshot,
    getServerTimelineLikesSnapshot,
  );

  const sorted = useMemo(() => {
    void likesKey;
    const list = [...feed];
    if (sort === "popular") {
      list.sort((a, b) => {
        const likesA = getTimelineLikeState(a.id).count;
        const likesB = getTimelineLikeState(b.id).count;
        if (likesB !== likesA) return likesB - likesA;
        return a.createdAt < b.createdAt ? 1 : -1;
      });
    } else {
      list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    }
    return list;
  }, [feed, likesKey, sort]);

  const items = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  const likesById = useMemo(() => {
    void likesKey;
    const map = new Map<string, { count: number; likedByMe: boolean }>();
    for (const item of items) {
      map.set(item.id, getTimelineLikeState(item.id));
    }
    return map;
  }, [items, likesKey]);

  function handleSortChange(mode: SortMode) {
    setSort(mode);
    setVisibleCount(PAGE_SIZE);
  }

  function handlePost() {
    const created = createTimelinePost(draft, displayName);
    if (!created) return;
    setDraft("");
    setSort("newest");
    setVisibleCount(PAGE_SIZE);
    showToast("Diposting ke timeline");
  }

  function handleConfirmDelete() {
    if (!pendingDelete) return;
    const item = pendingDelete;
    setPendingDelete(null);
    if (!removeOwnTimelineItem(item)) return;
    showToast(
      item.kind === "reflection"
        ? copy.home.timeline.deletedReflection
        : copy.home.timeline.deleted,
    );
  }

  return (
    <section
      className={cn(
        "rounded-2xl border border-[var(--m-line)] bg-white/90",
        className,
      )}
    >
      <div className="shrink-0 border-b border-[var(--m-line)] px-4 py-3.5 sm:px-5">
        <h2 className="text-sm font-semibold text-[var(--m-ink)]">
          {copy.home.timeline.title}
        </h2>
        <p className="mt-0.5 text-xs text-[var(--m-ink-soft)]">
          {copy.home.timeline.subtitle}
        </p>
      </div>

      {/* Composer */}
      <div className="shrink-0 border-b border-[var(--m-line)] px-4 py-3.5 sm:px-5">
        <div className="flex gap-3">
          <MemberAvatar
            name={displayName}
            currentUser
            className="size-9 shrink-0 sm:size-10"
            fallbackClassName="bg-[var(--m-wash)] text-xs font-semibold text-[var(--m-ink)]"
          />
          <div className="min-w-0 flex-1 space-y-2.5">
            <Textarea
              value={draft}
              onChange={(event) =>
                setDraft(event.target.value.slice(0, MAX_LEN))
              }
              placeholder={copy.home.timeline.placeholder}
              className="min-h-[4.5rem] resize-none rounded-xl border-[var(--m-line)] bg-[var(--m-wash)]/40 text-sm leading-relaxed shadow-none focus-visible:bg-white"
            />
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] tabular-nums text-[var(--m-ink-soft)]">
                {draft.length}/{MAX_LEN}
              </p>
              <Button
                type="button"
                size="sm"
                className="h-8 rounded-lg px-3 font-semibold"
                disabled={!draft.trim()}
                onClick={handlePost}
              >
                {copy.home.timeline.post}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="px-4 py-10 text-center sm:px-5">
          <p className="text-sm text-[var(--m-ink-soft)]">
            {copy.home.timeline.empty}
          </p>
        </div>
      ) : (
        <>
          <div className="flex shrink-0 items-center justify-end border-b border-[var(--m-line)] px-3 py-1.5 sm:px-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="size-8 rounded-lg text-[var(--m-ink-soft)] hover:bg-[var(--m-wash)] hover:text-[var(--m-ink)]"
                  aria-label={copy.home.timeline.sortAria}
                  title={
                    sort === "popular"
                      ? copy.home.timeline.sortPopular
                      : copy.home.timeline.sortNewest
                  }
                >
                  <ArrowDownWideNarrow className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[9.5rem]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => {
                    if (value === "newest" || value === "popular") {
                      handleSortChange(value);
                    }
                  }}
                >
                  <DropdownMenuRadioItem value="newest">
                    {copy.home.timeline.sortNewest}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="popular">
                    {copy.home.timeline.sortPopular}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <ul className="divide-y divide-[var(--m-line)]">
            {items.map((item) => (
              <TimelineItem
                key={item.id}
                item={item}
                like={likesById.get(item.id) ?? { count: 0, likedByMe: false }}
                onLike={() => toggleTimelineLike(item.id)}
                onDelete={
                  item.isMine ? () => setPendingDelete(item) : undefined
                }
              />
            ))}
          </ul>

          {hasMore ? (
            <div className="shrink-0 border-t border-[var(--m-line)] px-4 py-3 sm:px-5">
              <Button
                type="button"
                variant="outline"
                className="h-9 w-full rounded-xl text-sm font-semibold"
                onClick={() =>
                  setVisibleCount((current) => current + PAGE_SIZE)
                }
              >
                {copy.home.timeline.loadMore}
              </Button>
            </div>
          ) : null}
        </>
      )}

      <Dialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <DialogContent className="gap-4 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{copy.home.timeline.deleteTitle}</DialogTitle>
            <DialogDescription>
              {pendingDelete?.kind === "reflection"
                ? copy.home.timeline.deleteReflectionDescription
                : copy.home.timeline.deleteDescription}
            </DialogDescription>
          </DialogHeader>
          {pendingDelete ? (
            <p className="line-clamp-4 rounded-xl bg-[var(--m-wash)] px-3.5 py-3 text-sm leading-relaxed text-[var(--m-ink)]">
              {pendingDelete.content}
            </p>
          ) : null}
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingDelete(null)}
            >
              {copy.home.timeline.deleteCancel}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="font-semibold"
              onClick={handleConfirmDelete}
            >
              <Trash2 className="size-4" />
              {copy.home.timeline.deleteConfirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function TimelineItem({
  item,
  like,
  onLike,
  onDelete,
}: {
  item: TimelinePost;
  like: { count: number; likedByMe: boolean };
  onLike: () => void;
  onDelete?: () => void;
}) {
  const kindLabel =
    item.kind === "reflection"
      ? "Refleksi diri"
      : item.kind === "share"
        ? "Renungan"
        : null;

  return (
    <li className="px-4 py-4 sm:px-5">
      <div className="flex gap-3">
        <MemberProfilePeek
          name={item.authorName}
          currentUser={item.isMine}
          groupName={item.groupName}
          avatarClassName="size-9 shrink-0 sm:size-10"
          fallbackClassName="bg-[var(--m-wash)] text-xs font-semibold text-[var(--m-ink)]"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <p className="text-sm font-semibold text-[var(--m-ink)]">
                  {item.authorName}
                </p>
                {kindLabel ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--m-accent)]">
                    {item.kind === "reflection" ? (
                      <NotebookPen className="size-3" />
                    ) : null}
                    {kindLabel}
                  </span>
                ) : null}
                {item.groupName && item.kind !== "reflection" ? (
                  <span className="text-[11px] font-medium text-[var(--m-accent)]">
                    {item.groupName}
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-[var(--m-ink-soft)]">
                <span>{item.time}</span>
                {item.passage ? (
                  <>
                    <span aria-hidden>·</span>
                    <Link
                      href={`/baca?tab=alkitab&passage=${encodeURIComponent(item.passage)}`}
                      className="inline-flex min-w-0 items-center gap-1 font-medium hover:text-[var(--m-accent)]"
                    >
                      <BookOpen className="size-3 shrink-0" />
                      <span className="truncate">{item.passage}</span>
                    </Link>
                  </>
                ) : null}
              </p>
            </div>
            {onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                className="rounded-lg p-1.5 text-[var(--m-ink-soft)] transition hover:bg-[var(--m-wash)] hover:text-destructive"
                aria-label={copy.home.timeline.delete}
              >
                <Trash2 className="size-3.5" />
              </button>
            ) : null}
          </div>

          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--m-ink)]">
            {item.content}
          </p>

          <div className="mt-3 flex items-center gap-1">
            <button
              type="button"
              onClick={onLike}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition",
                like.likedByMe
                  ? "bg-rose-50 text-rose-600"
                  : "text-[var(--m-ink-soft)] hover:bg-[var(--m-wash)] hover:text-[var(--m-ink)]",
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
