<!-- GSD:project-start source:PROJECT.md -->
## Project

**Personal Website — josue.aparcedo.org**

An immersive, high-end personal website for Josue Aparcedo — a software engineer building a portfolio + creative expression site that doubles as a public knowledge base. The main site is a cinematic, scroll-driven experience with Three.js 3D elements, GSAP animations, and Lenis smooth scroll. The docs section is a separate, clean layout for technical guides and a public "second brain." Built with Astro.

**Core Value:** The site must make a lasting first impression — a recruiter or fellow engineer should feel "wow" within the first 2 seconds of landing, then be able to explore projects, interests, and technical writing without friction.

### Constraints

- **Tech stack**: Astro + Three.js + GSAP + Lenis — decided during brainstorming
- **Hosting**: Static site (deployable to Netlify, Vercel, or Cloudflare Pages)
- **Performance**: Must load fast despite 3D elements — Astro's partial hydration is key
- **Accessibility**: Site must be navigable without JavaScript (graceful degradation for docs section)
- **NAS builds**: Project lives on NAS — use `/tmp/personal-website-target` for any build cache if needed
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Astro | 6.1.1 | Static-first framework, content collections, islands hydration | Stable as of March 10 2026. Ships zero JS by default — critical for performance on a 3D-heavy site. Content Collections are purpose-built for markdown docs sections. Islands architecture means Three.js/GSAP components hydrate client-side only where needed. Beats Next.js for this use case because there is no server-side rendering overhead for a static portfolio. |
| Three.js | 0.183.x (r183) | WebGL 3D — particle hero, project section accents | Current stable. Vanilla Three.js (not R3F) is the right call for Astro because it avoids React as a dependency. Every immersive portfolio tutorial from Codrops (2025–2026) uses vanilla Three.js + Astro. R3F adds React overhead that is unjustified for a non-React project. |
| GSAP | 3.14.x | Scroll-driven animations, text reveals, clip-path, parallax, page transitions | Industry standard for premium web animation. ScrollTrigger, SplitText, and all bonus plugins are now 100% free (Webflow acquisition). Version 3.13 rewrote SplitText — half the size, 14 new features. 3.14 is current. Nothing else matches GSAP's timeline control, easing precision, or ecosystem. |
| Lenis | 1.3.21 | Smooth scroll — normalizes native scroll across devices | Darkroom Engineering's library, used by Awwwards-winning agencies. Renamed from `@studio-freight/lenis` to `lenis` — use the new package name. Works as the scroll driver that GSAP ScrollTrigger hooks into. Lightweight, accessible, does not break native APIs. Latest stable is 1.3.21 (March 26 2026). |
| Tailwind CSS | 4.1.x | Utility-first CSS — layout, typography scale, responsive design | v4.0 released January 22 2025, stable and production-ready. CSS-first config (no tailwind.config.js). For Astro, use `@tailwindcss/vite` plugin directly — the `@astrojs/tailwind` integration is deprecated for v4. Utility classes are essential for the docs section's rapid layout development. |
| TypeScript | 5.x (bundled with Astro) | Type safety across components and content | Astro 6 ships with TypeScript support out of the box. Content collections schemas use Zod 4 (upgraded in Astro 6). No separate install needed — `astro check` runs the TS compiler. |
### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@gsap/scrolltrigger` | included in `gsap` | Scroll-driven animation triggers | Every scroll animation — pinned sections, parallax, reveal-on-scroll. Register via `gsap.registerPlugin(ScrollTrigger)`. |
| `gsap/SplitText` | included in `gsap` | Split text into characters/words/lines for stagger animations | Hero name reveal, section heading animations, any staggered character effect. Free since GSAP 3.12+. |
| `gsap/Flip` | included in `gsap` | Layout-to-layout state transition animations | Project section viewport transitions where items change size/position. |
| `gsap/CustomEase` | included in `gsap` | Bezier-curve custom easing | Cinematic feel requires custom easing, not standard easings. Define once, reuse everywhere. |
| `pagefind` | 1.x | Static full-text search for docs section | Runs post-build, indexes static HTML output. Zero infrastructure. Used by Astro's own Starlight docs. The correct choice for a git-managed docs section — no Algolia account needed. `astro-pagefind` integration package handles setup. |
| `sharp` | bundled with Astro | Image optimization | Astro's built-in `<Image />` component uses Sharp. Use for the parallax photo in the About section and project thumbnails. Zero config. |
| `astro-pagefind` | latest | Pagefind integration for Astro | Wires Pagefind into the Astro build pipeline with minimal config. |
### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| `astro check` | TypeScript type checking + Astro template validation | Run before every commit. Catches template errors that tsc alone misses. |
| `vite` | Bundler/dev server (bundled with Astro) | Do NOT install separately. Astro 6 upgrades to Vite 7. HMR works for `.astro` files and Three.js modules. |
| `@astrojs/sitemap` | Auto-generates sitemap.xml | Add to integrations. Needed for docs discoverability. Zero config. |
| Biome | Linting + formatting (replaces ESLint + Prettier) | Faster than ESLint/Prettier combined. Single config. Astro files need `biome-astro` plugin or use Prettier with `prettier-plugin-astro` for `.astro` formatting. |
| `prettier-plugin-astro` | Formats `.astro` files | If Prettier is already in the project, add this plugin. Biome doesn't yet fully support `.astro` — use Prettier for `.astro` files only. |
## Installation
# Create Astro 6 project (select TypeScript + strict mode when prompted)
# Three.js
# GSAP (all plugins now included — SplitText, ScrollTrigger, Flip, etc.)
# Lenis smooth scroll (use new package name, NOT @studio-freight/lenis)
# Tailwind CSS v4 (Vite plugin approach — NOT @astrojs/tailwind)
# Static search for docs
# Sitemap
## Alternatives Considered
| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Astro 6 | Next.js 15 | When you need SSR/ISR, auth, API routes, or React component reuse across multiple apps. Not for a static portfolio. |
| Astro 6 | SvelteKit | When the whole site needs reactivity and you prefer Svelte DX. Worse content collections story. |
| Astro 6 | Nuxt 3 | When team is Vue-first. Otherwise Astro is strictly better for static content sites. |
| Vanilla Three.js | React Three Fiber (@react-three/fiber) | Only when the project is already React-based. R3F adds ~45KB React runtime for zero benefit in an Astro project where React is not the component model. |
| Lenis | ScrollSmoother (GSAP plugin) | ScrollSmoother requires GSAP Club membership history (now free, but heavier). Lenis is lighter and framework-agnostic. Use ScrollSmoother if you need tight GSAP timeline integration at the cost of more setup. |
| Tailwind CSS v4 | Vanilla CSS / CSS Modules | For the docs section specifically, vanilla CSS is a valid alternative. Tailwind v4 wins because it handles both the immersive main site (custom design tokens) and the docs section (utility-class rapid development) in one system. |
| Pagefind | Algolia DocSearch | Use Algolia only if the docs section scales to thousands of pages or you need typo-tolerance and faceted filtering. Pagefind handles 10K+ pages fine. Algolia requires an external account and API keys. |
| Pagefind | Lunr.js | Lunr bundles the entire index in the JS bundle. Pagefind streams only what's needed — better for mobile users on slow connections. |
| Astro content collections (custom) | Starlight | Starlight is faster to set up but has a rigid layout that cannot match the site's custom dark-luxury aesthetic. Custom content collections give full visual control. Decision is correct per PROJECT.md. |
## What NOT to Use
| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `@astrojs/tailwind` | Deprecated for Tailwind v4 — the integration only supports Tailwind v3 and will break or mismatch | `@tailwindcss/vite` Vite plugin directly in `astro.config.ts` |
| `@studio-freight/lenis` | Package was renamed and is no longer maintained under the old name | `lenis` (new package name, same library) |
| React Three Fiber (`@react-three/fiber`) | Pulls in full React runtime into an Astro project that doesn't use React. Adds bundle weight with no benefit over vanilla Three.js in this context. | `three` (vanilla) |
| Barba.js | Adds significant complexity for page transitions. Astro 6 has View Transitions API built in with `<ViewTransitions />`. | Astro's built-in View Transitions (`astro:transitions`) |
| `react-spring` or `framer-motion` | React-only animation libraries. Incompatible with Astro's vanilla component model without an island. | GSAP — works in any JS context, no framework dependency |
| `locomotive-scroll` | Unmaintained relative to Lenis (same team, Lenis is the successor). Has known bugs on iOS Safari. | `lenis` |
| `three/examples/jsm/controls/OrbitControls` for hero | User-controlled orbit is the wrong UX for a hero — it creates friction. Mouse-reactive particle movement is more intentional. | Custom mouse event handler tied to Three.js uniform or object position |
| Astro 5.x | The 5.x line is stable but Astro 6 has been stable since March 10 2026 with a much better dev/prod parity story. New project should start on 6. | Astro 6.x |
## Stack Patterns by Variant
- Use Astro `client:only="vanilla"` (or no framework) for Three.js canvas islands
- GSAP context + ScrollTrigger in a client-side script tag within the Astro component
- Lenis instance created globally in the root layout, passed to ScrollTrigger via `ScrollTrigger.scrollerProxy`
- Use Astro content collections with a `docs` collection type
- Separate layout component (`DocsLayout.astro`) with a clean, non-animated shell
- Pagefind for search, rendered as a Pagefind UI island (`client:load`)
- Tailwind prose utilities (`@tailwindcss/typography`) for markdown rendering
- Astro View Transitions (`<ViewTransitions />`) handles the gateway transition
- GSAP `flip` or a clip-path reveal for the "entering docs" moment
- Docs section uses a distinct `prefers-reduced-motion`-safe layout
- Detect `window.matchMedia("(prefers-reduced-motion)")` — skip Three.js init entirely on reduced-motion
- Use `IntersectionObserver` to pause Three.js render loop when canvas is off-screen
- Lenis automatically handles touch scroll normalization
## Version Compatibility
| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `astro@6.1.1` | `vite@7.x` (bundled) | Astro 6 upgrades the internal Vite from 6 to 7. Do NOT install Vite separately. |
| `gsap@3.14.x` | Any modern browser | No peer deps. Works in Astro `.astro` scripts and vanilla JS islands. |
| `lenis@1.3.21` | `gsap@3.x` ScrollTrigger | Requires `ScrollTrigger.scrollerProxy` setup when both are used together. See Lenis README for the exact integration pattern. |
| `tailwindcss@4.x` | `@tailwindcss/vite` (not `@astrojs/tailwind`) | The old `@astrojs/tailwind` integration is for Tailwind v3 only and is incompatible with v4. |
| `three@0.183.x` | Modern browsers (WebGL 1 + 2) | WebGPU backend available experimentally in r171+ but not needed for this project. Stick to WebGL renderer for broadest compatibility. |
| `pagefind@1.x` | Astro 6 build output | Pagefind runs as a post-build step. Works on any static output directory. `astro-pagefind` integration hooks it into `astro build`. |
## Sources
- [npmjs.com/package/astro](https://www.npmjs.com/package/astro) — Astro 6.1.1 confirmed current as of March 30 2026 (MEDIUM confidence — npmjs 403 on direct fetch, confirmed via search results)
- [astro.build/blog/astro-6/](https://astro.build/blog/astro-6/) — Astro 6 stable release, March 10 2026 (HIGH confidence)
- [netlify.com/changelog/2026-03-10-astro-6/](https://www.netlify.com/changelog/2026-03-10-astro-6/) — Astro 6 Netlify support confirmed
- [github.com/darkroomengineering/lenis/releases](https://github.com/darkroomengineering/lenis/releases) — Lenis 1.3.21 latest stable March 26 2026 (HIGH confidence — direct release page fetch)
- [gsap.com/docs/v3/Plugins/SplitText/](https://gsap.com/docs/v3/Plugins/SplitText/) — SplitText free, GSAP 3.14 current (HIGH confidence via search results + Codrops May 2025)
- [tailwindcss.com/blog/tailwindcss-v4](https://tailwindcss.com/blog/tailwindcss-v4) — Tailwind v4 stable January 22 2025 (HIGH confidence)
- [tailwindcss.com/docs/installation/framework-guides/astro](https://tailwindcss.com/docs/installation/framework-guides/astro) — Vite plugin approach for Astro v4 integration (HIGH confidence)
- [tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/) — Current production pattern for GSAP + Three.js + Astro (HIGH confidence — Codrops is authoritative)
- [tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/](https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/) — Cinematic 3D scroll patterns November 2025 (HIGH confidence)
- [pagefind.app](https://pagefind.app/) — Pagefind static search, used by Astro Starlight (HIGH confidence)
- Three.js r183 / 0.183.2 — confirmed via search result citing utsubo.com/blog/threejs-2026-what-changed and npmjs (HIGH confidence)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
