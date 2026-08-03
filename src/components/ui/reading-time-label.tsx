import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";

type ReadingTimeLabelProps = {
  label: string;
  className?: string;
  /** Kontras tinggi untuk hero gelap. */
  tone?: "default" | "onDark";
};

/** Label estimasi baca gaya Medium. */
export function ReadingTimeLabel({
  label,
  className,
  tone = "default",
}: ReadingTimeLabelProps) {
  if (!label) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium tabular-nums",
        tone === "onDark" ? "text-white/70" : "text-[var(--m-ink-soft)]",
        className,
      )}
    >
      <Clock className="size-3 shrink-0 opacity-80" aria-hidden />
      <span>{label}</span>
    </span>
  );
}
