"use client";

import { BookOpen } from "lucide-react";

import { cn } from "@/lib/utils";

type LoadingScreenProps = {
  label?: string;
  hint?: string;
  /** full = full viewport; panel = in-page block; modal = empty page + centered modal */
  variant?: "full" | "panel" | "modal";
  className?: string;
};

export function LoadingScreen({
  label = "Memuat…",
  hint,
  variant = "full",
  className,
}: LoadingScreenProps) {
  if (variant === "modal") {
    return (
      <LoadingModal label={label} hint={hint} className={className} />
    );
  }

  return (
    <div
      className={cn(
        "loading-screen flex flex-col items-center justify-center px-6",
        variant === "full" ? "min-h-dvh" : "min-h-[50dvh] py-16",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="loading-screen-wash" aria-hidden />
      <LoadingContent label={label} hint={hint} />
      <span className="sr-only">{label}</span>
    </div>
  );
}

/** Halaman belakang kosong + loading di modal tengah. */
export function LoadingModal({
  label = "Memuat…",
  hint,
  className,
}: {
  label?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("loading-modal-page min-h-dvh", className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="loading-modal-backdrop" aria-hidden />
      <div className="loading-modal-card">
        <LoadingContent label={label} hint={hint} compact />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}

function LoadingContent({
  label,
  hint,
  compact = false,
}: {
  label: string;
  hint?: string;
  compact?: boolean;
}) {
  return (
    <div className="relative z-10 flex flex-col items-center text-center">
      <div className={cn("loading-orb", compact && "loading-orb-sm")}>
        <span className="loading-orb-ring" aria-hidden />
        <span className="loading-orb-ring loading-orb-ring-delay" aria-hidden />
        <span className="loading-orb-core">
          <BookOpen
            className={cn(compact ? "size-5" : "size-6", "text-white")}
            strokeWidth={2.25}
          />
        </span>
      </div>

      <p className={cn("loading-title", compact ? "mt-4 text-base" : "mt-6")}>
        {label}
      </p>
      {hint ? (
        <p
          className={cn(
            "loading-hint max-w-xs",
            compact ? "mt-1.5 text-[0.8rem]" : "mt-2",
          )}
        >
          {hint}
        </p>
      ) : null}

      <div className={cn("loading-dots", compact ? "mt-4" : "mt-5")} aria-hidden>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export function LoadingSpinner({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "loading-spinner inline-block rounded-full border-2 border-current border-r-transparent",
        size === "sm" ? "size-3.5" : "size-4",
        className,
      )}
      aria-hidden
    />
  );
}
