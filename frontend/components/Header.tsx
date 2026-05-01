"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgba(148,163,184,0.1)] bg-[rgba(5,8,22,0.85)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.5)]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 text-[#050816]"
              aria-hidden="true"
            >
              <path
                d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                fill="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
            SpeedCheck<span className="text-[#38BDF8]">.DEV</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          <Link
            href="/"
            className="text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            Speed Test
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            About
          </Link>
          <Link
            href="/documentation"
            className="text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            Docs
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center justify-center rounded-lg p-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(148,163,184,0.1)] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav
          className="md:hidden border-t border-[rgba(148,163,184,0.1)] bg-[rgba(5,8,22,0.95)] px-4 py-4 flex flex-col gap-4"
          aria-label="Mobile navigation"
        >
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            Speed Test
          </Link>
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            About
          </Link>
          <Link
            href="/documentation"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            Docs
          </Link>
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            Contact
          </Link>
        </nav>
      )}
    </header>
  );
}
