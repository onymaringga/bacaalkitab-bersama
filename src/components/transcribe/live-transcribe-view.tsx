"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  Copy,
  Languages,
  Mic,
  MicOff,
  RotateCcw,
  Sparkles,
  Upload,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { copy } from "@/lib/copy";
import {
  createSpeechRecognition,
  isWebSpeechSupported,
  speechErrorMessage,
  type LiveSpeechLanguage,
} from "@/lib/web-speech-recognition";
import { cn } from "@/lib/utils";

type TranscribeMode = "fast-id" | "fast-en" | "regional";

type TranscriptLine = {
  id: string;
  text: string;
  translation?: string;
  interim?: boolean;
  at: string;
};

const MODE_OPTIONS: Array<{
  id: TranscribeMode;
  label: string;
  hint: string;
}> = [
  {
    id: "fast-id",
    label: copy.transcribe.modeFastId,
    hint: copy.transcribe.modeFastIdHint,
  },
  {
    id: "fast-en",
    label: copy.transcribe.modeFastEn,
    hint: copy.transcribe.modeFastEnHint,
  },
  {
    id: "regional",
    label: copy.transcribe.modeRegional,
    hint: copy.transcribe.modeRegionalHint,
  },
];

function nowLabel() {
  return new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function nextId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function LiveTranscribeView() {
  const [mode, setMode] = useState<TranscribeMode>("regional");
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [whisperReady, setWhisperReady] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  const recognitionRef = useRef<ReturnType<typeof createSpeechRecognition>>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const shouldListenRef = useRef(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const isRegional = mode === "regional";
  const fullText = lines
    .filter((line) => !line.interim)
    .map((line) => line.text)
    .join("\n");
  const fullTranslation = lines
    .filter((line) => !line.interim && line.translation)
    .map((line) => line.translation)
    .join("\n");

  useEffect(() => {
    void fetch("/api/transcribe")
      .then((res) => res.json())
      .then((payload: { configured?: boolean }) => {
        setWhisperReady(Boolean(payload.configured));
      })
      .catch(() => setWhisperReady(false));
  }, []);

  const stopMedia = useCallback(() => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  }, []);

  const stopFast = useCallback(() => {
    shouldListenRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setInterim("");
  }, []);

  const stopAll = useCallback(() => {
    stopFast();
    stopMedia();
    setListening(false);
    setProcessing(false);
  }, [stopFast, stopMedia]);

  useEffect(() => () => stopAll(), [stopAll]);

  const appendLine = useCallback(
    (text: string, translation?: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setLines((prev) => [
        ...prev,
        {
          id: nextId(),
          text: trimmed,
          translation: translation?.trim() || undefined,
          at: nowLabel(),
        },
      ]);
    },
    [],
  );

  const sendAudioBlob = useCallback(
    async (blob: Blob) => {
      if (blob.size < 800) return;
      setProcessing(true);
      setError(null);

      try {
        const body = new FormData();
        body.append("file", blob, "chunk.webm");
        body.append("translate", "1");

        const response = await fetch("/api/transcribe", {
          method: "POST",
          body,
        });
        const payload = (await response.json()) as {
          text?: string;
          translation?: string;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? copy.transcribe.errorGeneric);
        }

        appendLine(payload.text ?? "", payload.translation);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : copy.transcribe.errorGeneric,
        );
      } finally {
        setProcessing(false);
      }
    },
    [appendLine],
  );

  const startRegional = useCallback(async () => {
    if (whisperReady === false) {
      setError(copy.transcribe.whisperMissing);
      return;
    }

    setError(null);
    setInterim("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          void sendAudioBlob(event.data);
        }
      };

      recorder.start(8000);
      setListening(true);
    } catch {
      setError(copy.transcribe.micDenied);
    }
  }, [sendAudioBlob, whisperReady]);

  const startFast = useCallback(
    (lang: LiveSpeechLanguage) => {
      if (!isWebSpeechSupported()) {
        setError(copy.transcribe.webSpeechUnsupported);
        return;
      }

      setError(null);
      setInterim("");

      const recognition = createSpeechRecognition(lang);
      if (!recognition) {
        setError(copy.transcribe.webSpeechUnsupported);
        return;
      }

      recognitionRef.current = recognition;
      shouldListenRef.current = true;

      recognition.onresult = (event) => {
        let interimText = "";
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          const piece = result?.[0]?.transcript ?? "";
          if (result?.isFinal) {
            appendLine(piece);
            setInterim("");
          } else {
            interimText += piece;
          }
        }
        if (interimText) setInterim(interimText);
      };

      recognition.onerror = (event) => {
        if (event.error === "aborted") return;
        setError(speechErrorMessage(event.error));
        shouldListenRef.current = false;
        setListening(false);
      };

      recognition.onend = () => {
        if (shouldListenRef.current && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch {
            setListening(false);
          }
          return;
        }
        setListening(false);
        setInterim("");
      };

      recognition.start();
      setListening(true);
    },
    [appendLine],
  );

  const startListening = useCallback(() => {
    if (listening) return;
    if (mode === "regional") {
      void startRegional();
      return;
    }
    startFast(mode === "fast-en" ? "en-US" : "id-ID");
  }, [listening, mode, startFast, startRegional]);

  const stopListening = useCallback(() => {
    stopAll();
  }, [stopAll]);

  const clearTranscript = useCallback(() => {
    setLines([]);
    setInterim("");
    setError(null);
  }, []);

  const copyTranscript = useCallback(async () => {
    const payload = fullTranslation
      ? `${fullText}\n\n--- Terjemahan ---\n${fullTranslation}`
      : fullText;
    if (!payload.trim()) return;
    await navigator.clipboard.writeText(payload);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }, [fullText, fullTranslation]);

  const onUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      await sendAudioBlob(file);
    },
    [sendAudioBlob],
  );

  const activeMode = MODE_OPTIONS.find((item) => item.id === mode)!;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 lg:gap-6">
      <PageHeader
        eyebrow={copy.transcribe.eyebrow}
        title={copy.transcribe.title}
        hint={copy.transcribe.subtitle}
        backHref="/fitur"
      />

      <div className="member-web-animate-in rounded-2xl border border-[var(--m-line)] bg-white/90 p-4 shadow-[var(--shadow-soft)] sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--m-ink)]">
              {copy.transcribe.modeLabel}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--m-ink-soft)]">
              {activeMode.hint}
            </p>
          </div>
          {isRegional ? (
            <Badge
              variant="secondary"
              className={cn(
                "gap-1",
                whisperReady === false && "text-amber-700",
              )}
            >
              <Sparkles className="size-3" />
              {whisperReady === null
                ? copy.transcribe.checking
                : whisperReady
                  ? copy.transcribe.aiReady
                  : copy.transcribe.aiMissing}
            </Badge>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {MODE_OPTIONS.map((item) => {
            const selected = item.id === mode;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (listening) stopAll();
                  setMode(item.id);
                  setError(null);
                }}
                className={cn(
                  "rounded-xl border px-3 py-2 text-left text-xs font-semibold transition",
                  selected
                    ? "border-[var(--m-accent)] bg-[var(--m-accent)] text-white"
                    : "border-[var(--m-line)] bg-[var(--m-wash)]/50 text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {!listening ? (
            <Button
              type="button"
              className="h-11 rounded-xl px-5 font-semibold"
              onClick={startListening}
              disabled={processing}
            >
              <Mic className="size-4" />
              {copy.transcribe.start}
            </Button>
          ) : (
            <Button
              type="button"
              variant="destructive"
              className="h-11 rounded-xl px-5 font-semibold"
              onClick={stopListening}
            >
              <MicOff className="size-4" />
              {copy.transcribe.stop}
            </Button>
          )}

          {isRegional ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl"
                onClick={() => uploadInputRef.current?.click()}
                disabled={processing}
              >
                <Upload className="size-4" />
                {copy.transcribe.upload}
              </Button>
              <input
                ref={uploadInputRef}
                type="file"
                accept="audio/*,video/*"
                className="hidden"
                onChange={onUpload}
              />
            </>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            className="h-11 rounded-xl"
            onClick={clearTranscript}
            disabled={!lines.length && !interim}
          >
            <RotateCcw className="size-4" />
            {copy.transcribe.clear}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="h-11 rounded-xl"
            onClick={() => void copyTranscript()}
            disabled={!fullText.trim()}
          >
            <Copy className="size-4" />
            {copied ? copy.transcribe.copied : copy.transcribe.copy}
          </Button>
        </div>

        {listening ? (
          <p className="mt-3 flex items-center gap-2 text-xs font-medium text-[var(--m-accent)]">
            <span className="size-2 animate-pulse rounded-full bg-red-500" />
            {isRegional
              ? processing
                ? copy.transcribe.regionalProcessing
                : copy.transcribe.regionalListening
              : copy.transcribe.fastListening}
          </p>
        ) : null}

        {error ? (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </div>

      <div className="member-web-animate-in grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--m-line)] bg-white/90 p-4 shadow-[var(--shadow-soft)] sm:p-5">
          <h2 className="text-sm font-semibold text-[var(--m-ink)]">
            {copy.transcribe.transcriptTitle}
          </h2>
          <div className="mt-3 max-h-[min(52vh,28rem)] space-y-3 overflow-y-auto pr-1">
            {lines.length === 0 && !interim ? (
              <p className="text-sm leading-relaxed text-[var(--m-ink-soft)]">
                {copy.transcribe.empty}
              </p>
            ) : null}
            {lines.map((line) => (
              <article
                key={line.id}
                className="rounded-xl border border-[var(--m-line)]/80 bg-[var(--m-wash)]/35 px-3 py-2.5"
              >
                <p className="text-[11px] font-medium text-[var(--m-ink-soft)]">
                  {line.at}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--m-ink)]">
                  {line.text}
                </p>
              </article>
            ))}
            {interim ? (
              <p className="rounded-xl border border-dashed border-[var(--m-line)] px-3 py-2.5 text-sm italic leading-relaxed text-[var(--m-ink-soft)]">
                {interim}
              </p>
            ) : null}
          </div>
        </section>

        {isRegional ? (
          <section className="rounded-2xl border border-[var(--m-line)] bg-white/90 p-4 shadow-[var(--shadow-soft)] sm:p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--m-ink)]">
              <Languages className="size-4 text-[var(--m-accent)]" />
              {copy.transcribe.translationTitle}
            </h2>
            <div className="mt-3 max-h-[min(52vh,28rem)] space-y-3 overflow-y-auto pr-1">
              {lines.some((line) => line.translation) ? (
                lines
                  .filter((line) => line.translation)
                  .map((line) => (
                    <article
                      key={`${line.id}-tr`}
                      className="rounded-xl border border-[var(--m-accent)]/20 bg-[var(--m-accent)]/5 px-3 py-2.5"
                    >
                      <p className="text-[11px] font-medium text-[var(--m-ink-soft)]">
                        {line.at}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--m-ink)]">
                        {line.translation}
                      </p>
                    </article>
                  ))
              ) : (
                <p className="text-sm leading-relaxed text-[var(--m-ink-soft)]">
                  {copy.transcribe.translationEmpty}
                </p>
              )}
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-dashed border-[var(--m-line)] bg-[var(--m-wash)]/25 p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-[var(--m-ink)]">
              {copy.transcribe.tipsTitle}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--m-ink-soft)]">
              {copy.transcribe.tips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="text-[var(--m-accent)]">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
