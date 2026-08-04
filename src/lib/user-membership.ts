/** Preferensi individu vs kelompok — disimpan lokal per akun (demo). */

import { demoUserGroupIds } from "@/lib/group-members";

export type UserMembershipType = "individual" | "group";

export type UserMembershipPrefs = {
  type: UserMembershipType;
  groupId?: string;
  inviteCode?: string;
};

const STORAGE_KEY = "bab-user-membership";
const EVENT = "user-membership-updated";

/** Kode undangan demo → id kelompok. */
export const GROUP_INVITE_CODES: Record<string, string> = {
  TG16: "group-1",
  "TG-16": "group-1",
  GROUP02: "group-2",
  YOUTH: "group-3",
  SION: "group-4",
};

let cachedRaw: string | null = null;
let cachedPrefs: UserMembershipPrefs | null = null;
let hasCache = false;

function membershipKey(email?: string) {
  return (email ?? "default").trim().toLowerCase();
}

export function resolveGroupIdFromInvite(code: string): string | null {
  const normalized = code.trim().toUpperCase().replace(/\s+/g, "");
  if (!normalized) return null;
  return GROUP_INVITE_CODES[normalized] ?? null;
}

export function writeUserMembership(
  prefs: UserMembershipPrefs,
  email?: string,
) {
  if (typeof window === "undefined") return;
  const key = membershipKey(email);
  const store = readMembershipStore();
  store[key] = prefs;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  cachedRaw = null;
  hasCache = false;
  window.dispatchEvent(new Event(EVENT));
}

function readMembershipStore(): Record<string, UserMembershipPrefs> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, UserMembershipPrefs>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function readUserMembership(email?: string): UserMembershipPrefs | null {
  if (typeof window === "undefined") return null;
  const key = membershipKey(email);
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (hasCache && raw === cachedRaw) {
    return cachedPrefs;
  }
  cachedRaw = raw;
  hasCache = true;
  if (!raw) {
    cachedPrefs = null;
    return null;
  }
  try {
    const store = JSON.parse(raw) as Record<string, UserMembershipPrefs>;
    cachedPrefs = store[key] ?? null;
    return cachedPrefs;
  } catch {
    cachedPrefs = null;
    return null;
  }
}

/** Id kelompok user saat ini (kosong jika individu). */
export function getUserGroupIds(email?: string): string[] {
  const prefs = readUserMembership(email);
  if (!prefs) return demoUserGroupIds;
  if (prefs.type === "individual") return [];
  return prefs.groupId ? [prefs.groupId] : [];
}

export function getServerUserGroupIds(): string[] {
  return demoUserGroupIds;
}

export function subscribeUserMembership(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const wrapped = () => {
    cachedRaw = null;
    hasCache = false;
    onChange();
  };
  window.addEventListener(EVENT, wrapped);
  window.addEventListener("storage", wrapped);
  window.addEventListener("demo-session-updated", wrapped);
  return () => {
    window.removeEventListener(EVENT, wrapped);
    window.removeEventListener("storage", wrapped);
    window.removeEventListener("demo-session-updated", wrapped);
  };
}
