export const dynamic = "force-dynamic";

import { getBraindumpEntries } from "@/lib/actions";
import { BraindumpEditor } from "@/components/braindump-editor";

export default async function BraindumpPage() {
  const entries = await getBraindumpEntries();

  return (
    <div className="relative min-h-svh">
      {/* Cloud sky background — full page */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Base sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#6A92BE] via-[#7FA8CD] to-[#92B8D8]" />

        {/* Cloud 1 — large cumulus, left side, built from overlapping puffs */}
        <div className="absolute left-[-2%] top-[18%] h-[200px] w-[350px]">
          <div className="absolute left-[10%] top-[30%] h-[120px] w-[180px] rounded-full bg-white/80 blur-[20px]" />
          <div className="absolute left-[25%] top-[10%] h-[140px] w-[160px] rounded-full bg-white/70 blur-[25px]" />
          <div className="absolute left-[0%] top-[40%] h-[100px] w-[150px] rounded-full bg-white/60 blur-[22px]" />
          <div className="absolute left-[40%] top-[25%] h-[110px] w-[140px] rounded-full bg-white/75 blur-[18px]" />
          <div className="absolute left-[15%] top-[20%] h-[130px] w-[200px] rounded-full bg-white/50 blur-[30px]" />
        </div>

        {/* Cloud 2 — wispy high cloud, top center-left */}
        <div className="absolute left-[20%] top-[5%] h-[80px] w-[200px]">
          <div className="absolute left-[0%] top-[20%] h-[50px] w-[120px] rounded-full bg-white/40 blur-[18px]" />
          <div className="absolute left-[30%] top-[10%] h-[40px] w-[100px] rounded-full bg-white/35 blur-[20px]" />
          <div className="absolute left-[50%] top-[30%] h-[35px] w-[80px] rounded-full bg-white/30 blur-[15px]" />
        </div>

        {/* Cloud 3 — medium cumulus, top right */}
        <div className="absolute right-[10%] top-[6%] h-[160px] w-[280px]">
          <div className="absolute left-[20%] top-[20%] h-[100px] w-[140px] rounded-full bg-white/65 blur-[22px]" />
          <div className="absolute left-[35%] top-[5%] h-[110px] w-[130px] rounded-full bg-white/60 blur-[20px]" />
          <div className="absolute left-[10%] top-[35%] h-[80px] w-[120px] rounded-full bg-white/50 blur-[25px]" />
          <div className="absolute left-[50%] top-[15%] h-[90px] w-[110px] rounded-full bg-white/55 blur-[18px]" />
        </div>

        {/* Cloud 4 — large cumulus, right edge */}
        <div className="absolute right-[-5%] top-[30%] h-[220px] w-[320px]">
          <div className="absolute left-[15%] top-[25%] h-[130px] w-[170px] rounded-full bg-white/75 blur-[22px]" />
          <div className="absolute left-[30%] top-[10%] h-[150px] w-[150px] rounded-full bg-white/65 blur-[28px]" />
          <div className="absolute left-[5%] top-[40%] h-[110px] w-[140px] rounded-full bg-white/55 blur-[24px]" />
          <div className="absolute left-[45%] top-[20%] h-[120px] w-[130px] rounded-full bg-white/70 blur-[20px]" />
          <div className="absolute left-[25%] top-[15%] h-[140px] w-[190px] rounded-full bg-white/45 blur-[32px]" />
        </div>

        {/* Cloud 5 — soft wisp, lower center */}
        <div className="absolute bottom-[35%] left-[35%] h-[70px] w-[250px]">
          <div className="absolute left-[10%] top-[10%] h-[45px] w-[130px] rounded-full bg-white/30 blur-[20px]" />
          <div className="absolute left-[35%] top-[20%] h-[40px] w-[100px] rounded-full bg-white/25 blur-[18px]" />
          <div className="absolute left-[55%] top-[5%] h-[35px] w-[90px] rounded-full bg-white/20 blur-[15px]" />
        </div>

        {/* Cloud 6 — small puff, mid-left */}
        <div className="absolute left-[8%] top-[55%] h-[90px] w-[150px]">
          <div className="absolute left-[10%] top-[15%] h-[60px] w-[90px] rounded-full bg-white/35 blur-[16px]" />
          <div className="absolute left-[30%] top-[5%] h-[55px] w-[80px] rounded-full bg-white/30 blur-[18px]" />
          <div className="absolute left-[20%] top-[25%] h-[50px] w-[100px] rounded-full bg-white/25 blur-[20px]" />
        </div>

        {/* Atmospheric haze — very subtle bottom lightening */}
        <div className="absolute inset-x-0 bottom-0 h-[25%] bg-gradient-to-t from-[#92B8D8]/40 to-transparent" />
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
