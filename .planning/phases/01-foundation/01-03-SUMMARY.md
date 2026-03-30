---
phase: 01-foundation
plan: 03
subsystem: ui
tags: [astro, tailwind, three-js-prep, film-grain, layouts, svg, google-fonts]

requires:
  - phase: 01-02
    provides: design tokens (@theme block, CSS custom properties, Tailwind utility classes)
  - phase: 01-01
    provides: Astro 6 project scaffold with TypeScript strict mode and Tailwind v4

provides:
  - BaseLayout.astro — HTML shell with Google Fonts, global.css import, meta tags
  - MainLayout.astro — dark immersive layout with .main-site-shell wrapper and FilmGrain
  - DocsLayout.astro — clean light/neutral docs layout with sidebar + content columns
  - FilmGrain.astro — SVG feTurbulence grain overlay, opacity 0.04, mix-blend-mode overlay
  - Six page stubs covering all routes (/, /about, /projects, /interests, /contact, /docs)

affects: [phase-02, phase-03, phase-04, phase-05, phase-06, all future phases use these layouts]

tech-stack:
  added: []
  patterns:
    - "Layout chain: BaseLayout (HTML shell) -> MainLayout/DocsLayout (visual context)"
    - "Dark background set on .main-site-shell div, not body — prevents bleeding into DocsLayout"
    - "FilmGrain is SVG feTurbulence, position fixed, z-index 9999, pointer-events none"
    - "DocsLayout uses #fafafa background, flex two-column layout with 280px sidebar"
    - "All layouts import global.css via Astro frontmatter import (not link tag)"

key-files:
  created:
    - src/layouts/BaseLayout.astro
    - src/layouts/MainLayout.astro
    - src/layouts/DocsLayout.astro
    - src/components/ui/FilmGrain.astro
    - src/pages/index.astro
    - src/pages/about.astro
    - src/pages/projects.astro
    - src/pages/interests.astro
    - src/pages/contact.astro
    - src/pages/docs/index.astro
  modified: []

key-decisions:
  - "FilmGrain uses SVG feTurbulence with opacity 0.04 and mix-blend-mode overlay — subtle enough to add texture without overwhelming the content"
  - "DocsLayout contains NO FilmGrain — docs aesthetic is clean and functional, grain would reduce readability"
  - "BaseLayout imports global.css via frontmatter import statement (Vite-handled) — NOT a static link tag (Astro/Vite does not serve /src/ paths as static assets)"
  - "Google Fonts preconnect hints added before stylesheet link to mitigate DNS lookup penalty on LCP"
  - "Dark background (.main-site-shell) is scoped to MainLayout wrapper, not body — body has no background color per Pitfall 5 mitigation from Plan 02"

patterns-established:
  - "Pattern: All pages import a layout, layouts wrap BaseLayout — three-tier chain"
  - "Pattern: CSS variables (var(--color-bg), var(--font-display)) used in layout style blocks for token consumption"
  - "Pattern: FilmGrain component is stateless, purely decorative, aria-hidden"
  - "Pattern: Stub pages center content with flexbox min-height 100vh for layout verification"

requirements-completed: [FOUND-04, FOUND-05, FOUND-06]

duration: 12min
completed: 2026-03-30
---

# Phase 01 Plan 03: Layout Chain, FilmGrain, and Page Stubs Summary

**BaseLayout → MainLayout/DocsLayout chain with SVG feTurbulence film grain, Google Fonts (Playfair Display + Space Grotesk + JetBrains Mono), and 6 page stubs demonstrating design tokens**

## Performance

- **Duration:** 12 min
- **Started:** 2026-03-30T17:10:56Z
- **Completed:** 2026-03-30T17:23:00Z
- **Tasks:** 2 (+ checkpoint verification)
- **Files modified:** 10

## Accomplishments

- BaseLayout.astro: HTML shell with Google Fonts preconnect, global.css import, proper meta tags
- FilmGrain.astro: SVG feTurbulence grain overlay — opacity 0.04, mix-blend-mode overlay, position fixed, z-index 9999, pointer-events none on both wrapper and SVG
- MainLayout.astro: dark immersive layout wrapping BaseLayout — dark bg on .main-site-shell div (not body), includes FilmGrain
- DocsLayout.astro: clean two-column flex layout with #fafafa background, 280px sidebar, NO film grain
- 6 page stubs across all routes — index visually demonstrates all design tokens (colors, fonts, spacing)
- All pages build without errors, `astro check` reports zero TypeScript errors

## Task Commits

1. **Task 1: Build layout chain and FilmGrain component** - `70f0710` (feat)
2. **Task 2: Create page stubs for all routes** - `fd8195b` (feat)

**Plan metadata:** `[see final commit below]` (docs: complete plan)

## Files Created/Modified

- `src/layouts/BaseLayout.astro` — HTML shell, Google Fonts, global.css import, meta tags
- `src/layouts/MainLayout.astro` — dark layout wrapper with FilmGrain, .main-site-shell with var(--color-bg)
- `src/layouts/DocsLayout.astro` — clean light layout, flex two-column, #fafafa background
- `src/components/ui/FilmGrain.astro` — SVG feTurbulence grain overlay, opacity 0.04
- `src/pages/index.astro` — hero stub with design token visual demo (name, label, tagline, code)
- `src/pages/about.astro` — dark layout stub
- `src/pages/projects.astro` — dark layout stub
- `src/pages/interests.astro` — dark layout stub
- `src/pages/contact.astro` — dark layout stub
- `src/pages/docs/index.astro` — docs landing with DocsLayout

## Checkpoint Verification Results

**Human-verify checkpoint APPROVED** — browser testing confirmed by human on 2026-03-30.

**/ (homepage):**
- Dark near-black (#0a0a0a) background confirmed
- "Josue Aparcedo" renders in large Playfair Display serif, purple (#a855f7) color
- "PHASE 1 — FOUNDATION" label in JetBrains Mono, uppercase, muted gray
- "Software Engineer" tagline in Space Grotesk, muted color
- Token demo code block with dark surface (#1a1a1a) background and lavender text
- Film grain texture visible over dark background (very subtle, opacity 0.04)
- Mobile (375px): layout holds, text readable, no breakage

**/docs:**
- White/neutral (#fafafa) background — NOT dark
- Two-column flex layout visible (sidebar left at #f4f4f5, content right)
- NO film grain texture
- "Knowledge Base" heading

**All stub routes (/about, /projects, /interests, /contact):**
- All render with dark MainLayout, Playfair Display heading in purple
- Pages load without errors

**Console:** Zero JS errors on all pages confirmed.

## Decisions Made

- FilmGrain uses opacity 0.04 as specified in D-05 — tested visually, confirmed subtle enough
- BaseLayout imports global.css via Astro frontmatter import (Vite bundled), not a static link tag
- Preconnect hints added for both fonts.googleapis.com and fonts.gstatic.com (crossorigin on gstatic)
- Dark background scoped to .main-site-shell, not body — critical for DocsLayout isolation

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None — build passed on first attempt. `astro check` reported zero errors. All screenshots confirmed correct visual output.

## User Setup Required

None — no external service configuration required.

## Known Stubs

The following pages are intentional stubs that will be replaced in Phase 5:
- `src/pages/about.astro` — placeholder content, real about section in Phase 5
- `src/pages/projects.astro` — placeholder content, real projects showcase in Phase 5
- `src/pages/interests.astro` — placeholder content, real interests section in Phase 5
- `src/pages/contact.astro` — placeholder content, real contact section in Phase 5
- `src/pages/docs/index.astro` — placeholder content, full docs in Phase 6

These stubs are intentional scaffolding — they correctly demonstrate the layout chain and design tokens. The plan's goal (proving layouts work end-to-end) is achieved. No stub prevents the plan objective from being met.

## Next Phase Readiness

Phase 1 Foundation is now complete:
- Astro 6 project with TypeScript strict mode
- Tailwind v4 via @tailwindcss/vite with full design token system
- BaseLayout → MainLayout → DocsLayout chain ready for all future phases
- FilmGrain component ready to use on all dark-aesthetic pages
- All routes scaffolded and ready to receive real content

Phase 2 (Three.js hero) can import MainLayout directly and build within the established layout chain.

---
*Phase: 01-foundation*
*Completed: 2026-03-30*

## Self-Check: PASSED

- src/layouts/BaseLayout.astro: FOUND
- src/layouts/MainLayout.astro: FOUND
- src/layouts/DocsLayout.astro: FOUND
- src/components/ui/FilmGrain.astro: FOUND
- src/pages/index.astro: FOUND
- src/pages/docs/index.astro: FOUND
- Task 1 commit 70f0710: FOUND
- Task 2 commit fd8195b: FOUND
