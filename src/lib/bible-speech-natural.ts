"use client";

import type { NaturalTtsVoiceId } from "@/lib/natural-tts-voices";

const ENGINE_KEY = "bacaalkitab-speech-engine";
const VOICE_KEY = "bacaalkitab-speech-natural-voice";
const SPEECH_ACTIVE_EVENT = "bible-speech-active-verse";

export type SpeechEngineMode = "natural" | "device";

type SpeechUnit = {
  id: string;
  text: string;
  verse: number | null;
};

type SpeakUnitsOptions = {
  units: SpeechUnit[];
  rate?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onUnitStart?: (unit: SpeechUnit, index: number) => void;
  onError?: (message: string) => void;
};

let preferredEngine: SpeechEngineMode = "natural";
let preferredVoice: NaturalTtsVoiceId = "id-ID-GadisNeural";
let engineHydrated = false;

let naturalToken = 0;
let naturalAudio: HTMLAudioElement | null = null;
let naturalObjectUrl: string | null = null;

function emitSpeechActiveVerse(verse: number | null) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(SPEECH_ACTIVE_EVENT, { detail: { verse } }),
  );
}

function hydrateEnginePrefs() {
  if (engineHydrated || typeof window === "undefined") return;
  engineHydrated = true;
  try {
    const engine = window.localStorage.getItem(ENGINE_KEY);
    if (engine === "natural" || engine === "device") preferredEngine = engine;
    const voice = window.localStorage.getItem(VOICE_KEY);
    if (voice === "id-ID-GadisNeural" || voice === "id-ID-ArdiNeural") {
      preferredVoice = voice;
    }
  } catch {
    /* ignore */
  }
}

export function getSpeechEngineMode(): SpeechEngineMode {
  hydrateEnginePrefs();
  return preferredEngine;
}

export function setSpeechEngineMode(mode: SpeechEngineMode) {
  hydrateEnginePrefs();
  preferredEngine = mode;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(ENGINE_KEY, mode);
    } catch {
      /* ignore */
    }
  }
  return preferredEngine;
}

export function getNaturalSpeechVoice(): NaturalTtsVoiceId {
  hydrateEnginePrefs();
  return preferredVoice;
}

export function setNaturalSpeechVoice(voice: NaturalTtsVoiceId) {
  hydrateEnginePrefs();
  preferredVoice = voice;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(VOICE_KEY, voice);
    } catch {
      /* ignore */
    }
  }
  return preferredVoice;
}

function revokeNaturalUrl() {
  if (naturalObjectUrl) {
    URL.revokeObjectURL(naturalObjectUrl);
    naturalObjectUrl = null;
  }
}

export function stopNaturalSpeech() {
  naturalToken += 1;
  if (naturalAudio) {
    naturalAudio.onended = null;
    naturalAudio.onerror = null;
    naturalAudio.pause();
    naturalAudio.src = "";
    naturalAudio = null;
  }
  revokeNaturalUrl();
  emitSpeechActiveVerse(null);
}

export function pauseNaturalSpeech() {
  naturalAudio?.pause();
}

export function resumeNaturalSpeech() {
  void naturalAudio?.play().catch(() => {
    /* ignore autoplay race */
  });
}

export function isNaturalSpeechActive() {
  return Boolean(naturalAudio);
}

export function getNaturalSpeechPlaybackStatus():
  | "idle"
  | "speaking"
  | "paused" {
  if (!naturalAudio) return "idle";
  if (naturalAudio.paused) return "paused";
  return "speaking";
}

async function fetchNaturalAudio(text: string, rate: number) {
  const response = await fetch("/api/bible/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      voice: getNaturalSpeechVoice(),
      rate,
    }),
  });

  if (!response.ok) {
    let message = "Gagal memuat suara natural";
    try {
      const payload = (await response.json()) as { error?: string };
      if (payload.error) message = payload.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

function playObjectUrl(
  url: string,
  rate: number,
  token: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (token !== naturalToken) {
      URL.revokeObjectURL(url);
      resolve();
      return;
    }

    revokeNaturalUrl();
    naturalObjectUrl = url;

    const audio = new Audio(url);
    audio.playbackRate = Math.min(1.5, Math.max(0.6, rate));
    naturalAudio = audio;

    audio.onended = () => {
      if (token !== naturalToken) return;
      resolve();
    };
    audio.onerror = () => {
      if (token !== naturalToken) return;
      reject(new Error("Pemutaran audio gagal"));
    };

    void audio.play().catch((error: unknown) => {
      if (token !== naturalToken) return;
      reject(
        error instanceof Error
          ? error
          : new Error("Tidak bisa memutar audio"),
      );
    });
  });
}

/** Baca pasal dengan suara neural (Edge Gadis/Ardi) lewat API. */
export async function speakPassageUnitsNatural(
  options: SpeakUnitsOptions,
): Promise<void> {
  if (typeof window === "undefined") return;

  const units = options.units.filter((unit) => unit.text.trim());
  if (units.length === 0) {
    options.onError?.("Tidak ada teks untuk dibacakan.");
    return;
  }

  stopNaturalSpeech();
  const token = ++naturalToken;
  const rate = options.rate ?? 0.95;

  options.onStart?.();

  /** Prefetch per unit — unduh ayat berikutnya sambil yang sekarang diputar. */
  const prefetch = new Map<number, Promise<string>>();
  const orphanUrls: string[] = [];

  const ensurePrefetch = (index: number) => {
    if (index < 0 || index >= units.length) return;
    if (prefetch.has(index)) return;
    const text = units[index]!.text;
    prefetch.set(
      index,
      fetchNaturalAudio(text, rate).then((url) => {
        if (token !== naturalToken) {
          URL.revokeObjectURL(url);
          throw new Error("cancelled");
        }
        orphanUrls.push(url);
        return url;
      }),
    );
  };

  const takeUrl = async (index: number) => {
    ensurePrefetch(index);
    const url = await prefetch.get(index)!;
    const pos = orphanUrls.indexOf(url);
    if (pos >= 0) orphanUrls.splice(pos, 1);
    return url;
  };

  const cleanupOrphans = () => {
    for (const url of orphanUrls) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        /* ignore */
      }
    }
    orphanUrls.length = 0;
    prefetch.clear();
  };

  try {
    // Hangatkan 2 ayat pertama supaya jeda antar-ayat hampir hilang.
    ensurePrefetch(0);
    ensurePrefetch(1);

    for (let index = 0; index < units.length; index += 1) {
      if (token !== naturalToken) {
        cleanupOrphans();
        return;
      }

      const unit = units[index]!;
      options.onUnitStart?.(unit, index);
      emitSpeechActiveVerse(unit.verse);

      // Prefetch 1–2 ayat ke depan selagi menunggu / memutar
      ensurePrefetch(index + 1);
      ensurePrefetch(index + 2);

      let url: string;
      try {
        url = await takeUrl(index);
      } catch {
        if (token !== naturalToken) {
          cleanupOrphans();
          return;
        }
        throw new Error("Gagal memuat audio");
      }

      if (token !== naturalToken) {
        URL.revokeObjectURL(url);
        cleanupOrphans();
        return;
      }

      await playObjectUrl(url, rate, token);
    }

    if (token === naturalToken) {
      emitSpeechActiveVerse(null);
      naturalAudio = null;
      revokeNaturalUrl();
      cleanupOrphans();
      options.onEnd?.();
    }
  } catch (error) {
    if (token !== naturalToken) {
      cleanupOrphans();
      return;
    }
    emitSpeechActiveVerse(null);
    naturalAudio = null;
    revokeNaturalUrl();
    cleanupOrphans();
    options.onError?.(
      error instanceof Error ? error.message : "Gagal memutar suara natural",
    );
    // Jangan panggil onEnd di sini bila caller ingin fallback — caller yang atur.
  }
}
