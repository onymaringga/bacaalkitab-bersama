"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { NotebookPen, Pencil, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/components/ui/toast-host";
import { celebrateReadingComplete } from "@/lib/browser-notifications";
import { copy } from "@/lib/copy";
import {
  clearChapterNote,
  getChapterNoteSnapshot,
  parseChapterNoteSnapshot,
  saveChapterNote,
  subscribeChapterNotes,
} from "@/lib/bible-chapter-notes";
import {
  isPassageComplete,
  markPassageComplete,
} from "@/lib/bible-completed-chapters";
import {
  isDateComplete,
  markDateComplete,
} from "@/lib/reading-progress";
import {
  completeReadingSessionOnReflection,
  formatReadingDuration,
  getCompletedReadingSession,
  getReadingSessionSnapshot,
  subscribeReadingSessions,
} from "@/lib/bible-reading-session";
import { cn } from "@/lib/utils";

type ChapterNoteCardProps = {
  reference: string;
  className?: string;
  /** Setelah simpan refleksi, tandai bacaan selesai (tombol header ikut berubah). */
  markCompleteOnSave?: {
    passage: string;
    dateKey?: string;
  };
};

const MAX_LEN = 2000;

export function ChapterNoteCard({
  reference,
  className,
  markCompleteOnSave,
}: ChapterNoteCardProps) {
  const noteSnapshot = useSyncExternalStore(
    subscribeChapterNotes,
    () => getChapterNoteSnapshot(reference),
    () => "",
  );
  const note = useMemo(
    () => parseChapterNoteSnapshot(noteSnapshot),
    [noteSnapshot],
  );
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);

  const savedTrimmed = (note?.content ?? "").trim();
  const hasSaved = savedTrimmed.length > 0;

  useEffect(() => {
    setDraft(note?.content ?? "");
    setEditing(false);
  }, [note?.content, reference]);

  const trimmed = draft.trim();
  const dirty = trimmed !== savedTrimmed;
  const showEditor = editing || !hasSaved;

  const updatedLabel = useMemo(() => {
    if (!note?.updatedAt) return null;
    const date = new Date(note.updatedAt);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }, [note?.updatedAt]);

  function handleSave() {
    if (!trimmed) return;
    saveChapterNote(reference, trimmed);
    setEditing(false);

    const session = completeReadingSessionOnReflection(reference);
    const durationLabel = session
      ? formatReadingDuration(session.durationMs)
      : null;

    let markedNow = false;
    if (markCompleteOnSave?.passage) {
      const { passage, dateKey } = markCompleteOnSave;
      const alreadyDone =
        isPassageComplete(passage) ||
        (dateKey ? isDateComplete(dateKey) : false);
      if (!alreadyDone) {
        markPassageComplete(passage);
        if (dateKey) markDateComplete(dateKey);
        markedNow = true;
        void celebrateReadingComplete(passage);
      }
    }

    if (durationLabel) {
      showToast(
        markedNow
          ? `Refleksi tersimpan · baca ${durationLabel}`
          : `Refleksi tersimpan · waktu baca ${durationLabel}`,
      );
    } else {
      showToast(
        markedNow
          ? "Refleksi tersimpan · bacaan ditandai selesai"
          : copy.bible.chapterNoteSaved,
      );
    }
  }

  function handleClear() {
    clearChapterNote(reference);
    setDraft("");
    setEditing(false);
    showToast(copy.bible.chapterNoteCleared);
  }

  function handleCancelEdit() {
    setDraft(note?.content ?? "");
    setEditing(false);
  }

  function startEdit() {
    setDraft(note?.content ?? "");
    setEditing(true);
  }

  return (
    <section
      className={cn(
        "space-y-3 rounded-2xl border border-[var(--m-line)] bg-[var(--m-wash)]/25 p-4 lg:p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[var(--m-accent)]">
          <NotebookPen className="size-4" />
          <p className="text-xs font-semibold tracking-wide uppercase">
            {copy.bible.chapterNoteTitle}
          </p>
        </div>
        {hasSaved && !showEditor ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-8 rounded-lg px-2.5 text-xs font-semibold text-[var(--m-accent)]"
            onClick={startEdit}
          >
            <Pencil className="size-3.5" />
            Ubah
          </Button>
        ) : null}
      </div>

      {showEditor ? (
        <>
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value.slice(0, MAX_LEN))}
            placeholder={copy.bible.chapterNotePlaceholder}
            className="min-h-28 resize-y bg-[var(--m-paper)] lg:min-h-40"
            autoFocus={editing && hasSaved}
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-[var(--m-ink-soft)]">
              {updatedLabel
                ? copy.bible.chapterNoteUpdated(updatedLabel)
                : copy.bible.chapterNoteEmpty}
            </p>
            <p className="text-xs tabular-nums text-[var(--m-ink-soft)]">
              {draft.length}/{MAX_LEN}
            </p>
          </div>
          <div className="flex items-center justify-end gap-2">
            {hasSaved ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="rounded-xl"
                onClick={handleCancelEdit}
              >
                <X className="size-4" />
                Batal
              </Button>
            ) : null}
            {hasSaved ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-xl"
                onClick={handleClear}
              >
                <Trash2 className="size-4" />
                {copy.bible.chapterNoteClear}
              </Button>
            ) : null}
            <Button
              type="button"
              size="lg"
              className="h-11 rounded-xl px-5 text-sm font-semibold"
              onClick={handleSave}
              disabled={!trimmed || !dirty}
            >
              {copy.bible.chapterNoteSave}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-xl bg-[var(--m-paper)] px-4 py-4 ring-1 ring-[var(--m-line)]">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--m-ink)]">
              {savedTrimmed}
            </p>
          </div>
          {updatedLabel ? (
            <p className="text-xs text-[var(--m-ink-soft)]">
              {copy.bible.chapterNoteUpdated(updatedLabel)}
            </p>
          ) : null}
          <ReadingSessionSummary reference={reference} />
        </>
      )}
    </section>
  );
}

function ReadingSessionSummary({ reference }: { reference: string }) {
  const snapshot = useSyncExternalStore(
    subscribeReadingSessions,
    () => getReadingSessionSnapshot(reference),
    () => "",
  );
  if (!snapshot.startsWith("done:")) return null;
  const session = getCompletedReadingSession(reference);
  if (!session || session.durationMs < 1000) return null;
  return (
    <p className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
      Waktu baca sampai refleksi: {formatReadingDuration(session.durationMs)}
    </p>
  );
}
