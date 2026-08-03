"use client";

import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/components/ui/toast-host";
import { copy } from "@/lib/copy";
import { saveMyReflectionMessage } from "@/lib/group-reflection-chat";

type WriteReflectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  passage: string;
  onSaved?: () => void;
};

const MAX_LEN = 1000;

export function WriteReflectionDialog({
  open,
  onOpenChange,
  passage,
  onSaved,
}: WriteReflectionDialogProps) {
  const [reflection, setReflection] = useState("");

  useEffect(() => {
    if (!open) setReflection("");
  }, [open]);

  function handleSave() {
    const content = reflection.trim();
    if (!content) return;

    saveMyReflectionMessage({
      content,
      passage,
      shareToGroup: true,
    });
    showToast("Refleksi tersimpan · chat kelompok terbuka");
    onSaved?.();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="gap-0 overflow-hidden rounded-2xl p-0 w-[calc(100%-1.5rem)] max-w-lg sm:max-w-xl"
      >
        <div className="px-5 pt-5 pb-5 sm:px-7 sm:pt-7 sm:pb-6">
          <DialogHeader className="gap-0 pr-7 text-left">
            <div className="flex items-start gap-3.5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--m-wash)] text-[var(--m-accent)]">
                <CheckCircle2 className="size-5" strokeWidth={2.25} />
              </div>
              <div className="min-w-0 space-y-1">
                <DialogTitle className="text-lg font-semibold tracking-tight text-[var(--m-ink)] sm:text-xl">
                  {copy.bible.confirmTitle}
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-[var(--m-ink-soft)] sm:text-[0.95rem]">
                  Tulis refleksi singkat dari bacaanmu.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-5 space-y-3.5">
            <p className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-[var(--m-wash)] px-3 py-1.5 text-sm font-semibold text-[var(--m-ink)]">
              <BookOpen className="size-3.5 shrink-0 text-[var(--m-accent)]" />
              <span className="truncate">{passage}</span>
            </p>

            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <label className="text-sm font-medium text-[var(--m-ink)]">
                  Refleksi
                </label>
                <span className="text-[11px] tabular-nums text-[var(--m-ink-soft)]">
                  {reflection.length}/{MAX_LEN}
                </span>
              </div>
              <Textarea
                value={reflection}
                onChange={(event) =>
                  setReflection(event.target.value.slice(0, MAX_LEN))
                }
                placeholder={copy.notes.placeholder}
                className="min-h-[14rem] resize-y rounded-xl border-[var(--m-line)] bg-[var(--m-paper)] text-base leading-relaxed shadow-none focus-visible:ring-[var(--m-accent)]/30 sm:min-h-[16rem]"
                autoFocus
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2.5 border-t border-[var(--m-line)] bg-[var(--m-wash)]/35 px-5 py-4 sm:px-7">
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1 rounded-xl font-semibold"
            onClick={() => onOpenChange(false)}
          >
            {copy.bible.confirmCancel}
          </Button>
          <Button
            type="button"
            className="h-11 flex-[1.35] rounded-xl font-semibold"
            disabled={!reflection.trim()}
            onClick={handleSave}
          >
            <CheckCircle2 className="size-4" />
            Simpan refleksi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
