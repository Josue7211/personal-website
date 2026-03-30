# Project Research Summary

**Project:** Personal Website — Immersive Portfolio + Knowledge Base
**Domain:** High-end immersive portfolio site with Three.js 3D, GSAP scroll animations, and Astro-powered docs section
**Researched:** 2026-03-30
**Confidence:** HIGH

## Executive Summary

This is an award-tier personal portfolio — the kind that earns Awwwards SOTD nominations — built on a well-established stack that Codrops, Awwwards winners, and agencies like Darkroom Engineering have converged on in 2025–2026. The canonical approach is: Astro 6 (static output, zero JS by default), Three.js r183 (vanilla, not R3F) for the WebGL hero, GSAP 3.14 (all plugins now free post-Webflow acquisition) for scroll animations, and Lenis 1.3.21 for smooth scroll. This combination ships on multiple Awwwards SOTD sites and two recent Codrops build breakdowns. There is no meaningful debate about the stack — the research converged with HIGH confidence across all sources.

The core challenge is not feature breadth but technical precision. Three things must work flawlessly or the site fails: (1) the Three.js particle hero must load fast and perform across device tiers, (2) Lenis and GSAP ScrollTrigger must synchronize via the correct ticker pattern or all scroll-driven animations break, and (3) GPU memory must be explicitly disposed on every navigation or the site silently crashes after a few page visits. These are not edge cases — they are the most common failure modes in this exact stack, documented across GSAP forums, Three.js discourse, and Lenis GitHub issues. The architecture is designed around preventing all three.

The differentiator for this site specifically is the docs section: a public knowledge base unified under the same brand as an immersive portfolio is essentially unheard of in the award-site landscape. Every reference site (Lando Norris, Joffrey Spitzer, Jordan Breton) is a pure portfolio with no docs equivalent. This adds meaningful complexity — two separate layout systems with zero shared animation infrastructure — but it's the feature that makes this site architecturally interesting beyond pure visual craft.

---

## Key Findings

### Recommended Stack

Astro 6.1.1 is the correct framework: it ships zero JS by default (critical when Three.js adds ~600KB to the client bundle), has purpose-built Content Collections for the docs section, and pairs with vanilla Three.js without pulling in React. Tailwind CSS v4 handles design tokens and the docs section's utility layout. The entire GSAP suite (ScrollTrigger, SplitText, Flip, CustomEase) is included in the single `gsap` package at no cost since GSAP 3.12+.

**Conflict resolved:** FEATURES.md stated "SplitText requires Club GSAP (paid)." This is outdated. STACK.md has more current information: Webflow acquired GSAP and made all plugins free starting GSAP 3.12+. The current version is 3.14. SplitText is free. No license purchase required. FEATURES.md's dependency note is incorrect and should be disregarded.

**Core technologies:**
- **Astro 6.1.1**: Static site framework, zero-JS by default, Content Collections for docs — eliminates SSR overhead for a static portfolio
- **Three.js r183 (vanilla)**: WebGL particle hero and scene accents — R3F avoided because it forces React into a non-React project
- **GSAP 3.14**: All scroll animations, SplitText, Flip, CustomEase — industry standard, all plugins now free
- **Lenis 1.3.21**: Smooth scroll normalized across devices — drives GSAP ScrollTrigger via ticker sync pattern
- **Tailwind CSS v4**: Design tokens + docs section layout — use `@tailwindcss/vite` plugin, NOT the deprecated `@astrojs/tailwind` integration
- **Pagefind 1.x**: Static full-text search for docs — runs post-build, zero infrastructure required
- **TypeScript 5.x**: Bundled with Astro, enforced via `astro check`

**Critical version notes:** Do NOT install `@studio-freight/lenis` (old package name, abandoned). Use `lenis`. Do NOT use `@astrojs/tailwind` (Tailwind v3 only). Use `@tailwindcss/vite`.

### Expected Features

**Must have (table stakes):**
- Three.js particle hero with mouse-responsive repulsion — the signature moment; must render within 2 seconds
- Cinematic loading sequence (counter + clip-path reveal) — sets tone before hero appears
- Smooth scroll (Lenis) — without it, everything feels broken relative to any modern premium site
- Projects section — full-viewport per project, mood shifts per item
- Scroll-triggered clip-path reveals throughout all sections
- Split-text character/word animations on headlines
- About section with parallax photo
- Film grain overlay — completes the dark luxury aesthetic at near-zero cost
- Ambient glow / mesh gradient lighting — atmosphere via pure CSS
- Horizontal scroll gallery (Interests section)
- Docs section (Astro Content Collections, sidebar, Pagefind search)
- Contact section + footer with social links
- Mobile responsiveness with graceful degradation (no WebGL on mobile)
- Custom cursor (desktop only)

**Should have (competitive — add when core is stable):**
- Page transitions via GSAP Flip + Astro View Transitions
- Scroll-velocity distortion shaders on project titles
- OpenGraph / social meta images

**Defer (v2+):**
- Per-project 3D accent elements
- Ambient audio layer (user-controlled)
- Case study deep-dives per project

**Anti-features (never build):**
- Full 3D spatial navigation — creates friction, destroys bounce rate
- Auto-playing background video — kills LCP and mobile battery
- Light/dark mode toggle — dark-only is the brand; toggle doubles design complexity
- CMS / headless WordPress — static site, markdown + git is correct

### Architecture Approach

The architecture splits into two completely isolated site areas with their own layouts: `MainLayout.astro` owns the immersive portfolio (Three.js canvas, Lenis, GSAP), and `DocsLayout.astro` is a clean slate with zero animation overhead. All Three.js code lives under `src/webgl/` and all GSAP code under `src/animation/` — these are plain TypeScript modules loaded only via `<script>` tags in `.astro` files, never imported in frontmatter (which runs server-side at build time). A single `ScrollCoordinator.ts` singleton owns the Lenis instance and wires it to GSAP's ticker — this is the load-bearing integration that prevents the most common scroll animation failures.

**Major components:**
1. `ScrollCoordinator.ts` — Lenis instance + `gsap.ticker` sync; must initialize before any ScrollTrigger instance
2. `ParticleHero.ts` + `Renderer.ts` — Three.js particle field, shared WebGL renderer singleton
3. `ScrollAnimations.ts` — all ScrollTrigger instances per section; runs after DOMContentLoaded
4. `src/content/docs/` + `lib/docs.ts` — build-time content collection powering the entire docs section
5. `DocsLayout.astro` — completely separate layout; Lenis explicitly disabled here

### Critical Pitfalls

1. **GPU memory never freed on navigation** — Three.js geometries, materials, and textures must be explicitly disposed on every page leave. `scene.clear()` does NOT free GPU memory. Establish `geometry.dispose()` / `material.dispose()` / `renderer.dispose()` patterns in the hero phase before adding any other 3D content. Monitor `renderer.info.memory` during dev.

2. **Lenis + ScrollTrigger sync done wrong** — Using the outdated `ScrollTrigger.scrollerProxy()` approach causes pinning failures and blank spacer gaps. The only correct pattern is: `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add(t => lenis.raf(t * 1000))` + `gsap.ticker.lagSmoothing(0)`. This must be in place before building any scroll-driven section.

3. **GSAP and SplitText instances surviving page transitions** — Astro's view transitions swap DOM but do not kill GSAP plugin state. Animations fire twice on second visit; SplitText double-wraps spans. Use GSAP Context API (`gsap.context()`) and clean up on `astro:before-swap`. Re-initialize on `astro:page-load`.

4. **Particle count untethered from device capability** — A 50k-particle hero at 60fps on desktop drops to 15fps on mid-range Android. Build three tiers from day one: mobile (5k, CSS fallback), mid (15k), high (25k+). Use `detect-gpu` or `navigator.hardwareConcurrency` for detection.

5. **Three.js bundle shipped to every page** — The `~600KB` Three.js bundle must never appear on docs pages. Named imports only (`import { Scene, ... } from 'three'`), never `import * as THREE`. Docs section must show zero Three.js in bundle analysis output.

6. **Missing `prefers-reduced-motion`** — WCAG 2.1 SC 2.3.3 applies here. All GSAP timelines must be wrapped in `gsap.matchMedia()` checks. Static particle arrangement (not animated) on reduced-motion. This is a hard requirement, not a nicety.

---

## Implications for Roadmap

Based on the combined architecture, pitfall, and feature research, the correct build order is dependency-driven, not feature-driven. Foundation before any animated section. Scroll infrastructure before any scroll-triggered animation. Hero before any other section (it validates the whole WebGL stack). Docs is self-contained and can be built in parallel once the foundation exists.

### Phase 1: Foundation and Project Setup
**Rationale:** Everything depends on this. Design tokens, font loading, BaseLayout, and build tooling configuration must exist before any other work. PITFALL #5 (Three.js bundle on all pages) is prevented here via named imports and bundle analyzer setup.
**Delivers:** Astro project scaffolded with correct Tailwind v4 config (`@tailwindcss/vite`), TypeScript strict mode, `biome` linting, `@astrojs/sitemap`, font preloading in `BaseLayout.astro`, design token CSS variables, `tokens.css`, and `rollup-plugin-visualizer` wired into the build.
**Addresses:** Initial load performance constraint, build tooling correctness
**Avoids:** `@astrojs/tailwind` deprecation pitfall, `@studio-freight/lenis` wrong package name, `import * as THREE` bundle disaster

### Phase 2: Scroll Infrastructure
**Rationale:** Lenis + GSAP ScrollTrigger integration is the most failure-prone integration in this stack. It must be isolated, verified, and correct before any individual section is built on top of it. Getting the sync wrong late means rewriting every animated section.
**Delivers:** `ScrollCoordinator.ts` singleton with verified Lenis + GSAP ticker sync, `MainLayout.astro` with film grain overlay and ambient glow CSS, `ScrollAnimations.ts` scaffold ready to receive per-section registrations.
**Avoids:** PITFALL #2 (Lenis + ScrollTrigger pinning breaks), scroll-proxy anti-pattern
**Research flag:** Standard pattern — use exact ticker sync code from ARCHITECTURE.md Pattern 2. No additional research needed.

### Phase 3: Hero Section and Three.js Foundation
**Rationale:** The hero is the riskiest and most impactful element. It validates the entire WebGL stack. Building it before other sections means pitfalls surface early. The preloader/loading sequence belongs here because it controls hero initialization sequencing.
**Delivers:** Cinematic preloader (counter + clip-path reveal), `Renderer.ts` singleton, `ParticleHero.ts` with mouse-responsive repulsion, three device quality tiers (5k/15k/25k particles), `prefers-reduced-motion` static fallback, GPU memory disposal lifecycle, `renderer.info.memory` dev monitoring.
**Avoids:** PITFALL #1 (GPU memory leak), PITFALL #4 (particle count), PITFALL #6 (reduced motion)
**Research flag:** Three.js device tier detection (`detect-gpu` library integration) may benefit from a focused research pass — GPU detection patterns vary and the library API should be verified.

### Phase 4: Main Site Content Sections
**Rationale:** With scroll infrastructure and the hero verified, remaining sections follow a predictable pattern. Each adds entries to `ScrollAnimations.ts`. Interests section adds the horizontal scroll pattern which has its own Lenis interaction concern.
**Delivers:** About section (parallax photo), Projects section (full-viewport per project with mood shifts), Interests section (horizontal scroll gallery via ScrollTrigger `containerAnimation`), Contact section + footer, custom cursor (desktop), clip-path scroll reveals throughout, SplitText headline animations.
**Avoids:** PITFALL #2 (horizontal scroll + Lenis: use `data-lenis-prevent` on container), scroll hijacking anti-feature
**Research flag:** Horizontal scroll + Lenis `data-lenis-prevent` behavior on touch devices warrants verification against current Lenis 1.3.21 docs before implementation.

### Phase 5: Docs Section
**Rationale:** The docs section is architecturally isolated from the main site (separate layout, no GSAP, no Three.js, no Lenis). It can be built after the main site sections are stable, or in parallel if there are multiple contributors. Pagefind is added as a post-build step at the end of this phase.
**Delivers:** `content.config.ts` with Zod schema, `DocsLayout.astro` (no animation infrastructure), `DocsSidebar.astro` (auto-generated from collection folder structure via `lib/docs.ts`), `[...slug].astro` dynamic route, `DocsSearch.astro` Pagefind widget, `docs.css` typography using `@tailwindcss/typography`, docs landing page.
**Avoids:** PITFALL (Lenis on docs pages — native scroll only), Three.js bundle on docs pages, manual sidebar config anti-pattern
**Research flag:** Standard pattern. Content Collections with `getStaticPaths` is well-documented. No additional research needed.

### Phase 6: Page Transitions and Polish
**Rationale:** Page transitions are high-complexity and their correctness depends on all previous phases being stable. The Three.js canvas / View Transitions collision pitfall is only solvable once the canvas lifecycle is fully understood. This phase also covers performance polish: code splitting, image optimization, `<Image>` component rollout.
**Delivers:** GSAP Flip transitions wired to Astro View Transitions API (with `transition:persist` on canvas, or Barba.js if View Transitions proves incompatible), GSAP Context cleanup on `astro:before-swap`, SplitText `.revert()` on navigation, `client:visible` lazy loading for off-screen Three.js elements, bundle analysis confirmation that docs pages are Three.js-free.
**Avoids:** PITFALL #3 (GSAP cleanup on navigation), PITFALL #7 (View Transitions + WebGL canvas collision)
**Research flag:** View Transitions + Three.js canvas behavior on Safari specifically needs live testing — the black flash pitfall is Safari-specific and cannot be confirmed until browser testing. Have Barba.js as a fallback plan.

### Phase 7: Performance Optimization and Launch Prep
**Rationale:** Final pass on performance budgets, accessibility, and launch checklist. Scroll-velocity distortion shaders (P2 feature) belong here after performance budget is confirmed.
**Delivers:** Lighthouse score verification (target: 90+ Performance on desktop, 70+ mobile), OpenGraph / social meta images, `@astrojs/sitemap` verification, `robots.txt`, scroll-velocity distortion shaders if performance budget allows, full "Looks Done But Isn't" checklist from PITFALLS.md, Plausible analytics snippet (optional, one script tag).
**Avoids:** Shipping with known accessibility failures, silent GPU memory leaks, broken mobile experience

### Phase Ordering Rationale

- Foundation → Scroll → Hero is a hard dependency chain: you cannot animate without scroll infrastructure, cannot render 3D without the renderer singleton, cannot build sections without the hero validating the stack.
- Docs can theoretically run parallel to Phases 3-4 because it shares zero runtime infrastructure with the main site. In a single-developer context, it logically follows the main site sections.
- Page transitions are last because they depend on every section's enter/leave lifecycle being stable. Retrofitting cleanup hooks is far cheaper than pre-building them before the sections they're cleaning up exist.
- Performance phase is genuinely last — code splitting and bundle analysis require the full application to exist before you can measure what to optimize.

### Research Flags

**Needs focused research during planning:**
- **Phase 3 (Hero):** `detect-gpu` library API and Three.js device tier detection patterns — verify against current library docs before implementation
- **Phase 6 (Transitions):** Safari + Three.js canvas + View Transitions API live behavior — cannot be confirmed without browser testing; have Barba.js fallback scoped

**Standard patterns, skip research-phase:**
- **Phase 1 (Foundation):** Astro + Tailwind v4 integration is documented in official Tailwind Astro guide with exact Vite plugin config
- **Phase 2 (Scroll):** Lenis + GSAP ticker sync pattern is fully specified in ARCHITECTURE.md Pattern 2; exact code from official Lenis README
- **Phase 5 (Docs):** Astro Content Collections with `getStaticPaths` is core Astro docs; Pagefind + `astro-pagefind` integration is well-documented

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Astro 6, Three.js r183, GSAP 3.14, Lenis 1.3.21 all verified against official sources and npm. Versions confirmed as of 2026-03-30. |
| Features | HIGH | Verified against Awwwards SOTD winners, FWA winners, and two Codrops build breakdowns (Lando Norris case study, Joffrey Spitzer portfolio). SplitText free status resolved — STACK.md is correct, FEATURES.md dependency note is outdated. |
| Architecture | HIGH (Content Collections), MEDIUM (Lenis+GSAP integration) | Content collections pattern is core Astro. Lenis+GSAP integration confirmed from official Lenis README and GSAP forum threads, but subtle edge cases (horizontal scroll on touch, Safari View Transitions) require live verification. |
| Pitfalls | HIGH | All major pitfalls verified against official issue trackers (GSAP forums, Three.js discourse, Lenis GitHub, Astro issues). These are documented production failures, not theoretical risks. |

**Overall confidence:** HIGH

### Gaps to Address

- **SplitText free status:** FEATURES.md dependency section incorrectly states "SplitText requires Club GSAP (paid)." STACK.md confirms it is free in GSAP 3.12+. The correct behavior is: `npm install gsap` includes SplitText. No license needed. The FEATURES.md note is outdated and should be ignored during implementation.
- **Device tier detection library:** `detect-gpu` is referenced but its current API was not deeply verified. During the Hero phase, confirm the import pattern and available GPU tier constants against the installed version before building the quality tier system.
- **Safari View Transitions + canvas:** PITFALL #7 is confirmed as a known issue but the exact workaround behavior (specifically `transition:persist` + manual cross-fade) needs live browser testing in Safari before committing to this approach over Barba.js.
- **Scroll-velocity distortion shaders:** Listed as a P2 feature but the implementation complexity was noted as HIGH. Whether it fits within the performance budget of Phase 7 depends on profiling results from Phases 3-4. Defer the decision until then.

---

## Sources

### Primary (HIGH confidence)
- [astro.build/blog/astro-6/](https://astro.build/blog/astro-6/) — Astro 6 stable release, March 10 2026
- [github.com/darkroomengineering/lenis/releases](https://github.com/darkroomengineering/lenis/releases) — Lenis 1.3.21 latest stable, March 26 2026
- [gsap.com/docs/v3/Plugins/SplitText/](https://gsap.com/docs/v3/Plugins/SplitText/) — SplitText free, GSAP 3.14 current
- [tailwindcss.com/blog/tailwindcss-v4](https://tailwindcss.com/blog/tailwindcss-v4) — Tailwind v4 stable January 22 2025
- [tailwindcss.com/docs/installation/framework-guides/astro](https://tailwindcss.com/docs/installation/framework-guides/astro) — Vite plugin approach confirmed
- [tympanus.net/codrops/2026/02/02/](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/) — GSAP + Three.js + Astro production pattern, February 2026
- [tympanus.net/codrops/2026/02/18/](https://tympanus.net/codrops/2026/02/18/joffrey-spitzer-portfolio-a-minimalist-astro-gsap-build-with-reveals-flip-transitions-and-subtle-motion/) — Joffrey Spitzer portfolio Astro + GSAP build breakdown
- [pagefind.app](https://pagefind.app/) — Pagefind static search
- [github.com/darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) — Official Lenis + GSAP integration pattern
- [gsap.com/community/forums/topic/39231](https://gsap.com/community/forums/topic/39231-scrolltrigger-pinning-w-observer-not-working-when-lenis-added/) — ScrollTrigger + Lenis pinning conflict
- [W3C WCAG 2.1 SC 2.3.3](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html) — Animation from interactions accessibility requirement

### Secondary (MEDIUM confidence)
- [itsoffbrand.com/our-work/lando-norris](https://www.itsoffbrand.com/our-work/lando-norris) — Lando Norris Awwwards site case study (Lenis, GSAP, horizontal scroll confirmed)
- [gsap.com/community/forums/topic/34696](https://gsap.com/community/forums/topic/34696-scrolltrigger-with-lenis/) — ScrollTrigger + Lenis integration community patterns
- [gsap.com/community/forums/topic/41197](https://gsap.com/community/forums/topic/41197-astro-viewtransitions-breaks-scrolltrigger-the-second-time-i-enter-a-page/) — Astro View Transitions + ScrollTrigger double-fire issue
- [github.com/withastro/astro/issues/7758](https://github.com/withastro/astro/issues/7758) — GSAP ScrollTrigger + Lenis compatibility in Astro
- [utsubo.com/blog/threejs-best-practices-100-tips](https://www.utsubo.com/blog/threejs-best-practices-100-tips) — Three.js r183 performance patterns 2026

### Tertiary (LOW confidence)
- npmjs.com/package/astro — Astro 6.1.1 version confirmation (403 on direct fetch, confirmed via search results)

---

*Research completed: 2026-03-30*
*Ready for roadmap: yes*
