---
phase: 01-foundation
plan: 02
subsystem: ui
tags: [tailwind, css, design-tokens, typography, astro]

# Dependency graph
requires:
  - phase: 01-01
    provides: Astro 6 project scaffold with Tailwind v4 installed via @tailwindcss/vite
provides:
  - Tailwind v4 @theme block with 11 color tokens, 3 font tokens, 2 radius tokens
  - global.css wiring Tailwind + tokens + body defaults
  - CSS custom properties accessible at :root for arbitrary CSS use
  - Tailwind utility classes: bg-primary, text-primary, bg-surface-2, font-display, font-body, font-mono
affects: [01-03, 02-animation, 03-hero, 04-transitions, 05-content, 06-docs, 07-polish]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Tailwind v4 CSS-first @theme block for token definition (no tailwind.config.js)"
    - "body background-color NOT set globally — each layout owns its own background"
    - "tokens.css imported after tailwindcss in global.css (order matters)"

key-files:
  created:
    - src/styles/tokens.css
    - src/styles/global.css
  modified: []

key-decisions:
  - "Pitfall 5 mitigation: background-color omitted from body in global.css — each layout (MainLayout, DocsLayout) sets its own background on its wrapper div to prevent near-black bleeding into docs layout"
  - "All tokens in single @theme block — generates both utility classes and CSS custom properties simultaneously, no separate :root needed"

patterns-established:
  - "Pattern: @theme block in tokens.css is the single source of truth for all design values — add tokens here, not in :root blocks or inline styles"
  - "Pattern: global.css structure is @import tailwindcss → @import tokens → resets → html → body (no backgrounds)"

requirements-completed: [FOUND-03, FOUND-06]

# Metrics
duration: 2min
completed: 2026-03-30
---

# Phase 01 Plan 02: Design Token System Summary

**Tailwind v4 @theme design token system with 16 tokens (colors/typography/radius) generating utility classes and CSS custom properties from a single source of truth**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-30T17:06:30Z
- **Completed:** 2026-03-30T17:08:05Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Design token system established as single source of truth for all 7 phases
- Tailwind v4 @theme block generates utility classes (bg-primary, text-primary, font-display, etc.) AND CSS custom properties (var(--color-primary)) simultaneously — no duplication needed
- Pitfall 5 mitigation applied: body has no background-color; each layout owns its own background to prevent near-black surface bleeding into DocsLayout

## Task Commits

1. **Task 1: Create design tokens CSS file** - `61978e5` (feat)
2. **Task 2: Create global CSS with Tailwind import and body defaults** - `3090109` (feat)

## Files Created/Modified

- `src/styles/tokens.css` — @theme block with all design tokens; generates utility classes + CSS custom properties
- `src/styles/global.css` — @import "tailwindcss" (line 1) + @import tokens + box-model reset + scroll-behavior + body font/color defaults (no background)

## Token Reference

### Colors — Utility classes and CSS vars generated
| Token | Value | Utility Classes Generated |
|-------|-------|--------------------------|
| --color-primary | #a855f7 | bg-primary, text-primary, border-primary |
| --color-primary-deep | #7c3aed | bg-primary-deep, text-primary-deep |
| --color-primary-soft | #c4b5fd | bg-primary-soft, text-primary-soft |
| --color-primary-glow | rgba(168, 85, 247, 0.15) | bg-primary-glow |
| --color-bg | #0a0a0a | bg-bg |
| --color-surface-1 | #111111 | bg-surface-1 |
| --color-surface-2 | #1a1a1a | bg-surface-2 |
| --color-surface-3 | #222222 | bg-surface-3 |
| --color-text | #e4e4e7 | text-text |
| --color-text-muted | #a1a1aa | text-text-muted |
| --color-text-accent | #c4b5fd | text-text-accent |

### Typography
| Token | Value | Utility Class |
|-------|-------|---------------|
| --font-display | 'Playfair Display', Georgia, serif | font-display |
| --font-body | 'Space Grotesk', system-ui, sans-serif | font-body |
| --font-mono | 'JetBrains Mono', 'Courier New', monospace | font-mono |

### Border Radius (D-14: sharp, architectural)
| Token | Value | Utility Class |
|-------|-------|---------------|
| --radius-sm | 2px | rounded-sm |
| --radius | 4px | rounded |

## Decisions Made

- **No background-color on body (Pitfall 5):** Each layout sets its own background on its wrapper div. MainLayout will set `bg-bg` (#0a0a0a) on its wrapper; DocsLayout will set its own neutral background. This prevents the near-black main site background from bleeding into the clean docs layout during the transition or when both share the same body tag.
- **Single @theme block:** All tokens in one block in tokens.css. No separate :root block needed — @theme handles both CSS var generation and utility class generation in Tailwind v4.

## Deviations from Plan

None — plan executed exactly as written.

Minor: tokens.css file had a comment header on first line; adjusted global.css to match acceptance criteria requiring `@import "tailwindcss"` on line 1 exactly (moved comment to line 3).

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Plan 03 (layouts + nav) can now import global.css in BaseLayout.astro via `import '../styles/global.css'`
- All Tailwind utility classes are available across the entire project once global.css is imported in the layout
- Font files are not yet loaded (Google Fonts link in `<head>` is Plan 03's responsibility in BaseLayout.astro)
- No blockers

---
*Phase: 01-foundation*
*Completed: 2026-03-30*
