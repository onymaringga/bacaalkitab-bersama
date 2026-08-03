"use client";

import { useEffect, useState } from "react";

/** Desktop web dashboard threshold (px). Below = mobile layout. */
export const DESKTOP_BREAKPOINT = 1024;

export type DeviceMode = "mobile" | "desktop";

function getDeviceMode(): DeviceMode {
  if (typeof window === "undefined") return "mobile";
  return window.innerWidth >= DESKTOP_BREAKPOINT ? "desktop" : "mobile";
}

/**
 * Auto-detect mobile vs desktop by viewport width.
 * Updates on resize so browser DevTools device mode also works.
 */
export function useDevice() {
  const [mode, setMode] = useState<DeviceMode>("mobile");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const update = () => setMode(getDeviceMode());
    update();
    setReady(true);

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return {
    mode,
    ready,
    isMobile: mode === "mobile",
    isDesktop: mode === "desktop",
  };
}
