---
phase: B1
name: Scroll Infrastructure + Tokens
version: v1
status: pending
depends_on:
  - A1
backlog_items:
  - "2026-04-18-vite-8-drift-with-astro-6"
---

# Phase B1: Scroll Infrastructure + Tokens

## Goal

Land the foundations the whole cinematic film rides on: Lenis smooth scroll, GSAP ScrollTrigger, a scene controller that owns shot state, and a token file that matches the cinematic palette.

## Deliver

- Lenis initialized once in a `ScrollCoordinator` module
- GSAP ScrollTrigger synced to the Lenis ticker
- `SceneController` state machine with shot IDs `boot | hero | work | dive | about | contact | end` and per-shot progress `0..1`
- One pinned verification section that proves the scroll system is correct
- `src/styles/tokens.css` updated to the cinematic palette and motion curves from [[docs/plans/v1/design-tokens.md]]
- Astro/Vite toolchain warning resolved or explicitly contained
- Reduced-motion path: scroll still navigates, animations skip to end-states
- Zero console errors

## Pass Gate

- pinned test section behaves correctly with no spacer glitches
- tokens applied site-wide; pre-cinematic hex values (`#0a0a0a`, `#a855f7`) no longer appear in source
- `SceneController.current` reports correct shot during scroll
- reduced-motion disables animation layer without breaking nav or scroll
- no console errors; agent-browser end-to-end verified
- Astro/Vite toolchain warning cleared

## Detailed Plan

See [[docs/plans/v1/b1-scroll.md]].
