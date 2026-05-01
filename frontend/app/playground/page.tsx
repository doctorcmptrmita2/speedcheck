import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playground | SpeedCheck.DEV",
  description: "Test advanced parameters for SpeedCheck.DEV.",
};

export default function PlaygroundPage() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="glass-card p-8 md:p-12 relative overflow-hidden">
        <h1 className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-6">Developer Playground</h1>
        
        <div className="text-[#94A3B8] leading-relaxed space-y-6">
          <div className="bg-[rgba(56,189,248,0.1)] border border-[#38BDF8]/30 rounded-xl p-4 text-[#38BDF8] mb-8">
            <p className="font-medium">Work in Progress</p>
            <p className="text-sm opacity-80 mt-1">
              The advanced playground features are currently in active development. Check back soon for API access and custom testing endpoints.
            </p>
          </div>

          <p>
            The Developer Playground will allow you to customize speed test parameters to diagnose specific network conditions.
          </p>

          <h2 className="text-xl font-semibold text-[#F8FAFC] mt-8 mb-4">Upcoming Features</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Custom Durations:</strong> Test stability over a long period (e.g., a 60-second download test).</li>
            <li><strong>Chunk Sizes:</strong> Modify the size of the upload and download chunks to observe how your router handles varying packet sizes.</li>
            <li><strong>Server Selection:</strong> Manually force the test to route through specific geographic edge locations.</li>
            <li><strong>API Access:</strong> Run headless speed tests via curl or your own applications using our public API endpoints.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
