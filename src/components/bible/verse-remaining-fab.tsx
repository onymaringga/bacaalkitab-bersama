"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";

type VerseRemainingFabProps = {
  containerRef: RefObject<HTMLElement | null>;
  /** Total ayat di pasal (untuk reset saat ganti bacaan). */
  verseCount: number;
  enabled?: boolean;
};

/**
 * Progress bacaan (%) + balik ke atas — menempel di luar border kanan kartu.
 */
export function VerseRemainingFab({
  containerRef,
  verseCount,
  enabled = true,
}: VerseRemainingFabProps) {
  const fabRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(0);
  const [show, setShow] = useState(false);
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled || verseCount < 2) {
      setShow(false);
      setPercent(0);
      setLeft(null);
      return;
    }

    let frame = 0;

    function measure() {
      const root = containerRef.current;
      if (!root) {
        setShow(false);
        setLeft(null);
        return;
      }

      const nodes = root.querySelectorAll<HTMLElement>("[data-verse-node]");
      if (nodes.length < 2) {
        setShow(false);
        setLeft(null);
        return;
      }

      const readingLine = window.innerHeight * 0.58;
      let passed = 0;
      for (let i = 0; i < nodes.length; i += 1) {
        const rect = nodes[i]!.getBoundingClientRect();
        // Ayat dianggap terbaca jika titik tengahnya sudah lewat garis baca
        const mid = (rect.top + rect.bottom) / 2;
        if (mid < readingLine) passed = i + 1;
        else break;
      }

      // Mentok bawah: ayat terakhir sudah masuk viewport → 100%
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
      // Tampil setelah mulai baca — termasuk 100% di akhir pasal
      const visible = passed >= 1;
      setShow(visible);

      if (!visible) {
        setLeft(null);
        return;
      }

      const shell =
        (root.closest("[data-passage-shell]") as HTMLElement | null) ??
        (root.closest("section") as HTMLElement | null) ??
        root;
      const rect = shell.getBoundingClientRect();
      const gap = 10;
      const fabW = fabRef.current?.offsetWidth ?? 64;
      const edgePad = 8;

      const preferredLeft = rect.right + gap;
      const maxLeft = window.innerWidth - fabW - edgePad;
      setLeft(Math.max(edgePad, Math.min(preferredLeft, maxLeft)));
    }

    function onScrollOrResize() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    }

    measure();
    frame = requestAnimationFrame(measure);

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [containerRef, enabled, verseCount, show]);

  function scrollToTop() {
    const root = containerRef.current;
    const target =
      (root?.closest("[data-passage-shell]") as HTMLElement | null) ??
      (root?.closest("section") as HTMLElement | null) ??
      root;
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!show || left == null) return null;

  const fabShellClass = cn(
    "flex size-16 flex-col items-center justify-center rounded-full",
    "border border-[var(--m-line)] bg-white text-[var(--m-ink)]",
    "shadow-[0_8px_24px_-10px_rgba(15,23,42,0.35)]",
  );

  return (
    <div
      ref={fabRef}
      className={cn(
        "fixed z-40 flex flex-col items-center gap-2",
        "bottom-[calc(5.5rem+env(safe-area-inset-bottom))] lg:bottom-8",
        "animate-in fade-in zoom-in-95 duration-200",
      )}
      style={{ left }}
    >
      <button
        type="button"
        onClick={scrollToTop}
        className={cn(
          fabShellClass,
          "transition hover:bg-[var(--m-wash)] active:scale-[0.97]",
        )}
        aria-label="Kembali ke atas"
        title="Kembali ke atas"
      >
        <ArrowUp className="size-5 text-[var(--m-ink)]" strokeWidth={2.25} />
        <span className="mt-0.5 text-[8px] font-semibold leading-none tracking-wide text-[var(--m-ink-soft)] uppercase">
          Atas
        </span>
      </button>

      <div
        className={cn(
          fabShellClass,
          percent >= 100 && "border-emerald-200 bg-emerald-50/90",
        )}
        role="status"
        aria-live="polite"
        aria-label={
          percent >= 100
            ? "100 persen ayat dibaca"
            : `${percent} persen ayat dibaca`
        }
        title={percent >= 100 ? "Selesai dibaca" : `${percent}% dibaca`}
      >
        <span className="text-lg font-bold leading-none tabular-nums tracking-tight text-emerald-600">
          {percent}
          <span className="text-sm">%</span>
        </span>
        <span className="mt-0.5 text-[9px] font-semibold leading-tight tracking-wide text-[var(--m-ink-soft)] uppercase">
          {percent >= 100 ? "selesai" : "dibaca"}
        </span>
      </div>
    </div>
  );
}
