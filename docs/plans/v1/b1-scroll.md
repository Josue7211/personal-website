---
name: B1 — Scroll Infrastructure + Tokens
phase: B1
status: ready
last_revised: 2026-04-19
---

# B1 — Scroll Infrastructure + Tokens

Target: ~5 working days.

## 1. Files created / modified

```
src/scene/
  ScrollCoordinator.ts        NEW  Lenis singleton + ScrollTrigger sync
  SceneController.ts          NEW  per docs/plans/v1/scene-controller.md
  types.ts                    NEW  SceneId, SceneState
src/styles/
  tokens.css                  MOD  align to docs/plans/v1/design-tokens.md
  global.css                  MOD  apply new tokens; remove deprecated hex
src/layouts/
  BaseLayout.astro            MOD  mount ScrollCoordinator + SceneController
src/components/ui/
  PinTest.astro               NEW  pinned verification section
  FilmGrain.astro             MOD  consume --grain-opacity
src/pages/
  dev/scroll.astro            NEW  debug page that uses PinTest
package.json                  MOD  add lenis, gsap, @gsap/scrolltrigger
astro.config.mjs              MOD  resolve vite 7 explicitly if still drifted
```

## 2. ScrollCoordinator

```ts
// src/scene/ScrollCoordinator.ts
import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export class ScrollCoordinator {
  private lenis: Lenis
  constructor() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      smoothTouch: false,
    })
    this.lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => this.lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
  }
  scrollTo(target: number | string) { this.lenis.scrollTo(target) }
  destroy() { this.lenis.destroy() }
}
```

Reduced-motion: if `matchMedia('(prefers-reduced-motion: reduce)').matches`, do not initialize Lenis; rely on native scroll.

## 3. SceneController (detail)

Per [[docs/plans/v1/scene-controller.md]]. Implement the shot boundary calculation:

```ts
private computeState(): SceneState {
  const y = window.scrollY
  const h = window.innerHeight
  if (y < 0.5 * h)                 return { id: 'hero', progress: y / (0.5*h), ... }
  if (y < 1.8 * h)                 return { id: 'work', progress: (y - 0.5*h) / (1.3*h), ... }
  if (y < 4.8 * h)                 return { id: 'dive', progress: (y - 1.8*h) / (3.0*h), ... }
  ...
}
```

(Exact offsets read from DOM section positions, not hard-coded.)

## 4. PinTest

Simple pinned 200vh section that shows current shot + progress live. Used only in `/dev/scroll`, stripped from production build.

## 5. Token alignment

- import `design-tokens.md` values verbatim into `tokens.css` `@theme` block
- sweep `src/` and `public/` for deprecated hex values (`#0a0a0a`, `#a855f7`, `#e4e4e7`, `#a1a1aa`)
- any hex inside `public/scene/*.js` that contradicts tokens — replace with new value
- `src/styles/index-scene.css` to consume CSS variables not literals

## 6. Vite drift

Root cause already documented in `docs/backlog/v1/2026-04-18-vite-8-drift-with-astro-6.md`. B1 contains or resolves it:

- attempt: pin `vite@^7.0.0` in package.json + clean install
- if Astro 6 still resolves 8: add `overrides` block in package.json
- verify by `npm ls vite` showing single v7 entry

## 7. Build order inside B1

1. tokens.css sweep (1d)
2. ScrollCoordinator (1d)
3. SceneController (1.5d)
4. PinTest + /dev/scroll (0.5d)
5. Vite drift (0.5d)
6. Verification + screenshots (0.5d)

## 8. Verification checklist

- [ ] `npm run dev` shows `/dev/scroll` with pinned section; shot state updates
- [ ] `document.body.dataset.scene` tracks SceneController output
- [ ] reduced-motion: scroll still works; pin still works; no transition jank
- [ ] tokens audit: `grep -rE '#0a0a0a|#a855f7' src public` returns 0
- [ ] `npm ls vite` shows single v7
- [ ] no console errors on `/` or `/dev/scroll`

## 9. Out of scope

- Actual shot visuals (hero 3D, dive beats) — those are C1, D1
- Audio engine — G1
- Session-card component authored but not plugged into scenes — C1

## 10. Risks

- Lenis + iOS Safari: smoothTouch off avoids momentum issues; verify
- ScrollTrigger pin + Lenis: known gotcha — always call `ScrollTrigger.update` from Lenis scroll callback (handled above)
- Astro islands vs inline `<script>`: keep ScrollCoordinator SSR-safe (`typeof window !== 'undefined'` guards)
