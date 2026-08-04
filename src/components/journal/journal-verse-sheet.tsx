"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, CalendarDays, Loader2, Search } from "lucide-react";

import { BibleBookCombobox } from "@/components/bible/bible-book-combobox";
import { BibleChapterCombobox } from "@/components/bible/bible-chapter-combobox";
import { ScheduleDateCombobox } from "@/components/bible/schedule-date-combobox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { showToast } from "@/components/ui/toast-host";
import { BIBLE_BOOKS } from "@/lib/bible-books";
import { getChapterOptions, getVerseOptions } from "@/lib/bible-chapters";
import { copy } from "@/lib/copy";
import { formatDisplayDate } from "@/lib/format-date";
import {
  buildManualVersePassage,
  buildScheduleJournalElements,
  loadJournalVerseText,
} from "@/lib/journal-verse-utils";
import { getScheduledReadingForDate } from "@/lib/reading-progress";
import { getTodayKey } from "@/lib/reading-status";
import type { ReadingSchedule } from "@/lib/types";
import { cn } from "@/lib/utils";

type JournalVerseSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsertVerses: (payload: { passage: string; content: string }) => void;
  onApplySchedule: (reading: ReadingSchedule, options?: { includeVerses?: boolean }) => void;
  currentScheduleDate?: string;
};

type TabId = "schedule" | "verse";

export function JournalVerseSheet({
  open,
  onOpenChange,
  onInsertVerses,
  onApplySchedule,
  currentScheduleDate,
}: JournalVerseSheetProps) {
  const [tab, setTab] = useState<TabId>("schedule");
  const [scheduleReading, setScheduleReading] = useState<ReadingSchedule | null>(null);
  const [bookAbbr, setBookAbbr] = useState("Kej");
  const [chapter, setChapter] = useState("1");
  const [startVerse, setStartVerse] = useState("1");
  const [endVerse, setEndVerse] = useState("1");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const chapterOptions = useMemo(() => getChapterOptions(bookAbbr), [bookAbbr]);
  const verseOptions = useMemo(() => getVerseOptions(), []);

  useEffect(() => {
    if (!open) return;
    const today = getTodayKey();
    const initial =
      (currentScheduleDate && getScheduledReadingForDate(currentScheduleDate)) ||
      getScheduledReadingForDate(today);
    setScheduleReading(initial);
    setTab("schedule");
    setPreview("");
  }, [open, currentScheduleDate]);

  useEffect(() => {
    if (!chapterOptions.includes(Number(chapter))) {
      setChapter(String(chapterOptions[0] ?? 1));
    }
  }, [chapter, chapterOptions]);

  async function handlePreviewManual() {
    const passage = buildManualVersePassage(
      bookAbbr,
      Number(chapter),
      Number(startVerse),
      Number(endVerse),
    );
    if (!passage) {
      showToast(copy.journal.verseInvalid);
      return;
    }

    setLoading(true);
    try {
      const text = await loadJournalVerseText(`${BIBLE_BOOKS.find((b) => b.abbr === bookAbbr)?.name} ${chapter}`, {
        startVerse: Number(startVerse),
        endVerse: Number(endVerse),
      });
      setPreview(text ?? copy.journal.verseLoadEmpty);
    } catch {
      setPreview(copy.journal.verseLoadError);
    } finally {
      setLoading(false);
    }
  }

  async function handleInsertManual() {
    const book = BIBLE_BOOKS.find((item) => item.abbr === bookAbbr);
    if (!book) return;
    const passage = buildManualVersePassage(
      bookAbbr,
      Number(chapter),
      Number(startVerse),
      Number(endVerse),
    );
    if (!passage) {
      showToast(copy.journal.verseInvalid);
      return;
    }

    setLoading(true);
    try {
      const content =
        preview ||
        (await loadJournalVerseText(`${book.name} ${chapter}`, {
          startVerse: Number(startVerse),
          endVerse: Number(endVerse),
        }));
      if (!content) {
        showToast(copy.journal.verseLoadEmpty);
        return;
      }
      onInsertVerses({ passage, content });
      onOpenChange(false);
      showToast(copy.journal.verseInserted);
    } catch {
      showToast(copy.journal.verseLoadError);
    } finally {
      setLoading(false);
    }
  }

  async function handleInsertScheduleVerses() {
    if (!scheduleReading) return;
    setLoading(true);
    try {
      const content = await loadJournalVerseText(scheduleReading.passage, { maxVerses: 24 });
      if (!content) {
        showToast(copy.journal.verseLoadEmpty);
        return;
      }
      onInsertVerses({ passage: scheduleReading.passage, content });
      showToast(copy.journal.verseInserted);
    } catch {
      showToast(copy.journal.verseLoadError);
    } finally {
      setLoading(false);
    }
  }

  function handleApplySchedule(includeVerses: boolean) {
    if (!scheduleReading) return;
    onApplySchedule(scheduleReading, { includeVerses });
    onOpenChange(false);
  }

  const scheduleMeta = scheduleReading
    ? buildScheduleJournalElements(scheduleReading)
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="left-1/2 right-auto w-[min(calc(100vw-1.5rem),28rem)] -translate-x-1/2 max-h-[min(88dvh,40rem)] overflow-y-auto rounded-t-[1.35rem] border-[var(--m-line)] px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <SheetHeader className="px-0 text-left">
          <SheetTitle className="member-web-display text-lg">{copy.journal.verseSheetTitle}</SheetTitle>
          <SheetDescription>{copy.journal.verseSheetHint}</SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setTab("schedule")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition",
              tab === "schedule"
                ? "border-[var(--m-accent)] bg-[var(--m-accent)]/10 text-[var(--m-accent)]"
                : "border-[var(--m-line)] text-[var(--m-ink-soft)]",
            )}
          >
            <CalendarDays className="size-3.5" />
            {copy.journal.verseTabSchedule}
          </button>
          <button
            type="button"
            onClick={() => setTab("verse")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition",
              tab === "verse"
                ? "border-[var(--m-accent)] bg-[var(--m-accent)]/10 text-[var(--m-accent)]"
                : "border-[var(--m-line)] text-[var(--m-ink-soft)]",
            )}
          >
            <BookOpen className="size-3.5" />
            {copy.journal.verseTabPicker}
          </button>
        </div>

        {tab === "schedule" ? (
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="journal-schedule-pick">{copy.journal.verseScheduleLabel}</Label>
              <ScheduleDateCombobox
                id="journal-schedule-pick"
                value={scheduleReading?.scheduledDate}
                onChange={setScheduleReading}
                placeholder={copy.journal.verseSchedulePlaceholder}
              />
            </div>

            {scheduleMeta ? (
              <div className="space-y-3 rounded-2xl border border-[var(--m-line)] bg-[var(--m-wash)]/40 p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--m-accent)]">
                    {formatDisplayDate(scheduleReading!.scheduledDate)}
                  </p>
                  <p className="member-web-display mt-1 text-lg font-semibold text-[var(--m-ink)]">
                    {scheduleMeta.passage}
                  </p>
                </div>
                {scheduleMeta.reflectionContent ? (
                  <p className="text-sm leading-relaxed text-[var(--m-ink-soft)]">
                    {scheduleMeta.reflectionContent}
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-[var(--m-ink-soft)]">{copy.journal.verseScheduleEmpty}</p>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                className="flex-1 rounded-xl"
                disabled={!scheduleReading || loading}
                onClick={() => handleApplySchedule(false)}
              >
                {copy.journal.verseApplySchedule}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl"
                disabled={!scheduleReading || loading}
                onClick={() => handleApplySchedule(true)}
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                {copy.journal.verseApplyScheduleWithText}
              </Button>
            </div>
            <Button
              type="button"
              variant="ghost"
              className="w-full rounded-xl"
              disabled={!scheduleReading || loading}
              onClick={() => void handleInsertScheduleVerses()}
            >
              {copy.journal.verseInsertPassageOnly}
            </Button>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>{copy.journal.verseBookLabel}</Label>
                <BibleBookCombobox books={BIBLE_BOOKS} value={bookAbbr} onChange={setBookAbbr} />
              </div>
              <div className="space-y-2">
                <Label>{copy.journal.verseChapterLabel}</Label>
                <BibleChapterCombobox
                  options={chapterOptions}
                  value={chapter}
                  onChange={setChapter}
                  bookAbbr={bookAbbr}
                  optionPrefix={copy.journal.verseChapterPrefix}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>{copy.journal.verseStartLabel}</Label>
                  <BibleChapterCombobox
                    options={verseOptions}
                    value={startVerse}
                    onChange={(value) => {
                      setStartVerse(value);
                      if (Number(value) > Number(endVerse)) setEndVerse(value);
                    }}
                    optionPrefix={copy.journal.verseNumberPrefix}
                    placeholder={copy.journal.verseStartLabel}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{copy.journal.verseEndLabel}</Label>
                  <BibleChapterCombobox
                    options={verseOptions}
                    value={endVerse}
                    onChange={setEndVerse}
                    optionPrefix={copy.journal.verseNumberPrefix}
                    placeholder={copy.journal.verseEndLabel}
                  />
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full rounded-xl"
              disabled={loading}
              onClick={() => void handlePreviewManual()}
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Search className="size-4" />
              )}
              {copy.journal.versePreview}
            </Button>

            {preview ? (
              <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded-2xl border border-[var(--m-line)] bg-[var(--m-wash)]/50 p-3 text-xs leading-relaxed text-[var(--m-ink)]">
                {preview}
              </pre>
            ) : null}

            <Button
              type="button"
              className="w-full rounded-xl"
              disabled={loading}
              onClick={() => void handleInsertManual()}
            >
              {copy.journal.verseInsert}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
