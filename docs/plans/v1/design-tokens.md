---
name: Design Tokens — palette, typography, spacing, motion
phase: cross-cutting (B1 ships it, every phase consumes)
status: ready
last_revised: 2026-04-19
---

# Design Tokens

This doc is the concrete source of truth for all tokens. `src/styles/tokens.css` must match this file. Any divergence = backlog item.

## 1. Color

```css
@theme {
  /* Void & ink */
  --color-void:          #0a0816;   /* cosmic eggplant, never pure black */
  --color-void-soft:     #14102a;   /* card surface in void scenes */
  --color-ink:           #ece7f5;   /* body type */
  --color-ink-dim:       #a9a1c4;   /* metadata, secondary */
  --color-ink-faint:     #6a6189;   /* tertiary, dim HUD */

  /* Violet spectrum */
  --color-violet-prime:  #7c3aed;   /* primary accent, rim light */
  --color-electric:      #a78bfa;   /* wireframe, hover, active */
  --color-violet-soft:   #c4b5fd;   /* hover halos */
  --color-violet-glow:   rgba(124, 58, 237, 0.18);

  /* Warm signal */
  --color-warm-signal:   #fbbf24;   /* amber — rare: REC dot, active session, end-card punct */

  /* UI */
  --color-border:        #2b224a;
  --color-border-soft:   #1b1533;

  /* Status */
  --color-success:       #34d399;
  --color-warn:          #fbbf24;   /* reuse warm-signal */
  --color-error:         #fb7185;
}
```

### Usage rules

- Body bg: `--color-void`. Never `#0a0a0a` or true black.
- Primary accents, rim light, focus rings: `--color-violet-prime`.
- Wireframes, hover/active surfaces: `--color-electric`.
- Amber (`--color-warm-signal`) only on: live recording dot, active session indicator, end-card punctuation, unmute button, form submit success. Never decorative.
- Text: `--color-ink` for body, `--color-ink-dim` for labels/meta, `--color-ink-faint` for dim HUD.

### Deprecations (to remove in B1)

- `#0a0a0a`, `#111111`, `#1a1a1a`, `#222222` — replace with `--color-void`, `--color-void-soft`, `--color-border-soft`.
- `#a855f7` — replace with `--color-violet-prime`.
- `#e4e4e7`, `#a1a1aa` — replace with `--color-ink`, `--color-ink-dim`.

## 2. Typography

```css
@theme {
  --font-display: 'Editorial New', 'Tiempos Headline', Georgia, serif;
  --font-display-italic: 'Editorial New', 'Instrument Serif', Georgia, serif;
  --font-body:    'PP Neue Montreal', 'Inter Tight', system-ui, sans-serif;
  --font-mono:    'Berkeley Mono', 'JetBrains Mono', 'IBM Plex Mono', monospace;
}
```

### Face roles (strict)

| face | role | examples |
|------|------|----------|
| display (serif) | names, section titles, emotional lines | `JOSUE APARCEDO`, `Notes on me.`, `SEE YOU SPACE COWBOY` |
| body (sans) | paragraphs, UI, buttons | body prose, CTA labels, nav links |
| mono | ALL metadata | coords, timestamps, indices `[001/2026]`, tags `RUST`, code, `SESSION ##` |

### Scale (rem @ 16px root)

| token | rem | px | use |
|-------|-----|----|-----|
| `--text-micro` | 0.6875 | 11 | mono HUD labels |
| `--text-xs` | 0.75 | 12 | mono meta, corner labels |
| `--text-sm` | 0.8125 | 13 | mono values, small UI |
| `--text-base` | 1.0 | 16 | body prose |
| `--text-md` | 1.125 | 18 | lead paragraph |
| `--text-lg` | 1.5 | 24 | small section title |
| `--text-xl` | 2.0 | 32 | subtitle |
| `--text-2xl` | 3.0 | 48 | section title |
| `--text-3xl` | 5.0 | 80 | about / contact hero |
| `--text-4xl` | 8.0 | 128 | nameplate desktop |
| `--text-nameplate` | clamp(4rem, 16vw, 14rem) | responsive nameplate |
| `--text-endcard` | clamp(3rem, 9vw, 9rem) | end-card cowboy line |

### Tracking / line-height

- display: `-0.03em` tracking, `0.92` line-height
- display italic: `-0.02em`, `1.0`
- body: `0em`, `1.55`
- mono: `0.04em` uppercase or `0em` lowercase, `1.4`

### Weights

- display: 400, 500 (rare)
- body: 400, 500
- mono: 400 (only)

### Fonts on disk

- Existing: `public/fonts/instrument-serif-latin.woff2`, `public/fonts/instrument-serif-italic-latin.woff2` — use as display fallback until Editorial New licensed
- To source: Editorial New or Tiempos Headline (Pangram Pangram or Klim)
- PP Neue Montreal (Pangram Pangram, free for personal)
- Berkeley Mono (berkeleygraphics.com — paid) or JetBrains Mono free fallback

Font loading: `font-display: swap`. Preload display + body only. Mono is critical enough to preload if nameplate uses it — it does not, so defer mono.

## 3. Spacing

8px base grid.

| token | px |
|-------|----|
| `--space-0` | 0 |
| `--space-1` | 4 |
| `--space-2` | 8 |
| `--space-3` | 12 |
| `--space-4` | 16 |
| `--space-5` | 24 |
| `--space-6` | 32 |
| `--space-7` | 48 |
| `--space-8` | 64 |
| `--space-9` | 96 |
| `--space-10` | 128 |

Corner padding (HUD): `--space-5` (24px) desktop, `--space-4` (16px) mobile.

## 4. Radii

Architectural, sharp. Do not round.

| token | px |
|-------|----|
| `--radius-sm` | 2 |
| `--radius` | 4 |
| `--radius-lg` | 8 (rare — only dropdown menus, never cards) |

## 5. Motion curves

```css
:root {
  --ease-hard:   cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-long:   cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* overshoot ~6% */
  --ease-cut:    steps(1, end);                      /* hard cut */
}
```

### Durations

| token | ms | use |
|-------|----|-----|
| `--dur-snap` | 120 | micro UI, active states |
| `--dur-fast` | 240 | hover reveals |
| `--dur-base` | 360 | drawers, reveals |
| `--dur-slow` | 720 | section reveals |
| `--dur-dolly` | 1200 | camera moves |
| `--dur-card` | 900 | session card hold |

### Rule

Exactly four curves. Any PR introducing a fifth must update this doc first.

## 6. Breakpoints

Mobile-first.

| token | min-width | label |
|-------|-----------|-------|
| — | 0 | base (mobile) |
| `--bp-sm` | 480px | large phones |
| `--bp-md` | 768px | tablets |
| `--bp-lg` | 1024px | small laptops |
| `--bp-xl` | 1280px | desktops |
| `--bp-2xl` | 1680px | wide desktops |

Cinematic scenes are tuned for `--bp-lg` and up. Below `--bp-md`, reduced-motion-like collapse is allowed.

## 7. Z-index stack

| token | z | layer |
|-------|----|-------|
| `--z-scene` | 0 | three.js canvas |
| `--z-content` | 10 | page content |
| `--z-hud` | 20 | HUD corners, session card |
| `--z-overlay` | 30 | dialogs, command palette |
| `--z-cursor` | 40 | custom cursor |
| `--z-max` | 9999 | a11y skip links |

## 8. Grain / scanline / vignette params

```css
:root {
  --grain-opacity: 0.04;
  --grain-size:    128px; /* tiled noise texture */
  --scanline-opacity: 0.02;
  --scanline-gap:  2px;
  --vignette-inner: 60%;
  --vignette-outer: 110%;
  --vignette-alpha: 0.20;
  --chroma-base:  0px;
  --chroma-dive:  4px;
  --chroma-shatter: 8px;
}
```

## 9. Shadows

Minimal — this is a flat-film aesthetic. One shadow token for the unfolded facet only.

```css
--shadow-facet: 0 40px 120px -20px rgba(124, 58, 237, 0.35);
```

## 10. Open decisions

- Confirm amber (`#fbbf24`) as rare accent — ROADMAP decision #2. If rejected, fallback is `--color-electric` on the same hits.
- Berkeley Mono vs JetBrains Mono. Berkeley is $75 lifetime, one-seat. JetBrains is free. Leaning Berkeley for uniqueness; JetBrains for budget.
- Editorial New (Pangram Pangram, free for personal, $50 commercial) vs Tiempos Headline (Klim, paid).
