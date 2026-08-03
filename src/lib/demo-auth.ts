import type { UserRole } from "@/lib/types";

export type DemoSession = {
  username: string;
  name: string;
  email: string;
  role: UserRole;
};

const SESSION_KEY = "bab-demo-session";

type DemoAccount = DemoSession & { password: string };

/** Demo credentials — works without database. */
export const DEMO_ADMIN = {
  username: "admin",
  password: "admin",
  name: "Admin",
  email: "admin@bacaalkitab.local",
  role: "admin" as const,
};

export const DEMO_MEMBER = {
  username: "onynaraulita",
  password: "onynaraulita",
  name: "Ony Naraulita Maringga",
  email: "onynaraulita@gmail.com",
  role: "member" as const,
};

const DEMO_ACCOUNTS: DemoAccount[] = [DEMO_ADMIN, DEMO_MEMBER];

const PASSWORD_OVERRIDE_KEY = "bab-demo-password-overrides";

function readPasswordOverrides(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PASSWORD_OVERRIDE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

function writePasswordOverrides(next: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PASSWORD_OVERRIDE_KEY, JSON.stringify(next));
}

export function findDemoAccountByLogin(login: string): DemoAccount | null {
  const user = login.trim().toLowerCase();
  return (
    DEMO_ACCOUNTS.find(
      (item) =>
        item.username === user || item.email.toLowerCase() === user,
    ) ?? null
  );
}

export function validateDemoLogin(
  username: string,
  password: string,
): DemoSession | null {
  const account = findDemoAccountByLogin(username);
  if (!account) return null;

  const overrides = readPasswordOverrides();
  const expected = overrides[account.username] ?? account.password;
  if (password !== expected) return null;

  return {
    username: account.username,
    name: account.name,
    email: account.email,
    role: account.role,
  };
}

/** Demo: simpan password baru setelah lupa password. */
export function resetDemoPassword(login: string, newPassword: string) {
  const account = findDemoAccountByLogin(login);
  if (!account) return false;
  if (newPassword.trim().length < 6) return false;
  const overrides = readPasswordOverrides();
  overrides[account.username] = newPassword.trim();
  writePasswordOverrides(overrides);
  return true;
}

let cachedRaw: string | null = null;
let cachedSession: DemoSession | null = null;
let hasCache = false;

function parseSession(raw: string | null): DemoSession | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DemoSession;
  } catch {
    return null;
  }
}

export function writeDemoSession(session: DemoSession) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(session);
  window.localStorage.setItem(SESSION_KEY, raw);
  cachedRaw = raw;
  cachedSession = session;
  hasCache = true;
  window.dispatchEvent(new Event("demo-session-updated"));
}

/** Cached for useSyncExternalStore — must return same reference if data unchanged. */
export function readDemoSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (hasCache && raw === cachedRaw) {
    return cachedSession;
  }
  cachedRaw = raw;
  cachedSession = parseSession(raw);
  hasCache = true;
  return cachedSession;
}

export function clearDemoSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
  cachedRaw = null;
  cachedSession = null;
  hasCache = true;
  window.dispatchEvent(new Event("demo-session-updated"));
}

export function getPostLoginPath(role: UserRole) {
  return role === "admin" ? "/admin" : "/dashboard";
}
