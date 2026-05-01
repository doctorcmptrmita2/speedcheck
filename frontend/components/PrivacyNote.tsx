export default function PrivacyNote() {
  const points = [
    { icon: "🔒", text: "No account or signup required" },
    { icon: "📦", text: "No installation — runs entirely in your browser" },
    { icon: "🗑️", text: "No personal test history stored in the MVP version" },
    { icon: "🚫", text: "Uploaded data is immediately discarded by the server" },
    { icon: "👤", text: "We do not collect names, emails, or user profiles" },
  ];

  return (
    <section id="privacy" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 pb-20">
      <div className="section-divider mb-12" />
      <div className="glass-card p-6 sm:p-8 flex flex-col sm:flex-row gap-8 items-start">
        <div className="flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(56,189,248,0.1)]">
            <svg className="h-6 w-6 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-[#F8FAFC]">Privacy-Friendly Speed Testing</h2>
          <p className="mt-2 text-sm text-[#94A3B8] leading-relaxed">
            SpeedCheck.DEV runs a temporary browser-based speed test. We do not require signup and we do not store personal test history in the MVP version.
          </p>
          <ul className="mt-5 flex flex-col gap-2.5">
            {points.map((p) => (
              <li key={p.text} className="flex items-center gap-3 text-sm text-[#CBD5E1]">
                <span className="text-base">{p.icon}</span>
                {p.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
