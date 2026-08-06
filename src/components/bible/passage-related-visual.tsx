"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Clapperboard } from "lucide-react";

import { ExploreImageLightbox } from "@/components/ui/explore-image-lightbox";
import { copy } from "@/lib/copy";
import { getPassageRelatedVisual } from "@/lib/passage-related-visuals";
import { cn } from "@/lib/utils";

type PassageRelatedVisualProps = {
  passage: string;
  compact?: boolean;
  className?: string;
};

export function PassageRelatedVisual({
  passage,
  compact = false,
  className,
}: PassageRelatedVisualProps) {
  const visual = useMemo(() => getPassageRelatedVisual(passage), [passage]);
  const [src, setSrc] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!visual) return;
    setSrc(visual.image.src);
    setFailed(false);
  }, [visual]);

  if (!visual) return null;

  const imageSrc = failed ? visual.image.fallbackSrc : src || visual.image.src;
  const isPhoto = imageSrc.endsWith(".jpg");

  const handleError = () => {
    if (imageSrc !== visual.image.fallbackSrc) {
      setSrc(visual.image.fallbackSrc);
      return;
    }
    setFailed(true);
  };

  const eyebrow =
    visual.match === "chapter"
      ? copy.reading.visualAnchorChapter
      : copy.reading.visualAnchorBook;

  if (compact) {
    return (
      <Link
        href={visual.href}
        className={cn(
          "group flex items-center gap-3 overflow-hidden rounded-xl border border-[var(--m-line)] bg-white/90 p-2.5 transition hover:border-[var(--m-accent)]/30",
          className,
        )}
      >
        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-[var(--m-wash)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={visual.image.alt}
            className="size-full object-cover"
            onError={handleError}
            loading="lazy"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold tracking-wide text-[var(--m-accent)] uppercase">
            {eyebrow}
          </p>
          <p className="truncate text-sm font-semibold text-[var(--m-ink)] group-hover:text-[var(--m-accent)]">
            {visual.title}
          </p>
        </div>
        <ArrowUpRight className="size-4 shrink-0 text-[var(--m-ink-soft)]/50 group-hover:text-[var(--m-accent)]" />
      </Link>
    );
  }

  return (
    <aside
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--m-line)] bg-gradient-to-br from-white via-white to-[var(--m-wash)]/40",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-[var(--m-line)]/80 bg-[var(--m-wash)]/45 px-4 py-2.5">
        <Clapperboard className="size-3.5 text-[var(--m-accent)]" />
        <p className="text-xs font-semibold text-[var(--m-ink)]">
          {copy.reading.visualAnchorTitle}
        </p>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:items-center">
        <ExploreImageLightbox
          previewSrc={imageSrc}
          fullSrc={visual.image.src}
          alt={visual.image.alt}
          title={visual.title}
          className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[var(--m-wash)] sm:aspect-square"
          previewClassName={cn(
            "absolute inset-0 h-full w-full",
            isPhoto ? "object-cover object-center" : "object-contain bg-[#fff7ed] p-1",
          )}
          onPreviewError={handleError}
          loading="lazy"
        />

        <div className="min-w-0 space-y-2">
          <p className="text-[10px] font-semibold tracking-wide text-[var(--m-accent)] uppercase">
            {eyebrow}
          </p>
          <h3 className="text-base font-semibold leading-snug text-[var(--m-ink)]">
            {visual.title}
          </h3>
          <p className="text-sm leading-relaxed text-[var(--m-ink-soft)]">
            {visual.hook}
          </p>
          <p className="text-xs leading-relaxed text-[var(--m-ink-soft)]/90">
            {copy.reading.visualAnchorHint}
          </p>
          <Link
            href={visual.href}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--m-accent)] transition hover:underline"
          >
            {visual.type === "story"
              ? copy.reading.visualAnchorStoryCta
              : copy.reading.visualAnchorCharacterCta}
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
