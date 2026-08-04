"use client";

import { Bookmark, BookHeart, BookOpenText, Copy, Eraser, Highlighter, Languages, StickyNote, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuickTooltip } from "@/components/ui/quick-tooltip";
import {
  HIGHLIGHT_COLORS,
  type HighlightColorId,
} from "@/lib/bible-highlights";
import type { HighlightRange } from "@/lib/bible-highlight-selection";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

export type { HighlightRange };

export const HIGHLIGHT_TOOLBAR_SLOT_ID = "bible-highlight-toolbar-slot";

export type HighlightToolbarState = {
  ranges: HighlightRange[];
  selectedText: string;
  verseCount: number;
};

type HighlightToolbarProps = {
  state: HighlightToolbarState;
  onPickColor: (color: HighlightColorId) => void;
  onRemove: () => void;
  onBookmark?: () => void;
  onCopy?: () => void;
  onCompare?: () => void;
  onStudy?: () => void;
  onAddNote?: () => void;
  onAddToJournal?: () => void;
  onClose: () => void;
  /** Dipanggil saat user menyentuh toolbar agar selection tidak langsung dibersihkan. */
  onInteract?: () => void;
  /** True jika seleksi menutupi highlight yang sudah ada. */
  canRemove?: boolean;
  /** card = panel samping; plain = isi untuk bottom sheet. */
  variant?: "card" | "plain";
  /** Rapikan spacing untuk mobile sheet. */
  dense?: boolean;
  className?: string;
};

export function HighlightToolbar({
  state,
  onPickColor,
  onRemove,
  onBookmark,
  onCopy,
  onCompare,
  onStudy,
  onAddNote,
  onAddToJournal,
  onClose,
  onInteract,
  canRemove = false,
  variant = "card",
  dense = false,
  className,
}: HighlightToolbarProps) {
  const preview =
    state.selectedText.length > 64
      ? `${state.selectedText.slice(0, 64)}…`
      : state.selectedText;
  const plain = variant === "plain";

  const secondaryActions = [
    onAddToJournal
      ? {
          key: "journal",
          label: copy.journal.addToJournal,
          icon: BookHeart,
          onClick: onAddToJournal,
        }
      : null,
    onAddNote
      ? {
          key: "note",
          label: "Catatan",
          icon: StickyNote,
          onClick: onAddNote,
        }
      : null,
    onStudy
      ? {
          key: "study",
          label: "Terkait",
          icon: BookOpenText,
          onClick: onStudy,
        }
      : null,
    onCompare
      ? {
          key: "compare",
          label: "Bandingkan",
          icon: Languages,
          onClick: onCompare,
        }
      : null,
    onCopy
      ? {
          key: "copy",
          label: "Salin",
          icon: Copy,
          onClick: onCopy,
        }
      : null,
    onBookmark
      ? {
          key: "bookmark",
          label: "Bookmark",
          icon: Bookmark,
          onClick: onBookmark,
        }
      : null,
  ].filter(Boolean) as {
    key: string;
    label: string;
    icon: typeof Copy;
    onClick: () => void;
  }[];

  const sectionLabelClass = cn(
    "font-semibold tracking-[0.14em] uppercase text-[var(--m-ink-soft)]",
    dense ? "text-[10px]" : "text-[11px]",
  );

  const body = (
    <>
      {!plain ? (
        <div className="flex items-start justify-between gap-2 border-b border-[var(--m-line)]/70 px-3.5 py-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--m-ink)]">
              <Highlighter className="size-3.5 shrink-0 text-[var(--m-accent)]" />
              Teks dipilih
            </p>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--m-ink-soft)]">
              “{preview}”
              {state.verseCount > 1 ? (
                <span className="font-medium text-[var(--m-ink)]/70">
                  {" "}
                  · {state.verseCount} ayat
                </span>
              ) : null}
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
      ) : null}

      {plain && secondaryActions.length > 0 ? (
        <div className={cn(dense ? "space-y-1.5 pb-3" : "space-y-2 pb-3")}>
          <p className={sectionLabelClass}>Aksi</p>
          <div className="grid grid-cols-2 gap-2">
            {secondaryActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.key}
                  type="button"
                  variant="outline"
                  className="h-11 justify-start gap-2.5 rounded-xl border-[var(--m-line)] bg-[var(--m-wash)]/35 px-3 font-semibold text-[var(--m-ink)]"
                  aria-label={action.label}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onInteract?.();
                    action.onClick();
                  }}
                >
                  <Icon className="size-4 shrink-0 text-[var(--m-accent)]" />
                  <span className="truncate text-[13px]">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          plain ? "px-0" : "px-3.5",
          dense ? "space-y-1.5 py-0" : "space-y-2 py-3",
          plain && !dense && "py-0",
          plain && secondaryActions.length > 0 && "border-t border-[var(--m-line)]/70 pt-3",
        )}
      >
        <p className={sectionLabelClass}>Highlight</p>
        <div
          className={cn(
            "flex flex-wrap items-center",
            dense ? "gap-2" : "gap-2.5",
          )}
        >
          {HIGHLIGHT_COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              title={color.label}
              aria-label={`Highlight ${color.label}`}
              onPointerDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onInteract?.();
                onPickColor(color.id);
              }}
              className={cn(
                "rounded-full shadow-sm ring-2 ring-offset-2 transition hover:scale-105 active:scale-95",
                dense ? "size-8" : "size-9",
                color.swatchClass,
                "ring-transparent hover:ring-[var(--m-line)]",
              )}
            />
          ))}
        </div>
      </div>

      {!plain && secondaryActions.length > 0 ? (
        <div
          className={cn(
            dense ? "space-y-1.5 pt-3" : "space-y-2",
            "border-t border-[var(--m-line)]/70 px-3.5 py-3",
          )}
        >
          <p className={sectionLabelClass}>Aksi</p>
          <div className="flex items-center gap-1.5">
            {secondaryActions.map((action) => {
              const Icon = action.icon;
              return (
                <QuickTooltip key={action.key} label={action.label}>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    className="size-10 rounded-xl border-[var(--m-line)] bg-[var(--m-wash)]/40"
                    aria-label={action.label}
                    onPointerDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onInteract?.();
                      action.onClick();
                    }}
                  >
                    <Icon className="size-4" />
                  </Button>
                </QuickTooltip>
              );
            })}
          </div>
        </div>
      ) : null}

      {canRemove ? (
        <div
          className={cn(
            plain
              ? "border-t border-[var(--m-line)]/70"
              : "border-t border-[var(--m-line)]/70 px-3.5 py-2.5",
            dense ? "pt-2.5" : plain ? "pt-2.5" : "",
          )}
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 w-full gap-1.5 rounded-xl font-semibold text-destructive hover:bg-destructive/8 hover:text-destructive"
            onPointerDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onInteract?.();
              onRemove();
            }}
          >
            <Eraser className="size-3.5" />
            Hapus highlight
          </Button>
        </div>
      ) : null}
    </>
  );

  return (
    <div
      data-highlight-toolbar
      className={cn("w-full", className)}
      role="toolbar"
      aria-label="Aksi teks"
      onPointerDown={() => {
        onInteract?.();
      }}
      onMouseDown={(event) => {
        event.preventDefault();
        onInteract?.();
      }}
    >
      {plain ? (
        <div className={cn(dense ? "space-y-0" : "space-y-3")}>{body}</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white shadow-[var(--shadow-soft)]">
          {body}
        </div>
      )}
    </div>
  );
}
