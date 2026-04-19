# Personal Website Roadmap

`ROADMAP.md` is the single roadmap source of truth for this repo.

<!-- ROADMAP_STATE
truth_date: 2026-04-19
version: v1
version_status: in_progress
current_milestone: V1
milestone_status: in_progress
current_phase: B1
phase_status: planning_complete_awaiting_greenlight
next_milestone: V1
next_step: Start B1 scroll infrastructure from docs/phases/v1/phase-b1-scroll-infrastructure.md
active_blockers: [astro6_vite8_drift, homepage_is_stub_only, docs_shell_only]
note: Roadmap reframed 2026-04-19 to the cinematic treatment (docs/plans/cinematic-treatment.md). Phase IDs A1..G1 are stable; scope updated to carry the shot-list and bebop aesthetic. Detailed plans live at docs/plans/v1/.
last_handoff: v1_cinematic_reframe_2026-04-19
-->

## Status Snapshot

- truth date: `2026-04-19`
- current version: `v1`
- version status: `in_progress`
- current milestone: `V1: Launch the cinematic personal website`
- current phase: `B1: Scroll Infrastructure` — ready to start
- completed: `A1: Foundation`
- next step: build Lenis + GSAP ScrollTrigger sync, verify on pinned test section, then hand off to C1 boot + hero
- roadmap rule: this file is the single roadmap truth; `HANDOFF.json` carries machine state, `docs/handoff/` carries human handoff notes

## Current Product Truth

- The Astro scaffold, design tokens, layouts, and film grain exist.
- The homepage is still a stub; no shot-list scenes are wired up.
- The docs section is only a shell layout; no content collections, sidebar, or search.
- `npm run dev` runs at `http://127.0.0.1:4321/`.
- Astro warns that Vite 8 resolves where Astro 6 expects Vite 7.

## Design Contract

- Cinematic treatment: [[docs/plans/cinematic-treatment.md]] (authoritative for tone, shots, palette, typography, sound)
- Real project manifest: [[docs/plans/project-manifest.md]] (source of truth for repo data)
- Token drift note: `src/styles/tokens.css` still uses the pre-cinematic palette. Alignment lives in [[docs/plans/v1/design-tokens.md]] and ships in B1.

## V1 Milestone

Goal: ship a memorable, cinematic portfolio site that opens with a film sequence, proves skill via real repo micro-experiences, and transitions cleanly into a usable knowledge base.

| Phase | Name | Status | Goal | Phase Doc | Plan |
| --- | --- | --- | --- | --- | --- |
| A1 | Foundation | `complete` | Stable Astro scaffold, tokens, layouts, visual base | [[docs/phases/v1/phase-a1-foundation.md]] | — |
| B1 | Scroll Infrastructure + Tokens | `pending` | Lenis + ScrollTrigger sync, cinematic token alignment, scene controller scaffold | [[docs/phases/v1/phase-b1-scroll-infrastructure.md]] | [[docs/plans/v1/b1-scroll.md]] |
| C1 | Shot 00 Boot + Shot 01 Hero | `pending` | Three.js sphere boot + hero ambient with HUD and parallax | [[docs/phases/v1/phase-c1-hero-section.md]] | [[docs/plans/v1/c1-boot-and-hero.md]] |
| D1 | Shot 03 The Dive (money shot) | `pending` | 300vh sticky five-beat work→about transition, shatter + emergence | [[docs/phases/v1/phase-d1-page-transitions.md]] | [[docs/plans/v1/d1-dive.md]] |
| E1 | Shot 02 Work + Micro-Experiences | `pending` | Facet unfold, 8 categories, 8 per-project micro-experiences from real repos | [[docs/phases/v1/phase-e1-content-sections.md]] | [[docs/plans/v1/e1-work-and-experiences.md]] |
| F1 | Shot 04 Transmit + Docs Section | `pending` | Transmitter contact form, handshake animation, docs IA + content | [[docs/phases/v1/phase-f1-docs-section.md]] | [[docs/plans/v1/f1-transmit-and-docs.md]] |
| G1 | End Card + Audio + Polish + Deploy | `pending` | `SEE YOU SPACE COWBOY` closer, sound engine, mobile, a11y, perf, ship | [[docs/phases/v1/phase-g1-performance-deployment.md]] | [[docs/plans/v1/g1-endcard-audio-polish.md]] |

## Cross-Cutting Specs

- [[docs/plans/v1/design-tokens.md]] — palette, typography, spacing, motion curves, all CSS tokens
- [[docs/plans/v1/sound-spec.md]] — audio engine, licensing tiers, per-session track mapping
- [[docs/plans/v1/data-pipeline.md]] — GitHub build-time fetch, `src/data/projects.ts` shape, fallback
- [[docs/plans/v1/scene-controller.md]] — scroll → shot state machine, reduced-motion, reduced-gpu
- [[docs/plans/v1/hud-and-session-card.md]] — HUD corner specs and session-card component API

## Backlog

Open backlog lives under `docs/backlog/`.

- **[high]** [Astro 6 currently resolves Vite 8 instead of the expected Vite 7 line](docs/backlog/v1/2026-04-18-vite-8-drift-with-astro-6.md)
- **[high]** [Homepage is still a foundation stub rather than the cinematic landing experience](docs/backlog/v1/2026-04-18-homepage-still-foundation-stub.md)
- **[high]** [Docs section is still shell-only with no real content system or navigation](docs/backlog/v1/2026-04-18-docs-section-still-shell-only.md)
- **[medium]** Token file (`src/styles/tokens.css`) predates the cinematic palette and must be aligned in B1
- **[medium]** Site copy still says `@aparcedo`; real handle is `@Josue7211` — fix in E1

## Reference Docs

- Design spec: [[docs/superpowers/specs/2026-03-30-personal-website-design.md]]
- Cinematic treatment: [[docs/plans/cinematic-treatment.md]]
- Project manifest: [[docs/plans/project-manifest.md]]
- Handoff index: [[docs/handoff/INDEX.md]]
- Backlog index: [[docs/backlog/INDEX.md]]
- Plans index: [[docs/plans/INDEX.md]]

## Non-Goals

- Reintroducing `.planning` or GSD phase scaffolding
- Turning the docs IA into a second roadmap source
- Shipping a generic card-grid portfolio
- Violating the cinematic treatment — any contradiction must update the treatment first

## Open Decisions (block phase-specific detail until resolved)

See `§16` of the cinematic treatment. Summary:

1. Audio commitment path: tier-2 (Spotify embed) baseline + tier-3 (original stings) — pending confirmation
2. Amber `#fbbf24` as rare accent — pending confirmation
3. Public-facing email — pending pick between `bobbyparzero@gmail.com` and `josue@aparcedo.org`
4. Category count — 8 base faces confirmed unless a category drops out
5. Docs aesthetic — cinematic shell vs reading mode — pending pick
