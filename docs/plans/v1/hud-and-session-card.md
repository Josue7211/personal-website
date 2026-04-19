---
name: HUD + Session Card — components and content
phase: cross-cutting (ships across C1/E1, authored in B1)
status: ready
last_revised: 2026-04-19
---

# HUD + Session Card

## 1. HUD corners

All mono, `--text-xs`, `--color-ink-dim`. Corner padding `--space-5` desktop, `--space-4` mobile. Do not move during scroll (position: fixed on `--z-hud`). Fade-out only on SHOT 03 beat 3 puncture.

### Top-left

```
SESSION 02 · BALLAD OF ORIGIN
REC 00:01:47
```

- `SESSION ##` + current-shot title, updated by SceneController on shot change
- `REC` timer = elapsed since page load, HH:MM:SS mono, `--color-warm-signal` dot before label

### Top-right

```
LAT 26.6406° N
LON 81.8723° W
EST 14:02:11
```

- static coords for Fort Myers, FL
- EST clock ticks 1Hz, server-side hint but client-side correct

### Bottom-left

```
▶ NOW PLAYING
SEATBELTS — TANK!
YOKO KANNO
```

- play icon in `--color-violet-prime`
- track + artist from AudioEngine.getNowPlaying()
- attribution line required

### Bottom-right (contextual)

| scene | content |
|-------|---------|
| hero | `SCROLL TO ENTER ↓` + line leader |
| work | `DRAG · DBL-CLICK A FACE` |
| dive | `LOCK ACQUIRED →` during beat 1, hidden beat 2+ |
| about | `KEEP SCROLLING ↓` |
| contact | `ENTER TO TRANSMIT` |
| end | `↑ BACK TO TOP` |

### Boot

HUD fades in during SHOT 00 final 300ms.

### Mobile

- top-left session only (no elapsed)
- top-right EST only (no lat/lon)
- bottom-left ticker truncates to track name
- bottom-right hidden except hero

## 2. Session Card component

File: `src/components/ui/SessionCard.astro`.

Purpose: bespoke typographic cut between shots. 900ms hold, hard cut exit.

### Props

```ts
interface Props {
  session: string           // 'SESSION 02'
  title: string             // 'BALLAD OF ORIGIN'
  subtitle?: string         // 'the builder, observed'
  variant?: 'A' | 'B' | 'C' | 'D' | 'E'  // 5 bespoke layouts
  hold?: number             // default 900
  accent?: 'violet' | 'amber'
}
```

### Variants

Treat like album art — each major shot gets a bespoke layout.

- **A (boot)**: amber countdown `3 · 2 · 1 · JAM.` top-left, session label bottom-right
- **B (work)**: serif session title dominating, meta grid below, mono catalog ID
- **C (dive)**: crosshair reticle graphic over session title, horizontal scan line animation
- **D (transmit)**: terminal-style frame, blinking cursor, text types in
- **E (end)**: full-viewport `SEE YOU SPACE COWBOY...` with signature + year

### Lifecycle

```
enter (180ms fade + 4px chroma in) →
hold (900ms) →
exit (hard-cut linear 0ms)
```

Exit triggers a crackle sting (tier 3) via AudioEngine.sting('vinyl-crackle').

### Reduced motion

Enter fade 80ms, no chroma, hold 400ms, exit linear.

## 3. Session catalog

Authoritative content for every session card.

| variant | session | title | subtitle | scene |
|---------|---------|-------|----------|-------|
| A | SESSION 00 | STRAY SIGNAL | 3 · 2 · 1 · JAM. | boot |
| B | SESSION 01 | SELECTED WORK | N objects, observed | work |
| C | SESSION 02 | BALLAD OF ORIGIN | the builder, observed | dive |
| D | SESSION 03 | TRANSMIT | outbound signal | contact |
| E | EOF | SEE YOU SPACE COWBOY | © Josue · 2026 | end |

## 4. Copy rules

- Session titles: ALL CAPS mono. 2–4 words.
- Subtitles: serif italic lowercase. 3–7 words.
- No emojis. No "hello world." energy.
