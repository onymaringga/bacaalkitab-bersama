"use client";

import { useEffect, useState } from "react";
import { StickyNote, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/components/ui/toast-host";
import {
  MAX_VERSE_NOTE_LEN,
  addBibleVerseNote,
  removeBibleVerseNote,
  updateBibleVerseNote,
  type BibleVerseNote,
  type VerseNoteRange,
} from "@/lib/bible-verse-notes";
import { cn } from "@/lib/utils";

export type VerseNoteDialogMode =
  | {
      kind: "create";
      passageKey: string;
      passageLabel: string;
      ranges: VerseNoteRange[];
      quote: string;
      citation: string;
    }
  | {
      kind: "view";
      note: BibleVerseNote;
      citation: string;
    };

type VerseNoteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: VerseNoteDialogMode | null;
};

export function VerseNoteDialog({
  open,
  onOpenChange,
  mode,
}: VerseNoteDialogProps) {
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!mode) {
      setDraft("");
      setEditing(false);
      return;
    }
    if (mode.kind === "create") {
      setDraft("");
      setEditing(true);
      return;
    }
    setDraft(mode.note.content);
    setEditing(false);
  }, [mode, open]);

  if (!mode) return null;

  const quote = mode.kind === "create" ? mode.quote : mode.note.quote;
  const citation = mode.citation;
  const trimmed = draft.trim();
  const canSave =
    trimmed.length > 0 &&
    (mode.kind === "create" || trimmed !== mode.note.content.trim());

  function handleSave() {
    if (!trimmed || !mode) return;

    if (mode.kind === "create") {
      const created = addBibleVerseNote({
        passageKey: mode.passageKey,
        passageLabel: mode.passageLabel,
        ranges: mode.ranges,
        quote: mode.quote,
        content: trimmed,
      });
      if (!created) return;
      showToast("Catatan kaki disimpan");
      onOpenChange(false);
      return;
    }

    updateBibleVerseNote(mode.note.id, trimmed);
    setEditing(false);
    showToast("Catatan kaki diperbarui");
  }

  function handleDelete() {
    if (mode?.kind !== "view") return;
    removeBibleVerseNote(mode.note.id);
    showToast("Catatan kaki dihapus");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="gap-0 overflow-hidden rounded-2xl border-[var(--m-line)] p-0 sm:max-w-md"
        showCloseButton
      >
        <DialogHeader className="space-y-1.5 px-5 pt-5 pb-4 text-left sm:px-6">
          <DialogTitle className="flex items-center gap-2 text-[0.95rem] font-semibold text-[var(--m-ink)]">
            <span className="flex size-8 items-center justify-center rounded-xl bg-[var(--m-wash)] text-[var(--m-accent)]">
              <StickyNote className="size-3.5" />
            </span>
            {mode.kind === "create" ? "Tambah catatan kaki" : "Catatan kaki"}
          </DialogTitle>
          <DialogDescription className="pl-10 text-xs font-medium text-[var(--m-ink-soft)]">
            {citation}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-5 pb-4 sm:px-6">
          {quote ? (
            <blockquote className="border-l-2 border-[var(--m-accent)]/45 bg-[var(--m-wash)]/40 py-2.5 pr-3 pl-3.5 text-[0.8125rem] leading-relaxed text-[var(--m-ink)]">
              <span className="text-[var(--m-ink-soft)]">“</span>
              {quote.length > 180 ? `${quote.slice(0, 180)}…` : quote}
              <span className="text-[var(--m-ink-soft)]">”</span>
            </blockquote>
          ) : null}

          {mode.kind === "view" && !editing ? (
            <div className="space-y-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--m-ink)]">
                {mode.note.content}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-xl border-[var(--m-line)] font-semibold"
                  onClick={() => setEditing(true)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 rounded-xl font-semibold text-destructive hover:bg-destructive/8 hover:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="size-3.5" />
                  Hapus
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                Catatanmu
              </label>
              <Textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={MAX_VERSE_NOTE_LEN}
                placeholder="Apa yang ingin kamu catat dari ayat ini…"
                className="min-h-[6.5rem] resize-none rounded-xl border-[var(--m-line)] bg-white text-sm leading-relaxed shadow-none focus-visible:border-[var(--m-accent)]/40"
                autoFocus
              />
              <p
                className={cn(
                  "text-right text-[11px] tabular-nums text-[var(--m-ink-soft)]",
                  draft.length >= MAX_VERSE_NOTE_LEN && "text-destructive",
                )}
              >
                {draft.length}/{MAX_VERSE_NOTE_LEN}
              </p>
            </div>
          )}
        </div>

        {mode.kind === "create" || editing ? (
          <DialogFooter className="gap-2 bg-[var(--m-wash)]/35 px-5 py-3.5 sm:flex-row sm:justify-end sm:px-6">
            {mode.kind === "view" ? (
              <Button
                type="button"
                variant="ghost"
                className="h-10 rounded-xl"
                onClick={() => {
                  setDraft(mode.note.content);
                  setEditing(false);
                }}
              >
                Batal
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                className="h-10 rounded-xl"
                onClick={() => onOpenChange(false)}
              >
                Batal
              </Button>
            )}
            <Button
              type="button"
              className="h-10 rounded-xl px-5 font-semibold"
              disabled={!canSave}
              onClick={handleSave}
            >
              Simpan
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
