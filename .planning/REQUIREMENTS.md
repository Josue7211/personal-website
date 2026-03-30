# Requirements: Personal Website — josue.aparcedo.org

**Defined:** 2026-03-30
**Core Value:** The site must make a lasting first impression within 2 seconds and let visitors explore projects, interests, and technical writing without friction.

## v1 Requirements

### Foundation

- [ ] **FOUND-01**: Astro 6 project scaffolded with TypeScript strict mode
- [ ] **FOUND-02**: Tailwind CSS v4 integrated via @tailwindcss/vite plugin
- [ ] **FOUND-03**: Design tokens defined (colors, typography, spacing) matching spec palette
- [ ] **FOUND-04**: Two layouts: MainLayout.astro (immersive) and DocsLayout.astro (clean)
- [ ] **FOUND-05**: Film grain noise texture overlay on all dark backgrounds
- [ ] **FOUND-06**: Base responsive breakpoints established (mobile/tablet/desktop)

### Scroll Infrastructure

- [ ] **SCRL-01**: Lenis smooth scroll initialized as singleton ScrollCoordinator
- [ ] **SCRL-02**: GSAP ScrollTrigger synced with Lenis via ticker (lagSmoothing(0))
- [ ] **SCRL-03**: Scroll system verified with a pinned test section before building on top
- [ ] **SCRL-04**: prefers-reduced-motion respected — animations disabled when user prefers

### Hero Section

- [ ] **HERO-01**: Three.js particle field fills viewport on page load
- [ ] **HERO-02**: "JOSUE APARCEDO" renders in massive serif typography over particle field
- [ ] **HERO-03**: Cursor creates magnetic repulsion effect on nearby particles
- [ ] **HERO-04**: Particles resolve/coalesce within 2 seconds (no separate loading screen)
- [ ] **HERO-05**: Three device quality tiers: high (desktop), medium (tablet), low (mobile)
- [ ] **HERO-06**: GPU memory properly disposed on navigation away (geometry, material, renderer)
- [ ] **HERO-07**: Subtitle/tagline and scroll indicator below name

### About Section

- [ ] **ABOUT-01**: Split layout — photo on one side, personal story text on other
- [ ] **ABOUT-02**: Photo has subtle parallax depth shift on scroll
- [ ] **ABOUT-03**: Text animates in line-by-line with staggered GSAP reveals
- [ ] **ABOUT-04**: Stats/counters section (years coding, projects shipped, etc.)

### Projects Section

- [ ] **PROJ-01**: Full-viewport project showcases — each project takes over the screen on scroll
- [ ] **PROJ-02**: Background shifts color/mood per project via clip-path or tonal transition
- [ ] **PROJ-03**: Category filters: Web Apps / Infrastructure / Hardware
- [ ] **PROJ-04**: Each project displays: title, description, tech stack tags, image, link
- [ ] **PROJ-05**: Images/details animate in with clip-path reveals
- [ ] **PROJ-06**: Minimum 3 projects showcased at launch

### Interests / Life Section

- [ ] **LIFE-01**: Horizontal scroll gallery triggered by vertical scrolling
- [ ] **LIFE-02**: Cards for hobbies, interests, passions
- [ ] **LIFE-03**: Each card has hover state revealing more depth
- [ ] **LIFE-04**: Section uses GSAP containerAnimation for horizontal scroll + Lenis compatibility

### Contact / Footer

- [ ] **CONT-01**: Contact section with GitHub, LinkedIn, email links
- [ ] **CONT-02**: Clean footer with branding
- [ ] **CONT-03**: Links open in new tab where appropriate

### Page Transitions

- [ ] **TRANS-01**: Smooth transitions between pages (main site navigation)
- [ ] **TRANS-02**: Visual gateway transition from main site into docs section
- [ ] **TRANS-03**: GSAP Context cleanup on every page transition (kill ScrollTrigger, SplitText wrappers)
- [ ] **TRANS-04**: Three.js canvas disposed properly before transition

### Docs Section

- [ ] **DOCS-01**: Custom left sidebar with collapsible category navigation
- [ ] **DOCS-02**: Main content area renders markdown with syntax-highlighted code blocks
- [ ] **DOCS-03**: Client-side search via Pagefind
- [ ] **DOCS-04**: Breadcrumbs for navigation context
- [ ] **DOCS-05**: Content powered by Astro content collections (write .md → get page)
- [ ] **DOCS-06**: Dark theme matching main site purple aesthetic
- [ ] **DOCS-07**: At least 2 sample guides published at launch
- [ ] **DOCS-08**: Mobile responsive — collapsible sidebar on small screens

### Navigation

- [ ] **NAV-01**: Minimal nav bar on main site (logo + section links + docs link)
- [ ] **NAV-02**: Nav theme adapts per section (light/dark as needed)
- [ ] **NAV-03**: Hamburger menu on mobile with full-screen overlay

### Performance

- [ ] **PERF-01**: First Contentful Paint under 3 seconds on 4G
- [ ] **PERF-02**: Three.js and GSAP only hydrate where needed (Astro islands / vanilla scripts)
- [ ] **PERF-03**: Images lazy-loaded in modern formats (WebP/AVIF)
- [ ] **PERF-04**: Lighthouse performance score > 80

### Deployment

- [ ] **DEPLOY-01**: Static site builds and deploys to Cloudflare Pages (or Vercel/Netlify)
- [ ] **DEPLOY-02**: josue.aparcedo.org DNS configured via Cloudflare
- [ ] **DEPLOY-03**: OpenGraph meta tags for social sharing preview
- [ ] **DEPLOY-04**: Sitemap generated for SEO

## v2 Requirements

### Enhanced Interactions

- **V2-01**: Custom cursor that changes shape on interactive elements
- **V2-02**: Distortion/glitch shader effects on project images
- **V2-03**: Sound design — subtle audio cues on interactions (opt-in)
- **V2-04**: Dark/light theme toggle (dark is default, light is optional)

### Docs Enhancements

- **V2-05**: Table of contents sidebar for individual guides
- **V2-06**: Reading time estimates on guides
- **V2-07**: Related guides suggestions
- **V2-08**: RSS feed for new guides

### Analytics & SEO

- **V2-09**: Privacy-friendly analytics (Plausible or Umami)
- **V2-10**: Blog section with RSS
- **V2-11**: Structured data / JSON-LD for rich search results

## Out of Scope

| Feature | Reason |
|---------|--------|
| CMS / admin panel | Content managed via markdown + git — no admin UI needed |
| User authentication | Purely static site, no user accounts |
| Comments / guestbook | Unnecessary complexity, distracts from the experience |
| E-commerce / payments | Not a storefront |
| Server-side rendering | Static-only — Astro SSG is sufficient |
| i18n / multi-language | English only for v1 |
| Three.js on every section | Performance anti-feature — WebGL in hero + accents only, GSAP CSS for the rest |
| Scroll hijacking | Bouncy/locked scroll steps — causes accessibility issues and high bounce rate |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Pending |
| FOUND-05 | Phase 1 | Pending |
| FOUND-06 | Phase 1 | Pending |
| SCRL-01 | Phase 2 | Pending |
| SCRL-02 | Phase 2 | Pending |
| SCRL-03 | Phase 2 | Pending |
| SCRL-04 | Phase 2 | Pending |
| HERO-01 | Phase 3 | Pending |
| HERO-02 | Phase 3 | Pending |
| HERO-03 | Phase 3 | Pending |
| HERO-04 | Phase 3 | Pending |
| HERO-05 | Phase 3 | Pending |
| HERO-06 | Phase 3 | Pending |
| HERO-07 | Phase 3 | Pending |
| TRANS-01 | Phase 4 | Pending |
| TRANS-02 | Phase 4 | Pending |
| TRANS-03 | Phase 4 | Pending |
| TRANS-04 | Phase 4 | Pending |
| ABOUT-01 | Phase 5 | Pending |
| ABOUT-02 | Phase 5 | Pending |
| ABOUT-03 | Phase 5 | Pending |
| ABOUT-04 | Phase 5 | Pending |
| PROJ-01 | Phase 5 | Pending |
| PROJ-02 | Phase 5 | Pending |
| PROJ-03 | Phase 5 | Pending |
| PROJ-04 | Phase 5 | Pending |
| PROJ-05 | Phase 5 | Pending |
| PROJ-06 | Phase 5 | Pending |
| LIFE-01 | Phase 5 | Pending |
| LIFE-02 | Phase 5 | Pending |
| LIFE-03 | Phase 5 | Pending |
| LIFE-04 | Phase 5 | Pending |
| CONT-01 | Phase 5 | Pending |
| CONT-02 | Phase 5 | Pending |
| CONT-03 | Phase 5 | Pending |
| NAV-01 | Phase 5 | Pending |
| NAV-02 | Phase 5 | Pending |
| NAV-03 | Phase 5 | Pending |
| DOCS-01 | Phase 6 | Pending |
| DOCS-02 | Phase 6 | Pending |
| DOCS-03 | Phase 6 | Pending |
| DOCS-04 | Phase 6 | Pending |
| DOCS-05 | Phase 6 | Pending |
| DOCS-06 | Phase 6 | Pending |
| DOCS-07 | Phase 6 | Pending |
| DOCS-08 | Phase 6 | Pending |
| PERF-01 | Phase 7 | Pending |
| PERF-02 | Phase 7 | Pending |
| PERF-03 | Phase 7 | Pending |
| PERF-04 | Phase 7 | Pending |
| DEPLOY-01 | Phase 7 | Pending |
| DEPLOY-02 | Phase 7 | Pending |
| DEPLOY-03 | Phase 7 | Pending |
| DEPLOY-04 | Phase 7 | Pending |

**Coverage:**
- v1 requirements: 52 total
- Mapped to phases: 52
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-30*
*Last updated: 2026-03-30 — phase assignments updated (TRANS moved to Phase 4, content to Phase 5, docs to Phase 6)*
