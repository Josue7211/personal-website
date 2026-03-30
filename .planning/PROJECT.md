# Personal Website — josueaparcedo.com

## What This Is

An immersive, high-end personal website for Josue Aparcedo — a software engineer building a portfolio + creative expression site that doubles as a public knowledge base. The main site is a cinematic, scroll-driven experience with Three.js 3D elements, GSAP animations, and Lenis smooth scroll. The docs section is a separate, clean layout for technical guides and a public "second brain." Built with Astro.

## Core Value

The site must make a lasting first impression — a recruiter or fellow engineer should feel "wow" within the first 2 seconds of landing, then be able to explore projects, interests, and technical writing without friction.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Interactive Three.js particle hero that responds to mouse movement
- [ ] Cinematic scroll-driven storytelling with GSAP + ScrollTrigger
- [ ] Lenis smooth scroll throughout main site
- [ ] Film grain texture overlay on dark background
- [ ] About section — personal story, photo with parallax depth
- [ ] Projects section — full-viewport showcases per project, categorized (Web / Infrastructure / Hardware)
- [ ] Interests/Life section — horizontal scroll gallery of hobbies and passions
- [ ] Docs/knowledge base — custom sidebar nav, search, markdown-driven content
- [ ] Dark luxury aesthetic — deep purple/violet accents on near-black, tonal layering (no border lines)
- [ ] Premium typography — serif display (Playfair Display or Newsreader) + technical sans (Inter/Space Grotesk) + monospace (JetBrains Mono)
- [ ] Mobile responsive — full experience adapts gracefully to mobile
- [ ] Contact/footer section
- [ ] Page transitions and loading sequence
- [ ] Performance — fast initial load despite 3D elements (Astro partial hydration)

### Out of Scope

- Blog/RSS feed — not needed for v1, docs section covers written content
- CMS/admin panel — content managed via markdown files and git
- Analytics dashboard — can add later with simple Plausible or Umami
- E-commerce/payments — not a storefront
- User authentication — purely static site
- Comments/guestbook — unnecessary complexity for v1

## Context

**Inspiration sites:**
- landonorris.com — Lenis smooth scroll, GSAP ScrollTrigger, clip-path hover animations, horizontal scroll galleries, split-text character animations, cinematic dark luxury aesthetic
- munrooftoprome.com — Barba.js page transitions, video zoom sections, pinned parallax text, circular slider, noise texture overlay, full-viewport cinematic sections
- Josue's own Abeto project — Three.js 3D world, sci-fi HUD, spatial navigation, Orbitron/Chakra Petch/Space Mono fonts

**Design direction:**
- Dark luxury base (Lando Norris energy) with subtle futuristic tech flourishes
- Purple accent color — deep violet base (#7c3aed) with brighter purple (#a855f7) and lavender (#c4b5fd) for highlights
- Background: near-black (#0a0a0a), tonal surface layers (#111111 → #1a1a1a → #222222)
- Text: warm off-white (#e4e4e7), never pure white
- No border lines — tonal layering and spacing define structure (the "No-Line Rule")
- Ambient glow shadows, not drop shadows
- Mesh gradient atmospheric lighting with purple hues
- Film grain texture on backgrounds

**Design docs from Stitch exploration (colors/typography reference only — layouts were rejected as cheap/unpolished):**
- Three independent design systems all converged on "Digital Noir" principles
- Serif + technical sans pairing for editorial authority
- Obsidian Noir design doc: Newsreader + Space Grotesk, radioactive violet + electric sulfur accents

**The feel:**
- Landing: particle field coalesces → name appears → mouse creates magnetic repulsion on particles
- Scrolling: sections animate in with staggered GSAP reveals, clip-path transitions, parallax depth
- Projects: each project takes over the full viewport, background shifts mood per project
- Interests: horizontal scroll triggered by vertical scrolling
- Docs: clean gateway transition from immersive main site into a readable, functional knowledge base

**Tech stack:**
- Astro — static-first framework, content collections for docs, partial hydration for interactive components
- Three.js — particle hero, 3D accents on project showcases, section transitions
- GSAP + ScrollTrigger — scroll animations, text reveals, parallax, clip-path animations
- Lenis — smooth scroll
- Markdown — all docs content authored in .md files

**Docs content types:**
- Homelab guides (Docker setups, networking, self-hosting)
- Dev tutorials (code walkthroughs, framework guides, architecture deep-dives)
- Personal knowledge base (public "second brain" covering anything learned)

## Constraints

- **Tech stack**: Astro + Three.js + GSAP + Lenis — decided during brainstorming
- **Hosting**: Static site (deployable to Netlify, Vercel, or Cloudflare Pages)
- **Performance**: Must load fast despite 3D elements — Astro's partial hydration is key
- **Accessibility**: Site must be navigable without JavaScript (graceful degradation for docs section)
- **NAS builds**: Project lives on NAS — use `/tmp/personal-website-target` for any build cache if needed

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro over Next.js/Nuxt | Content-heavy site with docs — Astro's static-first + content collections are purpose-built for this. Ships zero JS by default. | — Pending |
| Custom docs over Starlight | 3D elements throughout the main site clash with Starlight's rigid layout. Need unified aesthetic control. | — Pending |
| Three.js for hero + accents | Shows WebGL/shader skills (rare, high signal to employers) without making the whole site a 3D world (which creates friction). | — Pending |
| Purple accent color | User's favorite color. Reads as both premium and technical. | — Pending |
| No Stitch-generated layouts | AI design generators produce cheap/unpolished output. Hand-crafted animation and design is what makes sites feel premium. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-30 after initialization*
