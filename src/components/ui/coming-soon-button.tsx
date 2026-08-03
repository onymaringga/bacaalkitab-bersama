"use client";

import { useState, type ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

type ComingSoonButtonProps = ComponentProps<typeof Button> & {
  label?: string;
};

export function ComingSoonButton({
  children,
  className,
  label = copy.common.comingSoon,
  onClick,
  ...props
}: ComingSoonButtonProps) {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        className={cn("opacity-70", className)}
        aria-disabled
        onClick={(event) => {
          event.preventDefault();
          setShowHint(true);
          window.setTimeout(() => setShowHint(false), 2200);
          onClick?.(event);
        }}
        {...props}
      >
        {children}
        <span className="ml-1 text-[10px] font-normal text-muted-foreground">
          ({label})
        </span>
      </Button>
      {showHint ? (
        <p className="absolute left-0 top-full z-10 mt-1 rounded-md bg-foreground px-2 py-1 text-[11px] text-background shadow-md">
          {copy.common.comingSoonHint}
        </p>
      ) : null}
    </div>
  );
}
