# Personal Website Design Spec — josue.aparcedo.org

**Date:** 2026-03-30
**Status:** Approved

## Overview

An immersive, high-end personal website that serves as both a portfolio/creative expression and a public knowledge base. Two distinct experiences under one brand:

1. **Main Site** — cinematic, scroll-driven, Three.js-enhanced immersive experience
2. **Docs Section** — clean, functional knowledge base with sidebar navigation and search

## Target Audience

- Recruiters and hiring managers (first impression matters)
- Fellow engineers (technical credibility)
- Josue himself (personal expression, public second brain)

## The Experience

### Landing / Hero

Black screen. A Three.js particle field fills the viewport — particles drift organically. The name "JOSUE APARCEDO" fades in with massive, sharp serif typography. The cursor creates a magnetic repulsion effect on nearby particles. This is the hero — no separate loading screen.

### Scroll Behavior

Lenis smooth scroll throughout. GSAP ScrollTrigger drives all section transitions:
- Text reveals with staggered line-by-line animations
- Clip-path transitions between sections
- Parallax depth on images and elements
- Slow cinematic easing (600ms+ transitions)

### About Section

The particle field compresses and shifts as the About section slides in. Split layout:
- One side: photo with subtle parallax depth shift
- Other side: personal story text, animated line-by-line
- Stats/counters below (years coding, projects shipped, etc.)

### Projects Section

Full-viewport project showcases — NOT a card grid. Each project takes over the screen as you scroll into it:
- Background shifts color/mood per project
- Images and details animate in with clip-path reveals
- Category filters at top: Web Apps / Infrastructure / Hardware
- Each project shows: title, description, tech stack tags, image/screenshot, link

### Interests / Life Section

Horizontal scroll gallery triggered by vertical scrolling (like Lando Norris's helmet hall):
- Cards for hobbies, interests, what drives Josue
- Each card has a hover state revealing more depth
- Personal, not corporate — shows the human behind the code

### Contact / Footer

Clean contact section with links (GitHub, LinkedIn, email). Footer with subtle branding.

### Docs Gateway

A clear visual transition from the immersive main site into the docs section — like walking from a gallery into a library.

## Docs Section

### Layout
- Left sidebar with collapsible category navigation
- Main content area with clean markdown-rendered text
- Search bar at top (client-side search via pagefind or similar)
- Breadcrumbs for navigation context
- Dark theme matching main site brand

### Content Types
- Homelab guides (Docker, networking, self-hosting)
- Dev tutorials (code walkthroughs, framework guides)
- Personal knowledge base (public "second brain")

### Content Authoring
- All content in Markdown files
- Powered by Astro content collections
- Frontmatter for metadata (title, category, date, tags)

## Design System

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0a0a0a` | Near-black base (avoids OLED harshness) |
| Surface 1 | `#111111` | First tonal layer |
| Surface 2 | `#1a1a1a` | Second tonal layer |
| Surface 3 | `#222222` | Third tonal layer (cards, elevated) |
| Primary | `#a855f7` | Vivid purple — main accent |
| Primary Deep | `#7c3aed` | Deeper violet — ambient glows |
| Primary Soft | `#c4b5fd` | Lavender — subtle highlights |
| Text | `#e4e4e7` | Warm off-white (never pure white) |
| Text Muted | `#a1a1aa` | Secondary text |

### Typography
| Role | Font | Usage |
|------|------|-------|
| Display | Playfair Display or Newsreader | Name, section headers — massive scale, tight letter-spacing |
| Body | Inter or Space Grotesk | Descriptions, paragraphs — clean, technical |
| Code | JetBrains Mono | Tags, metadata, docs code blocks |

### Design Principles
- **No-Line Rule:** No border lines. Structure defined by tonal layering and spacing.
- **Ambient Shadows:** Glow effects with purple tint, not drop shadows.
- **Mesh Gradients:** Atmospheric purple lighting at viewport edges, heavily blurred.
- **Film Grain:** Subtle noise texture overlay on all dark backgrounds.
- **Cinematic Easing:** All transitions 600ms+ with custom cubic-bezier curves.
- **Extreme Negative Space:** When in doubt, add more whitespace.

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Astro | Framework — static-first, content collections, partial hydration |
| Three.js | Particle hero, 3D accents, section transition effects |
| GSAP + ScrollTrigger | Scroll animations, text reveals, parallax, clip-path |
| Lenis | Smooth scroll |
| Markdown | All docs content |
| Pagefind (or similar) | Client-side docs search |

## Site Map

```
/                        → Main site (hero → about → projects → interests → contact)
/docs/                   → Knowledge base landing
/docs/[category]/        → Category listing
/docs/[category]/[slug]  → Individual guide
```

## Performance Constraints

- Astro ships zero JS by default — Three.js and GSAP only hydrate where needed (islands)
- Three.js particle count tuned for mobile (reduce on smaller screens)
- Images lazy-loaded with appropriate formats (WebP/AVIF)
- Target: < 3s first contentful paint on 4G

## Mobile Strategy

- Three.js hero simplifies on mobile (fewer particles, touch-based interaction)
- Horizontal scroll sections become vertical card stacks
- All GSAP animations respect `prefers-reduced-motion`
- Docs section fully responsive with collapsible sidebar

## Out of Scope (v1)

- Blog/RSS, CMS, analytics, e-commerce, auth, comments
- Server-side rendering (purely static)
- i18n / multi-language
