"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  ExternalLink,
  GripVertical,
  ListMusic,
  Music2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { stopPassageSpeech } from "@/lib/bible-speech";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";
import {
  clampWorshipDockPosition,
  defaultWorshipDockPosition,
  getDefaultWorshipTrack,
  getWorshipTrack,
  readSavedWorshipTrackId,
  readWorshipDockPosition,
  saveWorshipDockPosition,
  saveWorshipPanelPreferOpen,
  saveWorshipTrackId,
  WORSHIP_TRACKS,
  youtubeEmbedSrc,
  youtubeWatchUrl,
  type WorshipDockPosition,
  type WorshipTrack,
} from "@/lib/worship-tracks";

const FAB_SIZE = { width: 56, height: 56 };
const PANEL_SIZE = { width: 360, height: 440 };
const DRAG_THRESHOLD = 6;

/**
 * FAB musik worship global — tampil di semua halaman app,
 * bisa digeser, panel lagu dibuka dari FAB.
 */
export function WorshipMusicFab() {
  const titleId = useId();
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);

  const [mounted, setMounted] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [trackId, setTrackId] = useState(getDefaultWorshipTrack().id);
  const [pos, setPos] = useState<WorshipDockPosition | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTrackId(readSavedWorshipTrackId());
    const saved = readWorshipDockPosition();
    if (saved) {
      setPos(clampWorshipDockPosition(saved, FAB_SIZE));
    } else {
      setPos(defaultWorshipDockPosition(FAB_SIZE));
    }
  }, []);

  const track = useMemo(
    () => getWorshipTrack(trackId) ?? getDefaultWorshipTrack(),
    [trackId],
  );

  const showFab = !panelOpen;
  const dockSize = panelOpen ? PANEL_SIZE : FAB_SIZE;

  useEffect(() => {
    if (!pos) return;
    setPos((prev) =>
      prev ? clampWorshipDockPosition(prev, dockSize) : prev,
    );
  }, [dockSize.width, dockSize.height]);

  useEffect(() => {
    if (!pos) return;
    const onResize = () => {
      setPos((prev) =>
        prev ? clampWorshipDockPosition(prev, dockSize) : prev,
      );
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pos, dockSize]);

  const openPanel = useCallback(() => {
    setPanelOpen(true);
    saveWorshipPanelPreferOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    saveWorshipPanelPreferOpen(false);
  }, []);

  const stopPlayback = useCallback(() => {
    setActive(false);
    setPanelOpen(false);
    saveWorshipPanelPreferOpen(false);
  }, []);

  const selectTrack = useCallback((next: WorshipTrack) => {
    stopPassageSpeech();
    setTrackId(next.id);
    saveWorshipTrackId(next.id);
    setActive(true);
    setPanelOpen(true);
  }, []);

  const startCurrent = useCallback(() => {
    stopPassageSpeech();
    setActive(true);
    setPanelOpen(true);
  }, []);

  const updatePos = useCallback(
    (next: WorshipDockPosition, persist: boolean) => {
      const clamped = clampWorshipDockPosition(next, dockSize);
      setPos(clamped);
      if (persist) saveWorshipDockPosition(clamped);
    },
    [dockSize],
  );

  const onDragPointerDown = useCallback(
    (event: ReactPointerEvent) => {
      if (!pos) return;
      if (event.button !== 0) return;
      const target = event.target as HTMLElement;
      if (
        panelOpen &&
        target.closest(
          "button, a, input, textarea, select, [data-no-drag]",
        ) &&
        !target.closest("[data-drag-handle]")
      ) {
        return;
      }

      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: pos.x,
        originY: pos.y,
        moved: false,
      };
      setDragging(true);
    },
    [pos, panelOpen],
  );

  const onDragPointerMove = useCallback(
    (event: ReactPointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!drag.moved && Math.hypot(dx, dy) >= DRAG_THRESHOLD) {
        drag.moved = true;
      }
      if (!drag.moved) return;
      updatePos({ x: drag.originX + dx, y: drag.originY + dy }, false);
    },
    [updatePos],
  );

  const endDrag = useCallback(
    (event: ReactPointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const wasMoved = drag.moved;
      dragRef.current = null;
      setDragging(false);
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        /* ignore */
      }

      if (wasMoved) {
        const dx = event.clientX - drag.startX;
        const dy = event.clientY - drag.startY;
        updatePos({ x: drag.originX + dx, y: drag.originY + dy }, true);
        return;
      }

      if (showFab) openPanel();
    },
    [showFab, openPanel, updatePos],
  );

  if (!mounted || !pos) return null;

  return createPortal(
    <div
      className={cn(
        "worship-music-fab fixed z-[88] touch-none select-none",
        dragging ? "cursor-grabbing" : showFab ? "cursor-grab" : null,
        showFab
          ? "size-14"
          : "flex w-[min(22rem,calc(100vw-1.5rem))] flex-col gap-3 rounded-2xl border border-[var(--m-line)] bg-white/95 p-3 shadow-[var(--shadow-float)] backdrop-blur-md",
      )}
      style={{ left: pos.x, top: pos.y }}
      role="region"
      aria-labelledby={titleId}
      onPointerDown={showFab ? onDragPointerDown : undefined}
      onPointerMove={showFab ? onDragPointerMove : undefined}
      onPointerUp={showFab ? endDrag : undefined}
      onPointerCancel={showFab ? endDrag : undefined}
    >
      {/* Stable player slot — audio survives panel open/close. */}
      <div
        key="worship-player-slot"
        className={cn(
          "overflow-hidden border border-[var(--m-line)] bg-black",
          !active && "hidden",
          active &&
            showFab &&
            "pointer-events-none absolute h-px w-px opacity-0",
          active && !showFab && "order-4 aspect-video w-full rounded-xl",
        )}
        aria-hidden={showFab || !active}
      >
        {active ? (
          <iframe
            key={track.videoId}
            title={`${track.title} — YouTube`}
            src={youtubeEmbedSrc(track.videoId, true)}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen={!showFab}
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex={showFab ? -1 : undefined}
          />
        ) : null}
      </div>

      {showFab ? (
        <button
          type="button"
          className={cn(
            "relative flex size-14 items-center justify-center overflow-hidden rounded-full border border-white/25 text-white shadow-[var(--shadow-float)]",
            "bg-[var(--m-accent,#2563eb)] ring-2 ring-[var(--m-accent,#2563eb)]/25",
            active && "ring-emerald-400/50",
            dragging && "scale-105",
          )}
          title={copy.worship.dragHint}
          aria-label={
            active ? copy.worship.bubbleLabel : copy.worship.toolbarHint
          }
          tabIndex={-1}
        >
          <Music2 className={cn("size-5", active && "animate-pulse")} />
          {active ? (
            <span className="absolute right-1 bottom-1 size-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
          ) : null}
        </button>
      ) : (
        <>
          <div className="order-1 flex items-start justify-between gap-2">
            <div
              data-drag-handle
              className="flex min-w-0 flex-1 cursor-grab items-start gap-2 active:cursor-grabbing"
              onPointerDown={onDragPointerDown}
              onPointerMove={onDragPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              title={copy.worship.dragHint}
            >
              <span className="mt-0.5 text-[var(--m-ink-soft)]">
                <GripVertical className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[var(--m-accent)] uppercase">
                  <ListMusic className="size-3.5" />
                  {copy.worship.title}
                </p>
                <p
                  id={titleId}
                  className="mt-0.5 text-sm font-semibold text-[var(--m-ink)]"
                >
                  {track.title}
                </p>
                <p className="text-xs text-[var(--m-ink-soft)]">
                  {track.artist} · {track.durationLabel}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              {active ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full"
                  aria-label={copy.worship.minimize}
                  onClick={closePanel}
                >
                  <ChevronDown className="size-4" />
                </Button>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 rounded-full"
                aria-label={copy.worship.close}
                onClick={closePanel}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          <p className="order-2 text-[11px] leading-relaxed text-[var(--m-ink-soft)]">
            {copy.worship.hint}
          </p>

          <div
            data-no-drag
            className="order-3 flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {WORSHIP_TRACKS.map((item) => {
              const selected = item.id === track.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectTrack(item)}
                  className={cn(
                    "inline-flex h-8 shrink-0 items-center rounded-lg border px-2.5 text-xs font-semibold transition",
                    selected
                      ? "border-[var(--m-accent)] bg-[var(--m-accent)] text-white"
                      : "border-[var(--m-line)] bg-[var(--m-wash)]/60 text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]",
                  )}
                >
                  {item.title.split("—")[0]?.trim() ?? item.title}
                </button>
              );
            })}
          </div>

          {!active ? (
            <Button
              type="button"
              className="order-4 h-10 w-full rounded-xl font-semibold"
              onClick={startCurrent}
            >
              <Music2 className="size-4" />
              {copy.worship.play}
            </Button>
          ) : null}

          <div className="order-5 flex items-center justify-between gap-2">
            <a
              href={youtubeWatchUrl(track.videoId)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--m-ink-soft)] underline-offset-2 hover:text-[var(--m-accent)] hover:underline"
            >
              {copy.worship.openYoutube}
              <ExternalLink className="size-3" />
            </a>
            {active ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-lg"
                onClick={stopPlayback}
              >
                {copy.worship.stop}
              </Button>
            ) : null}
          </div>
        </>
      )}
    </div>,
    document.body,
  );
}
