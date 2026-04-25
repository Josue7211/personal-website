# Guided Rail Scroll Design

Date: 2026-04-24
Project: personal-website
Status: proposed

## Goal

Upgrade the homepage scroll feel from plain section transitions into a cinematic, high-trust guided rail. The experience should feel closer to a premium product page than a normal portfolio, while still respecting user intent and avoiding “trapped” scroll behavior.

The target feeling is:

- smooth and expensive
- section-aware, not chaotic
- strongest around the 3D orb work stage
- easy to break out of with deliberate input
- enjoyable on repeated visits, not just first impression

## Chosen Direction

Chosen direction: guided rail

This means the site keeps a continuous page scroll, but adds a control layer on top:

- section-aware easing
- proximity-based magnetic capture
- short “hold for a beat” moments on important sections
- stronger capture on `Selected Work`
- lighter capture on `About` and `Contact`
- escape on strong wheel / trackpad intent

This explicitly does **not** become a fully pinned, fully hijacked story engine across the whole page. It should feel cinematic, but still human.

## Why This Direction

Three approaches were considered:

1. Thin native layer
   Keep native scroll and add minor easing only. Lowest risk, but not cinematic enough for the intended premium feel.

2. Guided rail
   Add page-wide smoothing plus section-biased capture. Gives the Apple-style direction the user wants without turning the site into a frustrating scroll trap.

3. Full choreography
   Treat the whole page like a launch-film timeline. Strongest visual control, but too risky for repeated use and too easy to make annoying.

Guided rail is the best fit because it gives cinematic control where it matters while preserving user trust.

## Experience Model

### Hero

Hero should feel smooth and premium, but not snapped. The user needs to be able to enter the site naturally.

Behavior:

- high-quality eased scroll response
- no hard capture at top
- preserve current orb presence and HUD feel
- downward movement should feel damped and coherent, not sticky

### Selected Work

`Selected Work` becomes the primary stage.

Behavior:

- approaching from either direction, the page detects proximity to the ideal orb composition
- if user intent is normal, the page smoothly animates into the work stage alignment
- once aligned, hold briefly for one intentional viewing beat
- during hold, orb interaction remains available and legible
- after the beat, light resistance remains, but continued scrolling progresses normally
- strong user input breaks out immediately

This is the strongest capture zone on the site.

### About

`About` should not trap. It should land cleanly.

Behavior:

- light magnetic alignment to help the heading and body settle into a readable composition
- no long hold
- no feeling of pinning
- preserve the current work-to-about visual handoff improvements

### Contact

`Contact` should feel elegant and composed, not sticky.

Behavior:

- light guidance only
- delayed return of top chrome remains respected
- headline and contact info should settle into place cleanly
- no aggressive lock

## Scroll States

The guided rail introduces explicit behavioral states above raw `scrollY`.

### Free

Normal eased movement with no active section capture.

### Attract

User is near a section target. The rail begins subtly biasing motion toward the preferred composition.

### Capture

The page animates into the section’s target alignment.

### Hold

The page stays in the aligned composition for a short beat. This is strongest in `Selected Work`, very light elsewhere.

### Release

The rail hands control back to continuous scroll while keeping motion smooth.

### Breakout

If input exceeds a configured intent threshold, any active capture/hold is cancelled and the user is released immediately.

## Input Rules

The system must treat user intent as authoritative.

### Normal input

Normal mouse wheel or trackpad movement can trigger attract/capture near key sections.

### Strong input

Large wheel delta, fast repeated deltas, or strong momentum should cancel capture and force progression.

### Direction changes

Reversing direction should dissolve the current hold quickly and allow the user to move back through the page without fighting the system.

### Interaction priority

While the work stage is captured, pointer interaction with the orb must remain responsive. Scroll guidance cannot make the 3D interaction feel blocked.

## Motion Characteristics

The motion system should feel premium, not rubbery.

### Global smoothing

- continuous eased interpolation for page movement
- no visible lag behind user intent
- no “floaty” overhang after the user stops

### Capture motion

- smooth animated settle into section targets
- fast enough to feel intentional
- slow enough to feel expensive
- one consistent easing family site-wide

### Hold timing

- `Selected Work`: one intentional beat, slightly longer than other sections
- `About`: minimal hold
- `Contact`: minimal hold

## Target Compositions

Each guided section needs one canonical resting composition.

### Work target

- preserve the current right-weighted composition
- orb fills most of the frame
- `Selected Work` copy remains visible on the right
- this is the hero composition for section locking

### About target

- heading and first body block land into a stable readable frame
- avoid chrome collisions
- preserve the current transition feathering

### Contact target

- contact headline settles with enough breathing room
- top chrome re-enters only after the composition has room for it

## Accessibility and Safety

- reduced-motion must disable guided capture and hold behavior
- reduced-motion path falls back to current non-snapping scroll
- keyboard navigation and anchor jumps must still work
- no hidden dead zones where user cannot progress
- no scroll traps on trackpads

## Implementation Shape

### Controller

Add a dedicated scroll behavior controller on top of the existing scene update logic.

Responsibilities:

- normalize wheel/trackpad input into intent signals
- detect section proximity windows
- manage state machine: `free -> attract -> capture -> hold -> release`
- detect breakout conditions
- drive eased scroll-to-target movement
- expose section state to CSS / scene systems through body classes or CSS variables

### Section configuration

Each major section should define:

- target alignment position
- capture radius
- hold duration
- breakout sensitivity
- strength weight

This keeps `Selected Work`, `About`, and `Contact` tunable without hardcoding one-off logic everywhere.

### Integration

The controller should integrate with the existing homepage stack rather than replace it:

- current 3D scene updates remain intact
- current hero / about / contact CSS transitions remain intact
- new guided rail augments section entry and progression

## Verification

The feature is successful if:

- users feel stronger cinematic direction across the page
- the work stage is easier and more enjoyable to engage with
- about/contact land more cleanly
- strong scroll intent always wins
- repeated use still feels pleasant
- no regressions in current 3D interaction or section transitions

Manual checks:

- slow mouse wheel down through entire page
- fast wheel flick down through entire page
- slow trackpad glide through work from both directions
- aggressive breakout while work is capturing
- reverse direction while held in work
- reduced-motion behavior
- 1440p and 1080p desktop checks

## Risks

### Over-control

If section capture is too strong, the site will feel annoying quickly.

Mitigation:

- tune breakout aggressively
- keep hold durations short
- keep strongest capture only on `Selected Work`

### Scroll/input inconsistency

Trackpads and mouse wheels behave differently.

Mitigation:

- normalize deltas
- test both input styles explicitly
- prefer forgiving breakout thresholds

### Transition conflicts

The new rail could fight the current work/about/contact transition logic.

Mitigation:

- keep section state explicit
- apply guidance in one controller, not ad hoc in multiple places
- verify each transition in both directions

## Scope

In scope:

- page-wide guided rail behavior
- strongest work-stage capture
- lighter about/contact guidance
- breakout logic
- reduced-motion fallback
- motion tuning pass for premium feel

Out of scope:

- rewriting the entire site around GSAP scene timelines
- full story-film pinning across every section
- replacing the 3D scene system
- mobile-specific redesign in this pass
