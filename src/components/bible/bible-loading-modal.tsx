"use client";

import { BookOpen, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type BibleLoadingModalProps = {
  open: boolean;
  passageLabel?: string | null;
};

export function BibleLoadingModal({
  open,
  passageLabel,
}: BibleLoadingModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden p-0 sm:max-w-sm"
        onPointerDownOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Memuat Alkitab</DialogTitle>
          <DialogDescription>
            Sedang memuat teks ayat Alkitab.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center px-6 py-8 text-center">
          <div className="relative flex size-14 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-[var(--m-accent)]/15" />
            <span className="relative flex size-14 items-center justify-center rounded-full bg-[var(--m-wash)] text-[var(--m-accent)] ring-1 ring-[var(--m-line)]">
              <BookOpen className="size-6" />
            </span>
          </div>

          <p className="mt-5 text-base font-semibold text-[var(--m-ink)]">
            Memuat Alkitab…
          </p>
          {passageLabel ? (
            <p className="mt-1 text-sm font-medium text-[var(--m-accent)]">
              {passageLabel}
            </p>
          ) : null}
          <p className="mt-2 max-w-[16rem] text-xs leading-relaxed text-[var(--m-ink-soft)]">
            Mengambil teks pasal. Mohon tunggu sebentar.
          </p>

          <Loader2 className="mt-5 size-5 animate-spin text-[var(--m-accent)]" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
