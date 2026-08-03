"use client";

import { useMemo, useSyncExternalStore } from "react";
import { StickyNote } from "lucide-react";

import {
  EMPTY_HIGHLIGHTS,
  buildHighlightedSegments,
  getHighlightColor,
  getHighlightsForVerse,
  subscribeBibleHighlights,
} from "@/lib/bible-highlights";
import {
  EMPTY_VERSE_NOTES,
  getVerseNoteMarkerOffset,
  getVerseNotesForVerse,
  subscribeBibleVerseNotes,
  type BibleVerseNote,
} from "@/lib/bible-verse-notes";
import { cn } from "@/lib/utils";

type HighlightedVerseTextProps = {
  passageKey: string;
  verse: number;
  content: string;
  /** Pasal — untuk bandingkan di bacaan multi-pasal. */
  chapter?: number;
  className?: string;
  onOpenNote?: (note: BibleVerseNote) => void;
};

type RenderPiece =
  | { kind: "text"; key: string; text: string; highlightId?: string; color?: string }
  | { kind: "note"; key: string; note: BibleVerseNote; index: number };

export function HighlightedVerseText({
  passageKey,
  verse,
  content,
  chapter,
  className,
  onOpenNote,
}: HighlightedVerseTextProps) {
  const highlights = useSyncExternalStore(
    subscribeBibleHighlights,
    () => getHighlightsForVerse(passageKey, verse),
    () => EMPTY_HIGHLIGHTS,
  );
  const notes = useSyncExternalStore(
    subscribeBibleVerseNotes,
    () => getVerseNotesForVerse(passageKey, verse, chapter),
    () => EMPTY_VERSE_NOTES,
  );

  const segments = useMemo(
    () => buildHighlightedSegments(content, highlights),
    [content, highlights],
  );

  const pieces = useMemo(() => {
    const markers = notes
      .map((note, index) => {
        const offset = getVerseNoteMarkerOffset(note, verse, chapter);
        if (offset == null) return null;
        return { note, index: index + 1, offset: Math.min(offset, content.length) };
      })
      .filter(Boolean) as Array<{
      note: BibleVerseNote;
      index: number;
      offset: number;
    }>;

    markers.sort((a, b) => a.offset - b.offset || a.index - b.index);

    const result: RenderPiece[] = [];
    let cursor = 0;
    let markerIdx = 0;
    let textPart = 0;

    for (const segment of segments) {
      let remaining = segment.text;
      let localStart = cursor;

      while (remaining.length > 0) {
        const nextMarker = markers[markerIdx];
        const segmentEnd = localStart + remaining.length;

        if (nextMarker && nextMarker.offset > localStart && nextMarker.offset <= segmentEnd) {
          const take = nextMarker.offset - localStart;
          if (take > 0) {
            result.push({
              kind: "text",
              key: `t-${textPart++}`,
              text: remaining.slice(0, take),
              highlightId: segment.highlightId,
              color: segment.color,
            });
          }
          result.push({
            kind: "note",
            key: `n-${nextMarker.note.id}`,
            note: nextMarker.note,
            index: nextMarker.index,
          });
          remaining = remaining.slice(take);
          localStart += take;
          markerIdx += 1;
          continue;
        }

        result.push({
          kind: "text",
          key: `t-${textPart++}`,
          text: remaining,
          highlightId: segment.highlightId,
          color: segment.color,
        });
        localStart += remaining.length;
        remaining = "";
      }

      cursor = localStart;
    }

    while (markerIdx < markers.length) {
      const nextMarker = markers[markerIdx]!;
      result.push({
        kind: "note",
        key: `n-${nextMarker.note.id}`,
        note: nextMarker.note,
        index: nextMarker.index,
      });
      markerIdx += 1;
    }

    return result;
  }, [segments, notes, verse, chapter, content.length]);

  return (
    <span
      data-verse-text
      data-verse={verse}
      data-chapter={chapter}
      className={cn("select-text", className)}
    >
      {pieces.map((piece) => {
        if (piece.kind === "note") {
          return (
            <button
              key={piece.key}
              type="button"
              data-verse-note-marker
              className={cn(
                "mx-0.5 inline-flex size-[1.15em] translate-y-[-0.15em] items-center justify-center",
                "rounded-full bg-[var(--m-accent)] align-baseline text-[0.65em] font-bold leading-none text-white",
                "shadow-sm transition hover:scale-110 hover:bg-[var(--m-ink)] active:scale-95",
              )}
              title="Buka catatan kaki"
              aria-label={`Buka catatan kaki ${piece.index}`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onOpenNote?.(piece.note);
              }}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              <StickyNote className="size-[0.7em]" strokeWidth={2.5} aria-hidden />
            </button>
          );
        }

        if (piece.color) {
          return (
            <mark
              key={piece.key}
              data-highlight-id={piece.highlightId}
              className={cn(
                "rounded-[0.2em] px-[0.08em] py-[0.05em]",
                getHighlightColor(piece.color).markClass,
              )}
            >
              {piece.text}
            </mark>
          );
        }

        return <span key={piece.key}>{piece.text}</span>;
      })}
    </span>
  );
}
