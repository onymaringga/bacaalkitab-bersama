/** Tracker durasi baca pasal — stop saat refleksi disimpan. */

import { normalizePassageKey } from "@/lib/passage-parser";

const ACTIVE_KEY = "bacaalkitab-reading-session-active";
const COMPLETED_KEY = "bacaalkitab-reading-sessions";
const EVENT = "bible-reading-sessions-updated";

export type ActiveReadingSession = {
  passageKey: string;
  passageLabel: string;
  /** Total ms yang sudah dihitung (segmen sebelumnya). */
  accumulatedMs: number;
  /** Epoch mulai segmen aktif; null = sedang pause. */
  segmentStartedAt: number | null;
  /** Epoch pertama kali sesi dimulai. */
  startedAt: number;
};

export type CompletedReadingSession = {
  passageKey: string;
  passageLabel: string;
  durationMs: number;
  startedAt: number;
  stoppedAt: number;
};

type CompletedMap = Record<string, CompletedReadingSession>;

const EMPTY_COMPLETED: CompletedMap = {};

let completedCacheRaw: string | null = null;
let completedCache: CompletedMap = EMPTY_COMPLETED;
let hasCompletedCache = false;

function makeKey(passage: string) {
  return normalizePassageKey(passage);
}

function readActive(): ActiveReadingSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ACTIVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ActiveReadingSession;
    if (!parsed?.passageKey) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeActive(session: ActiveReadingSession | null) {
  if (typeof window === "undefined") return;
  if (!session) {
    window.localStorage.removeItem(ACTIVE_KEY);
  } else {
    window.localStorage.setItem(ACTIVE_KEY, JSON.stringify(session));
  }
  window.dispatchEvent(new Event(EVENT));
}

function readCompletedMap(): CompletedMap {
  if (typeof window === "undefined") return EMPTY_COMPLETED;
  const raw = window.localStorage.getItem(COMPLETED_KEY);
  if (hasCompletedCache && raw === completedCacheRaw) return completedCache;
  completedCacheRaw = raw;
  hasCompletedCache = true;
  if (!raw) {
    completedCache = EMPTY_COMPLETED;
    return completedCache;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    completedCache =
      parsed && typeof parsed === "object"
        ? (parsed as CompletedMap)
        : EMPTY_COMPLETED;
  } catch {
    completedCache = EMPTY_COMPLETED;
  }
  return completedCache;
}

function writeCompletedMap(map: CompletedMap) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(map);
  window.localStorage.setItem(COMPLETED_KEY, raw);
  completedCacheRaw = raw;
  completedCache = map;
  hasCompletedCache = true;
  window.dispatchEvent(new Event(EVENT));
}

function flushSegment(session: ActiveReadingSession, now = Date.now()) {
  if (session.segmentStartedAt == null) return session;
  const delta = Math.max(0, now - session.segmentStartedAt);
  return {
    ...session,
    accumulatedMs: session.accumulatedMs + delta,
    segmentStartedAt: null as number | null,
  };
}

export function getCompletedReadingSession(passage: string) {
  return readCompletedMap()[makeKey(passage)] ?? null;
}

export function getActiveReadingSession(passage?: string) {
  const active = readActive();
  if (!active) return null;
  if (passage && active.passageKey !== makeKey(passage)) return null;
  return active;
}

/** Elapsed aktif (termasuk segmen yang sedang berjalan). */
export function getActiveElapsedMs(passage: string, now = Date.now()) {
  const key = makeKey(passage);
  const completed = getCompletedReadingSession(key);
  if (completed) return completed.durationMs;

  const active = readActive();
  if (!active || active.passageKey !== key) return 0;
  if (active.segmentStartedAt == null) return active.accumulatedMs;
  return active.accumulatedMs + Math.max(0, now - active.segmentStartedAt);
}

/**
 * Mulai / lanjutkan tracker untuk pasal ini.
 * Jika sudah ada sesi selesai (refleksi sudah submit), tidak mulai ulang.
 */
export function startReadingSession(passage: string, passageLabel?: string) {
  if (typeof window === "undefined") return null;
  const key = makeKey(passage);
  if (!key) return null;
  if (getCompletedReadingSession(key)) return null;

  const now = Date.now();
  const label = (passageLabel ?? passage).trim() || passage;
  const current = readActive();

  // Sesi yang sama — resume jika pause
  if (current?.passageKey === key) {
    if (current.segmentStartedAt == null) {
      const resumed = {
        ...current,
        passageLabel: label,
        segmentStartedAt: now,
      };
      writeActive(resumed);
      return resumed;
    }
    if (current.passageLabel !== label) {
      writeActive({ ...current, passageLabel: label });
    }
    return current;
  }

  // Pause sesi pasal lain (simpan accumulated), tapi biarkan tersimpan
  // hanya satu active — flush dulu lalu ganti.
  // Untuk multi-pasal: kita simpan accumulated pasal lain ke completed? Tidak —
  // hanya satu active. Saat ganti pasal, flush & simpan sebagai "parked" di active
  // dengan pause... tapi kita overwrite. Simpan parked di map terpisah?

  // Park accumulated for other passages in a side map inside completed? Overkill.
  // Simpan parked sessions in ACTIVE as we only track one at a time;
  // when switching, stash previous into localStorage parked map.

  parkActiveIfNeeded(current, now);

  const parked = takeParked(key);
  const next: ActiveReadingSession = {
    passageKey: key,
    passageLabel: label,
    accumulatedMs: parked?.accumulatedMs ?? 0,
    segmentStartedAt: now,
    startedAt: parked?.startedAt ?? now,
  };
  writeActive(next);
  return next;
}

const PARKED_KEY = "bacaalkitab-reading-session-parked";

function readParkedMap(): Record<string, ActiveReadingSession> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PARKED_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, ActiveReadingSession>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeParkedMap(map: Record<string, ActiveReadingSession>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PARKED_KEY, JSON.stringify(map));
}

function parkActiveIfNeeded(
  current: ActiveReadingSession | null,
  now: number,
) {
  if (!current) return;
  if (getCompletedReadingSession(current.passageKey)) {
    writeActive(null);
    return;
  }
  const flushed = flushSegment(current, now);
  const map = readParkedMap();
  map[flushed.passageKey] = flushed;
  writeParkedMap(map);
}

function takeParked(key: string) {
  const map = readParkedMap();
  const parked = map[key];
  if (!parked) return null;
  delete map[key];
  writeParkedMap(map);
  return parked;
}

export function pauseReadingSession(passage?: string) {
  const active = readActive();
  if (!active) return;
  if (passage && active.passageKey !== makeKey(passage)) return;
  if (active.segmentStartedAt == null) return;
  writeActive(flushSegment(active));
}

export function resumeReadingSession(passage?: string) {
  const active = readActive();
  if (!active) return;
  if (passage && active.passageKey !== makeKey(passage)) return;
  if (getCompletedReadingSession(active.passageKey)) return;
  if (active.segmentStartedAt != null) return;
  writeActive({ ...active, segmentStartedAt: Date.now() });
}

/** Nolkan durasi baca pasal ini dan mulai hitung ulang dari awal. */
export function resetReadingSession(passage: string, passageLabel?: string) {
  if (typeof window === "undefined") return null;
  const key = makeKey(passage);
  if (!key || getCompletedReadingSession(key)) return null;

  const parkedMap = readParkedMap();
  if (parkedMap[key]) {
    delete parkedMap[key];
    writeParkedMap(parkedMap);
  }

  const current = readActive();
  if (current?.passageKey === key) {
    writeActive(null);
  } else if (current) {
    parkActiveIfNeeded(current, Date.now());
  }

  const now = Date.now();
  const label = (passageLabel ?? passage).trim() || passage;
  const next: ActiveReadingSession = {
    passageKey: key,
    passageLabel: label,
    accumulatedMs: 0,
    segmentStartedAt: now,
    startedAt: now,
  };
  writeActive(next);
  return next;
}

/**
 * Stop tracker saat refleksi disimpan.
 * Mengembalikan sesi selesai (atau yang sudah ada).
 */
export function completeReadingSessionOnReflection(passage: string) {
  if (typeof window === "undefined") return null;
  const key = makeKey(passage);
  const existing = getCompletedReadingSession(key);
  if (existing) return existing;

  const now = Date.now();
  let active = readActive();

  // Ambil dari parked jika active bukan pasal ini
  if (!active || active.passageKey !== key) {
    const parked = takeParked(key);
    if (!parked) return null;
    active = parked;
  }

  active = flushSegment(active, now);
  const completed: CompletedReadingSession = {
    passageKey: key,
    passageLabel: active.passageLabel,
    durationMs: Math.max(0, active.accumulatedMs),
    startedAt: active.startedAt,
    stoppedAt: now,
  };

  writeCompletedMap({ ...readCompletedMap(), [key]: completed });

  if (readActive()?.passageKey === key) {
    writeActive(null);
  }

  // Bersihkan parked untuk key ini
  const parkedMap = readParkedMap();
  if (parkedMap[key]) {
    delete parkedMap[key];
    writeParkedMap(parkedMap);
  }

  return completed;
}

export function subscribeReadingSessions(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const wrapped = () => {
    hasCompletedCache = false;
    onChange();
  };
  window.addEventListener(EVENT, wrapped);
  window.addEventListener("storage", wrapped);
  return () => {
    window.removeEventListener(EVENT, wrapped);
    window.removeEventListener("storage", wrapped);
  };
}

/**
 * Snapshot stabil untuk useSyncExternalStore.
 * Jangan sertakan elapsed live (Date.now) — itu membuat getSnapshot
 * berubah tiap baca dan memicu infinite loop React.
 */
export function getReadingSessionSnapshot(passage: string) {
  const key = makeKey(passage);
  const completed = getCompletedReadingSession(key);
  if (completed) {
    return `done:${completed.durationMs}:${completed.stoppedAt}`;
  }
  const active = getActiveReadingSession(key);
  if (!active) return "idle";
  const running = active.segmentStartedAt != null ? 1 : 0;
  return `active:${active.accumulatedMs}:${active.segmentStartedAt ?? 0}:${running}`;
}

export function formatReadingDuration(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  if (hours > 0) {
    return `${hours} jam ${minutes} mnt`;
  }
  if (minutes > 0) {
    return seconds > 0 ? `${minutes} mnt ${seconds} dtk` : `${minutes} mnt`;
  }
  return `${Math.max(seconds, 0)} dtk`;
}

/** Format ringkas untuk chip live: 3:24 atau 1:02:15 */
export function formatReadingDurationClock(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const ss = String(seconds).padStart(2, "0");
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${ss}`;
  }
  return `${minutes}:${ss}`;
}
