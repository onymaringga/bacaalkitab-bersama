"use client";

import { useSyncExternalStore } from "react";
import { ALargeSmall, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuickTooltip } from "@/components/ui/quick-tooltip";
import {
  getBibleFontSizeOption,
  getServerBibleFontSize,
  readBibleFontSize,
  stepBibleFontSize,
  subscribeBibleFontSize,
  writeBibleFontSize,
  type BibleFontSizeId,
} from "@/lib/bible-font-size";
import { cn } from "@/lib/utils";

type BibleFontSizeControlProps = {
  className?: string;
  /** Compact for toolbar next to version picker. */
  compact?: boolean;
  /** Hanya ikon − / AA / + (toolbar rapat). */
  iconOnly?: boolean;
};

/** Kontrol A− / A+ untuk memperbesar teks ayat (ramah lansia). */
export function BibleFontSizeControl({
  className,
  compact = false,
  iconOnly = false,
}: BibleFontSizeControlProps) {
  const size = useSyncExternalStore(
    subscribeBibleFontSize,
    readBibleFontSize,
    getServerBibleFontSize,
  );
  const option = getBibleFontSizeOption(size);
  const index = ["sm", "md", "lg", "xl", "xxl"].indexOf(size);
  const atMin = index <= 0;
  const atMax = index >= 4;

  function setSize(next: BibleFontSizeId) {
    writeBibleFontSize(next);
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-xl border border-[var(--m-line)] bg-white p-0.5",
        iconOnly || compact ? "h-8" : "h-10",
        className,
      )}
      role="group"
      aria-label="Ukuran huruf Alkitab"
    >
      <QuickTooltip label="Perkecil huruf">
        <span className="inline-flex">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(
              "shrink-0 rounded-lg text-[var(--m-ink)]",
              iconOnly || compact ? "size-7" : "size-9",
            )}
            disabled={atMin}
            aria-label="Perkecil huruf"
            onClick={() => setSize(stepBibleFontSize(size, -1))}
          >
            <Minus className="size-3.5" />
          </Button>
        </span>
      </QuickTooltip>

      <QuickTooltip label={`Ukuran: ${option.label}`}>
        <div
          className={cn(
            "flex items-center justify-center gap-1 px-1",
            iconOnly
              ? "min-w-7"
              : compact
                ? "min-w-[4.75rem]"
                : "min-w-[7rem] gap-1.5 px-1.5",
          )}
        >
          <ALargeSmall
            className={cn(
              "shrink-0 text-[var(--m-accent)]",
              iconOnly || compact ? "size-3" : "size-3.5",
            )}
            aria-hidden
          />
          {!iconOnly ? (
            <span className="truncate text-xs font-semibold text-[var(--m-ink)]">
              {option.label}
            </span>
          ) : (
            <span className="sr-only">{option.label}</span>
          )}
        </div>
      </QuickTooltip>

      <QuickTooltip label="Perbesar huruf">
        <span className="inline-flex">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(
              "shrink-0 rounded-lg text-[var(--m-ink)]",
              iconOnly || compact ? "size-7" : "size-9",
            )}
            disabled={atMax}
            aria-label="Perbesar huruf"
            onClick={() => setSize(stepBibleFontSize(size, 1))}
          >
            <Plus className="size-3.5" />
          </Button>
        </span>
      </QuickTooltip>
    </div>
  );
}
