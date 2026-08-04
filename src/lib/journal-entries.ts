"use client";

import {
  normalizeJournalPaperType,
  type JournalPaperType,
} from "@/lib/journal-paper";

export type JournalElementType = "text" | "sticker" | "image" | "youtube";

export type JournalElement = {
  id: string;
  type: JournalElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  content?: string;
  emoji?: string;
  src?: string;
  fontSize?: number;
  color?: string;
  /** display | sans | serif | script | mono */
  fontFamily?: string;
  /** Referensi ayat Alkitab untuk blok teks */
  passageRef?: string;
  /** ID video YouTube untuk elemen lagu */
  youtubeId?: string;
};

/** @deprecated Legacy sticker shape — migrated to elements */
export type JournalStickerItem = {
  id: string;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
};

/** @deprecated Legacy image shape — migrated to elements */
export type JournalImageItem = {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  rotation: number;
};

export type JournalSheet = {
  id: string;
  elements: JournalElement[];
};

export type JournalPage = {
  id: string;
  title: string;
  mood: string;
  backgroundColor: string;
  paperType: JournalPaperType;
  sheets: JournalSheet[];
  createdAt: string;
  updatedAt: string;
  /** Tanggal jadwal baca terkait (yyyy-MM-dd) */
  scheduleDate?: string;
  /** Referensi bacaan jadwal, mis. Kejadian 1-2 */
  passage?: string;
  /** @deprecated migrated to sheets */
  elements?: JournalElement[];
  /** @deprecated migrated to elements */
  text?: string;
  stickers?: JournalStickerItem[];
  images?: JournalImageItem[];
};

const STORAGE_KEY = "bacaalkitab-journal-pages";

const EMPTY: JournalPage[] = [];
export const EMPTY_JOURNAL_PAGES: JournalPage[] = EMPTY;

let cachedRaw: string | null = null;
let cachedPages: JournalPage[] = EMPTY;
let hasCache = false;
let listCacheRaw: string | null = null;
let listCache: JournalPage[] = EMPTY_JOURNAL_PAGES;

export function createJournalElement(
  partial: Omit<JournalElement, "id" | "zIndex"> & { id?: string; zIndex?: number },
): JournalElement {
  return normalizeJournalElement(partial);
}

export function createJournalSheet(
  partial?: Partial<Pick<JournalSheet, "id" | "elements">>,
): JournalSheet {
  return {
    id: partial?.id ?? crypto.randomUUID(),
    elements: (partial?.elements ?? [])
      .filter((el): el is JournalElement => el != null && typeof el === "object")
      .map((el) => normalizeJournalElement(el))
      .sort((a, b) => a.zIndex - b.zIndex),
  };
}

export function getJournalSheets(page: JournalPage | null | undefined): JournalSheet[] {
  return migrateJournalPage(page).sheets;
}

export function getSpreadCount(sheets: JournalSheet[]) {
  return Math.max(1, Math.ceil(Math.max(sheets.length, 2) / 2));
}

export function getSpreadSheets(
  sheets: JournalSheet[],
  spreadIndex: number,
): [JournalSheet | null, JournalSheet | null] {
  const left = sheets[spreadIndex * 2] ?? null;
  const right = sheets[spreadIndex * 2 + 1] ?? null;
  return [left, right];
}

function normalizeJournalElement(
  partial: Partial<JournalElement> & { type?: JournalElementType },
): JournalElement {
  return {
    id: partial.id ?? crypto.randomUUID(),
    type: partial.type ?? "text",
    x: partial.x ?? 10,
    y: partial.y ?? 10,
    width: partial.width ?? 40,
    height: partial.height ?? 20,
    rotation: partial.rotation ?? 0,
    zIndex: partial.zIndex ?? 0,
    content: typeof partial.content === "string" ? partial.content : "",
    emoji: partial.emoji,
    src: partial.src,
    fontSize: partial.fontSize ?? 15,
    color: partial.color ?? "#1e293b",
    fontFamily: partial.fontFamily,
    passageRef: partial.passageRef,
    youtubeId: partial.youtubeId,
  };
}

function migrateLegacyElements(page: JournalPage): JournalElement[] {
  if (Array.isArray(page.elements) && page.elements.length > 0) {
    return page.elements
      .filter((el): el is JournalElement => el != null && typeof el === "object")
      .map((el) => normalizeJournalElement(el))
      .sort((a, b) => a.zIndex - b.zIndex);
  }

  const elements: JournalElement[] = [];
  let z = 0;

  const legacyText = typeof page.text === "string" ? page.text.trim() : "";
  if (legacyText) {
    elements.push(
      createJournalElement({
        type: "text",
        x: 8,
        y: 10,
        width: 84,
        height: 78,
        rotation: 0,
        zIndex: z++,
        content: legacyText,
        fontSize: 15,
        color: "#1e293b",
      }),
    );
  }

  for (const sticker of page.stickers ?? []) {
    if (!sticker || typeof sticker !== "object") continue;
    elements.push(
      createJournalElement({
        id: sticker.id,
        type: "sticker",
        x: sticker.x ?? 20,
        y: sticker.y ?? 20,
        width: 14,
        height: 14,
        rotation: sticker.rotation ?? 0,
        zIndex: z++,
        emoji: sticker.emoji ?? "✨",
      }),
    );
  }

  for (const image of page.images ?? []) {
    if (!image || typeof image !== "object" || !image.src) continue;
    elements.push(
      createJournalElement({
        id: image.id,
        type: "image",
        x: image.x ?? 15,
        y: image.y ?? 20,
        width: image.width ?? 40,
        height: 28,
        rotation: image.rotation ?? 0,
        zIndex: z++,
        src: image.src,
      }),
    );
  }

  return elements;
}

function migrateJournalSheets(page: JournalPage): JournalSheet[] {
  if (Array.isArray(page.sheets) && page.sheets.length > 0) {
    const normalized = page.sheets
      .filter((sheet): sheet is JournalSheet => sheet != null && typeof sheet === "object")
      .map((sheet) => createJournalSheet(sheet));
    if (normalized.length >= 2) return normalized;
    if (normalized.length === 1) {
      return [normalized[0]!, createJournalSheet()];
    }
  }

  const legacyElements = migrateLegacyElements(page);
  return [
    createJournalSheet({ elements: legacyElements }),
    createJournalSheet(),
  ];
}

export function migrateJournalPage(page: JournalPage | null | undefined): JournalPage {
  if (!page || typeof page !== "object") {
    const sheets = [
      createJournalSheet({
        elements: [
          createJournalElement({
            type: "text",
            x: 8,
            y: 10,
            width: 84,
            height: 78,
            rotation: 0,
            zIndex: 0,
            content: "",
            fontSize: 15,
            color: "#1e293b",
          }),
        ],
      }),
      createJournalSheet(),
    ];
    return {
      id: crypto.randomUUID(),
      title: "",
      mood: "tenang",
      backgroundColor: "#fffbeb",
      paperType: "grid",
      sheets,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const sheets = migrateJournalSheets(page);

  return {
    id: page.id ?? crypto.randomUUID(),
    title: typeof page.title === "string" ? page.title : "",
    mood: typeof page.mood === "string" ? page.mood : "tenang",
    backgroundColor:
      typeof page.backgroundColor === "string" ? page.backgroundColor : "#fffbeb",
    paperType: normalizeJournalPaperType(page.paperType),
    scheduleDate: typeof page.scheduleDate === "string" ? page.scheduleDate : undefined,
    passage: typeof page.passage === "string" ? page.passage : undefined,
    sheets,
    createdAt: page.createdAt ?? new Date().toISOString(),
    updatedAt: page.updatedAt ?? new Date().toISOString(),
  };
}

export function getJournalPreviewText(page: JournalPage | null | undefined): string {
  const normalized = migrateJournalPage(page);
  const text = normalized.sheets
    .flatMap((sheet) => sheet.elements)
    .filter(
      (el) =>
        el.type === "text" &&
        typeof el.content === "string" &&
        el.content.trim().length > 0,
    )
    .map((el) => (el.content as string).trim())
    .join(" ");
  return text.slice(0, 120);
}

function normalizeStoredPage(raw: unknown): JournalPage {
  return migrateJournalPage(raw as JournalPage);
}

function readPages(): JournalPage[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (hasCache && raw === cachedRaw) return cachedPages;
  cachedRaw = raw;
  hasCache = true;
  if (!raw) {
    cachedPages = EMPTY;
    return cachedPages;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    cachedPages = Array.isArray(parsed)
      ? parsed
          .filter((p): p is JournalPage => p != null && typeof p === "object")
          .map(normalizeStoredPage)
      : EMPTY;
  } catch {
    cachedPages = EMPTY;
  }
  return cachedPages;
}

function writePages(pages: JournalPage[]) {
  if (typeof window === "undefined") return;
  const normalized = pages.map(normalizeStoredPage);
  const raw = JSON.stringify(normalized);
  window.localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedPages = normalized;
  hasCache = true;
  listCacheRaw = null;
  window.dispatchEvent(new Event("journal-pages-updated"));
}

export function getJournalPagesSnapshot(): string {
  return cachedRaw ?? readPages().map((p) => p.id).join("|");
}

export function listJournalPages(): JournalPage[] {
  const raw =
    typeof window === "undefined"
      ? null
      : (cachedRaw ?? window.localStorage.getItem(STORAGE_KEY));
  if (listCacheRaw === raw) return listCache;

  const next = [...readPages()].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
  listCacheRaw = raw;
  listCache = next.length === 0 ? EMPTY_JOURNAL_PAGES : next;
  return listCache;
}

export function getServerJournalPages(): JournalPage[] {
  return EMPTY_JOURNAL_PAGES;
}

export function getServerJournalPage(): JournalPage | null {
  return null;
}

export function getJournalPage(id: string): JournalPage | null {
  return readPages().find((p) => p.id === id) ?? null;
}

export function createJournalPage(
  partial?: Partial<
    Pick<JournalPage, "title" | "mood" | "backgroundColor" | "paperType" | "scheduleDate" | "passage">
  > & {
    sheets?: JournalSheet[];
    /** @deprecated use sheets */
    elements?: JournalElement[];
  },
): JournalPage {
  const now = new Date().toISOString();
  const defaultFirstElements = partial?.elements ?? [
    createJournalElement({
      type: "text",
      x: 8,
      y: 10,
      width: 84,
      height: 78,
      rotation: 0,
      zIndex: 0,
      content: "",
      fontSize: 15,
      color: "#1e293b",
    }),
  ];
  const sheets = partial?.sheets ?? [
    createJournalSheet({ elements: defaultFirstElements }),
    createJournalSheet(),
  ];
  const page: JournalPage = {
    id: crypto.randomUUID(),
    title: partial?.title ?? "",
    mood: partial?.mood ?? "tenang",
    backgroundColor: partial?.backgroundColor ?? "#fffbeb",
    paperType: normalizeJournalPaperType(partial?.paperType),
    scheduleDate: partial?.scheduleDate,
    passage: partial?.passage,
    sheets,
    createdAt: now,
    updatedAt: now,
  };
  writePages([page, ...readPages()]);
  return page;
}

export function updateJournalPage(
  id: string,
  patch: Partial<Omit<JournalPage, "id" | "createdAt">>,
): JournalPage | null {
  const pages = readPages();
  const index = pages.findIndex((p) => p.id === id);
  if (index < 0) return null;
  const updated: JournalPage = normalizeStoredPage({
    ...pages[index]!,
    ...patch,
    updatedAt: new Date().toISOString(),
  });
  pages[index] = updated;
  writePages(pages);
  return updated;
}

export function deleteJournalPage(id: string) {
  writePages(readPages().filter((p) => p.id !== id));
}

export function subscribeJournalPages(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => undefined;
  const handler = () => {
    hasCache = false;
    listCacheRaw = null;
    onStoreChange();
  };
  window.addEventListener("journal-pages-updated", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("journal-pages-updated", handler);
    window.removeEventListener("storage", handler);
  };
}

export function nextJournalZIndex(elements: JournalElement[] = []) {
  return elements.reduce((max, el) => Math.max(max, el?.zIndex ?? 0), -1) + 1;
}
