"use client";

import { useEffect, useMemo, useState } from "react";
import { Languages, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { BibleVersionCode } from "@/lib/bible-books";
import {
  compareVersionOptions,
  defaultCompareVersion,
  formatCompareCitation,
  pickVersesForCompare,
  versionLabel,
  type CompareVerseRef,
  type CompareVerseResult,
} from "@/lib/bible-compare";
import { loadPassageClient } from "@/lib/bible-passage-cache";
import { cn } from "@/lib/utils";

type VerseComparePanelProps = {
  open: boolean;
  passageLabel: string;
  bookName: string;
  currentVersion: BibleVersionCode;
  selected: CompareVerseRef[];
  onClose: () => void;
  onInteract?: () => void;
  className?: string;
};

export function VerseComparePanel({
  open,
  passageLabel,
  bookName,
  currentVersion,
  selected,
  onClose,
  onInteract,
  className,
}: VerseComparePanelProps) {
  const options = useMemo(
    () => compareVersionOptions(currentVersion),
    [currentVersion],
  );
  const [targetVersion, setTargetVersion] = useState<BibleVersionCode>(() =>
    defaultCompareVersion(currentVersion),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verses, setVerses] = useState<CompareVerseResult[]>([]);

  const citation = useMemo(
    () => formatCompareCitation(bookName, selected),
    [bookName, selected],
  );

  useEffect(() => {
    if (!open) return;
    setTargetVersion(defaultCompareVersion(currentVersion));
  }, [open, currentVersion]);

  useEffect(() => {
    if (!open || selected.length === 0) return;

    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      setVerses([]);

      const data = await loadPassageClient(passageLabel, targetVersion);
      if (cancelled) return;

      if (!data) {
        setError("Gagal memuat terjemahan. Coba lagi.");
        setLoading(false);
        return;
      }

      const picked = pickVersesForCompare(data, selected);
      if (picked.length === 0) {
        setError("Ayat ini belum tersedia di versi tersebut.");
      } else {
        setVerses(picked);
      }
      setLoading(false);
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [open, passageLabel, targetVersion, selected]);

  if (!open) return null;

  return (
    <div
      data-verse-compare-panel
      data-highlight-toolbar
      className={cn("w-full", className)}
      role="dialog"
      aria-label="Bandingkan terjemahan"
      onPointerDown={() => onInteract?.()}
      onMouseDown={(event) => {
        event.preventDefault();
        onInteract?.();
      }}
    >
      <div className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white shadow-[var(--shadow-soft)]">
        <div className="flex items-start justify-between gap-2 border-b border-[var(--m-line)]/70 px-3.5 py-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--m-ink)]">
              <Languages className="size-3.5 shrink-0 text-[var(--m-accent)]" />
              Bandingkan terjemahan
            </p>
            <p className="mt-0.5 truncate text-xs text-[var(--m-ink-soft)]">
              {citation}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-7 shrink-0 rounded-full"
            onClick={onClose}
            aria-label="Tutup"
          >
            <X className="size-3.5" />
          </Button>
        </div>

        <div className="flex gap-1.5 overflow-x-auto px-3 py-2.5">
          {options.map((option) => {
            const active = option.code === targetVersion;
            return (
              <button
                key={option.code}
                type="button"
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onInteract?.();
                  setTargetVersion(option.code);
                }}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                  active
                    ? "bg-sky-600 text-white"
                    : "bg-[var(--m-wash)] text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]",
                )}
              >
                {option.short}
              </button>
            );
          })}
        </div>

        <div className="max-h-[min(50vh,24rem)] space-y-3 overflow-y-auto px-3.5 pb-4">
          <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
            {versionLabel(targetVersion)}
          </p>

          {loading ? (
            <div className="flex items-center gap-2 py-6 text-sm text-[var(--m-ink-soft)]">
              <Loader2 className="size-4 animate-spin text-[var(--m-accent)]" />
              Memuat terjemahan…
            </div>
          ) : null}

          {!loading && error ? (
            <p className="py-4 text-sm text-destructive">{error}</p>
          ) : null}

          {!loading && !error
            ? verses.map((item) => (
                <p
                  key={`${item.chapter}:${item.verse}`}
                  className="text-[0.95rem] leading-relaxed text-[var(--m-ink)]"
                >
                  <sup className="mr-1 font-semibold text-[var(--m-accent)]">
                    {item.verse}
                  </sup>
                  {item.content}
                </p>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
