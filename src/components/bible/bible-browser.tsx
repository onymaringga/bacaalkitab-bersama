"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  BookOpenCheck,
  CalendarDays,
  Info,
  Loader2,
  Search,
} from "lucide-react";

import { BibleBookCombobox } from "@/components/bible/bible-book-combobox";
import { BibleChapterCombobox } from "@/components/bible/bible-chapter-combobox";
import { PassageReader } from "@/components/bible/passage-reader";
import { ScheduleDateCombobox } from "@/components/bible/schedule-date-combobox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TitleWithHint } from "@/components/ui/title-with-hint";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getChapterOptions, getVerseOptions } from "@/lib/bible-chapters";
import { BIBLE_BOOKS } from "@/lib/bible-books";
import { searchBible, type BibleSearchHit } from "@/lib/bible-search";
import {
  searchCachedPassagesForKeyword,
  type BibleKeywordHit,
} from "@/lib/bible-keyword-search";
import { copy } from "@/lib/copy";
import { formatDisplayDate, formatShortDate } from "@/lib/format-date";
import { buildPassageReference, parsePassage } from "@/lib/passage-parser";
import { markPassageOpened } from "@/lib/bible-opened-chapters";
import { loadPassageClient } from "@/lib/bible-passage-cache";
import { readPreferredBibleVersion } from "@/lib/bible-version-preference";
import type { BiblePassageResult } from "@/lib/bible-api";
import {
  countMissedAssignedDays,
  getScheduleDateForPassage,
  readCompletedDates,
  searchAssignedSchedule,
} from "@/lib/reading-progress";
import { getTodayKey } from "@/lib/reading-status";
import { subscribeScheduleProgress } from "@/lib/schedule-progress-stats";
import type { ReadingSchedule } from "@/lib/types";
import { cn } from "@/lib/utils";

function countPassageVerses(data: BiblePassageResult) {
  if (data.sections && data.sections.length > 0) {
    return data.sections.reduce(
      (sum, section) =>
        sum + section.verses.filter((verse) => verse.type !== "title").length,
      0,
    );
  }
  return data.verses.filter((verse) => verse.type !== "title").length;
}

function getInitialPicker(reference: string | null, verseParam?: string | null) {
  const verseFromParam = verseParam ? Number(verseParam) : NaN;
  const focusVerse =
    Number.isFinite(verseFromParam) && verseFromParam > 0
      ? String(verseFromParam)
      : "";

  if (!reference) {
    return {
      bookAbbr: "Mat",
      chapter: "1",
      verse: focusVerse,
      activePassage: null as string | null,
    };
  }

  const parsed = parsePassage(reference);
  if (!parsed) {
    return {
      bookAbbr: "Mat",
      chapter: "1",
      verse: focusVerse,
      activePassage: reference,
    };
  }

  const verseFromPassage =
    !parsed.wholeChapter && parsed.startVerse > 0
      ? String(parsed.startVerse)
      : "";

  return {
    bookAbbr: parsed.bookAbbr,
    chapter: String(parsed.chapter),
    verse: focusVerse || verseFromPassage,
    activePassage: parsed.wholeChapter
      ? reference
      : `${parsed.bookName} ${parsed.chapter}`,
  };
}

export function BibleBrowser({ browseMode = false }: { browseMode?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPassage = searchParams.get("passage");
  const scheduleDate = searchParams.get("date") ?? undefined;
  const focusVerseParam = searchParams.get("verse");
  const readingDateKey = scheduleDate ?? getTodayKey();
  const readingDateLabel = formatDisplayDate(readingDateKey);
  const initial = getInitialPicker(initialPassage, focusVerseParam);

  const [bookAbbr, setBookAbbr] = useState(initial.bookAbbr);
  const [chapter, setChapter] = useState(initial.chapter);
  const [verse, setVerse] = useState(initial.verse);
  const [verseOptions, setVerseOptions] = useState<number[]>(() =>
    getVerseOptions(40),
  );
  const [activePassage, setActivePassage] = useState<string | null>(
    initial.activePassage,
  );
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [verseHits, setVerseHits] = useState<BibleKeywordHit[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [pickMode, setPickMode] = useState<"kitab" | "tanggal">("tanggal");
  const [readingLoading, setReadingLoading] = useState(false);

  const completedDatesKey = useSyncExternalStore(
    subscribeScheduleProgress,
    () => readCompletedDates().join(","),
    () => "",
  );
  const missedDays = useMemo(() => {
    void completedDatesKey;
    return countMissedAssignedDays();
  }, [completedDatesKey]);

  /** Tanggal jadwal untuk pasal yang sedang dibuka (jika ada). */
  const dateFieldValue = useMemo(() => {
    if (scheduleDate) return scheduleDate;
    if (activePassage) return getScheduleDateForPassage(activePassage);
    return undefined;
  }, [scheduleDate, activePassage]);

  const dateHasSchedule = Boolean(dateFieldValue);

  useEffect(() => {
    if (initialPassage) markPassageOpened(initialPassage);
  }, [initialPassage]);

  useEffect(() => {
    if (initialPassage) {
      const picker = getInitialPicker(initialPassage, focusVerseParam);
      setActivePassage(picker.activePassage);
      setBookAbbr(picker.bookAbbr);
      setChapter(picker.chapter);
      setVerse(picker.verse);
    }
  }, [initialPassage, focusVerseParam]);

  useEffect(() => {
    if (scheduleDate) setPickMode("tanggal");
  }, [scheduleDate]);

  const selectedBook = useMemo(
    () => BIBLE_BOOKS.find((book) => book.abbr === bookAbbr) ?? BIBLE_BOOKS[39],
    [bookAbbr],
  );

  const chapterOptions = useMemo(
    () => getChapterOptions(selectedBook.abbr),
    [selectedBook.abbr],
  );

  // Muat jumlah ayat untuk pasal terpilih (opsional + akurat)
  useEffect(() => {
    let cancelled = false;
    const chapterNum = Number(chapter);
    if (!Number.isFinite(chapterNum) || chapterNum < 1) {
      setVerseOptions(getVerseOptions(40));
      return;
    }

    const reference = `${selectedBook.name} ${chapterNum}`;
    void loadPassageClient(reference, readPreferredBibleVersion()).then(
      (data) => {
        if (cancelled) return;
        if (!data) {
          setVerseOptions(getVerseOptions(40));
          return;
        }
        const count = Math.max(1, countPassageVerses(data));
        setVerseOptions(Array.from({ length: count }, (_, i) => i + 1));
        setVerse((current) => {
          if (!current) return "";
          const n = Number(current);
          return Number.isFinite(n) && n >= 1 && n <= count ? current : "";
        });
      },
    );

    return () => {
      cancelled = true;
    };
  }, [selectedBook.name, chapter]);

  const focusVerseNumber = useMemo(() => {
    const n = Number(focusVerseParam);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [focusVerseParam]);

  const bookHits = useMemo(
    () => searchBible(searchQuery, 8),
    [searchQuery],
  );

  const dateHits = useMemo(
    () =>
      searchQuery.trim().length >= 1
        ? searchAssignedSchedule(searchQuery, 6)
        : [],
    [searchQuery],
  );

  const cachedVerseHits = useMemo(
    () =>
      searchQuery.trim().length >= 2
        ? searchCachedPassagesForKeyword(
            searchQuery,
            readPreferredBibleVersion(),
            12,
          )
        : [],
    [searchQuery],
  );

  const mergedVerseHits = useMemo(() => {
    const seen = new Set<string>();
    const merged: BibleKeywordHit[] = [];
    for (const hit of [...verseHits, ...cachedVerseHits]) {
      if (seen.has(hit.reference)) continue;
      seen.add(hit.reference);
      merged.push(hit);
      if (merged.length >= 20) break;
    }
    return merged;
  }, [verseHits, cachedVerseHits]);

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setVerseHits([]);
      setSearchLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearchLoading(true);
      try {
        const ver = readPreferredBibleVersion();
        const response = await fetch(
          `/api/bible/search?q=${encodeURIComponent(q)}&ver=${ver}`,
          { signal: controller.signal },
        );
        const payload = (await response.json()) as {
          verses?: BibleKeywordHit[];
        };
        setVerseHits(payload.verses ?? []);
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setVerseHits([]);
      } finally {
        setSearchLoading(false);
      }
    }, 320);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [searchQuery]);

  function syncPickerFromPassage(reference: string, focusVerse?: number) {
    const parsed = parsePassage(reference);
    if (!parsed) return;

    setBookAbbr(parsed.bookAbbr);
    setChapter(String(parsed.chapter));
    if (focusVerse != null && focusVerse > 0) {
      setVerse(String(focusVerse));
    } else if (!parsed.wholeChapter && parsed.startVerse > 0) {
      setVerse(String(parsed.startVerse));
    } else {
      setVerse("");
    }
    setError(null);
  }

  function openReference(
    reference: string,
    dateKey?: string,
    focusVerse?: number,
  ) {
    const parsed = parsePassage(reference);
    const chapterReference =
      parsed && !parsed.wholeChapter
        ? `${parsed.bookName} ${parsed.chapter}`
        : reference;
    const verseFocus =
      focusVerse ??
      (parsed && !parsed.wholeChapter ? parsed.startVerse : undefined);

    syncPickerFromPassage(chapterReference, verseFocus);
    setError(null);
    setActivePassage(chapterReference);
    setSearchQuery("");
    setPickMode(dateKey ? "tanggal" : "kitab");
    markPassageOpened(chapterReference);

    const params = new URLSearchParams();
    params.set("passage", chapterReference);
    if (verseFocus && verseFocus > 0) {
      params.set("verse", String(verseFocus));
    }
    if (dateKey) {
      params.set("date", dateKey);
    } else if (browseMode || !scheduleDate) {
      params.set("browse", "1");
    } else if (scheduleDate) {
      params.set("date", scheduleDate);
    }
    router.replace(`/baca?${params.toString()}`, { scroll: false });
  }

  function openScheduledReading(reading: ReadingSchedule) {
    openReference(reading.passage, reading.scheduledDate);
  }

  function handleBookChange(value: string) {
    setBookAbbr(value);
    setChapter("1");
    setVerse("");
    setError(null);
  }

  function handleChapterChange(value: string) {
    setChapter(value);
    setVerse("");
    setError(null);
  }

  async function handleRead() {
    if (readingLoading) return;
    const chapterNum = Number(chapter);

    if (!Number.isFinite(chapterNum) || chapterNum < 1) {
      setError(copy.bible.invalidChapter);
      return;
    }

    const verseNum = verse ? Number(verse) : 0;
    if (verse && (!Number.isFinite(verseNum) || verseNum < 1)) {
      setError(copy.bible.invalidVerse);
      return;
    }

    const parsed = buildPassageReference({
      bookName: selectedBook.name,
      bookAbbr: selectedBook.abbr,
      chapter: chapterNum,
      startVerse: 1,
      endVerse: 1,
      wholeChapter: true,
    });

    setError(null);
    setReadingLoading(true);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 700));
      openReference(
        parsed.reference,
        undefined,
        verseNum > 0 ? verseNum : undefined,
      );
    } finally {
      setReadingLoading(false);
    }
  }

  function handleSearchHit(hit: BibleSearchHit) {
    openReference(hit.reference);
  }

  function handleVerseHit(hit: BibleKeywordHit) {
    openReference(hit.chapterReference, undefined, hit.verse);
  }

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    const topBook = bookHits[0];
    if (topBook) {
      handleSearchHit(topBook);
      return;
    }
    const topDate = dateHits[0];
    if (topDate) {
      openScheduledReading(topDate);
      return;
    }
    const topVerse = mergedVerseHits[0];
    if (topVerse) {
      handleVerseHit(topVerse);
      return;
    }
    const parsed = parsePassage(searchQuery.trim());
    if (parsed) {
      openReference(
        parsed.wholeChapter
          ? parsed.reference
          : `${parsed.bookName} ${parsed.chapter}`,
        undefined,
        parsed.wholeChapter ? undefined : parsed.startVerse,
      );
      return;
    }
    setError(copy.bible.searchEmpty);
  }

  function handlePassageChange(reference: string, nextDateKey?: string) {
    syncPickerFromPassage(reference);
    setActivePassage(reference);
    markPassageOpened(reference);
    const params = new URLSearchParams();
    params.set("passage", reference);
    if (nextDateKey) {
      params.set("date", nextDateKey);
      setPickMode("tanggal");
    } else if (browseMode) {
      params.set("browse", "1");
    } else if (scheduleDate) {
      params.set("date", scheduleDate);
    } else {
      params.set("browse", "1");
    }
    router.replace(`/baca?${params.toString()}`, { scroll: false });
  }

  const isSearching = searchQuery.trim().length > 0;

  const filteredBooks = useMemo(() => {
    if (!isSearching) return BIBLE_BOOKS;
    const abbrs = new Set(bookHits.map((hit) => hit.bookAbbr));
    if (abbrs.size === 0) return [];
    return BIBLE_BOOKS.filter((book) => abbrs.has(book.abbr));
  }, [bookHits, isSearching]);

  const chapterHits = useMemo(
    () => bookHits.filter((hit) => hit.kind === "chapter"),
    [bookHits],
  );

  const picker = (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="space-y-2">
        <Label htmlFor="bible-search">{copy.bible.searchLabel}</Label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="bible-search"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setError(null);
            }}
            placeholder={copy.bible.searchPlaceholder}
            className="h-11 pl-9"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
      </form>

      {isSearching &&
      (mergedVerseHits.length > 0 ||
        searchLoading ||
        chapterHits.length > 0 ||
        dateHits.length > 0) ? (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {dateHits.length > 0 ? (
            <div>
              <p className="border-b border-border bg-muted/40 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                {copy.bible.searchDates}
              </p>
              <ul className="divide-y divide-border">
                {dateHits.map((hit) => (
                  <li key={hit.scheduledDate}>
                    <button
                      type="button"
                      onClick={() => openScheduledReading(hit)}
                      className="flex w-full items-start gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/50"
                    >
                      <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="min-w-0">
                        <span className="block font-semibold">
                          {formatShortDate(hit.scheduledDate)}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {hit.title} · {hit.passage}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {chapterHits.length > 0 ? (
            <div className={cn(dateHits.length > 0 && "border-t border-border")}>
              <p className="border-b border-border bg-muted/40 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                Pasal cocok
              </p>
              <ul className="divide-y divide-border">
                {chapterHits.slice(0, 4).map((hit) => (
                  <li key={`${hit.bookAbbr}-${hit.chapter}`}>
                    <button
                      type="button"
                      onClick={() => handleSearchHit(hit)}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/50"
                    >
                      <BookOpen className="size-4 shrink-0 text-primary" />
                      <span className="font-semibold">{hit.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {mergedVerseHits.length > 0 || searchLoading ? (
            <div
              className={cn(
                (dateHits.length > 0 || chapterHits.length > 0) &&
                  "border-t border-border",
              )}
            >
              <p className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                {copy.bible.searchVerses}
                {searchLoading ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : null}
              </p>
              {mergedVerseHits.length === 0 && searchLoading ? (
                <p className="px-3 py-3 text-sm text-muted-foreground">
                  {copy.bible.searchLoading}
                </p>
              ) : mergedVerseHits.length === 0 ? null : (
                <ul className="max-h-40 divide-y divide-border overflow-y-auto">
                  {mergedVerseHits.map((hit) => (
                    <li key={hit.reference}>
                      <button
                        type="button"
                        onClick={() => handleVerseHit(hit)}
                        className="flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
                      >
                        <Search className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-foreground">
                            {hit.reference}
                          </span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                            {hit.snippet}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        className="grid grid-cols-2 gap-1 rounded-xl border border-[var(--m-line)] bg-[var(--m-wash)]/50 p-1"
        role="tablist"
        aria-label={copy.bible.pickModeAria}
      >
        <button
          type="button"
          role="tab"
          aria-selected={pickMode === "tanggal"}
          onClick={() => {
            setPickMode("tanggal");
            setError(null);
          }}
          className={cn(
            "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition-colors",
            pickMode === "tanggal"
              ? "bg-[var(--m-accent)] text-white"
              : "text-[var(--m-ink-soft)] hover:bg-[var(--m-wash)]/80 hover:text-[var(--m-ink)]",
          )}
        >
          <CalendarDays className="size-3.5 shrink-0" />
          {copy.bible.pickByDate}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={pickMode === "kitab"}
          onClick={() => {
            setPickMode("kitab");
            setError(null);
          }}
          className={cn(
            "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition-colors",
            pickMode === "kitab"
              ? "bg-[var(--m-accent)] text-white"
              : "text-[var(--m-ink-soft)] hover:bg-[var(--m-wash)]/80 hover:text-[var(--m-ink)]",
          )}
        >
          <BookOpen className="size-3.5 shrink-0" />
          {copy.bible.pickByBook}
        </button>
      </div>

      {pickMode === "kitab" ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="bible-book">{copy.bible.bookLabel}</Label>
            {filteredBooks.length === 0 ? (
              <p className="rounded-xl border border-border px-3 py-3 text-sm text-muted-foreground">
                {copy.bible.searchEmpty}
              </p>
            ) : (
              <BibleBookCombobox
                id="bible-book"
                books={filteredBooks}
                value={
                  filteredBooks.some((book) => book.abbr === bookAbbr)
                    ? bookAbbr
                    : filteredBooks[0]?.abbr
                }
                onChange={handleBookChange}
                placeholder={copy.bible.bookPlaceholder}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bible-chapter">{copy.bible.chapterLabel}</Label>
            <BibleChapterCombobox
              id="bible-chapter"
              bookAbbr={bookAbbr}
              options={chapterOptions}
              value={chapter}
              onChange={handleChapterChange}
              placeholder={copy.bible.chapterLabel}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bible-verse">{copy.bible.verseLabel}</Label>
            <BibleChapterCombobox
              id="bible-verse"
              options={verseOptions}
              value={verse}
              onChange={setVerse}
              placeholder={copy.bible.versePlaceholder}
              emptyLabel={copy.bible.verseAll}
              searchPlaceholder={copy.bible.verseSearchPlaceholder}
              emptySearchLabel={copy.bible.verseEmptySearch}
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button
            type="button"
            className="w-full font-semibold"
            size="lg"
            disabled={readingLoading}
            onClick={() => void handleRead()}
          >
            {readingLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Membuka…
              </>
            ) : (
              <>
                <BookOpenCheck className="size-4" />
                {copy.bible.readButton}
              </>
            )}
          </Button>
        </>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="bible-schedule-date">{copy.bible.dateLabel}</Label>
          <ScheduleDateCombobox
            id="bible-schedule-date"
            value={dateFieldValue}
            fallbackToDefault={!activePassage}
            unscheduledLabel={copy.bible.dateUnscheduled}
            onChange={openScheduledReading}
            placeholder={copy.bible.datePlaceholder}
            searchPlaceholder={copy.bible.dateSearchPlaceholder}
            emptyLabel={copy.bible.dateEmpty}
          />
          {activePassage && !dateHasSchedule ? (
            <p className="text-xs leading-relaxed text-[var(--m-ink-soft)]">
              {copy.bible.dateUnscheduledHint}
            </p>
          ) : null}
          {missedDays > 0 ? (
            <div
              role="status"
              className="flex items-start gap-2.5 rounded-xl border border-[var(--status-warning-text)]/20 bg-[var(--status-warning-bg)]/55 px-3 py-2.5"
            >
              <Info
                className="mt-0.5 size-3.5 shrink-0 text-[var(--status-warning-text)]"
                aria-hidden
              />
              <p className="text-xs leading-relaxed text-[var(--status-warning-text)]">
                <span className="font-semibold">{missedDays} hari terlewat</span>
                {" — "}
                pilih tanggalnya untuk mengejar.
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {!activePassage ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="size-4 shrink-0" />
              <TitleWithHint
                title={copy.bible.pickerTitle}
                hint={copy.bible.pickerDescription}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>{picker}</CardContent>
        </Card>
      ) : null}

      {activePassage ? (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-8">
          <aside className="w-full shrink-0 self-start lg:sticky lg:top-8 lg:z-20 lg:order-2 lg:w-[min(100%,20.5rem)]">
            <div className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] lg:max-h-[calc(100dvh-4rem)] lg:overflow-y-auto lg:border-[var(--m-line)] lg:bg-[var(--m-paper)]/95 lg:p-5 lg:shadow-[var(--shadow-soft)] lg:backdrop-blur-sm">
              {!browseMode && scheduleDate ? (
                <div className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/40 px-3.5 py-3 lg:border-[var(--m-line)] lg:bg-[var(--m-wash)]/50">
                  <CalendarDays className="size-4 shrink-0 text-primary lg:text-[var(--m-accent)]" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      Tanggal baca
                    </p>
                    <p className="text-sm font-semibold capitalize text-foreground">
                      {readingDateLabel}
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="space-y-3">
                <p className="text-xs font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                  {copy.bible.changePassage}
                </p>
                {picker}
              </div>

              {/* Slot panel samping: highlight / bandingkan — di bawah “Pilih bacaan lain” */}
              <div
                id="bible-highlight-toolbar-slot"
                className="empty:hidden"
              />
            </div>
          </aside>

          <div className="min-w-0 flex-1 space-y-3 lg:order-1">
            <PassageReader
              passage={activePassage}
              dateKey={
                scheduleDate ?? getScheduleDateForPassage(activePassage)
              }
              focusVerse={focusVerseNumber}
              defaultExpanded
              embedded
              showChapterNav
              onPassageChange={handlePassageChange}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
