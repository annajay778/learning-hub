"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { SLIDES } from "./slides/slides";
import { THEMES, type Theme } from "./themes";
import { FrameProvider } from "./components/frame";

const FPS = 30;
const FRAMES_PER_SLIDE = 180; // 6 seconds — covers all entry animations

const SLIDE_W = 1920;
const SLIDE_H = 1080;

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Deck() {
  const [slideIndex, setSlideIndex] = useState(0);
  const total = SLIDES.length;
  const theme = THEMES.brand;
  const Slide = SLIDES[slideIndex];

  const next = useCallback(() => {
    setSlideIndex((i) => Math.min(total - 1, i + 1));
  }, [total]);
  const prev = useCallback(() => {
    setSlideIndex((i) => Math.max(0, i - 1));
  }, []);
  const goto = useCallback((i: number) => {
    setSlideIndex(Math.max(0, Math.min(total - 1, i)));
  }, [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter" || e.key === "PageDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "Backspace" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        goto(0);
      } else if (e.key === "End") {
        goto(total - 1);
      } else if (e.key === "f" || e.key === "F") {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goto, total]);

  // Replay animations on slide change
  const playKey = `${slideIndex}`;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#08080A",
        color: "#E6EDF3",
        display: "flex",
        flexDirection: "column",
        fontFamily: '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
      }}
    >
      <SlideStage theme={theme}>
        <FrameProvider playKey={playKey} fps={FPS} durationInFrames={FRAMES_PER_SLIDE}>
          <Slide theme={theme} slideNumber={slideIndex + 1} total={total} />
        </FrameProvider>
      </SlideStage>

      <ControlBar
        theme={theme}
        slideIndex={slideIndex}
        total={total}
        onPrev={prev}
        onNext={next}
        onGoto={goto}
      />
    </div>
  );
}

// Auto-scaling 16:9 stage. Slide content is laid out at 1920x1080 and visually
// scaled to fit. Uses ResizeObserver on the container itself (not window), so
// it's correct regardless of viewport, browser zoom, or any layout shifts.
function SlideStage({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: Theme;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0);

  useIsoLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const padding = 24;
    function recalc(width: number, height: number) {
      const availW = Math.max(0, width - padding * 2);
      const availH = Math.max(0, height - padding * 2);
      if (availW === 0 || availH === 0) return;
      const s = Math.min(availW / SLIDE_W, availH / SLIDE_H);
      setScale(s);
    }
    // Initial measure
    const r = el.getBoundingClientRect();
    recalc(r.width, r.height);
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      recalc(cr.width, cr.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        position: "relative",
        background: "#08080A",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: SLIDE_W,
          height: SLIDE_H,
          marginLeft: -SLIDE_W / 2,
          marginTop: -SLIDE_H / 2,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          outline: `1px solid ${theme.rule}`,
          background: theme.bg,
          overflow: "hidden",
          opacity: scale > 0 ? 1 : 0,
        }}
      >
        {children}
        {theme.id === "brand" && <BrandBrackets accent={theme.accent} />}
      </div>
    </div>
  );
}

// The Campminder corner-bracket motif — diagonal pair (top-left + bottom-right).
// Per the brand kit: 3px stroke, ~8-12% of shorter edge, always purple.
function BrandBrackets({ accent }: { accent: string }) {
  const inset = 40;
  const armLen = 96;
  const stroke = 5;
  return (
    <>
      {/* Top-left */}
      <div
        style={{
          position: "absolute",
          top: inset,
          left: inset,
          width: armLen,
          height: armLen,
          borderTop: `${stroke}px solid ${accent}`,
          borderLeft: `${stroke}px solid ${accent}`,
          pointerEvents: "none",
        }}
      />
      {/* Bottom-right */}
      <div
        style={{
          position: "absolute",
          bottom: inset,
          right: inset,
          width: armLen,
          height: armLen,
          borderBottom: `${stroke}px solid ${accent}`,
          borderRight: `${stroke}px solid ${accent}`,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

function ControlBar({
  theme,
  slideIndex,
  total,
  onPrev,
  onNext,
  onGoto,
}: {
  theme: Theme;
  slideIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onGoto: (i: number) => void;
}) {
  const [hint, setHint] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setHint(false), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        height: 56,
        padding: "0 16px",
        background: "rgba(8,8,10,0.95)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        color: "#E6EDF3",
        fontFamily: '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
        fontSize: 12,
        position: "relative",
      }}
    >
      {/* Top progress bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            height: "100%",
            background: theme.accent,
            width: `${((slideIndex + 1) / total) * 100}%`,
            transition: "width 200ms ease",
          }}
        />
      </div>

      {/* Left: spacer (theme switcher removed) */}
      <div />

      {/* Middle: slide nav */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onPrev}
          disabled={slideIndex === 0}
          style={navBtn(slideIndex === 0)}
        >
          ← Prev
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <input
            type="number"
            min={1}
            max={total}
            value={slideIndex + 1}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              if (!isNaN(n)) onGoto(n - 1);
            }}
            style={{
              width: 50,
              background: "transparent",
              color: "#E6EDF3",
              border: "1px solid rgba(255,255,255,0.16)",
              padding: "6px 8px",
              fontFamily: "inherit",
              fontSize: 12,
              textAlign: "center",
            }}
          />
          <span style={{ color: "#8B949E" }}>/ {String(total).padStart(2, "0")}</span>
        </div>
        <button
          onClick={onNext}
          disabled={slideIndex === total - 1}
          style={navBtn(slideIndex === total - 1)}
        >
          Next →
        </button>
      </div>

      {/* Right: hints */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#8B949E" }}>
        {hint ? (
          <span style={{ color: theme.accent }}>
            ← / → navigate · F fullscreen
          </span>
        ) : (
          <span>← → · F</span>
        )}
      </div>
    </div>
  );
}

function navBtn(disabled: boolean): React.CSSProperties {
  return {
    appearance: "none",
    border: "1px solid rgba(255,255,255,0.16)",
    background: "transparent",
    color: disabled ? "rgba(230,237,243,0.3)" : "#E6EDF3",
    padding: "6px 14px",
    fontSize: 12,
    cursor: disabled ? "default" : "pointer",
    fontFamily: "inherit",
    letterSpacing: "0.06em",
  };
}
