/**
 * Lagu worship lembut (utamanya instrumental) untuk latar baca Alkitab.
 * Video publik YouTube — butuh koneksi; embed resmi YouTube.
 */

export type WorshipTrackMood = "instrumental" | "soft";

export type WorshipTrack = {
  id: string;
  videoId: string;
  title: string;
  artist: string;
  mood: WorshipTrackMood;
  /** Perkiraan durasi untuk label UI */
  durationLabel: string;
};

export const WORSHIP_TRACKS: WorshipTrack[] = [
  {
    id: "bethel-piano-2h",
    videoId: "G5WEnVeKFX8",
    title: "Bethel — Piano Worship",
    artist: "Dan Musselman",
    mood: "instrumental",
    durationLabel: "2 jam",
  },
  {
    id: "presence-piano-2h",
    videoId: "vaLiRtvAcgs",
    title: "In His Presence — Piano",
    artist: "Hillsong · Bethel · Elevation",
    mood: "instrumental",
    durationLabel: "2 jam",
  },
  {
    id: "oceans-piano-1h",
    videoId: "kEYBdY7_xSE",
    title: "Oceans — Piano Instrumental",
    artist: "Hillsong UNITED · REMEMBRANCE",
    mood: "instrumental",
    durationLabel: "1 jam",
  },
  {
    id: "peace-8h",
    videoId: "Hd9HjcHQZmQ",
    title: "PEACE — Worship Instrumental",
    artist: "Hillsong · Tomlin · Bethel",
    mood: "instrumental",
    durationLabel: "8 jam",
  },
  {
    id: "bethel-ambient",
    videoId: "uIDT14tRUF4",
    title: "Soaking — Prayer & Rest",
    artist: "Bethel-inspired instrumental",
    mood: "soft",
    durationLabel: "33 mnt",
  },
];

const STORAGE_TRACK = "bacaalkitab-worship-track";
const STORAGE_OPEN = "bacaalkitab-worship-open";
const STORAGE_DOCK_POS = "bacaalkitab-worship-dock-pos";

export type WorshipDockPosition = {
  x: number;
  y: number;
};

export function getWorshipTrack(id: string): WorshipTrack | null {
  return WORSHIP_TRACKS.find((track) => track.id === id) ?? null;
}

export function getDefaultWorshipTrack() {
  return WORSHIP_TRACKS[0]!;
}

export function readSavedWorshipTrackId(): string {
  if (typeof window === "undefined") return getDefaultWorshipTrack().id;
  try {
    const saved = window.localStorage.getItem(STORAGE_TRACK);
    if (saved && getWorshipTrack(saved)) return saved;
  } catch {
    /* ignore */
  }
  return getDefaultWorshipTrack().id;
}

export function saveWorshipTrackId(id: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_TRACK, id);
  } catch {
    /* ignore */
  }
}

export function readWorshipPanelPreferOpen(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_OPEN) === "1";
  } catch {
    return false;
  }
}

export function saveWorshipPanelPreferOpen(open: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_OPEN, open ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function readWorshipDockPosition(): WorshipDockPosition | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_DOCK_POS);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<WorshipDockPosition>;
    if (
      typeof parsed.x === "number" &&
      typeof parsed.y === "number" &&
      Number.isFinite(parsed.x) &&
      Number.isFinite(parsed.y)
    ) {
      return { x: parsed.x, y: parsed.y };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function saveWorshipDockPosition(pos: WorshipDockPosition) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_DOCK_POS, JSON.stringify(pos));
  } catch {
    /* ignore */
  }
}

/** Posisi default: pojok kanan bawah, di atas nav mobile. */
export function defaultWorshipDockPosition(
  size: { width: number; height: number },
): WorshipDockPosition {
  if (typeof window === "undefined") {
    return { x: 16, y: 120 };
  }
  const margin = 16;
  const bottomNav = window.matchMedia("(min-width: 1024px)").matches
    ? 24
    : 76;
  return {
    x: Math.max(margin, window.innerWidth - size.width - margin),
    y: Math.max(
      margin,
      window.innerHeight - size.height - bottomNav - margin,
    ),
  };
}

export function clampWorshipDockPosition(
  pos: WorshipDockPosition,
  size: { width: number; height: number },
): WorshipDockPosition {
  if (typeof window === "undefined") return pos;
  const margin = 8;
  const maxX = Math.max(margin, window.innerWidth - size.width - margin);
  const maxY = Math.max(margin, window.innerHeight - size.height - margin);
  return {
    x: Math.min(Math.max(margin, pos.x), maxX),
    y: Math.min(Math.max(margin, pos.y), maxY),
  };
}

export function youtubeEmbedSrc(videoId: string, autoplay: boolean) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    enablejsapi: "1",
    origin:
      typeof window !== "undefined" ? window.location.origin : "https://localhost",
  });
  if (autoplay) params.set("autoplay", "1");
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function youtubeWatchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
