# josue.aparcedo.org — cinematic treatment

**Status**: design contract. Do not ship code that contradicts this doc without updating it first.
**Last revised**: 2026-04-19
**Owner**: josue
**Bar**: awwwards SOTD, apple-vision-pro-tier scroll cinematography, cowboy-bebop typographic DNA, nous-research information density.

---

## 0. thesis

**"I build tools for autonomous agents. I orchestrate systems."**

Every pixel of the site must make a recruiter feel that in 7 seconds. The sphere is not decoration — it is the **proof artifact**. Each facet is a real system Josue built.

## 1. the world

You are aboard a small craft. An orbital workbench above Fort Myers. Deep-violet void outside the viewport. Inside the cabin: the sphere (project array), HUD readouts (nous-density), terminal console (bebop retrofuturism). The camera never cuts. Scroll = piloting the craft through a prepared sequence.

One sphere. One camera. One continuous film.

## 2. tone

- **nous voice** on text strings: "SESSION 01 · SELECTED WORK · OBSERVED 2023–2026" not "My Projects"
- **bebop voice** on typography: each major scene opens with a **session card** — a bespoke type composition announcing the scene, ~900ms hold, then hard cut
- **apple precision** on motion: one easing language, one timeline choreographer

## 3. palette

| token | hex | role |
|-------|-----|------|
| void | `#0a0816` | background — deep cosmic eggplant, never pure black |
| violet-prime | `#7c3aed` | primary accent, rim light |
| electric | `#a78bfa` | wireframe, hover, active |
| warm-signal | `#fbbf24` | rare — recording dot, active session, end-card punctuation |
| ink | `#ece7f5` | body type |
| ink-dim | `#a9a1c4` | metadata |
| grain | always-on 4% noise overlay | film texture |

## 4. typography

**Three faces. Strict roles. No drift.**

| face | role |
|------|------|
| Editorial New / Tiempos (serif) | names, section titles, emotional lines |
| PP Neue Montreal / Inter Tight (sans) | body, UI, labels |
| Berkeley Mono / JetBrains Mono | ALL metadata — coords, timestamps, indices, tags, code, `[ ]`-bracketed labels |

Every number, coordinate, tag = mono. Every name, emotional line = serif. Sans is utility.

## 5. motion curves

Commit to exactly four, reject all others in PR review.

```css
--ease-hard: cubic-bezier(0.2, 0.8, 0.2, 1);     /* UI snaps, 300ms */
--ease-long: cubic-bezier(0.16, 1, 0.3, 1);       /* camera moves, 1200ms+ */
--ease-spring: custom overshoot;                   /* micro, cursor, 400ms */
--ease-cut: linear 0ms;                            /* hard cuts only */
```

## 6. the film — shot list

### SHOT 00 · "3, 2, 1, LET'S JAM" (boot)

Black frame. Amber dot pulses three times. Mono `JAM.` types in. Hard-cut to:
- Wireframe sphere assembles edge-by-edge (8 base edges first, then geodesic subdivisions in waves)
- Faces fill with material as wires complete
- `JOSUE · APARCEDO` typography flies in as particles from frame edges, settles
- HUD corners materialize last
- Rim light pulses once = "system online"

Duration: 2.8s, tied to real asset load. No fake padding.

### SHOT 01 · "THE HOVER" (hero)

Sphere hangs in violet void. Serif display type, nameplate. HUD corners dense with nous data (coords, altitude, session index, recording timestamp running). Mouse = subtle parallax on sphere. Sphere auto-rotates at 3 RPM, jazz-lazy. Scroll hint at bottom like a film leader countdown.

### SHOT 02 · "SELECTED WORK" (work)

Session card holds ~900ms: `SESSION 01 · STRAY SIGNAL · N objects, observed`. Hard cut. Camera drifts inward. Project labels manifest at face centroids with nous-style meta: `[001/2026] · RUST · AGENTS`. User drags to spin, double-clicks a face.

Facet **unfolds flat toward camera** (origami). Behind: a live artifact of that project. Other sphere dimmed behind. Back button = fold back.

### SHOT 03 · "THE DIVE" (work → about) — **MONEY SHOT**

Session card: `SESSION 02 · BALLAD OF ORIGIN · the builder, observed`. 300vh sticky scroll-track. Five beats:

| beat | track % | action |
|------|---------|--------|
| 1. lock-on | 0–20 | sphere rotates to aim about-facet at camera. crosshair HUD reticles onto it. mono ticker: `ACQUIRING · 02 · ABOUT`. reticle pulses. |
| 2. approach | 20–55 | camera dollies forward on long-ease curve. dust particles stream past. wireframe edges start glitching with chromatic aberration. violet intensifies. |
| 3. puncture | 55–72 | sub-triangles of target facet shatter outward in a wave from center. each shard tumbles with random velocity + angular velocity, fades with distance. between shards: deeper violet void. we are now **inside the sphere**. |
| 4. emergence | 72–90 | shards gone. camera on inside-surface. serif `Notes on me.` letters drop with 40ms stagger + slight 3d rotation. body text types in. stats grid slides in right-to-left. |
| 5. land | 90–100 | camera stops. sphere exterior ghost in background. HUD updates: `SESSION 02 · ACTIVE`. |

Audio: drone-only during beat 3 (400ms silence from jazz). Resumes on land.

### SHOT 04 · "THE TRANSMISSION" (contact)

Session card: `SESSION 03 · TRANSMIT · outbound signal`. Contact is a transmitter interface:

```
> compose --to josue@aparcedo.org
TO:      [ _________ ]
FROM:    [ _________ ]
MESSAGE: [ _________ ]
                              [ TRANSMIT ]
```

Submit = real protocol animation: `SYN → SYN-ACK → ACK → queued → delivered`. 1.2s. Cold precision.

### END CARD · "SEE YOU SPACE COWBOY"

Full viewport, violet void. Serif:
```
SEE YOU SPACE COWBOY...
                                    © JOSUE · 2026
```

Direct bebop reference. Non-negotiable.

## 7. project experiences

Each facet holds a real project. **Not a card — a micro-experience.** Sphere has 8 base faces × geodesic subdivision = we can place many more than 8 projects. Use base faces as **categories**; sub-triangles as individual repos.

### categories (8 base faces)

| face | category | anchor projects |
|------|----------|-----------------|
| 1 | **Agent Memory** | memd, claude-dream |
| 2 | **Agent Orchestration** | claude-autoresearch, AgentShell, clawcontrol |
| 3 | **Agent Security** | security-sweep, AgentSecrets |
| 4 | **Homelab Systems** | homelab-cli, mac-bridge |
| 5 | **Hardware** | Bjorn (modded Ender 3 V2 NEO) |
| 6 | **Products / Apps** | SunshineDetailing, business-dashboard |
| 7 | **Experiments** | cornerstone (AI 98 OS), Alice |
| 8 | **Personal Site + Meta** | this repo, claude-sync |

### interaction

Click category face → facet unfolds → inside: grid of sub-triangles, each one a repo with live meta (stars, last commit, language, size) pulled from GitHub API at build time. Click sub-triangle → repo case study (separate doc section).

### per-project micro-experiences (priority order for build)

| # | project | session title | interaction |
|---|---------|---------------|-------------|
| 01 | memd | `GHOST IN THE SHELL` | live memory-graph visualization, nodes are memories, edges are references, drag to explore |
| 02 | security-sweep | `BOUNTY HUNTER` | 19 agent badges animate in, hover to see their role, click to read findings |
| 03 | claude-autoresearch | `THE REAL FOLK BLUES` | loop diagram that auto-plays its cycle: research → plan → execute → verify → rest |
| 04 | Bjorn | `HEAVY METAL QUEEN` | 3d printer head traces a test pattern in SVG, real G-code loaded |
| 05 | homelab-cli | `WALTZ FOR VENUS` | faux terminal, type any of the 16 CLIs, see fake but realistic output |
| 06 | AgentSecrets | `JUPITER JAZZ` | animated flow: agent → broker → vault → audit log, with fake secret requests flowing |
| 07 | claude-dream | `SYMPATHY FOR THE DEVIL` | dream-sequence animation: conversation log → compressed memory → recall |
| 08 | mac-bridge | `STRAY DOG STRUT` | iMessage-style bubbles animate across screen, "sent from mac-bridge" |

Projects 1–3 are flagship. Build those to completion before moving on.

## 8. HUD (nous-density)

| corner | content |
|--------|---------|
| top-left | `SESSION ##` + track name + `REC ##:##:##` (elapsed on site) |
| top-right | `LAT 26.64° N · LON 81.87° W · EST ##:##:##` (real-time) |
| bottom-left | `▶ NOW PLAYING · <track>` (actual audio when enabled) |
| bottom-right | contextual — scroll hint, drag hint, keyboard hint |

All mono, dim, peripheral. Never shouty.

## 9. interaction grammar

### cursor
Violet dot, lagged ring. State-aware: crosshair on sphere, text-bar on prose, amber `REC` dot on contact form. Physics = spring (not lerp).

### keyboard
- `J`/`K` = next/prev session
- `space` = pause sphere spin
- `/` or `⌘K` = command palette
- `?` = shortcuts overlay
- `M` = mute/unmute audio

### scroll
Lenis with slight rubber-band resistance at shot boundaries (80ms friction, not locked).

### sound (muted default, prominent unmute)

**Cowboy Bebop OST is the soundtrack.** Yoko Kanno's Seatbelts catalog is the bebop DNA — "Tank!", "The Real Folk Blues", "Space Lion", "Rain", "Green Bird". Non-negotiable aesthetically.

**Licensing reality**: OST is copyrighted (Victor Entertainment / Sunrise). Self-hosting clips = risk. Three tiers of increasing legal safety:

1. **Ideal (risky)**: self-host 30–60s clips, fade on scroll. Short clips + non-commercial + portfolio context = arguable fair use, not guaranteed. DMCA strike risk.
2. **Safer**: embed Spotify iframe player (or Apple Music) with a curated Bebop playlist. User clicks play, Spotify handles licensing. Visually themable to match site. Scroll-sync is limited but the "Now Playing" ticker becomes real — pulls current track from Spotify Web API.
3. **Safest**: original / CC-licensed jazz in bebop style (ambient synth drones + jazz hats + melancholic sax samples from free libraries). Lose the instant-recognition factor but keep the vibe. Can layer real bebop cues only at specific beats under plausible fair-use (2-3s stings).

**Recommended path**: tier 2 (Spotify embed) for the ambient/ticker, tier 3 for transition stings (original). If Josue wants to risk tier 1 later, the architecture supports it — swap the audio source, UI unchanged.

**Per-session track mapping** (Spotify playlist `Bebop Session`):
| session | beat | track |
|---------|------|-------|
| boot | `JAM.` countdown | "Tank!" intro sting (3s, fair-use arguable) |
| hero ambient | SHOT 01 loop | "Space Lion" (chill loop) |
| work scene | SHOT 02 loop | "Cat Blues" / "Bad Dog No Biscuits" |
| dive puncture | SHOT 03 beat 3 | 400ms silence, then "Green Bird" on emergence |
| about ambient | SHOT 03 beat 5 | "Too Good Too Bad" or "Waltz for Venus" |
| contact transmit | SHOT 04 | "Digging My Potato" (brief, ironic) |
| end card | SEE YOU SPACE COWBOY | "The Real Folk Blues" first 8 bars |

**Ticker copy**: `▶ NOW PLAYING · <track> · YOKO KANNO / SEATBELTS`. Links to Spotify. Attribution is love.

- ambient drone baseline: 40Hz sub, barely audible, always on when unmuted
- transitions: vinyl crackle at session-card cuts (free crackle samples, tier 3 safe)
- NEVER autoplay with sound. Unmute button = prominent amber dot in corner.

**Existing ticker text** (`Tycho — A Walk · Frank Ocean — Nights · Toro y Moi — Ordinary Pleasure`) → replace with Bebop rotation. Track text becomes truthful when audio wired up.

## 10. always-on textures

- **grain**: 4% noise, regenerated per frame
- **scanlines**: 2% opacity, slow vertical drift
- **chromatic aberration**: 0 baseline, ramps to 4px during dives, pulses 8px on shatter impact
- **vignette**: 20% dark at corners

These bind everything to the bebop frame aesthetic.

## 11. session-card component

Reusable Astro component. Each instance bespoke (different weights, layouts, meta). Shared traits: mono timestamp + serif title + violet + grain + 900ms hold + hard cut exit.

Target: 5–7 unique cards across the site. Treat like album art.

## 12. performance budget

- FCP < 1.5s on 4G
- LCP < 2.5s
- 60fps on integrated GPU during dive
- Three.js lazy-loaded, critical CSS inlined
- Reduced-motion: dive collapses to fade, shatter disabled, grain static
- Mobile: 300vh track → 150vh, shatter shard count halved

## 13. a11y baseline

- Semantic landmarks, aria-labels on 3d interactions
- Keyboard navigable nav + shortcuts
- Reduced-motion respected
- NoJS = readable static site (Astro strength)
- NoWebGL = static sphere image fallback

## 14. build roadmap

| phase | duration | ships |
|-------|----------|-------|
| P0 · foundation | 4d | tokens, curves, grain, palette, session-card component |
| P1 · SHOT 00 + 01 | 1.5w | boot + hero with assembly animation |
| P2 · SHOT 03 dive | 2w | **money shot** — sticky track, 5 beats, shatter, emergence |
| P3 · SHOT 02 work | 1.5w | session card + facet unfold + categories |
| P4 · project micro-experiences (×3 flagship) | 2w | memd, security-sweep, autoresearch |
| P5 · project micro-experiences (×5 more) | 2w | Bjorn, homelab-cli, AgentSecrets, dream, mac-bridge |
| P6 · SHOT 04 transmit | 5d | transmitter + backend + handshake |
| P7 · end card + docs | 1w | cowboy closer + 3 long case studies |
| P8 · audio + palette + interactions | 1w | sound, ⌘K, shortcuts, cursor states |
| P9 · polish + submit | 1w | mobile, perf, cross-browser, awwwards / godly / siteinspire |

**Total: ~12 weeks.**

## 15. non-negotiables

1. Single easing language, enforced.
2. Session-card motif recurring through the film.
3. "SEE YOU SPACE COWBOY" end card.
4. Real repos as projects — no placeholder data.
5. Grain + vignette always on.
6. No autoplay audio.
7. Mobile works, but desktop is the headline.

## 16. open questions

- Audio commitment confirmed (muted default + prominent unmute)?
- Amber `#fbbf24` as rare accent confirmed?
- Is `bobbyparzero@gmail.com` or `josue@aparcedo.org` the public-facing email?
- Category count flex: 8 base faces vs tighter 6? Keep 8 if all categories have ≥1 strong repo.
- Docs section aesthetic: same cinematic shell or flip to "reading mode" (light bg, serif, wide margins)?
