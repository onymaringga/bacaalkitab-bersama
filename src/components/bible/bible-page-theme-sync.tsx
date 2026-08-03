"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

import {
  applyBiblePageTheme,
  getServerBibleReadingTheme,
  readBibleReadingTheme,
  subscribeBibleReadingTheme,
} from "@/lib/bible-reading-theme";

/** Sinkronkan tema Gelap/Kindle ke chrome halaman saat di rute baca Alkitab. */
export function BiblePageThemeSync() {
  const pathname = usePathname();
  const theme = useSyncExternalStore(
    subscribeBibleReadingTheme,
    readBibleReadingTheme,
    getServerBibleReadingTheme,
  );

  const onThemedRoute =
    pathname.startsWith("/baca") ||
    pathname.startsWith("/alkitab") ||
    pathname.startsWith("/renungan") ||
    pathname.startsWith("/refleksiku") ||
    pathname.startsWith("/catatan");

  useEffect(() => {
    const immersive =
      onThemedRoute && (theme === "night" || theme === "kindle");
    applyBiblePageTheme(immersive ? theme : null);
    return () => {
      applyBiblePageTheme(null);
    };
  }, [theme, onThemedRoute]);

  return null;
}
