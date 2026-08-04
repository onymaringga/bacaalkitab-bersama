"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { RotateCw } from "lucide-react";

import { copy } from "@/lib/copy";
import {
  getJournalPaperPatternStyle,
  type JournalPaperType,
} from "@/lib/journal-paper";
import type { JournalElement } from "@/lib/journal-entries";
import { getDefaultJournalFontFamily, getJournalFontFamily } from "@/lib/journal-constants";
import { youtubeEmbedSrc } from "@/lib/worship-tracks";
import { cn } from "@/lib/utils";

export type JournalCanvasTool = "select" | "text";

type HandleKind = "nw" | "ne" | "sw" | "se" | "rotate";

type DragState = {
  kind: "move" | "resize" | "rotate";
  id: string;
  handle?: HandleKind;
  startX: number;
  startY: number;
  origin: JournalElement;
  startRotation?: number;
  startPointerAngle?: number;
  rotateCenterX?: number;
  rotateCenterY?: number;
};

const DRAG_THRESHOLD_PX = 5;

type JournalCanvasProps = {
  backgroundColor: string;
  paperType?: JournalPaperType;
  elements: JournalElement[];
  selectedId: string | null;
  activeTool: JournalCanvasTool;
  onSelect: (id: string | null) => void;
  onChangeElements: (elements: JournalElement[]) => void;
  onCanvasClick?: (xPct: number, yPct: number) => void;
  className?: string;
  /** Mulai edit teks untuk elemen ini (mis. kotak teks baru). */
  pendingEditId?: string | null;
  onPendingEditConsumed?: () => void;
  bookSide?: "left" | "right";
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function sortByZ(elements: JournalElement[]) {
  return [...elements].sort((a, b) => a.zIndex - b.zIndex);
}

function toLocalDelta(dx: number, dy: number, rotationDeg: number) {
  const rad = (-rotationDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    localDx: dx * cos - dy * sin,
    localDy: dx * sin + dy * cos,
  };
}

function applyResize(
  origin: JournalElement,
  handle: HandleKind,
  localDx: number,
  localDy: number,
) {
  let nextX = origin.x;
  let nextY = origin.y;
  let nextW = origin.width;
  let nextH = origin.height;

  if (handle.includes("e")) nextW = clamp(origin.width + localDx, 8, 100 - origin.x);
  if (handle.includes("w")) {
    nextW = clamp(origin.width - localDx, 8, origin.width + origin.x);
    nextX = clamp(origin.x + localDx, 0, origin.x + origin.width - 8);
  }
  if (handle.includes("s")) nextH = clamp(origin.height + localDy, 8, 100 - origin.y);
  if (handle.includes("n")) {
    nextH = clamp(origin.height - localDy, 8, origin.height + origin.y);
    nextY = clamp(origin.y + localDy, 0, origin.y + origin.height - 8);
  }

  if (origin.type === "sticker") {
    const size = Math.max(nextW, nextH);
    return { x: nextX, y: nextY, width: size, height: size };
  }

  if (origin.type === "youtube") {
    nextH = (nextW * 9) / 16;
    if (nextY + nextH > 100) {
      nextH = clamp(100 - nextY, 8, 100);
      nextW = (nextH * 16) / 9;
    }
    if (nextX + nextW > 100) {
      nextW = clamp(100 - nextX, 8, 100);
      nextH = (nextW * 9) / 16;
    }
    return { x: nextX, y: nextY, width: nextW, height: nextH };
  }

  return { x: nextX, y: nextY, width: nextW, height: nextH };
}

function updateElement(
  elements: JournalElement[],
  id: string,
  patch: Partial<JournalElement>,
) {
  return elements.map((el) => (el.id === id ? { ...el, ...patch } : el));
}

function elementFontFamily(element: JournalElement) {
  return getJournalFontFamily(getDefaultJournalFontFamily(element));
}

type JournalTextEditorProps = {
  element: JournalElement;
  editorRef: RefObject<HTMLDivElement | null>;
  initialContent: string;
  onChange: (content: string) => void;
  onEnd: () => void;
};

function JournalTextEditor({
  element,
  editorRef,
  initialContent,
  onChange,
  onEnd,
}: JournalTextEditorProps) {
  useEffect(() => {
    const node = editorRef.current;
    if (!node) return;

    const frame = window.requestAnimationFrame(() => {
      node.textContent = initialContent;
      node.focus();
      const range = document.createRange();
      range.selectNodeContents(node);
      range.collapse(false);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    });

    return () => window.cancelAnimationFrame(frame);
    // Seed konten sekali saat sesi edit dimulai — jangan ikut initialContent tiap ketikan.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorRef, element.id]);

  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onPointerDown={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
      onInput={(event) => onChange(event.currentTarget.textContent ?? "")}
      onBlur={() => onEnd()}
      className="pointer-events-auto h-full w-full overflow-auto rounded bg-white/40 px-2 py-1 outline-none cursor-text"
      style={{
        fontSize: element.fontSize ?? 15,
        color: element.color ?? "#1e293b",
        fontFamily: elementFontFamily(element),
        lineHeight: 1.5,
      }}
    />
  );
}

export function JournalCanvas({
  backgroundColor,
  paperType = "grid",
  elements,
  selectedId,
  activeTool,
  onSelect,
  onChangeElements,
  onCanvasClick,
  className,
  pendingEditId,
  onPendingEditConsumed,
  bookSide,
}: JournalCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef(elements);
  const onChangeElementsRef = useRef(onChangeElements);
  const dragRef = useRef<DragState | null>(null);
  const pendingDragRef = useRef<DragState | null>(null);
  const pendingDragCleanupRef = useRef<(() => void) | null>(null);
  const editingContentRef = useRef<HTMLDivElement | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    elementsRef.current = elements;
  }, [elements]);

  useEffect(() => {
    onChangeElementsRef.current = onChangeElements;
  }, [onChangeElements]);

  const commitElements = useCallback((nextElements: JournalElement[]) => {
    elementsRef.current = nextElements;
    onChangeElementsRef.current(nextElements);
  }, []);

  const saveEditingContent = useCallback(() => {
    if (!editingId) return;
    const content = editingContentRef.current?.textContent ?? "";
    commitElements(
      updateElement(elementsRef.current, editingId, { content }),
    );
  }, [commitElements, editingId]);

  const stopEditing = useCallback(() => {
    if (!editingId) return;
    saveEditingContent();
    setEditingId(null);
    editingContentRef.current = null;
  }, [editingId, saveEditingContent]);

  useEffect(() => {
    if (!pendingEditId) return;
    if (!elements.some((element) => element.id === pendingEditId)) return;
    setEditingId(pendingEditId);
    onPendingEditConsumed?.();
  }, [pendingEditId, elements, onPendingEditConsumed]);

  const getCanvasPoint = useCallback((clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { xPct: 0, yPct: 0 };
    return {
      xPct: ((clientX - rect.left) / rect.width) * 100,
      yPct: ((clientY - rect.top) / rect.height) * 100,
    };
  }, []);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const drag = dragRef.current;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!drag || !rect) return;

      const dx = ((event.clientX - drag.startX) / rect.width) * 100;
      const dy = ((event.clientY - drag.startY) / rect.height) * 100;
      const origin = drag.origin;

      const currentElements = elementsRef.current;

      if (drag.kind === "move") {
        commitElements(
          updateElement(currentElements, drag.id, {
            x: clamp(origin.x + dx, 0, 100 - origin.width),
            y: clamp(origin.y + dy, 0, 100 - origin.height),
          }),
        );
        return;
      }

      if (drag.kind === "rotate") {
        const centerX = drag.rotateCenterX ?? 0;
        const centerY = drag.rotateCenterY ?? 0;
        const startAngle = drag.startPointerAngle ?? 0;
        const startRotation = drag.startRotation ?? origin.rotation ?? 0;
        const currentAngle =
          Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
        let nextRotation = startRotation + (currentAngle - startAngle);
        if (event.shiftKey) {
          nextRotation = Math.round(nextRotation / 15) * 15;
        }
        commitElements(
          updateElement(currentElements, drag.id, {
            rotation: Math.round(nextRotation),
          }),
        );
        return;
      }

      const handle = drag.handle ?? "se";
      const { localDx, localDy } = toLocalDelta(dx, dy, origin.rotation ?? 0);
      const next = applyResize(origin, handle, localDx, localDy);
      commitElements(updateElement(currentElements, drag.id, next));
    },
    [commitElements],
  );

  const handlePointerUp = useCallback((event?: PointerEvent) => {
    pendingDragCleanupRef.current?.();
    pendingDragCleanupRef.current = null;
    pendingDragRef.current = null;
    if (event?.pointerId != null && canvasRef.current?.releasePointerCapture) {
      try {
        if (canvasRef.current.hasPointerCapture(event.pointerId)) {
          canvasRef.current.releasePointerCapture(event.pointerId);
        }
      } catch {
        // Ignore release errors.
      }
    }
    dragRef.current = null;
    document.removeEventListener("pointermove", handlePointerMove, { capture: true });
    document.removeEventListener("pointerup", handlePointerUp, { capture: true });
    document.removeEventListener("pointercancel", handlePointerUp, { capture: true });
  }, [handlePointerMove]);

  useEffect(() => {
    return () => {
      pendingDragCleanupRef.current?.();
      pendingDragCleanupRef.current = null;
      document.removeEventListener("pointermove", handlePointerMove, { capture: true });
      document.removeEventListener("pointerup", handlePointerUp, { capture: true });
      document.removeEventListener("pointercancel", handlePointerUp, { capture: true });
    };
  }, [handlePointerMove, handlePointerUp]);

  const cancelPendingDrag = useCallback(() => {
    pendingDragCleanupRef.current?.();
    pendingDragCleanupRef.current = null;
    pendingDragRef.current = null;
  }, []);

  const activateDrag = useCallback(
    (dragState: DragState, pointerId?: number) => {
      dragRef.current = dragState;
      stopEditing();

      if (pointerId != null && canvasRef.current?.setPointerCapture) {
        try {
          canvasRef.current.setPointerCapture(pointerId);
        } catch {
          // Some browsers reject capture on certain targets.
        }
      }

      document.addEventListener("pointermove", handlePointerMove, { capture: true });
      document.addEventListener("pointerup", handlePointerUp, { capture: true });
      document.addEventListener("pointercancel", handlePointerUp, { capture: true });
    },
    [handlePointerMove, handlePointerUp, stopEditing],
  );

  const armTextMoveDrag = useCallback(
    (event: ReactPointerEvent, element: JournalElement) => {
      cancelPendingDrag();
      onSelect(element.id);

      const dragState: DragState = {
        kind: "move",
        id: element.id,
        startX: event.clientX,
        startY: event.clientY,
        origin: element,
      };
      pendingDragRef.current = dragState;

      const onPendingMove = (moveEvent: PointerEvent) => {
        const pending = pendingDragRef.current;
        if (!pending || pending.id !== element.id) return;

        const distance = Math.hypot(
          moveEvent.clientX - pending.startX,
          moveEvent.clientY - pending.startY,
        );
        if (distance < DRAG_THRESHOLD_PX) return;

        cancelPendingDrag();
        activateDrag(pending, moveEvent.pointerId);
        handlePointerMove(moveEvent);
      };

      const onPendingUp = () => {
        cancelPendingDrag();
      };

      document.addEventListener("pointermove", onPendingMove);
      document.addEventListener("pointerup", onPendingUp);
      document.addEventListener("pointercancel", onPendingUp);

      pendingDragCleanupRef.current = () => {
        document.removeEventListener("pointermove", onPendingMove);
        document.removeEventListener("pointerup", onPendingUp);
        document.removeEventListener("pointercancel", onPendingUp);
      };
    },
    [activateDrag, cancelPendingDrag, handlePointerMove, onSelect],
  );

  const beginTextEditing = useCallback(
    (element: JournalElement) => {
      cancelPendingDrag();
      if (editingId && editingId !== element.id) stopEditing();
      onSelect(element.id);
      setEditingId(element.id);
    },
    [cancelPendingDrag, editingId, onSelect, stopEditing],
  );

  function startDrag(
    event: ReactPointerEvent,
    element: JournalElement,
    kind: DragState["kind"],
    handle?: HandleKind,
    elementRect?: DOMRect,
  ) {
    if (activeTool !== "select") return;
    event.stopPropagation();
    event.preventDefault();
    cancelPendingDrag();
    onSelect(element.id);

    const dragState: DragState = {
      kind,
      id: element.id,
      handle,
      startX: event.clientX,
      startY: event.clientY,
      origin: element,
    };

    if (kind === "rotate") {
      const rect =
        elementRect ??
        (event.currentTarget as HTMLElement)
          .closest("[data-journal-element]")
          ?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        dragState.startRotation = element.rotation ?? 0;
        dragState.startPointerAngle =
          Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
        dragState.rotateCenterX = centerX;
        dragState.rotateCenterY = centerY;
      }
    }

    dragRef.current = dragState;
    stopEditing();

    if (canvasRef.current?.setPointerCapture) {
      try {
        canvasRef.current.setPointerCapture(event.pointerId);
      } catch {
        // Some browsers reject capture on certain targets.
      }
    }

    document.addEventListener("pointermove", handlePointerMove, { capture: true });
    document.addEventListener("pointerup", handlePointerUp, { capture: true });
    document.addEventListener("pointercancel", handlePointerUp, { capture: true });
  }

  function isJournalHandle(target: EventTarget | null) {
    return target instanceof Element && target.closest("[data-journal-handle]");
  }

  function handleElementPointerDown(
    event: ReactPointerEvent<HTMLDivElement>,
    element: JournalElement,
  ) {
    if (activeTool !== "select") return;
    if (isJournalHandle(event.target)) return;
    if (editingId === element.id) return;

    event.stopPropagation();

    if (element.type === "text") {
      armTextMoveDrag(event, element);
      return;
    }

    startDrag(event, element, "move");
  }

  function renderSelectionChrome(element: JournalElement) {
    return (
      <div
        key={`selection-${element.id}`}
        data-journal-selection={element.id}
        className="absolute z-[200] touch-none overflow-visible"
        style={{
          left: `${element.x}%`,
          top: `${element.y}%`,
          width: `${element.width}%`,
          height: `${element.height}%`,
          pointerEvents: "none",
        }}
      >
        <div
          className="absolute inset-0 overflow-visible"
          style={{
            transform: `rotate(${element.rotation}deg)`,
            transformOrigin: "center center",
            pointerEvents: "none",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded border-2 border-[#3b82f6]"
            aria-hidden
          />
          {(["nw", "ne", "sw", "se"] as const).map((handle) => (
            <button
              key={handle}
              type="button"
              data-journal-handle={handle}
              aria-label={copy.journal.resizeHandle}
              className={cn(
                "absolute z-[60] size-6 touch-none rounded-sm border-2 border-white bg-[#3b82f6] shadow-md",
                handle === "nw" && "-left-3 -top-3 cursor-nwse-resize",
                handle === "ne" && "-right-3 -top-3 cursor-nesw-resize",
                handle === "sw" && "-bottom-3 -left-3 cursor-nesw-resize",
                handle === "se" && "-bottom-3 -right-3 cursor-nwse-resize",
              )}
              style={{ pointerEvents: "auto" }}
              onPointerDown={(event) => {
                event.stopPropagation();
                event.preventDefault();
                startDrag(event, element, "resize", handle);
              }}
            />
          ))}
          <div
            className="absolute left-1/2 top-0 flex -translate-x-1/2 flex-col items-center"
            style={{
              pointerEvents: "auto",
              transform: "translateY(calc(-100% - 0px))",
            }}
          >
            <div className="pointer-events-none h-7 w-0.5 bg-[#3b82f6]" aria-hidden />
            <button
              type="button"
              data-journal-handle="rotate"
              aria-label={copy.journal.rotateHandle}
              title={copy.journal.rotateHandleHint}
              className="relative z-[60] flex size-10 shrink-0 touch-none items-center justify-center rounded-full border-2 border-white bg-[#3b82f6] text-white shadow-md cursor-grab active:cursor-grabbing"
              onPointerDown={(event) => {
                event.stopPropagation();
                event.preventDefault();
                const wrapper = canvasRef.current?.querySelector(
                  `[data-journal-element="${element.id}"]`,
                );
                startDrag(
                  event,
                  element,
                  "rotate",
                  undefined,
                  wrapper?.getBoundingClientRect(),
                );
              }}
            >
              <RotateCw className="size-5" strokeWidth={2.25} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    );
  }

  function handleCanvasPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    const point = getCanvasPoint(event.clientX, event.clientY);
    if (activeTool === "text") {
      onCanvasClick?.(point.xPct, point.yPct);
      return;
    }
    onSelect(null);
    stopEditing();
  }

  const sorted = sortByZ(elements);
  const selectedElement = selectedId
    ? elements.find((element) => element.id === selectedId) ?? null
    : null;
  const paperPattern = getJournalPaperPatternStyle(paperType, backgroundColor);

  return (
    <div
      ref={canvasRef}
      className={cn(
        "relative aspect-[3/4] w-full overflow-visible",
        bookSide
          ? "min-h-0"
          : "mx-auto max-w-md min-h-[240px] min-w-[200px] rounded-xl",
        bookSide === "left" && "rounded-l-[0.65rem] rounded-r-none",
        bookSide === "right" && "rounded-r-[0.65rem] rounded-l-none",
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden",
          !bookSide && "rounded-xl shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_rgba(15,23,42,0.08),0_24px_48px_rgba(15,23,42,0.04)] ring-1 ring-black/[0.06]",
          bookSide === "left" && "rounded-l-[0.65rem] rounded-r-none",
          bookSide === "right" && "rounded-r-[0.65rem] rounded-l-none",
        )}
        style={{ backgroundColor }}
      >
        {paperPattern ? (
          <div
            className="absolute inset-0"
            style={paperPattern}
            aria-hidden
          />
        ) : null}
      </div>

      <div
        className={cn(
          "absolute inset-0 touch-none overflow-visible",
          activeTool === "text" ? "cursor-crosshair" : "cursor-default",
        )}
        onPointerDown={handleCanvasPointerDown}
      >
      {sorted.map((element) => {
        const selected = selectedId === element.id;
        const isEditing = editingId === element.id;

        return (
          <div
            key={element.id}
            data-journal-element={element.id}
            className={cn(
              "absolute touch-none overflow-visible",
              selected && "z-[20]",
              activeTool === "select" && (selected ? "cursor-move" : "cursor-pointer"),
            )}
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: `${element.width}%`,
              height: `${element.height}%`,
            }}
            onPointerDown={(event) => handleElementPointerDown(event, element)}
            onDoubleClick={(event) => {
              if (element.type !== "text" || activeTool !== "select") return;
              event.stopPropagation();
              event.preventDefault();
              beginTextEditing(element);
            }}
          >
            <div
              className={cn(
                "pointer-events-none relative z-0 h-full w-full",
                isEditing && "pointer-events-auto",
              )}
              style={{
                transform: `rotate(${element.rotation}deg)`,
                transformOrigin: "center center",
              }}
            >
            {element.type === "text" ? (
              isEditing ? (
                <JournalTextEditor
                  element={element}
                  editorRef={editingContentRef}
                  initialContent={element.content ?? ""}
                  onChange={(content) => {
                    commitElements(
                      updateElement(elementsRef.current, element.id, { content }),
                    );
                  }}
                  onEnd={stopEditing}
                />
              ) : (
                <div
                  className="h-full w-full overflow-auto px-2 py-1 whitespace-pre-wrap select-none"
                  style={{
                    fontSize: element.fontSize ?? 15,
                    color: element.color ?? "#1e293b",
                    fontFamily: elementFontFamily(element),
                    lineHeight: 1.5,
                  }}
                >
                  {element.passageRef ? (
                    <span className="mb-1 block text-[0.72em] font-semibold uppercase tracking-wide text-[var(--m-accent)]">
                      {element.passageRef}
                    </span>
                  ) : null}
                  {element.content || (
                    <span className="text-[var(--m-ink-soft)]/50">{copy.journal.writePlaceholder}</span>
                  )}
                </div>
              )
            ) : null}

            {element.type === "sticker" ? (
              <div className="flex h-full w-full items-center justify-center text-[clamp(1.5rem,5vw,2.75rem)] leading-none select-none">
                {element.emoji}
              </div>
            ) : null}

            {element.type === "image" && element.src ? (
              <div className="h-full w-full overflow-hidden rounded-md border border-white/70 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={element.src}
                  alt=""
                  className="block h-full w-full object-cover pointer-events-none select-none"
                  draggable={false}
                />
              </div>
            ) : null}

            {element.type === "youtube" && element.youtubeId ? (
              <div className="flex h-full w-full flex-col overflow-hidden rounded-md border border-white/70 bg-black shadow-md">
                {element.content ? (
                  <p className="pointer-events-none truncate px-2 py-1 text-[10px] font-medium text-white/90">
                    {element.content}
                  </p>
                ) : null}
                <iframe
                  title={element.content || copy.journal.layerYoutube}
                  src={youtubeEmbedSrc(element.youtubeId, false)}
                  className={cn(
                    "min-h-0 w-full flex-1 border-0",
                    selected ? "pointer-events-auto" : "pointer-events-none",
                  )}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : null}
            </div>
          </div>
        );
      })}
      {selectedElement && activeTool === "select" && editingId !== selectedElement.id
        ? renderSelectionChrome(selectedElement)
        : null}
      </div>
    </div>
  );
}
