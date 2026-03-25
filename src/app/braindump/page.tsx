export const dynamic = "force-dynamic";

import { getBraindumpEntries } from "@/lib/actions";
import { BraindumpEditor } from "@/components/braindump-editor";

export default async function BraindumpPage() {
  const entries = await getBraindumpEntries();

  return (
    <div className="relative min-h-svh">
      {/* Cloud sky background — full page */}
      <div className="fixed inset-0 -z-10">
        {/* Base sky */}
        <div className="absolute inset-0 bg-[#7B9CC4]" />
        {/* Subtle gradient — lighter center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_40%,#8DAED0,transparent)]" />
        {/* Cloud 1 — large left */}
        <div className="absolute left-[-5%] top-[25%] h-[25%] w-[30%] bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,rgba(255,255,255,0.85),rgba(255,255,255,0.4)_40%,transparent_70%)]" />
        {/* Cloud 2 — small top-left wisp */}
        <div className="absolute left-[12%] top-[5%] h-[12%] w-[15%] bg-[radial-gradient(ellipse_100%_80%_at_50%_50%,rgba(255,255,255,0.5),transparent_70%)]" />
        {/* Cloud 3 — medium top-right */}
        <div className="absolute right-[15%] top-[8%] h-[15%] w-[20%] bg-[radial-gradient(ellipse_100%_80%_at_50%_50%,rgba(255,255,255,0.6),transparent_65%)]" />
        {/* Cloud 4 — large right */}
        <div className="absolute right-[-8%] top-[15%] h-[22%] w-[25%] bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,rgba(255,255,255,0.8),rgba(255,255,255,0.3)_45%,transparent_70%)]" />
        {/* Cloud 5 — bottom center wisp */}
        <div className="absolute bottom-[30%] left-[40%] h-[10%] w-[25%] bg-[radial-gradient(ellipse_100%_60%_at_50%_50%,rgba(255,255,255,0.35),transparent_70%)]" />
        {/* Warm bottom glow */}
        <div className="absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-[#7B9CC4]/50 to-transparent" />
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
