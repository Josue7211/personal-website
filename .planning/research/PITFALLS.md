# Pitfalls Research

**Domain:** Immersive personal website — Three.js + GSAP + Lenis + Astro
**Researched:** 2026-03-30
**Confidence:** HIGH (verified against official docs, active community issues, and Codrops production examples)

---

## Critical Pitfalls

### Pitfall 1: Three.js GPU Memory Never Freed on Navigation

**What goes wrong:**
WebGL resources (geometries, materials, textures, the renderer itself) accumulate in GPU memory across every page transition or component remount. The heap grows silently. After several navigations, mobile devices crash, desktop tabs go blank, and `renderer.info.memory` shows hundreds of leaked objects. Removing a mesh from the scene does NOT free GPU memory — `scene.clear()` is a trap.

**Why it happens:**
Developers assume JavaScript garbage collection handles GPU memory. It does not. Three.js GPU allocations are explicit and manual. Astro's island hydration creates new component instances on remount without destroying the old WebGL state if cleanup is missing. The `webglcontextlost` browser warning ("Too many active WebGL contexts. Oldest context will be lost") is the first visible sign — by then the leak is severe.

**How to avoid:**
- On every unmount / page-leave, call `renderer.dispose()`, then traverse the scene and call `geometry.dispose()`, `material.dispose()`, `texture.dispose()` on every object
- Cancel the `requestAnimationFrame` loop before disposal
- For ImageBitmap textures (loaded via GLTFLoader): also call `texture.source.data.close()`
- Monitor `renderer.info.memory.textures` and `renderer.info.memory.geometries` during dev — these must return to zero after teardown
- Create the renderer once at the module level, not inside component render

**Warning signs:**
- Chrome Memory tab shows growing JS heap or GPU memory after navigating back and forth
- Console warning: "Too many active WebGL contexts. Oldest context will be lost"
- `renderer.info.memory.textures` count grows monotonically

**Phase to address:** Hero / Three.js foundation phase — establish the disposal pattern before adding any other 3D content

---

### Pitfall 2: Lenis + ScrollTrigger Pinning Breaks

**What goes wrong:**
Adding Lenis smooth scroll breaks ScrollTrigger's `pin: true` behavior. Pinned elements either don't pin at all, pin at the wrong scroll position, or leave a blank spacer gap after the pinned section. The horizontal scroll gallery (interests section with vertical-trigger + horizontal movement) is especially vulnerable. Resize events shift all trigger positions.

**Why it happens:**
Lenis intercepts native scroll events and translates them into its own eased scroll. ScrollTrigger calculates pin positions based on the native scroll position, not Lenis's eased position. The two systems disagree on "where are we in the scroll" unless explicitly synchronized. The `scrollerProxy` API (an older workaround) is no longer the recommended path and causes its own resize bugs.

**How to avoid:**
Use the correct modern sync pattern — nothing else:
```javascript
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```
- Do NOT use `ScrollTrigger.scrollerProxy()` — superseded by the ticker sync above
- Do NOT use `ScrollTrigger.normalizeScroll()` alongside Lenis — they fight
- Call `ScrollTrigger.refresh()` after all page content has painted (not in `DOMContentLoaded` — too early)
- For the horizontal scroll section: use `data-lenis-prevent` on the horizontal container to hand off scroll ownership to Lenis snap or native handling

**Warning signs:**
- Pinned element scrolls past its trigger point instead of sticking
- Blank whitespace appears after a pinned section
- Horizontal scroll section feels jerky on trackpad/touch but smooth on mouse wheel

**Phase to address:** Scroll architecture phase — set up Lenis + ScrollTrigger integration before building any individual scroll-driven sections

---

### Pitfall 3: GSAP / SplitText Instances Surviving Page Transitions

**What goes wrong:**
When Astro view transitions swap pages, GSAP ScrollTrigger instances, SplitText DOM wrappers, and active tweens from the previous page persist. On the second navigation to a page, all animations fire twice, trigger positions are doubled, and text appears garbled (SplitText wraps spans around already-wrapped spans from the previous visit).

**Why it happens:**
Astro's view transition system swaps DOM content but does not fire a full page unload. GSAP plugins attach to the document and do not auto-clean themselves when their target DOM nodes are swapped out. SplitText physically rewrites DOM content with `<div>` wrappers — if not reverted, the next split doubles the nesting.

**How to avoid:**
- Listen for `astro:before-swap` (or Barba.js `leave` hook) to kill all ScrollTrigger instances: `ScrollTrigger.getAll().forEach(t => t.kill())`
- Revert all SplitText instances before navigation: call `.revert()` on every SplitText ref
- Re-initialize animations on `astro:after-swap` (or Barba's `enter` hook), not on module load
- Use GSAP Context API (`gsap.context()`) to scope all animations — then call `ctx.revert()` on page leave to kill everything at once
- Store all animation references at module scope so the cleanup function can reach them

**Warning signs:**
- Animations play twice on second visit to a page
- Text in animated headings shows doubled `<span>` nesting in DevTools
- ScrollTrigger markers (when enabled) appear in wrong positions after back-navigation

**Phase to address:** Page transitions phase — this must be part of the transition system design, not retrofitted later

---

### Pitfall 4: Particle Count Untethered from Device Capability

**What goes wrong:**
A particle hero that performs at 60fps on a desktop GPU drops to 15fps on a mid-range Android phone or an M1 MacBook in Safari power-saving mode. The site feels broken on the most common recruiter device (a laptop on battery).

**Why it happens:**
Three.js particle counts are set at development time on a powerful desktop. 50,000 CPU-driven particles is the rough ceiling before frame budget collapses on typical hardware. Mobile GPUs process fewer shader instructions per clock and are often in a power-throttled state. Safari on iOS caps Lenis (and thus all scroll-driven animation) to 60fps baseline and 30fps in low power mode.

**How to avoid:**
- Default particle count: 15,000-25,000 for the hero (visually equivalent, safe everywhere)
- Detect device tier at runtime: check `navigator.hardwareConcurrency`, GPU tier via `gl.getParameter(gl.RENDERER)`, or use the `detect-gpu` library
- Three quality tiers: mobile (5k particles, no post-processing), mid (15k, no shadows), high (25k+, full effects)
- Use `mediump` float precision in shaders on mobile — mobile GPUs run it roughly 2x faster than `highp`
- Suspend the render loop when the tab is hidden: `document.addEventListener('visibilitychange', ...)`
- On mobile, replace the full Three.js hero with a CSS/GSAP-only fallback that delivers the same emotional impact without WebGL

**Warning signs:**
- Chrome DevTools Performance panel shows `requestAnimationFrame` callbacks taking >16ms
- GPU draw calls exceed 100/frame
- Users on mobile see a static canvas or immediate freeze

**Phase to address:** Hero phase — build mobile quality tiers into the initial implementation, not as a follow-up pass

---

### Pitfall 5: Three.js Bundle Shipped to Every Page

**What goes wrong:**
Three.js + its dependencies is ~600KB minified. If the Astro island containing the hero is not properly lazy-loaded, this entire bundle blocks initial parse on every page including the docs section, destroying performance scores and first contentful paint.

**Why it happens:**
Astro's island architecture is opt-in. Using `client:load` eagerly loads the component and its full JS bundle immediately. Developers default to `client:load` because it's the first directive they learn. Three.js also cannot be tree-shaken effectively if the full namespace is imported (`import * as THREE`).

**How to avoid:**
- Use `client:visible` for the hero island — it only hydrates when the canvas enters the viewport
- Import only the Three.js classes actually used: `import { Scene, PerspectiveCamera, WebGLRenderer, ... } from 'three'`
- Never `import * as THREE from 'three'`
- Use `rollup-plugin-visualizer` during development to audit bundle composition
- Docs section pages should have zero Three.js in their JS budget — confirm with bundle analysis
- GSAP tree-shakes well when imported by plugin: `import { gsap } from 'gsap'` + `import { ScrollTrigger } from 'gsap/ScrollTrigger'`

**Warning signs:**
- Lighthouse Performance score below 80 on initial load
- "Remove unused JavaScript" audit flags Three.js on non-hero pages
- Bundle visualizer shows Three.js in a docs page chunk

**Phase to address:** Build configuration phase (project setup) — establish import discipline from day one

---

### Pitfall 6: Missing `prefers-reduced-motion` Causes Real Harm

**What goes wrong:**
Users with vestibular disorders, migraines, or epilepsy can be physically harmed by parallax effects, particle motion, clip-path transitions, and scroll-linked animations. This is not a nice-to-have — WCAG 2.1 Success Criterion 2.3.3 explicitly covers animation from interactions. A site that ignores this fails accessibility requirements and signals carelessness to technical reviewers who value a11y.

**Why it happens:**
Immersive sites are built with visual impact as the primary goal. `prefers-reduced-motion` is easy to forget when every animation feels essential to the design.

**How to avoid:**
- Check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` before initializing any GSAP timeline or Three.js animation
- For GSAP: wrap all motion in a check, or use `gsap.matchMedia()` which handles this declaratively
- Reduced motion alternative is not "no animation" — it's instant state changes: opacity fades instead of slides, no parallax, no continuous looping particle motion
- The Three.js hero on reduced-motion should render a static particle arrangement, not an animated one
- CSS animations and transitions need `@media (prefers-reduced-motion: reduce)` counterparts

**Warning signs:**
- No `matchMedia('prefers-reduced-motion')` calls anywhere in the codebase
- Lighthouse Accessibility audit flags motion
- Users report dizziness in feedback

**Phase to address:** Hero phase AND scroll animation phase — add reduced-motion checks as each animation system is built

---

### Pitfall 7: Astro View Transitions + Three.js WebGL Context Collision

**What goes wrong:**
Astro's built-in View Transitions API and a Three.js canvas on the same page create a race condition. The browser screenshot taken for the cross-fade transition captures the canvas as blank (WebGL canvases are not captured by the View Transitions screenshot mechanism in most browsers). The transition flickers black where the canvas was. Alternatively, the canvas persists as a ghost over the new page.

**Why it happens:**
The View Transitions API uses CSS `view-transition-name` and browser-level screenshot compositing. WebGL canvas readback is disabled by default in most browsers for security reasons (`preserveDrawingBuffer: false`). The canvas is invisible to the transition system.

**How to avoid:**
- Use Barba.js for page transitions instead of Astro View Transitions when Three.js is involved — Barba gives explicit control over enter/leave hooks so you can fade out the canvas manually before transition
- If sticking with Astro View Transitions: set `transition:persist` on the canvas element to keep it alive across transitions, then cross-fade it in JavaScript after the transition completes
- Set `preserveDrawingBuffer: true` only if you absolutely need canvas readback — it has a significant performance cost
- Test every page transition on Safari (most restrictive canvas behavior)

**Warning signs:**
- Black flash during page transitions where the canvas was
- Canvas renders on top of the incoming page content
- Safari-specific: canvas disappears entirely during transition

**Phase to address:** Page transitions phase — design the transition system with Three.js canvas in mind from the start

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| `import * as THREE from 'three'` | Faster to write | 600KB+ in every chunk that imports it | Never — always use named imports |
| `client:load` for hero island | Simpler setup | Three.js blocks every page's initial parse | Never — use `client:visible` |
| Single particle count for all devices | Simpler code | Site is broken on mobile and throttled laptops | Never for the hero |
| Skip `ScrollTrigger.kill()` on nav | Less boilerplate | Double-firing animations, memory leak | Never |
| No `prefers-reduced-motion` check | Faster to ship | A11y failure, potential user harm | Never |
| Inline `renderer.domElement.style` for sizing | Works in dev | Canvas size fights with CSS on resize/orientation change | MVP only — replace before launch |
| Skip `renderer.info` monitoring | No instrumentation overhead | Silent GPU memory leak goes undetected in production | Never during development phase |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Lenis + ScrollTrigger | Using `scrollerProxy()` (outdated) | Use the ticker sync pattern: `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add(t => lenis.raf(t * 1000))` + `lagSmoothing(0)` |
| Lenis + CSS scroll-snap | Using native CSS `scroll-snap-type` | Use `lenis/snap` — native snap is incompatible with Lenis |
| Three.js + Astro islands | Creating renderer inside component function | Create renderer once at module scope; unmount hook only cleans up scene objects |
| GSAP + Astro view transitions | Initializing plugins on module load | Initialize on `astro:page-load`, clean up on `astro:before-swap` |
| SplitText + Astro navigation | Ignoring revert | Call `.revert()` on all SplitText instances before page swap |
| Lenis + horizontal scroll | Using standard `overflow-x` container | Add `data-lenis-prevent` or `data-lenis-prevent-wheel` on the horizontal container |
| Three.js + Safari | `preserveDrawingBuffer: false` (default) | Canvas is invisible to screenshot APIs; plan transition system accordingly |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Particle count fixed at dev-machine level | Mobile shows <30fps, canvas freeze | Runtime device tier detection + 3 quality levels | Any mid-range mobile device |
| New geometry/material created every frame | Memory grows continuously, eventual crash | Allocate once, update `BufferAttribute` data instead of recreating | After ~30 seconds of animation |
| Drawing to canvas every frame even when tab is hidden | Battery drain, heat, background CPU usage | `visibilitychange` event to stop/resume `requestAnimationFrame` | Always — affects all tabs |
| GSAP creating tweens inside scroll handler | Hundreds of tweens created per scroll event | Create tweens once with `scrub: true` instead of creating new tweens in `onUpdate` | Fast scrollers, trackpad users |
| Lenis running at full speed on Safari battery save | Janky scroll at 30fps despite 60fps code | Nothing preventable — design animations to degrade gracefully at 30fps | iPhone/iPad in low power mode |
| High device pixel ratio not capped | 4K retina renders at 4x pixel density | Cap DPR: `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` | Retina displays, high-DPI phones |
| Post-processing (bloom, grain) on mobile | 10-20fps on mid-range devices | Disable post-processing below a GPU tier threshold | Any device without discrete GPU |
| Three.js loaded on docs pages | Slow docs page load, wasted bandwidth | `client:visible` island scope + named imports only | Always — docs should be zero-JS |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No loading state for Three.js initialization | Blank white canvas for 1-3s on slow connections | Show a CSS-only placeholder animation during WebGL init; replace when canvas is ready |
| Scroll hijacking without escape | Users trapped in a pinned section, can't navigate | Ensure every pinned section has a clear scroll-out path; test with trackpad and keyboard |
| Horizontal scroll gallery not obvious on mobile | Users never discover the section | Visual indicator (drag affordance, progress dots, visible overflow on first item) |
| Text animations trigger on every scroll-through | Rewatching the site feels repetitive | Use `once: true` on reveal animations that have played; only loop decorative/ambient effects |
| Film grain + particle motion + parallax simultaneously | Sensory overload, feels cheap instead of premium | Layer effects with hierarchy — grain is always on, parallax on scroll, particles only in hero |
| Fast scroll skips animation states entirely | Section appears mid-animation or in final state with no context | All reveal animations should have `scrub` or use `onEnter`/`onLeave` to snap to completed state |
| Docs section inherits main site Lenis | Smooth scroll on long docs pages fights text selection and code block scrolling | Disable Lenis on docs routes; use native scroll there |

---

## "Looks Done But Isn't" Checklist

- [ ] **Three.js hero:** Verify `renderer.info.memory` returns to baseline after navigating away and back — GPU memory must not leak
- [ ] **Lenis + ScrollTrigger:** Test all pinned sections after a window resize — trigger positions must not shift
- [ ] **Page transitions:** Navigate forward AND back to every page twice — animations must not double-fire on second visit
- [ ] **SplitText animations:** Navigate away and back — inspect DOM to confirm no double-wrapped spans
- [ ] **Mobile hero:** Test on a real mid-range Android device or throttled Chrome DevTools — must maintain usable frame rate
- [ ] **Reduced motion:** Enable "Reduce Motion" in macOS/iOS System Settings and verify all animations respect it
- [ ] **Docs section:** Bundle analyzer must show zero Three.js in docs page chunks
- [ ] **Horizontal scroll gallery:** Test swipe on touch device — must scroll horizontally without triggering vertical bounce
- [ ] **Canvas on page transition:** Verify no black flash or ghost canvas overlay during Barba/Astro transition
- [ ] **Tab hidden:** Switch to another tab and return — animation loop must have paused and resumed cleanly

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| GPU memory leak discovered late | HIGH | Audit every Three.js component for missing disposal; add lifecycle cleanup hooks; add `renderer.info` monitoring to dev console |
| ScrollTrigger positions broken after adding Lenis | MEDIUM | Remove `scrollerProxy` approach entirely; rewrite sync using the ticker pattern; call `ScrollTrigger.refresh()` after Lenis init |
| Double-firing animations discovered after page transitions built | MEDIUM | Wrap all init code in `astro:page-load` listener; wrap all cleanup in `astro:before-swap`; use GSAP Context for scoped cleanup |
| Three.js bundle on docs pages | LOW | Move hero island to its own Astro component with `client:visible`; run bundle analyzer to confirm isolation |
| No reduced-motion support | LOW | Add `gsap.matchMedia()` wrapper around all animation registrations; CSS `@media` overrides for any CSS transitions |
| Mobile performance collapse | HIGH if late | Implement device tier detection early; reduce particle count to 5k on mobile; remove post-processing; if discovered late, add a WebGL bypass that swaps the canvas for a static CSS gradient hero |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| GPU memory leak | Hero / Three.js foundation | Navigate away and back 5 times; `renderer.info.memory` must stay flat |
| Lenis + ScrollTrigger pinning | Scroll architecture setup | Test all pinned sections after resize; no blank gaps, no shifted triggers |
| GSAP cleanup on navigation | Page transitions | Navigate forward/back to each animated page twice; zero double-fires |
| Particle count untethered | Hero build | Test on throttled CPU/GPU in Chrome DevTools; must maintain 30fps minimum |
| Three.js bundle on all pages | Project setup / build config | Bundle analyzer on docs route; zero Three.js in output |
| Missing reduced-motion | Hero build + scroll animations | Enable OS reduced motion; all animations must snap to end state instantly |
| View transitions + WebGL collision | Page transitions | Check for black flash or ghost canvas on every route transition in Safari and Chrome |
| Lenis on docs pages | Docs section phase | Verify native scroll behavior on long docs pages; no smooth-scroll interference |

---

## Sources

- [Lenis + GSAP ScrollTrigger official integration pattern (darkroomengineering/lenis GitHub)](https://github.com/darkroomengineering/lenis)
- [ScrollTrigger + Lenis pinning conflict thread (GSAP forums)](https://gsap.com/community/forums/topic/39231-scrolltrigger-pinning-w-observer-not-working-when-lenis-added/)
- [Lenis + GSAP scroll blank space issue (GSAP forums)](https://gsap.com/community/forums/topic/44795-scrolltrigger-once-with-pin-and-scrub-lenis-creates-a-blank-space/)
- [Building a Scroll-Revealed WebGL Gallery with GSAP, Three.js, Astro and Barba.js (Codrops 2026)](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/)
- [Astro view transitions breaks ScrollTrigger on second navigation (GSAP forums)](https://gsap.com/community/forums/topic/41197-astro-viewtransitions-breaks-scrolltrigger-the-second-time-i-enter-a-page/)
- [SplitText cleanup on page transitions (GSAP forums)](https://gsap.com/community/forums/topic/37016-splittext-deletes-text-after-page-transition/)
- [Enhancing Astro View Transitions with GSAP Animations (Vasko Pavic)](https://vaskopavic.com/blog/enhancing-astro-view-transitions-with-gsap-animations/)
- [100 Three.js Tips That Actually Improve Performance (utsubo, 2026)](https://www.utsubo.com/blog/threejs-best-practices-100-tips)
- [Building Efficient Three.js Scenes: Optimize Performance (Codrops, 2025)](https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/)
- [Three.js WebGL memory leak: dispose correctly (Three.js forum)](https://discourse.threejs.org/t/dispose-things-correctly-in-three-js/6534)
- [WebGL context lost on iOS — causes and recovery (Three.js forum)](https://discourse.threejs.org/t/how-to-fix-context-lost-android-iphone-ios/56829)
- [Lenis performance issues on mobile with GSAP (Lenis discussions #431)](https://github.com/darkroomengineering/lenis/discussions/431)
- [Accessibility: prefers-reduced-motion with code examples (Pope Tech, 2025)](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/)
- [WCAG 2.1 SC 2.3.3 Animation from Interactions (W3C)](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
- [Three.js GSAP ScrollTrigger Video Performance on Low-End Devices (Three.js forum)](https://discourse.threejs.org/t/three-js-gsap-scrolltrigger-video-performance-issue-on-low-end-devices/78051)
- [Gsap scroll trigger and lenis scroll not compatible — Astro issue #7758](https://github.com/withastro/astro/issues/7758)

---
*Pitfalls research for: Immersive personal website — Three.js + GSAP + Lenis + Astro*
*Researched: 2026-03-30*
