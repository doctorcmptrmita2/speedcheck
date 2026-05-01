import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[rgba(148,163,184,0.1)] bg-[#050816]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Top row */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#38BDF8]">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-[#050816]" aria-hidden="true">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
              </svg>
            </div>
            <span className="text-base font-bold text-[#F8FAFC]">
              SpeedCheck<span className="text-[#38BDF8]">.DEV</span>
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Footer navigation">
            <Link href="/privacy-policy" className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">Terms of Service</Link>
            <Link href="/changelog" className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">Changelog</Link>
            <Link href="/status" className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">Status</Link>
            <Link href="/playground" className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">Playground</Link>
          </nav>
        </div>

        {/* Divider */}
        <div className="section-divider my-6" />

        {/* Bottom row */}
        <div className="flex flex-col items-center gap-3 text-center md:flex-row md:justify-between">
          <p className="text-xs text-[#94A3B8]">
            © {year} SpeedCheck.DEV — Free public internet speed test.
          </p>
          <p className="text-xs text-[#94A3B8] max-w-md">
            SpeedCheck.DEV runs a temporary browser-based speed test. We do not
            require signup and we do not store personal test history.
          </p>
        </div>
      </div>
    </footer>
  );
}
