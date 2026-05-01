"use client";

import { useEffect, useRef } from "react";

interface SpeedMeterProps {
  value: number;
  maxValue?: number;
  label: string;
  unit?: string;
  isActive?: boolean;
}

export default function SpeedMeter({
  value,
  maxValue = 200,
  label,
  unit = "Mbps",
  isActive = false,
}: SpeedMeterProps) {
  const displayRef = useRef<HTMLSpanElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const currentDisplayRef = useRef(0);

  // Smoothly animate the displayed number
  useEffect(() => {
    const target = value;

    const animate = () => {
      const diff = target - currentDisplayRef.current;
      if (Math.abs(diff) < 0.1) {
        currentDisplayRef.current = target;
      } else {
        currentDisplayRef.current += diff * 0.12;
      }

      if (displayRef.current) {
        displayRef.current.textContent = currentDisplayRef.current.toFixed(1);
      }

      if (Math.abs(target - currentDisplayRef.current) > 0.05) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [value]);

  // SVG arc math
  const size = 280;
  const cx = size / 2;
  const cy = size / 2 + 20;
  const radius = 110;
  const startAngle = -220;
  const endAngle = 40;
  const totalArc = endAngle - startAngle;

  const clampedValue = Math.min(value, maxValue);
  const fraction = clampedValue / maxValue;
  const fillAngle = startAngle + totalArc * fraction;

  function polarToCartesian(angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  }

  function describeArc(from: number, to: number) {
    const s = polarToCartesian(from);
    const e = polarToCartesian(to);
    const largeArc = to - from > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  }

  // Tick marks
  const ticks = Array.from({ length: 11 }, (_, i) => i / 10);

  // Color based on speed
  const accentColor =
    value === 0
      ? "#334155"
      : fraction > 0.7
      ? "#22C55E"
      : fraction > 0.35
      ? "#38BDF8"
      : "#FACC15";

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative" style={{ width: size, height: size * 0.75 }}>
        <svg
          width={size}
          height={size * 0.75}
          viewBox={`0 0 ${size} ${size * 0.75}`}
          aria-label={`Speed meter showing ${value} ${unit}`}
          role="img"
        >
          {/* Background track */}
          <path
            d={describeArc(startAngle, endAngle)}
            fill="none"
            stroke="#1E293B"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Colored fill arc */}
          {value > 0 && (
            <path
              d={describeArc(startAngle, fillAngle)}
              fill="none"
              stroke={accentColor}
              strokeWidth="14"
              strokeLinecap="round"
              style={{
                filter: `drop-shadow(0 0 8px ${accentColor}80)`,
                transition: "d 0.1s ease-out",
              }}
            />
          )}

          {/* Tick marks */}
          {ticks.map((t, i) => {
            const angle = startAngle + totalArc * t;
            const inner = polarToCartesian(angle);
            const outerR = radius + (i % 5 === 0 ? 14 : 8);
            const outerPt = (() => {
              const rad = ((angle - 90) * Math.PI) / 180;
              return {
                x: cx + outerR * Math.cos(rad),
                y: cy + outerR * Math.sin(rad),
              };
            })();
            return (
              <line
                key={i}
                x1={inner.x}
                y1={inner.y}
                x2={outerPt.x}
                y2={outerPt.y}
                stroke={i % 5 === 0 ? "#475569" : "#334155"}
                strokeWidth={i % 5 === 0 ? 2 : 1}
              />
            );
          })}

          {/* Speed labels */}
          {[0, 50, 100, 150, 200].map((spd) => {
            const t = spd / maxValue;
            const angle = startAngle + totalArc * t;
            const rad = ((angle - 90) * Math.PI) / 180;
            const labelR = radius + 28;
            const lx = cx + labelR * Math.cos(rad);
            const ly = cy + labelR * Math.sin(rad);
            return (
              <text
                key={spd}
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fill="#475569"
                fontFamily="Inter, sans-serif"
              >
                {spd}
              </text>
            );
          })}
        </svg>

        {/* Center display */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-end pb-8"
          aria-live="polite"
          aria-atomic="true"
        >
          <span
            ref={displayRef}
            className="text-5xl font-bold tabular-nums leading-none"
            style={{ color: value === 0 ? "#334155" : accentColor }}
          >
            0.0
          </span>
          <span className="mt-1 text-sm font-medium text-[#94A3B8]">{unit}</span>
        </div>

        {/* Active pulse ring */}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="h-6 w-6 rounded-full border-2 border-[#38BDF8] opacity-60 pulse-ring"
              style={{ position: "absolute", bottom: "14%", left: "50%", transform: "translateX(-50%)" }}
            />
          </div>
        )}
      </div>

      {/* Phase label */}
      <p className="mt-2 text-center text-sm font-medium text-[#94A3B8] h-5">
        {label}
      </p>
    </div>
  );
}
