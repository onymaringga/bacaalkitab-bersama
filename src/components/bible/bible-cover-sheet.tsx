"use client";

import { cn } from "@/lib/utils";
import {
  getBibleCoverColor,
  type BibleCoverPrefs,
} from "@/lib/bible-cover";

function CoverOrnament({
  imageId,
  customImageDataUrl,
  foil,
}: {
  imageId: BibleCoverPrefs["imageId"];
  customImageDataUrl?: string;
  foil: string;
}) {
  if (imageId === "custom" && customImageDataUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={customImageDataUrl}
        alt=""
        className="size-24 rounded-full object-cover sm:size-28"
        style={{ boxShadow: `0 0 0 2px ${foil}` }}
      />
    );
  }

  if (imageId === "none") return null;

  const common = {
    viewBox: "0 0 64 64",
    className: "size-16 sm:size-20",
    fill: "none",
    stroke: foil,
    strokeWidth: 1.6,
    "aria-hidden": true as const,
  };

  if (imageId === "cross") {
    return (
      <svg {...common}>
        <path d="M32 10v44M18 26h28" strokeLinecap="round" />
        <circle cx="32" cy="32" r="26" opacity="0.35" />
      </svg>
    );
  }

  if (imageId === "dove") {
    return (
      <svg {...common}>
        <path
          d="M12 34c8-2 14-10 18-18 2 8 8 14 18 16-8 4-14 10-16 20-4-8-10-14-20-18Z"
          strokeLinejoin="round"
        />
        <circle cx="44" cy="20" r="1.5" fill={foil} stroke="none" />
      </svg>
    );
  }

  if (imageId === "fish") {
    return (
      <svg {...common}>
        <path
          d="M10 32c10-12 34-12 44 0-10 12-34 12-44 0Z"
          strokeLinejoin="round"
        />
        <path d="M54 32l8-6v12l-8-6Z" strokeLinejoin="round" />
        <circle cx="20" cy="30" r="1.6" fill={foil} stroke="none" />
      </svg>
    );
  }

  // wheat
  return (
    <svg {...common}>
      <path d="M32 52V12" strokeLinecap="round" />
      <path d="M32 20c-6-2-10-6-10-10 4 2 8 4 10 8 2-4 6-6 10-8 0 4-4 8-10 10Z" />
      <path d="M32 30c-7-2-11-7-11-12 5 2 9 5 11 10 2-5 6-8 11-10 0 5-4 10-11 12Z" />
      <path d="M32 40c-7-2-12-7-12-13 5 3 9 6 12 11 3-5 7-8 12-11 0 6-5 11-12 13Z" />
    </svg>
  );
}

type BibleCoverSheetProps = {
  prefs: BibleCoverPrefs;
  className?: string;
  /** Tombol kecil di pojok (edit) */
  footerHint?: string;
};

export function BibleCoverSheet({
  prefs,
  className,
  footerHint = "Geser untuk membuka",
}: BibleCoverSheetProps) {
  const color = getBibleCoverColor(prefs.colorId);
  const edgeToEdge = className?.includes("rounded-none");

  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden",
        !edgeToEdge && "rounded-[0.45rem]",
        className,
      )}
      style={{
        background: `
          linear-gradient(125deg, ${color.base} 0%, ${color.deep} 55%, ${color.edge} 100%)
        `,
        boxShadow: edgeToEdge
          ? undefined
          : `
          0 22px 48px -18px rgba(0,0,0,0.55),
          inset 0 1px 0 rgba(255,255,255,0.12),
          inset -10px 0 24px rgba(0,0,0,0.25)
        `,
      }}
    >
      {/* Tekstur kulit */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {/* Kilau */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(115deg, rgba(255,255,255,0.14) 0%, transparent 38%, transparent 62%, rgba(0,0,0,0.18) 100%)`,
        }}
      />
      {/* Tepi emas tipis */}
      <div
        className="pointer-events-none absolute inset-3 rounded-[0.3rem] sm:inset-4"
        style={{ boxShadow: `inset 0 0 0 1.5px ${color.foil}55` }}
      />
      <div
        className="pointer-events-none absolute inset-5 rounded-[0.25rem] sm:inset-6"
        style={{ boxShadow: `inset 0 0 0 1px ${color.foil}33` }}
      />

      {/* Punggung buku kiri */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-4 sm:w-5"
        style={{
          background: `linear-gradient(90deg, ${color.edge}, ${color.deep} 70%, transparent)`,
        }}
      />

      <div className="relative z-[1] flex min-h-0 flex-1 flex-col items-center justify-between px-8 py-10 text-center sm:px-12 sm:py-12">
        <div className="w-full">
          <p
            className="text-[10px] font-semibold tracking-[0.28em] uppercase sm:text-[11px]"
            style={{ color: `${color.foil}cc` }}
          >
            Kitab Suci
          </p>
        </div>

        <div className="flex flex-col items-center gap-5 sm:gap-6">
          <CoverOrnament
            imageId={prefs.imageId}
            customImageDataUrl={prefs.customImageDataUrl}
            foil={color.foil}
          />
          <div className="space-y-2">
            <h2
              className="font-serif text-[clamp(1.75rem,5vw,2.65rem)] font-semibold leading-[1.15] tracking-tight"
              style={{ color: color.foil }}
            >
              {prefs.title.trim() || "Alkitab"}
            </h2>
            {prefs.subtitle.trim() ? (
              <p
                className="mx-auto max-w-[16rem] font-serif text-sm italic leading-relaxed sm:text-base"
                style={{ color: `${color.foil}d0` }}
              >
                {prefs.subtitle.trim()}
              </p>
            ) : null}
          </div>
        </div>

        <div className="w-full space-y-2">
          <div
            className="mx-auto h-px w-16"
            style={{ background: `${color.foil}66` }}
          />
          <p
            className="text-[11px] font-medium tracking-wide"
            style={{ color: `${color.foil}99` }}
          >
            {footerHint}
          </p>
        </div>
      </div>
    </article>
  );
}
