"use client";

import { useEffect, useState, type RefObject } from "react";

type Options = {
  enabled?: boolean;
};

/** Persentase ayat terbaca + apakah cukup scroll untuk tampilkan kontrol. */
export function usePassageReadingProgress(
  containerRef: RefObject<HTMLElement | null>,
  verseCount: number,
  { enabled = true }: Options = {},
) {
  const [percent, setPercent] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled || verseCount < 2) {
      setVisible(false);
      setPercent(0);
      return;
    }

    let frame = 0;

    function measure() {
      const root = containerRef.current;
      if (!root) {
        setVisible(false);
        return;
      }

      const nodes = root.querySelectorAll<HTMLElement>("[data-verse-node]");
      if (nodes.length < 2) {
        setVisible(false);
        return;
      }

      const readingLine = window.innerHeight * 0.58;
      let passed = 0;
      for (let i = 0; i < nodes.length; i += 1) {
        const rect = nodes[i]!.getBoundingClientRect();
        const mid = (rect.top + rect.bottom) / 2;
        if (mid < readingLine) passed = i + 1;
        else break;
      }

      const lastRect = nodes[nodes.length - 1]!.getBoundingClientRect();
      const bottomChrome = 140;
      const reachedEnd =
        lastRect.bottom <= window.innerHeight - bottomChrome + 32 ||
        lastRect.top < window.innerHeight * 0.85;
      if (reachedEnd) {
        passed = nodes.length;
      }

      const nextPercent = Math.min(
        100,
        Math.round((passed / nodes.length) * 100),
      );
      setPercent(nextPercent);
      setVisible(passed >= 1);
    }

    function onScrollOrResize() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [containerRef, enabled, verseCount]);

  return { percent, visible };
}
