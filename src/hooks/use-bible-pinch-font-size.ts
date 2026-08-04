"use client";

import { useEffect } from "react";

import {
  readBibleFontSize,
  stepBibleFontSize,
  writeBibleFontSize,
} from "@/lib/bible-font-size";

/** Pinch melebar → font lebih besar; pinch rapat → font lebih kecil. */
const PINCH_IN_RATIO = 1.14;
const PINCH_OUT_RATIO = 0.86;

function touchDistance(touches: TouchList) {
  if (touches.length < 2) return 0;
  const a = touches[0]!;
  const b = touches[1]!;
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

/**
 * Pinch dua jari pada area baca → naik/turunkan ukuran font Alkitab.
 * Hanya aktif di mobile (`enabled`).
 */
export function useBiblePinchFontSize(
  element: HTMLElement | null,
  enabled: boolean,
) {
  useEffect(() => {
    if (!element || !enabled) return;

    let startDistance: number | null = null;

    function onTouchStart(event: TouchEvent) {
      if (event.touches.length === 2) {
        startDistance = touchDistance(event.touches);
      }
    }

    function onTouchMove(event: TouchEvent) {
      if (event.touches.length !== 2 || startDistance == null || startDistance <= 0) {
        return;
      }

      event.preventDefault();

      const distance = touchDistance(event.touches);
      const ratio = distance / startDistance;

      if (ratio >= PINCH_IN_RATIO) {
        writeBibleFontSize(stepBibleFontSize(readBibleFontSize(), 1));
        startDistance = distance;
      } else if (ratio <= PINCH_OUT_RATIO) {
        writeBibleFontSize(stepBibleFontSize(readBibleFontSize(), -1));
        startDistance = distance;
      }
    }

    function onTouchEnd(event: TouchEvent) {
      if (event.touches.length < 2) {
        startDistance = null;
      }
    }

    element.addEventListener("touchstart", onTouchStart, { passive: true });
    element.addEventListener("touchmove", onTouchMove, { passive: false });
    element.addEventListener("touchend", onTouchEnd, { passive: true });
    element.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchmove", onTouchMove);
      element.removeEventListener("touchend", onTouchEnd);
      element.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [element, enabled]);
}
