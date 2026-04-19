---
phase: G1
name: End Card + Audio + Polish + Deploy
version: v1
status: pending
depends_on:
  - B1
  - C1
  - D1
  - E1
  - F1
backlog_items: []
---

# Phase G1: End Card + Audio + Polish + Deploy

## Goal

Close the film, wire the sound engine, sweep a11y and mobile, hit perf budgets, ship.

## Deliver

- END CARD shot: `SEE YOU SPACE COWBOY...` composition per [[docs/plans/cinematic-treatment.md#end-card-see-you-space-cowboy]]
- Sound engine per [[docs/plans/v1/sound-spec.md]]:
  - muted default, prominent amber unmute
  - Spotify embed (tier 2) feeds ticker via Spotify Web API
  - original CC stings + vinyl crackle at session-card cuts (tier 3)
  - ambient 40Hz sub when unmuted
  - ducking hooks consumed by SHOT 03
- Complete five non-flagship micro-experiences (Bjorn, homelab-cli, AgentSecrets, claude-dream, mac-bridge)
- Cursor states finalized
- `⌘K` command palette + `?` shortcut overlay
- Mobile per-shot adaptations locked + verified
- Reduced-motion + noJS + noWebGL verified
- Performance budgets: FCP < 1.5s on 4G, LCP < 2.5s, 60fps dive on integrated GPU
- Lighthouse: perf ≥ 90 home, ≥ 95 docs; a11y ≥ 95; best-practices 100
- SEO meta + OG image + sitemap + robots
- 404 on-theme
- Deploy (Cloudflare Pages or equivalent)

## Pass Gate

- cinematic-treatment non-negotiables (§15) satisfied in production
- all degradation paths work in production
- perf budgets met on a real 4G throttled run
- audio engine passes a blind "does this feel bebop" QA pass
- site submitted to Awwwards / godly / siteinspire

## Detailed Plan

See [[docs/plans/v1/g1-endcard-audio-polish.md]].
