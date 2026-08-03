"use client";

import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { QuickTooltip } from "@/components/ui/quick-tooltip";
import {
  BIBLE_READING_THEME_OPTIONS,
  getBibleReadingThemeOption,
  getServerBibleReadingTheme,
  readBibleReadingTheme,
  subscribeBibleReadingTheme,
  writeBibleReadingTheme,
  type BibleReadingThemeId,
} from "@/lib/bible-reading-theme";
import { cn } from "@/lib/utils";

type BibleReadingThemeControlProps = {
  className?: string;
};

const SWATCH: Record<BibleReadingThemeId, string> = {
  classic: "border-slate-300 bg-white shadow-[inset_0_-6px_0_0_#e8f0ff]",
  kindle: "border-[#5b4636]/25 bg-[#fbf0d9]",
  night: "border-slate-600 bg-[#1a1d24] shadow-[inset_0_-6px_0_0_#3b82f6]",
};

/** Pilih tema baca: Standar / Kindle / Gelap. */
export function BibleReadingThemeControl({
  className,
}: BibleReadingThemeControlProps) {
  const theme = useSyncExternalStore(
    subscribeBibleReadingTheme,
    readBibleReadingTheme,
    getServerBibleReadingTheme,
  );

  function setTheme(next: BibleReadingThemeId) {
    writeBibleReadingTheme(next);
  }

  return (
    <div
      className={cn(
        "inline-flex h-8 items-center gap-0.5 rounded-lg bg-[var(--m-wash)]/55 p-0.5",
        className,
      )}
      role="group"
      aria-label="Tema tampilan baca"
    >
      {BIBLE_READING_THEME_OPTIONS.map(({ id }) => {
        const option = getBibleReadingThemeOption(id);
        const active = theme === id;
        return (
          <QuickTooltip
            key={id}
            label={`${option.label} · ${option.description}`}
          >
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className={cn(
                "size-7 rounded-md p-0",
                active && "ring-2 ring-[var(--m-accent)] ring-offset-1",
                theme === "night" &&
                  active &&
                  "ring-sky-400 ring-offset-[#1a1d24]",
              )}
              aria-label={option.label}
              aria-pressed={active}
              onClick={() => setTheme(id)}
            >
              <span
                className={cn("block size-4 rounded-full border", SWATCH[id])}
                aria-hidden
              />
              <span className="sr-only">{option.label}</span>
            </Button>
          </QuickTooltip>
        );
      })}
    </div>
  );
}
