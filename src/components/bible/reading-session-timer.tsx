"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Clock3 } from "lucide-react";

import {
  formatReadingDuration,
  formatReadingDurationClock,
  getActiveElapsedMs,
  getCompletedReadingSession,
  getReadingSessionSnapshot,
  pauseReadingSession,
  resumeReadingSession,
  startReadingSession,
  subscribeReadingSessions,
} from "@/lib/bible-reading-session";
import { cn } from "@/lib/utils";

type ReadingSessionTimerProps = {
  passage: string;
  passageLabel?: string;
  className?: string;
  /** Ringkas untuk toolbar (tanpa label “Sedang baca”). */
  compact?: boolean;
};

export function ReadingSessionTimer({
  passage,
  passageLabel,
  className,
  compact = false,
}: ReadingSessionTimerProps) {
  const snapshot = useSyncExternalStore(
    subscribeReadingSessions,
    () => getReadingSessionSnapshot(passage),
    () => "idle",
  );
  const [tick, setTick] = useState(0);

  useEffect(() => {
    startReadingSession(passage, passageLabel ?? passage);

    function onVisibility() {
      if (document.hidden) {
        pauseReadingSession(passage);
      } else {
        resumeReadingSession(passage);
      }
    }

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      // Jangan pause di unmount — supaya ganti tab Renungan/Refleksi
      // tidak menghentikan timer (komponen hanya di tab Kitab).
    };
  }, [passage, passageLabel]);

  const isDone = snapshot.startsWith("done:");
  const isRunning = snapshot.startsWith("active:") && snapshot.endsWith(":1");

  useEffect(() => {
    if (isDone || !isRunning) return;
    const id = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [isDone, isRunning, passage]);

  // tick hanya untuk re-render tampilan jam; snapshot tetap stabil
  void tick;

  const completed = getCompletedReadingSession(passage);
  const elapsedMs = completed
    ? completed.durationMs
    : getActiveElapsedMs(passage);

  if (elapsedMs < 1000 && !completed) return null;

  return (
    <p
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium tabular-nums",
        completed ? "text-emerald-700" : "text-[var(--m-ink-soft)]",
        className,
      )}
      title={
        completed
          ? `Waktu baca sampai refleksi: ${formatReadingDuration(elapsedMs)}`
          : "Waktu baca berlangsung — berhenti saat refleksi disimpan"
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
              Sedang baca ·{" "}
            </>
          )}
          <span className="font-semibold text-[var(--m-ink)]">
            {formatReadingDurationClock(elapsedMs)}
          </span>
        </span>
      )}
    </p>
  );
}
