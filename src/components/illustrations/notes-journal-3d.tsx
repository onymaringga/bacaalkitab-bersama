import { cn } from "@/lib/utils";

type IllustrationProps = {
  className?: string;
};

/** Jurnal/catatan bergaya 3D */
export function NotesJournal3D({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("drop-shadow-xl", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="nj-cover" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.58 0.16 155)" />
          <stop offset="100%" stopColor="oklch(0.48 0.14 155)" />
        </linearGradient>
        <linearGradient id="nj-paper" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.99 0.005 155)" />
          <stop offset="100%" stopColor="oklch(0.95 0.02 155)" />
        </linearGradient>
        <filter id="nj-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.22" />
        </filter>
      </defs>

      <ellipse cx="62" cy="110" rx="38" ry="6" fill="oklch(0.3 0.1 155 / 0.15)" />

      <g filter="url(#nj-shadow)">
        {/* Back cover tilt */}
        <rect x="24" y="20" width="72" height="88" rx="6" fill="url(#nj-cover)" transform="rotate(-6 60 64)" />
        {/* Paper */}
        <rect x="28" y="16" width="68" height="84" rx="4" fill="url(#nj-paper)" />
        {/* Lines */}
        {[36, 48, 60, 72, 84].map((y) => (
          <line
            key={y}
            x1="38"
            y1={y}
            x2="86"
            y2={y}
            stroke="oklch(0.85 0.04 155)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}
        {/* Pen */}
        <rect x="78" y="8" width="8" height="52" rx="3" fill="oklch(0.42 0.2 268)" transform="rotate(24 82 34)" />
        <path d="M82 8 L86 4 L90 8" fill="oklch(0.72 0.16 75)" transform="rotate(24 82 34)" />
      </g>
    </svg>
  );
}
