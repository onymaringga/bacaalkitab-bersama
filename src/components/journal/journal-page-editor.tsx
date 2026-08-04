"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Copy,
  ImagePlus,
  Maximize2,
  Minimize2,
  MousePointer2,
  Music2,
  Palette,
  RotateCcw,
  RotateCw,
  Smile,
  Sparkles,
  Sticker,
  Trash2,
  Type,
} from "lucide-react";

import { HistoryBackButton } from "@/components/ui/history-back-button";
import { JournalBookSpread } from "@/components/journal/journal-book-spread";
import type { JournalCanvasTool } from "@/components/journal/journal-canvas";
import { JournalVerseSheet } from "@/components/journal/journal-verse-sheet";
import { JournalYoutubeSheet } from "@/components/journal/journal-youtube-sheet";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { copy } from "@/lib/copy";
import {
  JOURNAL_COLORS,
  JOURNAL_FONT_SIZES,
  JOURNAL_FONT_FAMILIES,
  getDefaultJournalFontFamily,
  JOURNAL_MOODS,
  JOURNAL_STICKERS,
  JOURNAL_TEXT_COLORS,
  JOURNAL_VERSE_INSERT_KEY,
  getMoodEmoji,
  type JournalVerseInsertPayload,
} from "@/lib/journal-constants";
import {
  JOURNAL_PAPER_TYPES,
  getJournalPaperPreviewStyle,
} from "@/lib/journal-paper";
import {
  createJournalElement,
  createJournalSheet,
  deleteJournalPage,
  getSpreadCount,
  getSpreadSheets,
  migrateJournalPage,
  nextJournalZIndex,
  updateJournalPage,
  type JournalElement,
  type JournalPage,
} from "@/lib/journal-entries";
import { formatShortDate } from "@/lib/format-date";
import {
  buildScheduleJournalElements,
  buildScheduleJournalTitle,
  loadJournalVerseText,
} from "@/lib/journal-verse-utils";
import { showToast } from "@/components/ui/toast-host";
import type { ReadingSchedule } from "@/lib/types";
import { cn } from "@/lib/utils";

type ToolPanel = "none" | "mood" | "color" | "sticker";

type JournalPageEditorProps = {
  page: JournalPage;
};

function compressImage(file: File, maxWidth = 720): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas unavailable"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function JournalPageEditor({ page: initialPage }: JournalPageEditorProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [page, setPage] = useState(() => migrateJournalPage(initialPage));
  const sheets = page.sheets;
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [activeSheetId, setActiveSheetId] = useState(() => sheets[0]?.id ?? "");
  const spreadCount = getSpreadCount(sheets);
  const [leftSheet, rightSheet] = getSpreadSheets(sheets, spreadIndex);
  const activeSheet =
    sheets.find((sheet) => sheet.id === activeSheetId) ?? leftSheet ?? sheets[0] ?? null;
  const elements = activeSheet?.elements ?? [];
  const [tool, setTool] = useState<ToolPanel>("none");
  const [canvasTool, setCanvasTool] = useState<JournalCanvasTool>("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [verseSheetOpen, setVerseSheetOpen] = useState(false);
  const [youtubeSheetOpen, setYoutubeSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingEditId, setPendingEditId] = useState<string | null>(null);
  const pageRef = useRef(page);

  const selected = elements.find((el) => el.id === selectedId) ?? null;

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    if (sheets.some((sheet) => sheet.id === activeSheetId)) return;
    const fallback = sheets[spreadIndex * 2] ?? sheets[0];
    if (fallback) setActiveSheetId(fallback.id);
  }, [sheets, activeSheetId, spreadIndex]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsFullscreen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullscreen]);

  const persist = useCallback((next: JournalPage) => {
    const normalized = migrateJournalPage(next);
    setPage(normalized);
    setSaved(false);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      updateJournalPage(normalized.id, {
        title: normalized.title,
        mood: normalized.mood,
        backgroundColor: normalized.backgroundColor,
        paperType: normalized.paperType,
        sheets: normalized.sheets,
      });
      setSaved(true);
    }, 600);
  }, []);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(JOURNAL_VERSE_INSERT_KEY);
      if (!raw) return;
      sessionStorage.removeItem(JOURNAL_VERSE_INSERT_KEY);
      const payload = JSON.parse(raw) as JournalVerseInsertPayload;
      if (!payload.content?.trim()) return;

      const current = pageRef.current;
      const targetSheet = current.sheets[0];
      if (!targetSheet) return;
      const element = createJournalElement({
        type: "text",
        x: 8,
        y: 12,
        width: 84,
        height: 40,
        rotation: 0,
        zIndex: nextJournalZIndex(targetSheet.elements),
        content: payload.content,
        passageRef: payload.passageRef,
        fontSize: 14,
        color: "#1e293b",
        fontFamily: "sans",
      });
      persist({
        ...current,
        sheets: current.sheets.map((sheet) =>
          sheet.id === targetSheet.id
            ? { ...sheet, elements: [...sheet.elements, element] }
            : sheet,
        ),
      });
      setActiveSheetId(targetSheet.id);
      setSpreadIndex(0);
      setSelectedId(element.id);
      setCanvasTool("select");
      showToast(copy.journal.verseAddedFromReader);
    } catch {
      /* ignore malformed payload */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once on mount
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  function deleteSelected() {
    if (!selectedId) return;
    updateElements(elements.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!selectedId) return;
      if (event.key === "Delete" || event.key === "Backspace") {
        const active = document.activeElement;
        if (active?.getAttribute("contenteditable") === "true") return;
        event.preventDefault();
        deleteSelected();
        return;
      }
      const active = document.activeElement;
      if (active?.getAttribute("contenteditable") === "true") return;
      const selectedEl = elements.find((el) => el.id === selectedId);
      if (!selectedEl) return;
      if (event.key === "[") {
        event.preventDefault();
        patchSelected({ rotation: (selectedEl.rotation ?? 0) - (event.shiftKey ? 15 : 5) });
      }
      if (event.key === "]") {
        event.preventDefault();
        patchSelected({ rotation: (selectedEl.rotation ?? 0) + (event.shiftKey ? 15 : 5) });
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId, elements]);

  const updateSheetElements = useCallback(
    (sheetId: string, nextElements: JournalElement[]) => {
      persist({
        ...pageRef.current,
        sheets: pageRef.current.sheets.map((sheet) =>
          sheet.id === sheetId ? { ...sheet, elements: nextElements } : sheet,
        ),
      });
    },
    [persist],
  );

  const updateElements = useCallback(
    (nextElements: JournalElement[]) => {
      if (!activeSheetId) return;
      updateSheetElements(activeSheetId, nextElements);
    },
    [activeSheetId, updateSheetElements],
  );

  function addSpread() {
    const current = pageRef.current;
    const newLeft = createJournalSheet();
    const newRight = createJournalSheet();
    const nextSheets = [...current.sheets, newLeft, newRight];
    persist({ ...current, sheets: nextSheets });
    setSpreadIndex(Math.floor((nextSheets.length - 2) / 2));
    setActiveSheetId(newLeft.id);
    setSelectedId(null);
    showToast(copy.journal.spreadAdded);
  }

  function handleDelete() {
    setDeleteDialogOpen(true);
  }

  function confirmDelete() {
    deleteJournalPage(page.id);
    setDeleteDialogOpen(false);
    showToast(copy.journal.deletedToast);
    router.replace("/jurnal");
  }

  function duplicateSelected() {
    if (!selected) return;
    const clone = createJournalElement({
      ...selected,
      x: clampPct(selected.x + 4),
      y: clampPct(selected.y + 4),
      zIndex: nextJournalZIndex(elements),
    });
    updateElements([...elements, clone]);
    setSelectedId(clone.id);
  }

  function layerSelected(direction: "up" | "down") {
    if (!selected) return;
    const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
    const index = sorted.findIndex((el) => el.id === selected.id);
    const swapIndex = direction === "up" ? index + 1 : index - 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;
    const a = sorted[index]!;
    const b = sorted[swapIndex]!;
    updateElements(
      elements.map((el) => {
        if (el.id === a.id) return { ...el, zIndex: b.zIndex };
        if (el.id === b.id) return { ...el, zIndex: a.zIndex };
        return el;
      }),
    );
  }

  function addTextBox(sheetId: string, x = 20, y = 20) {
    const sheet = pageRef.current.sheets.find((item) => item.id === sheetId);
    const sheetElements = sheet?.elements ?? [];
    const element = createJournalElement({
      type: "text",
      x: clampPct(x),
      y: clampPct(y),
      width: 60,
      height: 24,
      rotation: 0,
      zIndex: nextJournalZIndex(sheetElements),
      content: "",
      fontSize: 15,
      color: "#1e293b",
      fontFamily: "display",
    });
    updateSheetElements(sheetId, [...sheetElements, element]);
    setActiveSheetId(sheetId);
    setSelectedId(element.id);
    setPendingEditId(element.id);
    setCanvasTool("select");
  }

  function addSticker(emoji: string) {
    if (!activeSheetId) return;
    const sheetElements =
      pageRef.current.sheets.find((sheet) => sheet.id === activeSheetId)?.elements ?? [];
    const element = createJournalElement({
      type: "sticker",
      x: 20 + Math.random() * 50,
      y: 20 + Math.random() * 45,
      width: 14,
      height: 14,
      rotation: Math.round(Math.random() * 30 - 15),
      zIndex: nextJournalZIndex(sheetElements),
      emoji,
    });
    updateSheetElements(activeSheetId, [...sheetElements, element]);
    setSelectedId(element.id);
    setTool("none");
  }

  async function handleImageUpload(file: File) {
    if (!activeSheetId) return;
    const sheetElements =
      pageRef.current.sheets.find((sheet) => sheet.id === activeSheetId)?.elements ?? [];
    try {
      const src = await compressImage(file);
      const element = createJournalElement({
        type: "image",
        x: 15 + Math.random() * 35,
        y: 20 + Math.random() * 35,
        width: 42,
        height: 28,
        rotation: Math.round(Math.random() * 10 - 5),
        zIndex: nextJournalZIndex(sheetElements),
        src,
      });
      updateSheetElements(activeSheetId, [...sheetElements, element]);
      setSelectedId(element.id);
      showToast(copy.journal.imageAdded);
    } catch {
      showToast(copy.journal.imageError);
    }
  }

  function addYoutube(payload: { videoId: string; title: string }) {
    if (!activeSheetId) return;
    const sheetElements =
      pageRef.current.sheets.find((sheet) => sheet.id === activeSheetId)?.elements ?? [];
    const element = createJournalElement({
      type: "youtube",
      x: 12 + Math.random() * 30,
      y: 18 + Math.random() * 30,
      width: 56,
      height: 32,
      rotation: 0,
      zIndex: nextJournalZIndex(sheetElements),
      youtubeId: payload.videoId,
      content: payload.title,
    });
    updateSheetElements(activeSheetId, [...sheetElements, element]);
    setSelectedId(element.id);
    setCanvasTool("select");
    showToast(copy.journal.youtubeAdded);
  }

  function patchSelected(patch: Partial<JournalElement>) {
    if (!selectedId) return;
    updateElements(
      elements.map((el) => (el.id === selectedId ? { ...el, ...patch } : el)),
    );
  }

  function insertVerseBlock(payload: { passage: string; content: string }) {
    if (!activeSheetId) return;
    const sheetElements =
      pageRef.current.sheets.find((sheet) => sheet.id === activeSheetId)?.elements ?? [];
    const element = createJournalElement({
      type: "text",
      x: 8,
      y: 12 + Math.min(sheetElements.length * 4, 40),
      width: 84,
      height: 36,
      rotation: 0,
      zIndex: nextJournalZIndex(sheetElements),
      content: payload.content,
      passageRef: payload.passage,
      fontSize: 14,
      color: "#1e293b",
      fontFamily: "sans",
    });
    updateSheetElements(activeSheetId, [...sheetElements, element]);
    setSelectedId(element.id);
    setCanvasTool("select");
  }

  async function applyScheduleReading(
    reading: ReadingSchedule,
    options?: { includeVerses?: boolean },
  ) {
    const targetSheetId = activeSheetId || pageRef.current.sheets[0]?.id;
    if (!targetSheetId) return;
    const sheetElements =
      pageRef.current.sheets.find((sheet) => sheet.id === targetSheetId)?.elements ?? [];
    const { header, reflectionContent, passage } = buildScheduleJournalElements(reading);
    const baseZ = nextJournalZIndex(sheetElements);
    const nextElements: JournalElement[] = [
      createJournalElement({
        type: "text",
        x: 8,
        y: 6,
        width: 84,
        height: 12,
        rotation: 0,
        zIndex: baseZ,
        content: header,
        passageRef: passage,
        fontSize: 16,
        color: "#0f172a",
      }),
      createJournalElement({
        type: "text",
        x: 8,
        y: 20,
        width: 84,
        height: 34,
        rotation: 0,
        zIndex: baseZ + 1,
        content: reflectionContent,
        fontSize: 15,
        color: "#334155",
      }),
    ];

    if (options?.includeVerses) {
      const verseText = await loadJournalVerseText(passage, { maxVerses: 24 });
      if (verseText) {
        nextElements.push(
          createJournalElement({
            type: "text",
            x: 8,
            y: 56,
            width: 84,
            height: 38,
            rotation: 0,
            zIndex: baseZ + 2,
            content: verseText,
            passageRef: passage,
            fontSize: 13,
            color: "#1e293b",
          }),
        );
      }
    }

    persist({
      ...pageRef.current,
      title: pageRef.current.title || buildScheduleJournalTitle(reading),
      scheduleDate: reading.scheduledDate,
      passage,
      sheets: pageRef.current.sheets.map((sheet) =>
        sheet.id === targetSheetId
          ? { ...sheet, elements: [...sheet.elements, ...nextElements] }
          : sheet,
      ),
    });
    showToast(copy.journal.verseApplySchedule);
  }

  const bookSpread = (
    <JournalBookSpread
      backgroundColor={page.backgroundColor}
      paperType={page.paperType}
      leftSheet={leftSheet}
      rightSheet={rightSheet}
      spreadIndex={spreadIndex}
      spreadCount={spreadCount}
      activeSheetId={activeSheetId}
      selectedId={selectedId}
      activeTool={canvasTool}
      pendingEditId={pendingEditId}
      size={isFullscreen ? "large" : "default"}
      onSelectSheet={(sheetId) => {
        setActiveSheetId(sheetId);
      }}
      onSelectElement={setSelectedId}
      onChangeSheetElements={updateSheetElements}
      onCanvasClick={(sheetId, x, y) => {
        setActiveSheetId(sheetId);
        addTextBox(sheetId, x, y);
      }}
      onPendingEditConsumed={() => setPendingEditId(null)}
      onPrevSpread={() => setSpreadIndex((index) => Math.max(0, index - 1))}
      onNextSpread={() =>
        setSpreadIndex((index) => Math.min(spreadCount - 1, index + 1))
      }
      onAddSpread={addSpread}
    />
  );

  const headerActions = (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <span
        className={cn(
          "rounded-full px-2.5 py-1 text-[11px] font-medium",
          saved
            ? "bg-[var(--m-wash)] text-[var(--m-ink-soft)]"
            : "bg-[var(--m-accent)]/10 text-[var(--m-accent)]",
        )}
        aria-live="polite"
      >
        {saved ? copy.journal.autoSaved : copy.journal.saving}
      </span>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="h-8 rounded-lg text-destructive hover:text-destructive"
        onClick={handleDelete}
      >
        <Trash2 className="size-3.5" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-8 rounded-lg"
        aria-label={isFullscreen ? copy.journal.exitFullscreen : copy.journal.enterFullscreen}
        title={isFullscreen ? copy.journal.exitFullscreen : copy.journal.enterFullscreen}
        onClick={() => setIsFullscreen((value) => !value)}
      >
        {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
        <span className="hidden sm:inline">
          {isFullscreen ? copy.journal.exitFullscreen : copy.journal.enterFullscreen}
        </span>
      </Button>
    </div>
  );

  const layersPanel = (
    <>
      <div className="rounded-2xl border border-[var(--m-line)] bg-white/90 p-3 shadow-sm backdrop-blur-sm dark:bg-zinc-900/90">
        <p className="mb-2 text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
          {copy.journal.layersTitle}
        </p>
        <div className="max-h-44 space-y-1 overflow-auto">
          {elements.length === 0 ? (
            <p className="px-1 py-2 text-xs text-[var(--m-ink-soft)]">
              {copy.journal.layersEmpty}
            </p>
          ) : (
            [...elements]
            .sort((a, b) => b.zIndex - a.zIndex)
            .map((el) => (
              <button
                key={el.id}
                type="button"
                onClick={() => setSelectedId(el.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition",
                  selectedId === el.id
                    ? "bg-[var(--m-accent)]/10 font-semibold text-[var(--m-accent)]"
                    : "hover:bg-[var(--m-wash)] text-[var(--m-ink)]",
                )}
              >
                    <span className="truncate">
                      {el.type === "text"
                        ? el.passageRef
                          ? copy.journal.layerVerse
                          : el.content?.slice(0, 24) || copy.journal.layerText
                        : el.type === "sticker"
                          ? el.emoji
                          : el.type === "youtube"
                            ? el.content?.slice(0, 24) || copy.journal.layerYoutube
                            : copy.journal.layerImage}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {selected ? (
        <div className="space-y-3 rounded-2xl border border-[var(--m-line)] bg-white/90 p-3 shadow-sm backdrop-blur-sm dark:bg-zinc-900/90">
          <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
            {copy.journal.propertiesTitle}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Button type="button" size="sm" variant="outline" className="h-8 rounded-lg" onClick={duplicateSelected}>
              <Copy className="size-3.5" />
            </Button>
            <Button type="button" size="sm" variant="outline" className="h-8 rounded-lg" onClick={() => layerSelected("up")}>
              <ArrowUp className="size-3.5" />
            </Button>
            <Button type="button" size="sm" variant="outline" className="h-8 rounded-lg" onClick={() => layerSelected("down")}>
              <ArrowDown className="size-3.5" />
            </Button>
            <Button type="button" size="sm" variant="outline" className="h-8 rounded-lg text-destructive" onClick={deleteSelected}>
              <Trash2 className="size-3.5" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-[var(--m-ink-soft)]">
                {copy.journal.rotationLabel}: {selected.rotation ?? 0}°
              </p>
              <button
                type="button"
                className="text-[11px] font-medium text-[var(--m-accent)] hover:underline"
                onClick={() => patchSelected({ rotation: 0 })}
              >
                {copy.journal.resetRotation}
              </button>
            </div>
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={selected.rotation ?? 0}
              onChange={(event) => patchSelected({ rotation: Number(event.target.value) })}
              className="h-2 w-full cursor-pointer accent-[var(--m-accent)]"
              aria-label={copy.journal.rotationLabel}
            />
            <div className="flex gap-1.5">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 flex-1 rounded-lg"
                onClick={() => patchSelected({ rotation: (selected.rotation ?? 0) - 15 })}
              >
                <RotateCcw className="size-3.5" />
                {copy.journal.rotateLeft}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 flex-1 rounded-lg"
                onClick={() => patchSelected({ rotation: (selected.rotation ?? 0) + 15 })}
              >
                <RotateCw className="size-3.5" />
                {copy.journal.rotateRight}
              </Button>
            </div>
          </div>

          {selected.type === "image" || selected.type === "youtube" ? (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                {copy.journal.sizeLabel}
              </p>
              <label className="block space-y-1">
                <span className="text-xs text-[var(--m-ink-soft)]">
                  {copy.journal.widthLabel}: {Math.round(selected.width)}%
                </span>
                <input
                  type="range"
                  min={8}
                  max={100}
                  step={1}
                  value={selected.width}
                  onChange={(event) => {
                    const width = Math.min(Number(event.target.value), 100 - selected.x);
                    if (selected.type === "youtube") {
                      patchSelected({ width, height: (width * 9) / 16 });
                    } else {
                      patchSelected({ width });
                    }
                  }}
                  className="h-2 w-full cursor-pointer accent-[var(--m-accent)]"
                />
              </label>
              {selected.type === "image" ? (
                <label className="block space-y-1">
                  <span className="text-xs text-[var(--m-ink-soft)]">
                    {copy.journal.heightLabel}: {Math.round(selected.height)}%
                  </span>
                  <input
                    type="range"
                    min={8}
                    max={100}
                    step={1}
                    value={selected.height}
                    onChange={(event) =>
                      patchSelected({ height: Math.min(Number(event.target.value), 100 - selected.y) })
                    }
                    className="h-2 w-full cursor-pointer accent-[var(--m-accent)]"
                  />
                </label>
              ) : null}
            </div>
          ) : null}

          {selected.type === "youtube" ? (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                {copy.journal.youtubeTitleLabel}
              </p>
              <Input
                value={selected.content ?? ""}
                onChange={(event) => patchSelected({ content: event.target.value })}
                placeholder={copy.journal.youtubeTitlePlaceholder}
                className="h-9 rounded-lg text-sm"
              />
            </div>
          ) : null}

          {selected.type === "text" ? (
            <>
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                  {copy.journal.fontLabel}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {JOURNAL_FONT_FAMILIES.map((font) => (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => patchSelected({ fontFamily: font.id })}
                      style={{ fontFamily: font.family }}
                      className={cn(
                        "rounded-md border px-2.5 py-1.5 text-xs transition",
                        getDefaultJournalFontFamily(selected) === font.id
                          ? "border-[var(--m-accent)] bg-[var(--m-accent)]/10 font-semibold text-[var(--m-accent)]"
                          : "border-[var(--m-line)] text-[var(--m-ink)] hover:bg-[var(--m-wash)]",
                      )}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {JOURNAL_FONT_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => patchSelected({ fontSize: size })}
                    className={cn(
                      "rounded-md border px-2 py-1 text-xs",
                      (selected.fontSize ?? 15) === size
                        ? "border-[var(--m-accent)] bg-[var(--m-accent)]/10 font-semibold"
                        : "border-[var(--m-line)]",
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {JOURNAL_TEXT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={color}
                    onClick={() => patchSelected({ color })}
                    className={cn(
                      "size-7 rounded-full border-2",
                      (selected.color ?? "#1e293b") === color
                        ? "border-[var(--m-accent)] ring-2 ring-[var(--m-accent)]/30"
                        : "border-white shadow-sm",
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );

  const floatingToolbar = (
    <div
      className={cn(
        "fixed left-1/2 z-[110] -translate-x-1/2",
        isFullscreen
          ? "bottom-6"
          : "bottom-[calc(5.5rem+env(safe-area-inset-bottom))] lg:bottom-6",
      )}
    >
      {tool === "mood" ? (
        <div className="absolute bottom-full left-1/2 mb-3 w-[min(calc(100vw-2rem),28rem)] -translate-x-1/2 rounded-2xl border border-[var(--m-line)] bg-white/95 p-3 shadow-lg backdrop-blur-md dark:bg-zinc-900/95">
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {JOURNAL_MOODS.map((mood) => (
              <button
                key={mood.id}
                type="button"
                onClick={() => {
                  persist({ ...page, mood: mood.id });
                  setTool("none");
                }}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border px-2 py-2 text-xs transition",
                  page.mood === mood.id
                    ? "border-[var(--m-accent)] bg-[var(--m-accent)]/10 font-semibold"
                    : "border-[var(--m-line)] hover:bg-[var(--m-wash)]",
                )}
              >
                <span className="text-xl">{mood.emoji}</span>
                {mood.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {tool === "color" ? (
        <div className="absolute bottom-full left-1/2 mb-3 w-[min(calc(100vw-2rem),24rem)] -translate-x-1/2 rounded-2xl border border-[var(--m-line)] bg-white/95 p-4 shadow-lg backdrop-blur-md dark:bg-zinc-900/95">
          <p className="mb-2 text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
            {copy.journal.paperColorTitle}
          </p>
          <div className="grid grid-cols-6 gap-2">
            {JOURNAL_COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                aria-label={color.label}
                title={color.label}
                onClick={() => {
                  persist({ ...page, backgroundColor: color.value });
                }}
                className={cn(
                  "size-9 rounded-full border-2 transition hover:scale-105",
                  page.backgroundColor === color.value
                    ? "border-[var(--m-accent)] ring-2 ring-[var(--m-accent)]/30"
                    : "border-white shadow-sm",
                )}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
          <p className="mt-4 mb-2 text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
            {copy.journal.paperTypeTitle}
          </p>
          <div className="grid grid-cols-4 gap-2">
            {JOURNAL_PAPER_TYPES.map((paper) => (
              <button
                key={paper.id}
                type="button"
                onClick={() => {
                  persist({ ...page, paperType: paper.id });
                }}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2 text-[10px] font-medium transition",
                  page.paperType === paper.id
                    ? "border-[var(--m-accent)] bg-[var(--m-accent)]/10 text-[var(--m-accent)]"
                    : "border-[var(--m-line)] text-[var(--m-ink-soft)] hover:bg-[var(--m-wash)]",
                )}
              >
                <span
                  className="h-10 w-full rounded-md border border-black/[0.06] shadow-inner"
                  style={getJournalPaperPreviewStyle(paper.id, page.backgroundColor)}
                  aria-hidden
                />
                {paper.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {tool === "sticker" ? (
        <div className="absolute bottom-full left-1/2 mb-3 w-[min(calc(100vw-2rem),28rem)] -translate-x-1/2 rounded-2xl border border-[var(--m-line)] bg-white/95 p-3 shadow-lg backdrop-blur-md dark:bg-zinc-900/95">
          <div className="flex flex-wrap justify-center gap-2">
            {JOURNAL_STICKERS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => addSticker(emoji)}
                className="flex size-11 items-center justify-center rounded-xl border border-[var(--m-line)] bg-white text-2xl transition hover:scale-110 hover:border-[var(--m-accent)]/40 dark:bg-zinc-800"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div
        role="toolbar"
        aria-label={copy.journal.fullscreenLabel}
        className="flex items-center gap-0.5 rounded-2xl border border-[var(--m-line)] bg-white/95 px-2 py-1.5 shadow-lg backdrop-blur-md dark:bg-zinc-900/95"
      >
        <ToolbarButton
          compact
          active={canvasTool === "select"}
          icon={MousePointer2}
          label={copy.journal.toolSelect}
          onClick={() => setCanvasTool("select")}
        />
        <ToolbarButton
          compact
          active={canvasTool === "text"}
          icon={Type}
          label={copy.journal.toolText}
          onClick={() => {
            setCanvasTool("text");
            setTool("none");
          }}
        />
        <ToolbarButton
          compact
          icon={BookOpen}
          label={copy.journal.toolVerse}
          onClick={() => {
            setVerseSheetOpen(true);
            setTool("none");
            setCanvasTool("select");
          }}
        />
        <ToolbarButton
          compact
          active={tool === "mood"}
          icon={Smile}
          label={copy.journal.toolMood}
          onClick={() => setTool(tool === "mood" ? "none" : "mood")}
        />
        <ToolbarButton
          compact
          active={tool === "color"}
          icon={Palette}
          label={copy.journal.toolColor}
          onClick={() => setTool(tool === "color" ? "none" : "color")}
        />
        <ToolbarButton
          compact
          active={tool === "sticker"}
          icon={Sticker}
          label={copy.journal.toolSticker}
          onClick={() => setTool(tool === "sticker" ? "none" : "sticker")}
        />
        <ToolbarButton
          compact
          icon={ImagePlus}
          label={copy.journal.toolPhoto}
          onClick={() => fileInputRef.current?.click()}
        />
        <ToolbarButton
          compact
          icon={Music2}
          label={copy.journal.toolYoutube}
          onClick={() => {
            setYoutubeSheetOpen(true);
            setTool("none");
            setCanvasTool("select");
          }}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleImageUpload(file);
          e.target.value = "";
        }}
      />
    </div>
  );

  const normalContent = (
    <div className="member-web-animate-in mx-auto w-full max-w-6xl pb-28 lg:pb-16">
      <header className="flex items-center justify-between gap-3 border-b border-[var(--m-line)] pb-3">
        <HistoryBackButton
          fallbackHref="/jurnal"
          label={copy.nav.journal}
          size="sm"
          variant="ghost"
          className="-ml-2 h-9 px-2 text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]"
        />
        {headerActions}
      </header>

      <div className="mt-4 space-y-2">
        <Input
          value={page.title}
          onChange={(e) => persist({ ...page, title: e.target.value })}
          placeholder={copy.journal.titlePlaceholder}
          className="member-web-display h-auto min-h-11 border-0 bg-transparent px-0 py-0.5 text-3xl font-semibold leading-tight shadow-none focus-visible:ring-0 sm:min-h-12 sm:text-4xl"
        />
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[var(--m-ink-soft)]">
          <span className="rounded-full border border-[var(--m-line)] bg-white/80 px-2.5 py-0.5 dark:bg-zinc-900/80">
            {formatShortDate(page.updatedAt)}
          </span>
          <span className="rounded-full border border-[var(--m-line)] bg-white/80 px-2.5 py-0.5 dark:bg-zinc-900/80">
            {getMoodEmoji(page.mood)} {copy.journal.pageLabel}
          </span>
          {page.passage ? (
            <span className="rounded-full border border-[var(--m-accent)]/25 bg-[var(--m-accent)]/8 px-2.5 py-0.5 font-medium text-[var(--m-accent)]">
              {page.passage}
            </span>
          ) : null}
        </div>
      </div>

      <section className="mt-4 flex w-full flex-col items-center gap-4">
        <div className="grid w-full max-w-[min(100%,72rem)] gap-4 px-1 lg:grid-cols-[minmax(0,1fr)_14.5rem] lg:items-start">
          <div className="flex justify-center rounded-2xl bg-gradient-to-b from-[#ebe7e2]/90 to-[#e3dfd9]/70 px-2 py-4 sm:px-4 sm:py-5 dark:from-zinc-800/80 dark:to-zinc-900/60">
            {bookSpread}
          </div>

          <aside className="flex flex-col gap-3 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
            {layersPanel}
          </aside>
        </div>

        <p className="flex w-full max-w-[min(100%,72rem)] items-start gap-2 px-1 text-[11px] leading-relaxed text-[var(--m-ink-soft)] sm:rounded-xl sm:border sm:border-dashed sm:border-[var(--m-line)]/80 sm:bg-[var(--m-wash)]/30 sm:px-3 sm:py-2.5">
          <Sparkles className="mt-0.5 size-3 shrink-0 text-[var(--m-accent)]" />
          {copy.journal.editorHint}
        </p>
      </section>
    </div>
  );

  const fullscreenContent = (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#e8e4df] dark:bg-zinc-900">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--m-line)] bg-white/90 px-4 py-2 backdrop-blur-md dark:bg-zinc-900/90">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <HistoryBackButton
            fallbackHref="/jurnal"
            label={copy.nav.journal}
            size="sm"
            variant="ghost"
            className="-ml-2 h-9 shrink-0 px-2 text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]"
          />
          <Input
            value={page.title}
            onChange={(e) => persist({ ...page, title: e.target.value })}
            placeholder={copy.journal.titlePlaceholder}
            className="member-web-display h-auto min-h-10 min-w-0 flex-1 border-0 bg-transparent px-0 py-0.5 text-2xl font-semibold shadow-none focus-visible:ring-0 sm:min-h-11 sm:text-3xl"
          />
        </div>
        {headerActions}
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="flex min-h-0 flex-col overflow-hidden">
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto px-3 py-4 pb-24 sm:px-6">
            {bookSpread}
          </div>
        </div>

        <aside className="hidden min-h-0 space-y-3 overflow-y-auto border-l border-[var(--m-line)] bg-white/70 p-3 backdrop-blur-sm dark:bg-zinc-900/70 lg:block">
          {layersPanel}
        </aside>
      </div>

      <div className="grid shrink-0 gap-3 border-t border-[var(--m-line)] bg-white/80 p-3 backdrop-blur-sm dark:bg-zinc-900/80 sm:grid-cols-2 lg:hidden">
        {layersPanel}
      </div>

      {floatingToolbar}
    </div>
  );

  return (
    <>
      <JournalVerseSheet
        open={verseSheetOpen}
        onOpenChange={setVerseSheetOpen}
        onInsertVerses={insertVerseBlock}
        onApplySchedule={(reading, options) => void applyScheduleReading(reading, options)}
        currentScheduleDate={page.scheduleDate}
      />
      <JournalYoutubeSheet
        open={youtubeSheetOpen}
        onOpenChange={setYoutubeSheetOpen}
        onAttach={addYoutube}
      />
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="gap-4 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{copy.journal.deleteTitle}</DialogTitle>
            <DialogDescription>{copy.journal.deleteDescription}</DialogDescription>
          </DialogHeader>
          <p className="rounded-xl bg-[var(--m-wash)] px-3.5 py-3 text-sm leading-relaxed text-[var(--m-ink)]">
            {page.title.trim() || copy.journal.untitledPage}
          </p>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {copy.journal.deleteCancel}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="font-semibold"
              onClick={confirmDelete}
            >
              <Trash2 className="size-4" />
              {copy.journal.deleteConfirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {!isFullscreen ? normalContent : null}
      {!isFullscreen && mounted ? createPortal(floatingToolbar, document.body) : null}
      {mounted && isFullscreen ? createPortal(fullscreenContent, document.body) : null}
    </>
  );
}

function clampPct(value: number) {
  return Math.min(92, Math.max(0, value));
}

function ToolbarButton({
  icon: Icon,
  label,
  active,
  onClick,
  compact,
}: {
  icon: typeof Smile;
  label: string;
  active?: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "flex items-center justify-center rounded-xl font-medium transition",
        compact
          ? "size-10 gap-0 px-0 lg:h-auto lg:w-auto lg:gap-1.5 lg:px-3 lg:py-2 lg:text-xs"
          : "flex-col gap-0.5 px-3 py-2 text-[10px]",
        active
          ? "bg-[var(--m-accent)]/10 text-[var(--m-accent)]"
          : "text-[var(--m-ink-soft)] hover:bg-[var(--m-wash)] hover:text-[var(--m-ink)]",
      )}
    >
      <Icon className="size-5 shrink-0" />
      {compact ? (
        <span className="hidden lg:inline">{label}</span>
      ) : (
        <span>{label}</span>
      )}
    </button>
  );
}
