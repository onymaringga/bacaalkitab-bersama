"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { BookOpen, CheckCircle2, Eye, PenLine, RotateCcw } from "lucide-react";

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
import { celebrateReadingComplete } from "@/lib/browser-notifications";
import {
  getChapterNoteSnapshot,
  parseChapterNoteSnapshot,
  subscribeChapterNotes,
} from "@/lib/bible-chapter-notes";
import { unmarkPassageComplete, markPassageComplete } from "@/lib/bible-completed-chapters";
import {
  getReflectionForDate,
  hasWrittenReflection,
  saveMyReflectionMessage,
  subscribeReflectionChat,
} from "@/lib/group-reflection-chat";
import {
  isDateComplete,
  markDateComplete,
  markDateIncomplete,
} from "@/lib/reading-progress";
import { getTodayKey } from "@/lib/reading-status";
import { cn } from "@/lib/utils";

type MarkReadingCompleteButtonProps = {
  passage: string;
  /** Tanggal jadwal yang ditandai (default: hari ini). */
  dateKey?: string;
  className?: string;
  hideHints?: boolean;
  /** Setelah simpan, buka halaman chat (default: true). */
  redirectToChat?: boolean;
  /** Sembunyikan banner "sudah selesai" (status sudah ditampilkan di tempat lain). */
  hideCompletedBanner?: boolean;
  /** Sembunyikan link batalkan selesai (ditangani di parent). */
  hideMarkIncomplete?: boolean;
  /** Hanya tombol aksi — tanpa banner atau link batalkan. */
  actionLayout?: "stack" | "button-only";
};

const MAX_LEN = 1000;

export function markReadingIncomplete(dateKey: string, passage: string) {
  markDateIncomplete(dateKey);
  if (passage && passage !== "Belum dijadwalkan") {
    unmarkPassageComplete(passage);
  }
  showToast(copy.schedule.markIncompleteDone);
}

function subscribeProgress(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("reading-progress-updated", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("reading-progress-updated", onChange);
    window.removeEventListener("storage", onChange);
  };
}

function subscribeReflectionState(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const unsubChat = subscribeReflectionChat(onChange);
  const unsubNotes = subscribeChapterNotes(onChange);
  return () => {
    unsubChat();
    unsubNotes();
  };
}

function resolveExistingReflection(dateKey: string, passage: string) {
  const byDate = getReflectionForDate(dateKey);
  if (byDate?.content.trim()) return byDate.content.trim();

  const note = parseChapterNoteSnapshot(getChapterNoteSnapshot(passage));
  if (note?.content.trim()) return note.content.trim();

  return "";
}

function hasExistingReflection(dateKey: string, passage: string) {
  if (hasWrittenReflection(dateKey)) return true;
  return resolveExistingReflection(dateKey, passage).length > 0;
}

export function MarkReadingCompleteButton({
  passage,
  dateKey,
  className,
  hideHints: _hideHints = false,
  redirectToChat = true,
  hideCompletedBanner = false,
  hideMarkIncomplete = false,
  actionLayout = "stack",
}: MarkReadingCompleteButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reflection, setReflection] = useState("");
  const todayKey = getTodayKey();
  const targetDateKey = dateKey ?? todayKey;
  const isFuture = targetDateKey > todayKey;
  const completed = useSyncExternalStore(
    subscribeProgress,
    () => isDateComplete(targetDateKey),
    () => false,
  );
  const hasReflection = useSyncExternalStore(
    subscribeReflectionState,
    () => hasExistingReflection(targetDateKey, passage),
    () => false,
  );

  useEffect(() => {
    if (!open) {
      setReflection("");
      return;
    }
    setReflection(resolveExistingReflection(targetDateKey, passage));
  }, [open, targetDateKey, passage]);

  function handleSave() {
    const content = reflection.trim();
    if (!content) return;

    markDateComplete(targetDateKey);
    if (passage && passage !== "Belum dijadwalkan") {
      markPassageComplete(passage);
      void celebrateReadingComplete(passage);
    }
    saveMyReflectionMessage({
      content,
      passage,
      shareToGroup: true,
      dateKey: targetDateKey,
    });
    setOpen(false);
    showToast("Refleksi tersimpan");
    if (redirectToChat && !hasReflection) {
      router.push(`/chat`);
    }
  }

  function handleMarkIncomplete() {
    markReadingIncomplete(targetDateKey, passage);
  }

  const buttonOnly = actionLayout === "button-only";
  const title = hasReflection
    ? "Refleksi"
    : isFuture
      ? copy.bible.confirmEarlyTitle
      : copy.bible.confirmTitle;
  const canSave = reflection.trim().length > 0;

  const dialog = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton
        className="gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-md"
      >
        <div className="space-y-4 px-6 pt-6 pb-5 pr-12">
          <DialogHeader className="gap-1 text-left">
            <DialogTitle className="text-xl font-semibold tracking-tight text-[var(--m-ink)]">
              {title}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-1.5 text-sm text-[var(--m-ink-soft)]">
              <BookOpen className="size-3.5 shrink-0" />
              <span className="truncate">{passage}</span>
            </DialogDescription>
          </DialogHeader>

          <Textarea
            id="complete-reflection"
            value={reflection}
            onChange={(event) =>
              setReflection(event.target.value.slice(0, MAX_LEN))
            }
            placeholder={copy.bible.confirmPlaceholder}
            className="min-h-[10rem] resize-none rounded-xl border-[var(--m-line)] bg-white text-base leading-relaxed shadow-none focus-visible:ring-[var(--m-accent)]/30"
            autoFocus
          />
        </div>

        <div className="flex gap-2.5 border-t border-[var(--m-line)] px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1 rounded-xl text-base font-semibold"
            onClick={() => setOpen(false)}
          >
            {hasReflection ? "Tutup" : copy.bible.confirmCancel}
          </Button>
          <Button
            type="button"
            className="h-11 flex-1 rounded-xl text-base font-semibold"
            disabled={!canSave}
            onClick={handleSave}
          >
            {copy.bible.confirmYes}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (completed) {
    const reflectionButton = (
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-11 w-full rounded-xl font-semibold"
        onClick={() => setOpen(true)}
      >
        {hasReflection ? (
          <Eye className="size-4" />
        ) : (
          <PenLine className="size-4" />
        )}
        {hasReflection
          ? copy.home.viewReflection
          : copy.home.writeReflection}
      </Button>
    );

    if (buttonOnly) {
      return (
        <>
          <div className={className}>{reflectionButton}</div>
          {dialog}
        </>
      );
    }

    return (
      <div className={cn("space-y-2", className)}>
        {!hideCompletedBanner ? (
          <div className="flex items-center gap-2 rounded-xl bg-[var(--status-success-bg)] px-3.5 py-3">
            <CheckCircle2 className="size-5 shrink-0 text-[var(--status-success-text)]" />
            <p className="flex-1 text-sm font-semibold text-[var(--status-success-text)]">
              {isFuture
                ? "Bacaan besok sudah ditandai selesai"
                : copy.bible.markCompleteDone}
            </p>
          </div>
        ) : null}
        {reflectionButton}
        {!hideMarkIncomplete ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 w-full rounded-lg text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]"
            onClick={handleMarkIncomplete}
          >
            <RotateCcw className="size-3.5" />
            {copy.schedule.markIncomplete}
          </Button>
        ) : null}
        {dialog}
      </div>
    );
  }

  const completeButton = (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="h-11 w-full rounded-xl font-semibold"
      onClick={() => setOpen(true)}
    >
      <CheckCircle2 className="size-4" />
      {copy.bible.markComplete}
    </Button>
  );

  if (buttonOnly) {
    return (
      <>
        <div className={className}>{completeButton}</div>
        {dialog}
      </>
    );
  }

  return (
    <>
      <div className={cn("flex items-center gap-1", className)}>
        {completeButton}
      </div>
      {dialog}
    </>
  );
}
