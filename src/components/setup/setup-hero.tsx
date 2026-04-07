"use client";

import { ChevronDown } from "lucide-react";

export function SetupHero({ theme }: { theme: "dark" | "light" }) {
  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center px-4 text-center">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--s-hero-from)] via-[var(--s-hero-via)] to-[var(--s-hero-to)]" />
      {theme === "dark" && (
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(168,85,247,0.18),transparent)]" />
      )}
      {theme === "light" && (
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(168,85,247,0.08),transparent)]" />
      )}

      {/* Content */}
      <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[var(--s-text-dim)]">
        Build to Learn
      </p>
      <h1 className="mb-4 bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
        Setup Guide
      </h1>
      <p className="mb-6 max-w-lg text-base text-[var(--s-text-muted)] sm:text-lg">
        Claude Code is an AI that builds alongside you in the terminal.
        You describe what you want, it writes the code.
      </p>

      <p className="mb-10 max-w-md text-sm leading-relaxed text-[var(--s-text-dim)]">
        The terminal is a text-based interface — you type commands instead of
        clicking buttons. This guide walks through every step from first
        launch to first prototype.
      </p>

      {/* Skip / Begin */}
      <p className="mb-5 text-sm text-[var(--s-text-muted)]">
        Already have Claude in your terminal?{" "}
        <button
          onClick={() => scrollTo("step-4")}
          className="text-[var(--s-accent)] underline decoration-[var(--s-accent)]/30 underline-offset-2 hover:decoration-[var(--s-accent)]"
        >
          Skip ahead
        </button>{" "}
        or{" "}
        <button
          onClick={() => scrollTo("step-1")}
          className="text-[var(--s-accent)] underline decoration-[var(--s-accent)]/30 underline-offset-2 hover:decoration-[var(--s-accent)]"
        >
          begin setup
        </button>
        .
      </p>

      <button
        onClick={() => scrollTo("step-1")}
        className="rounded-full bg-gradient-to-r from-purple-500 to-orange-500 px-7 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Begin Setup
      </button>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 animate-bounce text-[var(--s-text-dim)]">
        <ChevronDown className="h-5 w-5" />
      </div>
    </section>
  );
}
