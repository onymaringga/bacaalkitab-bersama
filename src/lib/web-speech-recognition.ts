/** Web Speech API — transkrip langsung di browser (Indonesia / Inggris). */

export type LiveSpeechLanguage = "id-ID" | "en-US";

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionResultEvent = {
  resultIndex: number;
  results: SpeechRecognitionResultList;
};

type SpeechRecognitionResultList = {
  length: number;
  [index: number]: SpeechRecognitionResult;
};

type SpeechRecognitionResult = {
  isFinal: boolean;
  [index: number]: { transcript: string };
};

type SpeechRecognitionErrorEvent = {
  error: string;
  message?: string;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export function isWebSpeechSupported() {
  if (typeof window === "undefined") return false;
  return Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition);
}

export function createSpeechRecognition(lang: LiveSpeechLanguage) {
  const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
  if (!Ctor) return null;

  const recognition = new Ctor();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = lang;
  return recognition;
}

export function speechErrorMessage(code: string) {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Akses mikrofon ditolak. Izinkan mikrofon di pengaturan browser.";
    case "no-speech":
      return "Tidak terdengar suara. Dekatkan perangkat ke sumber audio.";
    case "audio-capture":
      return "Mikrofon tidak terdeteksi. Cek perangkat audio kamu.";
    case "network":
      return "Koneksi internet diperlukan untuk mode transkrip cepat.";
    case "aborted":
      return "Transkrip dihentikan.";
    default:
      return `Transkrip gagal (${code}). Coba refresh halaman.`;
  }
}
