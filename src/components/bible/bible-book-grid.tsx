"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ChevronLeft, Scroll } from "lucide-react";

import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast-host";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BIBLE_BOOKS,
  getNewTestamentBooks,
  getOldTestamentBooks,
  OLD_TESTAMENT_SIZE,
  type BibleBook,
} from "@/lib/bible-books";
import { bookIntroHref } from "@/lib/bible-book-intros";
import { getChapterOptions } from "@/lib/bible-chapters";
import {
  getAllBooksOpenProgressCached,
  getBookOpenProgress,
  getServerBooksOpenProgress,
  isChapterOpened,
  subscribeOpenedChapters,
} from "@/lib/bible-opened-chapters";
import {
  getCompletedChaptersSnapshot,
  getServerCompletedChaptersSnapshot,
  isChapterComplete,
  subscribeCompletedChapters,
  unmarkChapterComplete,
} from "@/lib/bible-completed-chapters";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

type Testament = "pl" | "pb";

type BibleBookGridProps = {
  onOpenChapter: (book: BibleBook, chapter: number) => void;
  initialBookAbbr?: string | null;
};

export function BibleBookGrid({
  onOpenChapter,
  initialBookAbbr,
}: BibleBookGridProps) {
  const progressList = useSyncExternalStore(
    subscribeOpenedChapters,
    getAllBooksOpenProgressCached,
    getServerBooksOpenProgress,
  );
  useSyncExternalStore(
    subscribeCompletedChapters,
    getCompletedChaptersSnapshot,
    getServerCompletedChaptersSnapshot,
  );

  const initialTestament: Testament =
    initialBookAbbr &&
    BIBLE_BOOKS.findIndex((book) => book.abbr === initialBookAbbr) >=
      OLD_TESTAMENT_SIZE
      ? "pb"
      : "pl";

  const [testament, setTestament] = useState<Testament>(
    initialBookAbbr ? initialTestament : "pl",
  );
  const [selectedBookAbbr, setSelectedBookAbbr] = useState<string | null>(
    initialBookAbbr ?? null,
  );

  const books =
    testament === "pl" ? getOldTestamentBooks() : getNewTestamentBooks();

  const progressByAbbr = useMemo(() => {
    const map = new Map(
      progressList.map((item) => [item.bookAbbr, item] as const),
    );
    return map;
  }, [progressList]);

  const selectedBook = selectedBookAbbr
    ? (BIBLE_BOOKS.find((book) => book.abbr === selectedBookAbbr) ?? null)
    : null;

  const selectedProgress = selectedBookAbbr
    ? getBookOpenProgress(selectedBookAbbr)
    : null;

  if (selectedBook && selectedProgress) {
    const book = selectedBook;
    const chapters = getChapterOptions(book.abbr);
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mt-0.5 size-9 shrink-0"
            onClick={() => setSelectedBookAbbr(null)}
            aria-label="Kembali ke daftar kitab"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h2 className="member-web-display text-2xl text-[var(--m-ink)] sm:text-3xl">
              {book.name}
            </h2>
            <p className="mt-1 text-sm text-[var(--m-ink-soft)]">
              {selectedProgress.opened} dari {selectedProgress.total} pasal
              dibuka
              {selectedProgress.opened > 0
                ? ` · ${selectedProgress.percent}%`
                : ""}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--m-wash)]">
              <div
                className="h-full rounded-full bg-[var(--m-accent)] transition-all"
                style={{ width: `${selectedProgress.percent}%` }}
              />
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="mt-3 h-8 rounded-lg border-[var(--m-line)] font-semibold"
            >
              <Link href={bookIntroHref(book.abbr)}>
                <Scroll className="size-3.5" />
                {copy.bookIntro.aboutBook}
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8 md:grid-cols-10">
          {chapters.map((chapter) => {
            const opened = isChapterOpened(book.abbr, chapter);
            const completed = isChapterComplete(book.abbr, chapter);

            function removeDoneChecklist() {
              if (!completed) return false;
              unmarkChapterComplete(book.abbr, chapter);
              showToast(`Tanda selesai pasal ${chapter} dibatalkan`);
              return true;
            }

            return (
              <button
                key={chapter}
                type="button"
                onClick={() => {
                  if (removeDoneChecklist()) return;
                  onOpenChapter(book, chapter);
                }}
                onContextMenu={(event) => {
                  event.preventDefault();
                  if (removeDoneChecklist()) return;
                  showToast(`Pasal ${chapter} belum ditandai selesai`);
                }}
                className={cn(
                  "flex h-9 items-center justify-center rounded-lg border text-sm font-semibold transition sm:h-10",
                  completed
                    ? "border-emerald-600/40 bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                    : opened
                      ? "border-[var(--m-accent)]/40 bg-[var(--m-accent)] text-white shadow-sm"
                      : "border-[var(--m-line)] bg-white text-[var(--m-ink)] hover:border-[var(--m-accent)]/50 hover:bg-[var(--m-wash)]/60",
                )}
                aria-label={
                  completed
                    ? `Pasal ${chapter}, selesai — ketuk atau klik kanan untuk batalkan`
                    : opened
                      ? `Pasal ${chapter}, sudah dibuka`
                      : `Pasal ${chapter}`
                }
                title={
                  completed
                    ? "Ketuk atau klik kanan untuk batalkan tanda selesai"
                    : undefined
                }
              >
                {chapter}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-[var(--m-ink-soft)]">
          Hijau = selesai (ketuk / klik kanan untuk batalkan) · biru = pernah
          dibuka.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-[var(--m-ink)]">
          Pilih kitab
        </h2>
        <p className="mt-0.5 text-sm text-[var(--m-ink-soft)]">
          Lihat progress pasal yang sudah kamu buka di setiap kitab.
        </p>
      </div>

      <Tabs
        value={testament}
        onValueChange={(value) => setTestament(value as Testament)}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pl">{copy.bible.oldTestament}</TabsTrigger>
          <TabsTrigger value="pb">{copy.bible.newTestament}</TabsTrigger>
        </TabsList>
        <TabsContent value={testament} className="mt-4">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
            {books.map((book) => {
              const progress = progressByAbbr.get(book.abbr) ?? {
                opened: 0,
                total: 1,
                percent: 0,
              };
              const started = progress.opened > 0;
              return (
                <button
                  key={book.abbr}
                  type="button"
                  onClick={() => setSelectedBookAbbr(book.abbr)}
                  className={cn(
                    "flex flex-col gap-3 rounded-2xl border p-3 text-left transition",
                    started
                      ? "border-[var(--m-accent)]/35 bg-[var(--m-wash)]/70 hover:bg-[var(--m-wash)]"
                      : "border-[var(--m-line)] bg-white hover:border-[var(--m-accent)]/40 hover:bg-[var(--m-wash)]/40",
                  )}
                >
                  <p className="truncate text-sm font-semibold text-[var(--m-ink)]">
                    {book.name}
                  </p>
                  <div className="w-full">
                    <div className="mb-1 flex items-center justify-between gap-1">
                      <span className="text-[11px] font-medium text-[var(--m-ink-soft)]">
                        {progress.opened}/{progress.total}
                      </span>
                      {started ? (
                        <span className="text-[10px] font-semibold text-[var(--m-accent)]">
                          {progress.percent}%
                        </span>
                      ) : (
                        <span className="text-[10px] text-[var(--m-ink-soft)]">
                          belum
                        </span>
                      )}
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-white/80 ring-1 ring-[var(--m-line)]/60">
                      <div
                        className="h-full rounded-full bg-[var(--m-accent)]"
                        style={{ width: `${progress.percent}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
