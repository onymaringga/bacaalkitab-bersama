"use client";

import type { ReactElement } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type QuickTooltipProps = {
  label: string;
  children: ReactElement;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  /** Default 70ms — cepat tanpa terasa “nempel”. */
  delayDuration?: number;
};

/** Tooltip singkat untuk ikon toolbar (cepat + gaya tegas). */
export function QuickTooltip({
  label,
  children,
  side = "bottom",
  className,
  delayDuration = 70,
}: QuickTooltipProps) {
  if (!label.trim()) return children;

  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={8}
        className={cn(
          "z-[140] border-0 bg-[var(--m-ink,#14233a)] px-2.5 py-1.5",
          "text-[11px] font-semibold tracking-wide text-white shadow-lg",
          "duration-100 animate-in fade-in-0 zoom-in-95",
          className,
        )}
      >
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
