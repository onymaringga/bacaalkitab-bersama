"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Heart,
  Loader2,
  NotebookPen,
  RefreshCw,
} from "lucide-react";

import { BibleLoadingModal } from "@/components/bible/bible-loading-modal";
import { BibleFontSizeControl } from "@/components/bible/bible-font-size-control";
import { BibleReadingThemeControl } from "@/components/bible/bible-reading-theme-control";
import { BibleVersionPicker } from "@/components/bible/bible-version-picker";
import { ChapterNoteCard } from "@/components/bible/chapter-note-card";
import { DevotionalPanel } from "@/components/bible/devotional-panel";
import { MarkChapterCompleteButton } from "@/components/bible/mark-chapter-complete";
import { PassageFullscreenReader } from "@/components/bible/passage-fullscreen-reader";
import { PassageChapterJump } from "@/components/bible/passage-chapter-jump";
import {
  PassageHighlightableVerses,
  PassageViewModeToolbar,
  type PassageViewMode,
} from "@/components/bible/passage-highlightable-verses";
import { PassageSpeechControls } from "@/components/bible/passage-speech-controls";
import { PassageVerseNotesPanel } from "@/components/bible/passage-verse-notes-panel";
import { ReadingSessionTimer } from "@/components/bible/reading-session-timer";
import { Button } from "@/components/ui/button";
import { ReadingTimeLabel } from "@/components/ui/reading-time-label";
import { chapterFromSectionTitle } from "@/lib/bible-compare";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BiblePassageResult } from "@/lib/bible-api";
import type { BibleVersionCode } from "@/lib/bible-books";
import { getChapterOptions, getNextChapter, getPreviousChapter } from "@/lib/bible-chapters";
import {
  getBibleFontSizeOption,
  getServerBibleFontSize,
  readBibleFontSize,
  subscribeBibleFontSize,
} from "@/lib/bible-font-size";
import {
  getServerBibleReadingTheme,
  readBibleReadingTheme,
  subscribeBibleReadingTheme,
} from "@/lib/bible-reading-theme";
import { makePassageHighlightKey } from "@/lib/bible-highlights";
import {
  prefetchPassage,
  resolveCachedPassage,
  setCachedPassage,
} from "@/lib/bible-passage-cache";
import {
  readPreferredBibleVersion,
  writePreferredBibleVersion,
} from "@/lib/bible-version-preference";
import { copy } from "@/lib/copy";
import { parsePassage } from "@/lib/passage-parser";
import {
  getNextScheduledReading,
  getPreviousScheduledReading,
} from "@/lib/reading-progress";
import {
  estimateReadingTimeForPassage,
  readingTimeFromTexts,
} from "@/lib/reading-time";
import { cn } from "@/lib/utils";

type PassageReaderProps = {
  passage: string;
  /** Tanggal jadwal terkait (sinkron tombol selesai ↔ panel tanggal). */
  dateKey?: string;
  /** Loncat & flash highlight ke ayat ini setelah pasal termuat. */
  focusVerse?: number | null;
  defaultExpanded?: boolean;
  embedded?: boolean;
  showChapterNav?: boolean;
  /** Ganti bacaan; `nextDateKey` diisi saat navigasi antar hari jadwal. */
  onPassageChange?: (passage: string, nextDateKey?: string) => void;
  className?: string;
  /** Judul pasal lebih ringkas (mis. di kartu jadwal). */
  compact?: boolean;
  /** Sembunyikan tombol tandai selesai di header. */
  hideMarkComplete?: boolean;
  /** Sembunyikan judul pasal (sudah ditampilkan di luar). */
  hideTitle?: boolean;
  /** Pratinjau singkat: hanya N ayat pertama, tanpa tab/kontrol penuh. */
  sneakPeek?: number;
};

const readerTabTriggerClass =
  "h-full min-w-0 flex-1 gap-1.5 rounded-xl px-1.5 text-[0.7rem] font-semibold tracking-tight text-[var(--m-ink-soft)] shadow-none transition-[color,background-color,box-shadow] duration-150 sm:gap-2 sm:px-2.5 sm:text-[0.8125rem] hover:bg-[var(--m-wash)]/85 hover:text-[var(--m-ink)] data-active:bg-[var(--m-accent)] data-active:text-white data-active:shadow-[0_1px_2px_oklch(0.45_0.12_255_/_0.28)] data-active:hover:bg-[var(--m-accent)] data-active:hover:text-white";

export function PassageReader({
  passage,
  dateKey,
  focusVerse = null,
  defaultExpanded = true,
  embedded = false,
  showChapterNav = false,
  onPassageChange,
  className,
  compact = false,
  hideMarkComplete = false,
  hideTitle = false,
  sneakPeek,
}: PassageReaderProps) {
  const [expanded, setExpanded] = useState(defaultExpanded || embedded);
  const [data, setData] = useState<BiblePassageResult | null>(null);
  const [readerTab, setReaderTab] = useState<"kitab" | "renungan" | "refleksi">(
    "kitab",
  );
  const [loading, setLoading] = useState(defaultExpanded || embedded);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState<BibleVersionCode>("tb");
  const [showSlowModal, setShowSlowModal] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [viewMode, setViewMode] = useState<PassageViewMode>("all");
  const contentRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);

  const fontSizeId = useSyncExternalStore(
    subscribeBibleFontSize,
    readBibleFontSize,
    getServerBibleFontSize,
  );
  const fontSize = getBibleFontSizeOption(fontSizeId);
  const readingTheme = useSyncExternalStore(
    subscribeBibleReadingTheme,
    readBibleReadingTheme,
    getServerBibleReadingTheme,
  );

  useEffect(() => {
    setReaderTab("kitab");
  }, [passage]);

  useEffect(() => {
    setVersion(readPreferredBibleVersion());
  }, []);

  const parsed = useMemo(() => parsePassage(passage), [passage]);
  const reflectionReference = useMemo(() => {
    if (parsed?.wholeChapter && !parsed.endChapter) {
      return `${parsed.bookName} ${parsed.chapter}`;
    }
    return passage;
  }, [parsed, passage]);
  const chapterNavEnabled = showChapterNav && parsed?.wholeChapter === true;

  const chapterOptions = useMemo(() => {
    if (!chapterNavEnabled || !parsed) return [];
    return getChapterOptions(parsed.bookAbbr);
  }, [chapterNavEnabled, parsed]);

  const previousChapter = useMemo(() => {
    if (!chapterNavEnabled || !parsed) return null;
    return getPreviousChapter(parsed.bookAbbr, parsed.chapter);
  }, [chapterNavEnabled, parsed]);

  const nextChapter = useMemo(() => {
    if (!chapterNavEnabled || !parsed) return null;
    const endChapter = parsed.endChapter ?? parsed.chapter;
    return getNextChapter(parsed.bookAbbr, endChapter);
  }, [chapterNavEnabled, parsed]);

  const previousSchedule = useMemo(() => {
    if (!dateKey) return null;
    return getPreviousScheduledReading(dateKey);
  }, [dateKey]);

  const nextSchedule = useMemo(() => {
    if (!dateKey) return null;
    return getNextScheduledReading(dateKey);
  }, [dateKey]);

  const canGoPrevious = Boolean(previousSchedule || previousChapter);
  const canGoNext = Boolean(nextSchedule || nextChapter);

  const loadPassage = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setError(null);

    const cached = resolveCachedPassage(passage, version);
    if (cached) {
      setData(cached);
      setLoading(false);
      setShowSlowModal(false);
      // Sudah ada di cache (sering dari prefetch) — langsung pakai, tanpa tunggu jaringan
      return;
    }

    // Jangan tampilkan pasal lama saat ganti pasal
    setData(null);
    setLoading(true);

    const slowTimer = window.setTimeout(() => {
      if (requestIdRef.current === requestId) {
        setShowSlowModal(true);
      }
    }, 450);

    try {
      const response = await fetch(
        `/api/bible/passage?passage=${encodeURIComponent(passage)}&ver=${version}`,
      );
      const payload = (await response.json()) as
        | BiblePassageResult
        | { error: string };

      if (requestIdRef.current !== requestId) return;

      if (!response.ok || "error" in payload) {
        throw new Error(
          "error" in payload ? payload.error : "Gagal memuat ayat.",
        );
      }

      setCachedPassage(passage, version, payload);
      setData(payload);
      setError(null);
    } catch (err) {
      if (requestIdRef.current !== requestId) return;
      setError(err instanceof Error ? err.message : "Gagal memuat ayat.");
      setData(null);
    } finally {
      window.clearTimeout(slowTimer);
      if (requestIdRef.current === requestId) {
        setLoading(false);
        setShowSlowModal(false);
      }
    }
  }, [passage, version]);

  useEffect(() => {
    if (!expanded) return;
    void loadPassage();
  }, [expanded, loadPassage]);

  useEffect(() => {
    if (!chapterNavEnabled) return;
    if (previousSchedule) {
      prefetchPassage(previousSchedule.passage, version);
    } else if (previousChapter) {
      prefetchPassage(previousChapter.reference, version);
    }
  }, [chapterNavEnabled, previousChapter, previousSchedule, version]);

  useEffect(() => {
    if (!chapterNavEnabled) return;
    if (nextSchedule) {
      prefetchPassage(nextSchedule.passage, version);
    } else if (nextChapter) {
      prefetchPassage(nextChapter.reference, version);
    }
  }, [chapterNavEnabled, nextChapter, nextSchedule, version]);

  useEffect(() => {
    if (!loading && data && chapterNavEnabled) {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [passage, loading, data, chapterNavEnabled]);

  function navigateTo(reference: string, nextDateKey?: string) {
    onPassageChange?.(reference, nextDateKey);
  }

  function goPrevious() {
    if (previousSchedule) {
      navigateTo(previousSchedule.passage, previousSchedule.scheduledDate);
      return;
    }
    if (previousChapter) navigateTo(previousChapter.reference);
  }

  function goNext() {
    if (nextSchedule) {
      navigateTo(nextSchedule.passage, nextSchedule.scheduledDate);
      return;
    }
    if (nextChapter) navigateTo(nextChapter.reference);
  }

  function handleVersionChange(next: BibleVersionCode) {
    setVersion(next);
    writePreferredBibleVersion(next);
  }

  const displayTitle =
    parsed?.endChapter && parsed.endChapter !== parsed.chapter
      ? `${parsed.bookName} ${parsed.chapter}–${parsed.endChapter}`
      : parsed
        ? `${parsed.bookName} ${parsed.chapter}`
        : passage;

  /** Jangan ulang "Pasal N" kalau judul sudah "Kitab N". */
  const displaySubtitle =
    parsed?.wholeChapter
      ? null
      : passage !== displayTitle
        ? passage
        : null;

  const headerSubtitle = data?.subtitle?.trim() || displaySubtitle;

  const readingTimeLabel = useMemo(() => {
    if (data) {
      const fromText = readingTimeFromTexts(
        data.verses
          .filter((verse) => verse.type !== "title")
          .map((verse) => verse.content),
      );
      if (fromText) return fromText;
    }
    return estimateReadingTimeForPassage(passage);
  }, [data, passage]);

  const highlightKey = makePassageHighlightKey(passage, version);
  const peekVerses = useMemo(() => {
    if (!data || !sneakPeek || sneakPeek <= 0) return [];
    return data.verses
      .filter((verse) => verse.type !== "title")
      .slice(0, sneakPeek);
  }, [data, sneakPeek]);
  const isSneakPeek = Boolean(sneakPeek && sneakPeek > 0);

  const paperVerses = useMemo(() => {
    if (!data) return [];
    if (data.sections && data.sections.length > 0) {
      return data.sections.flatMap((section) => {
        const sectionChapter = chapterFromSectionTitle(
          section.title,
          data.book,
          data.chapter,
        );
        return section.verses
          .filter((verse) => verse.type !== "title")
          .map((verse) => ({
            verse: verse.verse,
            endVerse: verse.endVerse,
            content: verse.content,
            chapter: sectionChapter,
          }));
      });
    }
    return data.verses
      .filter((verse) => verse.type !== "title")
      .map((verse) => ({
        verse: verse.verse,
        endVerse: verse.endVerse,
        content: verse.content,
        chapter: data.chapter,
      }));
  }, [data]);

  return (
    <>
      <BibleLoadingModal
        open={expanded && !isSneakPeek && showSlowModal && loading && !data}
        passageLabel={displayTitle}
      />

      <PassageFullscreenReader
        open={fullscreenOpen && paperVerses.length > 0}
        onClose={() => setFullscreenOpen(false)}
        title={displayTitle}
        passage={passage}
        version={version}
        verses={paperVerses}
        readingTheme={readingTheme}
      />

      <section
      ref={contentRef}
      data-passage-shell
      data-bible-read-theme={readingTheme}
      className={cn(
        "rounded-2xl border transition-[background-color,border-color,color] duration-300",
        readingTheme === "night"
          ? "border-white/10 bg-[#14161c] text-[#e8eaef] lg:border-white/10 lg:bg-[#14161c]"
          : readingTheme === "kindle"
            ? "border-[#5b4636]/20 bg-[#fbf0d9] text-[#3b2f2a] lg:border-[#5b4636]/20 lg:bg-[#fbf0d9]"
            : "border-border/70 bg-card lg:border-[var(--m-line)] lg:bg-white/90",
        className,
      )}
    >
      <div className="space-y-3 border-b border-border/60 px-4 py-3.5 lg:px-6 lg:py-4">
        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2 text-[var(--m-accent)]">
            <BookOpen className="size-3.5 shrink-0" />
            <p className="truncate text-[11px] font-semibold tracking-[0.14em] uppercase">
              Bacaan
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {!hideMarkComplete ? (
              <MarkChapterCompleteButton
                passage={passage}
                dateKey={dateKey}
                reflectionReference={reflectionReference}
                compact
                onRequireReflection={() => setReaderTab("refleksi")}
              />
            ) : null}
            {!embedded ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 shrink-0 rounded-xl"
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded ? (
                  <>
                    Tutup
                    <ChevronUp className="size-4" />
                  </>
                ) : (
                  <>
                    Baca ayat
                    <ChevronDown className="size-4" />
                  </>
                )}
              </Button>
            ) : null}
          </div>
        </div>

        {!hideTitle ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 sm:gap-1.5">
              {chapterNavEnabled ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="-ml-1.5 size-9 shrink-0 rounded-xl"
                  disabled={!canGoPrevious || loading}
                  onClick={goPrevious}
                  aria-label={
                    previousSchedule
                      ? `${previousSchedule.passage} · hari sebelumnya`
                      : previousChapter
                        ? `${previousChapter.bookName} ${previousChapter.chapter}`
                        : "Bacaan sebelumnya"
                  }
                  title={
                    previousSchedule
                      ? `Hari sebelumnya · ${previousSchedule.passage}`
                      : previousChapter
                        ? `Pasal sebelumnya · ${previousChapter.bookName} ${previousChapter.chapter}`
                        : undefined
                  }
                >
                  <ChevronLeft className="size-4" />
                </Button>
              ) : null}
              <h2
                className={cn(
                  "min-w-0 flex-1 leading-[1.12] text-[var(--m-ink)]",
                  compact
                    ? "text-xl font-semibold tracking-tight sm:text-2xl"
                    : "member-web-display text-[clamp(1.55rem,3.4vw,2.15rem)]",
                )}
              >
                {displayTitle}
              </h2>
              {chapterNavEnabled ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="-mr-1.5 size-9 shrink-0 rounded-xl"
                  disabled={!canGoNext || loading}
                  onClick={goNext}
                  aria-label={
                    nextSchedule
                      ? `${nextSchedule.passage} · hari berikutnya`
                      : nextChapter
                        ? `${nextChapter.bookName} ${nextChapter.chapter}`
                        : "Bacaan berikutnya"
                  }
                  title={
                    nextSchedule
                      ? `Hari berikutnya · ${nextSchedule.passage}`
                      : nextChapter
                        ? `Pasal berikutnya · ${nextChapter.bookName} ${nextChapter.chapter}`
                        : undefined
                  }
                >
                  <ChevronRight className="size-4" />
                </Button>
              ) : null}
            </div>
            {data?.subtitle?.trim() ? (
              <p className="max-w-2xl text-[1.05rem] font-medium leading-snug text-[var(--m-ink-soft)] sm:text-[1.2rem] sm:leading-snug">
                {data.subtitle.trim()}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {expanded ? (
        <div
          className={cn(
            "space-y-3 px-4 pb-4 pt-4 lg:px-6 lg:pb-5 lg:pt-5",
            isSneakPeek && "space-y-3 py-4",
          )}
        >
          {loading && !data ? (
            <div
              className={cn(
                "flex flex-col items-center justify-center gap-3 text-center",
                isSneakPeek ? "min-h-20 py-4" : "min-h-40 py-8",
              )}
            >
              <Loader2 className="size-6 animate-spin text-[var(--m-accent)]" />
              <p className="text-sm font-medium text-[var(--m-ink-soft)]">
                Memuat teks Alkitab…
              </p>
            </div>
          ) : null}

          {!loading && error && !data ? (
            <div className="space-y-3 rounded-lg bg-destructive/5 p-4 text-sm">
              <p className="text-destructive">{error}</p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={loadPassage}
              >
                <RefreshCw className="size-3.5" />
                Coba lagi
              </Button>
            </div>
          ) : null}

          {data && isSneakPeek ? (
            <div className="space-y-3">
              <div className="space-y-2.5">
                {peekVerses.map((verse) => (
                  <p
                    key={verse.verse}
                    className={cn(
                      "text-[var(--m-ink)]",
                      fontSize.verseClass,
                    )}
                  >
                    <sup
                      className={cn(
                        "mr-1.5 font-semibold text-[var(--m-accent)]",
                        fontSize.verseNumberClass,
                      )}
                    >
                      {verse.verse}
                    </sup>
                    {verse.content}
                  </p>
                ))}
              </div>
              {(data.verses.filter((verse) => verse.type !== "title").length >
                peekVerses.length) ? (
                <p className="text-xs font-medium text-[var(--m-ink-soft)]">
                  … buka bacaan lengkap untuk ayat selanjutnya
                </p>
              ) : null}
            </div>
          ) : null}

          {data && !isSneakPeek ? (
            <Tabs
              value={readerTab}
              onValueChange={(value) => {
                if (
                  value === "kitab" ||
                  value === "renungan" ||
                  value === "refleksi"
                ) {
                  setReaderTab(value);
                }
              }}
              className="space-y-3"
            >
              <TabsList className="grid h-11 min-h-11 w-full grid-cols-3 items-stretch gap-0.5 rounded-2xl border border-[var(--m-line)] bg-[var(--m-wash)]/55 p-1 group-data-horizontal/tabs:h-11">
                <TabsTrigger
                  value="kitab"
                  className={readerTabTriggerClass}
                >
                  <BookOpen className="size-3.5 shrink-0 sm:size-4" />
                  <span className="truncate">{copy.bible.tabScripture}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="renungan"
                  className={readerTabTriggerClass}
                >
                  <Heart className="size-3.5 shrink-0 sm:size-4" />
                  <span className="truncate">{copy.bible.tabDevotional}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="refleksi"
                  className={readerTabTriggerClass}
                >
                  <NotebookPen className="size-3.5 shrink-0 sm:size-4" />
                  <span className="truncate">
                    <span className="sm:hidden">Refleksi</span>
                    <span className="hidden sm:inline">
                      {copy.bible.tabReflection}
                    </span>
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="kitab"
                className={cn(
                  "space-y-3 outline-none transition-opacity",
                  loading && "opacity-60",
                )}
              >
                <div
                  className={cn(
                    "space-y-3 transition-[background-color,color,padding] duration-300",
                    readingTheme === "kindle" && "px-4 py-5 sm:px-10 sm:py-8",
                    readingTheme === "night" && "px-1 py-2 sm:px-2 sm:py-3",
                  )}
                >
                <div className="sticky top-3 z-30 -mx-0.5 sm:top-4">
                  <div
                    data-bible-kindle-toolbar={
                      readingTheme === "kindle" ? "" : undefined
                    }
                    data-bible-night-toolbar={
                      readingTheme === "night" ? "" : undefined
                    }
                    className={cn(
                      "rounded-2xl border border-[var(--m-line)] px-1.5 py-1 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.35)] backdrop-blur-md",
                      readingTheme === "kindle"
                        ? "rounded-xl bg-[#f7e9c8]/95 shadow-[0_6px_18px_-14px_rgba(60,40,20,0.35)] supports-[backdrop-filter]:bg-[#f7e9c8]/90"
                        : readingTheme === "night"
                          ? "rounded-xl bg-[#1a1d24]/95 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.55)] supports-[backdrop-filter]:bg-[#1a1d24]/90"
                          : "bg-white/95 supports-[backdrop-filter]:bg-white/90",
                    )}
                  >
                    <div className="flex h-9 min-w-0 items-center gap-1 overflow-x-auto overflow-y-visible sm:gap-1.5">
                      <BibleVersionPicker
                        value={version}
                        onChange={handleVersionChange}
                        compact
                        className="w-auto shrink-0"
                        triggerClassName="h-8 border-0 bg-[var(--m-wash)]/70 px-2.5 shadow-none hover:bg-[var(--m-wash)]"
                      />

                      <div className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-[var(--m-wash)]/45 px-2">
                        {readingTimeLabel ? (
                          <ReadingTimeLabel
                            label={readingTimeLabel}
                            className="whitespace-nowrap text-[11px]"
                          />
                        ) : null}
                        {readingTimeLabel ? (
                          <span
                            className="h-3 w-px shrink-0 bg-[var(--m-line)]"
                            aria-hidden
                          />
                        ) : null}
                        <ReadingSessionTimer
                          passage={reflectionReference}
                          passageLabel={displayTitle}
                          compact
                          className="whitespace-nowrap text-[11px]"
                        />
                      </div>

                      <div className="ml-auto flex h-8 shrink-0 items-center gap-1">
                        {!loading ? (
                          <PassageSpeechControls
                            title={displayTitle}
                            subtitle={headerSubtitle}
                            verses={data.verses.filter(
                              (verse) => verse.type !== "title",
                            )}
                            iconOnly
                            className="shrink-0"
                          />
                        ) : null}
                        <BibleReadingThemeControl className="shrink-0" />
                        <BibleFontSizeControl
                          iconOnly
                          className="h-8 shrink-0 border-0 bg-[var(--m-wash)]/55 p-0 shadow-none"
                        />
                        <PassageViewModeToolbar
                          passageKey={highlightKey}
                          viewMode={viewMode}
                          onViewModeChange={setViewMode}
                          onOpenFullscreen={() => setFullscreenOpen(true)}
                          fullscreenDisabled={
                            loading || paperVerses.length === 0
                          }
                          bare
                          className="h-8 shrink-0 rounded-lg border-0 bg-[var(--m-wash)]/55 p-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="min-w-0"
                  data-bible-kindle-page={
                    readingTheme === "kindle" ? "" : undefined
                  }
                >
                  <PassageHighlightableVerses
                    passageKey={highlightKey}
                    passageLabel={displayTitle}
                    bookName={data.book}
                    chapter={data.chapter}
                    version={version}
                    focusVerse={focusVerse}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    hideViewToolbar
                    onOpenFullscreen={() => setFullscreenOpen(true)}
                    fullscreenDisabled={loading || paperVerses.length === 0}
                    readingTheme={readingTheme}
                    sections={
                      data.sections && data.sections.length > 0
                        ? data.sections.map((section, index) => {
                            const sectionTitle =
                              section.title?.trim() || undefined;
                            const subtitle = data.subtitle?.trim();
                            // Judul pertama sudah di header sebagai subtitle —
                            // jangan ulang di badan teks.
                            const hideDuplicateTitle =
                              !hideTitle &&
                              index === 0 &&
                              Boolean(subtitle) &&
                              sectionTitle === subtitle;
                            const sectionChapter = chapterFromSectionTitle(
                              sectionTitle,
                              data.book,
                              data.chapter,
                            );
                            return {
                              title: hideDuplicateTitle
                                ? undefined
                                : sectionTitle,
                              verses: section.verses
                                .filter((verse) => verse.type !== "title")
                                .map((verse) => ({
                                  verse: verse.verse,
                                  endVerse: verse.endVerse,
                                  content: verse.content,
                                  chapter: sectionChapter,
                                  key: `${section.title}-${verse.verse}`,
                                })),
                            };
                          })
                        : [
                            {
                              verses: data.verses
                                .filter((verse) => verse.type !== "title")
                                .map((verse) => ({
                                  verse: verse.verse,
                                  endVerse: verse.endVerse,
                                  content: verse.content,
                                  chapter: data.chapter,
                                  key: String(verse.verse),
                                })),
                            },
                          ]
                    }
                  />

                  {chapterNavEnabled && parsed ? (
                    <nav
                      aria-label="Navigasi pasal"
                      className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-2 border-t border-[var(--m-line)]/70 pt-3"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 min-w-0 rounded-xl border-[var(--m-line)] bg-white px-2.5 font-semibold sm:px-3"
                        disabled={!canGoPrevious || loading}
                        onClick={goPrevious}
                      >
                        <ChevronLeft className="size-4 shrink-0" />
                        <span className="truncate">
                          {previousSchedule ? "Hari lalu" : "Sebelumnya"}
                        </span>
                      </Button>

                      <PassageChapterJump
                        options={chapterOptions}
                        value={parsed.chapter}
                        disabled={loading}
                        onChange={(chapter) => {
                          navigateTo(`${parsed.bookName} ${chapter}`);
                        }}
                      />

                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 min-w-0 rounded-xl border-[var(--m-line)] bg-white px-2.5 font-semibold sm:px-3"
                        disabled={!canGoNext || loading}
                        onClick={goNext}
                      >
                        <span className="truncate">
                          {nextSchedule ? "Hari depan" : "Berikutnya"}
                        </span>
                        <ChevronRight className="size-4 shrink-0" />
                      </Button>
                    </nav>
                  ) : null}
                </div>
                </div>
              </TabsContent>

              <TabsContent value="renungan" className="outline-none">
                <DevotionalPanel passage={passage} embedded />
              </TabsContent>

              <TabsContent value="refleksi" className="space-y-4 outline-none">
                <ChapterNoteCard
                  reference={reflectionReference}
                  markCompleteOnSave={
                    hideMarkComplete
                      ? undefined
                      : { passage, dateKey }
                  }
                />
                <PassageVerseNotesPanel
                  passageKey={highlightKey}
                  passageLabel={displayTitle}
                />
              </TabsContent>
            </Tabs>
          ) : null}
        </div>
      ) : null}
    </section>
    </>
  );
}
