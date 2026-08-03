"use client";

import { Bookmark, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  formatBookmarkReference,
  type BibleBookmark,
} from "@/lib/bible-bookmarks";

type BookmarkManageBarProps = {
  bookmarks: BibleBookmark[];
  onRemove: () => void;
  onClose: () => void;
  onInteract?: () => void;
};

/** Panel aksi saat ikon bookmark di ayat diklik. */
export function BookmarkManageBar({
  bookmarks,
  onRemove,
  onClose,
  onInteract,
}: BookmarkManageBarProps) {
  const primary = bookmarks[0];
  if (!primary) return null;

  const preview =
    primary.text.length > 56
      ? `${primary.text.slice(0, 56)}…`
      : primary.text;

  return (
    <div
      data-highlight-toolbar
      data-bookmark-manage
      className="fixed inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[90] px-3 pb-2 pt-2 lg:bottom-6"
      role="dialog"
      aria-label="Kelola bookmark"
      onPointerDown={() => {
        onInteract?.();
      }}
      onMouseDown={(event) => {
        event.preventDefault();
        onInteract?.();
      }}
    >
      <div className="mx-auto max-w-xl rounded-2xl border border-[var(--m-line)] bg-white/95 p-3 shadow-[var(--shadow-float)] backdrop-blur-sm">
        <div className="mb-2.5 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--m-ink)]">
              <Bookmark className="size-3.5 shrink-0 fill-amber-500 text-amber-500" />
              Bookmark tersimpan
            </p>
            <p className="mt-0.5 text-xs font-medium text-amber-700">
              {formatBookmarkReference(primary)}
              {bookmarks.length > 1 ? ` · ${bookmarks.length} bookmark` : ""}
            </p>
            <p className="mt-0.5 truncate text-xs text-[var(--m-ink-soft)]">
              “{preview}”
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-7 shrink-0 rounded-full"
            onClick={onClose}
            aria-label="Tutup"
          >
            <X className="size-3.5" />
          </Button>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-full"
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 rounded-full border-[var(--status-danger-text)]/25 text-[var(--status-danger-text)] hover:bg-[var(--status-danger-bg)]"
            onPointerDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onInteract?.();
              onRemove();
            }}
          >
            <Trash2 className="size-3.5" />
            Hapus bookmark
          </Button>
        </div>
      </div>
    </div>
  );
}
