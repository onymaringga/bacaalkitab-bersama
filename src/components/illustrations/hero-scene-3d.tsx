import { cn } from "@/lib/utils";

type IllustrationProps = {
  className?: string;
};

/** Hero landing — buku + cahaya */
export function HeroScene3D({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("mx-auto drop-shadow-2xl", className)}
      aria-hidden
    >
      <defs>
        <radialGradient id="hs-glow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="oklch(0.72 0.16 75 / 0.5)" />
          <stop offset="100%" stopColor="oklch(0.72 0.16 75 / 0)" />
        </radialGradient>
        <linearGradient id="hs-book-l" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.44 0.2 268)" />
          <stop offset="100%" stopColor="oklch(0.34 0.18 268)" />
        </linearGradient>
        <linearGradient id="hs-book-r" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.5 0.19 268)" />
          <stop offset="100%" stopColor="oklch(0.4 0.17 268)" />
        </linearGradient>
        <linearGradient id="hs-page" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(1 0 0)" />
          <stop offset="100%" stopColor="oklch(0.96 0.01 268)" />
        </linearGradient>
        <filter id="hs-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="12" stdDeviation="12" floodOpacity="0.28" />
        </filter>
      </defs>

      <circle cx="120" cy="90" r="80" fill="url(#hs-glow)" />

      {/* Floating particles */}
      {[
        [40, 50, 4],
        [190, 60, 3],
        [170, 130, 5],
        [50, 140, 3],
        [200, 100, 4],
      ].map(([cx, cy, r], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="oklch(0.72 0.16 75 / 0.6)"
        />
      ))}

      <ellipse cx="120" cy="178" rx="70" ry="10" fill="oklch(0.3 0.1 268 / 0.18)" />

      <g filter="url(#hs-shadow)" transform="translate(0, 10)">
        <path
          d="M50 70 L50 150 Q50 162 62 162 L118 162 L118 58 Q100 52 74 52 Q58 52 50 70Z"
          fill="url(#hs-book-l)"
        />
        <path
          d="M190 70 L190 150 Q190 162 178 162 L122 162 L122 58 Q140 52 166 52 Q182 52 190 70Z"
          fill="url(#hs-book-r)"
        />
        <rect x="116" y="52" width="10" height="112" rx="2" fill="oklch(0.3 0.16 268)" />

        <path d="M58 76 L58 154 L114 154 L114 64 Q90 62 58 76Z" fill="url(#hs-page)" />
        <path d="M182 76 L182 154 L126 154 L126 64 Q150 62 182 76Z" fill="url(#hs-page)" />

        {[88, 100, 112, 124, 136].map((y) => (
          <g key={y}>
            <line x1="68" y1={y} x2="104" y2={y} stroke="oklch(0.85 0.03 268)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="136" y1={y} x2="172" y2={y} stroke="oklch(0.85 0.03 268)" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ))}

        <circle cx="120" cy="108" r="18" fill="oklch(0.72 0.16 75)" />
        <path
          d="M120 94 L120 122 M108 108 L132 108"
          stroke="oklch(0.35 0.14 75)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
