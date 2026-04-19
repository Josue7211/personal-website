---
name: Mobile + A11y — cross-cutting rules
phase: cross-cutting (verified in G1)
status: ready
last_revised: 2026-04-19
---

# Mobile + Accessibility

## 1. Mobile adaptation table (per shot)

| shot | desktop | mobile (<768px) |
|------|---------|-----------------|
| boot | full animation | 1.2s shortened — amber dot → wires in one pass → nameplate in |
| hero | sphere 640px, full HUD | sphere 320px, compact HUD, one-line tagline |
| work | drag + dbl-click + J/K | tap face to select; long-press to unfold; drag to spin |
| dive | 300vh sticky, 64 shards | 150vh sticky, 32 shards, no chroma, shorter dust stream |
| about | 2-col body + aside | 1-col body → aside |
| contact | full transmitter | single column, stacked fields, TRANSMIT full-width |
| end | full viewport SYSC | same, smaller serif |

## 2. Touch gestures

- single tap on face (work): select + show label
- double tap on face (work): unfold (equivalent to dbl-click)
- long-press 500ms (work): drawer with all repos in that category
- drag (any scene with sphere): spin sphere, momentum carry
- pinch-zoom: disabled inside scenes (viewport meta)
- pull-to-refresh: disabled on homepage, allowed on docs

## 3. Pointer type handling

```css
@media (pointer: coarse) { /* touch device */
  .custom-cursor { display: none; }
  .hover-only { display: none; }
}
```

Hover-only affordances (rim-light glow on face hover, reticle preview) hidden for touch. Replace with tap feedback (brief ring flash).

## 4. Reduced motion rules

On `prefers-reduced-motion: reduce`:

| component | behavior |
|-----------|----------|
| boot | skip to end state; no assembly animation |
| hero auto-rotate | disabled |
| hero parallax | disabled |
| dive (all beats) | single 600ms opacity crossfade between work and about |
| shatter | disabled, no shards rendered |
| dust | disabled |
| chromatic aberration | 0 always |
| grain | static (not per-frame regenerated) |
| scanline drift | disabled |
| session-card | 80ms fade, 400ms hold, linear exit |
| session-card chroma | 0 |
| type-in reveals | appear all at once |
| cursor | native cursor |
| audio | unaffected (reduced-motion ≠ reduced-audio) |

## 5. Reduced GPU rules

Detected via WebGL caps (maxTextureSize, renderer string). On low-tier:

- sphere subdivision 3 → 2
- shatter shards 64 → 32
- dust particles 140 → 60
- bypass ChromaticAberrationPass
- bypass FilmPass (use CSS grain only)
- pixel ratio capped at 1 (not 2)

## 6. NoWebGL fallback

- static sphere image (lo-fi rendered ahead)
- nameplate, HUD, nav, copy all functional
- scroll works
- micro-experiences still run (they don't need WebGL; 2D canvas + DOM)
- dive collapses to reduced-motion crossfade

## 7. NoJS fallback

Astro's strength: static HTML exists.

- nav works (anchor links)
- all copy readable
- images + fonts present
- form submits via `action="mailto:..."` fallback
- visible note: `you're reading the static version — enable JavaScript for the film`

## 8. A11y baseline

### Landmarks

```html
<body>
  <a href="#content" class="skip-link">Skip to content</a>
  <header class="nav">...</header>
  <main id="content">
    <section aria-label="Hero">...</section>
    <section aria-label="Selected work">...</section>
    <section aria-label="About">...</section>
    <section aria-label="Contact">...</section>
    <section aria-label="End card">...</section>
  </main>
</body>
```

### Canvas a11y

```html
<canvas
  id="scene-canvas"
  role="img"
  aria-label="Interactive 3D sphere. Each face is a project category.
              Use keyboard shortcut J and K to cycle through projects."
></canvas>
```

### Live region

```html
<div aria-live="polite" id="scene-announcer" class="sr-only"></div>
```

SceneController dispatches: "Entered about section", "Entered contact", etc.

### Focus management

- nav links, inputs, buttons: focus-visible ring `--color-warm-signal`, 2px offset
- unfold opens a drawer → focus trap inside drawer → `Escape` closes, focus returns to triggering face
- command palette: focus trap

### Color contrast

All text passes AA (4.5:1) against its background:

- `--color-ink` (#ece7f5) on `--color-void` (#0a0816) → ratio ~14.2 ✓
- `--color-ink-dim` (#a9a1c4) on `--color-void` → ratio ~7.8 ✓
- `--color-ink-faint` (#6a6189) on `--color-void` → ratio ~4.1 ✗ — use only on non-essential text (HUD meta labels, small hints)

Flag: `--color-ink-faint` is intentionally sub-AA for dim labels. Document as understood limitation; never use for primary copy.

### Semantic HTML

- `<button>` not `<div role="button">`
- `<nav>`, `<article>`, `<aside>`, `<section>` with `aria-label`
- form labels associated via `for`
- case studies use `<article>` + `<h1>` through `<h3>`

### Keyboard shortcuts

All shortcuts discoverable via `?` overlay. Never override system shortcuts.

| key | action |
|-----|--------|
| `J` | next project/session |
| `K` | previous |
| `space` | pause sphere spin |
| `/` or `⌘K` | open command palette |
| `?` | show shortcuts |
| `M` | toggle audio mute |
| `ESC` | close overlays / drawers |
| `Tab` / `Shift-Tab` | standard focus cycle |
| `Enter` on focused face | unfold |

### Screen reader path

Screen-reader user experience should be:

1. Skip link appears first (focusable on tab)
2. Nav landmarks announced
3. Hero: serif heading, body paragraph, scroll hint
4. Work: section label + "8 projects available; press J K to navigate"
5. About: standard reading
6. Contact: form fields properly labeled
7. End: "SEE YOU SPACE COWBOY"

No scroll-triggered gymnastics; the document reads top-to-bottom.

## 9. Testing

- manual QA per device class in G1
- axe-core integration test in CI (fail on any violation)
- Lighthouse a11y audit ≥ 95 all pages
- VoiceOver + NVDA screen reader walk
- keyboard-only walk (unplug mouse)
- reduced-motion toggle walk
- pointer: coarse emulation walk
