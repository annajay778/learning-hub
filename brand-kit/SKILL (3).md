# SKILL.md — Creating Campminder-branded artifacts

Read this whenever you are asked to build anything inside this project
(slides, landing pages, prototypes, social posts, sales collateral).
Follow every rule. If the user asks for something that violates a rule,
push back once, then honor the user if they confirm.

---

## Before you write a single tag

1. **Load the tokens first.** Every HTML page you create links
   `tokens.css` and (if using primitives) `components.css` from this
   project root. Never redefine colors, fonts, or spacing inline.
2. **Read `README.md`** — especially §2 (CONTENT FUNDAMENTALS) and §3
   (VISUAL FOUNDATIONS). The hero-brand positioning is the single
   biggest constraint in the system.
3. **Open `preview/voice.html`** before writing any copy. The
   "From → To" table and the "Never do this" list are the quickest
   smell-test for a sentence.

---

## Non-negotiable rules

### Copy

- **The camp is the hero.** If a sentence starts with "Campminder,"
  rewrite it so the camp does. Good: "You run camp with total control."
  Bad: "Campminder gives you total control."
- **No pain-point openers.** "Tired of…" / "Struggling with…" /
  "Still using…" are banned. These are CIRCUITREE and Bunk1 moves.
- **No unverifiable numbers.** If we can't source it, we don't print it.
- **No generic vendor lines.** If Campwise or CampBrain could say it, we
  don't say it.
- **Capitalize correctly.** "Campminder" (not CampMinder), "UltraCamp"
  (one word, two caps).

### Visual

- **Purple is the only hue.** Everything else is from the Ink gray ramp.
  No red, green, yellow, teal. No gradients.
- **Host Grotesk only.** Four weights: 300, 400, 500, 600, 700. No other
  family. No italic for emphasis.
- **Tight corners.** Radius maxes at 16px. No pills. No fully-rounded
  buttons.
- **Flat elevation.** `--cm-sh-1` / `-2` at most. Hero moments have no
  shadow — they have brackets.
- **The bracket motif is a signature, not a border.** Use `.cm-frame`
  deliberately — a hero quote, a featured image, a spotlight. Never on
  every card.
- **Icons: rare, Lucide outline, text-color.** When in doubt, use
  language instead of an icon row.
- **Photography over illustration.** Tight crops. Real camp moments.
  Honest placeholders (gray rectangle + italic caption) when we don't
  have the shot.

### Layout

- **4px base** for all spacing (`--cm-s-*`). No off-scale values.
- **1200px container max** for marketing surfaces.
- **Generous vertical rhythm.** Negative space is the brand — don't fill
  it with decoration.

---

## Cheat sheet — the working headlines

Lift these as-is when you need a display line. They are field-tested.

- "Unpack possible."
- "Where camp comes together."
- "You make camp better. Campminder helps you do it."
- "Make every summer count."
- "Engineered for the way you run camp."
- "Build the camp experience you imagine."
- "The power behind every camp hero."
- "Your camp. Your systems. Your way."

---

## Output protocol

- Put user-facing deliverables at the project root with descriptive
  filenames (e.g. `Campminder Landing.html`, `Campminder Onboarding
  Deck.html`).
- Write via `write_file` with `asset: "<name>"` so it shows up in the
  asset review pane.
- For decks, use the `deck_stage.js` starter component. Slides default
  to 1920×1080; text never smaller than 24px.
- For prototypes, use the React+Babel stack described in the system
  prompt. Load `tokens.css` and `components.css` from the root.

---

## Quick brand smell-test (run on every output)

1. Does the copy put the **camp** at the center, not Campminder?
2. Is there **exactly one hue** (purple) on the page, plus neutrals?
3. Is **Host Grotesk** the only family?
4. Is there **at least one bracket moment** where it matters — and not
   more than two or three?
5. Does the vertical rhythm **breathe**, or did I cram?
6. Could **CampBrain or Campwise** have shipped this same line/slide?
   If yes, rewrite.

If you can't answer yes to 1–5 and no to 6, it's not done.
