# Campminder — Design System

Single source of truth for Campminder's brand expression across marketing,
product, and sales. Derived from the FY26 Marketing Plan review deck — which
spent its last third articulating the brand direction explicitly — plus the
canonical purple logo files.

If you are a contributor, start here. If you are Claude, **read this entire
file before generating anything.** Short-cuts here lead to off-brand work.

---

## 1 — About Campminder

Campminder makes software for summer-camp professionals. Directors,
counselors, coordinators, and operators use it to run applications, payments,
staffing, and every other moving part of a camp season. The company also
owns UltraCamp, which serves a lower-fidelity, more value-conscious segment
of the same market.

**What we sell, in one sentence:** we sell calm, confidence, and connection
in the world of camp.

**Who we compete with:** CampBrain (declining, safe, nostalgic), CIRCUITREE
(feature-listers), Bunk1 (discount-driven), Campwise (generic).

---

## 2 — CONTENT FUNDAMENTALS

How Campminder talks.

### 2.1 The Hero Brand archetype

Campminder is a **Hero brand.** This is the single most important concept in
this document. Every copy decision, every visual choice, every illustration
brief flows from it.

The archetype company Campminder aspires to sit alongside: Nike, BMW, Marvel,
Fedex, Patagonia. Brands that celebrate transformation, competence, and
strength — that frame the customer as someone becoming their most capable
self.

**The hero is the customer. Campminder is the enabler.**

- The camp director is the protagonist.
- The camp staff and counselors are the co-heroes.
- Campminder is the trusted ally — the tool, the guide, the invisible
  infrastructure that makes their story possible.

The tagline **"Unpack Possible"** is a literal statement of this. We supply
the gear; the camp does the climbing.

### 2.2 The story shift

From → To, applied to every piece of copy we write:

| From (what we must avoid) | To (what we write instead) |
| --- | --- |
| "Campminder does X, Y, Z for you." | "You make camp better, and Campminder helps you do it." |
| "Forms are hard to track down." | "Every form, in one place, so your team can move." |
| "Hiring is hard." | "Build the staff roster your camp deserves." |
| "Data is messy." | "See the whole season clearly — and act on it." |
| "Our tools aren't connected." | "Where camp comes together." |

### 2.3 Anti-patterns — never do these

These are lifted verbatim from the FY26 marketing review because they are
the exact failure modes the brand has already identified and rejected.

- **No pain-point marketing.** Camps already know their pain; they live it
  every day. Echoing it back creates fatigue and reminds them how long we
  took to solve it. Competitors can all claim they understand pain —
  understanding pain is not a differentiator.
- **No "therapist brand" voice.** Empathetic in tone is fine; performatively
  sympathetic ("we know running a camp is *so* hard…") is not.
- **No unverifiable stats.** (The "5X investment" number from the FY25
  keynote was explicitly ruled out of social because it read like a claim
  we couldn't back.) If a number is on the page, it must be defensible.
- **No generic software-vendor lines.** "Software that makes your camp the
  best it can be" is Campwise-grade. Anything that any competitor could
  say, any competitor will say — say something they can't.
- **No product-at-center sentences.** The camp is the subject; the product
  is the verb that enables them. If the sentence starts with "Campminder,"
  rewrite it.

### 2.4 Voice

Five dials, each set deliberately.

- **Confident, not boastful.** We don't say we're the best. We show pace of
  innovation and let client stories carry the proof.
- **Warm, not sentimental.** We love summer camp. We don't manufacture
  nostalgia.
- **Precise, not jargony.** "Applications, payments, staffing" beats
  "end-to-end operational platform." If Host Grotesk Medium can't render
  the sentence cleanly at 20px, the sentence is probably too complicated.
- **Aspirational, not performative.** "Make every summer count" — a real
  promise about outcomes, not a slogan about effort.
- **Spacious, not busy.** Short sentences. Real paragraphs. White space
  in the layout maps to breathing room in the writing.

### 2.5 Working headline system

From the hero-archetype exploration in the review deck. These are
field-tested directions, not the final wordmarks — treat as a palette.

- **"Where camp comes together."** (Starbucks-style — connection, community.)
- **"Engineered for the way you run camp."** (BMW-style — craft, control.)
- **"Make every summer count."** (Nike-style — progress, resilience.)
- **"Build the camp experience you imagine."** (Adobe-style — creation.)
- **"The power behind every camp hero."** (Marvel-style — enablement.)
- **"Your camp. Your systems. Your way."** (Notion-style — flexibility.)
- **"Unpack possible."** (The existing tagline — keep in rotation.)

### 2.6 Naming & capitalization

- **"Campminder"** — one word, capital C, lowercase rest. Never
  "CampMinder" or "CAMPMINDER" (except in full-cap tracked treatments,
  which must use the tagline wordmark, not retyped text).
- **"UltraCamp"** — one word, two internal caps. Sister brand, positioned
  distinctly: value, flexibility, approachable.
- The brand wordmark in the logo is lowercase `campminder`. When we
  reproduce the wordmark in UI, use the logo PNG, not a type treatment.
- Use the Oxford comma. Always.

---

## 3 — VISUAL FOUNDATIONS

How Campminder looks.

### 3.1 Color

Exactly one brand color carries the load: **Campminder Purple `#773DBE`**.
It comes from the logo. It is the only hue in the system — everything else
is a cool neutral gray ramp.

This restraint is the brand. Hero brands do not have busy palettes. See
Nike (swoosh black / white), BMW (blue / silver / black), Patagonia (rust
/ cream). Campminder is the purple brand.

See `tokens.css` for the full ramp. In practice:

- **Purple 500 (`#773DBE`)** — logo color. Use for: primary buttons,
  brand moments, links, the bracket motif, charts with a single series.
- **Purple 600 (`#5E2E97`)** — hover / pressed state only.
- **Purple 100 / 50** — tinted washes for sections that need "this is a
  brand moment" without being fully purple.
- **Ink 900 (`#0E0F12`)** — body text and statement dark sections.
- **Ink 400 (`#91969C`)** — the "muted subtitle" gray straight from the
  PPTX master (used for the "Response to Feedback" subtitle). Our default
  for secondary headings and quiet labels.
- **Ink 50 (`#F6F7F9`)** — default page canvas.
- **White** — primary surface.

What the palette explicitly excludes: no red, no green, no yellow, no
teal. No gradients (the brand is flat). No dark mode variants in this
first pass — the marketing surface is light, period.

### 3.2 Typography

**Host Grotesk** — one family, four weights, across everything.

Host Grotesk is a modern grotesque with a generous x-height, slightly
rounded corners, and a low-contrast feel that stays friendly at large
display sizes without losing authority. It was already in the deck; we
are doubling down.

- **Display / Hero (96 / 72px)** — Host Grotesk **Bold**, tracking
  `-0.02em`, line-height 1.05. All headlines that carry a slide or a
  landing section.
- **H1–H4 (56 / 40 / 28 / 22px)** — Host Grotesk **Semibold** or
  **Medium**, tracking `-0.005em`, line-height 1.15.
- **Body (17 / 20px)** — Host Grotesk **Regular**, line-height 1.55.
  20px is the preferred marketing-body size; 17px is the product default.
- **Eyebrow / Small caps (13 / 11px)** — Host Grotesk **Medium**,
  uppercase, tracking 0.08em. Use sparingly — labels only, never
  sentences.
- **Tagline treatment** — full caps, tracking `0.22em`, weight **Bold**.
  This echoes the "UNPACK POSSIBLE" tagline wordmark. Reserve for
  brand-statement moments.

No italics for emphasis — use weight, color, or size. (Italic is fine
inside body copy for titles of works, just not as an emphasis tool.)

### 3.3 Brand motif — the corner brackets

The single strongest visual signature Campminder owns, after the purple,
is the **film-frame corner brackets** that wrap both the full logo and
the `cm` monogram. They are the brand's "container" — a literal frame
around the customer.

Use the brackets to:

- Frame hero imagery (top-left + bottom-right corner only — never all
  four, the logo style uses diagonal pair).
- Frame standalone quotes or hero copy moments.
- Mark a "spotlight" section of a page.

Rules:

- 3px stroke weight at marketing scale. Maintain optical weight when
  resized — never scale below 2px.
- Always purple `#773DBE`, or white on a dark/purple surface. Never gray.
- Always diagonal (top-left + bottom-right, OR top-right + bottom-left).
  Never all four corners — that reads like a ticket, not a frame.
- The bracket arm length should be ~8–12% of the framed element's
  shorter edge, never less than 20px.

A reusable CSS implementation lives in `components.css` (see `.cm-frame`).

### 3.4 Imagery

- **Photography beats illustration.** The brand is about real camps and
  real people. We use photos of camp life — golden hour, active,
  candid. No stock handshakes. No glossy corporate meeting rooms.
- **Hero brands crop tight.** Faces, hands, objects mid-motion. Not wide
  context shots with a headline floating in the sky.
- **No manufactured diversity tropes** — a single well-composed portrait
  beats a collage of smiling archetypes.
- **Product screenshots** are rendered inside a neutral light frame, at
  generous size. We show the product on-brand, not as a wall of UI.
- **Placeholders are honest.** When we don't have the photo yet, we ship
  a neutral gray rectangle with a short italic caption ("Photo: camp
  director on first day"). We do not generate synthetic imagery.

### 3.5 Iconography

Campminder does **not** lean on icons. This is a deliberate position.

Pain-point-marketing decks have icon rows because they need to gesture at
"feature, feature, feature." A hero brand uses language instead —
"applications, payments, staffing" in a well-set sentence is worth a
dozen bullet icons.

When we do need an icon (navigation affordances, utility buttons, form
states), use **Lucide** at 1.5px stroke weight in the current text
color. One family, one weight, always outline — never filled, never
colored.

### 3.6 Layout & spacing

4px spacing base. All gaps, paddings, and margins pull from the
`--cm-s-*` scale in `tokens.css`. Do not introduce off-scale values
("let me just add 7px") — they break rhythm.

Marketing pages and slides favor **generous vertical space and a
1200px content max**. The brand's restraint shows in the negative
space. Do not compensate for a "thin-feeling" layout by adding
decoration — trust the white space.

### 3.7 Components

Buttons, cards, forms, badges — see `components.css` and the preview
cards under `preview/`. Rules of thumb:

- **Buttons** — tight 4px radius. Solid purple primary, outline
  secondary, text-only tertiary. No gradients. No drop shadows on
  buttons.
- **Cards** — white on gray canvas (`--cm-bg-muted`), 12–16px radius,
  hairline border at `--cm-border`, shadow `--cm-sh-1` or none. Cards
  should feel architectural, not floaty.
- **Forms** — single-line inputs with a 1px bottom border at
  `--cm-border-strong`; border goes purple on focus. Minimal
  chrome.
- **Badges** — outline pill (not solid), tight `--cm-track-wide`
  tracking, 11px Host Grotesk Medium.

---

## 4 — Files in this system

- `tokens.css` — every color, type size, spacing, and motion value as a
  CSS custom property. The source of truth.
- `components.css` — reusable component styles (buttons, cards, forms,
  badge, `.cm-frame` bracket motif).
- `SKILL.md` — instructions for Claude when asked to create any
  Campminder-branded artifact. Read this before generating.
- `assets/` — the canonical logo files, monogram, tagline, and a
  representative hero image from the source deck.
- `preview/` — one small HTML file per system card (colors, type,
  buttons, logo, etc.) used to review each piece in isolation.
- `Campminder Brand Poster.html` — a one-page visual summary of the
  system, suitable as a sales-team tear-sheet or an internal
  "everything in one place" reference.

---

## 5 — Source

This system distills the **Campminder FY26 Marketing Plan Review** PPTX
(54 slides). Every decision above has a lineage in that document —
especially the hero-archetype section (slides 31–47) and the competitor
contrast (slides 49–53). When in doubt, re-read those slides.
