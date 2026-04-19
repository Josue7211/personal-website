---
name: C1 — Shot 00 Boot + Shot 01 Hero
phase: C1
status: ready
last_revised: 2026-04-19
---

# C1 — Shot 00 Boot + Shot 01 Hero

Target: ~1.5 weeks.

## 1. Files

```
src/scene/
  three/
    Scene.ts              NEW  Three.js renderer, camera, lights
    Sphere.ts             NEW  octahedron geometry + material
    AssemblyAnimator.ts   NEW  boot sequence timeline
    HeroAnimator.ts       NEW  idle rotation + pointer parallax
    Postprocess.ts        NEW  grain, scanlines, vignette, chroma
    Textures.ts           NEW  shader textures + noise
  index.ts                MOD  bootstrap + mount to canvas
src/components/ui/
  SessionCard.astro       NEW  per hud-and-session-card.md
  Nameplate.astro         NEW  JOSUE APARCEDO composition
  HUDCorners.astro        NEW  four corner components
src/pages/
  index.astro             MOD  replace stub hero with real scene
public/scene/
  assets/sphere-lo.png    NEW  noWebGL fallback image
```

## 2. Three.js scene spec

- renderer: `WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })`
- clear color: `--color-void` (#0a0816)
- camera: `PerspectiveCamera(50, aspect, 0.1, 100)`, position `(0, 0, 5.5)`, target `(0,0,0)`
- sphere: `OctahedronGeometry(radius=1.7, subdivision=3)` — 512 sub-triangles
- materials:
  - wireframe pass: `LineBasicMaterial({ color: '--color-electric', linewidth: 1 })`
  - face pass: `MeshStandardMaterial({ color: '--color-void-soft', emissive: '--color-violet-prime', emissiveIntensity: 0.08, roughness: 0.7, metalness: 0.2 })`
- lights:
  - ambient `--color-ink-faint` @ 0.15
  - directional violet from top-left @ 0.5
  - rim light `--color-violet-prime` @ 0.8, behind sphere
- device pixel ratio capped at 2

## 3. SHOT 00 boot timeline (2800ms total)

| t(ms) | event |
|-------|-------|
| 0 | black frame, amber dot 0,0,0 alpha 0 |
| 100–400 | amber dot pulses 3× at 100ms each |
| 400–600 | mono `JAM.` types in center, char every 80ms |
| 600 | hard cut — SessionCard variant A |
| 600–1500 | wireframe sphere assembles: 8 base edges in 200ms, then sub-edges in waves of 40 over 700ms |
| 1500–2100 | faces fill with material, wave from top face downward (120ms per ring) |
| 2100–2400 | nameplate particles fly in from frame edges (character-level split), settle into position |
| 2400–2700 | HUD corners slide in from their edges + fade in |
| 2700–2800 | rim light pulses once (intensity 0.8 → 1.4 → 0.8 over 100ms) |

No fake padding. If asset load takes longer, extend the assembly phase with additional sub-edge waves. If shorter, skip ahead.

## 4. SHOT 01 hero

### Layout (desktop, 1440w)

```
┌────────────────────────────────────────────┐
│ [SESSION 00/REC]              [LAT/LON/EST]│ 24px from corner
│                                            │
│                   ┌─┐                      │
│                   │◆│  ← sphere 640x640    │
│                   └─┘                      │
│                                            │
│            JOSUE  APARCEDO                 │ clamp(4rem,16vw,14rem)
│        computer engineering student        │ 18px serif italic
│        building tools for …                │
│                                            │
│ [▶ NOW PLAYING]        [SCROLL TO ENTER ↓] │ 24px
└────────────────────────────────────────────┘
```

Nameplate: two lines, serif display, center-aligned. Tracking `-0.03em`, line-height 0.92.

### Interactions

- sphere auto-rotates at 3 RPM around y-axis (8° / second)
- pointer parallax: cursor x/y → target rotation offset ±4° on y, ±2.5° on x, spring follow (`--ease-spring`, stiffness 120, damping 18)
- on scroll, rotation damps to 0 as we leave hero
- hover sphere: rim intensity fades 0.8 → 1.2 over 240ms

### Type reveal

On boot finish, nameplate chars are already in place. First load only — route re-entry shows nameplate without animation (cached state).

## 5. HUD (C1 slice)

Implements corners per hud-and-session-card.md §1. Live values:

- session elapsed timer (performance.now()-based, increments 1s)
- EST clock (`new Date()` Eastern)
- lat/lon static strings

## 6. Post-processing

- EffectComposer: RenderPass → ChromaticAberrationPass (intensity driven by `--chroma-base`) → FilmPass (grain + scanlines) → VignettePass
- reduced-motion: all passes except RenderPass bypassed
- reduced-gpu: FilmPass bypassed, grain applied as CSS overlay only

## 7. NoWebGL fallback

- feature-detect on boot
- render `<img src="/scene/assets/sphere-lo.png">` + the nameplate + HUD
- scroll still works; hand off to CSS-only versions of later sections

## 8. Session card (variant A) plumbing

- mounts during SHOT 00 at t=600ms
- unmounts at t=1500ms (before wire assembly completes — card exits BEFORE sphere is visible)

## 9. Build order

1. Three.js scaffold (renderer, camera, sphere, lights) (2d)
2. Postprocess (1d)
3. AssemblyAnimator (2d)
4. HeroAnimator + parallax (1d)
5. Nameplate + HUDCorners Astro components (1d)
6. SessionCard variant A (0.5d)
7. NoWebGL fallback (0.5d)
8. Reduced-motion path (0.5d)
9. Verification + screenshots (1d)

## 10. Verification checklist

- [ ] boot runs under 3s, 4G throttled, mid-tier laptop
- [ ] FPS stays >= 60 at hero rest on integrated GPU
- [ ] pointer parallax feels like the sphere is on a spring, not lerped
- [ ] HUD clock ticks; session elapsed increments
- [ ] route away + back cleans WebGL context (check `renderer.info` or GC)
- [ ] reduced-motion path shows static sphere + static nameplate
- [ ] NoWebGL path shows fallback image + HUD + nav functional
- [ ] no console errors

## 11. Risks

- Asset load variance between dev and prod — boot timeline must be driven by real load events, not `setTimeout`
- Chromatic aberration shader cost — verify on Intel UHD 620 baseline before shipping
- Font load blocking nameplate — use `font-display: swap`, preload the display woff2
