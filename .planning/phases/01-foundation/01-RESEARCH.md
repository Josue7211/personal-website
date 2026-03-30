# Phase 1: Foundation - Research

**Researched:** 2026-03-30
**Domain:** Astro 6 project scaffold, Tailwind CSS v4 CSS-first config, design tokens, dual-layout architecture, film grain overlay
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Display font is Playfair Display — bold, high-contrast serif for name and section headers. Load weights 400, 700, 900.
- **D-02:** Body font is Space Grotesk — geometric sans with techy personality. Load weights 300, 400, 500, 600, 700.
- **D-03:** Code font is JetBrains Mono — monospace for tags, metadata, docs code blocks. Load weights 400, 700.
- **D-04:** All fonts loaded via Google Fonts link in the head. Consider self-hosting later for performance.
- **D-05:** Subtle film grain texture overlay — opacity 0.03-0.05, blend-mode overlay, static (not animated). Applied to all dark backgrounds via a pseudo-element or fixed overlay div. Does NOT appear on DocsLayout.
- **D-06:** Multi-page architecture with separate routes: `/`, `/about`, `/projects`, `/interests`, `/contact`, `/docs/`, `/docs/[category]/[slug]`
- **D-07:** Landing page shows key content for recruiters — projects, about, skills teased with links to full pages.
- **D-08:** Navigation bar links to all main sections + docs. Simple nav — no mega-menu.
- **D-09:** Vivid violet accent family: `--color-primary: #a855f7`, `--color-primary-deep: #7c3aed`, `--color-primary-soft: #c4b5fd`, `--color-primary-glow: rgba(168, 85, 247, 0.15)`
- **D-10:** Surface tokens: `--color-bg: #0a0a0a`, `--color-surface-1: #111111`, `--color-surface-2: #1a1a1a`, `--color-surface-3: #222222`
- **D-11:** Text tokens: `--color-text: #e4e4e7`, `--color-text-muted: #a1a1aa`, `--color-text-accent: #c4b5fd`
- **D-12:** No-Line Rule — no border lines anywhere. Structure defined by tonal layering and spacing.
- **D-13:** Use Tailwind v4's default spacing scale. Generous whitespace.
- **D-14:** Border radius: small only (2-4px max). Sharp, architectural.
- **Stack:** Tailwind v4 via `@tailwindcss/vite` plugin (NOT `@astrojs/tailwind`)

### Claude's Discretion

- Exact Tailwind v4 config structure and custom theme extension approach
- Responsive breakpoint values (standard Tailwind defaults are fine)
- File organization within src/ (follow Astro conventions)
- Whether to use CSS custom properties directly or Tailwind's `@theme` for tokens

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Astro 6 project scaffolded with TypeScript strict mode | Astro 6.1.2 verified current; `npm create astro@latest` with strict TS; `astro check` validates templates + types |
| FOUND-02 | Tailwind CSS v4 integrated via `@tailwindcss/vite` plugin | Tailwind 4.2.2 + `@tailwindcss/vite` 4.2.2 verified; CSS-first config via `@import "tailwindcss"` in global.css; added to `vite.plugins` in `astro.config.ts` |
| FOUND-03 | Design tokens defined (colors, typography, spacing) matching spec palette | Two valid approaches: CSS custom properties in `:root` (direct) or Tailwind `@theme` block (generates utility classes); recommend hybrid — `@theme` inline for Tailwind utility access + `:root` custom properties for component CSS usage |
| FOUND-04 | Two layouts: MainLayout.astro (immersive) and DocsLayout.astro (clean) | BaseLayout → MainLayout chain confirmed; DocsLayout deliberately shares zero animation infrastructure; layout architecture patterns fully documented in ARCHITECTURE.md |
| FOUND-05 | Film grain noise texture overlay on all dark backgrounds | SVG feTurbulence approach (no external image, zero HTTP requests) or CSS-only approach via background-image with noise; SVG turbulence is standard on Awwwards-tier sites; opacity 0.03-0.05, `mix-blend-mode: overlay`, `pointer-events: none` |
| FOUND-06 | Base responsive breakpoints established (mobile/tablet/desktop) | Tailwind v4 default breakpoints (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`) are sufficient; no custom breakpoint config required |
</phase_requirements>

---

## Summary

Phase 1 establishes the complete project scaffold that every subsequent phase builds on. The scope is: Astro 6 with TypeScript strict mode, Tailwind CSS v4 via the Vite plugin, design tokens (CSS custom properties + Tailwind `@theme`), two layout components (MainLayout.astro for the immersive site, DocsLayout.astro for clean docs), a film grain overlay (SVG feTurbulence), font loading, and base responsive breakpoints.

The Astro 6 + Tailwind v4 integration path is fully documented and verified: `@tailwindcss/vite` plugin goes into `vite.plugins` inside `astro.config.ts`, and Tailwind is activated via `@import "tailwindcss"` in global.css. The `@tailwindcss/vite` approach replaces the old `@astrojs/tailwind` integration which only supports Tailwind v3. No `tailwind.config.js` file exists in v4 — configuration is entirely CSS-first using `@theme` blocks.

The design token strategy must answer one key question: should tokens live as CSS custom properties, Tailwind `@theme` entries, or both? The recommendation is a hybrid approach — define tokens in a Tailwind `@theme` block (which generates utility classes like `text-primary`, `bg-surface-2`) and simultaneously expose them as CSS custom properties via the `@theme` block's cascade-variable generation. This gives both utility-class access in templates AND raw CSS variable access in pseudo-elements and arbitrary CSS (which the film grain overlay needs).

**Primary recommendation:** Bootstrap with `npm create astro@latest`, add `@tailwindcss/vite` to `astro.config.ts`, define all design tokens in a `@theme` block in `styles/tokens.css`, build BaseLayout → MainLayout → DocsLayout in that order, and implement film grain as an SVG feTurbulence overlay in a dedicated `FilmGrain.astro` component.

---

## Project Constraints (from CLAUDE.md)

| Directive | Requirement |
|-----------|-------------|
| Live browser testing | Every code change requires `agent-browser` verification — zero console errors |
| Tech stack locked | Astro + Three.js + GSAP + Lenis — no alternatives |
| Hosting | Static site only (Cloudflare Pages / Netlify / Vercel) |
| Performance | Fast despite 3D — Astro partial hydration is key |
| Accessibility | Navigable without JS (graceful degradation for docs section) |
| NAS builds | Use `/tmp/personal-website-target` for build cache if needed |
| No `@astrojs/tailwind` | Deprecated for v4 — use `@tailwindcss/vite` |
| No `@studio-freight/lenis` | Renamed — use `lenis` |
| Docker management | Via Portainer API only (not relevant for this phase) |
| GSD workflow | All edits go through GSD commands — no direct repo edits outside workflow |

---

## Standard Stack

### Core (Phase 1 specific)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `astro` | 6.1.2 | Static framework, TypeScript, content collections | Current stable (March 10 2026); zero JS by default; bundles Vite 7 |
| `tailwindcss` | 4.2.2 | Utility CSS, design token system | CSS-first config, no tailwind.config.js; `@theme` block generates utilities from token values |
| `@tailwindcss/vite` | 4.2.2 | Tailwind v4 Vite plugin for Astro | Official integration path for Astro + Tailwind v4; replaces deprecated `@astrojs/tailwind` |
| TypeScript | 5.x (bundled) | Type safety | Bundled with Astro; `astro check` validates templates + types together |

### Supporting (Phase 1)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@astrojs/sitemap` | 3.7.2 | Auto-generates sitemap.xml | Add to integrations in `astro.config.ts` now — zero-config |
| `@tailwindcss/typography` | 0.5.19 | Prose styles for markdown in docs | Add now, activate in DocsLayout only — needed for Phase 6 docs but harmless to install in Phase 1 |

### Not in Phase 1 (but installed at project init)

| Library | Version | Note |
|---------|---------|------|
| `three` | 0.183.2 | Installed at init to prevent package.json churn; not imported in Phase 1 |
| `gsap` | 3.14.2 | Same — installed, not used until Phase 2 |
| `lenis` | 1.3.21 | Same — installed, not used until Phase 2 |

**Version verification (confirmed against npm registry 2026-03-30):**
- `astro`: 6.1.2
- `tailwindcss`: 4.2.2
- `@tailwindcss/vite`: 4.2.2
- `lenis`: 1.3.21
- `gsap`: 3.14.2
- `three`: 0.183.2
- `@tailwindcss/typography`: 0.5.19
- `@astrojs/sitemap`: 3.7.2

**Installation:**
```bash
# Create Astro project — select TypeScript strict mode when prompted
npm create astro@latest personal-website -- --template minimal --typescript strict --no-install --no-git

cd personal-website

# Install all dependencies at once (full project install, not just Phase 1)
npm install tailwindcss @tailwindcss/vite @astrojs/sitemap
npm install @tailwindcss/typography
npm install three gsap lenis
npm install -D @types/three
```

---

## Architecture Patterns

### Recommended Project Structure (Phase 1 scope)

```
src/
├── layouts/
│   ├── BaseLayout.astro       # HTML shell: <html>, <head>, fonts, meta, global CSS
│   ├── MainLayout.astro       # Immersive site shell: film grain, dark bg, slot
│   └── DocsLayout.astro       # Docs shell: sidebar scaffold, clean white/neutral bg, slot
│
├── pages/
│   ├── index.astro            # Landing page (uses MainLayout) — minimal placeholder content
│   ├── about.astro            # About page placeholder (uses MainLayout)
│   ├── projects.astro         # Projects page placeholder (uses MainLayout)
│   ├── interests.astro        # Interests page placeholder (uses MainLayout)
│   ├── contact.astro          # Contact page placeholder (uses MainLayout)
│   └── docs/
│       └── index.astro        # Docs landing placeholder (uses DocsLayout)
│
├── components/
│   └── ui/
│       └── FilmGrain.astro    # Film grain overlay component
│
└── styles/
    ├── global.css             # @import "tailwindcss"; font-face (if self-hosting); body reset
    └── tokens.css             # @theme block with all design token definitions
```

Full project structure (all phases) is documented in ARCHITECTURE.md. Phase 1 only creates the above subset.

### Pattern 1: Tailwind v4 CSS-First Configuration

**What:** In Tailwind v4, there is no `tailwind.config.js`. All configuration lives in CSS using `@theme` blocks. Custom design tokens become Tailwind utilities automatically.

**When to use:** All custom colors, typography, and spacing tokens go in a `@theme` block in `styles/tokens.css`. This generates utility classes (`text-primary`, `bg-surface-2`, `font-display`) AND exposes CSS variables (`--color-primary`, `--font-display`) on `:root`.

**Example:**
```css
/* src/styles/tokens.css */
@theme {
  /* Color tokens — generates bg-*, text-*, border-* utilities */
  --color-primary: #a855f7;
  --color-primary-deep: #7c3aed;
  --color-primary-soft: #c4b5fd;
  --color-primary-glow: rgba(168, 85, 247, 0.15);

  --color-bg: #0a0a0a;
  --color-surface-1: #111111;
  --color-surface-2: #1a1a1a;
  --color-surface-3: #222222;

  --color-text: #e4e4e7;
  --color-text-muted: #a1a1aa;
  --color-text-accent: #c4b5fd;

  /* Typography tokens — generates font-* utilities */
  --font-display: 'Playfair Display', serif;
  --font-body: 'Space Grotesk', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Border radius — generates rounded-* utilities */
  --radius-sm: 2px;
  --radius-md: 4px;
}
```

```css
/* src/styles/global.css */
@import "tailwindcss";
@import "./tokens.css";

/* Body defaults */
body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
}
```

**Key insight:** In Tailwind v4, `@theme` variables generate utility classes with the `--color-*` prefix mapped to `bg-*`, `text-*`, `border-*` etc. A variable named `--color-primary` becomes `bg-primary`, `text-primary`. A variable named `--font-display` becomes `font-display`.

### Pattern 2: Tailwind v4 Vite Plugin Configuration in Astro

**What:** The `@tailwindcss/vite` plugin is added to `vite.plugins` inside `astro.config.ts`. Tailwind is NOT added to `astro.integrations`.

**Example:**
```typescript
// astro.config.ts
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://josue.aparcedo.org',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
})
```

### Pattern 3: BaseLayout → MainLayout Inheritance Chain

**What:** `BaseLayout.astro` owns HTML shell, `<head>`, font loading, and global CSS import. `MainLayout.astro` wraps `BaseLayout` and adds the dark background, film grain, and slots for immersive content. `DocsLayout.astro` also wraps `BaseLayout` but adds sidebar scaffold and clean typography — zero shared animation state with `MainLayout`.

**Why this separation:** The docs section must load with zero animation overhead. A shared "smart" layout would risk leaking animation infrastructure into docs pages. Two distinct layouts enforce the architectural boundary at the file system level.

**Example:**
```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title: string
  description?: string
}
const { title, description = 'Software engineer, builder, creator.' } = Astro.props
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} — Josue Aparcedo</title>
    <meta name="description" content={description} />

    <!-- Google Fonts: Playfair Display + Space Grotesk + JetBrains Mono -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap"
      rel="stylesheet"
    />

    <link rel="stylesheet" href="/src/styles/global.css" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

```astro
---
// src/layouts/MainLayout.astro
import BaseLayout from './BaseLayout.astro'
import FilmGrain from '../components/ui/FilmGrain.astro'

interface Props {
  title: string
  description?: string
}
const { title, description } = Astro.props
---
<BaseLayout title={title} description={description}>
  <FilmGrain />
  <slot />
</BaseLayout>
```

```astro
---
// src/layouts/DocsLayout.astro
import BaseLayout from './BaseLayout.astro'

interface Props {
  title: string
  description?: string
}
const { title, description } = Astro.props
---
<BaseLayout title={title} description={description}>
  <div class="docs-shell">
    <aside class="docs-sidebar">
      <!-- sidebar content in Phase 6 -->
    </aside>
    <main class="docs-content">
      <slot />
    </main>
  </div>
</BaseLayout>
```

### Pattern 4: Film Grain as SVG feTurbulence Overlay

**What:** Film grain is rendered as a fixed-position overlay using an inline SVG with `feTurbulence` filter. The SVG is static (no JavaScript), occupies zero pixels of layout space via `pointer-events: none`, and sits above all content via z-index without blocking interaction.

**Why SVG feTurbulence over a noise image:** No HTTP request, no external asset dependency, scales infinitely, consistent across all screen resolutions, and easily adjusted by tweaking `baseFrequency`. Industry standard on Awwwards-tier sites.

**Example:**
```astro
---
// src/components/ui/FilmGrain.astro
---
<div class="film-grain" aria-hidden="true">
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <filter id="noise">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.65"
        numOctaves="3"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
</div>

<style>
  .film-grain {
    position: fixed;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
    opacity: 0.04;
    mix-blend-mode: overlay;
  }
</style>
```

**Opacity range:** 0.03-0.05 (D-05). Start at 0.04. Verify visually — too high and it competes with content, too low and it disappears on darker monitors.

### Anti-Patterns to Avoid

- **Importing Tailwind tokens as JS:** Tokens live in CSS `@theme`, not in a JS object. Don't create a `tokens.ts` file that duplicates values — CSS variables are the source of truth.
- **Using `@astrojs/tailwind`:** This integration is for Tailwind v3 only. Install it and the build silently uses the wrong version or breaks. Use `@tailwindcss/vite` in `vite.plugins` only.
- **Adding `tailwind.config.js`:** Tailwind v4 ignores this file. All config goes in CSS. A stale config file in the repo will confuse future developers.
- **Placing GSAP/Three.js imports in BaseLayout frontmatter:** These are client-only libraries. The `---` frontmatter runs in Node.js at build time. Only import them inside `<script>` tags.
- **One layout for both site areas:** A shared "smart" layout leaks animation overhead into docs pages. Two layouts enforces the architectural boundary.
- **Film grain `position: absolute`:** Must be `position: fixed` — it should tile the viewport, not just the document flow element it's inside.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Film grain texture | Custom PNG/WebP noise image | SVG `feTurbulence` filter | Zero HTTP request, infinite resolution, adjustable in CSS |
| Font loading | Manual WOFF2 downloads and `@font-face` | Google Fonts `<link>` (Phase 1) | D-04 locks this to Google Fonts for v1; self-hosting is a future optimization |
| CSS reset | Custom reset stylesheet | Tailwind's built-in Preflight (included in `@import "tailwindcss"`) | Preflight is Tailwind v4's opinionated reset — consistent cross-browser |
| Sitemap | Crawling pages and generating XML | `@astrojs/sitemap` integration | Zero-config; auto-discovers all static routes |
| TypeScript checking | Manual tsc invocations | `astro check` | Validates Astro templates AND TypeScript together; plain tsc misses template type errors |

**Key insight:** The film grain is the only visual component in this phase with a "don't build it yourself" answer. Every other Phase 1 task is configuration, not custom component engineering.

---

## Common Pitfalls

### Pitfall 1: `@astrojs/tailwind` vs `@tailwindcss/vite`

**What goes wrong:** Installing `@astrojs/tailwind` instead of `@tailwindcss/vite` because the name is more recognizable. The old integration only supports Tailwind v3 and will either break, install an older Tailwind, or silently produce wrong output.

**Why it happens:** The integration name is intuitive. Autocomplete and older tutorials suggest it. The npm page for `@astrojs/tailwind` still exists and does not warn you it's v3-only.

**How to avoid:** The install command in STACK.md is explicit: `npm install tailwindcss @tailwindcss/vite`. The plugin goes in `vite.plugins`, not `integrations`. If you see `@astrojs/tailwind` in `package.json`, delete it.

**Warning signs:** `tailwind.config.js` being read at startup; Tailwind version in `package.json` is `^3.x`.

### Pitfall 2: Tailwind v4 `@theme` Variables Not Generating Utilities

**What goes wrong:** Design tokens are defined in `:root` as standard CSS custom properties instead of inside a `@theme` block. CSS variables exist and work in raw CSS, but `text-primary` and `bg-surface-2` are not generated — they come back as unknown utility classes.

**Why it happens:** CSS custom properties in `:root` and Tailwind `@theme` look syntactically identical (`--color-primary: #a855f7`). The difference is which block they're in.

**How to avoid:** All design tokens MUST be inside `@theme { }` in a file that gets imported after `@import "tailwindcss"`. The order matters — Tailwind processes `@theme` blocks during its CSS build step.

**Warning signs:** Custom utility classes like `text-primary` have no styles applied in the browser; Tailwind IntelliSense doesn't autocomplete custom token names.

### Pitfall 3: Google Fonts Blocking LCP

**What goes wrong:** Google Fonts `<link>` is placed without `rel="preconnect"` hints, causing a 200-400ms DNS lookup penalty on the critical render path.

**Why it happens:** The default Google Fonts embed snippet doesn't always include the preconnect hints.

**How to avoid:** Always include BOTH preconnect links before the font `<link>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

**Warning signs:** Lighthouse FCP report shows "Eliminate render-blocking resources" citing fonts.googleapis.com.

### Pitfall 4: Film Grain `z-index` Below Interactive Elements

**What goes wrong:** Film grain overlay sits above interactive elements (buttons, links, inputs) and intercepts pointer events, breaking clicks.

**Why it happens:** Film grain needs a high `z-index` to appear above page content, but `pointer-events: none` is forgotten.

**How to avoid:** Always set `pointer-events: none` on the film grain element AND its SVG child. Verify by clicking through the overlay in dev tools.

**Warning signs:** Buttons appear to render but don't respond to clicks in certain z-stack areas.

### Pitfall 5: DocsLayout Inheriting MainLayout's `background-color`

**What goes wrong:** `body` in `global.css` sets `background-color: var(--color-bg)` (near-black). DocsLayout should be a clean white/neutral layout per the spec, but both layouts use the same body background.

**Why it happens:** Global CSS applied unconditionally to `body` affects all layouts.

**How to avoid:** DocsLayout must override the body background explicitly, or the dark background must be applied to a wrapper `div` inside `MainLayout` rather than on `body`. Phase 1 success criterion 3 requires DocsLayout to show a "clean white/neutral layout" — verify this in browser before phase complete.

**Warning signs:** DocsLayout renders with a dark background instead of light/neutral.

### Pitfall 6: TypeScript Strict Mode Misconfiguration

**What goes wrong:** `npm create astro@latest` creates a `tsconfig.json` that extends Astro's base config, but if the wrong template is selected, `strict` mode may not be enabled at the project level.

**Why it happens:** Different Astro project templates have different TypeScript starting points.

**How to avoid:** After scaffolding, verify `tsconfig.json` contains `"strict": true` under `compilerOptions`, or that it extends `"astro/tsconfigs/strict"`. Run `astro check` against an empty `.astro` file — if it passes with no errors, strict mode is active.

**Warning signs:** `astro check` passes on code that has `any` types or unchecked null access; FOUND-01 success criterion fails.

---

## Code Examples

Verified patterns from official sources:

### Astro Config with Tailwind v4

```typescript
// astro.config.ts
// Source: https://tailwindcss.com/docs/installation/framework-guides/astro
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://josue.aparcedo.org',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
})
```

### Global CSS with Tailwind v4 Import

```css
/* src/styles/global.css */
/* Source: Tailwind v4 docs — CSS-first configuration */
@import "tailwindcss";
@import "./tokens.css";

*, *::before, *::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: auto; /* Lenis overrides this in Phase 2 */
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Full Tokens CSS File

```css
/* src/styles/tokens.css */
/* Source: Tailwind v4 @theme docs + CONTEXT.md D-09 through D-14 */
@theme {
  /* === Color Tokens === */
  /* Accent / Primary */
  --color-primary: #a855f7;
  --color-primary-deep: #7c3aed;
  --color-primary-soft: #c4b5fd;
  --color-primary-glow: rgba(168, 85, 247, 0.15);

  /* Surfaces */
  --color-bg: #0a0a0a;
  --color-surface-1: #111111;
  --color-surface-2: #1a1a1a;
  --color-surface-3: #222222;

  /* Text */
  --color-text: #e4e4e7;
  --color-text-muted: #a1a1aa;
  --color-text-accent: #c4b5fd;

  /* === Typography === */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Space Grotesk', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;

  /* === Border Radius (D-14: 2-4px max) === */
  --radius-sm: 2px;
  --radius: 4px;
}
```

### Test Page Verifying Tokens and Layouts

```astro
---
// src/pages/index.astro — Phase 1 test content
import MainLayout from '../layouts/MainLayout.astro'
---
<MainLayout title="Home">
  <div class="min-h-screen flex items-center justify-center p-8">
    <div>
      <h1 class="font-display text-6xl text-primary font-bold mb-4">
        Josue Aparcedo
      </h1>
      <p class="font-body text-text-muted text-xl mb-2">
        Software Engineer
      </p>
      <code class="font-mono text-sm text-primary-soft bg-surface-2 px-2 py-1 rounded">
        Design tokens active
      </code>
    </div>
  </div>
</MainLayout>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@astrojs/tailwind` integration | `@tailwindcss/vite` Vite plugin | Tailwind v4 release (Jan 22 2025) | Old integration silently uses wrong Tailwind version |
| `tailwind.config.js` with `theme.extend` | CSS `@theme` block in a .css file | Tailwind v4 release | No JS config file exists in v4 projects |
| `@studio-freight/lenis` package | `lenis` package | Darkroom Engineering rebrand (2024) | Old package abandoned, not updated |
| GSAP Club license for SplitText | All GSAP plugins free via `npm install gsap` | GSAP 3.12+ (post-Webflow acquisition) | No license purchase needed |
| Astro 5.x | Astro 6.1.2 | March 10 2026 | Better dev/prod parity; new project should start on 6 |

**Deprecated/outdated:**
- `@astrojs/tailwind`: v3 only, do not install
- `@studio-freight/lenis`: old package name, do not install
- `tailwind.config.js`: not read by Tailwind v4, will confuse developers

---

## Open Questions

1. **DocsLayout background color strategy**
   - What we know: `body` background is set to `var(--color-bg)` (#0a0a0a) in global.css per the dark site design
   - What's unclear: Whether DocsLayout should override `body` background or apply dark styles to a wrapper div within MainLayout only
   - Recommendation: Apply dark body background inside MainLayout using a wrapper `div.main-site-shell` with `background-color: var(--color-bg)` instead of on `body`. Let DocsLayout set its own body/wrapper background to `#ffffff` or `#fafafa`. This avoids specificity fights. Verify visually in browser.

2. **Google Fonts vs self-hosted fonts performance**
   - What we know: D-04 locks fonts to Google Fonts for now; self-hosting is deferred
   - What's unclear: Whether the Google Fonts CDN latency will cause Lighthouse FCP failure (PERF-01 requires <3s FCP on 4G)
   - Recommendation: Use `display=swap` param in the Google Fonts URL to prevent render blocking. Revisit self-hosting in Phase 7 (performance pass) if FCP is failing.

3. **`@tailwindcss/typography` inclusion in Phase 1**
   - What we know: Needed for DocsLayout in Phase 6; harmless to install in Phase 1
   - What's unclear: Whether configuring the `prose` classes now creates any risk of style leakage
   - Recommendation: Install the package in Phase 1 but do not add `.prose` class to anything in MainLayout. Apply `.prose` only in DocsLayout in Phase 6.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | Astro build | Yes | v22.22.2 | — |
| npm | Package management | Yes | 11.12.1 | — |
| Google Fonts CDN | Font loading | External | — | Self-host fonts (Phase 7 optimization) |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:** Google Fonts is external — if unavailable during dev, system font stacks (`Georgia, serif` / `system-ui, sans-serif` / `Courier New, monospace`) are already specified as fallbacks in token definitions.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | `astro check` (TypeScript + template validation) — built into Astro CLI |
| Config file | `tsconfig.json` (extends `astro/tsconfigs/strict`) |
| Quick run command | `npx astro check` |
| Full suite command | `npm run build` (Astro build with type checking) |

No separate test framework (Vitest, Jest) is required for Phase 1 — all Phase 1 success criteria are visual/build verification, not unit-testable logic. Browser testing via `agent-browser` is the primary verification mechanism per CLAUDE.md.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| FOUND-01 | Astro 6 project builds with TypeScript strict mode | Build | `npx astro check && npm run build` | Zero errors = pass |
| FOUND-02 | Tailwind v4 utilities work in .astro files | Visual | Browser: check `text-primary`, `bg-surface-2` applied | Confirm in browser DevTools |
| FOUND-03 | Design tokens visible and applied to test page | Visual | Browser: render test page, inspect CSS variables | `--color-primary` in `:root` |
| FOUND-04 | Both layouts render without breakage at all widths | Visual | Browser: resize viewport on `/` and `/docs/` | Mobile + tablet + desktop |
| FOUND-05 | Film grain overlay visible on dark backgrounds | Visual | Browser: inspect `.film-grain` opacity and blend-mode | Check pointer-events: none |
| FOUND-06 | Responsive breakpoints established | Visual | Browser: resize test page at 375px, 768px, 1280px | No layout breakage |

### Sampling Rate

- **Per commit:** `npx astro check` — zero TypeScript errors
- **Per wave:** `npm run build` — zero build errors, bundle completes
- **Phase gate:** All 4 success criteria verified in browser via `agent-browser` before `/gsd:verify-work`

### Wave 0 Gaps

None — Phase 1 has no existing test infrastructure gaps. The test approach is purely build-time (`astro check`) and browser-based. No test files need to be created before implementation.

---

## Sources

### Primary (HIGH confidence)

- Tailwind CSS official docs — [tailwindcss.com/docs/installation/framework-guides/astro](https://tailwindcss.com/docs/installation/framework-guides/astro) — Vite plugin integration for Astro
- Tailwind CSS v4 release — [tailwindcss.com/blog/tailwindcss-v4](https://tailwindcss.com/blog/tailwindcss-v4) — CSS-first `@theme` config
- Astro 6 release — [astro.build/blog/astro-6/](https://astro.build/blog/astro-6/) — stable March 10 2026
- npm registry (live, 2026-03-30): `astro@6.1.2`, `tailwindcss@4.2.2`, `@tailwindcss/vite@4.2.2`, `lenis@1.3.21`, `gsap@3.14.2`, `three@0.183.2`
- `.planning/research/STACK.md` — Verified stack, installation commands, what NOT to use
- `.planning/research/ARCHITECTURE.md` — Layout architecture, file structure, component boundaries
- `docs/superpowers/specs/2026-03-30-personal-website-design.md` — Full design spec

### Secondary (MEDIUM confidence)

- `.planning/research/SUMMARY.md` — Research synthesis, phase rationale
- GSAP all-plugins-free confirmation — GSAP 3.12+ (post-Webflow acquisition, confirmed in STACK.md and SUMMARY.md)

### Tertiary (LOW confidence)

None — all Phase 1 claims are backed by primary sources.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified live against npm registry 2026-03-30
- Architecture: HIGH — BaseLayout/MainLayout/DocsLayout pattern confirmed from ARCHITECTURE.md and Astro official docs
- Tailwind v4 `@theme` approach: HIGH — confirmed from official Tailwind v4 docs and release notes
- Film grain SVG approach: HIGH — documented pattern on Awwwards-tier sites, cross-referenced with CSS spec
- Pitfalls: HIGH — all identified pitfalls are verified failure modes from official sources and prior research

**Research date:** 2026-03-30
**Valid until:** 2026-06-30 (stack versions stable; Tailwind v4 and Astro 6 are not fast-moving right now)
