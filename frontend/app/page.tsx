import SpeedTestPanel from "@/components/SpeedTestPanel";
import HowItWorks from "@/components/HowItWorks";
import SpeedGuide from "@/components/SpeedGuide";
import PrivacyNote from "@/components/PrivacyNote";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        {/* Hero + Speed Test */}
        <section
          id="speed-test"
          className="relative w-full overflow-hidden"
          aria-label="Internet speed test"
        >
          {/* Background glow orbs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div
              className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-10"
              style={{
                background:
                  "radial-gradient(circle, #38BDF8 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute top-1/2 -left-32 h-[400px] w-[400px] -translate-y-1/2 rounded-full opacity-5"
              style={{
                background:
                  "radial-gradient(circle, #818CF8 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute top-1/2 -right-32 h-[400px] w-[400px] -translate-y-1/2 rounded-full opacity-5"
              style={{
                background:
                  "radial-gradient(circle, #22C55E 0%, transparent 70%)",
              }}
            />
          </div>

          <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
            {/* Hero copy */}
            <div className="flex flex-col items-center gap-4 text-center">
              {/* Badge */}
              <div className="flex items-center gap-2 rounded-full border border-[rgba(56,189,248,0.3)] bg-[rgba(56,189,248,0.08)] px-4 py-1.5 text-xs font-medium text-[#38BDF8]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                Free · No Signup · Browser-based
              </div>

              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#F8FAFC] sm:text-5xl lg:text-6xl">
                Test Your Internet{" "}
                <span className="gradient-text">Speed Instantly</span>
              </h1>

              <p className="max-w-xl text-base text-[#94A3B8] sm:text-lg">
                Measure your download speed, upload speed, ping, jitter, and
                connection quality in seconds.
              </p>
            </div>

            {/* Speed Test Panel */}
            <SpeedTestPanel />
          </div>
        </section>

        {/* Informational sections */}
        <HowItWorks />
        <SpeedGuide />
        <PrivacyNote />
      </main>
    </>
  );
}
