"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { showToast } from "@/components/ui/toast-host";
import { celebrateReadingComplete } from "@/lib/browser-notifications";
import {
  isPassageComplete,
  markPassageComplete,
  subscribeCompletedChapters,
  unmarkPassageComplete,
} from "@/lib/bible-completed-chapters";
import {
  readChapterNote,
  subscribeChapterNotes,
} from "@/lib/bible-chapter-notes";
import {
  isDateComplete,
  markDateComplete,
  markDateIncomplete,
} from "@/lib/reading-progress";
import { subscribeScheduleProgress } from "@/lib/schedule-progress-stats";
import { cn } from "@/lib/utils";

type MarkChapterCompleteButtonProps = {
  passage: string;
  /** Tanggal jadwal terkait — biar status selaras dengan panel tanggal. */
  dateKey?: string;
  /** Reference used for refleksi diri notes (defaults to passage) */
  reflectionReference?: string;
  className?: string;
  /** Compact for header next to chapter title */
  compact?: boolean;
  /** Called when user tries to complete without refleksi — e.g. switch to refleksi tab */
  onRequireReflection?: () => void;
};

function hasReflection(reference: string) {
  return Boolean(readChapterNote(reference)?.content?.trim());
}

function subscribeCompletion(onChange: () => void) {
  const unsubChapters = subscribeCompletedChapters(onChange);
  const unsubDates = subscribeScheduleProgress(onChange);
  return () => {
    unsubChapters();
    unsubDates();
  };
}

function isReadingMarkedComplete(passage: string, dateKey?: string) {
  if (isPassageComplete(passage)) return true;
  if (dateKey && isDateComplete(dateKey)) return true;
  return false;
}

export function MarkChapterCompleteButton({
  passage,
  dateKey,
  reflectionReference,
  className,
  compact = false,
  onRequireReflection,
}: MarkChapterCompleteButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const noteKey = reflectionReference || passage;
  const completed = useSyncExternalStore(
    subscribeCompletion,
    () => isReadingMarkedComplete(passage, dateKey),
    () => false,
  );
  const reflectionReady = useSyncExternalStore(
    subscribeChapterNotes,
    () => hasReflection(noteKey),
    () => false,
  );

  // Samakan dua sumber status (tanggal jadwal ↔ pasal) saat membuka bacaan.
  useEffect(() => {
    if (!dateKey || !passage || passage === "Belum dijadwalkan") return;
    const dateDone = isDateComplete(dateKey);
    const chapterDone = isPassageComplete(passage);
    if (dateDone && !chapterDone) markPassageComplete(passage);
    if (chapterDone && !dateDone) markDateComplete(dateKey);
  }, [dateKey, passage]);

  function confirmUnmark() {
    unmarkPassageComplete(passage);
    if (dateKey) markDateIncomplete(dateKey);
    setConfirmOpen(false);
    showToast("Tanda selesai pasal dibatalkan");
  }

  function handleToggle() {
    if (completed) {
      setConfirmOpen(true);
      return;
    }

    if (!hasReflection(noteKey)) {
      showToast("Tulis refleksi diri dulu sebelum menandai selesai", {
        variant: "info",
      });
      onRequireReflection?.();
      return;
    }

    markPassageComplete(passage);
    if (dateKey) markDateComplete(dateKey);
    showToast("Pasal ditandai selesai");
    void celebrateReadingComplete(passage);
  }

  const confirmDialog = (
    <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-sm"
      >
        <DialogHeader className="space-y-1 px-5 pt-5 text-left">
          <DialogTitle className="text-base font-semibold text-[var(--m-ink)]">
            Batalkan tanda selesai?
          </DialogTitle>
          <DialogDescription className="text-sm text-[var(--m-ink-soft)]">
            Bacaan{" "}
            <span className="font-medium text-[var(--m-ink)]">{passage}</span>{" "}
            akan kembali bertanda belum selesai. Yakin ingin mengubahnya?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col-reverse gap-2 px-5 py-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl"
            onClick={() => setConfirmOpen(false)}
          >
            Tidak, biarkan
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="h-10 rounded-xl"
            onClick={confirmUnmark}
          >
            Ya, batalkan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (compact) {
    if (completed) {
      return (
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              "h-9 shrink-0 gap-1.5 rounded-xl border-[var(--status-success-text)]/25 bg-[var(--status-success-bg)] font-semibold text-[var(--status-success-text)] hover:bg-[var(--status-success-bg)]",
              className,
            )}
            onClick={handleToggle}
            title="Batalkan tanda selesai"
          >
            <CheckCircle2 className="size-3.5" />
            Selesai
          </Button>
          {confirmDialog}
        </>
      );
    }

    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn(
          "h-9 shrink-0 gap-1.5 rounded-xl font-semibold",
          !reflectionReady && "border-dashed",
          className,
        )}
        onClick={handleToggle}
      >
        <CheckCircle2 className="size-3.5" />
        Tandai selesai
      </Button>
    );
  }

  if (completed) {
    return (
      <>
        <div className={cn("space-y-2", className)}>
          <div className="flex items-center gap-2 rounded-xl bg-[var(--status-success-bg)] px-3.5 py-3">
            <CheckCircle2 className="size-5 shrink-0 text-[var(--status-success-text)]" />
            <p className="flex-1 text-sm font-semibold text-[var(--status-success-text)]">
              Pasal ini sudah selesai
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 w-full rounded-xl text-xs font-semibold text-[var(--m-ink-soft)]"
            onClick={handleToggle}
          >
            Batalkan tanda selesai
          </Button>
        </div>
        {confirmDialog}
      </>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className={cn("h-11 w-full rounded-xl font-semibold", className)}
      onClick={handleToggle}
    >
      <CheckCircle2 className="size-4" />
      Tandai pasal selesai
    </Button>
  );
}
