import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | SpeedCheck.DEV",
  description: "Learn about SpeedCheck.DEV, the privacy-focused internet speed test tool.",
};

export default function AboutPage() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="glass-card p-8 md:p-12 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#38BDF8] opacity-10 blur-[100px] pointer-events-none" />
        
        <h1 className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-6">About SpeedCheck.DEV</h1>
        
        <div className="text-[#94A3B8] leading-relaxed space-y-6">
          <p>
            SpeedCheck.DEV was built with a singular mission: to provide the fastest, most accurate, and most privacy-focused internet speed test available online.
          </p>
          
          <h2 className="text-xl font-semibold text-[#F8FAFC] mt-8 mb-4">Why We Built This</h2>
          <p>
            The internet is full of speed test tools, but many of them are bloated with heavy ads, third-party trackers, and unnecessary features. Some even collect and sell your connection data. We wanted a tool that developers and everyday users could trust—one that loads instantly, measures accurately, and forgets about you the moment you close the tab.
          </p>

          <h2 className="text-xl font-semibold text-[#F8FAFC] mt-8 mb-4">Our Core Philosophy</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Privacy First:</strong> We do not store your IP address or your test results. Everything happens in your browser and is immediately discarded.</li>
            <li><strong>High Performance:</strong> Our Go-based backend ensures that the server does not become the bottleneck during your speed tests.</li>
            <li><strong>No Ads (Except Clean Placements):</strong> We keep our interface clean and modern, ensuring that any monetization does not interfere with the user experience.</li>
          </ul>

          <h2 className="text-xl font-semibold text-[#F8FAFC] mt-8 mb-4">Open & Independent</h2>
          <p>
            SpeedCheck.DEV operates independently. We are not affiliated with any ISP, meaning our results are entirely neutral and unbiased.
          </p>
        </div>
      </div>
    </main>
  );
}
