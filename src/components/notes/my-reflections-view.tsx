"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  NotebookPen,
  PenLine,
  Search,
  Trash2,
} from "lucide-react";

import { WriteReflectionDialog } from "@/components/notes/write-reflection-dialog";
import { ReflectionHtmlBody } from "@/components/notes/reflection-html-body";
import { ReflectionRichEditor } from "@/components/notes/reflection-rich-editor";
import { Button } from "@/components/ui/button";
import { HistoryBackButton } from "@/components/ui/history-back-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/ui/toast-host";
import {
  clearChapterNote,
  getServerChapterNotes,
  listChapterNotes,
  saveChapterNote,
  type ChapterNoteListItem,
  subscribeChapterNotes,
} from "@/lib/bible-chapter-notes";
import { copy } from "@/lib/copy";
import { demoTodayReading } from "@/lib/demo-data";
import { formatShortDate } from "@/lib/format-date";
import {
  reflectionPlainLength,
  sanitizeReflectionHtml,
  stripReflectionHtml,
} from "@/lib/reflection-html";
import { cn } from "@/lib/utils";

const MAX_LEN = 2000;
const PREVIEW_CHARS = 220;

type DetailMode = "view" | "edit";

function formatUpdatedAt(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return formatShortDate(iso.slice(0, 10));
  return date.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function monthKey(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso.slice(0, 7);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  if (!y || !m) return key;
  const date = new Date(y, m - 1, 1);
  return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}

/** Halaman daftar refleksi pribadi anggota. */
export function MyReflectionsView() {
  const notes = useSyncExternalStore(
    subscribeChapterNotes,
    listChapterNotes,
    getServerChapterNotes,
  );
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [writeOpen, setWriteOpen] = useState(false);
  const [active, setActive] = useState<ChapterNoteListItem | null>(null);
  const [detailMode, setDetailMode] = useState<DetailMode>("view");
  const [draft, setDraft] = useState("");
  const [pendingDelete, setPendingDelete] = useState<ChapterNoteListItem | null>(
    null,
  );

  const todayPassage =
    demoTodayReading.passage !== "Belum dijadwalkan"
      ? demoTodayReading.passage
      : "Matius 1";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (note) =>
        note.reference.toLowerCase().includes(q) ||
        stripReflectionHtml(note.content).toLowerCase().includes(q),
    );
  }, [notes, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, ChapterNoteListItem[]>();
    for (const note of filtered) {
      const key = monthKey(note.updatedAt);
      const list = map.get(key) ?? [];
      list.push(note);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [filtered]);

  /** Sync konten aktif jika list berubah (setelah simpan/hapus). */
  const viewing = useMemo(() => {
    if (!active) return null;
    return notes.find((note) => note.reference === active.reference) ?? active;
  }, [active, notes]);

  function openView(note: ChapterNoteListItem) {
    setActive(note);
    setDetailMode("view");
    setDraft(note.content);
  }

  function closeDetail() {
    setActive(null);
    setDetailMode("view");
    setDraft("");
  }

  function enterEdit() {
    if (!viewing) return;
    setDraft(viewing.content);
    setDetailMode("edit");
  }

  function cancelEdit() {
    if (!viewing) return;
    setDraft(viewing.content);
    setDetailMode("view");
  }

  function handleSaveEdit() {
    if (!viewing) return;
    const cleaned = sanitizeReflectionHtml(draft);
    if (!reflectionPlainLength(cleaned)) return;
    saveChapterNote(viewing.reference, cleaned);
    setDetailMode("view");
    setDraft(cleaned);
    showToast("Refleksi diperbarui");
  }

  function handleConfirmDelete() {
    if (!pendingDelete) return;
    clearChapterNote(pendingDelete.reference);
    setPendingDelete(null);
    if (active?.reference === pendingDelete.reference) {
      closeDetail();
    }
    showToast("Refleksi dihapus");
  }

  return (
    <div className="member-web-animate-in mx-auto w-full max-w-3xl space-y-6 pb-2">
      <header className="space-y-3">
        <HistoryBackButton
          fallbackHref="/profil"
          label="Kembali ke profil"
          size="sm"
          variant="ghost"
          className="-ml-2 h-9 px-2 text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]"
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="member-web-kicker text-[var(--m-accent)]">
              {copy.myReflections.eyebrow}
            </p>
            <h1 className="member-web-display mt-1.5 text-[clamp(1.65rem,3vw,2.35rem)] leading-[1.1] text-[var(--m-ink)]">
              {copy.myReflections.title}
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--m-ink-soft)]">
              {copy.myReflections.subtitle}
            </p>
            {notes.length > 0 ? (
              <p className="mt-2 text-xs font-medium tabular-nums text-[var(--m-ink-soft)]">
                {notes.length} refleksi
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            className="h-11 shrink-0 rounded-xl px-4 font-semibold"
            onClick={() => setWriteOpen(true)}
          >
            <PenLine className="size-4" />
            {copy.myReflections.write}
          </Button>
        </div>
      </header>

      {notes.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-[var(--m-line)] bg-[var(--m-paper)]/60 px-6 py-14 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[var(--m-wash)] text-[var(--m-accent)]">
            <NotebookPen className="size-6" />
          </div>
          <p className="mt-4 text-base font-semibold text-[var(--m-ink)]">
            {copy.myReflections.empty}
          </p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-[var(--m-ink-soft)]">
            {copy.myReflections.emptyHint}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Button
              type="button"
              className="h-10 rounded-xl font-semibold"
              onClick={() => setWriteOpen(true)}
            >
              <PenLine className="size-4" />
              {copy.myReflections.write}
            </Button>
            <Button
              asChild
              type="button"
              variant="outline"
              className="h-10 rounded-xl font-semibold"
            >
              <Link href="/baca">
                <BookOpen className="size-4" />
                Buka bacaan
              </Link>
            </Button>
          </div>
        </section>
      ) : (
        <div className="space-y-5">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--m-ink-soft)]" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari pasal atau isi refleksi…"
              className="h-11 rounded-xl border-[var(--m-line)] bg-[var(--m-paper)]/90 pl-10"
              aria-label="Cari refleksi"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-[var(--m-line)] bg-[var(--m-paper)]/70 px-4 py-8 text-center text-sm text-[var(--m-ink-soft)]">
              Tidak ada refleksi yang cocok.
            </p>
          ) : (
            <div className="space-y-7">
              {grouped.map(([key, items]) => (
                <section key={key} className="space-y-3">
                  <h2 className="text-[11px] font-semibold tracking-[0.14em] text-[var(--m-ink-soft)] uppercase">
                    {monthLabel(key)}
                  </h2>
                  <ul className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-[var(--m-paper)]/90">
                    {items.map((note, index) => {
                      const isOpen = Boolean(expanded[note.reference]);
                      const plainLen = reflectionPlainLength(note.content);
                      const long = plainLen > PREVIEW_CHARS;

                      return (
                        <li
                          key={note.reference}
                          className={cn(
                            index > 0 && "border-t border-[var(--m-line)]/80",
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => openView(note)}
                            className="w-full px-4 py-4 text-left transition-colors hover:bg-[var(--m-wash)]/45 sm:px-5 sm:py-5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--m-ink)]">
                                  <BookOpen className="size-3.5 shrink-0 text-[var(--m-accent)]" />
                                  <span className="truncate">
                                    {note.reference}
                                  </span>
                                </p>
                                <p className="mt-0.5 text-[11px] text-[var(--m-ink-soft)]">
                                  {formatUpdatedAt(note.updatedAt)}
                                </p>
                              </div>
                              <span className="shrink-0 rounded-lg bg-[var(--m-wash)] px-2.5 py-1 text-[11px] font-semibold text-[var(--m-accent)]">
                                Lihat
                              </span>
                            </div>

                            {plainLen > 0 ? (
                              <ReflectionHtmlBody
                                content={note.content}
                                className="mt-3 pointer-events-none"
                                previewChars={PREVIEW_CHARS}
                                expanded={isOpen}
                              />
                            ) : (
                              <p className="mt-3 text-sm text-[var(--m-ink-soft)] italic">
                                Belum ada isi refleksi.
                              </p>
                            )}
                          </button>

                          {long ? (
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 pb-4 sm:px-5">
                              <button
                                type="button"
                                className="text-xs font-semibold text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setExpanded((current) => ({
                                    ...current,
                                    [note.reference]: !isOpen,
                                  }));
                                }}
                              >
                                {isOpen ? "Ringkas" : "Selengkapnya"}
                              </button>
                            </div>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      )}

      <WriteReflectionDialog
        open={writeOpen}
        onOpenChange={setWriteOpen}
        passage={todayPassage}
      />

      <Dialog
        open={Boolean(viewing)}
        onOpenChange={(open) => {
          if (!open) closeDetail();
        }}
      >
        <DialogContent className="gap-0 overflow-hidden bg-[var(--m-paper)] p-0 text-[var(--m-ink)] sm:max-w-lg">
          <DialogHeader className="space-y-1 border-b border-[var(--m-line)] px-5 pt-5 pb-4 text-left">
            <DialogTitle className="text-[var(--m-ink)]">
              {detailMode === "edit" ? "Edit refleksi" : "Refleksi"}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-0.5">
                <p className="font-medium text-[var(--m-ink)]">
                  {viewing?.reference}
                </p>
                {viewing ? (
                  <p className="text-xs text-[var(--m-ink-soft)]">
                    Diperbarui {formatUpdatedAt(viewing.updatedAt)}
                  </p>
                ) : null}
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[min(60vh,28rem)] overflow-y-auto px-5 py-4">
            {detailMode === "view" && viewing ? (
              reflectionPlainLength(viewing.content) > 0 ? (
                <ReflectionHtmlBody
                  content={viewing.content}
                  expanded
                  className="text-[0.95rem] leading-relaxed text-[var(--m-ink)]"
                />
              ) : (
                <p className="text-sm text-[var(--m-ink-soft)] italic">
                  Belum ada isi. Ketuk Edit untuk menulis refleksi.
                </p>
              )
            ) : (
              <ReflectionRichEditor
                value={draft}
                onChange={setDraft}
                maxLength={MAX_LEN}
                placeholder={copy.notes.placeholder}
                minHeightClassName="min-h-[12rem]"
              />
            )}
          </div>

          <DialogFooter className="mx-0 mb-0 gap-2 rounded-none border-t border-[var(--m-line)] bg-[var(--m-wash)]/35 px-5 py-3.5 sm:justify-between">
            {detailMode === "view" ? (
              <>
                <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-xl border-[var(--m-line)] bg-[var(--m-paper)] font-semibold"
                    onClick={() => viewing && setPendingDelete(viewing)}
                  >
                    <Trash2 className="size-3.5" />
                    Hapus
                  </Button>
                  {viewing ? (
                    <Button
                      asChild
                      type="button"
                      variant="ghost"
                      className="h-10 rounded-xl font-semibold text-[var(--m-accent)]"
                    >
                      <Link
                        href={`/baca?browse=1&passage=${encodeURIComponent(viewing.reference)}`}
                      >
                        Buka bacaan
                        <ArrowUpRight className="size-3.5" />
                      </Link>
                    </Button>
                  ) : null}
                </div>
                <Button
                  type="button"
                  className="h-10 rounded-xl font-semibold"
                  onClick={enterEdit}
                >
                  <PenLine className="size-3.5" />
                  Edit
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-xl border-[var(--m-line)] bg-[var(--m-paper)] font-semibold"
                  onClick={cancelEdit}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  className="h-10 rounded-xl font-semibold"
                  disabled={!reflectionPlainLength(draft)}
                  onClick={handleSaveEdit}
                >
                  Simpan
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <DialogContent className="gap-4 bg-[var(--m-paper)] text-[var(--m-ink)] sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[var(--m-ink)]">
              Hapus refleksi?
            </DialogTitle>
            <DialogDescription className="text-[var(--m-ink-soft)]">
              Refleksi untuk{" "}
              <span className="font-medium text-[var(--m-ink)]">
                {pendingDelete?.reference}
              </span>{" "}
              akan dihapus dari perangkatmu.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mx-0 mb-0 gap-2 border-[var(--m-line)] bg-transparent p-0 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-[var(--m-line)] bg-[var(--m-paper)]"
              onClick={() => setPendingDelete(null)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="font-semibold"
              onClick={handleConfirmDelete}
            >
              <Trash2 className="size-4" />
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
