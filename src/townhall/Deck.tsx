"use client";

import React, { useCallback, useEffect, useState } from "react";
import { SLIDES } from "./slides/slides";
import { THEMES, THEME_ORDER, type ThemeId, type Theme } from "./themes";
import { FrameProvider } from "./components/frame";

const FPS = 30;
const FRAMES_PER_SLIDE = 180; // 6 seconds — covers all entry animations

const SLIDE_W = 1920;
const SLIDE_H = 1080;

export default function Deck() {
  const [themeId, setThemeId] = useState<ThemeId>("editorial");
  const [slideIndex, setSlideIndex] = useState(0);
  const total = SLIDES.length;
  const theme = THEMES[themeId];
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
      } else if (e.key === "1") {
        setThemeId("editorial");
      } else if (e.key === "2") {
        setThemeId("terminal");
      } else if (e.key === "3") {
        setThemeId("brand");
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

  // Replay animations on slide / theme change
  const playKey = `${themeId}-${slideIndex}`;

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
        themeId={themeId}
        onThemeChange={setThemeId}
      />
    </div>
  );
}

// Auto-scaling 16:9 stage. The slide content is laid out at 1920x1080 logical
// pixels and visually scaled to fit the viewport.
function SlideStage({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: Theme;
}) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    function onResize() {
      const padding = 24;
      const bottomBar = 56;
      const availW = window.innerWidth - padding * 2;
      const availH = window.innerHeight - padding * 2 - bottomBar;
      const s = Math.min(availW / SLIDE_W, availH / SLIDE_H);
      setScale(s);
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        paddingBottom: 24,
        background: "#08080A",
      }}
    >
      <div
        style={{
          width: SLIDE_W,
          height: SLIDE_H,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          flexShrink: 0,
          flexGrow: 0,
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          outline: `1px solid ${theme.rule}`,
          background: theme.bg,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ControlBar({
  theme,
  slideIndex,
  total,
  onPrev,
  onNext,
  onGoto,
  themeId,
  onThemeChange,
}: {
  theme: Theme;
  slideIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onGoto: (i: number) => void;
  themeId: ThemeId;
  onThemeChange: (t: ThemeId) => void;
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

      {/* Left: theme switcher */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#8B949E",
            paddingRight: 8,
          }}
        >
          Theme
        </span>
        {THEME_ORDER.map((id, i) => {
          const t = THEMES[id];
          const isActive = id === themeId;
          return (
            <button
              key={id}
              onClick={() => onThemeChange(id)}
              style={{
                appearance: "none",
                border: `1px solid ${isActive ? "#E6EDF3" : "rgba(255,255,255,0.16)"}`,
                background: isActive ? "#E6EDF3" : "transparent",
                color: isActive ? "#0B0E14" : "#E6EDF3",
                padding: "6px 12px",
                fontSize: 12,
                cursor: "pointer",
                letterSpacing: "0.06em",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
              title={t.tagline}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  background: t.accent,
                  border: `1px solid ${isActive ? "#0B0E14" : "rgba(255,255,255,0.3)"}`,
                }}
              />
              <span>{t.name}</span>
              <span style={{ opacity: 0.5, fontSize: 10 }}>({i + 1})</span>
            </button>
          );
        })}
      </div>

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
            ← / → · 1·2·3 themes · F fullscreen
          </span>
        ) : (
          <span>← → · 1 2 3 · F</span>
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
