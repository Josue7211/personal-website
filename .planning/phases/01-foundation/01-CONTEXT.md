# Phase 1: Foundation - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Scaffold the Astro 6 project with TypeScript strict mode, Tailwind CSS v4, design tokens (colors, typography, spacing), two layouts (MainLayout + DocsLayout), film grain overlay, and base responsive breakpoints. No animations, no Three.js, no content — just the skeleton everything else builds on.

</domain>

<decisions>
## Implementation Decisions

### Typography
- **D-01:** Display font is **Playfair Display** — bold, high-contrast serif for name and section headers. Load weights 400, 700, 900.
- **D-02:** Body font is **Space Grotesk** — geometric sans with techy personality. Load weights 300, 400, 500, 600, 700.
- **D-03:** Code font is **JetBrains Mono** — monospace for tags, metadata, docs code blocks. Load weights 400, 700.
- **D-04:** All fonts loaded via Google Fonts link in the head. Consider self-hosting later for performance.

### Film Grain
- **D-05:** Subtle film grain texture overlay — opacity 0.03-0.05, blend-mode overlay, static (not animated). Applied to all dark backgrounds via a pseudo-element or fixed overlay div. Adds warmth without distraction. Does NOT appear on DocsLayout.

### Layout Structure
- **D-06:** Multi-page architecture with separate routes:
  - `/` — Landing/hero page. Shows the important stuff for recruiters: name, tagline, featured projects teaser, about teaser, skills. The "wow" page.
  - `/about` — Full about section
  - `/projects` — Full projects showcase
  - `/interests` — Life/interests section
  - `/contact` — Contact page
  - `/docs/` — Knowledge base (DocsLayout)
  - `/docs/[category]/[slug]` — Individual guide
- **D-07:** Landing page shows key content for recruiters — projects, about, skills are teased on the landing page with links to their full pages. A recruiter should get the full picture from the landing page alone.
- **D-08:** Navigation bar links to all main sections + docs. Simple nav — no complex mega-menu. Just logo + page links + docs link.

### Color Tokens
- **D-09:** Vivid violet accent family:
  - `--color-primary`: #a855f7 (vivid purple — main accent)
  - `--color-primary-deep`: #7c3aed (deeper violet — ambient glows, hover states)
  - `--color-primary-soft`: #c4b5fd (lavender — subtle highlights, muted accents)
  - `--color-primary-glow`: rgba(168, 85, 247, 0.15) (glow effects)
- **D-10:** Surface/background tokens:
  - `--color-bg`: #0a0a0a (near-black base)
  - `--color-surface-1`: #111111 (first tonal layer)
  - `--color-surface-2`: #1a1a1a (second tonal layer — cards, sections)
  - `--color-surface-3`: #222222 (third tonal layer — elevated elements)
- **D-11:** Text tokens:
  - `--color-text`: #e4e4e7 (warm off-white — primary text)
  - `--color-text-muted`: #a1a1aa (secondary/muted text)
  - `--color-text-accent`: #c4b5fd (accent text — labels, tags)
- **D-12:** No-Line Rule — no border lines anywhere. Structure defined by tonal layering (surface token shifts) and spacing. No 1px solid borders for sectioning.

### Spacing & Layout
- **D-13:** Use Tailwind v4's default spacing scale. Generous whitespace — when in doubt, add more.
- **D-14:** Border radius: small only (2-4px max). Sharp, architectural. No large rounded corners.

### Claude's Discretion
- Exact Tailwind v4 config structure and custom theme extension approach
- Responsive breakpoint values (standard Tailwind defaults are fine)
- File organization within src/ (follow Astro conventions)
- Whether to use CSS custom properties directly or Tailwind's @theme for tokens

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Astro Setup
- `.planning/research/STACK.md` — Verified stack versions, installation commands, what NOT to use
- `.planning/research/ARCHITECTURE.md` — Two-layout architecture, file structure, component boundaries

### Design System
- `docs/superpowers/specs/2026-03-30-personal-website-design.md` — Full design spec with color palette, typography, design principles
- `.planning/research/SUMMARY.md` — Research synthesis with key findings

### Project Context
- `.planning/PROJECT.md` — Project vision, constraints, key decisions

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
None — greenfield project.

### Established Patterns
None — this phase establishes patterns for all subsequent phases.

### Integration Points
- MainLayout.astro will be the base for all immersive pages (hero, about, projects, interests, contact)
- DocsLayout.astro will be the base for all docs pages
- Design tokens (CSS custom properties) will be consumed by every component in every phase

</code_context>

<specifics>
## Specific Ideas

- Landing page must show enough content for a recruiter to get the full picture without navigating further — tease projects, about, skills on the hero/landing page
- Docs link in nav bar is sufficient — no complex gateway needed from landing to docs
- Playfair Display at massive scale for name (think Lando Norris level — viewport-spanning type)
- Film grain adds analog warmth to the digital noir aesthetic but should never compete with content

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-30*
