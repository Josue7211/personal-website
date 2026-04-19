---
phase: C1
name: Shot 00 Boot + Shot 01 Hero
version: v1
status: pending
depends_on:
  - B1
backlog_items:
  - "2026-04-18-homepage-still-foundation-stub"
---

# Phase C1: Shot 00 Boot + Shot 01 Hero

## Goal

Open the film. Deliver the boot sequence (`3, 2, 1, LET'S JAM` — nous/bebop voice) and the hero ambient: violet void, sphere assembling then hanging, nameplate, live HUD, parallax, jazz-lazy auto-rotation.

## Deliver

- Three.js scene: octahedron geometry (8 base faces + geodesic subdivision), wireframe-first assembly into filled faces
- Boot sequence: 2.8s tied to real asset load — amber countdown → wire assembly → nameplate settle → HUD materialize → rim pulse
- Session-card component used for the `JAM.` intro beat
- Hero shot: 3 RPM auto-rotation, pointer parallax, nameplate composition per [[docs/plans/cinematic-treatment.md#4-typography]]
- HUD corners: TL session/elapsed, TR lat/lon/est, BL now-playing ticker, BR scroll hint
- Always-on textures: grain, scanlines, vignette
- Reduced-motion: static sphere image + static nameplate
- NoWebGL fallback: static hero image
- WebGL context cleanup on unmount so route changes do not leak GPU memory

## Pass Gate

- boot runs once, sub-3s on 4G mid-tier laptop
- sphere renders 60fps on integrated GPU at hero rest
- HUD values live (EST clock ticks, session elapsed increments)
- nameplate reveal matches treatment timing
- scroll past hero smoothly hands off to D1 without jump
- reduced-motion and NoWebGL paths verified
- zero console errors

## Detailed Plan

See [[docs/plans/v1/c1-boot-and-hero.md]].
