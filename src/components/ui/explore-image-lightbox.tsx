"use client";

import { useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Maximize2, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

type ExploreImageLightboxProps = {
  previewSrc: string;
  fullSrc: string;
  alt: string;
  title: string;
  className?: string;
  previewClassName?: string;
  onPreviewError?: () => void;
  loading?: "eager" | "lazy";
  overlay?: React.ReactNode;
};

export function ExploreImageLightbox({
  previewSrc,
  fullSrc,
  alt,
  title,
  className,
  previewClassName,
  onPreviewError,
  loading = "eager",
  overlay,
}: ExploreImageLightboxProps) {
  const [open, setOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(fullSrc);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setLightboxSrc(fullSrc);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "group relative block w-full cursor-zoom-in overflow-hidden text-left",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-accent)] focus-visible:ring-offset-2",
            className,
          )}
          aria-label={copy.explore.viewFullImageHint}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewSrc}
            alt={alt}
            className={previewClassName}
            onError={onPreviewError}
            loading={loading}
            decoding="async"
          />
          {overlay}
          <span
            className={cn(
              "absolute right-2.5 bottom-2.5 z-10 inline-flex items-center gap-1 rounded-full",
              "bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm",
              "transition group-hover:bg-black/70 group-focus-visible:bg-black/70",
            )}
          >
            <Maximize2 className="size-3" aria-hidden />
            {copy.explore.viewFullImage}
          </span>
        </button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="bg-black/85 supports-backdrop-filter:backdrop-blur-sm" />
        <DialogPrimitive.Content
          data-slot="dialog-content"
          className={cn(
            "fixed top-1/2 left-1/2 z-50 flex max-h-[min(92dvh,100%)] w-full max-w-[min(calc(100vw-1.5rem),56rem)] -translate-x-1/2 -translate-y-1/2",
            "items-center justify-center outline-none duration-100",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          )}
        >
          <DialogTitle className="sr-only">
            {copy.explore.viewFullImage}: {title}
          </DialogTitle>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxSrc}
            alt={alt}
            className="max-h-[85dvh] w-full object-contain"
            onError={() => {
              if (lightboxSrc !== previewSrc) {
                setLightboxSrc(previewSrc);
              }
            }}
          />
          <DialogPrimitive.Close data-slot="dialog-close" asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-2 right-2 text-white/90 hover:bg-white/10 hover:text-white"
            >
              <XIcon />
              <span className="sr-only">{copy.explore.closeFullImage}</span>
            </Button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
