"use client";
/* eslint-disable react/no-unescaped-entities */

import React from "react";
import { interpolate, spring } from "remotion";
import { useFrame } from "../components/frame";
import {
  Body,
  Counter,
  FadeUp,
  Kicker,
  Rule,
  SlideChrome,
  SlideFrame,
  Title,
} from "../components/primitives";
import type { Theme } from "../themes";

export type SlideProps = { theme: Theme; slideNumber: number; total: number };

// ============================================================================
// 01 — Title
// ============================================================================
export function Slide01({ theme, slideNumber, total }: SlideProps) {
  const frame = useFrame();
  return (
    <SlideFrame theme={theme} align="center">
      <SlideChrome theme={theme} slideNumber={slideNumber} total={total} />
      <div style={{ display: "flex", flexDirection: "column", gap: 36, paddingLeft: 0 }}>
        <Kicker theme={theme} delay={0}>
          Tech Town Hall · 2026-04-29
        </Kicker>
        <Rule theme={theme} delay={6} thickness={2} />
        <Title theme={theme} size={144} delay={10}>
          The{" "}
          <span style={{ color: theme.accent, fontStyle: theme.id === "editorial" ? "italic" : "normal" }}>
            Epic AI
          </span>
          <br />Experiment.
        </Title>
        <FadeUp delay={28}>
          <div
            style={{
              fontFamily: theme.fontMono,
              fontSize: 18,
              color: theme.fgMuted,
              letterSpacing: "0.05em",
              marginTop: 16,
            }}
          >
            Spencer Mroczek + Anna · CampCo
          </div>
        </FadeUp>
        {/* Subtle accent block, drawn in */}
        <div style={{ position: "absolute", right: 96, bottom: 120, width: 360 }}>
          <FadeUp delay={36}>
            <div
              style={{
                fontFamily: theme.fontMono,
                fontSize: 14,
                color: theme.fgSubtle,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              ~10 minutes
            </div>
            <div
              style={{
                height: 4,
                background: theme.accent,
                width: `${interpolate(frame, [36, 90], [0, 100], { extrapolateRight: "clamp" })}%`,
              }}
            />
          </FadeUp>
        </div>
      </div>
    </SlideFrame>
  );
}

// ============================================================================
// 02 — The plan vs. the reality
// ============================================================================
export function Slide02({ theme, slideNumber, total }: SlideProps) {
  return (
    <SlideFrame theme={theme}>
      <SlideChrome theme={theme} slideNumber={slideNumber} total={total} />
      <div style={{ marginTop: 96, display: "flex", flexDirection: "column", gap: 56 }}>
        <Kicker theme={theme}>Plan vs. reality</Kicker>

        <Row
          theme={theme}
          label="The plan"
          value={
            <>
              Spend six weeks{" "}
              <span style={{ color: theme.fgMuted }}>exploring</span> Claude.
              Maybe build something real later.
            </>
          }
          delay={6}
        />
        <Row
          theme={theme}
          label="What actually happened"
          value={
            <>
              By week 4 we&apos;d{" "}
              <span style={{ color: theme.accent, fontWeight: 700 }}>committed to ship</span> —
              and brought Jeremy on to help land it.
            </>
          }
          delay={22}
        />
      </div>

      <FadeUp delay={42} style={{ position: "absolute", left: 96, bottom: 110, right: 96 }}>
        <div
          style={{
            fontFamily: theme.fontMono,
            fontSize: 18,
            color: theme.fgMuted,
            letterSpacing: "0.04em",
          }}
        >
          ◆ AI Parent Handbook live with real parents. Smart Nudges in active eval.
        </div>
      </FadeUp>
    </SlideFrame>
  );
}

function Row({
  theme,
  label,
  value,
  delay,
}: {
  theme: Theme;
  label: string;
  value: React.ReactNode;
  delay: number;
}) {
  return (
    <FadeUp delay={delay}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: 48,
          alignItems: "baseline",
          paddingBottom: 28,
          borderBottom: `1px solid ${theme.rule}`,
        }}
      >
        <div
          style={{
            fontFamily: theme.fontMono,
            fontSize: 18,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: theme.fgSubtle,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: theme.fontHeading,
            fontSize: 52,
            fontWeight: theme.headingWeight,
            letterSpacing: theme.headingTracking,
            lineHeight: 1.15,
            color: theme.fg,
          }}
        >
          {value}
        </div>
      </div>
    </FadeUp>
  );
}

// ============================================================================
// 03 — Timeline
// ============================================================================
export function Slide03({ theme, slideNumber, total }: SlideProps) {
  const frame = useFrame();
  const weeks = [
    { w: "Week 1", e: "Kickoff. Parent Handbook lesson at the camp. RAG pilot." },
    { w: "Week 2", e: "First prototype in customer hands." },
    { w: "Week 3", e: "AI Lab: Smart Nudges feedback exposes the personalization problem." },
    { w: "Week 4", e: "Production push starts. Jeremy joins to help land it." },
    { w: "Week 5", e: "Evals + prompt registry online. Three LLM-as-judge graders running." },
    { w: "Week 6", e: "AI Parent Handbook live with real parents. Smart Nudges in eval.", flag: true },
  ];
  const lineProgress = interpolate(frame, [10, 80], [0, 1], { extrapolateRight: "clamp" });

  return (
    <SlideFrame theme={theme}>
      <SlideChrome theme={theme} slideNumber={slideNumber} total={total} />
      <div style={{ marginTop: 100, display: "flex", flexDirection: "column", gap: 32 }}>
        <Kicker theme={theme}>Six weeks</Kicker>
        <Title theme={theme} size={64} delay={4}>
          How it actually went.
        </Title>
      </div>

      {/* Timeline */}
      <div style={{ marginTop: 80, position: "relative" }}>
        {/* Track */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 28,
            height: 2,
            background: theme.rule,
          }}
        />
        {/* Filled track */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 28,
            height: 2,
            width: `${lineProgress * 100}%`,
            background: theme.accent,
          }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>
          {weeks.map((w, i) => {
            const dotIn = i / 6;
            const visible = lineProgress >= dotIn;
            const opacity = visible ? 1 : 0.25;
            return (
              <div key={i} style={{ position: "relative", paddingTop: 56 }}>
                <div
                  style={{
                    position: "absolute",
                    top: 18,
                    left: 0,
                    width: 22,
                    height: 22,
                    borderRadius: w.flag ? 0 : 999,
                    background: visible ? theme.accent : theme.rule,
                    border: w.flag ? `3px solid ${theme.accent}` : "none",
                    transform: w.flag ? "rotate(45deg)" : "none",
                  }}
                />
                <div
                  style={{
                    fontFamily: theme.fontMono,
                    fontSize: 16,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: w.flag ? theme.accent : theme.fgSubtle,
                    marginBottom: 12,
                    opacity,
                    fontWeight: w.flag ? 600 : 500,
                  }}
                >
                  {w.w}
                </div>
                <div
                  style={{
                    fontFamily: theme.fontBody,
                    fontSize: 18,
                    lineHeight: 1.35,
                    color: theme.fg,
                    opacity,
                  }}
                >
                  {w.e}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <FadeUp delay={70} style={{ position: "absolute", left: 96, bottom: 110, right: 96 }}>
        <div
          style={{
            fontFamily: theme.fontMono,
            fontSize: 16,
            color: theme.fgSubtle,
            letterSpacing: "0.06em",
          }}
        >
          ◆ Two products shipped — five days ahead of the expected prototype date.
        </div>
      </FadeUp>
    </SlideFrame>
  );
}

// ============================================================================
// 04 — Section 1 header
// ============================================================================
export function Slide04({ theme, slideNumber, total }: SlideProps) {
  return SectionHeader({
    theme,
    slideNumber,
    total,
    n: "01",
    title: "The workflow",
    subtitle: "What a PM and an engineer building with AI actually look like, day to day.",
  });
}

function SectionHeader({
  theme,
  slideNumber,
  total,
  n,
  title,
  subtitle,
}: {
  theme: Theme;
  slideNumber: number;
  total: number;
  n: string;
  title: string;
  subtitle: string;
}) {
  const frame = useFrame();
  const numScale = spring({ frame, fps: 30, config: { damping: 200 } });
  return (
    <SlideFrame theme={theme} align="center">
      <SlideChrome theme={theme} slideNumber={slideNumber} total={total} section={`Section ${n}`} />
      <div style={{ display: "flex", alignItems: "center", gap: 80 }}>
        <div
          style={{
            fontFamily: theme.fontHeading,
            fontSize: 360,
            fontWeight: theme.headingWeight,
            color: theme.accent,
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            opacity: interpolate(frame, [0, 14], [0, 1]),
            transform: `scale(${interpolate(numScale, [0, 1], [0.92, 1])})`,
            transformOrigin: "left center",
          }}
        >
          {n}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
          <Rule theme={theme} delay={4} thickness={2} />
          <Title theme={theme} size={88} delay={10}>
            {title}
          </Title>
          <Body theme={theme} size={28} delay={20} muted>
            {subtitle}
          </Body>
        </div>
      </div>
    </SlideFrame>
  );
}

// ============================================================================
// 05 — PM in the build loop (quote)
// ============================================================================
export function Slide05({ theme, slideNumber, total }: SlideProps) {
  return (
    <SlideFrame theme={theme} align="center">
      <SlideChrome theme={theme} slideNumber={slideNumber} total={total} />
      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        <Kicker theme={theme}>The shift</Kicker>
        <Title theme={theme} size={76} delay={6}>
          The PM is in the build loop.
        </Title>
        <FadeUp delay={20}>
          <Body theme={theme} size={32} muted>
            Anna writes prompts, runs Claude, ships prototypes — instead of writing specs and waiting on engineering.
          </Body>
        </FadeUp>

        <FadeUp delay={36}>
          <div
            style={{
              marginTop: 24,
              padding: "44px 56px",
              borderLeft: `4px solid ${theme.accent}`,
              background: theme.panel,
              fontFamily: theme.fontHeading,
              fontStyle: theme.id === "editorial" ? "italic" : "normal",
              fontSize: 42,
              fontWeight: theme.headingWeight,
              lineHeight: 1.25,
              color: theme.fg,
            }}
          >
            "I had it running during a meeting, and by the time we met, I had something ready to show."
            <div
              style={{
                marginTop: 24,
                fontFamily: theme.fontMono,
                fontSize: 16,
                fontStyle: "normal",
                fontWeight: 400,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: theme.fgMuted,
              }}
            >
              — Anna · Week 1
            </div>
          </div>
        </FadeUp>
      </div>
    </SlideFrame>
  );
}

// ============================================================================
// 06 — In six weeks, Anna…
// ============================================================================
export function Slide06({ theme, slideNumber, total }: SlideProps) {
  const items = [
    "Set up a developer environment from scratch",
    "Built and shipped prototypes without pulling engineering time",
    "Fixed bugs live during client calls",
    "Submitted PRs to engineering instead of writing tickets",
  ];
  return (
    <SlideFrame theme={theme}>
      <SlideChrome theme={theme} slideNumber={slideNumber} total={total} section="01 · The workflow" />
      <div style={{ marginTop: 100, display: "flex", flexDirection: "column", gap: 28 }}>
        <Kicker theme={theme}>In six weeks, a PM with no prior coding background</Kicker>
        <Title theme={theme} size={64} delay={4}>
          The unit of work changed.
        </Title>
      </div>

      <div style={{ marginTop: 72, display: "flex", flexDirection: "column", gap: 0 }}>
        {items.map((it, i) => (
          <FadeUp key={i} delay={16 + i * 12}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                gap: 32,
                alignItems: "baseline",
                padding: "26px 0",
                borderTop: `1px solid ${theme.rule}`,
                ...(i === items.length - 1 ? { borderBottom: `1px solid ${theme.rule}` } : {}),
              }}
            >
              <div
                style={{
                  fontFamily: theme.fontMono,
                  fontSize: 16,
                  letterSpacing: "0.14em",
                  color: theme.accent,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontFamily: theme.fontHeading,
                  fontSize: 38,
                  fontWeight: theme.headingWeight,
                  letterSpacing: theme.headingTracking,
                  lineHeight: 1.2,
                  color: theme.fg,
                }}
              >
                {it}
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </SlideFrame>
  );
}

// ============================================================================
// 07 — Anna's mode by week 4 (quote)
// ============================================================================
export function Slide07({ theme, slideNumber, total }: SlideProps) {
  return (
    <SlideFrame theme={theme} align="center">
      <SlideChrome theme={theme} slideNumber={slideNumber} total={total} section="01 · The workflow" />
      <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 1400 }}>
        <Kicker theme={theme}>Week 4</Kicker>
        <FadeUp delay={8}>
          <div
            style={{
              fontFamily: theme.fontHeading,
              fontStyle: theme.id === "editorial" ? "italic" : "normal",
              fontSize: 96,
              fontWeight: theme.headingWeight,
              lineHeight: 1.08,
              letterSpacing: theme.headingTracking,
              color: theme.fg,
            }}
          >
            "I'm not even going to meet with my engineers.
            <br />
            <span style={{ color: theme.accent }}>I'm just going to code it out and submit a PR."</span>
          </div>
        </FadeUp>
        <FadeUp delay={36}>
          <div
            style={{
              marginTop: 24,
              fontFamily: theme.fontMono,
              fontSize: 18,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: theme.fgMuted,
            }}
          >
            — Anna
          </div>
        </FadeUp>
      </div>
    </SlideFrame>
  );
}

// ============================================================================
// 08 — Spencer's approach: product-first
// ============================================================================
export function Slide08({ theme, slideNumber, total }: SlideProps) {
  const steps = [
    {
      n: "01",
      h: "Sat in the Parent Handbook Lesson at the camp",
      s: "Heard the complaints, the hopes, the fears — in the room.",
    },
    {
      n: "02",
      h: "Built the interface and workflow",
      s: "With no AI in it yet.",
    },
    {
      n: "03",
      h: "Refined the AI parts last",
      s: "Only after the product shape was clear.",
    },
  ];
  return (
    <SlideFrame theme={theme}>
      <SlideChrome theme={theme} slideNumber={slideNumber} total={total} section="01 · The workflow" />
      <div style={{ marginTop: 100, display: "flex", flexDirection: "column", gap: 24 }}>
        <Kicker theme={theme}>How I (Spencer) approached it</Kicker>
        <Title theme={theme} size={68} delay={4}>
          Started product-first.<br />
          <span style={{ color: theme.accent }}>AI came last.</span>
        </Title>
      </div>

      <div style={{ marginTop: 72, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
        {steps.map((step, i) => (
          <FadeUp key={i} delay={16 + i * 14}>
            <div
              style={{
                padding: 36,
                background: theme.panel,
                border: `1px solid ${theme.rule}`,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <div
                style={{
                  fontFamily: theme.fontMono,
                  fontSize: 14,
                  letterSpacing: "0.18em",
                  color: theme.accent,
                }}
              >
                STEP {step.n}
              </div>
              <div
                style={{
                  fontFamily: theme.fontHeading,
                  fontSize: 30,
                  fontWeight: theme.headingWeight,
                  lineHeight: 1.2,
                  color: theme.fg,
                  letterSpacing: theme.headingTracking,
                }}
              >
                {step.h}
              </div>
              <div
                style={{
                  fontFamily: theme.fontBody,
                  fontSize: 19,
                  lineHeight: 1.4,
                  color: theme.fgMuted,
                }}
              >
                {step.s}
              </div>
            </div>
          </FadeUp>
        ))}
      </div>

      <FadeUp delay={64} style={{ position: "absolute", bottom: 100, left: 96, right: 96 }}>
        <div
          style={{
            fontFamily: theme.fontMono,
            fontSize: 18,
            color: theme.fgMuted,
            letterSpacing: "0.04em",
          }}
        >
          Most engineers reach for AI first. The AI is only the bottleneck after you know the product shape.
        </div>
      </FadeUp>
    </SlideFrame>
  );
}

// ============================================================================
// 09 — How I work with Claude on hard problems
// ============================================================================
export function Slide09({ theme, slideNumber, total }: SlideProps) {
  const items = [
    {
      n: "01",
      title: "Speak the problem out loud — don't type.",
      body: "Long monologues give Claude the framing it needs to plan well. Short prompts are how you get short answers.",
    },
    {
      n: "02",
      title: "Lead with the problem, not the solution.",
      body: 'Frame it like you would for a teammate: "RAG quality is mostly a document-processing problem."',
    },
    {
      n: "03",
      title: "Research before you plan.",
      body: "Ask Claude to map the problem space first. Only after it reports back do I let it propose an approach.",
    },
    {
      n: "04",
      title: "Don't accept the first plan.",
      body: "Point out what it missed and what's wrong. Make it iterate before any code gets written.",
    },
  ];
  return (
    <SlideFrame theme={theme}>
      <SlideChrome theme={theme} slideNumber={slideNumber} total={total} />
      <div style={{ marginTop: 96, display: "flex", flexDirection: "column", gap: 18 }}>
        <Kicker theme={theme}>How I drive Claude</Kicker>
        <Title theme={theme} size={58} delay={4}>
          The pattern that worked<br />on hard problems.
        </Title>
        <FadeUp delay={10}>
          <div
            style={{
              fontFamily: theme.fontBody,
              fontSize: 22,
              color: theme.fgMuted,
              maxWidth: 1300,
              lineHeight: 1.4,
            }}
          >
            Four moves I lean on every session. Steal what works.
          </div>
        </FadeUp>
      </div>

      <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {items.map((it, i) => (
          <FadeUp key={i} delay={14 + i * 10}>
            <div
              style={{
                padding: "26px 30px",
                borderLeft: `4px solid ${theme.accent}`,
                background: theme.panel,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                height: "100%",
              }}
            >
              <div
                style={{
                  fontFamily: theme.fontMono,
                  fontSize: 13,
                  letterSpacing: "0.2em",
                  color: theme.accent,
                }}
              >
                {it.n}
              </div>
              <div
                style={{
                  fontFamily: theme.fontHeading,
                  fontSize: 28,
                  fontWeight: theme.headingWeight,
                  letterSpacing: theme.headingTracking,
                  color: theme.fg,
                  lineHeight: 1.2,
                }}
              >
                {it.title}
              </div>
              <div
                style={{
                  fontFamily: theme.fontBody,
                  fontSize: 18,
                  color: theme.fgMuted,
                  lineHeight: 1.45,
                }}
              >
                {it.body}
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </SlideFrame>
  );
}

// ============================================================================
// 10 — Section 2 header
// ============================================================================
export function Slide10({ theme, slideNumber, total }: SlideProps) {
  return SectionHeader({
    theme,
    slideNumber,
    total,
    n: "02",
    title: "What's a good AI candidate?",
    subtitle: "The hard part isn't building AI. It's figuring out what to point AI at.",
  });
}

// ============================================================================
// 11 — Two tracks, two outcomes
// ============================================================================
export function Slide11({ theme, slideNumber, total }: SlideProps) {
  return (
    <SlideFrame theme={theme}>
      <SlideChrome theme={theme} slideNumber={slideNumber} total={total} />
      <div style={{ marginTop: 96, display: "flex", flexDirection: "column", gap: 18 }}>
        <Kicker theme={theme}>What we built</Kicker>
        <Title theme={theme} size={56} delay={4}>
          Two products. One live, one in eval.
        </Title>
        <FadeUp delay={10}>
          <div
            style={{
              marginTop: 4,
              fontFamily: theme.fontBody,
              fontSize: 22,
              color: theme.fgMuted,
              maxWidth: 1300,
              lineHeight: 1.4,
            }}
          >
            Six weeks of building, two products in front of real users. Here&apos;s what each one does.
          </div>
        </FadeUp>
      </div>

      <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        <FadeUp delay={16}>
          <ProductCard
            theme={theme}
            tag="ASK CAMP"
            tagline="A chatbot for parents."
            body="Drops into a camp's site. Answers parent questions from their own handbook and camp data. Ship-fast was the right call — when an answer is off, recovery is cheap."
            status="LIVE WITH REAL PARENTS"
          />
        </FadeUp>
        <FadeUp delay={28}>
          <ProductCard
            theme={theme}
            tag="SMART NUDGES"
            tagline="Automated parent comms."
            body="Anna rebuilt it from scratch in week 3 after AI Lab feedback — clients wanted workflow automation, not more features. Sensitive channel, so eval rigor came first."
            status="IN ACTIVE EVAL"
          />
        </FadeUp>
      </div>
    </SlideFrame>
  );
}

function ProductCard({
  theme,
  tag,
  tagline,
  body,
  status,
}: {
  theme: Theme;
  tag: string;
  tagline: string;
  body: string;
  status: string;
}) {
  return (
    <div
      style={{
        background: theme.panel,
        border: `1px solid ${theme.rule}`,
        borderTop: `6px solid ${theme.accent}`,
        padding: "36px 36px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div
        style={{
          fontFamily: theme.fontMono,
          fontSize: 14,
          letterSpacing: "0.18em",
          color: theme.fgSubtle,
        }}
      >
        {tag}
      </div>
      <div
        style={{
          fontFamily: theme.fontHeading,
          fontSize: 36,
          fontWeight: theme.headingWeight,
          lineHeight: 1.2,
          letterSpacing: theme.headingTracking,
          color: theme.fg,
        }}
      >
        {tagline}
      </div>
      <div
        style={{
          fontFamily: theme.fontBody,
          fontSize: 19,
          color: theme.fgMuted,
          lineHeight: 1.5,
        }}
      >
        {body}
      </div>
      <div style={{ marginTop: "auto" }}>
        <div
          style={{
            display: "inline-block",
            fontFamily: theme.fontMono,
            fontSize: 13,
            letterSpacing: "0.2em",
            color: theme.accent,
            border: `2px solid ${theme.accent}`,
            padding: "8px 14px",
          }}
        >
          {status}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 12 — What the camps actually said (Dennis quote)
// ============================================================================
export function Slide12({ theme, slideNumber, total }: SlideProps) {
  return (
    <SlideFrame theme={theme} align="center">
      <SlideChrome theme={theme} slideNumber={slideNumber} total={total} section="02 · AI candidates" />
      <div style={{ display: "flex", flexDirection: "column", gap: 36, maxWidth: 1500 }}>
        <Kicker theme={theme}>Dennis · beta camp director · 4/22</Kicker>
        <FadeUp delay={8}>
          <div
            style={{
              fontFamily: theme.fontHeading,
              fontStyle: theme.id === "editorial" ? "italic" : "normal",
              fontSize: 64,
              fontWeight: theme.headingWeight,
              lineHeight: 1.18,
              letterSpacing: theme.headingTracking,
              color: theme.fg,
            }}
          >
            "If you were just to put in place a system where two months out you send an email, six weeks out you send an email, and three weeks out you send texts —{" "}
            <span style={{ color: theme.accent }}>
              95% of your camps would be thrilled.
            </span>
            "
          </div>
        </FadeUp>
        <FadeUp delay={42}>
          <div
            style={{
              fontFamily: theme.fontMono,
              fontSize: 18,
              color: theme.fgMuted,
              letterSpacing: "0.06em",
            }}
          >
            They didn't want AI personalization. They wanted predictability and control.
          </div>
        </FadeUp>
      </div>
    </SlideFrame>
  );
}

// ============================================================================
// 13 — Two questions we ask now
// ============================================================================
export function Slide13({ theme, slideNumber, total }: SlideProps) {
  return (
    <SlideFrame theme={theme}>
      <SlideChrome theme={theme} slideNumber={slideNumber} total={total} section="02 · AI candidates" />
      <div style={{ marginTop: 96, display: "flex", flexDirection: "column", gap: 20 }}>
        <Kicker theme={theme}>Two questions we ask before building</Kicker>
        <Title theme={theme} size={56} delay={4}>
          Not a framework. What we learned.
        </Title>
      </div>

      <div style={{ marginTop: 80, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56 }}>
        <FadeUp delay={16}>
          <DichotomyCard
            theme={theme}
            n="Q1"
            left="Control"
            right="Magic"
            note="Camp directors want control over how they communicate with parents."
          />
        </FadeUp>
        <FadeUp delay={28}>
          <DichotomyCard
            theme={theme}
            n="Q2"
            left="Replacing typing"
            right="Replacing judgment"
            note="Typing-replacement is low risk. Judgment-replacement is what customers don't want yet."
          />
        </FadeUp>
      </div>

      <FadeUp delay={48} style={{ position: "absolute", bottom: 100, left: 96, right: 96 }}>
        <div
          style={{
            fontFamily: theme.fontMono,
            fontSize: 16,
            color: theme.fgSubtle,
            letterSpacing: "0.04em",
          }}
        >
          Still iterating. As an org we don't have a clean answer for what "more AI" actually means.
        </div>
      </FadeUp>
    </SlideFrame>
  );
}

function DichotomyCard({
  theme,
  n,
  left,
  right,
  note,
}: {
  theme: Theme;
  n: string;
  left: string;
  right: string;
  note: string;
}) {
  return (
    <div
      style={{
        background: theme.panel,
        border: `1px solid ${theme.rule}`,
        padding: 36,
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <div
        style={{
          fontFamily: theme.fontMono,
          fontSize: 14,
          letterSpacing: "0.2em",
          color: theme.accent,
        }}
      >
        {n}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: 24,
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: theme.fontHeading,
            fontSize: 38,
            fontWeight: theme.headingWeight,
            color: theme.fg,
            letterSpacing: theme.headingTracking,
          }}
        >
          {left}
        </div>
        <div
          style={{
            fontFamily: theme.fontMono,
            fontSize: 22,
            color: theme.accent,
          }}
        >
          ↔
        </div>
        <div
          style={{
            fontFamily: theme.fontHeading,
            fontSize: 38,
            fontWeight: theme.headingWeight,
            color: theme.fg,
            textAlign: "right",
            letterSpacing: theme.headingTracking,
          }}
        >
          {right}
        </div>
      </div>
      <div
        style={{
          fontFamily: theme.fontBody,
          fontSize: 18,
          color: theme.fgMuted,
          lineHeight: 1.4,
          paddingTop: 16,
          borderTop: `1px solid ${theme.rule}`,
        }}
      >
        {note}
      </div>
    </div>
  );
}

// ============================================================================
// 14 — Section 3 header
// ============================================================================
export function Slide14({ theme, slideNumber, total }: SlideProps) {
  return SectionHeader({
    theme,
    slideNumber,
    total,
    n: "03",
    title: "What we learned to pay attention to",
    subtitle: "Once you decide an AI candidate is good-shaped, here's what surfaces.",
  });
}

// ============================================================================
// 15 — Cost is a product question
// ============================================================================
export function Slide15({ theme, slideNumber, total }: SlideProps) {
  return (
    <SlideFrame theme={theme} align="center">
      <SlideChrome theme={theme} slideNumber={slideNumber} total={total} section="03 · Pay attention" />
      <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 1500 }}>
        <Kicker theme={theme}>Cost is a product question</Kicker>
        <Title theme={theme} size={66} delay={4}>
          Cost-per-conversation is a feature shape.
        </Title>

        <FadeUp delay={20}>
          <div
            style={{
              marginTop: 24,
              padding: "36px 48px",
              borderLeft: `4px solid ${theme.accent}`,
              background: theme.panel,
              fontFamily: theme.fontHeading,
              fontStyle: theme.id === "editorial" ? "italic" : "normal",
              fontSize: 40,
              fontWeight: theme.headingWeight,
              lineHeight: 1.2,
              color: theme.fg,
            }}
          >
            "Who's paying for the tokens that all these parents are gonna use?"
            <div
              style={{
                marginTop: 18,
                fontFamily: theme.fontMono,
                fontSize: 16,
                fontStyle: "normal",
                fontWeight: 400,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: theme.fgMuted,
              }}
            >
              — Anna · mid-prototype
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={48}>
          <div
            style={{
              marginTop: 24,
              display: "flex",
              gap: 32,
              flexWrap: "wrap",
              fontFamily: theme.fontMono,
              fontSize: 20,
              color: theme.fgMuted,
            }}
          >
            <Pill theme={theme}>Premium tier?</Pill>
            <Pill theme={theme}>BYO API key?</Pill>
            <Pill theme={theme}>Free tier with limits?</Pill>
          </div>
        </FadeUp>

        <FadeUp delay={68}>
          <div
            style={{
              fontFamily: theme.fontBody,
              fontSize: 22,
              color: theme.fg,
              marginTop: 12,
            }}
          >
            You can't answer this <em>after</em> you build it. Cost-per-conversation shapes the product.
          </div>
        </FadeUp>
      </div>
    </SlideFrame>
  );
}

function Pill({ theme, children }: { theme: Theme; children: React.ReactNode }) {
  return (
    <span
      style={{
        padding: "10px 20px",
        border: `1.5px solid ${theme.rule}`,
        background: theme.bg,
        color: theme.fg,
        letterSpacing: "0.04em",
      }}
    >
      {children}
    </span>
  );
}

// ============================================================================
// 16 — Hallucinations: router not filter
// ============================================================================
export function Slide16({ theme, slideNumber, total }: SlideProps) {
  return (
    <SlideFrame theme={theme}>
      <SlideChrome theme={theme} slideNumber={slideNumber} total={total} section="03 · Pay attention" />
      <div style={{ marginTop: 100, display: "flex", flexDirection: "column", gap: 20 }}>
        <Kicker theme={theme}>Hallucinations need architecture</Kicker>
        <Title theme={theme} size={62} delay={4}>
          Guardrails as a router, not a filter.
        </Title>
      </div>

      <div style={{ marginTop: 64, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
        {/* Bad pattern */}
        <FadeUp delay={16}>
          <ArchPattern
            theme={theme}
            label="WRONG"
            tone="negative"
            steps={["Question in", "Generate answer", "Check if safe", "Maybe block"]}
            note="The model has already hallucinated. The guardrail just observes it."
          />
        </FadeUp>
        {/* Good pattern */}
        <FadeUp delay={28}>
          <ArchPattern
            theme={theme}
            label="RIGHT"
            tone="positive"
            steps={["Question in", "Pre-flight: small router", "Route or refuse", "Then generate"]}
            note="The main chatbot never sees the question that breaks the rules."
            highlight={2}
          />
        </FadeUp>
      </div>

      <FadeUp delay={56} style={{ position: "absolute", bottom: 100, left: 96, right: 96 }}>
        <div
          style={{
            fontFamily: theme.fontMono,
            fontSize: 16,
            color: theme.fgSubtle,
            letterSpacing: "0.04em",
          }}
        >
          ◆ Took ~1 week to land. Single biggest thing keeping Ask Camp safe in production.
        </div>
      </FadeUp>
    </SlideFrame>
  );
}

function ArchPattern({
  theme,
  label,
  tone,
  steps,
  note,
  highlight,
}: {
  theme: Theme;
  label: string;
  tone: "positive" | "negative";
  steps: string[];
  note: string;
  highlight?: number;
}) {
  const color = tone === "positive" ? theme.positive : theme.negative;
  return (
    <div
      style={{
        background: theme.panel,
        border: `1px solid ${theme.rule}`,
        borderTop: `6px solid ${color}`,
        padding: 36,
        display: "flex",
        flexDirection: "column",
        gap: 22,
        height: "100%",
      }}
    >
      <div
        style={{
          display: "inline-block",
          alignSelf: "flex-start",
          fontFamily: theme.fontMono,
          fontSize: 14,
          letterSpacing: "0.2em",
          color,
          border: `2px solid ${color}`,
          padding: "6px 12px",
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {steps.map((s, i) => {
          const isLast = i === steps.length - 1;
          const isHL = highlight === i;
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  fontFamily: theme.fontMono,
                  fontSize: 20,
                  padding: "14px 18px",
                  background: isHL ? theme.accentSoft : theme.bg,
                  border: `1px solid ${isHL ? theme.accent : theme.rule}`,
                  color: theme.fg,
                  fontWeight: isHL ? 600 : 400,
                }}
              >
                {String(i + 1).padStart(2, "0")} · {s}
              </div>
              {!isLast && (
                <div
                  style={{
                    fontFamily: theme.fontMono,
                    fontSize: 16,
                    color: theme.fgSubtle,
                    paddingLeft: 18,
                  }}
                >
                  ↓
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div
        style={{
          marginTop: "auto",
          fontFamily: theme.fontBody,
          fontSize: 17,
          color: theme.fgMuted,
          lineHeight: 1.4,
          paddingTop: 16,
          borderTop: `1px solid ${theme.rule}`,
        }}
      >
        {note}
      </div>
    </div>
  );
}

// ============================================================================
// 17 — Evals
// ============================================================================
export function Slide17({ theme, slideNumber, total }: SlideProps) {
  const evals = [
    { name: "Context relevance", q: "Did we retrieve the right docs?", score: 92 },
    { name: "Unnecessary refusal", q: 'Did we say "I can\'t help" when we could?', score: 88 },
    { name: "Faithfulness", q: "Did the answer use the docs we retrieved?", score: 95 },
  ];

  return (
    <SlideFrame theme={theme}>
      <SlideChrome theme={theme} slideNumber={slideNumber} total={total} section="03 · Pay attention" />
      <div style={{ marginTop: 100, display: "flex", flexDirection: "column", gap: 20 }}>
        <Kicker theme={theme}>Evals are the boring part that matters</Kicker>
        <Title theme={theme} size={56} delay={4}>
          AI products fail by drifting, not by 500-ing.
        </Title>
      </div>

      <div style={{ marginTop: 60, display: "flex", flexDirection: "column", gap: 18 }}>
        {evals.map((e, i) => (
          <EvalRow key={i} theme={theme} eval={e} delay={16 + i * 12} />
        ))}
      </div>

      <FadeUp delay={70} style={{ position: "absolute", bottom: 100, left: 96, right: 96 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "20px 24px",
            border: `1px solid ${theme.rule}`,
            background: theme.panel,
          }}
        >
          <div
            style={{
              fontFamily: theme.fontMono,
              fontSize: 14,
              letterSpacing: "0.18em",
              color: theme.accent,
            }}
          >
            LANGFUSE
          </div>
          <div
            style={{
              fontFamily: theme.fontBody,
              fontSize: 19,
              color: theme.fg,
            }}
          >
            <strong style={{ fontWeight: 600 }}>22 prompts versioned.</strong>{" "}
            <span style={{ color: theme.fgMuted }}>Roll back when an eval moves.</span>
          </div>
        </div>
      </FadeUp>
    </SlideFrame>
  );
}

function EvalRow({
  theme,
  eval: e,
  delay,
}: {
  theme: Theme;
  eval: { name: string; q: string; score: number };
  delay: number;
}) {
  const frame = useFrame();
  const f = Math.max(0, frame - delay);
  const w = interpolate(f, [0, 32], [0, e.score], { extrapolateRight: "clamp" });

  return (
    <FadeUp delay={delay}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr 130px",
          gap: 32,
          alignItems: "center",
          padding: "20px 0",
          borderTop: `1px solid ${theme.rule}`,
        }}
      >
        <div
          style={{
            fontFamily: theme.fontHeading,
            fontSize: 26,
            fontWeight: theme.headingWeight,
            letterSpacing: theme.headingTracking,
            color: theme.fg,
          }}
        >
          {e.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              fontFamily: theme.fontBody,
              fontSize: 17,
              color: theme.fgMuted,
            }}
          >
            {e.q}
          </div>
          <div
            style={{
              height: 8,
              background: theme.rule,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${w}%`,
                background: theme.accent,
              }}
            />
          </div>
        </div>
        <div
          style={{
            fontFamily: theme.fontMono,
            fontSize: 32,
            fontWeight: 500,
            color: theme.fg,
            textAlign: "right",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(w)}
          <span style={{ fontSize: 18, color: theme.fgSubtle }}>%</span>
        </div>
      </div>
    </FadeUp>
  );
}

// ============================================================================
// 18 — The cost of building this fast
// ============================================================================
export function Slide18({ theme, slideNumber, total }: SlideProps) {
  return (
    <SlideFrame theme={theme}>
      <SlideChrome theme={theme} slideNumber={slideNumber} total={total} />
      <div style={{ marginTop: 88, display: "flex", flexDirection: "column", gap: 20 }}>
        <Kicker theme={theme}>What it took</Kicker>
        <Title theme={theme} size={56} delay={4}>
          Six weeks of building, by the receipts.
        </Title>
        <FadeUp delay={10}>
          <div
            style={{
              fontFamily: theme.fontBody,
              fontSize: 22,
              color: theme.fgMuted,
              maxWidth: 1300,
              lineHeight: 1.4,
            }}
          >
            Every Claude message I sent and every response I got, across every session.
          </div>
        </FadeUp>
      </div>

      {/* Hero: user messages */}
      <FadeUp delay={22}>
        <div
          style={{
            marginTop: 44,
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 44,
            alignItems: "baseline",
          }}
        >
          <Counter
            theme={theme}
            to={5911}
            delay={22}
            duration={60}
            size={180}
            format={(v) => Math.round(v).toLocaleString()}
          />
          <div
            style={{
              fontFamily: theme.fontMono,
              fontSize: 22,
              color: theme.fgMuted,
              letterSpacing: "0.04em",
              lineHeight: 1.4,
              paddingBottom: 24,
            }}
          >
            messages I sent to Claude
            <br />
            <span style={{ color: theme.fg }}>
              19,078 responses back · ≈3.2× leverage on every message
            </span>
          </div>
        </div>
      </FadeUp>

      {/* Stats grid */}
      <FadeUp delay={56}>
        <div
          style={{
            marginTop: 36,
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 20,
            borderTop: `1px solid ${theme.rule}`,
            paddingTop: 24,
          }}
        >
          <StatCell theme={theme} label="Total cost" value="$7,767" sub="$310.69 / active day" />
          <StatCell theme={theme} label="Sessions" value="144" sub="132.5 msgs / session" />
          <StatCell theme={theme} label="Active days" value="25" sub="of the 6-week window" />
          <StatCell theme={theme} label="Cache hit rate" value="98.1%" sub="3.75B cache reads" />
          <StatCell theme={theme} label="Per session" value="$53.94" sub="$0.41 per message" />
        </div>
      </FadeUp>

      <FadeUp delay={88} style={{ position: "absolute", left: 96, bottom: 110, right: 96 }}>
        <div
          style={{
            fontFamily: theme.fontMono,
            fontSize: 18,
            color: theme.fgMuted,
            letterSpacing: "0.04em",
          }}
        >
          ◆ Six months of decisions, compressed into 25 active days.
        </div>
      </FadeUp>
    </SlideFrame>
  );
}

function StatCell({
  theme,
  label,
  value,
  sub,
}: {
  theme: Theme;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          fontFamily: theme.fontMono,
          fontSize: 12,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: theme.fgSubtle,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: theme.fontHeading,
          fontSize: 56,
          fontWeight: theme.headingWeight,
          letterSpacing: theme.headingTracking,
          lineHeight: 1,
          color: theme.fg,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: theme.fontMono,
            fontSize: 14,
            color: theme.fgMuted,
            letterSpacing: "0.02em",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 19 — Section 4 header
// ============================================================================
export function Slide19({ theme, slideNumber, total }: SlideProps) {
  return SectionHeader({
    theme,
    slideNumber,
    total,
    n: "04",
    title: "Tactics for building with Claude",
    subtitle: "For the engineers in the room. Steal them.",
  });
}

// ============================================================================
// 20 — Treat Claude like a colleague who lies sometimes
// ============================================================================
export function Slide20({ theme, slideNumber, total }: SlideProps) {
  const tactics = [
    {
      a: 'Trust "all done."',
      b: 'Ask "what\'s NOT done?"',
    },
    {
      a: "Accept the work at face value.",
      b: 'Ask "did you actually use AI here?" — and why if not.',
    },
    {
      a: "Argue when it insists it's right.",
      b: "Drop in the screenshot.",
    },
    {
      a: "Force Claude back onto a wrong path.",
      b: "Abandon the context. Start a fresh session.",
    },
    {
      a: "Blame the model for bad output.",
      b: "Fix your prompt — bad output is bad input.",
    },
  ];

  return (
    <SlideFrame theme={theme}>
      <SlideChrome theme={theme} slideNumber={slideNumber} total={total} />
      <div style={{ marginTop: 96, display: "flex", flexDirection: "column", gap: 18 }}>
        <Kicker theme={theme}>The mental load is real</Kicker>
        <Title theme={theme} size={58} delay={4}>
          Treat Claude like a colleague<br />
          <span style={{ color: theme.accent }}>who lies sometimes.</span>
        </Title>
        <FadeUp delay={10}>
          <div
            style={{
              fontFamily: theme.fontBody,
              fontSize: 22,
              color: theme.fgMuted,
              maxWidth: 1300,
              lineHeight: 1.4,
            }}
          >
            Claude is fast — and confidently wrong sometimes. The cost of moving this fast is staying alert.
          </div>
        </FadeUp>
      </div>

      <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 0 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 60px 1fr",
            gap: 0,
            paddingBottom: 14,
            borderBottom: `2px solid ${theme.rule}`,
            fontFamily: theme.fontMono,
            fontSize: 14,
            letterSpacing: "0.18em",
            color: theme.fgSubtle,
          }}
        >
          <div>DON'T</div>
          <div></div>
          <div>DO</div>
        </div>
        {tactics.map((t, i) => (
          <FadeUp key={i} delay={16 + i * 10}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 60px 1fr",
                gap: 0,
                padding: "20px 0",
                borderBottom: `1px solid ${theme.rule}`,
                alignItems: "baseline",
              }}
            >
              <div
                style={{
                  fontFamily: theme.fontBody,
                  fontSize: 22,
                  color: theme.fgMuted,
                  textDecoration: "line-through",
                  textDecorationColor: theme.negative,
                }}
              >
                {t.a}
              </div>
              <div
                style={{
                  fontFamily: theme.fontMono,
                  fontSize: 18,
                  color: theme.accent,
                  textAlign: "center",
                }}
              >
                →
              </div>
              <div
                style={{
                  fontFamily: theme.fontHeading,
                  fontSize: 26,
                  fontWeight: theme.headingWeight,
                  color: theme.fg,
                  letterSpacing: theme.headingTracking,
                }}
              >
                {t.b}
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </SlideFrame>
  );
}

// ============================================================================
// 21 — Multi-model + self-healing hooks
// ============================================================================
export function Slide21({ theme, slideNumber, total }: SlideProps) {
  const patterns = [
    {
      label: "MULTI-MODEL ROUTING",
      title: "Match the model to the job.",
      body: "Opus to plan, Sonnet to execute, Haiku to lint. Cost and speed both fall.",
    },
    {
      label: "SELF-HEALING HOOKS",
      title: "Once you see it twice, hook it.",
      body: "When a tool fails the same way, automate recovery. Chrome reconnect saved us 90s × every run.",
    },
    {
      label: "PLANNING SUB-AGENTS",
      title: "Spawn a worktree. Merge the plan.",
      body: "Let an agent explore in isolation, then bring back the strategy — not the code.",
    },
    {
      label: "EVALS AS TESTS",
      title: "Treat prompts like code.",
      body: "Lock behavior with assertion suites. Catch regressions before parents do.",
    },
  ];
  return (
    <SlideFrame theme={theme}>
      <SlideChrome theme={theme} slideNumber={slideNumber} total={total} />
      <div style={{ marginTop: 88, display: "flex", flexDirection: "column", gap: 18 }}>
        <Kicker theme={theme}>What you can take back to your team</Kicker>
        <Title theme={theme} size={54} delay={4}>
          Four patterns that earned their slide.
        </Title>
        <FadeUp delay={10}>
          <div
            style={{
              fontFamily: theme.fontBody,
              fontSize: 22,
              color: theme.fgMuted,
              maxWidth: 1300,
              lineHeight: 1.4,
            }}
          >
            Tactics from six weeks of building — useable Monday morning, no special permission required.
          </div>
        </FadeUp>
      </div>

      <div
        style={{
          marginTop: 48,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
        }}
      >
        {patterns.map((p, i) => (
          <FadeUp key={i} delay={20 + i * 8}>
            <PatternCard theme={theme} label={p.label} title={p.title} body={p.body} />
          </FadeUp>
        ))}
      </div>
    </SlideFrame>
  );
}

function PatternCard({
  theme,
  label,
  title,
  body,
}: {
  theme: Theme;
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div
      style={{
        background: theme.panel,
        border: `1px solid ${theme.rule}`,
        borderLeft: `4px solid ${theme.accent}`,
        padding: "26px 30px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        height: "100%",
      }}
    >
      <div
        style={{
          fontFamily: theme.fontMono,
          fontSize: 13,
          letterSpacing: "0.18em",
          color: theme.accent,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: theme.fontHeading,
          fontSize: 28,
          fontWeight: theme.headingWeight,
          letterSpacing: theme.headingTracking,
          lineHeight: 1.2,
          color: theme.fg,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: theme.fontBody,
          fontSize: 18,
          color: theme.fgMuted,
          lineHeight: 1.45,
        }}
      >
        {body}
      </div>
    </div>
  );
}

// ============================================================================
// 22 — Test in the browser
// ============================================================================
export function Slide22({ theme, slideNumber, total }: SlideProps) {
  return (
    <SlideFrame theme={theme}>
      <SlideChrome theme={theme} slideNumber={slideNumber} total={total} section="04 · Tactics" />
      <div style={{ marginTop: 100, display: "flex", flexDirection: "column", gap: 20 }}>
        <Kicker theme={theme}>Tactic 04</Kicker>
        <Title theme={theme} size={62} delay={4}>
          Test the product, not the task list.
        </Title>
      </div>

      <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        <FadeUp delay={16}>
          <BrowserMock theme={theme} />
        </FadeUp>
        <FadeUp delay={32}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingTop: 8 }}>
            <div
              style={{
                fontFamily: theme.fontBody,
                fontSize: 24,
                color: theme.fg,
                lineHeight: 1.4,
              }}
            >
              Claude marks <code style={{ fontFamily: theme.fontMono, color: theme.accent }}>✅ implemented.</code> The tab is broken in the browser.
            </div>
            <div
              style={{
                fontFamily: theme.fontBody,
                fontSize: 20,
                color: theme.fgMuted,
                lineHeight: 1.5,
              }}
            >
              Use Chrome automation to drive the product manually.
            </div>
            <div
              style={{
                marginTop: 12,
                padding: "20px 24px",
                background: theme.accentSoft,
                color: theme.id === "terminal" ? theme.accent : theme.fg,
                fontFamily: theme.fontMono,
                fontSize: 18,
                letterSpacing: "0.02em",
              }}
            >
              5+ UX bugs caught in one session
            </div>
          </div>
        </FadeUp>
      </div>
    </SlideFrame>
  );
}

function BrowserMock({ theme }: { theme: Theme }) {
  return (
    <div
      style={{
        background: theme.panel,
        border: `1px solid ${theme.rule}`,
        boxShadow: theme.id === "terminal" ? "none" : "0 20px 60px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          background: theme.id === "terminal" ? "#161B22" : "#F1F3F5",
          borderBottom: `1px solid ${theme.rule}`,
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: 999, background: "#FF5F57" }} />
        <div style={{ width: 12, height: 12, borderRadius: 999, background: "#FEBC2E" }} />
        <div style={{ width: 12, height: 12, borderRadius: 999, background: "#28C840" }} />
        <div
          style={{
            marginLeft: 16,
            fontFamily: theme.fontMono,
            fontSize: 13,
            color: theme.fgMuted,
          }}
        >
          ask-camp.app/chat
        </div>
      </div>
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
        <BugLine theme={theme} text="Empty bubble (no copy)" />
        <BugLine theme={theme} text="Non-clickable contact link" />
        <BugLine theme={theme} text="Admin tab loads broken state" />
        <BugLine theme={theme} text="Refusal copy missing fallback" />
        <BugLine theme={theme} text="Prompt registry version not bumped" />
      </div>
    </div>
  );
}

function BugLine({ theme, text }: { theme: Theme; text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        border: `1px solid ${theme.negative}`,
        background: theme.id === "terminal" ? "#1A0B0E" : "#FFF5F5",
        fontFamily: theme.fontMono,
        fontSize: 14,
        color: theme.negative,
      }}
    >
      <span>✕</span>
      <span style={{ color: theme.fg }}>{text}</span>
    </div>
  );
}

// ============================================================================
// 23 — Close
// ============================================================================
export function Slide23({ theme, slideNumber, total }: SlideProps) {
  const frame = useFrame();
  return (
    <SlideFrame theme={theme} align="center">
      <SlideChrome theme={theme} slideNumber={slideNumber} total={total} section="Close" />
      <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 1500 }}>
        <Kicker theme={theme}>Anna · launch day</Kicker>
        <FadeUp delay={6}>
          <div
            style={{
              fontFamily: theme.fontHeading,
              fontStyle: theme.id === "editorial" ? "italic" : "normal",
              fontSize: 80,
              fontWeight: theme.headingWeight,
              lineHeight: 1.12,
              letterSpacing: theme.headingTracking,
              color: theme.fg,
            }}
          >
            "Six weeks from idea, discovery, build, launch —{" "}
            <span style={{ color: theme.accent }}>
              five days before the expected prototype date."
            </span>
          </div>
        </FadeUp>

        <FadeUp delay={42}>
          <div
            style={{
              marginTop: 32,
              fontFamily: theme.fontMono,
              fontSize: 18,
              letterSpacing: "0.06em",
              color: theme.fgMuted,
            }}
          >
            None of it happens without that pace. None of it was free.
          </div>
        </FadeUp>

        <FadeUp delay={64}>
          <div
            style={{
              marginTop: 40,
              fontFamily: theme.fontHeading,
              fontSize: 36,
              fontWeight: theme.headingWeight,
              color: theme.accent,
              letterSpacing: theme.headingTracking,
            }}
          >
            Thanks.
          </div>
        </FadeUp>

        <div
          style={{
            position: "absolute",
            bottom: 96,
            right: 96,
            width: 320,
          }}
        >
          <div
            style={{
              height: 4,
              background: theme.accent,
              width: `${interpolate(frame, [70, 100], [0, 100], { extrapolateRight: "clamp" })}%`,
            }}
          />
        </div>
      </div>
    </SlideFrame>
  );
}

// ============================================================================
// 17 — What shipped (Anna's close)
// ============================================================================
export function SlideClose({ theme, slideNumber, total }: SlideProps) {
  const items = [
    { k: "Ask Camp", v: "live with 22 parents at 6 beta camps" },
    { k: "Smart Nudges", v: "pivoted to scheduled cadence after AI Lab feedback" },
    { k: "3 evals", v: "running in production (context, refusal, faithfulness)" },
    { k: "22 prompts", v: "moved out of code into LangFuse registry" },
    { k: "~$0.03", v: "all-in cost per parent conversation" },
    { k: "5 days", v: "ahead of the expected prototype date" },
  ];
  return (
    <SlideFrame theme={theme}>
      <SlideChrome theme={theme} slideNumber={slideNumber} total={total} />
      <div style={{ marginTop: 96, display: "flex", flexDirection: "column", gap: 18 }}>
        <Kicker theme={theme}>What shipped from the experiment</Kicker>
        <Title theme={theme} size={56} delay={4}>
          Six weeks. Two products live.<br />Real parents on the other end.
        </Title>
        <FadeUp delay={10}>
          <div
            style={{
              fontFamily: theme.fontBody,
              fontSize: 22,
              color: theme.fgMuted,
              maxWidth: 1300,
              lineHeight: 1.4,
            }}
          >
            What the experiment actually produced — and the part the org now has to figure out.
          </div>
        </FadeUp>
      </div>

      <div style={{ marginTop: 64, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px 56px" }}>
        {items.map((it, i) => (
          <FadeUp key={i} delay={14 + i * 8}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 18,
                padding: "16px 0",
                borderTop: `1px solid ${theme.rule}`,
              }}
            >
              <span
                style={{
                  fontFamily: theme.fontHeading,
                  fontSize: 36,
                  fontWeight: theme.headingWeight,
                  letterSpacing: theme.headingTracking,
                  color: theme.accent,
                  flexShrink: 0,
                }}
              >
                {it.k}
              </span>
              {it.v && (
                <span
                  style={{
                    fontFamily: theme.fontBody,
                    fontSize: 22,
                    color: theme.fgMuted,
                    lineHeight: 1.3,
                  }}
                >
                  {it.v}
                </span>
              )}
            </div>
          </FadeUp>
        ))}
      </div>

      <FadeUp delay={80} style={{ position: "absolute", left: 96, bottom: 100, right: 96 }}>
        <div
          style={{
            fontFamily: theme.fontMono,
            fontSize: 18,
            color: theme.fgMuted,
            letterSpacing: "0.04em",
            lineHeight: 1.5,
          }}
        >
          ◆ Plus one tired PM and one tired engineer.
          <br />
          <span style={{ color: theme.fg }}>
            One PM running this way. One engineer who knows the full AI stack in production.
            That&apos;s a real thing for the org to figure out.
          </span>
        </div>
      </FadeUp>
    </SlideFrame>
  );
}

// ============================================================================
// END — The end. (Spencer + Anna)
// ============================================================================
export function SlideEnd({ theme, slideNumber, total }: SlideProps) {
  return (
    <SlideFrame theme={theme} align="center">
      <SlideChrome theme={theme} slideNumber={slideNumber} total={total} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
          textAlign: "center",
        }}
      >
        <Title theme={theme} size={180} delay={4}>
          The{" "}
          <span
            style={{
              color: theme.accent,
              fontStyle: theme.id === "editorial" ? "italic" : "normal",
            }}
          >
            end.
          </span>
        </Title>
        <FadeUp delay={28}>
          <div
            style={{
              fontFamily: theme.fontMono,
              fontSize: 22,
              color: theme.fgMuted,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginTop: 24,
            }}
          >
            Questions?
          </div>
        </FadeUp>
        <FadeUp delay={48}>
          <div
            style={{
              fontFamily: theme.fontMono,
              fontSize: 16,
              color: theme.fgSubtle,
              letterSpacing: "0.08em",
              marginTop: 16,
            }}
          >
            Spencer Mroczek + Anna · CampCo
          </div>
        </FadeUp>
      </div>
    </SlideFrame>
  );
}

// Registry — 9-slide deck for the CampCo Tech Town Hall.
// Older slide functions (Slide04, Slide06..Slide08, Slide10, Slide12..Slide17,
// Slide19, Slide20, Slide21, Slide22, Slide23) are retained in this file as
// inventory but not in the deck.
export const SLIDES = [
  Slide01,    // 1 Title — The Epic AI Experiment (S)
  Slide02,    // 2 Plan vs reality (S)
  Slide03,    // 3 Six-week timeline (A)
  Slide11,    // 4 What we built (A)
  Slide09,    // 5 How I drive Claude (S)
  Slide18,    // 6 What it took — by the receipts (S)
  Slide05,    // 7 PM in the build loop (A)
  SlideClose, // 8 What shipped — Anna's close (A)
  SlideEnd,   // 9 The end (S+A)
];

