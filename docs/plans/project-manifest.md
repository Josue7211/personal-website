# project manifest — real repos

**Source**: github.com/Josue7211, fetched 2026-04-19.
**Owner handle in code**: `Josue7211` (NOT `aparcedo`). Update UI strings accordingly.

## the real thesis

GitHub history says: **agent infrastructure, homelab systems, security tooling**. Hardware is minor (one project: Bjorn). Marketing copy that says "hardware and software" is aspirational. Actual demonstrated skill is:

- **agent platforms** (memd, claude-dream, claude-autoresearch, AgentShell, clawcontrol)
- **agent security** (security-sweep, AgentSecrets)
- **self-hosted infrastructure** (homelab-cli, mac-bridge, claude-sync)
- **systems tooling** (Rust + shell, some TypeScript)
- **light hardware** (Bjorn: 3d printer mod)

Site copy should reflect this. Rewrite "building at the edge of hardware and software" → something like "building tools for autonomous agents + the systems they run on." Still keep hardware as a real thread (Bjorn + education at FSW Computer Eng.) but don't overclaim.

## categorization (8 base faces)

### Face 01 — AGENT MEMORY
- **[memd](https://github.com/Josue7211/memd)** ⭐1 · Rust · *Open-source memory manager and retrieval control plane for agents.* **FLAGSHIP.**
- **[claude-dream](https://github.com/Josue7211/claude-dream)** ⭐1 · Shell · *Memory consolidation skills for Claude Code — replicate Anthropic's unreleased /dream and /autodream.*

### Face 02 — AGENT ORCHESTRATION
- **[claude-autoresearch](https://github.com/Josue7211/claude-autoresearch)** · Shell · *Autonomous overnight improvement loop for Claude Code — inspired by Karpathy's autoresearch.*
- **[AgentShell](https://github.com/Josue7211/AgentShell)** · Rust · *Agent shell runtime.*
- **[clawcontrol](https://github.com/Josue7211/clawcontrol)** · TypeScript · *Control plane for OpenClaw agents.*
- **[opcode](https://github.com/Josue7211/opcode)** · (fork) · *GUI + toolkit for Claude Code — creating agents, managing sessions, secure background agents.* Mark as fork / contribution.

### Face 03 — AGENT SECURITY
- **[security-sweep](https://github.com/Josue7211/security-sweep)** · *Pentagon-grade red team security scanning for Claude Code. 19 agents, two tiers, zero gaps.* **FLAGSHIP.**
- **[AgentSecrets](https://github.com/Josue7211/AgentSecrets)** · Rust · *Self-hosted secret broker for agent workflows — masked responses, approvals, audit trails.*

### Face 04 — HOMELAB SYSTEMS
- **[homelab-cli](https://github.com/Josue7211/homelab-cli)** · Shell · *16 bash CLIs for managing a self-hosted homelab — Sonarr, Radarr, Plex, AdGuard, qBittorrent, Portainer.*
- **[mac-bridge](https://github.com/Josue7211/mac-bridge)** · JavaScript · *REST bridge for macOS services — Reminders, Notes, Contacts, Find My, Messages. Runs on a Mac, accessible over Tailscale.*
- **[claude-sync](https://github.com/Josue7211/claude-sync)** · Shell · *Sync Claude Code config via Syncthing + projects via NAS mounts.*

### Face 05 — HARDWARE
- **[Bjorn](https://github.com/Josue7211/Bjorn)** · *Modified Ender 3 V2 NEO to print most materials at high speeds.* Only real hardware project. Needs a rich case-study — firmware changes, slicer profiles, mechanical mods, photos/video of prints.

### Face 06 — PRODUCTS / APPS
- **[SunshineDetailing](https://github.com/Josue7211/SunshineDetailing)** · TypeScript · *Business website for booking appointments.* Real client work.
- **[business-dashboard](https://github.com/Josue7211/business-dashboard)** · JavaScript · *Client and financial dashboard.*
- **[landing-page](https://github.com/Josue7211/landing-page)** · JavaScript · utility, likely stub.
- **[cobe-funnel-ops](https://github.com/Josue7211/cobe-funnel-ops)** · TypeScript · project for Cobe (context unknown, check README).

### Face 07 — EXPERIMENTS
- **[cornerstone](https://github.com/Josue7211/cornerstone)** · JavaScript · *AI 98 OS.* Novelty, fun. Good visual payoff for a micro-experience.
- **[Alice](https://github.com/Josue7211/Alice)** · *Personal Virtual Assistant* (2023, likely archival).

### Face 08 — META (the site + tools about tools)
- **[personal-website](https://github.com/Josue7211/personal-website)** · *This site.*
- **[claude-sync](https://github.com/Josue7211/claude-sync)** (listed above, can live in either face)
- Meta tools for running Claude Code efficiently.

### Excluded
- Forks (music-player, music-server, opcode) — marked as fork or excluded unless Josue contributed meaningfully.
- `.github` meta repo — excluded.
- `spotify-takeover` — archived-ish, unclear status, include only if real.

## priority order for micro-experiences

Build in this order. Each is its own milestone.

1. **memd** — `GHOST IN THE SHELL` — live memory graph visualization
2. **security-sweep** — `BOUNTY HUNTER` — 19 agent badges with roles
3. **claude-autoresearch** — `THE REAL FOLK BLUES` — auto-playing loop diagram
4. **Bjorn** — `HEAVY METAL QUEEN` — SVG G-code tracer
5. **homelab-cli** — `WALTZ FOR VENUS` — faux terminal with 16 CLI demos
6. **AgentSecrets** — `JUPITER JAZZ` — secret broker flow animation
7. **claude-dream** — `SYMPATHY FOR THE DEVIL` — conversation → compressed memory visualization
8. **mac-bridge** — `STRAY DOG STRUT` — iMessage bubbles flying
9. **SunshineDetailing** — real-world product screenshot gallery
10. **cornerstone** — `AI 98 OS` in an iframe, fully interactive

After #3 is shipped, the site has a credible "flagship three." That's the MVP for recruiter-worthy.

## build-time data fetch

Use GitHub GraphQL or REST at Astro build time to pull:
- repo name, description, stars, last-commit timestamp, primary language, topics
- for archived / fork flags
- for contribution graph on about page

Cache in `src/data/projects.json`. Rebuild on deploy. Fallback to static data if API fails.

```ts
// src/data/projects.ts — the single source of truth
export const CATEGORIES = [
  { id: 'memory', face: 0, title: 'AGENT MEMORY', repos: ['memd', 'claude-dream'] },
  { id: 'orchestration', face: 1, title: 'AGENT ORCHESTRATION', repos: ['claude-autoresearch', 'AgentShell', 'clawcontrol'] },
  // ...
];
```

Repo metadata pulled at build. Static JSON deployed. Never hit API from client.

## implications for PROJECTS constant

Current `src/pages/index.astro` has a hardcoded `PROJECTS` array with placeholder names (SignalScope, LoomKit, PicoSynth, etc.). **Replace entirely.** Extract to `src/data/projects.ts` with real repo metadata keyed by category.

`public/scene/app.js` imports category structure, builds sub-triangle → repo mapping dynamically. Sphere geodesic subdivision provides enough surface area — at `SUBDIV=3` we have 8 faces × 64 sub-triangles = 512 slots, plenty for 15–20 repos.

## open items

- Confirm `Josue7211` is the primary handle (also seen: `aparcedo`, `bobbyparzero`). Site currently says `@aparcedo` — update if wrong.
- Decide: include archived / old repos or hide? (Alice, cornerstone, spotify-takeover)
- Get contribution activity via GraphQL for the about-page timeline
- Decide docs/ case-study priority order (I recommend: memd → security-sweep → Bjorn → claude-autoresearch as the first 4)
