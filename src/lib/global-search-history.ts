import type { GlobalSearchResult } from "@/lib/global-search";

const STORAGE_KEY = "bacaalkitab-global-search-recent";
const MAX_RECENT = 6;

function isGlobalSearchResult(value: unknown): value is GlobalSearchResult {
  if (!value || typeof value !== "object") return false;
  const item = value as GlobalSearchResult;
  return (
    typeof item.id === "string" &&
    typeof item.kind === "string" &&
    typeof item.title === "string" &&
    typeof item.href === "string"
  );
}

export function readGlobalSearchRecent(): GlobalSearchResult[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isGlobalSearchResult);
  } catch {
    return [];
  }
}

export function pushGlobalSearchRecent(result: GlobalSearchResult) {
  if (typeof window === "undefined") return;

  const entry: GlobalSearchResult = {
    ...result,
    id: result.id.replace(/^recent-/, ""),
  };

  const next = [
    entry,
    ...readGlobalSearchRecent().filter((item) => item.href !== entry.href),
  ].slice(0, MAX_RECENT);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
}

export function clearGlobalSearchRecent() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
