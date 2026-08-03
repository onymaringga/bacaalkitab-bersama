"use client";

import { useState, type ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-screen";
import { showToast } from "@/components/ui/toast-host";
import { cn } from "@/lib/utils";

type DemoActionButtonProps = ComponentProps<typeof Button> & {
  successMessage?: string;
  onAction?: () => void | Promise<void>;
};

/** Tombol yang benar-benar merespons klik (demo success + toast). */
export function DemoActionButton({
  children,
  className,
  successMessage = "Berhasil disimpan",
  onAction,
  onClick,
  ...props
}: DemoActionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <Button
      type="button"
      className={cn(className)}
      disabled={loading || props.disabled}
      onClick={async (event) => {
        onClick?.(event);
        setLoading(true);
        try {
          await onAction?.();
          setDone(true);
          showToast(successMessage);
          window.setTimeout(() => setDone(false), 2000);
        } finally {
          setLoading(false);
        }
      }}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" />
          Memproses…
        </>
      ) : done ? (
        "Berhasil"
      ) : (
        children
      )}
    </Button>
  );
}
