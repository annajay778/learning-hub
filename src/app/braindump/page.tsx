export const dynamic = "force-dynamic";

import { getBraindumpEntries } from "@/lib/actions";
import { BraindumpEditor } from "@/components/braindump-editor";

export default async function BraindumpPage() {
  const entries = await getBraindumpEntries();

  return (
    <div className="relative min-h-svh">
      {/* Cloud sky background — full page */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Base sky — matched to Air.inc */}
        <div className="absolute inset-0 bg-[#7B9CC4]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_140%_70%_at_50%_35%,#8AAFD4,transparent)]" />

        {/* Clouds via inline SVGs — cumulus shapes with organic edges */}
        {/* Cloud 1 — large left cumulus */}
        <svg className="absolute left-[-3%] top-[20%] h-[180px] w-[300px] opacity-90" viewBox="0 0 300 180" fill="none">
          <ellipse cx="80" cy="120" rx="75" ry="50" fill="white" fillOpacity="0.9" />
          <ellipse cx="140" cy="100" rx="65" ry="55" fill="white" fillOpacity="0.95" />
          <ellipse cx="110" cy="80" rx="55" ry="50" fill="white" fillOpacity="0.9" />
          <ellipse cx="170" cy="115" rx="60" ry="45" fill="white" fillOpacity="0.85" />
          <ellipse cx="60" cy="105" rx="55" ry="40" fill="white" fillOpacity="0.8" />
          <ellipse cx="130" cy="130" rx="90" ry="35" fill="white" fillOpacity="0.7" />
        </svg>

        {/* Cloud 2 — small wisp, top left */}
        <svg className="absolute left-[22%] top-[4%] h-[70px] w-[160px] opacity-60" viewBox="0 0 160 70" fill="none">
          <ellipse cx="50" cy="40" rx="40" ry="22" fill="white" fillOpacity="0.8" />
          <ellipse cx="90" cy="35" rx="35" ry="20" fill="white" fillOpacity="0.7" />
          <ellipse cx="70" cy="30" rx="30" ry="18" fill="white" fillOpacity="0.75" />
          <ellipse cx="110" cy="38" rx="28" ry="16" fill="white" fillOpacity="0.5" />
        </svg>

        {/* Cloud 3 — medium cumulus, upper right */}
        <svg className="absolute right-[8%] top-[5%] h-[140px] w-[240px] opacity-80" viewBox="0 0 240 140" fill="none">
          <ellipse cx="100" cy="90" rx="60" ry="40" fill="white" fillOpacity="0.9" />
          <ellipse cx="140" cy="75" rx="50" ry="42" fill="white" fillOpacity="0.85" />
          <ellipse cx="80" cy="70" rx="45" ry="38" fill="white" fillOpacity="0.8" />
          <ellipse cx="120" cy="60" rx="40" ry="35" fill="white" fillOpacity="0.9" />
          <ellipse cx="160" cy="85" rx="45" ry="35" fill="white" fillOpacity="0.75" />
          <ellipse cx="110" cy="100" rx="70" ry="28" fill="white" fillOpacity="0.6" />
        </svg>

        {/* Cloud 4 — large cumulus, right side */}
        <svg className="absolute right-[-4%] top-[28%] h-[200px] w-[320px] opacity-85" viewBox="0 0 320 200" fill="none">
          <ellipse cx="160" cy="130" rx="80" ry="50" fill="white" fillOpacity="0.9" />
          <ellipse cx="120" cy="110" rx="65" ry="48" fill="white" fillOpacity="0.85" />
          <ellipse cx="200" cy="115" rx="60" ry="45" fill="white" fillOpacity="0.9" />
          <ellipse cx="150" cy="90" rx="55" ry="45" fill="white" fillOpacity="0.95" />
          <ellipse cx="100" cy="100" rx="50" ry="40" fill="white" fillOpacity="0.8" />
          <ellipse cx="180" cy="85" rx="45" ry="40" fill="white" fillOpacity="0.85" />
          <ellipse cx="150" cy="145" rx="100" ry="35" fill="white" fillOpacity="0.65" />
        </svg>

        {/* Cloud 5 — small wisp, lower center */}
        <svg className="absolute bottom-[32%] left-[38%] h-[60px] w-[200px] opacity-45" viewBox="0 0 200 60" fill="none">
          <ellipse cx="60" cy="35" rx="45" ry="18" fill="white" fillOpacity="0.7" />
          <ellipse cx="110" cy="30" rx="40" ry="16" fill="white" fillOpacity="0.6" />
          <ellipse cx="150" cy="33" rx="35" ry="14" fill="white" fillOpacity="0.5" />
        </svg>

        {/* Cloud 6 — tiny puff, mid left */}
        <svg className="absolute left-[5%] top-[58%] h-[80px] w-[130px] opacity-50" viewBox="0 0 130 80" fill="none">
          <ellipse cx="50" cy="50" rx="38" ry="24" fill="white" fillOpacity="0.8" />
          <ellipse cx="75" cy="40" rx="32" ry="22" fill="white" fillOpacity="0.7" />
          <ellipse cx="60" cy="35" rx="28" ry="20" fill="white" fillOpacity="0.75" />
        </svg>
      </div>

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
            Build to Learn
          </p>
          <h1 className="text-lg font-semibold text-white">
            Anna&apos;s Braindump
          </h1>
          <p className="mt-1 text-xs text-white/60">
            Quick thoughts, links, and ideas. Saves to Notion automatically.
          </p>
        </div>

        <BraindumpEditor entries={entries} />
      </main>
    </div>
  );
}
