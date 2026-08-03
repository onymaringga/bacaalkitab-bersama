"use client";

import { useState, useSyncExternalStore } from "react";
import { StickyNote, Trash2 } from "lucide-react";

import {
  VerseNoteDialog,
  type VerseNoteDialogMode,
} from "@/components/bible/verse-note-dialog";
import { Button } from "@/components/ui/button";
import { formatSelectionCitation } from "@/lib/bible-highlight-selection";
import {
  EMPTY_VERSE_NOTES,
  getVerseNotesForPassage,
  removeBibleVerseNote,
  subscribeBibleVerseNotes,
  type BibleVerseNote,
} from "@/lib/bible-verse-notes";
import { showToast } from "@/components/ui/toast-host";
import { cn } from "@/lib/utils";

type PassageVerseNotesPanelProps = {
  passageKey: string;
  passageLabel: string;
  className?: string;
};

/** Daftar catatan ayat untuk tab Refleksi diri. */
export function PassageVerseNotesPanel({
  passageKey,
  passageLabel,
  className,
}: PassageVerseNotesPanelProps) {
  const notes = useSyncExternalStore(
    subscribeBibleVerseNotes,
    () => getVerseNotesForPassage(passageKey),
    () => EMPTY_VERSE_NOTES,
  );
  const [dialogMode, setDialogMode] = useState<VerseNoteDialogMode | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  function citationFor(note: BibleVerseNote) {
    return formatSelectionCitation(
      note.passageLabel || passageLabel,
      note.ranges.map((range) => range.verse),
    );
  }

  function openNote(note: BibleVerseNote) {
    setDialogMode({
      kind: "view",
      note,
      citation: citationFor(note),
    });
    setDialogOpen(true);
  }

  function handleDelete(id: string) {
    removeBibleVerseNote(id);
    showToast("Catatan dihapus");
  }

  return (
    <>
      <section
        className={cn(
          "space-y-3 rounded-2xl border border-[var(--m-line)] bg-[var(--m-wash)]/25 p-4 lg:p-5",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sky-700">
            <StickyNote className="size-4" />
            <p className="text-xs font-semibold tracking-wide uppercase">
              Catatan ayat
            </p>
          </div>
          {notes.length > 0 ? (
            <p className="text-xs font-medium tabular-nums text-[var(--m-ink-soft)]">
              {notes.length} catatan
            </p>
          ) : null}
        </div>

        {notes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--m-line)] bg-white/70 px-4 py-5 text-center">
            <p className="text-sm font-medium text-[var(--m-ink)]">
              Belum ada catatan ayat
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--m-ink-soft)]">
              Di tab Kitab, blok teks lalu buat catatan — hasilnya muncul di
              sini.
            </p>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {notes.map((note) => {
              const citation = citationFor(note);
              return (
                <li
                  key={note.id}
                  className="rounded-xl border border-[var(--m-line)] bg-white p-3.5"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => openNote(note)}
                      className="inline-flex min-w-0 items-center gap-1.5 text-left text-xs font-semibold tracking-wide text-sky-700 uppercase transition hover:text-sky-800"
                    >
                      <StickyNote className="size-3.5 shrink-0" />
                      <span className="truncate">{citation}</span>
                      {note.ranges.length > 1 ? (
                        <span className="shrink-0 font-medium normal-case text-[var(--m-ink-soft)]">
                          · {note.ranges.length} ayat
                        </span>
                      ) : null}
                    </button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="size-7 shrink-0 rounded-full text-[var(--m-ink-soft)]"
                      aria-label="Hapus catatan"
                      onClick={() => handleDelete(note.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                  <button
                    type="button"
                    onClick={() => openNote(note)}
                    className="w-full text-left"
                  >
                    {note.quote ? (
                      <p className="mb-2 line-clamp-2 border-l-2 border-sky-300 pl-2.5 text-sm leading-6 text-[var(--m-ink-soft)] italic">
                        “{note.quote}”
                      </p>
                    ) : null}
                    <p className="line-clamp-4 whitespace-pre-wrap text-sm leading-relaxed text-[var(--m-ink)]">
                      {note.content}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <VerseNoteDialog
        open={dialogOpen}
        mode={dialogMode}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setDialogMode(null);
        }}
      />
    </>
  );
}
