"use client";

import { ChevronLeft, ChevronRight, Plus, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { JournalCanvas, type JournalCanvasTool } from "@/components/journal/journal-canvas";
import { Button } from "@/components/ui/button";
import { copy } from "@/lib/copy";
import type { JournalPaperType } from "@/lib/journal-paper";
import type { JournalElement, JournalSheet } from "@/lib/journal-entries";
import { cn } from "@/lib/utils";

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.1;
const ZOOM_DEFAULT = 1;

type JournalBookSpreadProps = {
  backgroundColor: string;
  paperType?: JournalPaperType;
  leftSheet: JournalSheet | null;
  rightSheet: JournalSheet | null;
  spreadIndex: number;
  spreadCount: number;
  activeSheetId: string | null;
  selectedId: string | null;
  activeTool: JournalCanvasTool;
  pendingEditId?: string | null;
  size?: "default" | "large";
  onSelectSheet: (sheetId: string) => void;
  onSelectElement: (id: string | null) => void;
  onChangeSheetElements: (sheetId: string, elements: JournalElement[]) => void;
  onCanvasClick: (sheetId: string, x: number, y: number) => void;
  onPendingEditConsumed?: () => void;
  onPrevSpread: () => void;
  onNextSpread: () => void;
  onAddSpread: () => void;
};

function clampZoom(value: number) {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(value * 10) / 10));
}

export function JournalBookSpread({
  backgroundColor,
  paperType = "grid",
  leftSheet,
  rightSheet,
  spreadIndex,
  spreadCount,
  activeSheetId,
  selectedId,
  activeTool,
  pendingEditId,
  size = "default",
  onSelectSheet,
  onSelectElement,
  onChangeSheetElements,
  onCanvasClick,
  onPendingEditConsumed,
  onPrevSpread,
  onNextSpread,
  onAddSpread,
}: JournalBookSpreadProps) {
  const [zoom, setZoom] = useState(ZOOM_DEFAULT);
  const bookViewportRef = useRef<HTMLDivElement>(null);

  const pageWidth =
    size === "large"
      ? "w-[min(44vw,22rem)] sm:w-[min(42vw,26rem)] lg:w-[min(40vw,30rem)]"
      : "w-[min(46vw,20rem)] sm:w-[min(44vw,24rem)] md:w-[min(42vw,28rem)] lg:w-[min(38vw,32rem)]";

  const spreadMaxWidth =
    size === "large"
      ? "max-w-[min(100%,62rem)]"
      : "max-w-[min(100%,66rem)]";

  const adjustZoom = useCallback((delta: number) => {
    setZoom((current) => clampZoom(current + delta));
  }, []);

  useEffect(() => {
    const viewport = bookViewportRef.current;
    if (!viewport) return;

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      adjustZoom(event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [adjustZoom]);

  function renderSheet(
    sheet: JournalSheet | null,
    side: "left" | "right",
  ) {
    if (!sheet) {
      return (
        <div
          className={cn(
            "flex aspect-[3/4] items-center justify-center bg-[var(--m-wash)]/50 text-[11px] text-[var(--m-ink-soft)]",
            pageWidth,
            side === "left" ? "rounded-l-[0.65rem]" : "rounded-r-[0.65rem]",
          )}
        >
          {copy.journal.emptySheet}
        </div>
      );
    }

    const isActive = activeSheetId === sheet.id;
    const sheetSelectedId =
      selectedId && sheet.elements.some((el) => el.id === selectedId) ? selectedId : null;
    const sheetPendingEditId =
      pendingEditId && sheet.elements.some((el) => el.id === pendingEditId)
        ? pendingEditId
        : null;

    return (
      <div
        role="presentation"
        onPointerDown={() => onSelectSheet(sheet.id)}
        className={cn("relative shrink-0", pageWidth, isActive && "z-[1]")}
      >
        {isActive ? (
          <div
            className="pointer-events-none absolute inset-0 z-[5] ring-2 ring-inset ring-[var(--m-accent)]"
            aria-hidden
          />
        ) : null}
        <JournalCanvas
          backgroundColor={backgroundColor}
          paperType={paperType}
          elements={sheet.elements}
          selectedId={sheetSelectedId}
          activeTool={activeTool}
          bookSide={side}
          onSelect={(id) => {
            onSelectSheet(sheet.id);
            onSelectElement(id);
          }}
          onChangeElements={(elements) => onChangeSheetElements(sheet.id, elements)}
          onCanvasClick={(x, y) => {
            onSelectSheet(sheet.id);
            onCanvasClick(sheet.id, x, y);
          }}
          pendingEditId={sheetPendingEditId}
          onPendingEditConsumed={onPendingEditConsumed}
          className="max-w-none"
        />
      </div>
    );
  }

  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="mx-auto flex w-fit max-w-full flex-col items-center">
      <div
        className={cn(
          "mb-3 flex w-full flex-wrap items-center justify-between gap-2",
          spreadMaxWidth,
        )}
      >
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            className="size-8 rounded-lg"
            disabled={spreadIndex <= 0}
            onClick={onPrevSpread}
            aria-label={copy.journal.prevSpread}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="min-w-[6.5rem] text-center text-[11px] font-medium text-[var(--m-ink-soft)]">
            {copy.journal.spreadLabel(spreadIndex + 1, spreadCount)}
          </span>
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            className="size-8 rounded-lg"
            disabled={spreadIndex >= spreadCount - 1}
            onClick={onNextSpread}
            aria-label={copy.journal.nextSpread}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <div
          className="flex items-center gap-0.5 rounded-lg border border-[var(--m-line)] bg-white/80 p-0.5 dark:bg-zinc-900/80"
          role="group"
          aria-label="Zoom buku"
        >
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="size-8 rounded-md"
            disabled={zoom <= ZOOM_MIN}
            onClick={() => adjustZoom(-ZOOM_STEP)}
            aria-label={copy.journal.zoomOut}
          >
            <ZoomOut className="size-4" />
          </Button>
          <span className="min-w-[3.25rem] select-none text-center text-[11px] font-medium tabular-nums text-[var(--m-ink-soft)]">
            {copy.journal.zoomLabel(zoomPercent)}
          </span>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="size-8 rounded-md"
            disabled={zoom >= ZOOM_MAX}
            onClick={() => adjustZoom(ZOOM_STEP)}
            aria-label={copy.journal.zoomIn}
          >
            <ZoomIn className="size-4" />
          </Button>
          {zoom !== ZOOM_DEFAULT ? (
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="size-8 rounded-md"
              onClick={() => setZoom(ZOOM_DEFAULT)}
              aria-label={copy.journal.zoomReset}
            >
              <RotateCcw className="size-3.5" />
            </Button>
          ) : null}
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 shrink-0 rounded-lg text-xs"
          onClick={onAddSpread}
        >
          <Plus className="size-3.5" />
          {copy.journal.addSpread}
        </Button>
      </div>

      <div
        ref={bookViewportRef}
        className={cn("w-full overflow-auto", spreadMaxWidth)}
      >
        <div
          className="mx-auto w-fit origin-top transition-[zoom] duration-150 ease-out"
          style={{ zoom }}
        >
          <div
            className={cn(
              "flex items-stretch overflow-hidden rounded-[0.7rem] bg-[#d4d4d8]/40 p-[3px] shadow-[0_16px_48px_rgba(15,23,42,0.14),0_4px_12px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.08] dark:bg-zinc-700/40",
            )}
          >
            {renderSheet(leftSheet, "left")}
            <div
              className="relative w-3 shrink-0 self-stretch bg-gradient-to-r from-[#a8a29e] via-[#78716c] to-[#a8a29e] shadow-[inset_0_0_6px_rgba(0,0,0,0.35)]"
              aria-hidden
            >
              <div className="absolute inset-y-3 left-1/2 w-px -translate-x-1/2 bg-white/20" />
            </div>
            {renderSheet(rightSheet, "right")}
          </div>
        </div>
      </div>
    </div>
  );
}
