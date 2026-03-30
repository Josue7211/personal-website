# Roadmap: Personal Website — josue.aparcedo.org

## Overview

Seven phases deliver a cinematic, immersive personal portfolio with a unified knowledge base. The order is dependency-driven: foundation scaffolding must exist before scroll infrastructure, scroll infrastructure must be verified before any animated section is built on top of it, the Three.js hero validates the full WebGL pipeline, page transition cleanup patterns must be established before content sections add GSAP timelines (to prevent double-fire and SplitText re-wrap bugs), content sections follow once cleanup hooks are in place, the docs section is architecturally isolated and builds cleanly last among main features, and performance/deployment is the final pass once the full application exists to measure.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Astro 6 scaffold, Tailwind v4, design tokens, layouts, film grain, responsive base
- [ ] **Phase 2: Scroll Infrastructure** - Lenis + GSAP ScrollTrigger sync verified before any section builds on top
- [ ] **Phase 3: Hero Section** - Three.js particle field, mouse repulsion, device quality tiers, GPU disposal
- [ ] **Phase 4: Page Transitions** - GSAP Context cleanup patterns established before content sections add timelines
- [ ] **Phase 5: Content Sections** - About, Projects, Interests/Life, Navigation, Contact/Footer
- [ ] **Phase 6: Docs Section** - Knowledge base with sidebar, search, markdown content, purple aesthetic
- [ ] **Phase 7: Performance and Deployment** - Lighthouse 80+, Cloudflare Pages, OpenGraph, sitemap

## Phase Details

### Phase 1: Foundation
**Goal**: A running Astro 6 project exists with all design tokens, layouts, and visual base established — every subsequent phase builds on a stable scaffold
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06
**Success Criteria** (what must be TRUE):
  1. `npm run build` completes with zero errors and TypeScript strict mode active
  2. Design token CSS variables (purple palette, typography scale, spacing) are visible and applied to a rendered test page
  3. MainLayout.astro shows the film grain overlay on a dark background; DocsLayout.astro shows a clean white/neutral layout — both render at mobile, tablet, and desktop widths without layout breakage
  4. Tailwind v4 utility classes work in `.astro` files (confirmed via browser)
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Astro 6 project scaffold, Tailwind v4 integration, all dependencies installed
- [x] 01-02-PLAN.md — Design tokens (colors, typography, border radius) in @theme block
- [x] 01-03-PLAN.md — Layout chain (BaseLayout, MainLayout, DocsLayout), FilmGrain, page stubs

### Phase 2: Scroll Infrastructure
**Goal**: Lenis smooth scroll and GSAP ScrollTrigger are synchronized via the correct ticker pattern and verified with a pinned test section — every scroll-driven animation in subsequent phases builds on this proven foundation
**Depends on**: Phase 1
**Requirements**: SCRL-01, SCRL-02, SCRL-03, SCRL-04
**Success Criteria** (what must be TRUE):
  1. Scrolling the main site feels smooth and normalized across desktop Chrome, Firefox, and mobile Safari (no jitter, no scroll stutter)
  2. A pinned test section stays pinned exactly while its ScrollTrigger progress advances — no blank spacer gaps, no premature unpin
  3. Enabling `prefers-reduced-motion` in the OS makes the test section's animation disappear while scroll itself still works
  4. `ScrollCoordinator.ts` singleton is importable and initializes without console errors
**Plans**: TBD

### Phase 3: Hero Section
**Goal**: The Three.js particle field fills the viewport, responds to mouse movement with magnetic repulsion, and resolves within 2 seconds — the WebGL pipeline is fully proven and GPU memory disposal is wired before any other 3D content is added
**Depends on**: Phase 2
**Requirements**: HERO-01, HERO-02, HERO-03, HERO-04, HERO-05, HERO-06, HERO-07
**Success Criteria** (what must be TRUE):
  1. Visiting the homepage on desktop: particle field appears within 2 seconds, "JOSUE APARCEDO" renders in large serif type over it, and moving the mouse causes visible magnetic repulsion on nearby particles
  2. Visiting on a mid-range mobile device: a lower-particle-count version renders without dropped frames; on a very low-end device, a CSS/static fallback renders instead of WebGL
  3. `prefers-reduced-motion` enabled: particles are static (no animation), name still appears
  4. Navigating away from the page and back does not cause WebGL context loss, memory growth (verified via `renderer.info.memory`), or console errors
  5. The scroll indicator below the tagline is visible and functional
**Plans**: TBD
**UI hint**: yes

### Phase 4: Page Transitions
**Goal**: GSAP Context cleanup and SplitText revert patterns are established and working on every navigation event — content sections added in Phase 5 inherit these patterns automatically and never fire twice
**Depends on**: Phase 3
**Requirements**: TRANS-01, TRANS-02, TRANS-03, TRANS-04
**Success Criteria** (what must be TRUE):
  1. Navigating between any two pages produces a visible smooth transition (no hard cut, no white flash)
  2. Navigating from the main site into the docs section produces a distinct gateway transition (tone shift from immersive to clean)
  3. Navigating to a page a second time does not cause animations to fire twice, SplitText to double-wrap spans, or console errors
  4. The Three.js canvas is cleanly disposed before any page transition completes (zero WebGL errors in console after multi-page navigation)
**Plans**: TBD
**UI hint**: yes

### Phase 5: Content Sections
**Goal**: The complete main site experience is navigable — About, Projects, Interests, Navigation, and Contact all animate in correctly via the established GSAP + ScrollTrigger patterns and render the real content
**Depends on**: Phase 4
**Requirements**: ABOUT-01, ABOUT-02, ABOUT-03, ABOUT-04, PROJ-01, PROJ-02, PROJ-03, PROJ-04, PROJ-05, PROJ-06, LIFE-01, LIFE-02, LIFE-03, LIFE-04, CONT-01, CONT-02, CONT-03, NAV-01, NAV-02, NAV-03
**Success Criteria** (what must be TRUE):
  1. Scrolling past the hero reveals the About section: photo and text animate in, photo shifts slightly on continued scroll (parallax), and stats/counters are visible
  2. Continuing to scroll reveals the Projects section: each of the 3+ projects takes over the full viewport in sequence, its title and description animate in via clip-path reveal, and category filters (Web / Infrastructure / Hardware) work
  3. The Interests section scrolls horizontally when the user scrolls vertically — cards reveal correctly and have visible hover states
  4. The nav bar is present on all main site pages, adapts its theme per section, and on mobile collapses to a hamburger that opens a full-screen overlay
  5. The Contact section and footer render correctly at the bottom of the page with all social links functional
**Plans**: TBD
**UI hint**: yes

### Phase 6: Docs Section
**Goal**: The docs knowledge base is live and functional — visitors can read guides, search content, and navigate the sidebar — all under the same purple dark aesthetic as the main site
**Depends on**: Phase 1
**Requirements**: DOCS-01, DOCS-02, DOCS-03, DOCS-04, DOCS-05, DOCS-06, DOCS-07, DOCS-08
**Success Criteria** (what must be TRUE):
  1. Navigating to `/docs` shows a clean sidebar with collapsible category navigation; clicking a category expands it and clicking a guide navigates to that guide's page
  2. A guide page renders its markdown content with syntax-highlighted code blocks, breadcrumbs showing the current location, and no GSAP/Three.js JS loading (confirmed via browser network tab)
  3. The Pagefind search widget returns relevant results when queried against the published guide content
  4. On mobile, the sidebar collapses and is accessible via a toggle — content is readable at 375px width
  5. At least 2 complete guides are published and readable at launch
**Plans**: TBD
**UI hint**: yes

### Phase 7: Performance and Deployment
**Goal**: The site is live at josue.aparcedo.org, loads fast enough to satisfy the 2-second first impression, passes Lighthouse 80+ on desktop, and is discoverable via search engines
**Depends on**: Phase 5, Phase 6
**Requirements**: PERF-01, PERF-02, PERF-03, PERF-04, DEPLOY-01, DEPLOY-02, DEPLOY-03, DEPLOY-04
**Success Criteria** (what must be TRUE):
  1. `https://josue.aparcedo.org` loads in a browser and shows the particle hero within 3 seconds on a throttled 4G connection (Chrome DevTools Fast 4G)
  2. Lighthouse desktop performance score is 80 or higher; mobile score is above 70
  3. Docs pages show zero Three.js or GSAP in their JS bundle (confirmed via Rollup bundle analysis)
  4. Sharing the URL on Slack or Twitter shows a correct OpenGraph preview card with title, description, and image
  5. `sitemap.xml` is accessible at the root and lists all public pages
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

Note: Phase 6 (Docs) depends only on Phase 1 — it is architecturally isolated from Phases 2-5. In a single-developer context it is sequenced after Phase 5 for simplicity. Phase 7 depends on both Phase 5 and Phase 6 being complete.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/3 | In Progress|  |
| 2. Scroll Infrastructure | 0/? | Not started | - |
| 3. Hero Section | 0/? | Not started | - |
| 4. Page Transitions | 0/? | Not started | - |
| 5. Content Sections | 0/? | Not started | - |
| 6. Docs Section | 0/? | Not started | - |
| 7. Performance and Deployment | 0/? | Not started | - |
