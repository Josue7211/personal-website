---
name: F1 — Shot 04 Transmit + Docs Section
phase: F1
status: ready
last_revised: 2026-04-19
---

# F1 — Shot 04 Transmit + Docs

Target: ~1.5 weeks.

## 1. SHOT 04 Transmit

### Layout

```
[SessionCard variant D — terminal frame, blinking cursor types 'SESSION 03 · TRANSMIT · outbound signal']
                       ↓ 900ms hold, hard cut
[transmitter panel]
  ┌─────────────────────────────────────┐
  │ > compose --to josue@aparcedo.org   │ mono header
  │                                     │
  │ TO:      [ _________________ ]      │ inputs, terminal-style
  │ FROM:    [ _________________ ]
  │ MESSAGE: [ _________________ ]
  │          [ _________________ ]
  │          [ _________________ ]
  │                                     │
  │                      [ TRANSMIT ]   │ amber when focused, violet otherwise
  └─────────────────────────────────────┘
```

Field styling: mono, `--text-sm`, input background `--color-void-soft`, bottom border `--color-electric`, focus border `--color-warm-signal`.

### Handshake animation (1.2s total)

On submit:

| t(ms) | line displayed |
|-------|----------------|
| 0 | `> SYN` |
| 180 | `> SYN-ACK` |
| 360 | `> ACK` |
| 540 | `> message queued…` |
| 800 | `> delivered ✓` (amber check) |
| 1200 | transmitter dims; 'send another' link |

Each line appears via mono char append. Typing speed 30 char/s.

### Backend

**V1 path** (decision): Cloudflare Worker that forwards to email (Resend API) OR `mailto:` fallback if Worker not ready. Leaning Worker for the handshake to feel real.

```
POST /api/transmit
{ to: string, from: string, message: string }
→ 200 { status: 'delivered', id: '...' }
→ 429 { status: 'rate-limited' }
```

Client validates fields client-side (min 3 chars, email format on `from`). Server validates + rate-limits 5/min/IP.

Honeypot field + cloudflare turnstile challenge.

### States

- idle
- transmitting (fields disabled, handshake running)
- success (1.2s green check, then idle-reset)
- error (red line, 'retry' CTA)

### Reduced motion

Handshake lines appear instantly, no char animation. Still 1.2s pause for legibility.

## 2. Docs Section

### 2.1 Aesthetic (decision needed)

Two options per ROADMAP open decision #5:

- **A. Cinematic shell**: same grain, vignette, violet palette. Reading is the "transmission log" aesthetic.
- **B. Reading mode**: light parchment background, serif body, generous margins. Separate palette.

Recommendation: **A with modifications** — keep grain + vignette dim, drop chromatic aberration, increase line-height, max-width 680px, serif body. Feels like part of the same world but readable long-form.

### 2.2 IA

```
/docs
├── essays/
│   ├── on-agent-memory.md
│   ├── the-real-folk-blues-loop.md
│   └── cowboy-bebop-as-a-design-language.md
├── case-studies/
│   ├── memd.md
│   ├── security-sweep.md
│   ├── claude-autoresearch.md
│   ├── bjorn.md             (stretch)
│   └── homelab-cli.md       (stretch)
└── notes/
    └── colophon.md          (site build notes)
```

### 2.3 Content collection

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content'

export const collections = {
  essays: defineCollection({
    schema: z.object({
      title: z.string(),
      summary: z.string(),
      published: z.date(),
      updated: z.date().optional(),
      tags: z.array(z.string()),
    })
  }),
  'case-studies': defineCollection({
    schema: z.object({
      title: z.string(),
      repo: z.string(),
      summary: z.string(),
      published: z.date(),
      hero: z.string().optional(),  // image path
      takeaways: z.array(z.string()).optional(),
    })
  }),
  notes: defineCollection({
    schema: z.object({
      title: z.string(),
      published: z.date(),
    })
  }),
}
```

### 2.4 Layout

```
┌──────┬────────────────────────────┐
│ SIDE │   [breadcrumb]             │
│ NAV  │                            │
│      │   # title                  │
│      │   summary                  │
│      │                            │
│      │   body                     │
│      │                            │
│      │                            │
└──────┴────────────────────────────┘
```

- sidebar 240px fixed, `--color-void-soft`, mono labels
- content max 680px, serif body 18px 1.7 line-height
- mobile: sidebar becomes drawer triggered by a nav button

### 2.5 Search

**Pick**: Pagefind. Built at Astro build time, zero runtime deps, no backend. Fuse.js considered but ranking is worse and requires shipping the full index to client.

Command: `npx pagefind --site dist` after Astro build. Output: `dist/pagefind/`.

Client: `<div id="search">` → Pagefind UI default styling, themed to tokens.

### 2.6 First three case studies — content outlines

- **memd**: why agent memory matters → architecture (control plane, stores, recall, voice modes) → the session-resume moment → lessons
- **security-sweep**: why 19 agents, tiered design, what a sweep looks like in practice, sample finding
- **claude-autoresearch**: overnight loop architecture, research-first principle, guardrails

Each case study: hero image + 1500-3000 words + outbound link to repo.

### 2.7 Bundle rule

Docs pages MUST NOT load Three.js, Lenis, or GSAP. Verified by bundle inspector step in CI.

## 3. Files

```
src/pages/docs/
  index.astro             MOD  docs home / index of all sections
  [...slug].astro         NEW  catch-all renderer for content collections
src/layouts/
  DocsLayout.astro        MOD  two-col layout, sidebar, search
src/components/docs/
  SideNav.astro           NEW
  Breadcrumb.astro        NEW
  SearchPanel.astro       NEW  Pagefind mount
  CaseStudyHero.astro     NEW
src/content/
  config.ts               NEW  collection schemas
  docs/
    essays/*.md           NEW  3 essays
    case-studies/*.md     NEW  3 case studies
    notes/colophon.md     NEW
src/pages/api/
  transmit.ts             NEW  Cloudflare Worker endpoint
src/components/contact/
  Transmitter.astro       NEW
  Handshake.ts            NEW
```

## 4. Build order

1. Docs content collection + schemas (1d)
2. DocsLayout + SideNav + Breadcrumb (1d)
3. Pagefind build + SearchPanel (1d)
4. 3 case studies + 3 essays content (2d)
5. Transmitter Astro + client logic (1.5d)
6. Handshake animation (0.5d)
7. Cloudflare Worker + rate limit + turnstile (1d)
8. Verification + screenshots (1d)

## 5. Verification

- [ ] docs reading experience verified on mobile + desktop
- [ ] Pagefind returns results < 100ms
- [ ] sidebar keyboard-navigable
- [ ] docs bundle size check: no three.js, no gsap, no lenis in prod docs HTML
- [ ] transmitter form submits end-to-end; receives email
- [ ] rate limit returns 429 correctly
- [ ] handshake plays even when real POST is slow (decouple animation from request)
- [ ] no console errors

## 6. Risks

- Cloudflare Worker + Resend API key management — use CF dashboard secrets, never in repo
- Pagefind + Astro content collections — verify page URL generation matches Pagefind expectations
- mailto fallback on mobile — ensure both paths work
