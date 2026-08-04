"use client";

import { cn } from "@/lib/utils";

type PassageReadingProgressBarProps = {
  percent: number;
  visible?: boolean;
  className?: string;
};

/** Garis progress tipis — gaya app Alkitab mobile. */
export function PassageReadingProgressBar({
  percent,
  visible = true,
  className,
}: PassageReadingProgressBarProps) {
  if (!visible || percent < 1) return null;

  return (
    <div
      className={cn(
        "h-0.5 w-full overflow-hidden rounded-full bg-[var(--m-line)]/80",
        className,
      )}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${percent} persen ayat dibaca`}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-300 ease-out",
          percent >= 100 ? "bg-emerald-500" : "bg-[var(--m-accent)]",
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
