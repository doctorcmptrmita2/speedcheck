import type { TestPhase } from "@/lib/types";

interface ProgressStepsProps {
  phase: TestPhase;
}

const steps = [
  { id: "testing_ping", label: "Ping & Jitter", icon: "📡" },
  { id: "testing_download", label: "Download", icon: "⬇️" },
  { id: "testing_upload", label: "Upload", icon: "⬆️" },
  { id: "calculating", label: "Calculating", icon: "⚡" },
] as const;

const phaseOrder: TestPhase[] = [
  "testing_ping",
  "testing_download",
  "testing_upload",
  "calculating",
  "completed",
];

export default function ProgressSteps({ phase }: ProgressStepsProps) {
  const currentIndex = phaseOrder.indexOf(phase);

  return (
    <div
      className="flex items-center justify-center gap-0"
      role="progressbar"
      aria-label="Speed test progress"
      aria-valuenow={currentIndex}
      aria-valuemax={phaseOrder.length - 1}
    >
      {steps.map((step, i) => {
        const stepIndex = phaseOrder.indexOf(step.id as TestPhase);
        const isDone = currentIndex > stepIndex;
        const isActive = phase === step.id;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 text-base transition-all duration-500"
                style={
                  isDone
                    ? {
                        borderColor: "#22C55E",
                        backgroundColor: "#22C55E20",
                        boxShadow: "0 0 10px rgba(34,197,94,0.3)",
                      }
                    : isActive
                    ? {
                        borderColor: "#38BDF8",
                        backgroundColor: "#38BDF820",
                        boxShadow: "0 0 10px rgba(56,189,248,0.4)",
                      }
                    : {
                        borderColor: "rgba(148,163,184,0.2)",
                        backgroundColor: "transparent",
                      }
                }
              >
                {isDone ? (
                  <svg className="h-4 w-4 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span
                    className={`text-xs transition-all duration-300 ${
                      isActive ? "animate-pulse" : "opacity-40"
                    }`}
                  >
                    {step.icon}
                  </span>
                )}
              </div>
              <span
                className="text-xs font-medium whitespace-nowrap transition-colors duration-300"
                style={{
                  color: isDone
                    ? "#22C55E"
                    : isActive
                    ? "#38BDF8"
                    : "#475569",
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className="h-0.5 w-8 mx-1 sm:w-12 mt-[-14px] rounded-full transition-all duration-700"
                style={{
                  backgroundColor:
                    currentIndex > stepIndex
                      ? "#22C55E"
                      : "rgba(148,163,184,0.15)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
