"use client";

import { useEffect, useMemo, useState } from "react";

import { getBookImage } from "@/lib/bible-book-images";
import { cn } from "@/lib/utils";

type BookThumbnailProps = {
  abbr: string;
  bookName: string;
  genre: string;
  variant?: "hero" | "thumb";
  className?: string;
};

export function BookThumbnail({
  abbr,
  bookName,
  genre,
  variant = "thumb",
  className,
}: BookThumbnailProps) {
  const image = useMemo(
    () => getBookImage(abbr, bookName, genre),
    [abbr, bookName, genre],
  );
  const [src, setSrc] = useState(image.src);
  const [failed, setFailed] = useState(false);
  const isHero = variant === "hero";

  useEffect(() => {
    setSrc(image.src);
    setFailed(false);
  }, [image.src]);

  if (failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-[var(--m-wash)] to-[var(--m-accent)]/10",
          isHero ? "aspect-[16/10] min-h-[11rem] sm:aspect-[21/9]" : "aspect-[16/10]",
          className,
        )}
      >
        <span className="px-3 text-center text-xs font-semibold text-[var(--m-ink-soft)]">
          {bookName}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[var(--m-wash)]",
        isHero ? "aspect-[16/10] min-h-[11rem] sm:aspect-[21/9]" : "aspect-[16/10]",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={image.alt}
        loading="lazy"
        className={cn(
          "absolute inset-0 size-full object-cover transition duration-300",
        )}
        onError={() => {
          if (src !== image.fallbackSrc) {
            setSrc(image.fallbackSrc);
            return;
          }
          setFailed(true);
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
      />
    </div>
  );
}
