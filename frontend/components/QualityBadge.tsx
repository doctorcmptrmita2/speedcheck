import type { ConnectionRating } from "@/lib/types";

interface QualityBadgeProps {
  rating: ConnectionRating;
  score: number;
}

const ratingConfig: Record<
  ConnectionRating,
  { color: string; bg: string; glow: string; label: string }
> = {
  Excellent: {
    color: "#22C55E",
    bg: "rgba(34,197,94,0.15)",
    glow: "rgba(34,197,94,0.4)",
    label: "Excellent",
  },
  Good: {
    color: "#38BDF8",
    bg: "rgba(56,189,248,0.15)",
    glow: "rgba(56,189,248,0.4)",
    label: "Good",
  },
  Fair: {
    color: "#FACC15",
    bg: "rgba(250,204,21,0.15)",
    glow: "rgba(250,204,21,0.4)",
    label: "Fair",
  },
  Poor: {
    color: "#EF4444",
    bg: "rgba(239,68,68,0.15)",
    glow: "rgba(239,68,68,0.4)",
    label: "Poor",
  },
};

export default function QualityBadge({ rating, score }: QualityBadgeProps) {
  const cfg = ratingConfig[rating];

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Score ring */}
      <div className="relative flex h-28 w-28 items-center justify-center">
        <svg className="absolute inset-0" viewBox="0 0 112 112" aria-hidden="true">
          {/* Background ring */}
          <circle
            cx="56"
            cy="56"
            r="48"
            fill="none"
            stroke="#1E293B"
            strokeWidth="8"
          />
          {/* Score arc */}
          <circle
            cx="56"
            cy="56"
            r="48"
            fill="none"
            stroke={cfg.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 48}`}
            strokeDashoffset={`${2 * Math.PI * 48 * (1 - score / 100)}`}
            transform="rotate(-90 56 56)"
            style={{
              filter: `drop-shadow(0 0 6px ${cfg.glow})`,
              transition: "stroke-dashoffset 1s ease-out",
            }}
          />
        </svg>
        <div className="relative z-10 flex flex-col items-center">
          <span
            className="text-3xl font-bold tabular-nums leading-none"
            style={{ color: cfg.color }}
            aria-label={`Quality score: ${score} out of 100`}
          >
            {score}
          </span>
          <span className="text-xs text-[#94A3B8]">/ 100</span>
        </div>
      </div>

      {/* Rating badge */}
      <div
        className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
        style={{
          backgroundColor: cfg.bg,
          color: cfg.color,
          border: `1px solid ${cfg.color}30`,
          boxShadow: `0 0 12px ${cfg.glow}20`,
        }}
        aria-label={`Connection rating: ${cfg.label}`}
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: cfg.color }}
        />
        {cfg.label}
      </div>
    </div>
  );
}
