"use client";

import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";
import { SlidersHorizontal } from "lucide-react";

import { BibleFontSizeControl } from "@/components/bible/bible-font-size-control";
import { BibleReadingThemeControl } from "@/components/bible/bible-reading-theme-control";
import { ReadingSessionTimer } from "@/components/bible/reading-session-timer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ReadingTimeLabel } from "@/components/ui/reading-time-label";
import {
  getServerBibleReadingTheme,
  readBibleReadingTheme,
  subscribeBibleReadingTheme,
} from "@/lib/bible-reading-theme";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

type PassageReaderSettingsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  readingTimeLabel?: string | null;
  reflectionReference: string;
  passageLabel: string;
  viewModeToolbar: ReactNode;
};

/** Pengaturan bacaan — tema, huruf, filter, timer (mobile). */
export function PassageReaderSettingsSheet({
  open,
  onOpenChange,
  readingTimeLabel,
  reflectionReference,
  passageLabel,
  viewModeToolbar,
}: PassageReaderSettingsSheetProps) {
  const readingTheme = useSyncExternalStore(
    subscribeBibleReadingTheme,
    readBibleReadingTheme,
    getServerBibleReadingTheme,
  );
  const isNight = readingTheme === "night";
  const isKindle = readingTheme === "kindle";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton
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
            <SlidersHorizontal className="size-4 opacity-70" />
            {copy.bible.readerSettingsTitle}
          </SheetTitle>
          <SheetDescription
            className={cn(
              "text-xs",
              isNight ? "text-[#a8adb8]" : "text-[var(--m-ink-soft)]",
            )}
          >
            {copy.bible.readerSettingsHint}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-4 sm:px-5">
          {(readingTimeLabel || reflectionReference) && (
            <section className="space-y-2">
              <p
                className={cn(
                  "text-[11px] font-semibold tracking-wide uppercase",
                  isNight ? "text-[#a8adb8]" : "text-[var(--m-ink-soft)]",
                )}
              >
                {copy.bible.readerSettingsTime}
              </p>
              <div
                className={cn(
                  "flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2.5",
                  isNight
                    ? "border-white/10 bg-white/5"
                    : isKindle
                      ? "border-[#5b4636]/15 bg-[#f3e4c4]/50"
                      : "border-[var(--m-line)] bg-[var(--m-wash)]/40",
                )}
              >
                {readingTimeLabel ? (
                  <ReadingTimeLabel
                    label={readingTimeLabel}
                    className="text-xs"
                  />
                ) : null}
                <ReadingSessionTimer
                  passage={reflectionReference}
                  passageLabel={passageLabel}
                  className="text-xs"
                />
              </div>
            </section>
          )}

          <section className="space-y-2">
            <p
              className={cn(
                "text-[11px] font-semibold tracking-wide uppercase",
                isNight ? "text-[#a8adb8]" : "text-[var(--m-ink-soft)]",
              )}
            >
              {copy.bible.readerSettingsDisplay}
            </p>
            <div
              className={cn(
                "flex flex-wrap items-center gap-3 rounded-xl border px-3 py-2.5",
                isNight
                  ? "border-white/10 bg-white/5"
                  : isKindle
                    ? "border-[#5b4636]/15 bg-[#f3e4c4]/50"
                    : "border-[var(--m-line)] bg-[var(--m-wash)]/40",
              )}
            >
              <BibleReadingThemeControl />
              <BibleFontSizeControl className="border-0 bg-transparent p-0 shadow-none" />
            </div>
          </section>

          <section className="space-y-2">
            <p
              className={cn(
                "text-[11px] font-semibold tracking-wide uppercase",
                isNight ? "text-[#a8adb8]" : "text-[var(--m-ink-soft)]",
              )}
            >
              {copy.bible.readerSettingsFilter}
            </p>
            <div
              className={cn(
                "rounded-xl border px-2 py-2",
                isNight
                  ? "border-white/10 bg-white/5"
                  : isKindle
                    ? "border-[#5b4636]/15 bg-[#f3e4c4]/50"
                    : "border-[var(--m-line)] bg-[var(--m-wash)]/40",
              )}
            >
              {viewModeToolbar}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
