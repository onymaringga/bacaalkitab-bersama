"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Bookmark,
  Eye,
  Highlighter,
  Maximize2,
  StickyNote,
  Trash2,
} from "lucide-react";

import {
  HighlightToolbar,
  HIGHLIGHT_TOOLBAR_SLOT_ID,
  type HighlightToolbarState,
} from "@/components/bible/highlight-toolbar";
import { BibleSelectionSheet } from "@/components/bible/bible-selection-sheet";
import { BookmarkManageBar } from "@/components/bible/bookmark-manage-bar";
import { HighlightedVerseText } from "@/components/bible/highlighted-verse-text";
import { VerseRemainingFab } from "@/components/bible/verse-remaining-fab";
import { VerseComparePanel } from "@/components/bible/verse-compare-panel";
import { VerseStudyPanel } from "@/components/bible/verse-study-panel";
import {
  VerseNoteDialog,
  type VerseNoteDialogMode,
} from "@/components/bible/verse-note-dialog";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { QuickTooltip } from "@/components/ui/quick-tooltip";
import { subscribeSpeechActiveVerse, requestSpeechPlayFromVerse } from "@/lib/bible-speech";
import { useDevice } from "@/hooks/use-device";
import { useBiblePinchFontSize } from "@/hooks/use-bible-pinch-font-size";
import { usePassageReadingProgress } from "@/hooks/use-passage-reading-progress";
import {
  HIGHLIGHT_COLORS,
  EMPTY_HIGHLIGHTS,
  addBibleHighlights,
  getHighlightColor,
  getHighlightsForPassage,
  removeBibleHighlight,
  removeHighlightsInRanges,
  subscribeBibleHighlights,
  type HighlightColorId,
  type BibleHighlight,
} from "@/lib/bible-highlights";
import {
  EMPTY_BOOKMARKS,
  addBibleBookmark,
  formatBookmarkReference,
  getBookmarksCoveringVerse,
  getBookmarksForPassage,
  removeBibleBookmark,
  subscribeBibleBookmarks,
  type BibleBookmark,
} from "@/lib/bible-bookmarks";
import {
  buildTextFromHighlightRanges,
  collectRangesFromSelection,
  formatSelectionCitation,
  formatSelectionCopyPayload,
  selectEntireVerseText,
  type HighlightRange,
} from "@/lib/bible-highlight-selection";
import {
  EMPTY_VERSE_NOTES,
  getVerseNotesForPassage,
  removeBibleVerseNote,
  subscribeBibleVerseNotes,
  type BibleVerseNote,
} from "@/lib/bible-verse-notes";
import { showToast } from "@/components/ui/toast-host";
import { ReadingTimeLabel } from "@/components/ui/reading-time-label";
import { JOURNAL_VERSE_INSERT_KEY, type JournalVerseInsertPayload } from "@/lib/journal-constants";
import { createJournalPage } from "@/lib/journal-entries";
import {
  getBibleFontSizeOption,
  getServerBibleFontSize,
  readBibleFontSize,
  subscribeBibleFontSize,
} from "@/lib/bible-font-size";
import { readingTimeFromTexts } from "@/lib/reading-time";
import { formatVerseNumberLabel } from "@/lib/bible-api";
import type { BibleVersionCode } from "@/lib/bible-books";
import {
  chapterFromSectionTitle,
  formatCompareCitation,
  type CompareVerseRef,
} from "@/lib/bible-compare";
import { resolveBookAbbrFromName } from "@/lib/bible-verse-study";
import { cn } from "@/lib/utils";

export type HighlightVerseItem = {
  verse: number;
  /** Rentang jika terjemahan menggabungkan ayat (mis. BIS 1–2). */
  endVerse?: number;
  content: string;
  key: string;
  chapter?: number;
};

export type HighlightSection = {
  title?: string;
  verses: HighlightVerseItem[];
};

export type PassageViewMode = "all" | "highlights" | "bookmarks" | "notes";

type PassageHighlightableVersesProps = {
  passageKey: string;
  /** Label pasal untuk bookmark, mis. "Kejadian 36". */
  passageLabel: string;
  /** Nama kitab untuk sitasi bandingkan. */
  bookName?: string;
  /** Pasal default jika section tidak punya chapter. */
  chapter?: number;
  /** Versi yang sedang dibaca — dikecualikan dari picker bandingkan. */
  version?: BibleVersionCode;
  /** Loncat & flash highlight ke ayat ini setelah render. */
  focusVerse?: number | null;
  /** Satu daftar ayat, atau beberapa bagian dengan judul. */
  sections: HighlightSection[];
  className?: string;
  /** Mode tampilan (dikelola parent agar toolbar bisa 1 baris). */
  viewMode?: PassageViewMode;
  onViewModeChange?: (mode: PassageViewMode) => void;
  /** Sembunyikan ikon Eye/Highlight/Bookmark/Fullscreen (sudah di toolbar induk). */
  hideViewToolbar?: boolean;
  /** Laporkan progress baca ke parent (toolbar mobile). */
  onReadingProgressChange?: (percent: number, visible: boolean) => void;
  /** Buka mode full screen (tombol di samping bookmark). */
  onOpenFullscreen?: () => void;
  fullscreenDisabled?: boolean;
  /** Tema baca: klasik, kindle, atau malam. */
  readingTheme?: "classic" | "kindle" | "night";
};

type PassageViewModeToolbarProps = {
  passageKey: string;
  viewMode: PassageViewMode;
  onViewModeChange: (mode: PassageViewMode) => void;
  onOpenFullscreen?: () => void;
  fullscreenDisabled?: boolean;
  className?: string;
  /** Tanpa border sendiri — menyatu di strip toolbar induk. */
  bare?: boolean;
};

/** Ikon lihat / highlight / bookmark / fullscreen untuk strip toolbar. */
export function PassageViewModeToolbar({
  passageKey,
  viewMode,
  onViewModeChange,
  onOpenFullscreen,
  fullscreenDisabled = false,
  className,
  bare = false,
}: PassageViewModeToolbarProps) {
  const highlights = useSyncExternalStore(
    subscribeBibleHighlights,
    () => getHighlightsForPassage(passageKey),
    () => EMPTY_HIGHLIGHTS,
  );
  const bookmarks = useSyncExternalStore(
    subscribeBibleBookmarks,
    () => getBookmarksForPassage(passageKey),
    () => EMPTY_BOOKMARKS,
  );
  const verseNotes = useSyncExternalStore(
    subscribeBibleVerseNotes,
    () => getVerseNotesForPassage(passageKey),
    () => EMPTY_VERSE_NOTES,
  );

  return (
    <div
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-0",
        !bare &&
          "rounded-xl border border-[var(--m-line)] bg-[var(--m-paper)] p-0.5 shadow-sm",
        className,
      )}
    >
      <QuickTooltip label="Semua teks">
        <Button
          type="button"
          size="icon-sm"
          variant={viewMode === "all" ? "default" : "ghost"}
          className="size-7 rounded-md"
          onClick={() => onViewModeChange("all")}
          aria-label="Semua teks"
        >
          <Eye className="size-3.5" />
        </Button>
      </QuickTooltip>
      <QuickTooltip label="Highlight tersimpan">
        <Button
          type="button"
          size="icon-sm"
          variant={viewMode === "highlights" ? "default" : "ghost"}
          className="relative size-7 rounded-md"
          onClick={() => onViewModeChange("highlights")}
          aria-label="Highlight"
        >
          <Highlighter className="size-3.5" />
          {highlights.length > 0 ? (
            <span className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-[var(--m-accent)] text-[8px] font-bold text-white">
              {highlights.length > 9 ? "9+" : highlights.length}
            </span>
          ) : null}
        </Button>
      </QuickTooltip>
      <QuickTooltip label="Catatan ayat">
        <Button
          type="button"
          size="icon-sm"
          variant={viewMode === "notes" ? "default" : "ghost"}
          className="relative size-7 rounded-md"
          onClick={() => onViewModeChange("notes")}
          aria-label="Catatan ayat"
        >
          <StickyNote className="size-3.5" />
          {verseNotes.length > 0 ? (
            <span className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-sky-500 text-[8px] font-bold text-white">
              {verseNotes.length > 9 ? "9+" : verseNotes.length}
            </span>
          ) : null}
        </Button>
      </QuickTooltip>
      <QuickTooltip label="Bookmark">
        <Button
          type="button"
          size="icon-sm"
          variant={viewMode === "bookmarks" ? "default" : "ghost"}
          className="relative size-7 rounded-md"
          onClick={() => onViewModeChange("bookmarks")}
          aria-label="Bookmark"
        >
          <Bookmark className="size-3.5" />
          {bookmarks.length > 0 ? (
            <span className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-amber-500 text-[8px] font-bold text-white">
              {bookmarks.length > 9 ? "9+" : bookmarks.length}
            </span>
          ) : null}
        </Button>
      </QuickTooltip>
      {onOpenFullscreen ? (
        <QuickTooltip label="Full screen">
          <span className="inline-flex">
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="size-7 rounded-md"
              disabled={fullscreenDisabled}
              onClick={onOpenFullscreen}
              aria-label="Full screen"
            >
              <Maximize2 className="size-3.5" />
            </Button>
          </span>
        </QuickTooltip>
      ) : null}
    </div>
  );
}

export function PassageHighlightableVerses({
  passageKey,
  passageLabel,
  bookName,
  chapter: defaultChapter = 1,
  version = "tb",
  focusVerse = null,
  sections,
  className,
  viewMode: viewModeProp,
  onViewModeChange,
  hideViewToolbar = false,
  onReadingProgressChange,
  onOpenFullscreen,
  fullscreenDisabled = false,
  readingTheme = "classic",
}: PassageHighlightableVersesProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerNode, setContainerNode] = useState<HTMLDivElement | null>(
    null,
  );
  const pendingRangesRef = useRef<HighlightRange[] | null>(null);
  const pendingTextRef = useRef<string>("");
  const verseTapRef = useRef<{
    verse: number;
    x: number;
    y: number;
    moved: boolean;
  } | null>(null);
  /** Cegah seleksi baru menimpa panel bandingkan / rujukan. */
  const panelLockRef = useRef<"compare" | "study" | null>(null);
  const doubleTapRef = useRef<{ verse: number; time: number } | null>(null);
  const DOUBLE_TAP_MS = 400;
  const [toolbar, setToolbar] = useState<HighlightToolbarState | null>(null);
  const [compareSelection, setCompareSelection] = useState<CompareVerseRef[] | null>(
    null,
  );
  const [studySelection, setStudySelection] = useState<{
    refs: CompareVerseRef[];
    text: string;
  } | null>(null);
  const [bookmarkMenu, setBookmarkMenu] = useState<{
    verse: number;
    items: BibleBookmark[];
  } | null>(null);
  const [noteDialogMode, setNoteDialogMode] =
    useState<VerseNoteDialogMode | null>(null);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [flashVerse, setFlashVerse] = useState<number | null>(null);
  const [speechVerse, setSpeechVerse] = useState<number | null>(null);
  const [viewModeInternal, setViewModeInternal] =
    useState<PassageViewMode>("all");
  const viewMode = viewModeProp ?? viewModeInternal;
  const setViewMode = onViewModeChange ?? setViewModeInternal;
  const [colorFilter, setColorFilter] = useState<HighlightColorId | "all">(
    "all",
  );
  const [portalReady, setPortalReady] = useState(false);
  const ignoreClearUntil = useRef(0);

  const { isMobile } = useDevice();
  const isMobileRef = useRef(isMobile);
  isMobileRef.current = isMobile;

  const setContainerRef = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;
    setContainerNode((current) => (current === node ? current : node));
  }, []);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => subscribeSpeechActiveVerse(setSpeechVerse), []);

  // Loncat ke ayat yang dipilih + flash highlight sementara
  useEffect(() => {
    if (!focusVerse || focusVerse < 1 || !containerNode) {
      setFlashVerse(null);
      return;
    }

    setViewMode("all");

    let cancelled = false;
    let clearTimer = 0;
    let attempts = 0;

    function tryFocus() {
      if (cancelled) return;
      const root = containerRef.current;
      if (!root) return;
      const target = root.querySelector<HTMLElement>(
        `[data-verse-node][data-verse="${focusVerse}"]`,
      );
      if (!target) {
        attempts += 1;
        if (attempts < 16) {
          window.setTimeout(tryFocus, 100);
        }
        return;
      }

      setFlashVerse(focusVerse);
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      clearTimer = window.setTimeout(() => {
        if (!cancelled) setFlashVerse(null);
      }, 3200);
    }

    const startTimer = window.setTimeout(tryFocus, 80);
    return () => {
      cancelled = true;
      window.clearTimeout(startTimer);
      window.clearTimeout(clearTimer);
    };
    // sections sengaja tidak di-deps — array baru tiap render
    // eslint-disable-next-line react-hooks/exhaustive-deps -- focus by verse + passage only
  }, [focusVerse, passageKey, containerNode, setViewMode]);

  const highlights = useSyncExternalStore(
    subscribeBibleHighlights,
    () => getHighlightsForPassage(passageKey),
    () => EMPTY_HIGHLIGHTS,
  );

  const bookmarks = useSyncExternalStore(
    subscribeBibleBookmarks,
    () => getBookmarksForPassage(passageKey),
    () => EMPTY_BOOKMARKS,
  );

  const verseNotes = useSyncExternalStore(
    subscribeBibleVerseNotes,
    () => getVerseNotesForPassage(passageKey),
    () => EMPTY_VERSE_NOTES,
  );

  const fontSizeId = useSyncExternalStore(
    subscribeBibleFontSize,
    readBibleFontSize,
    getServerBibleFontSize,
  );
  const fontSize = getBibleFontSizeOption(fontSizeId);

  const bookmarkedVerseSet = useMemo(() => {
    const set = new Set<number>();
    for (const item of bookmarks) {
      const end = item.endVerse ?? item.verse;
      for (let verse = item.verse; verse <= end; verse += 1) {
        set.add(verse);
      }
    }
    return set;
  }, [bookmarks]);

  const verseContentByNumber = useMemo(() => {
    const map = new Map<number, string>();
    for (const section of sections) {
      for (const verse of section.verses) {
        const end = verse.endVerse ?? verse.verse;
        for (let n = verse.verse; n <= end; n += 1) {
          map.set(n, verse.content);
        }
      }
    }
    return map;
  }, [sections]);

  const totalVerseCount = useMemo(() => {
    let count = 0;
    for (const section of sections) {
      count += section.verses.length;
    }
    return count;
  }, [sections]);

  const filteredHighlights = useMemo(() => {
    if (colorFilter === "all") return highlights;
    return highlights.filter((item) => item.color === colorFilter);
  }, [highlights, colorFilter]);

  const highlightSnippets = useMemo(() => {
    return filteredHighlights
      .map((item) => {
        const content = verseContentByNumber.get(item.verse) ?? "";
        const text = content.slice(item.start, item.end).trim();
        if (!text) return null;
        return { highlight: item, text };
      })
      .filter(
        (
          item,
        ): item is { highlight: BibleHighlight; text: string } =>
          item !== null,
      );
  }, [filteredHighlights, verseContentByNumber]);

  const canRemoveHighlight = useMemo(() => {
    if (!toolbar?.ranges.length || highlights.length === 0) return false;
    return toolbar.ranges.some((range) =>
      highlights.some(
        (item) =>
          item.verse === range.verse &&
          item.start < range.end &&
          item.end > range.start,
      ),
    );
  }, [toolbar, highlights]);

  const clearSelectionUi = useCallback((clearDomSelection = true) => {
    if (clearDomSelection) {
      window.getSelection()?.removeAllRanges();
    }
    pendingRangesRef.current = null;
    pendingTextRef.current = "";
    setToolbar(null);
  }, []);

  const closeCompare = useCallback(() => {
    panelLockRef.current = null;
    setCompareSelection(null);
  }, []);

  const closeStudy = useCallback(() => {
    panelLockRef.current = null;
    setStudySelection(null);
  }, []);

  function resolveCompareRefs(ranges: HighlightRange[]): CompareVerseRef[] {
    const map = new Map<string, CompareVerseRef>();
    for (const range of ranges) {
      const chapter = range.chapter ?? defaultChapter;
      const key = `${chapter}:${range.verse}`;
      if (!map.has(key)) {
        map.set(key, { chapter, verse: range.verse });
      }
    }
    return [...map.values()].sort((a, b) =>
      a.chapter === b.chapter ? a.verse - b.verse : a.chapter - b.chapter,
    );
  }

  function handleCompare() {
    const ranges = toolbar?.ranges ?? pendingRangesRef.current;
    if (!ranges?.length) return;
    armToolbarInteraction();
    const refs = resolveCompareRefs(ranges);
    if (refs.length === 0) return;
    panelLockRef.current = "compare";
    setStudySelection(null);
    setCompareSelection(refs);
    clearSelectionUi(true);
  }

  function handleStudy() {
    const ranges = toolbar?.ranges ?? pendingRangesRef.current;
    if (!ranges?.length) return;
    const selectedText = getSelectionPlainText(ranges);
    if (!selectedText) return;
    armToolbarInteraction();
    const refs = resolveCompareRefs(ranges);
    if (refs.length === 0) return;
    panelLockRef.current = "study";
    setCompareSelection(null);
    setStudySelection({ refs, text: selectedText });
    clearSelectionUi(true);
  }

  function handleAddNote() {
    const ranges = toolbar?.ranges ?? pendingRangesRef.current;
    if (!ranges?.length) return;
    const selectedText = getSelectionPlainText(ranges);
    if (!selectedText) return;
    armToolbarInteraction();
    const citation = getSelectionCitation(ranges);
    setNoteDialogMode({
      kind: "create",
      passageKey,
      passageLabel,
      ranges: ranges.map((range) => ({
        verse: range.verse,
        start: range.start,
        end: range.end,
        chapter: range.chapter,
      })),
      quote: selectedText,
      citation,
    });
    setNoteDialogOpen(true);
    clearSelectionUi(false);
  }

  function handleAddToJournal() {
    const ranges = toolbar?.ranges ?? pendingRangesRef.current;
    if (!ranges?.length) return;
    const selectedText = getSelectionPlainText(ranges);
    if (!selectedText) return;
    armToolbarInteraction();

    const citation = getSelectionCitation(ranges);
    const content = formatSelectionCopyPayload(selectedText, citation);
    const payload: JournalVerseInsertPayload = {
      content,
      passageRef: citation,
      passageLabel,
    };

    try {
      sessionStorage.setItem(JOURNAL_VERSE_INSERT_KEY, JSON.stringify(payload));
    } catch {
      /* ignore quota errors */
    }

    const page = createJournalPage();
    pendingRangesRef.current = null;
    clearSelectionUi(false);
    router.push(`/jurnal/${page.id}`);
  }

  function openVerseNote(note: BibleVerseNote) {
    armToolbarInteraction();
    setNoteDialogMode({
      kind: "view",
      note,
      citation: formatSelectionCitation(
        note.passageLabel || passageLabel,
        note.ranges.map((range) => range.verse),
      ),
    });
    setNoteDialogOpen(true);
  }

  function getSelectionPlainText(ranges: HighlightRange[]) {
    const fromToolbar = toolbar?.selectedText?.trim() ?? "";
    if (fromToolbar) return fromToolbar;
    const fromPending = pendingTextRef.current.trim();
    if (fromPending) return fromPending;
    return buildTextFromHighlightRanges(ranges, verseContentByNumber);
  }

  function getSelectionCitation(ranges: HighlightRange[]) {
    return formatSelectionCitation(
      passageLabel,
      ranges.map((range) => range.verse),
    );
  }

  const closeBookmarkMenu = useCallback(() => {
    setBookmarkMenu(null);
  }, []);

  function openBookmarkMenu(verse: number) {
    const items = getBookmarksCoveringVerse(passageKey, verse);
    if (items.length === 0) return;
    clearSelectionUi();
    setBookmarkMenu({ verse, items });
  }

  function handleRemoveBookmarksFromMenu() {
    if (!bookmarkMenu?.items.length) return;
    armToolbarInteraction();
    for (const item of bookmarkMenu.items) {
      removeBibleBookmark(item.id);
    }
    setBookmarkMenu(null);
    showToast(
      bookmarkMenu.items.length > 1
        ? `${bookmarkMenu.items.length} bookmark dihapus`
        : "Bookmark dihapus",
    );
  }

  const captureSelection = useCallback(() => {
    if (viewMode !== "all") return;
    if (panelLockRef.current) return;
    const container = containerRef.current;
    if (!container) return;

    const result = collectRangesFromSelection(container);
    if (!result) {
      if (Date.now() < ignoreClearUntil.current) return;
      // Bottom sheet mobile: jangan tutup hanya karena seleksi DOM runtuh.
      if (pendingRangesRef.current?.length && isMobileRef.current) return;
      pendingRangesRef.current = null;
      setToolbar(null);
      return;
    }

    ignoreClearUntil.current = Date.now() + 800;
    pendingRangesRef.current = result.ranges;
    pendingTextRef.current = result.selectedText;
    setBookmarkMenu(null);
    setCompareSelection(null);
    setStudySelection(null);
    setToolbar({
      ranges: result.ranges,
      selectedText: result.selectedText,
      verseCount: result.ranges.length,
    });
  }, [viewMode]);

  function applyVerseSelection(
    result: { ranges: HighlightRange[]; selectedText: string },
  ) {
    ignoreClearUntil.current = Date.now() + 800;
    pendingRangesRef.current = result.ranges;
    pendingTextRef.current = result.selectedText;
    setBookmarkMenu(null);
    setCompareSelection(null);
    setStudySelection(null);
    setToolbar({
      ranges: result.ranges,
      selectedText: result.selectedText,
      verseCount: result.ranges.length,
    });
  }

  function handleVersePointerDown(
    event: React.PointerEvent<HTMLElement>,
    verse: number,
  ) {
    if (viewMode !== "all") return;
    const target = event.target;
    if (
      target instanceof Element &&
      (target.closest("[data-verse-note-marker]") ||
        target.closest("button"))
    ) {
      verseTapRef.current = null;
      return;
    }
    verseTapRef.current = {
      verse,
      x: event.clientX,
      y: event.clientY,
      moved: false,
    };
  }

  function handleVersePointerMove(event: React.PointerEvent<HTMLElement>) {
    const tap = verseTapRef.current;
    if (!tap) return;
    const dx = event.clientX - tap.x;
    const dy = event.clientY - tap.y;
    if (dx * dx + dy * dy > 64) {
      tap.moved = true;
    }
  }

  function handleVersePointerUp(
    event: React.PointerEvent<HTMLElement>,
    verseNode: HTMLElement,
    content: string,
  ) {
    const tap = verseTapRef.current;
    verseTapRef.current = null;
    if (viewMode !== "all" || !tap || tap.moved) return;

    const target = event.target;
    if (
      target instanceof Element &&
      (target.closest("[data-verse-note-marker]") ||
        target.closest("button"))
    ) {
      return;
    }

    if (isMobileRef.current) {
      const now = Date.now();
      const prev = doubleTapRef.current;
      if (
        prev &&
        prev.verse === tap.verse &&
        now - prev.time <= DOUBLE_TAP_MS
      ) {
        doubleTapRef.current = null;
        event.preventDefault();
        const result = selectEntireVerseText(verseNode, {
          contentLength: content.length,
          selectedText: content,
        });
        if (result) applyVerseSelection(result);
      } else {
        doubleTapRef.current = { verse: tap.verse, time: now };
        window.getSelection()?.removeAllRanges();
      }
      return;
    }

    // Desktop: tap singkat → blok seluruh ayat.
    event.preventDefault();
    const result = selectEntireVerseText(verseNode, {
      contentLength: content.length,
      selectedText: content,
    });
    if (!result) return;
    applyVerseSelection(result);
  }

  useEffect(() => {
    if (!containerNode) return;

    const scheduleCapture = () => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(captureSelection);
      });
    };

    const onPointerUp = (event: Event) => {
      const target = event.target;
      if (
        target instanceof Element &&
        (target.closest("[data-highlight-toolbar]") ||
          target.closest("[data-verse-compare-panel]") ||
          target.closest("[data-verse-study-panel]") ||
          target.closest("[data-verse-note-marker]"))
      ) {
        return;
      }
      if (!containerNode.contains(target as Node)) return;
      scheduleCapture();
    };

    const onSelectionChange = () => {
      if (viewMode !== "all") return;
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;
      scheduleCapture();
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearSelectionUi();
        setBookmarkMenu(null);
        panelLockRef.current = null;
        setCompareSelection(null);
        setStudySelection(null);
        return;
      }
      scheduleCapture();
    };

    containerNode.addEventListener("mouseup", onPointerUp);
    containerNode.addEventListener("touchend", onPointerUp, { passive: true });
    document.addEventListener("selectionchange", onSelectionChange);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      containerNode.removeEventListener("mouseup", onPointerUp);
      containerNode.removeEventListener("touchend", onPointerUp);
      document.removeEventListener("selectionchange", onSelectionChange);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [containerNode, captureSelection, clearSelectionUi, viewMode]);

  function armToolbarInteraction() {
    ignoreClearUntil.current = Date.now() + 1200;
  }

  function handlePickColor(color: HighlightColorId) {
    const ranges = toolbar?.ranges ?? pendingRangesRef.current;
    if (!ranges?.length) return;
    armToolbarInteraction();
    const created = addBibleHighlights(
      ranges.map((range) => ({
        passageKey,
        verse: range.verse,
        start: range.start,
        end: range.end,
        color,
      })),
    );
    pendingRangesRef.current = null;
    clearSelectionUi();
    showToast(
      created.length > 1
        ? `${created.length} highlight disimpan`
        : "Teks di-highlight",
    );
  }

  function handleBookmark() {
    const ranges = toolbar?.ranges ?? pendingRangesRef.current;
    if (!ranges?.length) return;
    const selectedText = getSelectionPlainText(ranges);
    if (!selectedText) return;
    armToolbarInteraction();

    const verses = [...new Set(ranges.map((range) => range.verse))].sort(
      (a, b) => a - b,
    );
    const verseStart = verses[0];
    const verseEnd = verses[verses.length - 1];

    addBibleBookmark({
      passageKey,
      passageLabel,
      verse: verseStart,
      endVerse: verseEnd > verseStart ? verseEnd : undefined,
      text: selectedText,
    });
    pendingRangesRef.current = null;
    pendingTextRef.current = "";
    clearSelectionUi();
    showToast("Ayat dibookmark");
  }

  async function handleCopy() {
    const ranges = toolbar?.ranges ?? pendingRangesRef.current;
    if (!ranges?.length) return;
    const selectedText = getSelectionPlainText(ranges);
    if (!selectedText) return;
    armToolbarInteraction();

    const citation = getSelectionCitation(ranges);
    const payload = formatSelectionCopyPayload(selectedText, citation);

    try {
      await navigator.clipboard.writeText(payload);
      showToast(`Disalin · ${citation}`);
    } catch {
      try {
        const area = document.createElement("textarea");
        area.value = payload;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.left = "-9999px";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
        showToast(`Disalin · ${citation}`);
      } catch {
        showToast("Gagal menyalin teks");
      }
    }
  }

  function handleRemove() {
    const ranges = toolbar?.ranges ?? pendingRangesRef.current;
    if (!ranges?.length || !canRemoveHighlight) return;
    armToolbarInteraction();
    removeHighlightsInRanges(
      ranges.map((range) => ({
        passageKey,
        verse: range.verse,
        start: range.start,
        end: range.end,
      })),
    );
    pendingRangesRef.current = null;
    clearSelectionUi();
    showToast("Highlight dihapus");
  }

  function handleDeleteSnippet(id: string) {
    removeBibleHighlight(id);
    showToast("Highlight dihapus");
  }

  function handleDeleteBookmark(id: string) {
    removeBibleBookmark(id);
    showToast("Bookmark dihapus");
  }

  function handleDeleteNote(id: string) {
    removeBibleVerseNote(id);
    showToast("Catatan dihapus");
  }

  function formatNoteCitation(note: BibleVerseNote) {
    return formatSelectionCitation(
      note.passageLabel || passageLabel,
      note.ranges.map((range) => range.verse),
    );
  }

  useEffect(() => {
    if (!bookmarkMenu) return;
    const items = getBookmarksCoveringVerse(passageKey, bookmarkMenu.verse);
    if (items.length === 0) {
      setBookmarkMenu(null);
      return;
    }
    const same =
      items.length === bookmarkMenu.items.length &&
      items.every((item, index) => item.id === bookmarkMenu.items[index]?.id);
    if (!same) {
      setBookmarkMenu({ verse: bookmarkMenu.verse, items });
    }
  }, [bookmarks, bookmarkMenu, passageKey]);

  useEffect(() => {
    if (viewMode !== "all") setBookmarkMenu(null);
  }, [viewMode]);

  // Tempel panel di slot “Pilih bacaan lain” (desktop), lalu scroll agar terlihat
  useEffect(() => {
    if (isMobile) return;
    if ((!toolbar && !compareSelection && !studySelection) || viewMode !== "all") return;
    const slot = document.getElementById(HIGHLIGHT_TOOLBAR_SLOT_ID);
    if (!slot) return;
    const frame = window.requestAnimationFrame(() => {
      slot.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [toolbar, compareSelection, studySelection, viewMode, isMobile]);

  const resolvedBookName =
    bookName || passageLabel.replace(/\s+\d.*$/, "").trim() || passageLabel;
  const resolvedBookAbbr = resolveBookAbbrFromName(resolvedBookName) ?? "";

  const highlightToolbarNode =
    toolbar && viewMode === "all" ? (
      <HighlightToolbar
        state={toolbar}
        canRemove={canRemoveHighlight}
        onPickColor={handlePickColor}
        onBookmark={handleBookmark}
        onCopy={handleCopy}
        onCompare={handleCompare}
        onStudy={handleStudy}
        onAddNote={handleAddNote}
        onAddToJournal={handleAddToJournal}
        onRemove={handleRemove}
        onClose={() => clearSelectionUi()}
        onInteract={armToolbarInteraction}
      />
    ) : null;

  const comparePanelNode =
    compareSelection && viewMode === "all" ? (
      <VerseComparePanel
        open
        passageLabel={passageLabel}
        bookName={resolvedBookName}
        currentVersion={version}
        selected={compareSelection}
        onClose={closeCompare}
        onInteract={armToolbarInteraction}
      />
    ) : null;

  const studyPanelNode =
    studySelection && viewMode === "all" ? (
      <VerseStudyPanel
        open
        bookAbbr={resolvedBookAbbr}
        bookName={resolvedBookName}
        passageLabel={passageLabel}
        citation={formatCompareCitation(
          resolvedBookName,
          studySelection.refs ?? [],
        )}
        selectedText={studySelection.text}
        currentVersion={version}
        selected={studySelection.refs ?? []}
        onClose={closeStudy}
        onInteract={armToolbarInteraction}
      />
    ) : null;

  const sidePanelNode = studyPanelNode ?? comparePanelNode ?? highlightToolbarNode;

  const toolbarSlot =
    typeof document !== "undefined"
      ? document.getElementById(HIGHLIGHT_TOOLBAR_SLOT_ID)
      : null;

  const mobileSelectionOpen = Boolean(toolbar) && viewMode === "all" && isMobile;
  const mobileCompareOpen =
    Boolean(compareSelection) && viewMode === "all" && isMobile;
  const mobileStudyOpen =
    Boolean(studySelection) && viewMode === "all" && isMobile;

  const progressEnabled =
    viewMode === "all" &&
    Boolean(containerNode) &&
    !mobileSelectionOpen &&
    !mobileCompareOpen &&
    !mobileStudyOpen;

  const { percent: readingPercent, visible: readingVisible } =
    usePassageReadingProgress(containerRef, totalVerseCount, {
      enabled: progressEnabled,
    });

  const onReadingProgressChangeRef = useRef(onReadingProgressChange);
  onReadingProgressChangeRef.current = onReadingProgressChange;

  useEffect(() => {
    onReadingProgressChangeRef.current?.(readingPercent, readingVisible);
  }, [readingPercent, readingVisible]);

  useBiblePinchFontSize(
    containerNode,
    isMobile && viewMode === "all" && !mobileSelectionOpen,
  );

  return (
    <>
      <div className={cn("space-y-3", className)}>
        {viewMode === "highlights" && highlights.length > 0 ? (
          <div className="flex w-full flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setColorFilter("all")}
              className={cn(
                "rounded-full px-2 py-1 text-[11px] font-medium transition",
                colorFilter === "all"
                  ? "bg-[var(--m-ink)] text-white"
                  : "bg-white text-[var(--m-ink-soft)] ring-1 ring-[var(--m-line)]",
              )}
            >
              Semua warna
            </button>
            {HIGHLIGHT_COLORS.map((color) => {
              const count = highlights.filter(
                (item) => item.color === color.id,
              ).length;
              if (count === 0) return null;
              return (
                <button
                  key={color.id}
                  type="button"
                  title={color.label}
                  aria-label={`Filter ${color.label}`}
                  onClick={() => setColorFilter(color.id)}
                  className={cn(
                    "size-6 rounded-full ring-2 ring-offset-1 transition",
                    color.swatchClass,
                    colorFilter === color.id
                      ? "ring-[var(--m-accent)]"
                      : "ring-transparent opacity-80 hover:opacity-100",
                  )}
                />
              );
            })}
          </div>
        ) : null}

        {!hideViewToolbar ? (
          <div className="flex w-full flex-wrap items-center justify-end gap-2">
            <PassageViewModeToolbar
              passageKey={passageKey}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onOpenFullscreen={onOpenFullscreen}
              fullscreenDisabled={fullscreenDisabled}
            />
          </div>
        ) : null}

        {viewMode === "highlights" ? (
          highlightSnippets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--m-line)] px-4 py-8 text-center">
              <Highlighter className="mx-auto size-5 text-[var(--m-ink-soft)]" />
              <p className="mt-2 text-sm font-medium text-[var(--m-ink)]">
                Belum ada highlight
              </p>
              <p className="mt-1 text-xs text-[var(--m-ink-soft)]">
                Kembali ke “Semua teks”, blok teks, lalu pilih warna.
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="mt-3 rounded-xl"
                onClick={() => setViewMode("all")}
              >
                Lihat semua teks
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {highlightSnippets.map(({ highlight, text }) => {
                const color = getHighlightColor(highlight.color);
                return (
                  <li
                    key={highlight.id}
                    className="rounded-2xl border border-[var(--m-line)] bg-white/90 p-3.5"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                        Ayat {highlight.verse}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "size-3 rounded-full",
                            color.swatchClass,
                          )}
                          title={color.label}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="size-7 rounded-full text-[var(--m-ink-soft)]"
                          aria-label="Hapus highlight"
                          onClick={() => handleDeleteSnippet(highlight.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                    <p
                      className={cn(
                        "rounded-lg px-2.5 py-2 text-base leading-7 text-[var(--m-ink)]",
                        color.markClass,
                      )}
                    >
                      {text}
                    </p>
                  </li>
                );
              })}
            </ul>
          )
        ) : viewMode === "bookmarks" ? (
          bookmarks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--m-line)] px-4 py-8 text-center">
              <Bookmark className="mx-auto size-5 text-[var(--m-ink-soft)]" />
              <p className="mt-2 text-sm font-medium text-[var(--m-ink)]">
                Belum ada bookmark
              </p>
              <p className="mt-1 text-xs text-[var(--m-ink-soft)]">
                Blok teks ayat, lalu ketuk Bookmark di toolbar.
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="mt-3 rounded-xl"
                onClick={() => setViewMode("all")}
              >
                Lihat semua teks
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {bookmarks.map((bookmark) => (
                <li
                  key={bookmark.id}
                  className="rounded-2xl border border-[var(--m-line)] bg-white/90 p-3.5"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[var(--m-accent)] uppercase">
                      <Bookmark className="size-3.5 fill-current" />
                      {formatBookmarkReference(bookmark)}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="size-7 rounded-full text-[var(--m-ink-soft)]"
                      aria-label="Hapus bookmark"
                      onClick={() => handleDeleteBookmark(bookmark.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                  <p className="text-base leading-7 text-[var(--m-ink)]">
                    {bookmark.text}
                  </p>
                </li>
              ))}
            </ul>
          )
        ) : viewMode === "notes" ? (
          verseNotes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--m-line)] px-4 py-8 text-center">
              <StickyNote className="mx-auto size-5 text-[var(--m-ink-soft)]" />
              <p className="mt-2 text-sm font-medium text-[var(--m-ink)]">
                Belum ada catatan
              </p>
              <p className="mt-1 text-xs text-[var(--m-ink-soft)]">
                Blok teks ayat, lalu ketuk Catatan di toolbar seleksi.
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="mt-3 rounded-xl"
                onClick={() => setViewMode("all")}
              >
                Lihat semua teks
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {verseNotes.map((note) => {
                const citation = formatNoteCitation(note);
                return (
                  <li
                    key={note.id}
                    className="rounded-2xl border border-[var(--m-line)] bg-white/90 p-3.5"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => openVerseNote(note)}
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
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                    <button
                      type="button"
                      onClick={() => openVerseNote(note)}
                      className="w-full text-left"
                    >
                      {note.quote ? (
                        <p className="mb-2 line-clamp-2 border-l-2 border-sky-300 pl-2.5 text-sm leading-6 text-[var(--m-ink-soft)] italic">
                          “{note.quote}”
                        </p>
                      ) : null}
                      <p className="line-clamp-4 text-base leading-7 text-[var(--m-ink)]">
                        {note.content}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )
        ) : (
          <div
            ref={setContainerRef}
            data-highlight-root
            className={cn(
              "space-y-10 select-text touch-pan-y [-webkit-user-select:text]",
              readingTheme === "kindle" && "space-y-8",
            )}
          >
            {sections.map((section, sectionIndex) => {
              const isChapterMarker = Boolean(
                bookName &&
                  section.title &&
                  chapterFromSectionTitle(section.title, bookName, 0) > 0,
              );

              return (
              <div
                key={`${section.title ?? "section"}-${sectionIndex}`}
                data-bible-kindle-section={
                  readingTheme === "kindle" ? "" : undefined
                }
                className={cn(
                  readingTheme === "kindle" ? "space-y-0" : "space-y-3",
                )}
              >
                {section.title ? (
                  <div
                    data-bible-kindle-heading={
                      readingTheme === "kindle" ? "" : undefined
                    }
                    className={cn(
                      readingTheme === "kindle"
                        ? "mb-4"
                        : cn(
                            "flex flex-wrap items-baseline gap-x-2.5 gap-y-1",
                            sectionIndex > 0 &&
                              "border-t border-[var(--m-line)]/70 pt-5",
                          ),
                    )}
                  >
                    <h3
                      className={cn(
                        "leading-[1.15] text-[var(--m-ink)]",
                        readingTheme === "kindle"
                          ? "w-full text-center font-serif text-[1.35rem] font-semibold"
                          : isChapterMarker
                            ? "member-web-display text-[clamp(1.45rem,3vw,1.85rem)] font-semibold tracking-tight"
                            : "member-web-display text-[clamp(1.2rem,2.4vw,1.55rem)]",
                      )}
                    >
                      {section.title}
                    </h3>
                    {readingTheme !== "kindle" ? (
                      <ReadingTimeLabel
                        label={readingTimeFromTexts(
                          section.verses.map((verse) => verse.content),
                        )}
                      />
                    ) : (
                      <span data-bible-kindle-meta className="sr-only">
                        {readingTimeFromTexts(
                          section.verses.map((verse) => verse.content),
                        )}
                      </span>
                    )}
                  </div>
                ) : null}
                {section.verses.map((item) => {
                  const bookmarked = (() => {
                    const end = item.endVerse ?? item.verse;
                    for (let n = item.verse; n <= end; n += 1) {
                      if (bookmarkedVerseSet.has(n)) return true;
                    }
                    return false;
                  })();
                  const verseLabel = formatVerseNumberLabel(
                    item.verse,
                    item.endVerse,
                  );
                  const verseChapter = item.chapter ?? defaultChapter;
                  const isKindle = readingTheme === "kindle";
                  return (
                    <div
                      key={item.key}
                      data-verse-node
                      data-verse={item.verse}
                      data-chapter={verseChapter}
                      data-flash={flashVerse === item.verse ? "1" : undefined}
                      data-speech-active={
                        speechVerse === item.verse ? "1" : undefined
                      }
                      onPointerDown={(event) =>
                        handleVersePointerDown(event, item.verse)
                      }
                      onPointerMove={handleVersePointerMove}
                      onPointerUp={(event) =>
                        handleVersePointerUp(
                          event,
                          event.currentTarget,
                          item.content,
                        )
                      }
                      onPointerCancel={() => {
                        verseTapRef.current = null;
                      }}
                      className={cn(
                        "group/verse relative text-[var(--m-ink)]",
                        viewMode === "all" && "cursor-pointer",
                        isKindle
                          ? null
                          : cn(
                              item.endVerse && item.endVerse > item.verse
                                ? "grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-2 sm:grid-cols-[3rem_minmax(0,1fr)]"
                                : "grid grid-cols-[2rem_minmax(0,1fr)] gap-x-2 sm:grid-cols-[2.25rem_minmax(0,1fr)]",
                              "-mx-2 rounded-lg border border-transparent px-2 py-1.5",
                              "transition-[background-color,border-color,box-shadow] duration-300",
                              "hover:border-dashed hover:border-[var(--m-accent)]/55 hover:bg-[var(--m-wash)]/75",
                              "hover:shadow-[inset_3px_0_0_0_var(--m-accent)]",
                              flashVerse === item.verse &&
                                "border-amber-300/80 bg-amber-100/90 shadow-[inset_3px_0_0_0_#f59e0b] ring-2 ring-amber-300/70",
                              speechVerse === item.verse &&
                                !isKindle &&
                                "border-[var(--m-accent)]/40 bg-[var(--m-accent)]/8 shadow-[inset_3px_0_0_0_var(--m-accent)]",
                              fontSize.verseClass,
                            ),
                        isKindle && fontSize.verseClass,
                      )}
                    >
                      {isKindle ? (
                        <p className="m-0">
                          <sup
                            data-verse-num
                            className="relative mr-0.5 select-none"
                          >
                            <button
                              type="button"
                              className="cursor-pointer rounded-sm px-0.5 font-inherit tabular-nums text-inherit transition hover:bg-[var(--m-accent)]/15 active:scale-95"
                              aria-label={`Dengarkan dari ayat ${verseLabel}`}
                              title={`Dengarkan dari ayat ${verseLabel}`}
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                requestSpeechPlayFromVerse(item.verse);
                              }}
                              onPointerDown={(event) => {
                                event.stopPropagation();
                              }}
                            >
                              {verseLabel}
                            </button>
                            {bookmarked ? (
                              <button
                                type="button"
                                className="absolute -left-3 -top-1 flex size-4 items-center justify-center rounded text-amber-700/80"
                                aria-label={`Kelola bookmark ayat ${verseLabel}`}
                                title="Kelola bookmark"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  openBookmarkMenu(item.verse);
                                }}
                                onPointerDown={(event) => {
                                  event.stopPropagation();
                                }}
                              >
                                <Bookmark
                                  className="size-2.5 fill-current"
                                  aria-hidden
                                />
                              </button>
                            ) : null}
                          </sup>
                          <HighlightedVerseText
                            passageKey={passageKey}
                            verse={item.verse}
                            chapter={verseChapter}
                            content={item.content}
                            onOpenNote={openVerseNote}
                          />
                        </p>
                      ) : (
                        <>
                          <span
                            className={cn(
                              "relative select-none pt-[0.45em] text-right font-semibold tabular-nums leading-none transition-colors",
                              fontSize.verseNumberClass,
                              bookmarked
                                ? "text-amber-600"
                                : "text-[var(--m-accent)] group-hover/verse:text-[var(--m-ink)]",
                            )}
                          >
                            <button
                              type="button"
                              className="cursor-pointer rounded-sm px-0.5 font-inherit tabular-nums text-inherit transition hover:underline hover:decoration-[var(--m-accent)]/50 hover:underline-offset-2 active:scale-95"
                              aria-label={`Dengarkan dari ayat ${verseLabel}`}
                              title={`Dengarkan dari ayat ${verseLabel}`}
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                requestSpeechPlayFromVerse(item.verse);
                              }}
                              onPointerDown={(event) => {
                                event.stopPropagation();
                              }}
                            >
                              {verseLabel}
                            </button>
                            {bookmarked ? (
                              <button
                                type="button"
                                className="absolute -left-1.5 -top-0.5 flex size-5 items-center justify-center rounded-md text-amber-500 transition hover:bg-amber-500/10 active:scale-95"
                                aria-label={`Kelola bookmark ayat ${verseLabel}`}
                                title="Kelola bookmark"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  openBookmarkMenu(item.verse);
                                }}
                                onPointerDown={(event) => {
                                  event.stopPropagation();
                                }}
                              >
                                <Bookmark
                                  className="size-2.5 fill-amber-500 text-amber-500"
                                  aria-hidden
                                />
                              </button>
                            ) : null}
                          </span>
                          <HighlightedVerseText
                            passageKey={passageKey}
                            verse={item.verse}
                            chapter={verseChapter}
                            content={item.content}
                            onOpenNote={openVerseNote}
                          />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              );
            })}
          </div>
        )}
      </div>

      {portalReady && sidePanelNode && !isMobile
        ? toolbarSlot
          ? createPortal(sidePanelNode, toolbarSlot)
          : (
              <div className="mt-3">{sidePanelNode}</div>
            )
        : null}

      {portalReady && toolbar && mobileSelectionOpen ? (
        <BibleSelectionSheet
          open={mobileSelectionOpen}
          onOpenChange={(open) => {
            if (!open) clearSelectionUi();
          }}
          state={toolbar}
          canRemove={canRemoveHighlight}
          onPickColor={handlePickColor}
          onBookmark={handleBookmark}
          onCopy={handleCopy}
          onCompare={handleCompare}
          onStudy={handleStudy}
          onAddNote={handleAddNote}
          onAddToJournal={handleAddToJournal}
          onRemove={handleRemove}
          onClose={() => clearSelectionUi()}
          onInteract={armToolbarInteraction}
          viewModeToolbar={
            <PassageViewModeToolbar
              passageKey={passageKey}
              viewMode={viewMode}
              onViewModeChange={(mode) => {
                armToolbarInteraction();
                setViewMode(mode);
                if (mode !== "all") clearSelectionUi();
              }}
              onOpenFullscreen={
                onOpenFullscreen
                  ? () => {
                      armToolbarInteraction();
                      onOpenFullscreen();
                      clearSelectionUi();
                    }
                  : undefined
              }
              fullscreenDisabled={fullscreenDisabled}
              className="h-10 w-full min-w-0 justify-start rounded-xl border border-[var(--m-line)] bg-[var(--m-wash)]/45 p-1 shadow-none"
            />
          }
        />
      ) : null}

      {portalReady && comparePanelNode && isMobile ? (
        <Sheet
          open={mobileCompareOpen}
          onOpenChange={(open) => {
            if (!open) closeCompare();
          }}
        >
          <SheetContent
            side="bottom"
            showCloseButton
            data-verse-compare-panel
            className="gap-0 rounded-t-[1.35rem] border border-[var(--m-line)] bg-white p-0 pb-[max(0.75rem,env(safe-area-inset-bottom))] max-h-[min(85dvh,40rem)] overflow-y-auto overscroll-contain"
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <div className="mx-auto mt-2 h-1 w-9 shrink-0 rounded-full bg-[var(--m-line)]" />
            <div className="p-3 pt-2">
              <VerseComparePanel
                open
                passageLabel={passageLabel}
                bookName={resolvedBookName}
                currentVersion={version}
                selected={compareSelection!}
                onClose={closeCompare}
                onInteract={armToolbarInteraction}
                className="shadow-none"
              />
            </div>
          </SheetContent>
        </Sheet>
      ) : null}

      {portalReady && studyPanelNode && isMobile ? (
        <Sheet
          open={mobileStudyOpen}
          onOpenChange={(open) => {
            if (!open) closeStudy();
          }}
        >
          <SheetContent
            side="bottom"
            showCloseButton
            data-verse-study-panel
            className="gap-0 rounded-t-[1.35rem] border border-[var(--m-line)] bg-white p-0 pb-[max(0.75rem,env(safe-area-inset-bottom))] max-h-[min(85dvh,40rem)] overflow-y-auto overscroll-contain"
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <div className="mx-auto mt-2 h-1 w-9 shrink-0 rounded-full bg-[var(--m-line)]" />
            <div className="p-3 pt-2">
              <VerseStudyPanel
                open
                bookAbbr={resolvedBookAbbr}
                bookName={resolvedBookName}
                passageLabel={passageLabel}
                citation={formatCompareCitation(
                  resolvedBookName,
                  studySelection!.refs ?? [],
                )}
                selectedText={studySelection!.text}
                currentVersion={version}
                selected={studySelection!.refs ?? []}
                onClose={closeStudy}
                onInteract={armToolbarInteraction}
                className="shadow-none"
              />
            </div>
          </SheetContent>
        </Sheet>
      ) : null}

      {portalReady && bookmarkMenu && viewMode === "all"
        ? createPortal(
            <BookmarkManageBar
              bookmarks={bookmarkMenu.items}
              onRemove={handleRemoveBookmarksFromMenu}
              onClose={closeBookmarkMenu}
              onInteract={armToolbarInteraction}
            />,
            document.body,
          )
        : null}

      <VerseRemainingFab
        containerRef={containerRef}
        verseCount={totalVerseCount}
        enabled={
          !isMobile &&
          viewMode === "all" &&
          Boolean(containerNode) &&
          !mobileSelectionOpen &&
          !mobileCompareOpen &&
          !mobileStudyOpen
        }
      />

      <VerseNoteDialog
        open={noteDialogOpen}
        mode={noteDialogMode}
        onOpenChange={(open) => {
          setNoteDialogOpen(open);
          if (!open) setNoteDialogMode(null);
        }}
      />
    </>
  );
}
