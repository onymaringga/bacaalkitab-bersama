import { cn } from "@/lib/utils";

type IllustrationProps = {
  className?: string;
};

/** Buku terbuka bergaya 3D — untuk Beranda & Alkitab */
export function BibleBook3D({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("drop-shadow-xl", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="bb-cover-l" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.42 0.2 268)" />
          <stop offset="100%" stopColor="oklch(0.32 0.18 268)" />
        </linearGradient>
        <linearGradient id="bb-cover-r" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.48 0.19 268)" />
          <stop offset="100%" stopColor="oklch(0.38 0.17 268)" />
        </linearGradient>
        <linearGradient id="bb-page" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.99 0.005 268)" />
          <stop offset="100%" stopColor="oklch(0.94 0.02 268)" />
        </linearGradient>
        <linearGradient id="bb-spine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="oklch(0.28 0.16 268)" />
          <stop offset="100%" stopColor="oklch(0.34 0.18 268)" />
        </linearGradient>
        <filter id="bb-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Shadow base */}
      <ellipse cx="80" cy="128" rx="52" ry="8" fill="oklch(0.3 0.1 268 / 0.2)" />

      <g filter="url(#bb-shadow)">
        {/* Left cover */}
        <path
          d="M18 38 L18 108 Q18 118 28 118 L78 118 L78 28 Q68 24 48 24 Q28 24 18 38Z"
          fill="url(#bb-cover-l)"
        />
        {/* Right cover */}
        <path
          d="M142 38 L142 108 Q142 118 132 118 L82 118 L82 28 Q92 24 112 24 Q132 24 142 38Z"
          fill="url(#bb-cover-r)"
        />
        {/* Spine */}
        <rect x="76" y="24" width="8" height="96" rx="2" fill="url(#bb-spine)" />

        {/* Left pages */}
        <path
          d="M26 42 L26 112 Q26 114 30 114 L74 114 L74 34 Q58 32 26 42Z"
          fill="url(#bb-page)"
        />
        {/* Right pages */}
        <path
          d="M134 42 L134 112 Q134 114 130 114 L86 114 L86 34 Q102 32 134 42Z"
          fill="url(#bb-page)"
        />

        {/* Page lines left */}
        {[52, 62, 72, 82, 92, 102].map((y) => (
          <line
            key={`l-${y}`}
            x1="34"
            y1={y}
            x2="66"
            y2={y}
            stroke="oklch(0.82 0.03 268)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}
        {/* Page lines right */}
        {[52, 62, 72, 82, 92].map((y) => (
          <line
            key={`r-${y}`}
            x1="94"
            y1={y}
            x2="126"
            y2={y}
            stroke="oklch(0.82 0.03 268)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}

        {/* Cross emblem */}
        <circle cx="80" cy="68" r="14" fill="oklch(0.72 0.16 75 / 0.9)" />
        <path
          d="M80 58 L80 78 M73 65 L87 65"
          stroke="oklch(0.35 0.15 75)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Highlight */}
        <path
          d="M22 40 Q40 30 60 30"
          stroke="oklch(1 0 0 / 0.25)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
