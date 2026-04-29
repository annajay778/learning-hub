"use client";

import React from "react";
import { interpolate, spring } from "remotion";
import { useFps, useFrame } from "./frame";
import type { Theme } from "../themes";

// Frame-aware fade/slide-up. f0 is when it starts.
export function FadeUp({
  children,
  delay = 0,
  distance = 24,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  style?: React.CSSProperties;
}) {
  const frame = useFrame();
  const fps = useFps();
  const f = Math.max(0, frame - delay);
  const opacity = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const ty = spring({ frame: f, fps, config: { damping: 200, stiffness: 120 } });
  const translateY = interpolate(ty, [0, 1], [distance, 0]);
  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)`, ...style }}>
      {children}
    </div>
  );
}

// A horizontal rule that draws in.
export function Rule({
  theme,
  delay = 0,
  thickness = 1,
  style,
}: {
  theme: Theme;
  delay?: number;
  thickness?: number;
  style?: React.CSSProperties;
}) {
  const frame = useFrame();
  const f = Math.max(0, frame - delay);
  const w = interpolate(f, [0, 30], [0, 100], { extrapolateRight: "clamp" });
  if (theme.ruleStyle === "ascii") {
    const total = 80;
    const filled = Math.round((w / 100) * total);
    return (
      <div
        style={{
          fontFamily: theme.fontMono,
          color: theme.rule,
          letterSpacing: "0.05em",
          fontSize: 18,
          ...style,
        }}
      >
        {"─".repeat(filled)}
      </div>
    );
  }
  return (
    <div
      style={{
        height: thickness,
        width: `${w}%`,
        background: theme.rule,
        ...style,
      }}
    />
  );
}

// Section label / kicker
export function Kicker({
  theme,
  children,
  delay = 0,
}: {
  theme: Theme;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <FadeUp delay={delay}>
      <div
        style={{
          fontFamily: theme.fontMono,
          fontSize: 16,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: theme.accent,
          fontWeight: 500,
        }}
      >
        {children}
      </div>
    </FadeUp>
  );
}

// Big title
export function Title({
  theme,
  children,
  size = 96,
  style,
  delay = 0,
}: {
  theme: Theme;
  children: React.ReactNode;
  size?: number;
  style?: React.CSSProperties;
  delay?: number;
}) {
  return (
    <FadeUp delay={delay}>
      <h1
        style={{
          fontFamily: theme.fontHeading,
          fontSize: size,
          fontWeight: theme.headingWeight,
          letterSpacing: theme.headingTracking,
          lineHeight: 1.02,
          color: theme.fg,
          margin: 0,
          ...style,
        }}
      >
        {children}
      </h1>
    </FadeUp>
  );
}

export function Body({
  theme,
  children,
  size = 32,
  delay = 0,
  muted = false,
  style,
}: {
  theme: Theme;
  children: React.ReactNode;
  size?: number;
  delay?: number;
  muted?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <FadeUp delay={delay}>
      <p
        style={{
          fontFamily: theme.fontBody,
          fontSize: size,
          fontWeight: theme.bodyWeight,
          lineHeight: 1.35,
          color: muted ? theme.fgMuted : theme.fg,
          margin: 0,
          ...style,
        }}
      >
        {children}
      </p>
    </FadeUp>
  );
}

// A slide-level container — handles padding, bg, and maintains a stable layout.
export function SlideFrame({
  theme,
  children,
  pad = 96,
  align = "stretch",
}: {
  theme: Theme;
  children: React.ReactNode;
  pad?: number;
  align?: "stretch" | "center";
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: theme.bg,
        color: theme.fg,
        padding: pad,
        display: "flex",
        flexDirection: "column",
        justifyContent: align === "center" ? "center" : "flex-start",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

// Slide chrome footer/header (optional).
export function SlideChrome({
  theme,
  slideNumber,
  total,
  section,
}: {
  theme: Theme;
  slideNumber: number;
  total: number;
  section?: string;
}) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 96,
          right: 96,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: theme.fontMono,
          fontSize: 13,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: theme.fgSubtle,
        }}
      >
        <span>Tech Town Hall · 2026-04-29</span>
        <span>{section ?? ""}</span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: 96,
          right: 96,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: theme.fontMono,
          fontSize: 13,
          letterSpacing: "0.14em",
          color: theme.fgSubtle,
        }}
      >
        <span>Spencer Mroczek + Anna</span>
        <span>
          {String(slideNumber).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
    </>
  );
}

// Animated counter
export function Counter({
  to,
  delay = 0,
  duration = 60,
  format = (v: number) => Math.round(v).toLocaleString(),
  theme,
  size = 200,
  style,
}: {
  to: number;
  delay?: number;
  duration?: number;
  format?: (v: number) => string;
  theme: Theme;
  size?: number;
  style?: React.CSSProperties;
}) {
  const frame = useFrame();
  const f = Math.max(0, frame - delay);
  const v = interpolate(f, [0, duration], [0, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        fontFamily: theme.fontHeading,
        fontSize: size,
        fontWeight: theme.headingWeight,
        letterSpacing: theme.headingTracking,
        lineHeight: 1,
        color: theme.fg,
        fontVariantNumeric: "tabular-nums",
        ...style,
      }}
    >
      {format(v)}
    </div>
  );
}
