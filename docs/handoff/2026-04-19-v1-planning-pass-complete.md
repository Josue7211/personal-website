---
date: 2026-04-19
phase: V1 planning → awaiting greenlight for B1
status: planning_complete_awaiting_greenlight
prev_handoff: 2026-04-18-v1-roadmap-bootstrap.md
---

# V1 Detailed Planning Pass — Complete

## TL;DR

Every shot, pixel, token, ms, and copy block of the cinematic site is now specified across 17 files. No code written this session (beyond a mistake that may need reverting — see §4). Next session resumes after the user resolves 5 open decisions and greenlights B1.

## 1. What was produced

### Roadmap

- `ROADMAP.md` — reframed phase table around 5-shot cinematic structure (B1 scroll + tokens → C1 boot + hero → D1 dive → E1 work + experiences → F1 transmit + docs → G1 end card + audio + polish + deploy). Preserves ROADMAP_STATE block.

### Phase contracts (short)

`docs/phases/v1/phase-{b1,c1,d1,e1,f1,g1}.md`

Each ~30-50 lines. Frontmatter + Goal / Deliver / Pass Gate / link to detailed plan.

### Cross-cutting specs (deep)

`docs/plans/v1/`

- `design-tokens.md` — concrete CSS token values (palette, type, space, motion). Flags 3 existing tokens to replace in B1.
- `sound-spec.md` — `AudioEngine` interface, licensing tiers, per-session track map (Tank! / Space Lion / Green Bird / Waltz for Venus / Real Folk Blues).
- `data-pipeline.md` — GitHub GraphQL build-time fetch, `src/data/projects.ts` shape, `.cache/github.json` fallback.
- `scene-controller.md` — `SceneController` class API + scroll→shot state machine + debug query flags.
- `hud-and-session-card.md` — HUD corners, `SessionCard` variants A-E, authoritative session catalog.
- `nav-and-layout.md` — nav desktop/mobile, focus rings, BaseLayout/MainLayout/DocsLayout responsibilities.
- `about-page.md` — desktop layout, authoritative copy block, stats aside (email/github/linkedin), 180-day contribution graph.
- `mobile-and-a11y.md` — per-shot mobile table, reduced-motion matrix, noJS/noWebGL fallbacks, a11y landmarks + live region.

### Per-phase deep plans

- `b1-scroll.md` — ScrollCoordinator TS impl sketch, token sweep, Vite 7 pin.
- `c1-boot-and-hero.md` — Three.js scene spec, SHOT 00 boot timeline (ms per frame), hero layout.
- `d1-dive.md` — the money shot. 300vh sticky geometry, 5-beat table with track % + duration + audio + action, quaternion slerp lock-on math, ShatterSystem, emergence typography.
- `e1-work-and-experiences.md` — facet unfold, 3 flagship micro-experiences detailed (memd memory-graph, security-sweep bounty-hunter, claude-autoresearch loop), 5 stubs schematic.
- `f1-transmit-and-docs.md` — handshake timing (SYN→SYN-ACK→ACK→queued→delivered 1.2s total), docs content collection schema, Pagefind pick.
- `g1-endcard-audio-polish.md` — perf budgets (FCP<1.5s, LCP<2.5s, dive 60fps, 220kb three.js gz), cursor state table, command palette, deploy config.

### Index + README

- `docs/plans/INDEX.md` — links every plan file.
- `docs/plans/v1/README.md` — plan read order.

## 2. Design contracts (unchanged, authoritative)

- `docs/plans/cinematic-treatment.md` — film treatment, shot list, palette, tone
- `docs/plans/project-manifest.md` — real GitHub repo categorization

All plans defer to these two for tone/content. Plans own pixels/ms.

## 3. Open decisions blocking B1

Must resolve before implementation starts:

1. **audio-tier** — self-host / Spotify Embed / CC original / hybrid? (default: hybrid)
2. **amber-accent** — confirm `#fbbf24` as rare-accent token? (default: yes)
3. **public-email** — `bobbyparzero@gmail.com` or `josue@aparcedo.org`? (default: bobbyparzero@gmail.com)
4. **sphere-categories** — 8 faces: Agents / Security / Homelab / Hardware / Tools / Research / Art / Writing — confirm or revise? (default: as-is)
5. **docs-aesthetic** — cinematic shell (grain + vignette) or reading-mode light? (default: cinematic shell, no 3D)

## 4. Uncommitted code edits

Earlier in the session (before user said plan-only), code was written to:

- `public/scene/app.js` — real PROJECTS array, drawerCta
- `src/pages/index.astro` — ticker, socials, tagline, email, handle, about body
- `src/layouts/BaseLayout.astro` — related foundation edits
- `src/styles/index-scene.css` — scene styles

User has not yet said `revert` or `keep`. Resolve before B1 starts or edits will collide with planned token sweep.

## 5. Loose ends beyond B1

- 5 micro-experience stubs (Bjorn / homelab-cli / AgentSecrets / claude-dream / mac-bridge) only have schematic polish targets in G1 §3 — optional per-repo interaction specs deferred unless user requests.
- Vite 8 drift — solution pinned in `b1-scroll.md` but not yet applied.

## 6. Resume protocol

1. Read `ROADMAP.md`
2. Read `HANDOFF.json`
3. Read `docs/plans/v1/README.md`
4. Ask user to resolve the 5 open decisions + revert-or-keep the uncommitted edits
5. DO NOT auto-implement. Memory `feedback_resume_no_implement.md` is active.

## 7. Memory updated

- `~/.claude/projects/-home-josue-Documents-projects-personal-website/memory/feedback_resume_no_implement.md` — lesson: resume-from-compaction never auto-implements.
- memd checkpoint saved with `current_phase=B1`, `phase_status=planning_complete_awaiting_greenlight`.
