import { cn } from "@/lib/utils";

type ProgressRingProps = {
  value: number;
  label?: string;
  size?: number;
  className?: string;
};

export function ProgressRing({
  value,
  label,
  size = 64,
  className,
}: ProgressRingProps) {
  const stroke = size >= 100 ? 8 : 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className="stroke-muted"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className="stroke-primary transition-all duration-700"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              "font-bold leading-none text-foreground",
              size >= 100 ? "text-2xl" : "text-base",
            )}
          >
            {value}%
          </span>
        </div>
      </div>
      {label ? (
        <p className="max-w-[72px] text-center text-[10px] font-semibold leading-tight text-muted-foreground">
          {label}
        </p>
      ) : null}
    </div>
  );
}
