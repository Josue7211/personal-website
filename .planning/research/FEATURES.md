# Feature Research

**Domain:** Immersive personal portfolio + public knowledge base (software engineer)
**Researched:** 2026-03-30
**Confidence:** HIGH (Awwwards/FWA/CSSDA winners verified; Lando Norris site case study confirmed; Codrops build breakdowns; multiple award-site analyses)

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features visitors assume exist. Missing these makes the site feel unfinished or amateurish regardless of visual quality.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Hero section with name + role | Every portfolio opens with an identity statement | LOW | The Three.js particle field IS this — must resolve within 2 seconds of load |
| About section with photo | Visitors need to know who you are | LOW | Parallax depth on photo elevates this above basic |
| Projects showcase | Primary reason recruiters visit | MEDIUM | Full-viewport per project is premium tier; minimum is card grid |
| Contact information | Visitors need a way to reach you | LOW | Footer email + GitHub/LinkedIn links minimum |
| Mobile responsiveness | 40–60% of portfolio traffic is mobile | MEDIUM | Full animation parity is not required — graceful degradation is |
| Smooth scroll | Expected on any premium site — native scroll feels broken | LOW | Lenis is the standard; directly confirmed on Lando Norris site case study |
| Scroll-triggered content reveals | Visitors expect sections to animate in; static sections feel dead | MEDIUM | GSAP + ScrollTrigger; clip-path reveals are the standard pattern |
| Consistent typography system | Visual hierarchy must be legible across all sections | LOW | Confirmed: serif display + technical sans + monospace is the award-winning pattern |
| Fast initial load (<3s) | Users bounce at 3s; portfolio visitors are unforgiving | HIGH | Hardest constraint given 3D elements — Astro partial hydration is the mitigation |
| Loading/preloader screen | Required when WebGL assets need time to initialize | LOW | Sets tone before content appears; percentage counter is standard |
| Section-by-section navigation | Users need to jump to Projects, About, Contact | LOW | Sticky nav with scroll-spy or anchor links |
| Footer with social links | Standard portfolio closing | LOW | GitHub, LinkedIn, email minimum |

### Differentiators (Competitive Advantage)

Features that set a portfolio apart from the tens of thousands of generic ones. These are what earn Awwwards nominations.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Interactive particle hero (mouse-responsive) | Immediately signals WebGL/shader skill — rare and high signal to employers | HIGH | Three.js particle system with magnetic repulsion. Confirmed as award-winning differentiator on multiple Awwwards SOTD sites. Do NOT lazy-load — hero must be instant |
| Scroll-velocity distortion shaders | Adds physicality to scrolling — feels alive, not just animated | HIGH | Sine-wave vertex shader driven by scroll delta. Seen on Lando Norris site and multiple 2025 Codrops builds |
| Full-viewport project takeovers | Each project owns the screen — cinematic storytelling per work item | MEDIUM | Background mood shifts per project. Inspired by Lando Norris site structure |
| Clip-path reveal animations | Typographic reveals feel editorial and premium | MEDIUM | `clip-path: inset(100% 0 0 0)` → `inset(0%)` on scroll. Confirmed in Lando Norris GSAP implementation |
| Split-text character animations | Elevates headline typography from static to expressive | MEDIUM | GSAP SplitText plugin; character-by-character stagger. Confirmed in Joffrey Spitzer Astro+GSAP portfolio case study |
| Horizontal scroll gallery (vertical-triggered) | Breaks the monotony of pure vertical scroll; works well for interests/hobbies | MEDIUM | Triggered by vertical scroll via GSAP ScrollTrigger's `pin` + `scrub`. Lando Norris uses this |
| Film grain / noise texture overlay | Adds analog warmth and depth to digital dark backgrounds | LOW | CSS or canvas-based noise layer over sections. Signature of the "Digital Noir" / "dark luxury" aesthetic |
| Custom cursor with context-aware states | Signals craft; reinforces brand throughout navigation | MEDIUM | Cursor grows/morphs on hover targets, reacts to project sections. Confirmed as CSSDA/Awwwards differentiator |
| Ambient glow / mesh gradient lighting | Creates atmosphere; depth without literal depth | LOW | CSS radial gradients with purple hue bleeding into dark backgrounds. No performance cost |
| Page / section transitions (GSAP Flip) | Continuity between pages feels like a native app | HIGH | GSAP Flip plugin creates carry-over element transitions. Confirmed in Joffrey Spitzer portfolio; Swup.js for multi-page |
| Cinematic loading sequence | First impression IS the brand — a well-crafted preloader builds anticipation | LOW–MEDIUM | Counter + clip-path reveal into hero. Sets tone before Three.js canvas appears |
| Docs section with distinct visual language | Rare to see immersive portfolio + functional knowledge base unified under one brand | MEDIUM | Hard transition from cinematic main site to clean, readable docs. Shows range: creative + systematic |
| Subtle audio reactivity OR ambient sound toggle | A small subset of award-winners use sound design; high-risk but high-reward | HIGH | Only if budget exists. Boyd (FWA winner) uses sound cues on transitions. Default to OFF, user-controlled |

### Anti-Features (Deliberately NOT Build)

These are tempting additions that appear on weaker portfolios. Each one dilutes quality or creates real user problems.

| Anti-Feature | Why Requested | Why Problematic | Alternative |
|--------------|---------------|-----------------|-------------|
| Full 3D world navigation (spatial nav) | Looks technical and impressive in demos | Creates navigation friction. Users get lost. Bounce rate spikes. Reserved for experimental/art sites, not career portfolios | Restrict 3D to hero + accents. Content is still scroll-driven |
| Auto-playing background video | Feels immersive and cinematic | Destroys performance (LCP blows up). Kills battery on mobile. Annoys users with audio. | Use video-as-texture inside Three.js for specific project showcases; user-initiated play only |
| Infinite scroll for projects | Feels content-rich | Removes completion sense — visitors never see the footer CTA. Projects lose individual weight | Full-viewport project takeovers with explicit count. 6–8 max projects in v1 |
| Light/dark mode toggle | User preference accommodation | Doubles design system complexity. The dark luxury aesthetic IS the brand — a light mode would look wrong | Dark-only. Respect `prefers-color-scheme` for reduced-motion instead |
| CMS / headless WordPress | "Easy content updates" | Adds server dependency, auth, API calls to a static site. Completely unnecessary for one-person portfolio | Markdown files + git. Content changes = PR. Fast, free, version-controlled |
| Blog with RSS | Content marketing surface | Scope bloat for v1. Docs section covers written content. Two writing surfaces = neither gets quality attention | Docs section (knowledge base) covers all long-form writing |
| Guestbook / comments | Community feel | Zero traffic at launch. Adds auth and spam complexity. | Contact form or email link only |
| Three.js for every section | Show off WebGL skills everywhere | Performance cliff. Each WebGL context costs memory. LCP degrades. | WebGL in hero + targeted accents only. GSAP CSS animations for all other scroll work |
| Locomotive Scroll | Scroll library alternative | Older API, heavier, v5 had breaking changes, Lenis is now the community standard and what Lando Norris uses | Lenis exclusively |
| Scroll hijacking (fixed-position scroll steps) | Cinematic "locked" sections feel premium | Breaks accessibility. Kills users on trackpad. Creates janky experience on mobile. Bounce rate killer. | GSAP ScrollTrigger `pin` + `scrub` — scroll-driven but never locks the user out |
| Barba.js for page transitions | Seen on award sites like munrooftoprome | Adds significant complexity. GSAP Flip + Swup achieves equivalent results with less overhead for an Astro site | GSAP Flip transitions within Astro's View Transitions API |
| Contact form with backend | "Easy contact" | Requires serverless function or email API. Static site constraint. | mailto: link + Calendly embed for scheduling |
| Analytics dashboard | "Know your visitors" | Unnecessary for v1. No decisions require it. | Add Plausible (privacy-respecting, no-cookie, 1 script tag) post-launch if desired |

---

## Feature Dependencies

```
[Three.js Particle Hero]
    └──requires──> [WebGL canvas initialization in preloader]
                       └──requires──> [Loading sequence completes before hero reveals]

[Scroll-velocity distortion shaders]
    └──requires──> [Lenis scroll instance with velocity delta exposed]
                       └──requires──> [Lenis initialized before GSAP ScrollTrigger]

[Horizontal scroll gallery]
    └──requires──> [Lenis + GSAP ScrollTrigger pin/scrub]
                       └──requires──> [Lenis initialized before ScrollTrigger]

[Split-text character animations]
    └──requires──> [GSAP SplitText plugin (Club GSAP license)]

[Page transitions (GSAP Flip)]
    └──requires──> [Swup.js or Astro View Transitions API]

[Docs section]
    └──requires──> [Astro Content Collections for markdown]
    └──enhances──> [Search via Pagefind (static, no server)]

[Custom cursor]
    ──enhances──> [Three.js Particle Hero] (cursor feeds mouse coordinates to particle repulsion)
    ──enhances──> [Project section hover states]

[Film grain overlay]
    ──enhances──> [All dark sections] (pure CSS/canvas — no dependencies)

[Cinematic preloader]
    ──requires──> [Fires before Three.js canvas mounts]
    ──enables──> [Three.js Particle Hero reveal animation]

[Clip-path reveals]
    └──requires──> [GSAP ScrollTrigger]

[Ambient glow / mesh gradients]
    ──no dependencies── (pure CSS)
```

### Dependency Notes

- **Lenis must initialize before GSAP ScrollTrigger**: ScrollTrigger uses `scrollerProxy` to sync with Lenis. If ScrollTrigger initializes against native scroll, all scroll-triggered animations fire at wrong positions.
- **Split-text requires Club GSAP**: SplitText is a Club GSAP (paid) plugin. The free alternative is splitting.js, but GSAP SplitText is more robust and integrates with timelines. This is a real cost — verify license situation at implementation.
- **Three.js hero must NOT lazy-load**: Hero canvas is above the fold. Deferred loading causes visible blank + flash. It must be included in the critical path. Astro's `client:load` directive handles this correctly.
- **Custom cursor mouse coordinates feed particle repulsion**: The same `mousemove` listener that drives cursor position should feed the Three.js particle repulsion uniform. Single event listener, two consumers — don't create two separate listeners.
- **Docs search (Pagefind) conflicts with Three.js bundle**: Pagefind is a static search tool that indexes at build time. It ships its own WASM. Bundle size impact is minimal but worth noting in performance budget.

---

## MVP Definition

### Launch With (v1)

Minimum for a "wow" first impression that functions as a career portfolio.

- [ ] Cinematic loading sequence (counter + clip-path reveal) — sets tone before anything else renders
- [ ] Three.js particle hero with mouse-responsive repulsion — the signature moment; must land in first 2 seconds
- [ ] Smooth scroll (Lenis) — without this, everything else feels broken
- [ ] About section (personal story + parallax photo) — context for the human behind the work
- [ ] Projects section (full-viewport per project, mood shifts) — primary recruiter destination
- [ ] Scroll-triggered clip-path reveals throughout — makes scrolling feel earned
- [ ] Split-text title animations — typography is the primary voice
- [ ] Film grain overlay — completes the dark luxury aesthetic
- [ ] Ambient glow / mesh gradient lighting — atmosphere at zero cost
- [ ] Interests/Life horizontal scroll gallery — personality signal, shows range
- [ ] Docs section (Astro Content Collections, sidebar nav, Pagefind search) — knowledge base
- [ ] Contact section + footer with social links — functional close
- [ ] Mobile responsiveness — degraded but intentional (no WebGL on mobile; GSAP animations preserved)
- [ ] Custom cursor (desktop only) — small effort, large craft signal

### Add After Validation (v1.x)

Features to add once core is live and verified.

- [ ] Page transitions (GSAP Flip / Swup) — adds polish but not required to ship
- [ ] Scroll-velocity distortion shaders on project titles — high effort, high impact; add when performance budget is confirmed
- [ ] Pagefind search for docs — can launch docs without search; add immediately post-launch
- [ ] OpenGraph / social meta images — important for sharing but not blocking launch

### Future Consideration (v2+)

- [ ] Case study deep-dives per project (full narrative pages) — requires significant writing investment
- [ ] Ambient audio layer (user-controlled) — high risk, high reward; only if audio design budget exists
- [ ] Interactive Three.js project accents (per-project 3D elements) — currently scoped as GSAP only per section

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Three.js particle hero | HIGH | HIGH | P1 |
| Lenis smooth scroll | HIGH | LOW | P1 |
| Loading/preloader sequence | HIGH | LOW | P1 |
| Projects full-viewport showcase | HIGH | MEDIUM | P1 |
| Clip-path scroll reveals | HIGH | MEDIUM | P1 |
| Split-text animations | HIGH | MEDIUM | P1 |
| Film grain overlay | MEDIUM | LOW | P1 |
| About section + parallax photo | HIGH | LOW | P1 |
| Docs section (markdown + nav + search) | HIGH | MEDIUM | P1 |
| Horizontal scroll gallery (interests) | MEDIUM | MEDIUM | P1 |
| Custom cursor | MEDIUM | MEDIUM | P1 |
| Ambient glow + mesh gradients | HIGH | LOW | P1 |
| Mobile responsiveness | HIGH | MEDIUM | P1 |
| Page transitions (GSAP Flip/Swup) | MEDIUM | HIGH | P2 |
| Scroll-velocity distortion shaders | HIGH | HIGH | P2 |
| Pagefind search (docs) | MEDIUM | LOW | P2 |
| OpenGraph social meta | MEDIUM | LOW | P2 |
| Per-project 3D accents | MEDIUM | HIGH | P3 |
| Ambient audio layer | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have — add when core is stable
- P3: Nice to have — future consideration only

---

## Competitor Feature Analysis

Analysis drawn from Awwwards SOTD, FWA, and CSS Design Awards winners including Lando Norris, Joffrey Spitzer Portfolio, Dorian Lods Portfolio (2025 Awwwards), Jordan Breton Portfolio (FWA Oct 2025).

| Feature | Lando Norris (Awwwards) | Joffrey Spitzer (Codrops 2026) | Jordan Breton (FWA 2025) | Our Approach |
|---------|--------------------------|-------------------------------|--------------------------|--------------|
| Scroll library | Lenis | Lenis | Unknown | Lenis — confirmed best choice |
| Animation engine | GSAP + ScrollTrigger | GSAP + ScrollTrigger | GSAP | GSAP + ScrollTrigger |
| 3D/WebGL | 3D helmet rotation, Rive | Three.js WebGL effects | Floating island scene (full 3D world) | Three.js hero + accents only |
| Preloader | Yes (cinematic) | Yes (progress counter + clip-path) | Yes | Clip-path counter reveal |
| Split text | Yes | Yes (SplitText plugin) | Unknown | GSAP SplitText |
| Custom cursor | Yes | Unknown | Unknown | Yes (desktop) |
| Page transitions | Yes (cinematic) | Yes (GSAP Flip + Swup) | Unknown | GSAP Flip + Astro View Transitions |
| Horizontal scroll | Yes | Vertical slider | Unknown | Yes (Interests section) |
| Film grain | Implied (noise texture) | Not mentioned | Unknown | Yes (CSS/canvas overlay) |
| Docs section | No (sports site) | No | No | Yes — unique differentiator |
| Framework | Unknown | Astro | Unknown | Astro — aligns with Joffrey pattern |

---

## Sources

- [Awwwards Annual Awards 2024 — Site of the Year](https://www.awwwards.com/annual-awards-2024/site-of-the-year)
- [Lando Norris — Awwwards SOTD](https://www.awwwards.com/sites/lando-norris)
- [OFF+BRAND Lando Norris Case Study](https://www.itsoffbrand.com/our-work/lando-norris)
- [Joffrey Spitzer Portfolio: Astro + GSAP Build — Codrops (Feb 2026)](https://tympanus.net/codrops/2026/02/18/joffrey-spitzer-portfolio-a-minimalist-astro-gsap-build-with-reveals-flip-transitions-and-subtle-motion/)
- [Letting the Creative Process Shape a WebGL Portfolio — Codrops (Nov 2025)](https://tympanus.net/codrops/2025/11/27/letting-the-creative-process-shape-a-webgl-portfolio/)
- [10 Award-Winning Websites Mastering Page Transitions — Orpetron/Medium](https://medium.com/orpetron/10-award-winning-websites-mastering-the-art-of-page-transitions-70be8bf6bc0e)
- [Awwward-Winning Animation Techniques — Design Bootcamp/Medium](https://medium.com/design-bootcamp/awwward-winning-animation-techniques-for-websites-cb7c6b5a86ff)
- [CSS Design Awards Website of the Year 2024](https://www.cssdesignawards.com/woty2024)
- [Top 100 Creative Portfolio Websites 2025 — Muzli](https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/)
- [WebGL Refraction Hover — Dorian Lods Portfolio 2025 (Awwwards)](https://www.awwwards.com/inspiration/webgl-refraction-hover-effect-dorian-lods-portfolio-2025)
- [Interactive WebGL Particles on Hero Image — Awwwards Inspiration](https://www.awwwards.com/inspiration/interactive-webgl-particles-on-hero-image-salt-and-pepper)
- [Best Three.js Websites — Awwwards Collection](https://www.awwwards.com/websites/three-js/)
- [LCP Optimization — Vercel Knowledge Base](https://vercel.com/kb/guide/optimizing-core-web-vitals-in-2024)

---

*Feature research for: Immersive personal portfolio + public knowledge base*
*Researched: 2026-03-30*
