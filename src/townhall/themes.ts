export type ThemeId = "editorial" | "terminal" | "brand";

export type Theme = {
  id: ThemeId;
  name: string;
  tagline: string;
  bg: string;
  fg: string;
  fgMuted: string;
  fgSubtle: string;
  accent: string;
  accentSoft: string;
  rule: string;
  panel: string;
  panelBorder: string;
  positive: string;
  negative: string;
  fontHeading: string;
  fontBody: string;
  fontMono: string;
  // styling tokens
  headingWeight: number;
  headingTracking: string;
  bodyWeight: number;
  ruleStyle: "solid" | "dashed" | "ascii";
};

export const THEMES: Record<ThemeId, Theme> = {
  editorial: {
    id: "editorial",
    name: "Editorial",
    tagline: "Magazine-grade. Serif. Restraint.",
    bg: "#FAF7F2",
    fg: "#1A1A1A",
    fgMuted: "#5C5147",
    fgSubtle: "#8A7E72",
    accent: "#C4452D",
    accentSoft: "#F0DCD2",
    rule: "#1A1A1A",
    panel: "#FFFFFF",
    panelBorder: "#1A1A1A",
    positive: "#2E5C3E",
    negative: "#A03B27",
    fontHeading: 'var(--font-fraunces), "Iowan Old Style", "Baskerville", Georgia, serif',
    fontBody: 'var(--font-source-serif), "Iowan Old Style", Georgia, serif',
    fontMono: 'var(--font-jetbrains), "IBM Plex Mono", ui-monospace, monospace',
    headingWeight: 500,
    headingTracking: "-0.02em",
    bodyWeight: 400,
    ruleStyle: "solid",
  },
  terminal: {
    id: "terminal",
    name: "Terminal",
    tagline: "Engineering-native. Mono. Build-log feel.",
    bg: "#0B0E14",
    fg: "#E6EDF3",
    fgMuted: "#8B949E",
    fgSubtle: "#484F58",
    accent: "#3FB950",
    accentSoft: "#0D2818",
    rule: "#30363D",
    panel: "#0D1117",
    panelBorder: "#30363D",
    positive: "#3FB950",
    negative: "#F85149",
    fontHeading: 'var(--font-jetbrains), "IBM Plex Mono", "SF Mono", ui-monospace, monospace',
    fontBody: 'var(--font-jetbrains), "IBM Plex Mono", "SF Mono", ui-monospace, monospace',
    fontMono: 'var(--font-jetbrains), "IBM Plex Mono", "SF Mono", ui-monospace, monospace',
    headingWeight: 500,
    headingTracking: "-0.01em",
    bodyWeight: 400,
    ruleStyle: "ascii",
  },
  brand: {
    id: "brand",
    name: "Brand",
    tagline: "Campminder. One purple. Hero brand.",
    bg: "#FFFFFF",
    fg: "#0E0F12",
    fgMuted: "#6F7278",
    fgSubtle: "#91969C",
    accent: "#773DBE",
    accentSoft: "#F7F2FD",
    rule: "#D8DAE2",
    panel: "#F6F7F9",
    panelBorder: "#D8DAE2",
    // Single-hue palette. Brand uses purple for "good" and dark ink for "bad" —
    // no red, no green, no teal. This is on-brand restraint.
    positive: "#773DBE",
    negative: "#0E0F12",
    fontHeading: '"Host Grotesk", "Inter", system-ui, sans-serif',
    fontBody: '"Host Grotesk", "Inter", system-ui, sans-serif',
    // Brand spec uses Host Grotesk Medium for eyebrows / small caps. Keep
    // strict monospace for the CodeBlock primitive only.
    fontMono: '"Host Grotesk", "Inter", system-ui, sans-serif',
    headingWeight: 700,
    headingTracking: "-0.02em",
    bodyWeight: 400,
    ruleStyle: "solid",
  },
};

export const THEME_ORDER: ThemeId[] = ["editorial", "terminal", "brand"];
