"use client";

import Link from "next/link";
import { Sun, Moon } from "lucide-react";

const STEP_LABELS = [
  "cmux",
  "Node.js",
  "Workspace",
  "Install Claude",
  "Launch & CAM",
  "GitHub",
  "Skills & Sage",
  "New Project",
  "Workflow",
  "Voice",
  "Vercel",
  "Status Bar",
  "First Prototype",
];

interface SetupNavProps {
  currentStep: number;
  totalSteps: number;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export function SetupNav({ currentStep, totalSteps, theme, onToggleTheme }: SetupNavProps) {
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  function scrollToStep(step: number) {
    const el = document.getElementById(`step-${step}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[var(--s-card-border)] bg-[var(--s-nav-bg)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand */}
        <Link
          href="/"
          className="text-xs font-semibold tracking-tight text-[var(--s-text-muted)] transition-colors hover:text-[var(--s-text)]"
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
                        ? "bg-[var(--s-dot-past)]"
                        : "bg-[var(--s-dot-future)]"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right: Theme toggle + Step counter */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--s-card-border)] text-[var(--s-text-muted)] transition-colors hover:text-[var(--s-text)]"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
          <span className="text-xs tabular-nums text-[var(--s-text-dim)]">
            {currentStep > 0
              ? `Step ${currentStep} of ${totalSteps}`
              : `${totalSteps} Steps`}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 w-full bg-[var(--s-progress-bar-bg)]">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-orange-500 transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </nav>
  );
}
