"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Gauge, LocateFixed, Pause, Play, Square, Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuickTooltip } from "@/components/ui/quick-tooltip";
import { showToast } from "@/components/ui/toast-host";
import {
  buildPassageSpeechUnits,
  buildSpeechUnitsFromSelection,
  formatSpeechRate,
  getSelectedSpeechText,
  getSpeechRate,
  pausePassageSpeech,
  resumePassageSpeech,
  scrollSpeechVerseIntoView,
  sliceSpeechUnitsFromVerse,
  speakPassageUnits,
  SPEECH_RATE_STEPS,
  stepSpeechRate,
  stopPassageSpeech,
  subscribeSpeechPlayFromVerse,
  type SpeechStatus,
  type SpeechUnit,
} from "@/lib/bible-speech";
import { cn } from "@/lib/utils";

type PassageSpeechControlsProps = {
  title: string;
  subtitle?: string | null;
  verses: { verse: number; content: string }[];
  className?: string;
  /** Hanya ikon (toolbar rapat). */
  iconOnly?: boolean;
};

export function PassageSpeechControls({
  title,
  subtitle,
  verses,
  className,
  iconOnly = false,
}: PassageSpeechControlsProps) {
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [supported, setSupported] = useState(true);
  const [hasSelection, setHasSelection] = useState(false);
  const [rate, setRate] = useState(getSpeechRate);
  const [rateOpen, setRateOpen] = useState(false);
  /** Ikuti posisi TTS di layar. User scroll manual = lepas. */
  const [followScroll, setFollowScroll] = useState(true);
  const pendingSelectionRef = useRef<string | null>(null);
  const followScrollRef = useRef(true);
  const activeVerseRef = useRef<number | null>(null);
  const ignoreUserScrollUntilRef = useRef(0);
  const playFromVerseRef = useRef<(verse: number) => void>(() => {});

  const speechUnits = useMemo(
    () =>
      buildPassageSpeechUnits({
        title,
        subtitle,
        verses,
      }),
    [title, subtitle, verses],
  );

  const rateIndex = SPEECH_RATE_STEPS.indexOf(rate);
  const atMinRate = rateIndex <= 0;
  const atMaxRate = rateIndex >= SPEECH_RATE_STEPS.length - 1;
  const showRatePanel = rateOpen || status === "speaking" || status === "paused";
  const isLive = status === "speaking" || status === "paused";

  useEffect(() => {
    followScrollRef.current = followScroll;
  }, [followScroll]);

  useEffect(() => {
    setSupported(
      typeof window !== "undefined" &&
        ("speechSynthesis" in window || typeof Audio !== "undefined"),
    );
    setRate(getSpeechRate());
    return () => {
      stopPassageSpeech();
    };
  }, []);

  // Hentikan saat pasal berubah
  useEffect(() => {
    stopPassageSpeech();
    setStatus("idle");
    pendingSelectionRef.current = null;
    setHasSelection(false);
    setRateOpen(false);
    setFollowScroll(true);
    activeVerseRef.current = null;
  }, [speechUnits]);

  useEffect(() => {
    const syncSelection = () => {
      const selected = getSelectedSpeechText();
      pendingSelectionRef.current = selected;
      setHasSelection(Boolean(selected));
    };

    const onMouseUp = () => {
      window.setTimeout(syncSelection, 10);
    };
    const onTouchEnd = () => {
      window.setTimeout(syncSelection, 80);
    };
    const onKeyUp = () => {
      syncSelection();
    };
    const onSelectionChange = () => {
      const selected = getSelectedSpeechText();
      if (selected) {
        pendingSelectionRef.current = selected;
        setHasSelection(true);
      } else if (document.activeElement?.closest?.("[data-speech-controls]")) {
        return;
      } else {
        pendingSelectionRef.current = null;
        setHasSelection(false);
      }
    };

    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("keyup", onKeyUp);
    document.addEventListener("selectionchange", onSelectionChange);
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, []);

  // User scroll/geser layar → lepas mode ikuti (tetap bisa scroll bebas)
  useEffect(() => {
    if (!isLive) return;

    const releaseFollow = () => {
      if (Date.now() < ignoreUserScrollUntilRef.current) return;
      if (!followScrollRef.current) return;
      followScrollRef.current = false;
      setFollowScroll(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const keys = [
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
      ];
      if (keys.includes(event.key)) releaseFollow();
    };

    window.addEventListener("wheel", releaseFollow, { passive: true });
    window.addEventListener("touchmove", releaseFollow, { passive: true });
    window.addEventListener("scroll", releaseFollow, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", releaseFollow);
      window.removeEventListener("touchmove", releaseFollow);
      window.removeEventListener("scroll", releaseFollow);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isLive]);

  function markProgrammaticScroll() {
    ignoreUserScrollUntilRef.current = Date.now() + 900;
  }

  function followVerse(verse: number | null) {
    activeVerseRef.current = verse;
    if (verse == null) return;
    if (!followScrollRef.current) return;
    markProgrammaticScroll();
    scrollSpeechVerseIntoView(verse);
  }

  function reenableFollow() {
    followScrollRef.current = true;
    setFollowScroll(true);
    const verse = activeVerseRef.current;
    if (verse != null) {
      markProgrammaticScroll();
      scrollSpeechVerseIntoView(verse);
    }
  }

  function captureSelectionForPlay() {
    const live = getSelectedSpeechText();
    if (live) {
      pendingSelectionRef.current = live;
      setHasSelection(true);
      return live;
    }
    return pendingSelectionRef.current;
  }

  function startSpeaking(units: SpeechUnit[], toastMessage?: string) {
    if (units.length === 0) {
      showToast("Tidak ada teks untuk dibacakan");
      return;
    }

    followScrollRef.current = true;
    setFollowScroll(true);
    activeVerseRef.current = null;
    if (toastMessage) showToast(toastMessage);

    speakPassageUnits({
      units,
      rate,
      onStart: () => setStatus("speaking"),
      onUnitStart: (unit) => {
        followVerse(unit.verse);
      },
      onEnd: () => {
        setStatus("idle");
        setRateOpen(false);
        activeVerseRef.current = null;
        setFollowScroll(true);
      },
      onError: (message) => {
        setStatus("idle");
        activeVerseRef.current = null;
        showToast(message);
      },
    });
  }

  function playFromVerse(fromVerse: number) {
    if (!supported) {
      showToast("Browser ini belum mendukung text-to-speech");
      return;
    }
    const units = sliceSpeechUnitsFromVerse(speechUnits, fromVerse);
    if (units.length === 0 || units[0]?.verse !== fromVerse) {
      showToast(`Ayat ${fromVerse} tidak ditemukan di pasal ini`);
      return;
    }
    startSpeaking(units, `Membaca dari ayat ${fromVerse}…`);
  }

  playFromVerseRef.current = playFromVerse;

  function handlePlay() {
    if (!supported) {
      showToast("Browser ini belum mendukung text-to-speech");
      return;
    }
    if (status === "paused") {
      resumePassageSpeech();
      setStatus("speaking");
      return;
    }

    const selectedText = captureSelectionForPlay();
    const fromSelection = buildSpeechUnitsFromSelection(verses);
    const units =
      fromSelection && fromSelection.length > 0
        ? fromSelection
        : selectedText
          ? [{ id: "selection", verse: null, text: selectedText }]
          : speechUnits;

    startSpeaking(units);
  }

  useEffect(() => {
    return subscribeSpeechPlayFromVerse((verse) => {
      playFromVerseRef.current(verse);
    });
  }, []);

  function handlePause() {
    pausePassageSpeech();
    setStatus("paused");
  }

  function handleStop() {
    stopPassageSpeech();
    setStatus("idle");
    setRateOpen(false);
    activeVerseRef.current = null;
    setFollowScroll(true);
  }

  function handleRateStep(delta: -1 | 1) {
    const next = stepSpeechRate(delta);
    setRate(next);
  }

  if (!supported) {
    return (
      <QuickTooltip label="Text-to-speech tidak didukung">
        <span className="inline-flex">
          <Button
            type="button"
            variant="outline"
            size={iconOnly ? "icon-sm" : "sm"}
            className={cn(
              iconOnly
                ? "size-9 rounded-xl"
                : "h-9 rounded-xl px-3 text-sm font-semibold",
              className,
            )}
            disabled
            aria-label="Text-to-speech tidak didukung"
          >
            <Volume2 className="size-3.5" />
            {!iconOnly ? "TTS tidak tersedia" : null}
          </Button>
        </span>
      </QuickTooltip>
    );
  }

  const playLabel =
    status === "paused"
      ? "Lanjutkan"
      : hasSelection
        ? "Dengarkan pilihan"
        : "Dengarkan";

  return (
    <div
      data-speech-controls
      className={cn(
        iconOnly
          ? "relative inline-flex h-8 items-center gap-0 rounded-lg bg-[var(--m-wash)]/55 p-0"
          : "flex flex-wrap items-center gap-1",
        className,
      )}
    >
      {status === "speaking" ? (
        <QuickTooltip label="Jeda">
          <Button
            type="button"
            variant={iconOnly ? "ghost" : "outline"}
            size={iconOnly ? "icon-sm" : "sm"}
            className={cn(
              iconOnly
                ? "size-8 rounded-lg"
                : "h-9 rounded-xl px-2.5 text-sm font-semibold",
            )}
            onClick={handlePause}
            aria-label="Jeda"
          >
            <Pause className="size-3.5" />
            {!iconOnly ? "Jeda" : null}
          </Button>
        </QuickTooltip>
      ) : (
        <QuickTooltip label={playLabel}>
          <span className="inline-flex">
            <Button
              type="button"
              variant={iconOnly ? "ghost" : "outline"}
              size={iconOnly ? "icon-sm" : "sm"}
              className={cn(
                iconOnly
                  ? "size-8 rounded-lg"
                  : "h-9 rounded-xl px-2.5 text-sm font-semibold",
              )}
              onMouseDown={(event) => {
                captureSelectionForPlay();
                event.preventDefault();
              }}
              onPointerDown={() => {
                captureSelectionForPlay();
              }}
              onClick={handlePlay}
              disabled={verses.length === 0}
              aria-label={playLabel}
            >
              {status === "paused" ? (
                <>
                  <Play className="size-3.5" />
                  {!iconOnly ? "Lanjut" : null}
                </>
              ) : (
                <>
                  <Volume2 className="size-3.5" />
                  {!iconOnly ? (hasSelection ? "Pilihan" : "Dengarkan") : null}
                </>
              )}
            </Button>
          </span>
        </QuickTooltip>
      )}

      {isLive ? (
        <QuickTooltip label="Stop">
          <Button
            type="button"
            variant="ghost"
            size={iconOnly ? "icon-sm" : "sm"}
            className={cn(
              iconOnly ? "size-8 rounded-lg" : "h-9 rounded-xl px-2.5",
            )}
            onClick={handleStop}
            aria-label="Hentikan pembacaan"
          >
            <Square className="size-3.5 fill-current" />
            {!iconOnly ? "Stop" : null}
          </Button>
        </QuickTooltip>
      ) : null}

      {isLive ? (
        <QuickTooltip
          label={
            followScroll
              ? "Mengikuti bacaan — scroll manual untuk lepas"
              : "Ikuti lagi posisi yang sedang dibaca"
          }
        >
          <Button
            type="button"
            variant="ghost"
            size={iconOnly ? "icon-sm" : "sm"}
            className={cn(
              iconOnly ? "size-8 rounded-lg" : "h-9 rounded-xl px-2.5",
              followScroll
                ? "text-[var(--m-accent)]"
                : "text-muted-foreground",
            )}
            onClick={() => {
              if (followScroll) {
                followScrollRef.current = false;
                setFollowScroll(false);
              } else {
                reenableFollow();
              }
            }}
            aria-label={
              followScroll ? "Lepas ikuti layar" : "Ikuti posisi bacaan"
            }
            aria-pressed={followScroll}
          >
            <LocateFixed className="size-3.5" />
            {!iconOnly ? (followScroll ? "Mengikuti" : "Ikuti") : null}
          </Button>
        </QuickTooltip>
      ) : null}

      {status === "idle" ? (
        <QuickTooltip label={`Kecepatan ${formatSpeechRate(rate)}`}>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(
              iconOnly ? "size-8 rounded-lg" : "size-9 rounded-xl",
              rateOpen && "bg-white text-[var(--m-accent)]",
            )}
            onClick={() => {
              setRateOpen((open) => !open);
            }}
            aria-label="Atur kecepatan suara"
            aria-pressed={rateOpen}
          >
            <Gauge className="size-3.5" />
          </Button>
        </QuickTooltip>
      ) : null}

      {showRatePanel ? (
        <div
          className={cn(
            "inline-flex items-center gap-0.5 rounded-lg border border-[var(--m-line)] bg-white p-0.5",
            iconOnly ? "h-8" : "h-9 shadow-sm",
          )}
          role="group"
          aria-label="Kecepatan pembacaan"
        >
          <QuickTooltip label="Perlambat">
            <span className="inline-flex">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-7 rounded-md text-base font-semibold"
                disabled={atMinRate}
                onClick={() => handleRateStep(-1)}
                aria-label="Perlambat"
              >
                −
              </Button>
            </span>
          </QuickTooltip>
          <QuickTooltip label={`Kecepatan ${formatSpeechRate(rate)}`}>
            <span className="min-w-[2.5rem] text-center text-[11px] font-bold tabular-nums text-[var(--m-ink)]">
              {formatSpeechRate(rate)}
            </span>
          </QuickTooltip>
          <QuickTooltip label="Percepat">
            <span className="inline-flex">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-7 rounded-md text-base font-semibold"
                disabled={atMaxRate}
                onClick={() => handleRateStep(1)}
                aria-label="Percepat"
              >
                +
              </Button>
            </span>
          </QuickTooltip>
        </div>
      ) : null}
    </div>
  );
}
