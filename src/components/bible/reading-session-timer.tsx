"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Clock3, Pause, Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  formatReadingDuration,
  formatReadingDurationClock,
  getActiveElapsedMs,
  getCompletedReadingSession,
  getReadingSessionSnapshot,
  pauseReadingSession,
  resetReadingSession,
  resumeReadingSession,
  startReadingSession,
  subscribeReadingSessions,
} from "@/lib/bible-reading-session";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

type ReadingSessionTimerProps = {
  passage: string;
  passageLabel?: string;
  className?: string;
  /** Ringkas untuk toolbar (tanpa label “Sedang baca”). */
  compact?: boolean;
  /** Tombol pause / lanjut / reset. */
  showControls?: boolean;
};

export function ReadingSessionTimer({
  passage,
  passageLabel,
  className,
  compact = false,
  showControls = true,
}: ReadingSessionTimerProps) {
  const snapshot = useSyncExternalStore(
    subscribeReadingSessions,
    () => getReadingSessionSnapshot(passage),
    () => "idle",
  );
  const [tick, setTick] = useState(0);
  const userPausedRef = useRef(false);

  useEffect(() => {
    startReadingSession(passage, passageLabel ?? passage);

    function onVisibility() {
      if (document.hidden) {
        pauseReadingSession(passage);
      } else if (!userPausedRef.current) {
        resumeReadingSession(passage);
      }
    }

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [passage, passageLabel]);

  const isDone = snapshot.startsWith("done:");
  const isRunning = snapshot.startsWith("active:") && snapshot.endsWith(":1");
  const isPaused = snapshot.startsWith("active:") && snapshot.endsWith(":0");

  useEffect(() => {
    if (isDone || !isRunning) return;
    const id = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [isDone, isRunning, passage]);

  void tick;

  const completed = getCompletedReadingSession(passage);
  const elapsedMs = completed
    ? completed.durationMs
    : getActiveElapsedMs(passage);

  if (!completed && !isPaused && !isRunning && elapsedMs < 1000) return null;

  function handleTogglePause() {
    if (isRunning) {
      userPausedRef.current = true;
      pauseReadingSession(passage);
      return;
    }
    userPausedRef.current = false;
    resumeReadingSession(passage);
  }

  function handleReset() {
    userPausedRef.current = false;
    resetReadingSession(passage, passageLabel ?? passage);
  }

  const controlsVisible = showControls && !completed;

  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-0.5",
        completed ? "text-emerald-700" : "text-[var(--m-ink-soft)]",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex min-w-0 items-center gap-1 text-xs font-medium tabular-nums",
          isPaused && !completed && "opacity-80",
        )}
        title={
          completed
            ? `Waktu baca sampai refleksi: ${formatReadingDuration(elapsedMs)}`
            : isPaused
              ? copy.bible.readingTimerPausedHint
              : copy.bible.readingTimerRunningHint
        }
      >
        <Clock3 className="size-3 shrink-0" aria-hidden />
        {completed ? (
          <span>
            {compact ? "" : "Selesai · "}
            {formatReadingDuration(elapsedMs)}
          </span>
        ) : (
          <span>
            {compact ? null : (
              <>
                {isPaused ? "Dijeda · " : "Sedang baca · "}
              </>
            )}
            <span
              className={cn(
                "font-semibold",
                isPaused ? "text-[var(--m-ink-soft)]" : "text-[var(--m-ink)]",
              )}
            >
              {formatReadingDurationClock(elapsedMs)}
            </span>
          </span>
        )}
      </span>

      {controlsVisible ? (
        <span className="inline-flex shrink-0 items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="size-6 rounded-md text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]"
            onClick={handleTogglePause}
            aria-label={
              isRunning
                ? copy.bible.readingTimerPause
                : copy.bible.readingTimerResume
            }
            title={
              isRunning
                ? copy.bible.readingTimerPause
                : copy.bible.readingTimerResume
            }
          >
            {isRunning ? (
              <Pause className="size-3" />
            ) : (
              <Play className="size-3" />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="size-6 rounded-md text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]"
            onClick={handleReset}
            aria-label={copy.bible.readingTimerReset}
            title={copy.bible.readingTimerReset}
          >
            <RotateCcw className="size-3" />
          </Button>
        </span>
      ) : null}
    </span>
  );
}
