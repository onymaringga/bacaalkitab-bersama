/**
 * Override teks UI — flatten, merge, dan terapkan ke objek copy global.
 */

import { copy } from "@/lib/copy";

export type CopyOverrides = Record<string, string>;

export const COPY_OVERRIDES_STORAGE_KEY = "bab-copy-overrides";

const SKIP_KEYS = new Set(["popularLinks"]);

export function flattenCopyStrings(
  value: unknown,
  prefix = "",
  result: CopyOverrides = {},
): CopyOverrides {
  if (typeof value === "string") {
    if (prefix) result[prefix] = value;
    return result;
  }

  if (typeof value === "function" || value === null || value === undefined) {
    return result;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      if (typeof item === "string" && prefix) {
        result[`${prefix}.${index}`] = item;
      } else if (typeof item === "object" && item !== null) {
        flattenCopyStrings(item, `${prefix}.${index}`, result);
      }
    });
    return result;
  }

  if (typeof value === "object") {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (SKIP_KEYS.has(key)) continue;
      const path = prefix ? `${prefix}.${key}` : key;
      flattenCopyStrings(nested, path, result);
    }
  }

  return result;
}

export function getCopyByPath(path: string, root: unknown = copy): string | null {
  const parts = path.split(".");
  let current: unknown = root;

  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") {
      return null;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === "string" ? current : null;
}

export function setCopyByPath(path: string, value: string, root: unknown = copy) {
  const parts = path.split(".");
  let current: unknown = root;

  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index]!;
    if (current === null || typeof current !== "object") return;
    current = (current as Record<string, unknown>)[part];
  }

  const last = parts[parts.length - 1];
  if (!last || current === null || typeof current !== "object") return;
  (current as Record<string, unknown>)[last] = value;
}

export function buildCopyTextIndex(source: CopyOverrides) {
  const index = new Map<string, string[]>();

  for (const [path, text] of Object.entries(source)) {
    const normalized = text.trim();
    if (normalized.length < 2) continue;
    const existing = index.get(normalized) ?? [];
    existing.push(path);
    index.set(normalized, existing);
  }

  return index;
}

export function applyCopyOverrides(overrides: CopyOverrides) {
  for (const [path, value] of Object.entries(overrides)) {
    setCopyByPath(path, value);
  }
}

export function readCopyOverridesFromStorage(): CopyOverrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(COPY_OVERRIDES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CopyOverrides;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writeCopyOverridesToStorage(overrides: CopyOverrides) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COPY_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
}

let defaultCopyStrings: CopyOverrides | null = null;

export function captureDefaultCopyStrings() {
  if (!defaultCopyStrings) {
    defaultCopyStrings = flattenCopyStrings(copy);
  }
  return defaultCopyStrings;
}

captureDefaultCopyStrings();

export function getDefaultCopyStrings() {
  return captureDefaultCopyStrings();
}

export function restoreDefaultCopyStrings() {
  const defaults = captureDefaultCopyStrings();
  for (const [path, value] of Object.entries(defaults)) {
    setCopyByPath(path, value);
  }
}
