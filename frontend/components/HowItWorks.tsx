export default function HowItWorks() {
  const steps = [
    {
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      ),
      color: "#38BDF8",
      title: "Ping Check",
      desc: "We send small requests to our server and measure how long the round-trip takes. Lower ping means faster response times — crucial for gaming and video calls.",
    },
    {
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      color: "#22C55E",
      title: "Download Speed",
      desc: "Your browser streams data from our server. We measure how many megabits arrive per second — this affects how fast pages load, videos buffer, and files download.",
    },
    {
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4 4l4-4m0 0l4 4m-4-4V4" />
        </svg>
      ),
      color: "#818CF8",
      title: "Upload Speed",
      desc: "Your browser sends data to our server. We measure how fast your connection can push data — important for video calls, cloud backups, and sharing files.",
    },
    {
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "#FACC15",
      title: "Jitter",
      desc: "Jitter measures how consistent your ping is between requests. High jitter means an unstable connection — even with decent ping, jitter causes choppy audio and video.",
    },
  ];

  return (
    <section id="how-it-works" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#F8FAFC]">How the Speed Test Works</h2>
        <p className="mt-3 text-[#94A3B8] max-w-xl mx-auto text-sm">
          Four measurements. One score. A clear picture of your connection quality.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.title} className="glass-card p-5 flex flex-col gap-3 hover:border-[rgba(56,189,248,0.2)] transition-all duration-300">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${s.color}20`, color: s.color }}
            >
              {s.icon}
            </div>
            <h3 className="font-semibold text-[#F8FAFC]">{s.title}</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
