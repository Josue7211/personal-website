# Architecture Research

**Domain:** Immersive personal website — Astro + Three.js + GSAP + Lenis + custom docs
**Researched:** 2026-03-30
**Confidence:** HIGH (Astro/content collections), MEDIUM (Lenis+GSAP integration patterns), HIGH (Three.js island strategy)

## Standard Architecture

### System Overview

```
┌───────────────────────────────────────────────────────────────┐
│                      BUILD TIME (Astro SSG)                    │
│  ┌─────────────────┐  ┌────────────────┐  ┌────────────────┐  │
│  │  .astro pages   │  │ content.config │  │  docs/*.md     │  │
│  │  (static HTML)  │  │  (Zod schemas) │  │  (collection)  │  │
│  └────────┬────────┘  └───────┬────────┘  └───────┬────────┘  │
│           └───────────────────┴───────────────────┘           │
│                               ↓                               │
│                    Astro Static Output (dist/)                 │
├───────────────────────────────────────────────────────────────┤
│                    RUNTIME — CLIENT SIDE                       │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                   Scroll Coordinator                     │  │
│  │      Lenis (smooth scroll source of truth)               │  │
│  │      lenis → gsap.ticker → ScrollTrigger.update          │  │
│  └──────────┬──────────────────────────┬────────────────────┘  │
│             │                          │                       │
│  ┌──────────▼──────────┐   ┌───────────▼───────────────────┐  │
│  │   Three.js Layer    │   │      GSAP Animation Layer     │  │
│  │  ParticleHero.ts    │   │  ScrollTrigger sections        │  │
│  │  ProjectScene.ts    │   │  SplitText text reveals        │  │
│  │  Renderer.ts        │   │  Clip-path transitions         │  │
│  └──────────┬──────────┘   └───────────────────────────────┘  │
│             │                                                  │
│  ┌──────────▼──────────────────────────────────────────────┐  │
│  │               DOM (Astro-generated HTML)                 │  │
│  │  #hero  #about  #projects  #interests  #contact          │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| `Layout.astro` | Root HTML shell, font loading, global CSS | Astro layout, provides `<slot/>` |
| `MainLayout.astro` | Immersive site shell — canvas mount, Lenis init | Extends base layout, injects scroll coordinator |
| `DocsLayout.astro` | Docs shell — sidebar, breadcrumbs, no 3D | Separate layout, content collections powered |
| `ParticleHero.ts` | Three.js particle field, mouse repulsion | Vanilla TS module, initialized by `<script>` in Hero.astro |
| `Renderer.ts` | Shared Three.js WebGLRenderer, camera, RAF | Singleton — shared across all Three.js modules |
| `ScrollCoordinator.ts` | Lenis instance + GSAP ticker sync | Module initialized once in MainLayout |
| `ScrollAnimations.ts` | All ScrollTrigger setups per section | Initialized after DOM ready, references section elements |
| `HeroSection.astro` | Particle canvas mount + initial text | Static HTML + `<script>` that triggers ParticleHero |
| `ProjectsSection.astro` | Full-viewport project showcases | Static HTML, animated by ScrollAnimations |
| `InterestsSection.astro` | Horizontal scroll gallery | Static HTML, pinned by ScrollTrigger containerAnimation |
| `DocsSidebar.astro` | Sidebar nav, auto-generated from collection | Queries content collection at build time |
| `[...slug].astro` | Docs page renderer | Dynamic route from content collection |

---

## Recommended Project Structure

```
src/
├── layouts/
│   ├── BaseLayout.astro        # HTML shell, fonts, meta tags
│   ├── MainLayout.astro        # Immersive site — canvas, Lenis, film grain
│   └── DocsLayout.astro        # Docs site — sidebar, TOC, no 3D
│
├── pages/
│   ├── index.astro             # Main site (uses MainLayout)
│   └── docs/
│       ├── index.astro         # Docs landing page
│       └── [...slug].astro     # Dynamic docs page route
│
├── content/
│   ├── docs/                   # All .md content files
│   │   ├── homelab/
│   │   │   └── docker-setup.md
│   │   ├── dev/
│   │   │   └── astro-guide.md
│   │   └── kb/
│   │       └── networking.md
│   └── content.config.ts       # Collection schema definitions
│
├── components/
│   ├── sections/               # Main site sections
│   │   ├── HeroSection.astro
│   │   ├── AboutSection.astro
│   │   ├── ProjectsSection.astro
│   │   ├── InterestsSection.astro
│   │   └── ContactSection.astro
│   ├── docs/                   # Docs-specific components
│   │   ├── DocsSidebar.astro
│   │   ├── DocsSearch.astro
│   │   └── DocsTOC.astro
│   └── ui/                     # Shared UI primitives
│       ├── FilmGrain.astro
│       └── PageTransition.astro
│
├── webgl/                      # All Three.js code (never imported by Astro templates directly)
│   ├── Renderer.ts             # Singleton WebGLRenderer + scene + camera
│   ├── ParticleHero.ts         # Hero particle system + mouse interaction
│   ├── ProjectScene.ts         # Per-project 3D accent elements
│   └── utils/
│       ├── dispose.ts          # Memory cleanup helpers
│       └── viewportToWorld.ts  # DOM-to-world coordinate mapping
│
├── animation/                  # All GSAP code
│   ├── ScrollCoordinator.ts    # Lenis init + gsap.ticker sync
│   ├── ScrollAnimations.ts     # All ScrollTrigger instances
│   ├── TextReveal.ts           # SplitText character/line reveals
│   └── PageTransition.ts       # Route transition orchestration
│
├── styles/
│   ├── global.css              # CSS custom properties, typography scale
│   ├── tokens.css              # Design tokens (colors, spacing)
│   └── docs.css                # Docs-only styles
│
└── lib/
    └── docs.ts                 # Content collection query helpers
```

### Structure Rationale

- **`webgl/` isolated from components:** Three.js modules are plain TypeScript — they must never be imported at the top of `.astro` files because that runs at build time on the server. They're loaded only via `<script>` tags, which Astro bundles for client-only execution.
- **`animation/` isolated from components:** Same principle — GSAP uses `window`, `document`, and the DOM. Keeping it separate prevents accidental SSR execution.
- **`layouts/` split by site area:** The docs section deliberately shares no visual infrastructure with the main site. A single "smart" layout would leak 3D overhead into the docs pages.
- **`content/docs/` organized by category:** The glob loader's folder structure becomes the sidebar hierarchy. Categories (homelab, dev, kb) are directories — no manual sidebar config needed.
- **`components/sections/` flat:** Main site sections are rendered once, in order, inside `index.astro`. No routing complexity needed here.

---

## Architectural Patterns

### Pattern 1: Vanilla Script Tags for Three.js and GSAP (not `client:only`)

**What:** All Three.js and GSAP code lives in `.ts` files under `webgl/` and `animation/`. These are referenced via standard `<script>` tags in `.astro` files. Astro bundles and tree-shakes them automatically.

**When to use:** Any time you need client-only JS that doesn't need a UI framework (React/Vue/Svelte). This is the correct pattern for Three.js and GSAP — they operate directly on the DOM and don't benefit from a component framework wrapper.

**Trade-offs:** Astro bundles and deduplicates these imports automatically. TypeScript support included. No hydration overhead. The downside: no hot module replacement for the Three.js canvas during development (a minor DX inconvenience).

**Example:**
```astro
<!-- HeroSection.astro -->
<section id="hero">
  <canvas id="hero-canvas"></canvas>
  <h1 class="hero-name">Josue Aparcedo</h1>
</section>

<script>
  // Astro processes this — bundled, TypeScript, deduped
  import { initParticleHero } from '../webgl/ParticleHero'
  import { getScrollCoordinator } from '../animation/ScrollCoordinator'

  const coordinator = getScrollCoordinator()
  initParticleHero('#hero-canvas', coordinator.lenis)
</script>
```

### Pattern 2: Single Lenis Instance as Scroll Source of Truth

**What:** One `ScrollCoordinator.ts` initializes Lenis and wires it to GSAP's ticker. All other modules receive the scroll value from this single source — never create a second Lenis instance or a competing `requestAnimationFrame` loop.

**When to use:** Mandatory whenever Lenis and ScrollTrigger coexist.

**Trade-offs:** Centralizes scroll state. The single coordinator must initialize before any ScrollTrigger is registered. Initialize in `MainLayout.astro`'s `<script>` before section scripts run.

**Example:**
```typescript
// animation/ScrollCoordinator.ts
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let instance: Lenis | null = null

export function getScrollCoordinator() {
  if (instance) return { lenis: instance }

  instance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  })

  instance.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    instance!.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  return { lenis: instance }
}
```

### Pattern 3: Content Collection with Hierarchical Sidebar Generation

**What:** Docs content lives in `src/content/docs/` organized by folder (category). At build time, `[...slug].astro` queries the collection, and `DocsSidebar.astro` queries all entries grouped by category to build the sidebar tree.

**When to use:** All docs pages. Avoids manual sidebar configuration — adding a file auto-registers it in the sidebar.

**Trade-offs:** The sidebar grouping logic must sort and group entries in a `getStaticPaths`-adjacent query, which adds a few lines of build-time code. Worth it to avoid a multi-hundred-line sidebar config JSON.

**Example:**
```typescript
// lib/docs.ts
import { getCollection } from 'astro:content'

export async function getDocsSidebar() {
  const entries = await getCollection('docs')
  const grouped: Record<string, typeof entries> = {}

  for (const entry of entries) {
    const category = entry.id.split('/')[0]
    grouped[category] ??= []
    grouped[category].push(entry)
  }

  return grouped
}
```

### Pattern 4: Horizontal Scroll via ScrollTrigger `containerAnimation`

**What:** The Interests section scrolls horizontally as the user scrolls vertically. The section is pinned, and individual cards animate in from the right. ScrollTrigger needs `containerAnimation` on child triggers to know their position within the horizontal track.

**When to use:** Only for the Interests horizontal gallery section.

**Trade-offs:** Lenis + horizontal scroll requires care — Lenis should not intercept horizontal scroll on the pinned container. Test thoroughly on mobile where touch directions conflict.

**Example:**
```typescript
// Horizontal scroll setup
const track = document.querySelector('#interests-track') as HTMLElement
const cards = document.querySelectorAll('.interest-card')

const horizontalTween = gsap.to(track, {
  x: () => -(track.scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: '#interests',
    pin: true,
    scrub: 1,
    end: () => `+=${track.scrollWidth}`,
  },
})

// Child triggers reference the parent tween
cards.forEach((card) => {
  gsap.from(card, {
    opacity: 0,
    y: 40,
    scrollTrigger: {
      trigger: card,
      containerAnimation: horizontalTween, // key line
      start: 'left 80%',
      toggleActions: 'play none none reverse',
    },
  })
})
```

---

## Data Flow

### Main Site — Scroll Flow

```
User scrolls (wheel / touch)
        ↓
   Lenis intercepts
        ↓
   Lenis emits 'scroll' event
        ↓
   ┌────────────────────────────────┐
   │  ScrollTrigger.update()        │  ← GSAP positions all pinned sections
   │  Three.js render(scrollY)      │  ← WebGL updates plane positions
   │  gsap.ticker (Lenis.raf)       │  ← Drives all GSAP tweens
   └────────────────────────────────┘
```

### Docs Page — Data Flow

```
Build time:
  src/content/docs/**/*.md
        ↓
  content.config.ts (Zod validation)
        ↓
  getCollection('docs') in [...slug].astro
        ↓
  getStaticPaths() → pre-renders all doc routes
        ↓
  render(entry) → <Content /> component

Runtime:
  User clicks sidebar link → standard browser navigation (no JS needed)
  DocsSearch → client-side pagefind index query
```

### Three.js DOM Sync Flow

```
Astro generates HTML with positioned section elements
        ↓
  ParticleHero.ts reads #hero-canvas dimensions
        ↓
  Creates Three.js scene sized to canvas
        ↓
  On window resize → updates camera aspect + renderer size
        ↓
  On mouse move → updates particle repulsion uniform
        ↓
  gsap.ticker drives requestAnimationFrame loop
```

---

## Scaling Considerations

This is a static site — there is no server to scale. Scaling concerns are purely about client performance.

| Concern | Mitigation |
|---------|------------|
| Three.js bundle size (~600KB gzip) | Code-split WebGL modules — only load what's on screen. ParticleHero only on homepage, ProjectScene only on scroll proximity. |
| ScrollTrigger instances accumulating | Kill all triggers on page unload — use `ScrollTrigger.getAll().forEach(t => t.kill())` |
| GPU memory from Three.js | Dispose geometries/materials when sections leave viewport: `geometry.dispose()`, `material.dispose()`, `renderer.dispose()` |
| Docs search at scale | Use pagefind (static site search, runs post-build) — handles hundreds of docs pages with zero runtime cost |
| Image-heavy projects section | Use Astro's built-in `<Image>` component — generates optimized WebP at multiple breakpoints at build time |

---

## Anti-Patterns

### Anti-Pattern 1: Initializing Three.js in an Astro Island (`client:only`)

**What people do:** Wrap the particle hero in a React or Svelte component and mount it with `client:only="react"`.

**Why it's wrong:** Adds a full UI framework runtime (React: ~40KB, Svelte: less but still) for code that has zero reactive state. Three.js doesn't need a component tree — it writes directly to a canvas. The `client:only` pattern was designed for components with reactive props/state.

**Do this instead:** Use a standard `<script>` tag in `HeroSection.astro`. Astro bundles and processes it. Three.js initializes on `DOMContentLoaded`. No framework overhead.

### Anti-Pattern 2: Multiple Lenis Instances or Competing RAF Loops

**What people do:** Each animated section creates its own `requestAnimationFrame` loop, or a component creates a second `new Lenis()`.

**Why it's wrong:** Two scroll systems fighting each other produces jank. Two RAF loops produce double renders. GSAP's ticker IS the RAF loop — anything else is redundant.

**Do this instead:** One `ScrollCoordinator.ts` singleton. All animation modules call `getScrollCoordinator()` and receive the shared Lenis instance. Three.js render loop uses `gsap.ticker`, not its own RAF.

### Anti-Pattern 3: Importing GSAP/Three.js at the Top Level of `.astro` Files

**What people do:**
```astro
---
// This runs on the SERVER during build
import { gsap } from 'gsap'       // window is undefined here
import * as THREE from 'three'    // canvas is undefined here
---
```

**Why it's wrong:** The frontmatter of `.astro` files runs in Node.js at build time. `window`, `document`, and `canvas` don't exist. This throws errors or produces broken bundles.

**Do this instead:** Import GSAP and Three.js only inside `<script>` tags in `.astro` files, or in `.ts` files that are themselves only referenced by `<script>` tags.

### Anti-Pattern 4: Using One Layout for Both Main Site and Docs

**What people do:** Create one "smart" layout that conditionally shows/hides the canvas and Lenis based on the current route.

**Why it's wrong:** The docs section must load instantly with zero animation overhead — it's a reference tool, not a cinematic experience. A shared layout always risks leaking scroll coordinators, Three.js canvases, or GSAP instances into the docs pages.

**Do this instead:** Two layouts. `MainLayout.astro` owns everything animation-related. `DocsLayout.astro` is a clean slate — just typography, sidebar, and readable content.

### Anti-Pattern 5: Manual Sidebar Config for Docs

**What people do:** Hardcode a sidebar tree in `astro.config.mjs` or a static JSON file, then manually update it every time a doc is added.

**Why it's wrong:** The list goes stale. New docs don't appear. Deleted docs throw broken link errors.

**Do this instead:** Build the sidebar from the content collection at build time. The folder structure of `src/content/docs/` is the sidebar structure. `getDocsSidebar()` in `lib/docs.ts` groups by category directory automatically.

---

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Lenis ↔ GSAP ScrollTrigger | `lenis.on('scroll', ScrollTrigger.update)` | Lenis drives ScrollTrigger, not the other way. Must be set up before any ScrollTrigger instance is created. |
| Lenis ↔ Three.js | Lenis scroll value passed into `renderer.render(scrollY)` | Three.js reads scroll value each frame from the coordinator, does not listen to Lenis directly |
| GSAP ScrollTrigger ↔ DOM | Direct DOM element references via `querySelector` | ScrollAnimations.ts must run after `DOMContentLoaded` |
| Content Collection ↔ Sidebar | Build-time `getCollection()` query | Sidebar is fully static — no client-side fetch needed |
| Main Site ↔ Docs | Standard `<a href="/docs">` navigation | Full page navigation — no shared JS state between the two |
| Pagefind ↔ Docs | Post-build index, client-side search widget | Pagefind runs as a build step after `astro build`, outputs static search index |

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Cloudflare Pages / Netlify / Vercel | Static output from `astro build` → deploy `dist/` | No adapter needed — pure static. Set build command to `astro build && npx pagefind --site dist` |
| Google Fonts / Self-hosted fonts | `@font-face` in `global.css` + `<link rel="preload">` in `BaseLayout.astro` | Preload Playfair Display and Inter subsets — critical path for first render |
| Pagefind | `npx pagefind --site dist` post-build | Generates `/pagefind/` directory alongside static output |

---

## Build Order (Phase Dependencies)

The architecture implies this build order for implementation:

1. **Foundation first:** `BaseLayout.astro`, design tokens (`tokens.css`), font loading. Everything depends on this.
2. **Scroll infrastructure:** `ScrollCoordinator.ts` (Lenis + GSAP ticker). Must exist before any animated section.
3. **Hero section:** Three.js renderer singleton + `ParticleHero.ts`. This is the first visible element — validates the whole WebGL stack.
4. **Remaining main site sections:** About → Projects → Interests → Contact. Each section adds `ScrollAnimations.ts` entries. Interests section adds horizontal scroll pattern.
5. **Content collection + docs layout:** `content.config.ts` schema → `DocsLayout.astro` → `DocsSidebar.astro` → `[...slug].astro` route. Self-contained, no dependency on main site animation code.
6. **Docs content:** Markdown files populate the collection. Only depends on step 5.
7. **Search:** Pagefind added as a post-build step after docs are complete.
8. **Performance + polish:** Code splitting, lazy Three.js loading, `<Image>` optimizations, film grain overlay, page transitions.

---

## Sources

- [Lenis GitHub — GSAP integration pattern](https://github.com/darkroomengineering/lenis)
- [Codrops — Building a Scroll-Revealed WebGL Gallery with GSAP, Three.js, Astro and Barba.js (Feb 2026)](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/)
- [Astro Docs — Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro Docs — Client-Side Scripts](https://docs.astro.build/en/guides/client-side-scripts/)
- [Astro Docs — Islands Architecture](https://docs.astro.build/en/concepts/islands/)
- [GSAP — ScrollTrigger + Lenis community forum patterns](https://gsap.com/community/forums/topic/34696-scrolltrigger-with-lenis/)
- [helm78/astro-gsap-lenis — Reference project](https://github.com/helm78/astro-gsap-lenis)

---
*Architecture research for: Immersive personal website (Astro + Three.js + GSAP + Lenis + custom docs)*
*Researched: 2026-03-30*
