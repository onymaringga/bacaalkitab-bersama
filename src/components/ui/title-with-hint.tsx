"use client";

import { InfoTooltip } from "@/components/ui/info-tooltip";
import { cn } from "@/lib/utils";

type TitleWithHintProps = {
  title: string;
  hint?: string;
  className?: string;
  titleClassName?: string;
};

export function TitleWithHint({
  title,
  hint,
  className,
  titleClassName,
}: TitleWithHintProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className={cn("font-semibold leading-snug", titleClassName)}>{title}</span>
      {hint ? <InfoTooltip content={hint} /> : null}
    </div>
  );
}
