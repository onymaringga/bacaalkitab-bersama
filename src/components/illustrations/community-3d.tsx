import { cn } from "@/lib/utils";

type IllustrationProps = {
  className?: string;
};

/** Komunitas/kelompok bergaya 3D — untuk panel ketua */
export function Community3D({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("drop-shadow-lg", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="cm-body" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.75 0.14 75)" />
          <stop offset="100%" stopColor="oklch(0.62 0.12 75)" />
        </linearGradient>
        <linearGradient id="cm-body2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.88 0.06 268)" />
          <stop offset="100%" stopColor="oklch(0.78 0.08 268)" />
        </linearGradient>
        <linearGradient id="cm-body3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.7 0.16 155)" />
          <stop offset="100%" stopColor="oklch(0.55 0.14 155)" />
        </linearGradient>
        <filter id="cm-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.2" />
        </filter>
      </defs>

      <ellipse cx="60" cy="92" rx="40" ry="6" fill="oklch(0 0 0 / 0.12)" />

      <g filter="url(#cm-shadow)">
        {/* Center person (leader) */}
        <circle cx="60" cy="38" r="14" fill="url(#cm-body)" />
        <path
          d="M42 72 Q42 52 60 52 Q78 52 78 72 L78 88 L42 88Z"
          fill="url(#cm-body)"
        />
        {/* Crown */}
        <path
          d="M52 28 L56 22 L60 26 L64 22 L68 28 L68 32 L52 32Z"
          fill="oklch(0.72 0.16 75)"
        />

        {/* Left person */}
        <circle cx="28" cy="48" r="11" fill="url(#cm-body2)" />
        <path
          d="M14 78 Q14 62 28 62 Q42 62 42 78 L42 88 L14 88Z"
          fill="url(#cm-body2)"
        />

        {/* Right person */}
        <circle cx="92" cy="48" r="11" fill="url(#cm-body3)" />
        <path
          d="M78 78 Q78 62 92 62 Q106 62 106 78 L106 88 L78 88Z"
          fill="url(#cm-body3)"
        />
      </g>
    </svg>
  );
}
