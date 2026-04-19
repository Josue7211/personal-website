---
phase: E1
name: Shot 02 Work + Micro-Experiences
version: v1
status: pending
depends_on:
  - B1
  - C1
backlog_items: []
---

# Phase E1: Shot 02 Work + Project Micro-Experiences

## Goal

Wire the sphere to real work. Base faces = categories, sub-triangles = repos. Each flagship repo gets a micro-experience, not a card. Build the data pipeline, the facet-unfold interaction, and the first three flagships end-to-end.

## Deliver

- `src/data/projects.ts` fed by build-time GitHub fetch per [[docs/plans/v1/data-pipeline.md]]
- Face ↔ category ↔ repo mapping from [[docs/plans/project-manifest.md]]
- Session-card variant for `SESSION 01 · STRAY SIGNAL`
- Face-centroid labels with nous meta (`[001/2026] · RUST · AGENTS`)
- Facet unfold interaction: origami toward camera, other sphere dimmed, back button folds back
- Reduced-motion: unfold collapses to a drawer slide
- Three flagship micro-experiences wired: memd, security-sweep, claude-autoresearch
- Five remaining micro-experiences stubbed with session card + static screenshot; full animation deferred to G1
- About section copy updated to the real thesis
- Site copy handle fix: `@aparcedo` → `@Josue7211`
- Email decision applied (ROADMAP open decision #3)

## Pass Gate

- real repo data visible in UI; no placeholder names remain
- unfold works deterministic on every face at 60fps
- three flagship micro-experiences pass visual QA vs their spec
- keyboard shortcuts `J`/`K` step through sessions
- reduced-motion path verified
- GitHub fetch caches correctly on build; fallback JSON works when API fails
- no console errors

## Detailed Plan

See [[docs/plans/v1/e1-work-and-experiences.md]].
