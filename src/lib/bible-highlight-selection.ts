export type HighlightRange = {
  verse: number;
  start: number;
  end: number;
  /** Pasal sumber (penting untuk bacaan multi-pasal). */
  chapter?: number;
};

function getTextOffsetInElement(
  root: HTMLElement,
  container: Node,
  offset: number,
): number {
  const point = document.createRange();
  try {
    point.setStart(container, offset);
    point.collapse(true);
  } catch {
    return 0;
  }

  const measure = document.createRange();
  try {
    measure.selectNodeContents(root);
    measure.setEnd(point.startContainer, point.startOffset);
    return measure.toString().length;
  } catch {
    return 0;
  }
}

function rangeOverlapsElement(range: Range, element: HTMLElement): boolean {
  try {
    if (typeof range.intersectsNode === "function") {
      return range.intersectsNode(element);
    }
  } catch {
    /* fallback below */
  }

  const elementRange = document.createRange();
  try {
    elementRange.selectNodeContents(element);
  } catch {
    return false;
  }

  return (
    range.compareBoundaryPoints(Range.END_TO_START, elementRange) < 0 &&
    range.compareBoundaryPoints(Range.START_TO_END, elementRange) > 0
  );
}

function nodeInsideElement(node: Node, element: HTMLElement): boolean {
  if (node === element) return true;
  const parent =
    node.nodeType === Node.TEXT_NODE
      ? node.parentElement
      : node instanceof Element
        ? node
        : null;
  return Boolean(parent && element.contains(parent));
}

export function collectRangesFromSelection(
  container: HTMLElement,
): { ranges: HighlightRange[]; selectedText: string } | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return null;
  }

  const range = selection.getRangeAt(0).cloneRange();
  const ancestor =
    range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
      ? (range.commonAncestorContainer as Element)
      : range.commonAncestorContainer.parentElement;

  if (!ancestor || !container.contains(ancestor)) {
    return null;
  }

  const selectedText = selection.toString().replace(/\s+/g, " ").trim();
  if (!selectedText) return null;

  const verseNodes = Array.from(
    container.querySelectorAll<HTMLElement>("[data-verse-text]"),
  );
  const ranges: HighlightRange[] = [];

  for (const verseEl of verseNodes) {
    if (!rangeOverlapsElement(range, verseEl)) continue;

    const verse = Number(verseEl.dataset.verse);
    if (!Number.isFinite(verse)) continue;

    const chapterRaw = Number(verseEl.dataset.chapter);
    const chapter =
      Number.isFinite(chapterRaw) && chapterRaw > 0 ? chapterRaw : undefined;

    const contentLength = verseEl.textContent?.length ?? 0;
    if (contentLength === 0) continue;

    const startsInside = nodeInsideElement(range.startContainer, verseEl);
    const endsInside = nodeInsideElement(range.endContainer, verseEl);

    let start = 0;
    let end = contentLength;

    if (startsInside) {
      start = getTextOffsetInElement(
        verseEl,
        range.startContainer,
        range.startOffset,
      );
    }
    if (endsInside) {
      end = getTextOffsetInElement(
        verseEl,
        range.endContainer,
        range.endOffset,
      );
    }

    start = Math.max(0, Math.min(start, contentLength));
    end = Math.max(0, Math.min(end, contentLength));
    if (end < start) {
      [start, end] = [end, start];
    }
    if (end <= start) continue;

    ranges.push({ verse, start, end, chapter });
  }

  if (ranges.length === 0) return null;
  return { ranges, selectedText };
}

/**
 * Blok seluruh teks satu ayat di DOM (untuk tap/klik ayat).
 * `contentLength` sebaiknya dari string ayat asli (bukan textContent DOM).
 */
export function selectEntireVerseText(
  verseNode: HTMLElement,
  options?: { contentLength?: number; selectedText?: string },
): { ranges: HighlightRange[]; selectedText: string } | null {
  const textEl = verseNode.querySelector<HTMLElement>("[data-verse-text]");
  if (!textEl) return null;

  const verse = Number(textEl.dataset.verse);
  if (!Number.isFinite(verse)) return null;

  const chapterRaw = Number(textEl.dataset.chapter);
  const chapter =
    Number.isFinite(chapterRaw) && chapterRaw > 0 ? chapterRaw : undefined;

  const selectedText = (
    options?.selectedText ??
    textEl.textContent ??
    ""
  )
    .replace(/\s+/g, " ")
    .trim();
  if (!selectedText) return null;

  const contentLength = Math.max(
    0,
    options?.contentLength ?? textEl.textContent?.length ?? 0,
  );
  if (contentLength <= 0) return null;

  const selection = window.getSelection();
  if (!selection) return null;

  try {
    const range = document.createRange();
    range.selectNodeContents(textEl);
    selection.removeAllRanges();
    selection.addRange(range);
  } catch {
    return null;
  }

  return {
    ranges: [{ verse, start: 0, end: contentLength, chapter }],
    selectedText,
  };
}

/** Susun teks penuh dari rentang seleksi (lebih andal dari preview toolbar). */
export function buildTextFromHighlightRanges(
  ranges: HighlightRange[],
  verseContentByNumber: Map<number, string>,
) {
  if (ranges.length === 0) return "";
  const parts = ranges.map((range) => {
    const content = verseContentByNumber.get(range.verse) ?? "";
    return content.slice(range.start, range.end);
  });
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

/**
 * Sitasi singkat: "Kejadian 37:18" atau "Kejadian 37:18–20".
 * Untuk label multi-pasal ("Kejadian 37–38") → "Kejadian 37–38 · ayat 18".
 */
export function formatSelectionCitation(
  passageLabel: string,
  verses: number[],
) {
  const sorted = [...new Set(verses)]
    .filter((verse) => Number.isFinite(verse) && verse > 0)
    .sort((a, b) => a - b);
  if (sorted.length === 0) return passageLabel.trim();

  const start = sorted[0]!;
  const end = sorted[sorted.length - 1]!;
  const base = passageLabel
    .trim()
    .replace(/\s*:\s*\d+(?:\s*[-–]\s*\d+)?\s*$/u, "")
    .trim();

  if (!base) {
    return start === end ? `ayat ${start}` : `ayat ${start}–${end}`;
  }

  const multiChapter = /^.+\s+\d+\s*[-–]\s*\d+$/u.test(base);
  if (multiChapter) {
    return start === end
      ? `${base} · ayat ${start}`
      : `${base} · ayat ${start}–${end}`;
  }

  if (start === end) return `${base}:${start}`;
  return `${base}:${start}–${end}`;
}

/** Teks siap disalin: kutipan + sumber kitab/pasal. */
export function formatSelectionCopyPayload(
  text: string,
  citation: string,
) {
  const body = text.trim();
  const source = citation.trim();
  if (!body) return source;
  if (!source) return body;
  return `“${body}”\n\n— ${source}`;
}

