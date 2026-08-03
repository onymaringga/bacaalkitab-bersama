import {
  BIBLE_VERSIONS,
  BIBLE_VERSION_SHORT,
  type BibleVersionCode,
} from "@/lib/bible-books";

const VERSION_STORAGE_KEY = "bacaalkitab-bible-version";

export const BIBLE_VERSION_OPTIONS = (
  Object.entries(BIBLE_VERSIONS) as [BibleVersionCode, string][]
).map(([code, label]) => ({
  code,
  label,
  short: BIBLE_VERSION_SHORT[code],
}));

export function isBibleVersionCode(value: string): value is BibleVersionCode {
  return value in BIBLE_VERSIONS;
}

export function readPreferredBibleVersion(): BibleVersionCode {
  if (typeof window === "undefined") return "tb";
  try {
    const stored = localStorage.getItem(VERSION_STORAGE_KEY);
    if (stored && isBibleVersionCode(stored)) return stored;
  } catch {
    /* ignore */
  }
  return "tb";
}

export function writePreferredBibleVersion(version: BibleVersionCode) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(VERSION_STORAGE_KEY, version);
  } catch {
    /* ignore */
  }
}
