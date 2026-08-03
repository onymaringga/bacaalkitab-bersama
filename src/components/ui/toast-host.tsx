"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Info } from "lucide-react";

import { cn } from "@/lib/utils";

type ToastVariant = "success" | "info";

type ToastPayload = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ShowToastOptions = {
  durationMs?: number;
  /** success = hijau (default), info = biru + ikon information */
  variant?: ToastVariant | "default";
};

type ToastEvent = ToastPayload | { clearId: number } | null;

let toastId = 0;
const listeners = new Set<(event: ToastEvent) => void>();

export function showToast(message: string, options?: ShowToastOptions) {
  const id = ++toastId;
  const raw = options?.variant ?? "success";
  const variant: ToastVariant = raw === "info" ? "info" : "success";
  const payload: ToastPayload = { id, message, variant };
  const duration = options?.durationMs ?? 2400;
  listeners.forEach((listener) => listener(payload));
  window.setTimeout(() => {
    listeners.forEach((listener) => listener({ clearId: id }));
  }, duration);
}

export function ToastHost() {
  const [toast, setToast] = useState<ToastPayload | null>(null);

  useEffect(() => {
    const listener = (event: ToastEvent) => {
      if (event === null) {
        setToast(null);
        return;
      }
      if ("clearId" in event) {
        setToast((current) =>
          current?.id === event.clearId ? null : current,
        );
        return;
      }
      setToast(event);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (!toast) return null;

  const isInfo = toast.variant === "info";

  return (
    <div
      className="pointer-events-none fixed right-0 bottom-24 z-[100] flex justify-end px-4 lg:right-6 lg:bottom-8"
      role="status"
    >
      <div
        className={cn(
          "pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg animate-in fade-in-0 slide-in-from-bottom-2 duration-200",
          isInfo
            ? "border border-sky-700/20 bg-sky-600"
            : "border border-emerald-600/20 bg-emerald-600",
        )}
      >
        {isInfo ? (
          <Info className="size-4 shrink-0" aria-hidden />
        ) : (
          <CheckCircle2 className="size-4 shrink-0" aria-hidden />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
