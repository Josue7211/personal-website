---
name: Scene Controller — scroll → shot state machine
phase: cross-cutting (ships in B1, consumed everywhere)
status: ready
last_revised: 2026-04-19
---

# Scene Controller

## 1. Responsibility

One module owns which shot is active, how far through the shot we are, and broadcasts that to subscribers (Three.js scene, audio engine, HUD).

## 2. Shot IDs

```ts
export type SceneId =
  | 'boot'      // page load, 2.8s
  | 'hero'      // SHOT 01, scrolled = 0 after boot
  | 'work'      // SHOT 02, after hero
  | 'dive'      // SHOT 03, 300vh sticky
  | 'about'     // SHOT 03 beat 5 landing → idle
  | 'contact'   // SHOT 04
  | 'end'       // END CARD
```

## 3. State

```ts
interface SceneState {
  id: SceneId
  progress: number        // 0..1 within current scene
  enteredAt: number       // performance.now() when id last changed
  reducedMotion: boolean
  reducedGpu: boolean     // true on low-tier GPUs, disables shatter etc.
}
```

## 4. Scroll → scene mapping

Sections are laid out in DOM order with known heights. ScrollTrigger pins the dive section for 300vh.

| scene | vertical span |
|-------|---------------|
| boot | 0 scroll, time-bound only |
| hero | `#top` (100vh) |
| work | `#work` base zone (~130vh; facet unfold is orthogonal) |
| dive | `#about-track` sticky 300vh |
| about | end of dive track → `#about` stable (100vh min) |
| contact | `#contact` (100vh) |
| end | `#end` (60vh) |

Mobile: dive span shortens to 150vh; other sections per breakpoint.

## 5. API

```ts
class SceneController {
  readonly state: Readonly<SceneState>
  onChange(cb: (s: SceneState) => void): () => void   // returns unsubscribe
  onProgress(cb: (s: SceneState) => void): () => void // throttled to rAF
  forceScene(id: SceneId): void                       // debug only, behind query flag
}
```

Broadcast is debounced to requestAnimationFrame. Subscribers: Three.js render loop, AudioEngine, HUD (session label + elapsed), command palette (hides during dive).

## 6. Reduced motion + reduced GPU

- `prefers-reduced-motion: reduce` → `reducedMotion: true` → dive collapses to crossfade; shatter disabled; grain static
- feature-detect WebGL caps at boot (max texture size, extensions). Low-tier → `reducedGpu: true` → shard count halved; no chromatic aberration on post-process; sphere subdivision downgraded from 3 → 2

## 7. Deterministic re-entry

Scrolling up then down must land the user at the same visual state. Beats are purely a function of scroll offset, not of time. No hysteresis.

## 8. Implementation

File: `src/scene/SceneController.ts` (bundled via Astro). `public/scene/app.js` consumes via `window.SceneController` shim emitted by the layout.

```ts
// BaseLayout.astro — inline
import { SceneController } from '../scene/SceneController'
window.SceneController = new SceneController()
```

## 9. Testing

- unit: progression math, boundary transitions
- integration: agent-browser scroll → assert `document.body.dataset.scene === 'dive'` at known offsets
- visual: per-beat screenshots stored under `docs/visual-baselines/`

## 10. Debug hooks

- `?scene=dive&progress=0.55` forces a scene
- `?debug=hud` shows shot ID + progress in a dev overlay
- `?fps=on` mounts a stats.js panel
