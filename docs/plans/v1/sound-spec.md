---
name: Sound Spec — engine, licensing, per-session track map
phase: cross-cutting (ships in G1, hooks in B1 + D1 + C1)
status: ready
last_revised: 2026-04-19
---

# Sound Spec

## 1. Principle

Cowboy Bebop OST is the soundtrack. Yoko Kanno + Seatbelts (Victor Entertainment / Sunrise). Muted default. Prominent amber unmute. Never autoplay. Ticker copy is truthful — if the site says `Seatbelts — Tank!`, Tank! must actually be playing.

## 2. Licensing tiers

| tier | description | risk | coverage |
|------|-------------|------|----------|
| 1 (ideal / risky) | self-host 30–60s clips, fade on scroll | DMCA strike risk; fair-use arguable for non-commercial portfolio | 100% — exact track, exact timing |
| 2 (safer) | Spotify embed + Web API for ticker | legal, Spotify handles rights; users need Spotify or Premium for full tracks | ambient loops, now-playing ticker |
| 3 (safest) | original CC-licensed jazz stings + free vinyl crackle | zero legal risk | transitions, session-card cuts, ambient drone |

**V1 path**: tier 2 + tier 3 hybrid. Architecture supports tier 1 behind a feature flag if Josue later accepts the risk.

## 3. Engine

```
src/audio/
  engine.ts         # AudioEngine singleton, gain bus, mute state
  spotify.ts        # Spotify Embed + Web API adapter
  stings.ts         # local CC stings preloaded from /public/audio/stings/
  crackle.ts        # looped vinyl crackle
  scene-hooks.ts    # SceneController → audio event mappings
```

### API

```ts
interface AudioEngine {
  state: 'muted' | 'unmuted' | 'transitioning'
  unmute(): Promise<void>              // must be from user gesture
  mute(): void
  duck(ms: number): Promise<void>      // for SHOT 03 beat 3
  sting(name: string): void            // plays a tier-3 clip
  setScene(scene: SceneId): void       // transitions the ambient source
  getNowPlaying(): NowPlaying | null   // for HUD ticker
}

interface NowPlaying {
  track: string
  artist: string
  album?: string
  url?: string
  source: 'spotify' | 'local' | 'none'
}
```

Bus topology: `stings ─┐`, `ambient ─┤── master gain ── destination`. Ducking lowers master 100% over 160ms, holds, restores over 240ms.

## 4. Per-session track mapping

Reproduced from cinematic-treatment §9. Canonical here.

| scene / beat | source | track | duration |
|--------------|--------|-------|----------|
| SHOT 00 boot `JAM.` countdown | tier 3 sting (Tank-inspired original) | `boot-sting.mp3` | 3.0s |
| SHOT 01 hero ambient | tier 2 Spotify loop | Seatbelts — *Space Lion* | loop |
| SHOT 02 work ambient | tier 2 | Seatbelts — *Cat Blues* or *Bad Dog No Biscuits* | loop |
| SHOT 03 beat 1–2 | carry from SHOT 02 | — | — |
| SHOT 03 beat 3 puncture | ducked silence + shatter impact sting (tier 3) | `shatter.mp3` | 400ms |
| SHOT 03 beat 4–5 emergence/land | tier 2 | Seatbelts — *Green Bird* then *Waltz for Venus* | — |
| SHOT 04 transmit | tier 2 | Seatbelts — *Digging My Potato* | brief |
| END CARD | tier 2 | Seatbelts — *The Real Folk Blues* (first 8 bars) | ~20s |

Session-card cuts: vinyl crackle sting 180ms (tier 3 free sample).

## 5. HUD ticker

`▶ NOW PLAYING · <track> · YOKO KANNO / SEATBELTS` — links to Spotify track. Updates in real time from Spotify Web API when tier-2 is active. Attribution always present.

## 6. Mute default + unmute UX

- amber dot top-left (HUD corner area, not over sphere)
- label: `AUDIO · MUTED` → click → `AUDIO · ON`
- keyboard: `M`
- persisted in `localStorage.audio.muted`
- reduced-motion does NOT imply reduced-audio

## 7. Mobile

- Safari audio requires user gesture; unmute button is the only entry point
- tier 2 Spotify embed disabled on mobile (UX regression) — only tier 3 stings + ambient drone play
- ticker copy on mobile: `▶ STING READY · tap to unmute`

## 8. Accessibility

- `prefers-reduced-motion` does not affect audio
- sticker live-region announces track changes for screen readers
- all audio has a mute control; no forced playback

## 9. Assets to source

| file | source | notes |
|------|--------|-------|
| `/public/audio/stings/boot-sting.mp3` | original or CC | 3s, Tank-inspired horn + bass stab |
| `/public/audio/stings/shatter.mp3` | freesound.org CC0 | glass shatter, 400ms |
| `/public/audio/stings/vinyl-crackle.mp3` | freesound.org CC0 | 2s loop |
| `/public/audio/ambient/sub40.mp3` | generated | 40Hz sine, -40dB, 30s loop |
| Spotify playlist | spotify.com | `Bebop Session` — curated, public |

## 10. Open decisions

- Confirm tier 2 + tier 3 hybrid is the path (ROADMAP decision #1)
- Josue provide Spotify playlist ID, or curate here
- If tier 1 becomes desired later, add `AudioEngine.playLocalClip(trackName)` behind feature flag
