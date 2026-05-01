import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | SpeedCheck.DEV",
  description: "Get in touch with the SpeedCheck.DEV team.",
};

export default function ContactPage() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="glass-card p-8 md:p-12 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-[#38BDF8] opacity-10 blur-[100px] pointer-events-none" />
        
        <h1 className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-6">Contact Us</h1>
        
        <div className="text-[#94A3B8] leading-relaxed space-y-6">
          <p>
            Have a question, feedback, or found a bug? We would love to hear from you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-[rgba(148,163,184,0.05)] rounded-xl p-6 border border-[rgba(148,163,184,0.1)]">
              <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">General Inquiries</h3>
              <p className="text-sm mb-4">For general questions about our speed test or partnership opportunities.</p>
              <a href="mailto:contact@speedcheck.dev" className="text-[#38BDF8] hover:underline font-medium">contact@speedcheck.dev</a>
            </div>

            <div className="bg-[rgba(148,163,184,0.05)] rounded-xl p-6 border border-[rgba(148,163,184,0.1)]">
              <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">Technical Support</h3>
              <p className="text-sm mb-4">Experiencing issues with the speed test? Let our engineering team know.</p>
              <a href="mailto:support@speedcheck.dev" className="text-[#38BDF8] hover:underline font-medium">support@speedcheck.dev</a>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-[#F8FAFC] mt-8 mb-4">Frequently Asked Questions</h2>
          <p>
            Before reaching out, please check our <Link href="/documentation" className="text-[#38BDF8] hover:underline">Documentation</Link> and <Link href="/#how-it-works" className="text-[#38BDF8] hover:underline">How It Works</Link> sections to see if your question has already been answered.
          </p>
        </div>
      </div>
    </main>
  );
}
