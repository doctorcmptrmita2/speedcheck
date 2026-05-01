import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation | SpeedCheck.DEV",
  description: "Learn how the SpeedCheck.DEV speed test works and how to interpret the results.",
};

export default function DocumentationPage() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="glass-card p-8 md:p-12 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-[#38BDF8] opacity-10 blur-[100px] pointer-events-none" />
        
        <h1 className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-6">Documentation</h1>
        
        <div className="text-[#94A3B8] leading-relaxed space-y-6">
          <p>
            Welcome to the SpeedCheck.DEV documentation. Our tool is designed to be simple to use, but under the hood, we employ advanced measurement techniques to ensure you get the most accurate snapshot of your connection's capabilities.
          </p>

          <h2 className="text-xl font-semibold text-[#F8FAFC] mt-8 mb-4">The Measurement Process</h2>
          
          <div className="space-y-4">
            <div className="bg-[rgba(148,163,184,0.05)] rounded-xl p-6 border border-[rgba(148,163,184,0.1)]">
              <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">1. Latency & Jitter (Ping)</h3>
              <p className="text-sm">
                We send a rapid sequence of lightweight requests to our edge servers. By measuring the Round Trip Time (RTT), we calculate your base latency. <strong>Jitter</strong> is calculated by analyzing the variance between consecutive ping tests, providing an indicator of your connection's stability.
              </p>
            </div>

            <div className="bg-[rgba(148,163,184,0.05)] rounded-xl p-6 border border-[rgba(148,163,184,0.1)]">
              <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">2. Download Speed</h3>
              <p className="text-sm">
                The download test streams randomly generated binary data from our servers directly into your browser's memory. We utilize the <code>ReadableStream</code> API to track bytes received in real-time, calculating the megabits per second (Mbps) over a fixed duration (usually 8-10 seconds).
              </p>
            </div>

            <div className="bg-[rgba(148,163,184,0.05)] rounded-xl p-6 border border-[rgba(148,163,184,0.1)]">
              <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">3. Upload Speed</h3>
              <p className="text-sm">
                To test upload capacity, your browser generates an array of randomized data using <code>crypto.getRandomValues()</code> and sends multiple simultaneous POST requests to our servers. The backend immediately discards the payload to preserve privacy and reduce server load, returning only the number of bytes successfully received.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-[#F8FAFC] mt-8 mb-4">Quality Score Algorithm</h2>
          <p>
            Your connection receives a final score between 0 and 100. This score is heavily weighted towards download speed (max 35 points) and upload speed (max 25 points), with latency and jitter accounting for the remaining 40 points. A score above 90 indicates an exceptional connection suitable for competitive gaming and 4K streaming.
          </p>
        </div>
      </div>
    </main>
  );
}
