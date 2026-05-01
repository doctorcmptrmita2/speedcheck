interface MetricCardProps {
  label: string;
  value: number | string;
  unit: string;
  description: string;
  icon: React.ReactNode;
  color?: string;
  isReady?: boolean;
}

export default function MetricCard({
  label,
  value,
  unit,
  description,
  icon,
  color = "#38BDF8",
  isReady = false,
}: MetricCardProps) {
  const displayValue = isReady
    ? typeof value === "number"
      ? value.toFixed(value >= 10 ? 1 : 2)
      : value
    : "—";

  return (
    <div className="glass-card p-5 flex flex-col gap-3 hover:border-[rgba(56,189,248,0.3)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(56,189,248,0.05)]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {icon}
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
          {label}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-end gap-1.5">
        <span
          className="text-3xl font-bold tabular-nums leading-none transition-all duration-500"
          style={{ color: isReady ? color : "#334155" }}
          aria-label={`${label}: ${displayValue} ${unit}`}
        >
          {displayValue}
        </span>
        {isReady && (
          <span className="mb-0.5 text-sm font-medium text-[#94A3B8]">
            {unit}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-[#64748B] leading-relaxed">{description}</p>
    </div>
  );
}
