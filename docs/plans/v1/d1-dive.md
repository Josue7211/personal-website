---
name: D1 — Shot 03 The Dive (money shot)
phase: D1
status: ready
last_revised: 2026-04-19
---

# D1 — Shot 03 · The Dive

Target: ~2 weeks. The shot the entire site is judged on.

## 1. Geometry

A 300vh sticky scroll track. Inside: one pinned 100vh viewport. All five beats happen inside that viewport while the user scrolls 3 viewport-heights.

```
[ work section ]
[ about-track 300vh sticky container  ← pinned
   ┌──────────────────────────────┐
   │  viewport (100vh)            │ ← stays put
   │                              │
   │  beats 1..5 play here        │
   └──────────────────────────────┘
]
[ about section (stable) ]
```

Scroll progress 0..1 maps to track position within the 300vh span.

Mobile: track span = 150vh, beats compress proportionally.

## 2. Beat table (authoritative)

| beat | track % | duration @ normal scroll | action | audio |
|------|---------|--------------------------|--------|-------|
| 1 lock-on | 0–20 | ~0.9s | sphere rotates so about-facet aims at camera; crosshair HUD reticle fades in on the facet centroid; mono ticker shows `ACQUIRING · 02 · ABOUT`; reticle pulses once | carry-over |
| 2 approach | 20–55 | ~1.6s | camera dollies from z=5.5 to z=2.1 on `--ease-long`; dust particles stream past (radial velocity away from target); wireframe edges glitch chromatic aberration ramps 0→4px; violet rim intensifies 0.8→1.8 | carry-over; mild low-pass starts at 40% |
| 3 puncture | 55–72 | ~0.8s | target facet's 64 sub-triangles shatter outward in a wave from centroid; each shard: random v ∈ [3..7] u/s, random ω ∈ [-4..4] rad/s, fade by distance; chroma pulses 4→8→2px; between shards: deeper violet void visible | 400ms silence + shatter sting (tier 3) at exactly t(beat 3 start + 80ms) |
| 4 emergence | 72–90 | ~0.9s | shards removed; camera at z=-0.3 (inside sphere); serif `Notes on me.` letters drop from y=+40px with 40ms stagger + rotation ±6° → 0; body paragraphs type in at 30 char/s; right stats grid slides in R→L on `--ease-long` 480ms | ambient resumes (Green Bird) |
| 5 land | 90–100 | ~0.5s | camera stops z=-0.3; sphere exterior faintly ghosted in background at 12% opacity; HUD updates `SESSION 02 · ACTIVE`; reticle removed | stable |

Beat boundaries are purely a function of scroll offset. Scroll up → beats reverse exactly.

## 3. Lock-on math

At beat start, read target facet normal. Compute rotation (XYZ Euler) that aligns that normal with camera forward (-Z). Tween with `--ease-long` scaled to beat-1 progress. Use quaternion slerp, not Euler, to avoid gimbal on diagonal facets.

```ts
const targetNormal = facet.normal.clone().normalize()
const camForward = new THREE.Vector3(0, 0, -1)
const q = new THREE.Quaternion().setFromUnitVectors(targetNormal, camForward)
// on each frame during beat 1:
sphere.quaternion.slerpQuaternions(sphereStartQ, q, easeLong(progress01))
```

Target facet = the facet representing AGENT MEMORY (face 0) by default. Overridable by query param `?diveTarget=<category-id>` for testing.

## 4. Approach — camera dolly

- z(t) = lerp(5.5, 2.1, easeLong(t))
- optional tiny shake from 0.10 magnitude on `--ease-hard` every 240ms (1 pixel feel)
- dust particles: 140 count, billboarded triangles, positions on a cone with apex at camera, receding z; recycled when off-screen

## 5. Puncture — shatter

`ShatterSystem`:

```ts
interface Shard {
  geom: BufferGeometry        // one of the 64 sub-triangles
  position: Vector3
  velocity: Vector3           // direction from centroid × random(3,7)
  angularVelocity: Euler
  age: number                 // 0..1
  material: Material          // shared, fade via uniform
}
```

Update per frame during beat 3:
- p += v · dt
- rot += ω · dt
- material.opacity = 1 - smoothstep(0.3, 1.0, age)
- cull when age ≥ 1

Count: 64 shards at full quality; 32 on `reducedGpu`; 0 on `reducedMotion` (collapse to single fade).

Impact sting: `AudioEngine.sting('shatter')` at t=beat3Start+80ms.

## 6. Emergence — camera inside

- at beat 4 start, camera instantly moves to z=-0.3 with target (0,0,-1) — "we are inside"
- sphere back-face culling disabled or switch to `MeshStandardMaterial({ side: DoubleSide })` for this beat
- inside surface illuminated by a new violet point light at (0,0,0)
- on exit of SHOT 03 (scroll far past 100%), camera restored

## 7. Emergence — typography

`Notes on me.` layout:

```
Notes on me.        <- serif display, 80px, weight 400, italic 'me'
                    <- 48px gap
[body text]         <- body 18px, 1.55 line-height, max 520px
                    <- 24px gap
[stats grid]        <- mono, 2 cols × 3 rows
```

Letter drop: `transform: translateY(40px) rotate(var(--lr))` → `translate(0) rotate(0)`, per-char delay `i * 40ms`. `--lr` per char = random ±6°.

Body type-in: classic char-by-char append at 30 chars/sec. Cursor block blinks 1s.

Stats grid: slides from right with `--ease-long` 480ms. Staggered 80ms per cell.

## 8. Reduced motion

- whole dive = opacity crossfade between sphere exterior (SHOT 02 end) and about panel
- 600ms `--ease-hard`
- no shatter, no dust, no chroma
- typography still reveals but with `stagger=0`

## 9. Reduced GPU

- shard count 32
- no chromatic aberration post-process during dive (flat render)
- dust count 60

## 10. Integration with SceneController

```ts
sceneController.onProgress((state) => {
  if (state.id !== 'dive') return
  dive.updateBeats(state.progress)  // dispatches to beat-specific animators
})
```

Each beat animator is a pure function of progress ∈ [0,1] within that beat band.

## 11. Audio hooks

```ts
if (beat === 3 && !played) {
  audio.duck(400)
  audio.sting('shatter')
  played = true
}
if (beat === 4 && state.progress > 0.72 && !resumed) {
  audio.setScene('about')
  resumed = true
}
```

On reverse scroll, flags reset when progress exits the band.

## 12. Files

```
src/scene/three/
  Dive.ts               NEW  orchestrator — beats 1..5
  LockOn.ts             NEW  beat 1
  Dolly.ts              NEW  beat 2
  Shatter.ts            NEW  beat 3
  Emergence.ts          NEW  beat 4
  Dust.ts               NEW  particle system
src/components/ui/
  CrosshairReticle.astro NEW
  DiveTypography.astro  NEW
  StatsGrid.astro       NEW
src/pages/
  index.astro           MOD  add #about-track sticky container
src/styles/
  index-scene.css       MOD  remove legacy -65vh overlap; add sticky-track rules
```

## 13. CSS (sticky-track spine)

```css
.about-track {
  position: relative;
  height: 300vh;
}
.about-track__pin {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}
@media (max-width: 768px) {
  .about-track { height: 150vh; }
}
```

## 14. Build order

1. sticky track skeleton + pin verification (1d)
2. LockOn + reticle (1.5d)
3. Dolly + dust (2d)
4. Shatter (3d — hardest)
5. Emergence camera + typography (2d)
6. Audio ducking hook (0.5d)
7. Reduced-motion + reduced-GPU paths (1d)
8. Mobile tuning (1d)
9. Verification + screenshots (1d)

## 15. Verification checklist

- [ ] scroll into dive at normal speed — beats feel continuous
- [ ] scroll back up — shards regenerate/reverse cleanly; no orphaned particles
- [ ] fast flick scroll — no crashed state; camera never stuck inside
- [ ] FPS ≥ 60 on integrated GPU through all beats
- [ ] audio ducks at beat 3, resumes at beat 4
- [ ] reduced-motion crossfade works
- [ ] reduced-GPU halves shards; no visual glitches
- [ ] mobile 150vh track works; shard count halved
- [ ] agent-browser end-to-end test: scroll to various offsets, assert DOM + SceneController state
- [ ] no console errors; no WebGL context loss under stress

## 16. Risks

- Shard count × shader cost × grain post-process = GPU budget tightest here; profile on Intel UHD 620
- Quaternion slerp edge case when target is 180° (antipodal) — handle with a nudge vector
- Sticky-pin + Lenis interactions on scroll-chaining — verify on macOS Safari
- Audio ducking glitch if unmute happens mid-dive — guard with state check
