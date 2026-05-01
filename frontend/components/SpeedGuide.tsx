export default function SpeedGuide() {
  const items = [
    { label: "25+ Mbps", desc: "Usually enough for HD streaming on one device", color: "#FACC15" },
    { label: "50+ Mbps", desc: "Comfortable for multiple devices streaming simultaneously", color: "#38BDF8" },
    { label: "100+ Mbps", desc: "Ideal for 4K streaming, remote work, and heavy usage", color: "#22C55E" },
    { label: "Low Ping", desc: "Below 20ms is excellent for gaming and real-time video calls", color: "#818CF8" },
    { label: "Low Jitter", desc: "Below 5ms ensures stable, smooth video and audio quality", color: "#C084FC" },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="section-divider mb-12" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-2xl font-bold text-[#F8FAFC]">What Is a Good Internet Speed?</h2>
          <p className="mt-3 text-sm text-[#94A3B8] leading-relaxed">
            Speed requirements vary depending on how you use the internet. Here's a quick reference guide.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div
                  className="mt-0.5 h-2 w-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}80` }}
                />
                <div>
                  <span className="text-sm font-semibold" style={{ color: item.color }}>{item.label}</span>
                  <span className="text-sm text-[#94A3B8]"> — {item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col gap-4">
          <h3 className="font-semibold text-[#F8FAFC]">Common Use Cases</h3>
          {[
            { use: "Video Streaming (HD)", down: "5+ Mbps", up: "—", ping: "Any" },
            { use: "Video Streaming (4K)", down: "25+ Mbps", up: "—", ping: "Any" },
            { use: "Video Calls", down: "3+ Mbps", up: "3+ Mbps", ping: "<100ms" },
            { use: "Online Gaming", down: "5+ Mbps", up: "2+ Mbps", ping: "<50ms" },
            { use: "Remote Work", down: "25+ Mbps", up: "10+ Mbps", ping: "<80ms" },
          ].map((row) => (
            <div key={row.use} className="flex items-center justify-between text-xs border-b border-[rgba(148,163,184,0.08)] pb-3 last:border-0 last:pb-0">
              <span className="text-[#CBD5E1] font-medium w-36">{row.use}</span>
              <span className="text-[#22C55E] w-20 text-center">↓ {row.down}</span>
              <span className="text-[#818CF8] w-20 text-center">↑ {row.up}</span>
              <span className="text-[#FACC15] w-16 text-right">{row.ping}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
