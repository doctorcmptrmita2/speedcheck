import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Status | SpeedCheck.DEV",
  description: "Real-time system status and uptime for SpeedCheck.DEV services.",
};

export default function StatusPage() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="glass-card p-8 md:p-12 relative overflow-hidden">
        <h1 className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-6">System Status</h1>
        
        <div className="text-[#94A3B8] leading-relaxed space-y-8">
          
          <div className="flex items-center gap-3 bg-[rgba(34,197,94,0.1)] border border-green-500/20 rounded-xl p-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
            <span className="text-green-400 font-medium">All Systems Operational</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Service 1 */}
            <div className="bg-[rgba(148,163,184,0.05)] rounded-xl p-4 border border-[rgba(148,163,184,0.1)] flex justify-between items-center">
              <div>
                <h3 className="font-medium text-[#F8FAFC]">Frontend Servers</h3>
                <p className="text-xs opacity-80">Vercel Edge Network</p>
              </div>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-md">Operational</span>
            </div>

            {/* Service 2 */}
            <div className="bg-[rgba(148,163,184,0.05)] rounded-xl p-4 border border-[rgba(148,163,184,0.1)] flex justify-between items-center">
              <div>
                <h3 className="font-medium text-[#F8FAFC]">Testing Nodes (Go)</h3>
                <p className="text-xs opacity-80">Primary Measurement API</p>
              </div>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-md">Operational</span>
            </div>

            {/* Service 3 */}
            <div className="bg-[rgba(148,163,184,0.05)] rounded-xl p-4 border border-[rgba(148,163,184,0.1)] flex justify-between items-center">
              <div>
                <h3 className="font-medium text-[#F8FAFC]">Rate Limiting Service</h3>
                <p className="text-xs opacity-80">In-memory Store</p>
              </div>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-md">Operational</span>
            </div>
            
            {/* Service 4 */}
            <div className="bg-[rgba(148,163,184,0.05)] rounded-xl p-4 border border-[rgba(148,163,184,0.1)] flex justify-between items-center">
              <div>
                <h3 className="font-medium text-[#F8FAFC]">DNS Resolution</h3>
                <p className="text-xs opacity-80">Global Routing</p>
              </div>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-md">Operational</span>
            </div>

          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-[#F8FAFC] mb-4">Past Incidents</h2>
            <p className="text-sm italic opacity-80">No incidents reported in the last 30 days.</p>
          </div>

        </div>
      </div>
    </main>
  );
}
