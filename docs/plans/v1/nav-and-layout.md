---
name: Nav + Layout — base grid, nav behavior, footer
phase: cross-cutting (ships in B1 + C1)
status: ready
last_revised: 2026-04-19
---

# Nav + Layout

## 1. Base layout grid

Desktop ≥ 1280px:

- viewport-fluid; scenes fill 100vw × 100vh
- safe area inset: `--space-5` (24px) top/right/bottom/left
- max content width inside scenes: 1440px centered
- hero nameplate + about content allowed to bleed to edges

Tablet (768–1279):

- safe area `--space-4` (16px)
- nameplate scales via clamp
- HUD corners shrink one step

Mobile (< 768):

- safe area `--space-3` (12px)
- HUD reduced per hud-and-session-card.md §1
- nameplate single-line if possible, else two with tighter leading

## 2. Nav

### Desktop

Fixed position, top edge, full width, `--z-hud`. Transparent bg, grain + vignette visible through.

```
[logo · dot ·   JOSUE.APARCEDO ]   [01 WORK] [02 ABOUT] [03 DOCS] [04 CONTACT]   [AVAIL. FALL '26 →]   [▶ NOW PLAYING · Tank!]
```

- logo: amber dot + mono uppercase name, link to `#top`
- links: mono, `--text-xs`, uppercase, spacing `--space-5`, `[##]` in `--color-ink-faint`
- right cluster: availability + now-playing track
- active link: `--color-electric` underline that slides between items on hover using a shared indicator (FLIP or GSAP)

### On scroll

- position remains fixed
- bg adds a 1px bottom border `--color-border-soft` after 80px scroll
- during SHOT 03 beats 2–3: nav crossfades to 0.2 opacity; restores at beat 5
- during END CARD: nav opacity 0.15

### Mobile

- collapses to: logo (left) + menu icon (right)
- menu icon tap → full-screen overlay:
  - serif display section names (large)
  - mono `[##]` prefix
  - amber `CLOSE ×` bottom-right
  - backdrop `--color-void` with grain

### Keyboard / focus

- tab-reachable
- focus ring `--color-warm-signal`, 2px offset
- `Escape` closes mobile overlay

## 3. Footer

Only on `/docs/*` pages and 404. Homepage does not use a traditional footer — the END CARD closes the film.

```
© JOSUE APARCEDO · 2026        [EST clock]        [BUILT WITH ASTRO · THREE.JS]
```

Mono, `--text-xs`, `--color-ink-dim`, `--space-5` padding.

## 4. BaseLayout responsibilities

`src/layouts/BaseLayout.astro`:

- mounts `ScrollCoordinator`, `SceneController`, `AudioEngine`
- injects FilmGrain, Scanlines, Vignette overlays
- inlines critical CSS (tokens + nav + layout)
- preloads display + body fonts
- applies `data-scene` attribute on `<body>` per SceneController
- applies `data-reduced-motion`, `data-reduced-gpu` attributes

`src/layouts/MainLayout.astro`:

- wraps BaseLayout
- mounts Three.js canvas
- mounts nav + HUD

`src/layouts/DocsLayout.astro`:

- wraps BaseLayout
- mounts nav + SideNav + footer
- DOES NOT mount Three.js canvas

## 5. Scroll progress indicator

Optional accent, bottom of nav. 1px line, width = `scrollY / maxScroll * 100%`, `--color-violet-prime`. Only visible when `data-scene=work|dive|about|contact`. Hidden on hero.

## 6. Section anchors

- `#top` → hero
- `#work` → work
- `#about` → about-track (scrolls to start of dive)
- `#contact` → contact
- `#end` → end card (for back-to-top flows)

`scrollIntoView` replaced with `scrollCoordinator.scrollTo(...)` so Lenis handles it.

## 7. Files touched

```
src/components/layout/
  Nav.astro              NEW
  Footer.astro           NEW
  MobileMenu.astro       NEW
src/layouts/
  BaseLayout.astro       MOD
  MainLayout.astro       MOD
  DocsLayout.astro       MOD
src/styles/
  nav.css                NEW
  layout.css             NEW
```
