"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

type HistoryBackButtonProps = {
  /** Dipakai jika tidak ada riwayat halaman sebelumnya di app. */
  fallbackHref?: string;
  label?: string;
  /** Hanya ikon chevron (untuk header ringkas). */
  iconOnly?: boolean;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "ghost" | "outline" | "link" | "default" | "secondary" | "destructive";
};

function canUseHistoryBack() {
  if (typeof window === "undefined") return false;
  try {
    if (window.history.length > 1) {
      const ref = document.referrer;
      if (!ref) return true;
      return new URL(ref).origin === window.location.origin;
    }
  } catch {
    /* ignore */
  }
  return false;
}

export function HistoryBackButton({
  fallbackHref = "/dashboard",
  label = copy.common.back,
  iconOnly = false,
  className,
  size = "icon",
  variant = "ghost",
}: HistoryBackButtonProps) {
  const router = useRouter();

  function handleBack() {
    if (canUseHistoryBack()) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  }

  if (iconOnly || size === "icon") {
    return (
      <Button
        type="button"
        variant={variant}
        size="icon"
        className={cn("size-9 shrink-0", className)}
        onClick={handleBack}
        aria-label={label}
      >
        <ChevronLeft className="size-5" />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn("inline-flex items-center gap-1.5", className)}
      onClick={handleBack}
    >
      <ChevronLeft className="size-4 shrink-0" />
      {label}
    </Button>
  );
}
