"use client";

import { useMemo, useState } from "react";

import { ExploreImageLightbox } from "@/components/ui/explore-image-lightbox";
import { getStoryImage } from "@/lib/bible-story-images";
import { cn } from "@/lib/utils";

type StoryComicIllustrationProps = {
  slug: string;
  title: string;
  variant?: "hero" | "thumb";
  className?: string;
};

export function StoryComicIllustration({
  slug,
  title,
  variant = "hero",
  className,
}: StoryComicIllustrationProps) {
  const image = useMemo(() => getStoryImage(slug, title), [slug, title]);
  const [src, setSrc] = useState(image.src);
  const [failed, setFailed] = useState(false);
  const isHero = variant === "hero";
  const isPhoto = src.endsWith(".jpg");

  if (failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200",
          isHero ? "aspect-[2/1] min-h-[11rem] sm:aspect-[21/9]" : "aspect-[4/3]",
          className,
        )}
      >
        <span className="text-center text-xs font-semibold text-[var(--m-ink-soft)]">
          {title}
        </span>
      </div>
    );
  }

  const containerClassName = cn(
    "relative overflow-hidden bg-[var(--m-wash)]",
    isHero ? "aspect-[2/1] min-h-[11rem] sm:aspect-[21/9]" : "aspect-[4/3]",
    className,
  );

  const imageClassName = cn(
    "absolute inset-0 h-full w-full object-center transition-opacity duration-300",
    isPhoto
      ? "object-cover"
      : isHero
        ? "object-contain bg-[#fff7ed] p-1"
        : "object-cover",
  );

  const handleError = () => {
    if (src !== image.fallbackSrc) {
      setSrc(image.fallbackSrc);
      return;
    }
    setFailed(true);
  };

  const gradientOverlay =
    isPhoto && isHero ? (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
      />
    ) : null;

  if (isHero) {
    return (
      <ExploreImageLightbox
        previewSrc={src}
        fullSrc={image.src}
        alt={image.alt}
        title={title}
        source={image.source}
        className={containerClassName}
        previewClassName={imageClassName}
        onPreviewError={handleError}
        loading="eager"
        overlay={gradientOverlay}
      />
    );
  }

  return (
    <div className={containerClassName}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={image.alt}
        className={imageClassName}
        onError={handleError}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
