"use client";

import { useEffect, useRef } from "react";

import { prefetchSchedulePassages } from "@/lib/bible-passage-cache";
import { readPreferredBibleVersion } from "@/lib/bible-version-preference";
import { getAssignedSchedulePassages } from "@/lib/reading-progress";

/**
 * Unduh bacaan jadwal ke cache lokal di background
 * supaya buka Alkitab tidak selalu menunggu API eksternal.
 */
export function BibleCacheBootstrap() {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const run = () => {
      const version = readPreferredBibleVersion();
      const passages = getAssignedSchedulePassages();
      void prefetchSchedulePassages(version, passages);
    };

    // Tunggu idle supaya tidak mengganggu first paint
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(run, { timeout: 8000 });
      return () => window.cancelIdleCallback(id);
    }

    const timer = window.setTimeout(run, 4000);
    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
