import type { SpeedTestResult } from "@/lib/types";
import QualityBadge from "./QualityBadge";

interface ResultSummaryProps {
  result: SpeedTestResult;
}

export default function ResultSummary({ result }: ResultSummaryProps) {
  return (
    <div className="glass-card p-6 sm:p-8 flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-lg font-semibold text-[#94A3B8]">Connection Quality</h2>
        <QualityBadge rating={result.rating} score={result.qualityScore} />
      </div>
      <div className="section-divider w-full" />
      <div className="w-full rounded-xl bg-[rgba(15,23,42,0.5)] p-4 border border-[rgba(148,163,184,0.1)]">
        <p className="text-center text-sm leading-relaxed text-[#CBD5E1]">
          {result.interpretation}
        </p>
      </div>
      <p className="text-xs text-[#475569] text-center">
        Run the test again for updated results.
      </p>
    </div>
  );
}
