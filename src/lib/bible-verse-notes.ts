/** Catatan kaki per rentang ayat (localStorage). */

export type VerseNoteRange = {
  verse: number;
  start: number;
  end: number;
  chapter?: number;
};

export type BibleVerseNote = {
  id: string;
  passageKey: string;
  passageLabel: string;
  ranges: VerseNoteRange[];
  /** Cuplikan teks yang dipilih saat membuat catatan. */
  quote: string;
  content: string;
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = "bacaalkitab-verse-notes";
const EVENT = "bible-verse-notes-updated";
export const MAX_VERSE_NOTE_LEN = 2000;

export const EMPTY_VERSE_NOTES: BibleVerseNote[] = [];

let cachedRaw: string | null = null;
let cachedAll: BibleVerseNote[] = EMPTY_VERSE_NOTES;
let hasCache = false;

const verseCache = new Map<string, BibleVerseNote[]>();
const passageCache = new Map<string, BibleVerseNote[]>();

function readAll(): BibleVerseNote[] {
  if (typeof window === "undefined") return EMPTY_VERSE_NOTES;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (hasCache && raw === cachedRaw) return cachedAll;
  cachedRaw = raw;
  hasCache = true;
  if (!raw) {
    cachedAll = EMPTY_VERSE_NOTES;
    return cachedAll;
  }
  try {
    const parsed = JSON.parse(raw) as BibleVerseNote[];
    cachedAll = Array.isArray(parsed) ? parsed : EMPTY_VERSE_NOTES;
  } catch {
    cachedAll = EMPTY_VERSE_NOTES;
  }
  return cachedAll;
}

function writeAll(next: BibleVerseNote[]) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(next);
  window.localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedAll = next;
  hasCache = true;
  verseCache.clear();
  passageCache.clear();
  window.dispatchEvent(new Event(EVENT));
}

function verseCacheKey(passageKey: string, verse: number, chapter?: number) {
  return `${passageKey}#${chapter ?? ""}#${verse}`;
}

/** Range pertama (ayat paling awal) — tempat ikon catatan kaki. */
export function getFirstVerseNoteRange(
  note: BibleVerseNote,
): VerseNoteRange | null {
  if (note.ranges.length === 0) return null;
  return [...note.ranges].sort((a, b) => {
    const ca = a.chapter ?? 0;
    const cb = b.chapter ?? 0;
    if (ca !== cb) return ca - cb;
    if (a.verse !== b.verse) return a.verse - b.verse;
    return a.start - b.start;
  })[0]!;
}

export function getVerseNotesForPassage(passageKey: string) {
  const cached = passageCache.get(passageKey);
  if (cached) return cached;
  const filtered = readAll()
    .filter((item) => item.passageKey === passageKey)
    .sort((a, b) => a.createdAt - b.createdAt);
  const next = filtered.length === 0 ? EMPTY_VERSE_NOTES : filtered;
  passageCache.set(passageKey, next);
  return next;
}

/**
 * Catatan yang menampilkan ikon di ayat ini.
 * Multi-ayat: ikon hanya di ayat pertama yang diblok.
 */
export function getVerseNotesForVerse(
  passageKey: string,
  verse: number,
  chapter?: number,
) {
  const key = verseCacheKey(passageKey, verse, chapter);
  const cached = verseCache.get(key);
  if (cached) return cached;
  const filtered = getVerseNotesForPassage(passageKey).filter((item) => {
    const first = getFirstVerseNoteRange(item);
    if (!first || first.verse !== verse) return false;
    if (
      chapter != null &&
      first.chapter != null &&
      first.chapter !== chapter
    ) {
      return false;
    }
    return true;
  });
  const next = filtered.length === 0 ? EMPTY_VERSE_NOTES : filtered;
  verseCache.set(key, next);
  return next;
}

export function getVerseNoteById(id: string) {
  return readAll().find((item) => item.id === id) ?? null;
}

export function subscribeBibleVerseNotes(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const wrapped = () => {
    verseCache.clear();
    passageCache.clear();
    hasCache = false;
    onChange();
  };
  window.addEventListener(EVENT, wrapped);
  window.addEventListener("storage", wrapped);
  return () => {
    window.removeEventListener(EVENT, wrapped);
    window.removeEventListener("storage", wrapped);
  };
}

export function addBibleVerseNote(input: {
  passageKey: string;
  passageLabel: string;
  ranges: VerseNoteRange[];
  quote: string;
  content: string;
}) {
  const content = input.content.trim();
  const ranges = input.ranges.filter((range) => range.end > range.start);
  if (!content || ranges.length === 0) return null;

  const now = Date.now();
  const note: BibleVerseNote = {
    id: `vn-${now}-${Math.random().toString(36).slice(2, 7)}`,
    passageKey: input.passageKey,
    passageLabel: input.passageLabel,
    ranges,
    quote: input.quote.trim(),
    content: content.slice(0, MAX_VERSE_NOTE_LEN),
    createdAt: now,
    updatedAt: now,
  };

  writeAll([...readAll(), note]);
  return note;
}

export function updateBibleVerseNote(id: string, content: string) {
  const trimmed = content.trim().slice(0, MAX_VERSE_NOTE_LEN);
  if (!trimmed) return null;
  const all = readAll();
  const index = all.findIndex((item) => item.id === id);
  if (index < 0) return null;
  const current = all[index]!;
  const next: BibleVerseNote = {
    ...current,
    content: trimmed,
    updatedAt: Date.now(),
  };
  const copy = [...all];
  copy[index] = next;
  writeAll(copy);
  return next;
}

export function removeBibleVerseNote(id: string) {
  writeAll(readAll().filter((item) => item.id !== id));
}

/** Offset ikon di ayat pertama seleksi saja. */
export function getVerseNoteMarkerOffset(
  note: BibleVerseNote,
  verse: number,
  chapter?: number,
): number | null {
  const first = getFirstVerseNoteRange(note);
  if (!first || first.verse !== verse) return null;
  if (chapter != null && first.chapter != null && first.chapter !== chapter) {
    return null;
  }
  return first.end;
}
