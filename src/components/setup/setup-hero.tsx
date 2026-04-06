"use client";

import { ChevronDown } from "lucide-react";

export function SetupHero() {
  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center px-4 text-center">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#1a0533] via-[#2d1b69] to-[#4a1942]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(168,85,247,0.18),transparent)]" />

      {/* Content */}
      <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-white/40">
        Build to Learn
      </p>
      <h1 className="mb-4 bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
        Setup Guide
      </h1>
      <p className="mb-6 max-w-lg text-base text-white/50 sm:text-lg">
        Everything you need to start building with Claude Code — from zero to
        your first working prototype.
      </p>

      {/* Normalizing the terminal */}
      <p className="mb-10 max-w-md text-sm leading-relaxed text-white/40">
        If you&apos;ve never opened a terminal before, you&apos;re in good
        company. It&apos;s just a text box where you type instead of click.
        Claude Code lives there — you talk to it in plain English, and it
        does the technical work.
      </p>

      {/* Skip / Begin */}
      <p className="mb-5 text-sm text-white/50">
        Already have Claude in your terminal?{" "}
        <button
          onClick={() => scrollTo("step-5")}
          className="text-purple-400 underline decoration-purple-400/30 underline-offset-2 hover:decoration-purple-400"
        >
          Skip ahead
        </button>{" "}
        or{" "}
        <button
          onClick={() => scrollTo("step-1")}
          className="text-purple-400 underline decoration-purple-400/30 underline-offset-2 hover:decoration-purple-400"
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
      <div className="absolute bottom-8 animate-bounce text-white/20">
        <ChevronDown className="h-5 w-5" />
      </div>
    </section>
  );
}
