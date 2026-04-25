# Guided Rail Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a cinematic guided-rail scroll system for the homepage with strong work-stage capture, lighter about/contact guidance, and reliable breakout on strong user input.

**Architecture:** Replace the current homepage boot script with a bundled module entry that can use `lenis` cleanly, then layer a dedicated guided-rail controller on top of the existing 3D scene state. Keep `public/scene/scene3d.js` as the render engine for now, but move scroll behavior, section capture, and page-state orchestration into typed `src/` modules plus a small pure-core test suite.

**Tech Stack:** Astro, TypeScript, Lenis, existing Three.js scene runtime, Node built-in test runner

---

## File Structure

### Create

- `src/scripts/index-scene.ts`
  Homepage runtime entry. Replaces `public/scene/app.js` as the boot file and owns Lenis, guided rail, reveals, cursor, clocks, and integration with `window.initScene3D`.
- `src/scene/guided-rail/core.ts`
  Pure logic only: section math, state transitions, breakout detection, and target selection. No DOM access.
- `src/scene/guided-rail/controller.ts`
  Runtime controller that reads DOM rects, feeds the core, drives Lenis scroll targets, and writes body classes / CSS vars.
- `src/scene/guided-rail/sections.ts`
  Static section config for `hero`, `work`, `about`, and `contact`.
- `src/types/scene3d.d.ts`
  Global window typings for `window.initScene3D` and the scene API already exposed by `public/scene/scene3d.js`.
- `tests/scroll-guided-rail/core.test.mjs`
  Unit tests for proximity windows, capture transitions, hold timing, and breakout logic.

### Modify

- `src/pages/index.astro`
  Stop loading `public/scene/app.js`; load the new bundled module entry instead while keeping `public/scene/scene3d.js`.
- `src/styles/index-scene.css`
  Add guided-rail state hooks (`body.is-capturing-work`, `body.is-holding-work`, `body.is-guiding-about`, `body.is-guiding-contact`) and tune the visual easing around section capture.
- `package.json`
  Add a focused test script for the new pure scroll core.

### Leave Alone

- `public/scene/scene3d.js`
  Keep as-is initially except for compatibility fixes if the new controller reveals a bug. The guided rail should wrap it, not rewrite it in the same pass.

---

### Task 1: Move Homepage Boot Into A Bundled Module

**Files:**
- Create: `src/scripts/index-scene.ts`
- Create: `src/types/scene3d.d.ts`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Add the global typings for the existing scene runtime**

```ts
// src/types/scene3d.d.ts
export {}

type Scene3DInstance = {
  setMode(mode: 'hero' | 'work' | 'past'): void
  setScrollProg(progress: number): void
  setAboutProg(progress: number): void
  getFaceScreenBasis(index: number): {
    visible: boolean
    facing: number
    ux: number
    uy: number
    vx: number
    vy: number
    ox: number
    oy: number
  } | null
  getSubFacetBasis(
    face: number,
    a: number,
    b: number,
    c: number
  ): {
    visible: boolean
    facing: number
    ox: number
    oy: number
  } | null
}

declare global {
  interface Window {
    initScene3D?: (
      canvas: HTMLCanvasElement,
      opts: {
        projects: Array<Record<string, unknown>>
        onFaceClick: (project: Record<string, unknown>, index: number) => void
      }
    ) => Scene3DInstance
    __scene3d?: Scene3DInstance
  }
}
```

- [ ] **Step 2: Replace the old public boot file with a bundled module entrypoint**

```astro
<!-- src/pages/index.astro -->
  <script is:inline src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>
  <script is:inline src="/scene/scene3d.js"></script>
  <script type="module">
    import initIndexScene from '../scripts/index-scene.ts'
    initIndexScene()
  </script>
```

Expected change:
- remove `<script is:inline src="/scene/app.js"></script>`
- keep the current `scene3d.js` load so the module can call `window.initScene3D`

- [ ] **Step 3: Create the new module shell by transplanting the current homepage runtime**

```ts
// src/scripts/index-scene.ts
import Lenis from 'lenis'
import { createGuidedRailController } from '../scene/guided-rail/controller'

export default function initIndexScene() {
  if (!document.body.classList.contains('index-scene')) return

  const hero = document.getElementById('top')
  const work = document.getElementById('work')
  const about = document.getElementById('about')
  const contact = document.getElementById('contact')
  const sceneCanvas = document.getElementById('scene-canvas') as HTMLCanvasElement | null

  if (!hero || !work || !about || !contact || !sceneCanvas || !window.initScene3D) {
    return
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lenis = prefersReducedMotion
    ? null
    : new Lenis({
        duration: 1.05,
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 0.95,
        touchMultiplier: 1,
      })

  const scene3D = window.initScene3D(sceneCanvas, {
    projects: [],
    onFaceClick: () => {},
  })

  window.__scene3d = scene3D

  createGuidedRailController({
    lenis,
    hero,
    work,
    about,
    contact,
    scene3D,
  }).mount()
}
```

Note for implementation:
- the real file should carry over the existing project data, cursor, intro, reveals, drawer, and label logic from `public/scene/app.js`
- do not re-architect all features in this task; just move them into module form

- [ ] **Step 4: Run the homepage build after the script migration**

Run:

```bash
npm run build
```

Expected:

```text
[build] Complete!
```

- [ ] **Step 5: Commit the script-entry migration**

```bash
git add src/pages/index.astro src/scripts/index-scene.ts src/types/scene3d.d.ts
git commit -m "refactor: move homepage runtime to bundled module"
```

---

### Task 2: Build The Pure Guided Rail Core And Test It

**Files:**
- Create: `src/scene/guided-rail/core.ts`
- Create: `src/scene/guided-rail/sections.ts`
- Create: `tests/scroll-guided-rail/core.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Add a focused test script**

```json
// package.json
{
  "scripts": {
    "test:scroll": "node --test tests/scroll-guided-rail/core.test.mjs"
  }
}
```

- [ ] **Step 2: Define the section configuration in one place**

```ts
// src/scene/guided-rail/sections.ts
export type GuidedRailSectionId = 'hero' | 'work' | 'about' | 'contact'

export type GuidedRailSectionConfig = {
  id: GuidedRailSectionId
  strength: number
  captureRadiusPx: number
  holdMs: number
  breakoutDelta: number
}

export const SECTION_CONFIG: Record<GuidedRailSectionId, GuidedRailSectionConfig> = {
  hero: { id: 'hero', strength: 0.15, captureRadiusPx: 0, holdMs: 0, breakoutDelta: 0 },
  work: { id: 'work', strength: 1, captureRadiusPx: 260, holdMs: 420, breakoutDelta: 30 },
  about: { id: 'about', strength: 0.35, captureRadiusPx: 140, holdMs: 90, breakoutDelta: 22 },
  contact: { id: 'contact', strength: 0.3, captureRadiusPx: 140, holdMs: 90, breakoutDelta: 22 },
}
```

- [ ] **Step 3: Implement the pure state helpers**

```ts
// src/scene/guided-rail/core.ts
import type { GuidedRailSectionConfig, GuidedRailSectionId } from './sections'

export type GuidedRailState = 'free' | 'attract' | 'capture' | 'hold' | 'release'

export type SectionSnapshot = {
  id: GuidedRailSectionId
  distanceToTarget: number
  direction: -1 | 1
}

export function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

export function computeCaptureProgress(distanceToTarget: number, radius: number) {
  if (radius <= 0) return 0
  return clamp01(1 - Math.abs(distanceToTarget) / radius)
}

export function shouldBreakOut(deltaY: number, breakoutDelta: number) {
  return Math.abs(deltaY) >= breakoutDelta
}

export function chooseActiveSection(
  snapshots: SectionSnapshot[],
  config: Record<GuidedRailSectionId, GuidedRailSectionConfig>
) {
  return snapshots
    .filter((snapshot) => snapshot.id !== 'hero')
    .map((snapshot) => ({
      snapshot,
      weight:
        computeCaptureProgress(snapshot.distanceToTarget, config[snapshot.id].captureRadiusPx) *
        config[snapshot.id].strength,
    }))
    .sort((a, b) => b.weight - a.weight)[0] ?? null
}

export function nextGuidedRailState(args: {
  current: GuidedRailState
  captureProgress: number
  deltaY: number
  holdElapsedMs: number
  holdMs: number
  breakoutDelta: number
}): GuidedRailState {
  if (shouldBreakOut(args.deltaY, args.breakoutDelta)) return 'release'
  if (args.captureProgress < 0.08) return 'free'
  if (args.captureProgress < 0.45) return 'attract'
  if (args.current === 'hold' && args.holdElapsedMs < args.holdMs) return 'hold'
  if (args.captureProgress >= 0.92 && args.holdElapsedMs === 0) return 'capture'
  if (args.current === 'capture' && args.captureProgress >= 0.92) return 'hold'
  return 'release'
}
```

- [ ] **Step 4: Write the failing tests for section choice and breakout**

```js
// tests/scroll-guided-rail/core.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'

import {
  computeCaptureProgress,
  chooseActiveSection,
  nextGuidedRailState,
  shouldBreakOut,
} from '../../src/scene/guided-rail/core.ts'
import { SECTION_CONFIG } from '../../src/scene/guided-rail/sections.ts'

test('chooseActiveSection prefers work when work and about are both nearby', () => {
  const chosen = chooseActiveSection(
    [
      { id: 'work', distanceToTarget: 60, direction: 1 },
      { id: 'about', distanceToTarget: 40, direction: 1 },
    ],
    SECTION_CONFIG
  )

  assert.equal(chosen.snapshot.id, 'work')
})

test('shouldBreakOut returns true for strong deltas', () => {
  assert.equal(shouldBreakOut(42, 30), true)
  assert.equal(shouldBreakOut(18, 30), false)
})

test('nextGuidedRailState reaches hold after a strong capture', () => {
  const state = nextGuidedRailState({
    current: 'capture',
    captureProgress: 0.98,
    deltaY: 4,
    holdElapsedMs: 100,
    holdMs: 420,
    breakoutDelta: 30,
  })

  assert.equal(state, 'hold')
})

test('computeCaptureProgress clamps values into the 0..1 range', () => {
  assert.equal(computeCaptureProgress(0, 120), 1)
  assert.equal(computeCaptureProgress(120, 120), 0)
  assert.equal(computeCaptureProgress(300, 120), 0)
})
```

- [ ] **Step 5: Run tests to verify the core works**

Run:

```bash
npm run test:scroll
```

Expected:

```text
# tests 4
# pass 4
```

- [ ] **Step 6: Commit the pure core**

```bash
git add package.json src/scene/guided-rail/sections.ts src/scene/guided-rail/core.ts tests/scroll-guided-rail/core.test.mjs
git commit -m "feat: add guided rail scroll core"
```

---

### Task 3: Integrate The Runtime Controller With Lenis And Section Targets

**Files:**
- Create: `src/scene/guided-rail/controller.ts`
- Modify: `src/scripts/index-scene.ts`

- [ ] **Step 1: Create the controller shell**

```ts
// src/scene/guided-rail/controller.ts
import { SECTION_CONFIG, type GuidedRailSectionId } from './sections'
import { chooseActiveSection, computeCaptureProgress, nextGuidedRailState } from './core'

type ControllerArgs = {
  lenis: import('lenis').default | null
  hero: HTMLElement
  work: HTMLElement
  about: HTMLElement
  contact: HTMLElement
  scene3D: {
    setMode(mode: 'hero' | 'work' | 'past'): void
    setScrollProg(progress: number): void
    setAboutProg(progress: number): void
  }
}

export function createGuidedRailController(args: ControllerArgs) {
  let state = 'free'
  let holdStartedAt = 0
  let lastWheelDelta = 0

  const sectionEls: Record<GuidedRailSectionId, HTMLElement> = {
    hero: args.hero,
    work: args.work,
    about: args.about,
    contact: args.contact,
  }

  function getTargetTop(id: GuidedRailSectionId) {
    const el = sectionEls[id]
    const rect = el.getBoundingClientRect()
    const scrollTop = window.scrollY + rect.top

    if (id === 'work') return scrollTop - Math.max(0, (window.innerHeight - rect.height) * 0.18)
    if (id === 'about') return scrollTop - 44
    if (id === 'contact') return scrollTop - 36
    return scrollTop
  }

  function writeBodyState(activeSection: GuidedRailSectionId | null, nextState: string) {
    document.body.classList.toggle('is-capturing-work', activeSection === 'work' && (nextState === 'capture' || nextState === 'hold'))
    document.body.classList.toggle('is-holding-work', activeSection === 'work' && nextState === 'hold')
    document.body.classList.toggle('is-guiding-about', activeSection === 'about' && nextState !== 'free')
    document.body.classList.toggle('is-guiding-contact', activeSection === 'contact' && nextState !== 'free')
    if (activeSection) document.body.dataset.guidedSection = activeSection
    else delete document.body.dataset.guidedSection
    document.body.dataset.guidedState = nextState
  }

  function mount() {
    window.addEventListener(
      'wheel',
      (event) => {
        lastWheelDelta = event.deltaY
      },
      { passive: true }
    )

    function frame(time: number) {
      const snapshots = (Object.keys(sectionEls) as GuidedRailSectionId[]).map((id) => ({
        id,
        distanceToTarget: getTargetTop(id) - window.scrollY,
        direction: lastWheelDelta >= 0 ? 1 : -1,
      }))

      const chosen = chooseActiveSection(snapshots, SECTION_CONFIG)

      if (chosen) {
        const config = SECTION_CONFIG[chosen.snapshot.id]
        const captureProgress = computeCaptureProgress(chosen.snapshot.distanceToTarget, config.captureRadiusPx)
        const holdElapsedMs = holdStartedAt ? time - holdStartedAt : 0
        const nextState = nextGuidedRailState({
          current: state,
          captureProgress,
          deltaY: lastWheelDelta,
          holdElapsedMs,
          holdMs: config.holdMs,
          breakoutDelta: config.breakoutDelta,
        })

        if (nextState === 'hold' && state !== 'hold') holdStartedAt = time
        if (nextState !== 'hold') holdStartedAt = 0

        if ((nextState === 'capture' || nextState === 'hold') && args.lenis) {
          args.lenis.scrollTo(getTargetTop(chosen.snapshot.id), {
            immediate: false,
            duration: chosen.snapshot.id === 'work' ? 1.05 : 0.72,
            lock: false,
          })
        }

        state = nextState
        writeBodyState(chosen.snapshot.id, nextState)
      } else {
        state = 'free'
        holdStartedAt = 0
        writeBodyState(null, 'free')
      }

      requestAnimationFrame(frame)
    }

    requestAnimationFrame(frame)
  }

  return { mount }
}
```

- [ ] **Step 2: Wire Lenis RAF into the homepage entry**

```ts
// src/scripts/index-scene.ts
function mountLenis(lenis: Lenis | null) {
  if (!lenis) return

  const raf = (time: number) => {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)
}
```

And call it:

```ts
mountLenis(lenis)
createGuidedRailController({
  lenis,
  hero,
  work,
  about,
  contact,
  scene3D,
}).mount()
```

- [ ] **Step 3: Keep the existing scene progress updates, but source them from Lenis when available**

```ts
// src/scripts/index-scene.ts
function getScrollY(lenis: Lenis | null) {
  return lenis ? lenis.animatedScroll : window.scrollY
}
```

Use `getScrollY(lenis)` anywhere the old boot file used `window.scrollY` for:

- `heroExit`
- `work-in`
- `about-zoom`
- `contact-in`
- `scene3D.setScrollProg(...)`

- [ ] **Step 4: Run the scroll core tests and full site build**

Run:

```bash
npm run test:scroll
npm run build
```

Expected:

```text
# pass 4
[build] Complete!
```

- [ ] **Step 5: Commit runtime integration**

```bash
git add src/scripts/index-scene.ts src/scene/guided-rail/controller.ts
git commit -m "feat: add guided rail runtime controller"
```

---

### Task 4: Add Guided-Rail Visual States And Section Tuning

**Files:**
- Modify: `src/styles/index-scene.css`
- Modify: `src/scripts/index-scene.ts`

- [ ] **Step 1: Add body-state hooks for the guided rail**

```css
/* src/styles/index-scene.css */
body[data-guided-state="attract"] .scene-canvas {
  transition: transform 0.55s cubic-bezier(.22, 1, .36, 1), opacity 0.45s ease;
}

body.is-capturing-work .work-head,
body.is-holding-work .work-head {
  opacity: 1;
  transform: translate(0, 0);
}

body.is-capturing-work .face-labels,
body.is-holding-work .face-labels {
  opacity: 1;
}

body.is-guiding-about .section#about .section-head,
body.is-guiding-about .section#about .about {
  transition: transform 0.6s cubic-bezier(.22, 1, .36, 1), opacity 0.45s ease;
}

body.is-guiding-contact .contact-title,
body.is-guiding-contact .contact-email,
body.is-guiding-contact .contact-socials {
  transition: transform 0.7s cubic-bezier(.22, 1, .36, 1), opacity 0.45s ease;
}
```

- [ ] **Step 2: Keep the delayed top-chrome return compatible with guided contact state**

```css
/* src/styles/index-scene.css */
body.is-guiding-contact:not(.in-contact) .nav-brand,
body.is-guiding-contact:not(.in-contact) .nav-now-playing {
  opacity: 0;
  pointer-events: none;
}

body.in-contact .nav-brand,
body.in-contact .nav-now-playing {
  opacity: 0.86;
  pointer-events: auto;
}
```

- [ ] **Step 3: Add reduced-motion fallback in the module entry**

```ts
// src/scripts/index-scene.ts
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (prefersReducedMotion) {
  document.body.dataset.guidedState = 'free'
  delete document.body.dataset.guidedSection
}
```

Runtime rule:
- if reduced motion is on, do not create Lenis
- do not mount the guided rail controller
- continue running the existing scene and section logic from native scroll only

- [ ] **Step 4: Run the build after CSS state tuning**

Run:

```bash
npm run build
```

Expected:

```text
[build] Complete!
```

- [ ] **Step 5: Commit the visual-state pass**

```bash
git add src/styles/index-scene.css src/scripts/index-scene.ts
git commit -m "style: tune guided rail section states"
```

---

### Task 5: Verify Cinematic Feel, Breakout, And Regression Safety

**Files:**
- Modify if needed: `src/scene/guided-rail/sections.ts`
- Modify if needed: `src/scene/guided-rail/controller.ts`
- Modify if needed: `src/styles/index-scene.css`

- [ ] **Step 1: Verify the work-stage capture from both directions**

Run:

```bash
npm run dev
```

Manual checks:

- scroll down slowly into `Selected Work`
- scroll back up slowly into `Selected Work`
- confirm both directions magnet into the same orb composition
- confirm the hold lasts for one clean beat, not a trap

Expected:

```text
Work stage captures from both directions and releases on continued input.
```

- [ ] **Step 2: Verify breakout works with strong wheel / trackpad intent**

Manual checks:

- flick down hard while work is capturing
- flick up hard while work is holding
- repeat on trackpad momentum if available

Expected:

```text
Strong intent cancels capture immediately and no section feels trapped.
```

- [ ] **Step 3: Verify about/contact remain lighter than work**

Manual checks:

- scroll into `About`
- scroll into `Contact`
- confirm they align cleanly but do not pin aggressively
- confirm top chrome still returns late enough on contact

Expected:

```text
About and contact feel guided, not locked.
```

- [ ] **Step 4: Verify regressions on orb interaction and page polish**

Manual checks:

- drag orb while held in work
- double-click a face to open drawer
- verify labels still track correctly
- verify work→about transition still feels seamless
- verify 1080p and 1440p desktop behavior

Expected:

```text
3D interaction remains responsive and prior transition fixes are preserved.
```

- [ ] **Step 5: Tune config values only after the above checks**

Primary tuning surface:

```ts
// src/scene/guided-rail/sections.ts
work: { id: 'work', strength: 1, captureRadiusPx: 260, holdMs: 420, breakoutDelta: 30 },
about: { id: 'about', strength: 0.35, captureRadiusPx: 140, holdMs: 90, breakoutDelta: 22 },
contact: { id: 'contact', strength: 0.3, captureRadiusPx: 140, holdMs: 90, breakoutDelta: 22 },
```

Tune only these first:

- `captureRadiusPx`
- `holdMs`
- `breakoutDelta`
- `strength`

Do not add extra states or one-off section hacks unless the tuning surface fails.

- [ ] **Step 6: Final verification**

Run:

```bash
npm run test:scroll
npm run build
```

Expected:

```text
# pass 4
[build] Complete!
```

- [ ] **Step 7: Commit final tuning**

```bash
git add src/scene/guided-rail/sections.ts src/scene/guided-rail/controller.ts src/styles/index-scene.css src/scripts/index-scene.ts
git commit -m "feat: ship cinematic guided rail scroll"
```

---

## Spec Coverage Check

- page-wide guided rail: covered by Tasks 2 and 3
- strongest work capture: covered by Tasks 2, 3, and 5
- lighter about/contact guidance: covered by Tasks 2, 4, and 5
- breakout behavior: covered by Tasks 2, 3, and 5
- reduced-motion fallback: covered by Task 4
- compatibility with current scene transitions: covered by Tasks 3, 4, and 5

## Placeholder Scan

No `TBD`, `TODO`, or deferred “handle later” steps remain. All new files, commands, and tuning surfaces are named explicitly.

## Type Consistency Check

- section ids are consistently `hero | work | about | contact`
- runtime states are consistently `free | attract | capture | hold | release`
- body state hooks use `is-capturing-work`, `is-holding-work`, `is-guiding-about`, and `is-guiding-contact`
