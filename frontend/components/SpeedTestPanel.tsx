"use client";

import { useState, useCallback, useRef } from "react";
import type { TestPhase, SpeedTestResult } from "@/lib/types";
import { runFullSpeedTest } from "@/lib/speedtest";
import SpeedMeter from "./SpeedMeter";
import MetricCard from "./MetricCard";
import ProgressSteps from "./ProgressSteps";
import ResultSummary from "./ResultSummary";
import ErrorMessage from "./ErrorMessage";

const phaseLabel: Record<TestPhase, string> = {
  idle: "Ready",
  testing_ping: "Checking ping...",
  testing_download: "Measuring download...",
  testing_upload: "Measuring upload...",
  calculating: "Calculating quality...",
  completed: "Test complete",
  error: "Test failed",
};

export default function SpeedTestPanel() {
  const [phase, setPhase] = useState<TestPhase>("idle");
  const [liveSpeed, setLiveSpeed] = useState(0);
  const [livePing, setLivePing] = useState(0);
  const [result, setResult] = useState<SpeedTestResult | null>(null);
  const [error, setError] = useState<string>("");
  const abortRef = useRef(false);

  const isRunning =
    phase === "testing_ping" ||
    phase === "testing_download" ||
    phase === "testing_upload" ||
    phase === "calculating";

  const meterValue =
    phase === "testing_download" || phase === "testing_upload" ? liveSpeed : 0;

  const meterUnit =
    phase === "testing_ping" ? "ms" : "Mbps";

  const startTest = useCallback(async () => {
    setPhase("idle");
    setLiveSpeed(0);
    setLivePing(0);
    setResult(null);
    setError("");
    abortRef.current = false;

    await runFullSpeedTest({
      onPhaseChange: (p) => setPhase(p),
      onPingProgress: (ping) => setLivePing(ping),
      onDownloadProgress: (mbps) => setLiveSpeed(mbps),
      onUploadProgress: (mbps) => setLiveSpeed(mbps),
      onComplete: (res) => {
        setResult(res);
        setLiveSpeed(0);
      },
      onError: (msg) => {
        setError(msg);
        setLiveSpeed(0);
      },
    });
  }, []);

  const handleRetry = useCallback(() => {
    setPhase("idle");
    setError("");
    setResult(null);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-8">

      {/* Speed Meter */}
      <div className="glass-card w-full p-6 sm:p-10 flex flex-col items-center gap-6">

        {/* Progress steps — only during / after test */}
        {phase !== "idle" && phase !== "error" && (
          <ProgressSteps phase={phase} />
        )}

        {/* Meter */}
        <SpeedMeter
          value={
            phase === "testing_ping"
              ? livePing
              : meterValue
          }
          maxValue={
            phase === "testing_ping" ? 200 : 500
          }
          label={phaseLabel[phase]}
          unit={meterUnit}
          isActive={isRunning}
        />

        {/* Start / Running button */}
        {phase !== "error" && (
          <div className="flex flex-col items-center gap-3 w-full">
            <button
              id="start-speed-test"
              onClick={startTest}
              disabled={isRunning}
              aria-label={isRunning ? "Speed test in progress" : "Start speed test"}
              className="relative w-full max-w-xs rounded-2xl px-8 py-4 text-base font-bold text-[#050816] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:ring-offset-2 focus:ring-offset-[#0F172A]"
              style={{
                background: isRunning
                  ? "linear-gradient(135deg, #334155, #1E293B)"
                  : "linear-gradient(135deg, #38BDF8, #0EA5E9)",
                boxShadow: isRunning
                  ? "none"
                  : "0 0 30px rgba(56,189,248,0.4), 0 4px 15px rgba(56,189,248,0.2)",
                color: isRunning ? "#94A3B8" : "#050816",
                cursor: isRunning ? "not-allowed" : "pointer",
              }}
            >
              {isRunning ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {phaseLabel[phase]}
                </span>
              ) : phase === "completed" ? (
                "Run Again"
              ) : (
                "Start Speed Test"
              )}
            </button>

            {phase === "idle" && (
              <p className="text-xs text-[#475569] text-center">
                No signup. No installation. Just a fast browser-based speed test.
              </p>
            )}
          </div>
        )}

        {/* Error state */}
        {phase === "error" && (
          <ErrorMessage message={error} onRetry={handleRetry} />
        )}
      </div>

      {/* Metric Cards — always visible, populated after test */}
      <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard
          label="Download"
          value={result?.downloadMbps ?? 0}
          unit="Mbps"
          description="How fast your connection receives data."
          isReady={phase === "completed"}
          color="#22C55E"
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }
        />
        <MetricCard
          label="Upload"
          value={result?.uploadMbps ?? 0}
          unit="Mbps"
          description="How fast your connection sends data."
          isReady={phase === "completed"}
          color="#818CF8"
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m4 4l-4-4m0 0l-4 4m4-4V4" />
            </svg>
          }
        />
        <MetricCard
          label="Ping"
          value={result?.pingMs ?? 0}
          unit="ms"
          description="How quickly your device reaches our server."
          isReady={phase === "completed"}
          color="#38BDF8"
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          }
        />
        <MetricCard
          label="Jitter"
          value={result?.jitterMs ?? 0}
          unit="ms"
          description="How stable your latency is during the test."
          isReady={phase === "completed"}
          color="#FACC15"
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* Result summary */}
      {phase === "completed" && result && (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ResultSummary result={result} />
        </div>
      )}
    </div>
  );
}
