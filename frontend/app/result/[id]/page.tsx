import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Define the shape of the telemetry result from the backend
interface TelemetryResult {
  id: string;
  download: number;
  upload: number;
  ping: number;
  jitter: number;
  quality: number;
  isp_info?: string;
  timestamp: string;
}

// Fetch the result from the backend API
async function getResult(id: string): Promise<TelemetryResult | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://backend:8080";
    const res = await fetch(`${apiUrl}/api/telemetry/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const result = await getResult(params.id);
  if (!result) return { title: "Result Not Found | SpeedCheck.DEV" };

  return {
    title: `Speed Test Result: ${result.download.toFixed(1)} Mbps | SpeedCheck.DEV`,
    description: `Download: ${result.download.toFixed(1)} Mbps, Upload: ${result.upload.toFixed(1)} Mbps, Ping: ${result.ping.toFixed(0)} ms. Test your speed on SpeedCheck.DEV!`,
  };
}

export default async function ResultPage({ params }: { params: { id: string } }) {
  const result = await getResult(params.id);

  if (!result) {
    notFound();
  }

  const date = new Date(result.timestamp).toLocaleString();

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="glass-card max-w-3xl w-full p-8 relative overflow-hidden text-center">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#38BDF8] rounded-full opacity-10 blur-[100px]" />
        
        <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">Speed Test Result</h1>
        <p className="text-[#94A3B8] mb-8">Tested on {date}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-[rgba(5,8,22,0.5)] p-4 rounded-xl border border-[rgba(148,163,184,0.1)]">
            <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-1">Download</p>
            <p className="text-2xl font-bold text-[#22C55E]">{result.download.toFixed(1)} <span className="text-sm font-normal">Mbps</span></p>
          </div>
          <div className="bg-[rgba(5,8,22,0.5)] p-4 rounded-xl border border-[rgba(148,163,184,0.1)]">
            <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-1">Upload</p>
            <p className="text-2xl font-bold text-[#818CF8]">{result.upload.toFixed(1)} <span className="text-sm font-normal">Mbps</span></p>
          </div>
          <div className="bg-[rgba(5,8,22,0.5)] p-4 rounded-xl border border-[rgba(148,163,184,0.1)]">
            <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-1">Ping</p>
            <p className="text-2xl font-bold text-[#38BDF8]">{result.ping.toFixed(1)} <span className="text-sm font-normal">ms</span></p>
          </div>
          <div className="bg-[rgba(5,8,22,0.5)] p-4 rounded-xl border border-[rgba(148,163,184,0.1)]">
            <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-1">Jitter</p>
            <p className="text-2xl font-bold text-[#F59E0B]">{result.jitter.toFixed(1)} <span className="text-sm font-normal">ms</span></p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary w-full sm:w-auto px-8 py-3 rounded-full font-bold">
            Run New Test
          </Link>
          <button 
            className="bg-[rgba(148,163,184,0.1)] hover:bg-[rgba(148,163,184,0.2)] text-[#F8FAFC] border border-[rgba(148,163,184,0.2)] w-full sm:w-auto px-8 py-3 rounded-full font-bold transition-all"
            // We use a small inline script or client component wrapper for sharing, but a simple mailto or copy works too.
          >
            Copy Link
          </button>
        </div>
      </div>
    </main>
  );
}
