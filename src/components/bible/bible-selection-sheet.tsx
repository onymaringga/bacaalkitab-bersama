"use client";

import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";
import { Highlighter } from "lucide-react";

import { BibleFontSizeControl } from "@/components/bible/bible-font-size-control";
import { BibleReadingThemeControl } from "@/components/bible/bible-reading-theme-control";
import {
  HighlightToolbar,
  type HighlightToolbarState,
} from "@/components/bible/highlight-toolbar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { HighlightColorId } from "@/lib/bible-highlights";
import {
  getServerBibleReadingTheme,
  readBibleReadingTheme,
  subscribeBibleReadingTheme,
} from "@/lib/bible-reading-theme";
import { cn } from "@/lib/utils";

type BibleSelectionSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state: HighlightToolbarState;
  canRemove?: boolean;
  onPickColor: (color: HighlightColorId) => void;
  onRemove: () => void;
  onBookmark?: () => void;
  onCopy?: () => void;
  onCompare?: () => void;
  onStudy?: () => void;
  onAddNote?: () => void;
  onClose: () => void;
  onInteract?: () => void;
  /** Toolbar tampilan (view mode / fullscreen) dari parent. */
  viewModeToolbar?: ReactNode;
};

/** Bottom sheet aksi teks — mobile: highlight + ukuran huruf + tampilan. */
export function BibleSelectionSheet({
  open,
  onOpenChange,
  state,
  canRemove = false,
  onPickColor,
  onRemove,
  onBookmark,
  onCopy,
  onCompare,
  onStudy,
  onAddNote,
  onClose,
  onInteract,
  viewModeToolbar,
}: BibleSelectionSheetProps) {
  const readingTheme = useSyncExternalStore(
    subscribeBibleReadingTheme,
    readBibleReadingTheme,
    getServerBibleReadingTheme,
  );
  const isNight = readingTheme === "night";
  const isKindle = readingTheme === "kindle";

  const preview =
    state.selectedText.length > 90
      ? `${state.selectedText.slice(0, 90)}…`
      : state.selectedText;

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) onClose();
      }}
    >
      <SheetContent
        side="bottom"
        showCloseButton
        data-highlight-toolbar
        data-bible-selection-sheet=""
        data-bible-read-theme={readingTheme}
        className={cn(
          "gap-0 rounded-t-[1.35rem] border p-0",
          "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
          "max-h-[min(82dvh,36rem)] overflow-y-auto overscroll-contain",
          isNight
            ? "border-white/10 bg-[#171a21] text-[#e8eaef]"
            : isKindle
              ? "border-[#5b4636]/20 bg-[#fbf0d9] text-[#3b2f2a]"
              : "border-[var(--m-line)] bg-white text-[var(--m-ink)]",
        )}
        onPointerDown={() => onInteract?.()}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
      >
        <div
          className={cn(
            "mx-auto mt-2 h-1 w-9 shrink-0 rounded-full",
            isNight ? "bg-white/25" : "bg-[var(--m-line)]",
          )}
        />

        <SheetHeader className="gap-1 px-4 pt-2.5 pr-12 pb-3 text-left sm:px-5">
          <SheetTitle
            className={cn(
              "flex items-center gap-1.5 text-[0.95rem] font-semibold",
              isNight ? "text-[#e8eaef]" : "text-[var(--m-ink)]",
            )}
          >
            <Highlighter
              className={cn(
                "size-4 shrink-0",
                isNight ? "text-sky-300" : "text-[var(--m-accent)]",
              )}
            />
            Teks dipilih
          </SheetTitle>
          <SheetDescription
            className={cn(
              "line-clamp-2 text-[12px] leading-snug",
              isNight ? "text-[#9aa3b5]" : "text-[var(--m-ink-soft)]",
            )}
          >
            “{preview}”
            {state.verseCount > 1 ? ` · ${state.verseCount} ayat` : null}
          </SheetDescription>
        </SheetHeader>

        <div
          className={cn(
            "space-y-3.5 px-4 pb-3 sm:px-5",
            isNight ? "border-t border-white/10" : "border-t border-[var(--m-line)]/70",
          )}
        >
          <section className="space-y-1.5 pt-3.5">
            <p
              className={cn(
                "text-[10px] font-semibold tracking-[0.14em] uppercase",
                isNight ? "text-[#9aa3b5]" : "text-[var(--m-ink-soft)]",
              )}
            >
              Ukuran huruf
            </p>
            <BibleFontSizeControl
              className={cn(
                "h-10 w-full justify-between rounded-xl border px-0.5 shadow-none",
                isNight
                  ? "border-white/10 bg-white/5"
                  : "border-[var(--m-line)] bg-[var(--m-wash)]/45",
              )}
            />
          </section>

          <section className="space-y-1.5">
            <p
              className={cn(
                "text-[10px] font-semibold tracking-[0.14em] uppercase",
                isNight ? "text-[#9aa3b5]" : "text-[var(--m-ink-soft)]",
              )}
            >
              Tampilan
            </p>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
              <div className="min-w-0 overflow-x-auto">
                {viewModeToolbar}
              </div>
              <BibleReadingThemeControl
                className={cn(
                  "h-10 shrink-0 rounded-xl border p-1",
                  isNight
                    ? "border-white/10 bg-white/5"
                    : "border-[var(--m-line)] bg-[var(--m-wash)]/45",
                )}
              />
            </div>
          </section>

          <HighlightToolbar
            variant="plain"
            state={state}
            canRemove={canRemove}
            onPickColor={onPickColor}
            onBookmark={onBookmark}
            onCopy={onCopy}
            onCompare={onCompare}
            onStudy={onStudy}
            onAddNote={onAddNote}
            onRemove={onRemove}
            onClose={onClose}
            onInteract={onInteract}
            dense
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
