"use client";

import {
  getNaturalSpeechPlaybackStatus,
  pauseNaturalSpeech,
  resumeNaturalSpeech,
  speakPassageUnitsNatural,
  stopNaturalSpeech,
  getSpeechEngineMode,
} from "@/lib/bible-speech-natural";

export type SpeechStatus = "idle" | "speaking" | "paused" | "unsupported";

function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function getSpeechStatus(): SpeechStatus {
  const natural = getNaturalSpeechPlaybackStatus();
  if (natural !== "idle") return natural;
  if (!isSpeechSupported()) return "unsupported";
  if (window.speechSynthesis.paused) return "paused";
  if (window.speechSynthesis.speaking) return "speaking";
  return "idle";
}

function isIndonesianVoice(voice: SpeechSynthesisVoice) {
  const lang = voice.lang.toLowerCase().replace("_", "-");
  const name = voice.name.toLowerCase();
  if (lang === "id" || lang.startsWith("id-")) return true;
  if (/bahasa indonesia|indonesia|indonesian/.test(name)) return true;
  return false;
}

/**
 * Pilih suara Indonesia terbaik yang tersedia di perangkat.
 * Prioritas: neural/natural id-ID, lalu lokal (Damayanti, dsb.), hindari suara Inggris.
 */
function pickIndonesianVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const ranked = voices
    .filter(isIndonesianVoice)
    .map((voice) => {
      const name = voice.name.toLowerCase();
      const lang = voice.lang.toLowerCase().replace("_", "-");
      let score = 0;

      if (lang === "id-id") score += 100;
      else if (lang.startsWith("id")) score += 80;

      // Suara neural/natural biasanya paling mirip orang Indonesia
      if (/natural|neural|online \(natural\)/.test(name)) score += 50;
      if (/microsoft.*(gadis|ardi)/.test(name)) score += 45;
      if (/google.*bahasa indonesia|google bahasa indonesia/.test(name)) {
        score += 40;
      }
      if (/damayanti|gadis|ardi/.test(name)) score += 30;
      if (voice.localService) score += 12;

      // Hindari suara yang terasa "bule"/Inggris meski ter-label Indonesia
      if (/english|en-us|en-gb|us english|uk english/.test(name)) score -= 80;

      return { voice, score };
    })
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.voice ?? null;
}

/**
 * Siapkan teks agar pelafalan lebih natural untuk konteks Kristen Indonesia.
 * - Tanda baca/petik dibuang atau diganti jeda (banyak suara ID membacanya literal).
 * - "Allah" diganti fonetik "Alah" supaya TTS tidak memakai logat Arab/Islam.
 */
export function prepareSpeechPronunciation(text: string) {
  return (
    text
      // Petik & guillemet TB (« » “ ” …) — sering dibaca "tanda petik"
      .replace(/[«»‹›""„‟〝〞〟「」『』]/g, "")
      .replace(/[''`´]/g, "")
      // Kurung sering dibaca "kurung buka/tutup"
      .replace(/[()[\]{}]/g, " ")
      // Titik dua / titik koma → jeda ringan (hindari "titik dua")
      .replace(/[:;]/g, ", ")
      // Strip & slash
      .replace(/[\\/|]/g, " ")
      // Dash & ellipsis → jeda
      .replace(/[—–−‐‑]/g, ", ")
      .replace(/\u2026|\.{2,}/g, ". ")
      // Simbol yang tidak perlu dilafalkan
      .replace(/[*#_~^=<>§†‡•●◦▪︎]/g, " ")
      // Angka ayat gaya "1-3" di tengah teks jarang; biarkan tanda tanya/seru/titik
      .replace(/\bAllah(mu|ku|nya|pun)?\b/g, (_match, suffix: string = "") => {
        return `Alah${suffix}`;
      })
      .replace(/\bALLAH(MU|KU|NYA|PUN)?\b/g, (_match, suffix: string = "") => {
        return `ALAH${suffix}`;
      })
      .replace(/\bElohim\b/gi, "Elohim")
      .replace(/\bYahweh\b/gi, "Yahwe")
      .replace(/\bYHWH\b/g, "Yahwe")
      // Rapikan sisa spasi & koma ganda
      .replace(/\s*,\s*,+/g, ", ")
      .replace(/\s*\.\s*\.+/g, ". ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

export type SpeechUnit = {
  id: string;
  text: string;
  /** Nomor ayat untuk auto-scroll / highlight; null = judul/subtitle. */
  verse: number | null;
};

export function buildPassageSpeechText(input: {
  title: string;
  subtitle?: string | null;
  verses: { verse: number; content: string }[];
}) {
  return buildPassageSpeechUnits(input)
    .map((unit) => unit.text)
    .join(". ");
}

/** Unit bacaan berurutan (judul → subtitle → tiap ayat) agar progress TTS bisa dilacak. */
export function buildPassageSpeechUnits(input: {
  title: string;
  subtitle?: string | null;
  verses: { verse: number; content: string }[];
}): SpeechUnit[] {
  const units: SpeechUnit[] = [];
  const title = input.title.trim();
  if (title) {
    units.push({
      id: "title",
      verse: null,
      text: prepareSpeechPronunciation(title),
    });
  }
  const subtitle = input.subtitle?.trim();
  if (subtitle) {
    units.push({
      id: "subtitle",
      verse: null,
      text: prepareSpeechPronunciation(subtitle),
    });
  }
  for (const verse of input.verses) {
    const content = verse.content.trim();
    if (!content) continue;
    units.push({
      id: `verse-${verse.verse}`,
      verse: verse.verse,
      text: prepareSpeechPronunciation(content),
    });
  }
  return units;
}

/**
 * Unit dari seleksi user: ayat yang bersinggungan dengan highlight.
 * Jika tidak ketemu node ayat, fallback ke teks seleksi polos.
 */
export function buildSpeechUnitsFromSelection(
  verses: { verse: number; content: string }[],
): SpeechUnit[] | null {
  if (typeof window === "undefined") return null;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return null;
  }

  const root =
    document.querySelector("[data-highlight-root]") ??
    document.querySelector("[data-speech-root]");
  const matched: SpeechUnit[] = [];
  const seen = new Set<number>();

  const nodes = (root ?? document).querySelectorAll<HTMLElement>(
    "[data-verse-node]",
  );
  for (const node of nodes) {
    if (!selection.containsNode(node, true)) continue;
    const verse = Number(node.getAttribute("data-verse"));
    if (!Number.isFinite(verse) || seen.has(verse)) continue;
    const content = verses.find((item) => item.verse === verse)?.content?.trim();
    if (!content) continue;
    seen.add(verse);
    matched.push({
      id: `verse-${verse}`,
      verse,
      text: prepareSpeechPronunciation(content),
    });
  }

  if (matched.length > 0) return matched;

  const plain = getSelectedSpeechText(root);
  if (!plain) return null;
  return [{ id: "selection", verse: null, text: plain }];
}

/**
 * Mulai baca dari ayat `fromVerse` sampai akhir pasal.
 * Judul/subjudul dilewati jika mulai di tengah pasal.
 */
export function sliceSpeechUnitsFromVerse(
  units: SpeechUnit[],
  fromVerse: number,
): SpeechUnit[] {
  if (!Number.isFinite(fromVerse) || fromVerse < 1) return units;
  const startIndex = units.findIndex((unit) => unit.verse === fromVerse);
  if (startIndex < 0) return units;
  return units.slice(startIndex);
}

const PLAY_FROM_VERSE_EVENT = "bible-speech-play-from-verse";

/** Minta TTS mulai dari nomor ayat tertentu (sampai akhir pasal). */
export function requestSpeechPlayFromVerse(verse: number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(PLAY_FROM_VERSE_EVENT, { detail: { verse } }),
  );
}

export function subscribeSpeechPlayFromVerse(
  listener: (verse: number) => void,
) {
  if (typeof window === "undefined") {
    return () => {};
  }
  const handler = (event: Event) => {
    const verse = (event as CustomEvent<{ verse?: number }>).detail?.verse;
    if (typeof verse === "number" && verse >= 1) {
      listener(verse);
    }
  };
  window.addEventListener(PLAY_FROM_VERSE_EVENT, handler);
  return () => window.removeEventListener(PLAY_FROM_VERSE_EVENT, handler);
}

/** Ambil teks yang sedang di-blok user (prioritas di dalam area ayat). */
export function getSelectedSpeechText(root?: ParentNode | null): string | null {
  if (typeof window === "undefined") return null;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const container =
    root ??
    document.querySelector("[data-highlight-root]") ??
    document.querySelector("[data-speech-root]");

  if (container) {
    const ancestor = range.commonAncestorContainer;
    const ancestorEl =
      ancestor.nodeType === Node.ELEMENT_NODE
        ? (ancestor as Element)
        : ancestor.parentElement;
    if (!ancestorEl || !container.contains(ancestorEl)) {
      return null;
    }
  }

  const text = selection
    .toString()
    .replace(/(?:^|\n)\s*\d{1,3}\s+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return null;
  return prepareSpeechPronunciation(text);
}

/** Potong teks panjang agar SpeechSynthesis lebih stabil. */
function chunkText(text: string, maxLen = 160): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [text];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const next = sentence.trim();
    if (!next) continue;
    if ((current + " " + next).trim().length <= maxLen) {
      current = (current + " " + next).trim();
    } else {
      if (current) chunks.push(current);
      if (next.length <= maxLen) {
        current = next;
      } else {
        for (let i = 0; i < next.length; i += maxLen) {
          chunks.push(next.slice(i, i + maxLen));
        }
        current = "";
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

type SpeakOptions = {
  text: string;
  rate?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onError?: (message: string) => void;
};

export type SpeakUnitsOptions = {
  units: SpeechUnit[];
  rate?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onUnitStart?: (unit: SpeechUnit, index: number) => void;
  onError?: (message: string) => void;
};

let activeToken = 0;

const SPEECH_ACTIVE_EVENT = "bible-speech-active-verse";

/** Broadcast ayat yang sedang dibacakan (untuk highlight + scroll). */
export function emitSpeechActiveVerse(verse: number | null) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(SPEECH_ACTIVE_EVENT, { detail: { verse } }),
  );
}

export function subscribeSpeechActiveVerse(
  listener: (verse: number | null) => void,
) {
  if (typeof window === "undefined") {
    return () => {};
  }
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<{ verse: number | null }>).detail;
    listener(detail?.verse ?? null);
  };
  window.addEventListener(SPEECH_ACTIVE_EVENT, handler);
  return () => window.removeEventListener(SPEECH_ACTIVE_EVENT, handler);
}

export function scrollSpeechVerseIntoView(verse: number) {
  if (typeof window === "undefined") return false;
  const target = document.querySelector<HTMLElement>(
    `[data-verse-node][data-verse="${verse}"]`,
  );
  if (!target) return false;
  target.scrollIntoView({ behavior: "smooth", block: "center" });
  return true;
}

/** Langkah kecepatan TTS (0.7× … 1.4×). Default 0.9 = nyaman untuk Alkitab. */
export const SPEECH_RATE_STEPS = [0.7, 0.8, 0.9, 1, 1.15, 1.3, 1.4] as const;
export type SpeechRateStep = (typeof SPEECH_RATE_STEPS)[number];

const SPEECH_RATE_KEY = "bacaalkitab-speech-rate";
const DEFAULT_SPEECH_RATE: SpeechRateStep = 0.9;

let preferredSpeechRate: SpeechRateStep = DEFAULT_SPEECH_RATE;
let speechRateHydrated = false;

function clampSpeechRate(value: number): SpeechRateStep {
  let best: SpeechRateStep = DEFAULT_SPEECH_RATE;
  let bestDist = Number.POSITIVE_INFINITY;
  for (const step of SPEECH_RATE_STEPS) {
    const dist = Math.abs(step - value);
    if (dist < bestDist) {
      best = step;
      bestDist = dist;
    }
  }
  return best;
}

function hydrateSpeechRate() {
  if (speechRateHydrated || typeof window === "undefined") return;
  speechRateHydrated = true;
  try {
    const raw = window.localStorage.getItem(SPEECH_RATE_KEY);
    if (raw) preferredSpeechRate = clampSpeechRate(Number(raw));
  } catch {
    /* ignore */
  }
}

export function getSpeechRate(): SpeechRateStep {
  hydrateSpeechRate();
  return preferredSpeechRate;
}

export function setSpeechRate(rate: number): SpeechRateStep {
  hydrateSpeechRate();
  preferredSpeechRate = clampSpeechRate(rate);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(SPEECH_RATE_KEY, String(preferredSpeechRate));
    } catch {
      /* ignore */
    }
  }
  return preferredSpeechRate;
}

export function stepSpeechRate(delta: -1 | 1): SpeechRateStep {
  const current = getSpeechRate();
  const index = SPEECH_RATE_STEPS.indexOf(current);
  const next = SPEECH_RATE_STEPS[
    Math.max(0, Math.min(SPEECH_RATE_STEPS.length - 1, index + delta))
  ]!;
  return setSpeechRate(next);
}

export function formatSpeechRate(rate: number = getSpeechRate()): string {
  const rounded = Math.round(rate * 100) / 100;
  return `${rounded}×`;
}

export function stopPassageSpeech() {
  activeToken += 1;
  emitSpeechActiveVerse(null);
  stopNaturalSpeech();
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
}

export function pausePassageSpeech() {
  pauseNaturalSpeech();
  if (!isSpeechSupported()) return;
  if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
    window.speechSynthesis.pause();
  }
}

export function resumePassageSpeech() {
  resumeNaturalSpeech();
  if (!isSpeechSupported()) return;
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
}

type InternalChunk = {
  text: string;
  unit: SpeechUnit;
  unitIndex: number;
  isFirstOfUnit: boolean;
};

function flattenUnitsToChunks(units: SpeechUnit[]): InternalChunk[] {
  const chunks: InternalChunk[] = [];
  units.forEach((unit, unitIndex) => {
    const parts = chunkText(unit.text);
    parts.forEach((text, partIndex) => {
      chunks.push({
        text,
        unit,
        unitIndex,
        isFirstOfUnit: partIndex === 0,
      });
    });
  });
  return chunks;
}

function speakChunkQueue(
  chunks: InternalChunk[],
  voice: SpeechSynthesisVoice | null,
  options: {
    rate?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onChunkStart?: (chunk: InternalChunk, index: number) => void;
    onError?: (message: string) => void;
  },
  token: number,
) {
  let index = 0;

  const speakNext = () => {
    if (token !== activeToken) return;
    if (index >= chunks.length) {
      options.onEnd?.();
      return;
    }

    const chunk = chunks[index]!;
    const utterance = new SpeechSynthesisUtterance(chunk.text);
    utterance.lang = voice?.lang?.startsWith("id") ? voice.lang : "id-ID";
    utterance.rate = options.rate ?? getSpeechRate();
    utterance.pitch = 1.05;
    utterance.volume = 1;
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      if (token !== activeToken) return;
      options.onChunkStart?.(chunk, index);
      if (index === 0) options.onStart?.();
    };
    utterance.onend = () => {
      index += 1;
      speakNext();
    };
    utterance.onerror = () => {
      if (token !== activeToken) return;
      if (index >= chunks.length - 1) {
        options.onEnd?.();
      } else {
        options.onError?.("Pembacaan terhenti.");
        options.onEnd?.();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  speakNext();
}

function beginSpeechSession(start: (token: number) => void) {
  if (!isSpeechSupported()) {
    return null;
  }
  const token = ++activeToken;
  window.speechSynthesis.cancel();

  const run = () => {
    if (token !== activeToken) return;
    start(token);
  };

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      run();
    };
    window.setTimeout(run, 280);
  } else {
    run();
  }
  return token;
}

export function speakPassageUnits(options: SpeakUnitsOptions) {
  const units = options.units.filter((unit) => unit.text.trim());
  if (units.length === 0) {
    options.onError?.("Tidak ada teks untuk dibacakan.");
    return;
  }

  // Hentikan engine lain dulu
  stopPassageSpeech();

  if (getSpeechEngineMode() === "natural") {
    void speakPassageUnitsNatural({
      ...options,
      units,
      onError: () => {
        // Jaringan / Edge TTS gagal → jatuh ke suara perangkat
        speakPassageUnitsDevice({
          ...options,
          units,
        });
      },
    });
    return;
  }

  speakPassageUnitsDevice(options);
}

function speakPassageUnitsDevice(options: SpeakUnitsOptions) {
  if (!isSpeechSupported()) {
    options.onError?.("Perangkat ini tidak mendukung text-to-speech.");
    return;
  }

  const units = options.units.filter((unit) => unit.text.trim());
  if (units.length === 0) {
    options.onError?.("Tidak ada teks untuk dibacakan.");
    return;
  }

  const chunks = flattenUnitsToChunks(units);
  beginSpeechSession((token) => {
    const voice = pickIndonesianVoice();
    speakChunkQueue(
      chunks,
      voice,
      {
        rate: options.rate,
        onStart: options.onStart,
        onEnd: () => {
          emitSpeechActiveVerse(null);
          options.onEnd?.();
        },
        onChunkStart: (chunk) => {
          if (chunk.isFirstOfUnit) {
            options.onUnitStart?.(chunk.unit, chunk.unitIndex);
          }
          emitSpeechActiveVerse(chunk.unit.verse);
        },
        onError: options.onError,
      },
      token,
    );
  });
}

export function speakPassageText(options: SpeakOptions) {
  if (!isSpeechSupported()) {
    options.onError?.("Perangkat ini tidak mendukung text-to-speech.");
    return;
  }

  const prepared = prepareSpeechPronunciation(options.text);
  const textChunks = chunkText(prepared);
  if (textChunks.length === 0) {
    options.onError?.("Tidak ada teks untuk dibacakan.");
    return;
  }

  const fallbackUnit: SpeechUnit = {
    id: "text",
    verse: null,
    text: prepared,
  };
  const chunks = textChunks.map((text, index) => ({
    text,
    unit: fallbackUnit,
    unitIndex: 0,
    isFirstOfUnit: index === 0,
  }));

  beginSpeechSession((token) => {
    const voice = pickIndonesianVoice();
    speakChunkQueue(
      chunks,
      voice,
      {
        rate: options.rate,
        onStart: options.onStart,
        onEnd: () => {
          emitSpeechActiveVerse(null);
          options.onEnd?.();
        },
        onError: options.onError,
      },
      token,
    );
  });
}
