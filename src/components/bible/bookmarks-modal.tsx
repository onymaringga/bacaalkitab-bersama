"use client";

import { useSyncExternalStore } from "react";
import { Bookmark, BookOpen, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { showToast } from "@/components/ui/toast-host";
import {
  EMPTY_BOOKMARKS,
  formatBookmarkReference,
  getAllBibleBookmarks,
  getServerBibleBookmarks,
  removeBibleBookmark,
  subscribeBibleBookmarks,
  type BibleBookmark,
} from "@/lib/bible-bookmarks";
import { cn } from "@/lib/utils";

type BookmarksModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenPassage?: (passageLabel: string) => void;
};

function formatSavedAt(ts: number) {
  if (!Number.isFinite(ts)) return "";
  const date = new Date(ts);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const BOOKMARK_PREVIEW_MAX = 200;

function previewBookmarkText(text: string) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= BOOKMARK_PREVIEW_MAX) return cleaned;
  return `${cleaned.slice(0, BOOKMARK_PREVIEW_MAX).trimEnd()}…`;
}

export function BookmarksModal({
  open,
  onOpenChange,
  onOpenPassage,
}: BookmarksModalProps) {
  const bookmarks = useSyncExternalStore(
    subscribeBibleBookmarks,
    getAllBibleBookmarks,
    getServerBibleBookmarks,
  );

  function handleOpen(bookmark: BibleBookmark) {
    onOpenPassage?.(bookmark.passageLabel);
    onOpenChange(false);
  }

  function handleDelete(id: string) {
    removeBibleBookmark(id);
    showToast("Bookmark dihapus");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          "flex max-h-[min(92dvh,40rem)] w-full max-w-[calc(100%-1.25rem)] flex-col gap-0 overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-[0_24px_64px_oklch(0.28_0.06_255_/_0.22)] ring-1 ring-[var(--m-line)] sm:max-w-xl lg:max-w-2xl",
          "[&_[data-slot=dialog-close]]:top-4 [&_[data-slot=dialog-close]]:right-4 [&_[data-slot=dialog-close]]:rounded-full [&_[data-slot=dialog-close]]:bg-white/70 [&_[data-slot=dialog-close]]:backdrop-blur-sm",
        )}
      >
        <DialogHeader className="relative shrink-0 overflow-hidden px-5 pt-5 pb-4 sm:px-7 sm:pt-6 sm:pb-5">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 120% at 0% 0%, oklch(0.82 0.08 255 / 0.45), transparent 55%), linear-gradient(180deg, #f7faff 0%, #ffffff 100%)",
            }}
            aria-hidden
          />
          <div className="relative flex items-start gap-3.5 pr-8">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--m-accent)] text-white shadow-[0_10px_24px_oklch(0.45_0.14_255_/_0.35)]">
              <Bookmark className="size-5 fill-current" />
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="member-web-kicker text-[var(--m-accent)]">
                Koleksi ayat
              </p>
              <DialogTitle className="mt-1 text-xl font-bold tracking-tight text-[var(--m-ink)] sm:text-2xl">
                Semua bookmark
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-sm text-[var(--m-ink-soft)]">
                {bookmarks.length === 0
                  ? "Ayat yang kamu tandai akan muncul di sini."
                  : `${bookmarks.length} ayat tersimpan di perangkatmu.`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5 sm:px-6 sm:pb-6">
          {bookmarks.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl bg-[var(--m-wash)]/55 px-5 py-14 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-white shadow-[var(--shadow-float)] ring-1 ring-[var(--m-line)]">
                <Bookmark className="size-6 text-[var(--m-accent)]" />
              </div>
              <p className="mt-4 text-base font-semibold text-[var(--m-ink)]">
                Belum ada bookmark
              </p>
              <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-[var(--m-ink-soft)]">
                Blok teks ayat di Baca Alkitab, lalu ketuk Bookmark untuk
                menyimpannya.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {bookmarks.map((bookmark) => {
                const savedAt = formatSavedAt(bookmark.createdAt);
                return (
                  <li key={bookmark.id}>
                    <article
                      className={cn(
                        "group relative overflow-hidden rounded-2xl bg-white p-4 transition duration-200 sm:p-5",
                        "shadow-[0_2px_12px_oklch(0.35_0.05_255_/_0.06)] ring-1 ring-[var(--m-line)]",
                        "hover:-translate-y-0.5 hover:shadow-[0_12px_28px_oklch(0.35_0.06_255_/_0.12)] hover:ring-[var(--m-accent)]/25",
                      )}
                    >
                      <div
                        className="absolute inset-y-3 left-0 w-1 rounded-full bg-[var(--m-accent)]"
                        aria-hidden
                      />
                      <div className="pl-2.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
                            <p className="text-sm font-bold text-[var(--m-accent)]">
                              {formatBookmarkReference(bookmark)}
                            </p>
                            {savedAt ? (
                              <span className="rounded-full bg-[var(--m-wash)] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                                {savedAt}
                              </span>
                            ) : null}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="size-8 shrink-0 rounded-full text-[var(--m-ink-soft)] opacity-70 transition hover:bg-rose-50 hover:text-rose-600 hover:opacity-100"
                            aria-label="Hapus bookmark"
                            onClick={() => handleDelete(bookmark.id)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                        <p className="member-web-display-italic mt-2.5 w-full text-[0.95rem] leading-relaxed break-words text-[var(--m-ink)] sm:text-base">
                          &ldquo;{previewBookmarkText(bookmark.text)}&rdquo;
                        </p>
                      </div>

                      {onOpenPassage ? (
                        <div className="mt-4 flex pl-2.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-9 gap-1.5 rounded-xl border-[var(--m-line)] bg-[var(--m-wash)]/70 px-3.5 font-semibold text-[var(--m-ink)] hover:border-[var(--m-accent)]/40 hover:bg-[var(--m-wash)] hover:text-[var(--m-accent)]"
                            onClick={() => handleOpen(bookmark)}
                          >
                            <BookOpen className="size-3.5 shrink-0 text-[var(--m-accent)]" />
                            <span>Buka pasal</span>
                          </Button>
                        </div>
                      ) : null}
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

type BookmarksButtonProps = {
  onClick: () => void;
  className?: string;
};

export function BookmarksButton({ onClick, className }: BookmarksButtonProps) {
  const bookmarks = useSyncExternalStore(
    subscribeBibleBookmarks,
    getAllBibleBookmarks,
    getServerBibleBookmarks,
  );
  const count = bookmarks === EMPTY_BOOKMARKS ? 0 : bookmarks.length;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(
        "border-[var(--m-line)] bg-white/90 shadow-[0_1px_2px_oklch(0.35_0.05_255_/_0.04)] hover:border-[var(--m-accent)]/30 hover:bg-[var(--m-wash)]/60",
        className,
      )}
      onClick={onClick}
    >
      <Bookmark className="size-3.5 text-[var(--m-accent)]" />
      Bookmark
      {count > 0 ? (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--m-accent)] px-1.5 text-[10px] font-bold text-white">
          {count}
        </span>
      ) : null}
    </Button>
  );
}
