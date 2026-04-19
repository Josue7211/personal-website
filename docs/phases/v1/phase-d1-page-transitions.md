---
phase: D1
name: Shot 03 The Dive
version: v1
status: pending
depends_on:
  - B1
  - C1
backlog_items: []
---

# Phase D1: Shot 03 — The Dive (money shot)

## Goal

Ship the work→about transition: a 300vh sticky scroll-track with five beats (lock-on, approach, puncture, emergence, land), shatter physics, inside-the-sphere reveal, audio ducking. This is the shot everything else orbits.

## Deliver

- 300vh sticky scroll track for SHOT 03 driven by `SceneController` + ScrollTrigger
- Five-beat timeline matching the %-bands in [[docs/plans/cinematic-treatment.md#shot-03-the-dive-work-about-money-shot]]
- Rotation lock-on + crosshair HUD reticle
- Camera dolly on `--ease-long`
- Sub-triangle shatter wave with shard tumble, distance fade, chromatic aberration pulse
- Emergence: serif `Notes on me.` letter stagger (40ms) + slight 3d rotation + body type-in + R→L stats grid slide
- Audio ducking: 400ms silence at beat 3, resume on beat 5
- Reduced-motion: dive collapses to opacity crossfade, no shatter
- Mobile: track shortens to 150vh, shard count halved
- Scroll up/down re-entry clean (no ghost shards, no stuck HUD)

## Pass Gate

- dive holds 60fps on integrated GPU with all textures on
- beat boundaries exact and deterministic under up + down scroll
- shatter never leaks shards outside viewport; particle count within budget
- audio ducks and returns cleanly
- reduced-motion path verified end-to-end in agent-browser
- no console errors; no visible tearing; no overscroll bounce breaking the track

## Detailed Plan

See [[docs/plans/v1/d1-dive.md]].
