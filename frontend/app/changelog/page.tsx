import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog | SpeedCheck.DEV",
  description: "Recent updates and release notes for SpeedCheck.DEV.",
};

export default function ChangelogPage() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="glass-card p-8 md:p-12 relative overflow-hidden">
        <h1 className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-6">Changelog</h1>
        
        <div className="text-[#94A3B8] leading-relaxed space-y-8">
          
          {/* Release Entry */}
          <div className="relative pl-6 border-l-2 border-[rgba(56,189,248,0.3)]">
            <div className="absolute w-3 h-3 bg-[#38BDF8] rounded-full -left-[7px] top-2 shadow-[0_0_10px_rgba(56,189,248,0.8)]"></div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-[#F8FAFC]">v1.0.0</h2>
              <span className="text-xs bg-[rgba(56,189,248,0.1)] text-[#38BDF8] px-2 py-1 rounded-full border border-[#38BDF8]/20">Latest</span>
            </div>
            <p className="text-sm opacity-80 mb-4">{new Date().toLocaleDateString()}</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Initial Release:</strong> Launched the core SpeedCheck.DEV platform.</li>
              <li><strong>Backend Engine:</strong> Deployed high-performance Go-based streaming servers.</li>
              <li><strong>Frontend Engine:</strong> Implemented Next.js 14 App Router with React 19.</li>
              <li><strong>Measurement:</strong> Added accurate Ping, Jitter, Download, and Upload metrics.</li>
              <li><strong>UI/UX:</strong> Introduced custom glassmorphism design and SVG animated speed meters.</li>
              <li><strong>Informational Pages:</strong> Added About, Contact, Docs, Terms, and Privacy pages to support user queries.</li>
            </ul>
          </div>

          {/* Previous Entries Placeholder */}
          <div className="relative pl-6 border-l-2 border-[rgba(148,163,184,0.1)]">
            <div className="absolute w-3 h-3 bg-[#94A3B8] rounded-full -left-[7px] top-2"></div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-[#94A3B8]">v0.9.0-beta</h2>
            </div>
            <p className="text-sm opacity-60 mb-4">Prior to launch</p>
            <ul className="list-disc pl-5 space-y-2 opacity-80">
              <li>Closed beta testing.</li>
              <li>Algorithm refinement for jitter and quality score calculations.</li>
              <li>Resolved crypto chunk allocation limit on frontend.</li>
            </ul>
          </div>

        </div>
      </div>
    </main>
  );
}
