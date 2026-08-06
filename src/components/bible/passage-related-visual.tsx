"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";

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
          "group hidden items-center gap-3 overflow-hidden rounded-xl border border-[var(--m-line)] bg-white/90 p-2.5 transition hover:border-[var(--m-accent)]/30 lg:flex",
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
        "hidden overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white lg:block",
        className,
      )}
    >
      <ExploreImageLightbox
        previewSrc={imageSrc}
        fullSrc={visual.image.src}
        alt={visual.image.alt}
        title={visual.title}
        source={visual.image.source}
        className="relative aspect-[16/10] overflow-hidden bg-[var(--m-wash)]"
        previewClassName={cn(
          "absolute inset-0 h-full w-full",
          isPhoto ? "object-cover object-center" : "object-contain bg-[#fff7ed] p-1",
        )}
        onPreviewError={handleError}
        loading="lazy"
      />
      <p className="px-4 py-3 text-center text-sm leading-relaxed text-[var(--m-ink-soft)]">
        {visual.hook}
      </p>
    </aside>
  );
}
