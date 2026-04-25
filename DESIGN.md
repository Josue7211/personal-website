# Design System — josue.aparcedo.org

Cinematic, editorial, violet-on-black. Poster-first. The hero is a film title card,
not a homepage. Scroll is the only chrome. Type and motion do everything; decoration
is grain, vignette, and atmospheric gradient that respond to where the user is on
the page. Everything else is restraint.

This file is the source of truth. `src/styles/tokens.css` and
`src/styles/index-scene.css` are the implementation. If they diverge from this doc,
fix the doc — the running site wins.

---

## Product Context

- **What this is:** Personal site at `josue.aparcedo.org` — cinematic Astro portfolio,
  with a separate docs notebook at `docs.josue.aparcedo.org` (`docs-site/`).
- **Who it's for:** Hiring managers, fellow engineers, founders who want a sense of taste
  in 5 seconds and depth in 30.
- **Project type:** Editorial / cinematic single-page experience. Docs site is a
  Starlight knowledge base — different rules, different layout.
- **Core stack:** Astro 6, Tailwind v4 via `@tailwindcss/vite`, GSAP, Lenis, Three.js.

---

## Aesthetic Direction

- **Direction:** Editorial-cinematic. Late-night studio. Film-grain title sequence.
- **Decoration level:** Intentional — never expressive. SVG fractal grain overlay
  (`<FilmGrain />`, `opacity: 0.04`, `mix-blend-mode: overlay`), radial vignette,
  layered atmospheric gradients keyed to scroll progress (`--work-in`, `--about-zoom`,
  `--contact-in`).
- **Mood:** Confident, composed, slightly nocturnal. Reads like the credits of a
  Villeneuve film, not a SaaS landing page.
- **Anti-slop guarantees:** No purple gradient buttons. No 3-column icon grids. No
  centered-everything. No bubbly radii (max 4px). No stock hero photo. No decorative
  blobs. The 3D sphere does the heavy visual work; the layout stays disciplined.

---

## Typography

All fonts loaded once in `BaseLayout.astro` via Google Fonts; Instrument Serif is
also self-hosted in `public/fonts/` (Brave Shields / ad-blockers strip Google Fonts,
so the title sequence falls back gracefully).

| Role | Font | Why |
|------|------|-----|
| Display / Hero | **Instrument Serif** (self-hosted) | Filmic, high-contrast, slightly imperfect. Carries the poster. |
| Body / UI prose | **Inter** | Neutral workhorse for paragraphs. Stays out of the way. |
| Mono / labels / corners / nav | **JetBrains Mono** | Engineer signal. Used uppercase, heavily tracked, 9–12px. |
| Italic emphasis | Instrument Serif italic | The site's only flourish — used in tagline accents and corner values. |
| Token aliases | `--font-display: 'Playfair Display'` and `--font-body: 'Space Grotesk'` exist in `tokens.css` but the cinematic scene overrides them with Instrument Serif + Inter via `--f-serif` / `--f-sans`. **Treat the scene-level vars as canonical.** |

### Scale (actually rendered, from `index-scene.css`)

| Token | Value | Use |
|-------|-------|-----|
| `name-big` (hero) | `clamp(72px, 13.5vw, 220px)`, `line-height: 1.05`, `letter-spacing: -0.035em`, weight 400 | Name as poster title. |
| Hero outline variant | Same metrics, stroked, layered behind | Depth. |
| Section header | `clamp(56px, 11vw, 180px)` | Section titles ("WORK", "ABOUT"). |
| Mid-display | `clamp(36px, 5vw, 72px)` | Project / about subheads. |
| Body | `16px`, `line-height: 1.6` | Default. |
| Tagline | `15px`, italic serif | The one-liner under the name. |
| Mono labels | `9–12px`, `letter-spacing: 0.14em–0.2em`, uppercase | Corners, nav, status, "PORTFOLIO V.05". |
| Corner italic value | `13px`, serif italic, violet `--v-200` | The small accent in HUD corners. |

### Type rules

- Display always serif. Always weight 400. Never bold the hero — the size carries it.
- Mono is always uppercase, always tracked ≥ `0.14em`. It's HUD chrome, not prose.
- Body never centered except for tagline / contact callouts.
- No drop shadows on text. Ever.

---

## Color

Dark-only by design. There is no light mode. Violet is the only accent.

### Token map

CSS vars live in `src/styles/tokens.css` (Tailwind v4 `@theme` block). The cinematic
scene re-aliases them to its own short names in `index-scene.css`.

| Role | Token | Hex | Notes |
|------|-------|-----|-------|
| Background | `--color-bg` | `#0a0a0a` | Page base. Almost black, never pure. |
| Surface 1 | `--color-surface-1` | `#111111` | Slight lift. |
| Surface 2 | `--color-surface-2` | `#1a1a1a` | Cards / panels. |
| Surface 3 | `--color-surface-3` | `#222222` | Hover / active. |
| Text | `--color-text` (alias `--ink`) | `#e4e4e7` | Body. |
| Text muted | `--color-text-muted` (alias `--ink-dim`) | `#a1a1aa` | Secondary. |
| Text low | `--ink-low` | `#625a7a` | Tertiary HUD chrome. Slight violet tint. |
| Primary | `--color-primary` (alias `--v-400`) | `#a855f7` | Accent — links, focus, sphere. |
| Primary deep | `--color-primary-deep` (`--v-500`) | `#7c3aed` | Pressed / hover. |
| Primary soft | `--color-primary-soft` (`--v-200`) | `#c4b5fd` | Italic accents, corner values. |
| Primary glow | `--color-primary-glow` | `rgba(168,85,247,0.15)` | Atmosphere. |
| Rule | `--rule` | `rgba(255,255,255,0.08)` | Hairlines. |
| Rule strong | `--rule-2` | `rgba(255,255,255,0.12)` | Hover hairlines. |
| Film amber | `--film-amber` | `#f2d38a` | Contact section warmth only. |
| Film cyan | `--film-cyan` | `#8fd7ff` | Cool atmospheric gradient pole. |

### Violet scale (full)

`v-50 #f3eefe` · `v-200 #c4b5fd` · `v-300 #b495f3` · `v-400 #a855f7` · `v-500 #7c3aed`
· `v-600 #6d28d9` · `v-700 #5b21b6` · `v-900 #2a0e5e`

### Color rules

- Violet is a punctuation mark, not a fill. Use `--v-400` for one accent per
  composition, max two per viewport.
- Body text is always `--ink` on `--bg`. No off-color body copy.
- Section atmosphere shifts via `--work-in` / `--about-zoom` / `--contact-in` CSS
  custom properties driven by `public/scene/app.js`. **Never hard-code the gradients;
  always go through the progress vars** so the scene stays choreographed.
- Focus-visible: `outline: 1px solid rgba(168,85,247,0.82)`, `outline-offset: 5px`,
  `box-shadow: 0 0 0 6px rgba(168,85,247,0.1)`. Match this everywhere.

---

## Spacing & Layout

- **Base unit:** 4px.
- **Scale:** 2(2) · 4(4) · 8(8) · 16(16) · 24(24) · 32(32) · 48(48) · 64(64).
- **Density:** Generous. Editorial, not dashboard.
- **Page padding:** `--pad-x: clamp(20px, 4vw, 56px)`.
- **Max content width:** `--max: 1400px`.
- **Nav height:** `--nav-h: 72px`.
- **Section fade band:** `--section-fade: clamp(160px, 24vh, 320px)` — used to bleed
  one section into the next so the sphere can re-stage.
- **Layout approach:** Hybrid. The scene is creative-editorial (asymmetric HUD
  corners, fixed-position tagline, free-floating labels keyed to 3D facets). The
  docs site is grid-disciplined (Starlight defaults).

### Border radius

Sharp by policy. `--radius-sm: 2px`, `--radius: 4px`. Never round buttons. Never
pill anything. The aesthetic is architectural — soft corners would betray it.

---

## Motion

GSAP + Lenis drive scroll. Three.js drives the sphere. CSS handles micro-transitions.

### Easings (canonical)

| Use | Curve |
|-----|-------|
| Page-level reveals (hero exit, contact enter) | `cubic-bezier(.16, 1, .3, 1)` (long ease-out) |
| Label fades, sphere facet labels | `cubic-bezier(.22, 1, .36, 1)` |
| Snappy UI (cursor ring, nav) | `cubic-bezier(.2, .8, .2, 1)` |
| Curtain / intro fade | `cubic-bezier(.76, 0, .24, 1)` |

### Durations

- Micro (hover, opacity flip): **150–250ms**
- Standard (UI transition): **400ms**
- Section reveal: **1.0–1.15s**
- Intro curtain: **800ms** with **1.4s** visibility delay

### Motion rules

- Reduced motion respected: `prefers-reduced-motion: reduce` skips intro entirely
  (`src/pages/index.astro` lines 41–48). Match this pattern in any new motion.
- The sphere never strobes. Pulse animations live at 2s `ease-in-out` infinite.
- Marquee runs at 20s linear infinite. Don't speed up.
- Scroll is Lenis-smoothed. Never `scroll-behavior: smooth` outside the cinematic
  scene; docs uses native auto.

---

## Component Patterns

These are the recurring primitives in `index-scene.css`. Reuse, don't reinvent.

- **Cursor ring** — 32px outline ring, scales to 56px + violet wash on `.hover`.
  Driven from `public/scene/app.js`.
- **HUD corner block** — fixed-position, mono-label + value pair. Tracked uppercase
  label, italic-serif value for emphasis (`.corner-val em`).
- **Scroll line** — 2s `ease-in-out` infinite linear gradient violet → transparent.
- **Marquee** — single-line ticker, 20s linear infinite.
- **Section atmosphere** — radial gradients keyed to `--*-in` progress vars; never
  static.
- **Film grain** — `<FilmGrain />` SVG fractal noise, `opacity: 0.04`, `z-index: 9999`,
  `mix-blend-mode: overlay`. One instance per layout.
- **3D facet label** — absolute, transform-driven from sphere basis. Opacity =
  `min(1, max(0, facing) * 1.5)`. Lift + scale + blur on de-facing for parallax.

---

## Scope & non-goals

- **Light mode:** not supported. Don't add it.
- **Decorative illustrations / stock photo:** never.
- **Multiple accent colors:** no. Violet only. Film amber and cyan are atmospheric,
  not for type or buttons.
- **Heavy framework UI kits (shadcn, MUI, Chakra):** no. The cinematic site is
  hand-rolled. Docs site uses Starlight defaults — keep them clean, don't theme-bomb.
- **Animation libraries beyond GSAP / Lenis:** no.

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-25 | Initial DESIGN.md extracted from existing implementation | Codify the running aesthetic so future Claude sessions stop drifting into AI-default purple-gradient territory. |
| earlier | Self-host Instrument Serif | Brave Shields / ad-blockers strip Google Fonts; the title card must always render. |
| earlier | Sharp 2–4px radii | Architectural, editorial signal. Bubbly radii belong on different products. |
| earlier | Single accent (violet) | Discipline — every additional accent is a confession that the system isn't strong enough on its own. |
| earlier | Atmosphere gradients keyed to scroll progress vars | Lets the scene controller (`public/scene/app.js`) choreograph color without touching CSS. |
