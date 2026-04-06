"use client";

import Link from "next/link";

const STEP_LABELS = [
  "cmux",
  "Node.js",
  "Claude Code",
  "Workspace",
  "Workflow",
  "Skills",
  "MCP Servers",
  "Voice",
  "GitHub",
  "Vercel",
  "Neon + Drizzle",
  "Project Config",
];

interface SetupNavProps {
  currentStep: number;
  totalSteps: number;
}

export function SetupNav({ currentStep, totalSteps }: SetupNavProps) {
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  function scrollToStep(step: number) {
    const el = document.getElementById(`step-${step}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#0B1120]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand */}
        <Link
          href="/"
          className="text-xs font-semibold tracking-tight text-white/60 transition-colors hover:text-white/90"
        >
          Build to Learn
        </Link>

        {/* Center: Progress dots (desktop) */}
        <div className="hidden items-center gap-1.5 sm:flex">
          {STEP_LABELS.map((label, i) => {
            const step = i + 1;
            const isCurrent = step === currentStep;
            const isPast = step < currentStep;
            return (
              <button
                key={step}
                onClick={() => scrollToStep(step)}
                title={`${step}. ${label}`}
                className="group relative p-1"
              >
                <span
                  className={`block h-2 w-2 rounded-full transition-all ${
                    isCurrent
                      ? "scale-125 bg-gradient-to-br from-purple-400 to-orange-400"
                      : isPast
                        ? "bg-white/40"
                        : "bg-white/15"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right: Step counter */}
        <span className="text-xs tabular-nums text-white/40">
          {currentStep > 0
            ? `Step ${currentStep} of ${totalSteps}`
            : `${totalSteps} Steps`}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 w-full bg-white/[0.04]">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-orange-500 transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </nav>
  );
}
