import { readLastOpenedPassage } from "@/lib/bible-opened-chapters";
import { demoTodayReading } from "@/lib/demo-data";
import { resolveScheduleReading } from "@/lib/schedule-devotional";

export const BACA_FALLBACK_PASSAGE = "Matius 1";

/** Pasal default saat buka /baca — baca localStorage di client. */
export function resolveDefaultPassage(): string {
  if (typeof window === "undefined") return BACA_FALLBACK_PASSAGE;

  const last = readLastOpenedPassage();
  const today = resolveScheduleReading(demoTodayReading);
  return (
    last ||
    (today.passage !== "Belum dijadwalkan" ? today.passage : null) ||
    BACA_FALLBACK_PASSAGE
  );
}

export function buildBacaHref(
  passage: string,
  options?: { browse?: boolean; scheduleDate?: string | null },
) {
  const params = new URLSearchParams();
  params.set("passage", passage);
  if (options?.scheduleDate) {
    params.set("date", options.scheduleDate);
  } else if (options?.browse !== false) {
    params.set("browse", "1");
  }
  return `/baca?${params.toString()}`;
}

/** URL prefetch/nav — pasal fallback; di-upgrade ke last-opened di client bila ada. */
export function getDefaultBacaHref(scheduleDate?: string | null) {
  return buildBacaHref(BACA_FALLBACK_PASSAGE, { scheduleDate });
}
