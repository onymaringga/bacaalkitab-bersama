"use client";

import { useEffect, useMemo, useState } from "react";

import { ExploreImageLightbox } from "@/components/ui/explore-image-lightbox";
import type { BibleCharacterCategoryId } from "@/lib/bible-characters";
import { getCharacterImage } from "@/lib/bible-character-images";
import { cn } from "@/lib/utils";

const CATEGORY_TONE: Record<
  BibleCharacterCategoryId,
  { gradient: string; icon: string }
> = {
  patriarkh: {
    gradient: "from-amber-100 via-orange-50 to-amber-200/80",
    icon: "text-amber-800",
  },
  nabi: {
    gradient: "from-sky-100 via-cyan-50 to-sky-200/80",
    icon: "text-sky-800",
  },
  raja: {
    gradient: "from-violet-100 via-fuchsia-50 to-violet-200/80",
    icon: "text-violet-800",
  },
  murid: {
    gradient: "from-blue-100 via-indigo-50 to-blue-200/80",
    icon: "text-blue-800",
  },
  perempuan: {
    gradient: "from-rose-100 via-pink-50 to-rose-200/80",
    icon: "text-rose-800",
  },
  lainnya: {
    gradient: "from-slate-100 via-stone-50 to-slate-200/80",
    icon: "text-slate-800",
  },
};

type CharacterPortraitProps = {
  slug: string;
  name: string;
  category: BibleCharacterCategoryId;
  variant?: "hero" | "thumb";
  className?: string;
};

export function CharacterPortrait({
  slug,
  name,
  category,
  variant = "hero",
  className,
}: CharacterPortraitProps) {
  const image = useMemo(
    () => getCharacterImage(slug, name, category),
    [slug, name, category],
  );
  const [src, setSrc] = useState(image.src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(image.src);
    setFailed(false);
  }, [image.src]);

  const tone = CATEGORY_TONE[category];
  const isHero = variant === "hero";

  if (failed) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center bg-gradient-to-br",
          tone.gradient,
          isHero ? "aspect-[16/9] min-h-[11rem]" : "aspect-square",
          className,
        )}
      >
        <span
          className={cn(
            "member-web-display text-[clamp(3rem,12vw,5rem)] leading-none opacity-90",
            tone.icon,
          )}
          aria-hidden
        >
          {name.charAt(0)}
        </span>
        <span className="sr-only">{name}</span>
      </div>
    );
  }

  const containerClassName = cn(
    "relative overflow-hidden bg-[var(--m-wash)]",
    isHero ? "aspect-[16/9] min-h-[11rem]" : "aspect-square",
    className,
  );

  const imageClassName = cn(
    "absolute inset-0 h-full w-full object-cover object-[center_20%]",
    !isHero && "object-center",
  );

  const handleError = () => {
    if (src !== image.fallbackSrc) {
      setSrc(image.fallbackSrc);
      return;
    }
    setFailed(true);
  };

  if (isHero) {
    return (
      <ExploreImageLightbox
        previewSrc={src}
        fullSrc={image.src}
        alt={image.alt}
        title={name}
        source={image.source}
        className={containerClassName}
        previewClassName={imageClassName}
        onPreviewError={handleError}
        loading="eager"
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
