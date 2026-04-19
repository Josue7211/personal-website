---
name: E1 — Shot 02 Work + Project Micro-Experiences
phase: E1
status: ready
last_revised: 2026-04-19
---

# E1 — Shot 02 + Micro-Experiences

Target: ~3.5 weeks (1.5w work scaffold + 2w flagship micro-experiences).

## 1. SHOT 02 layout

```
[SessionCard variant B] → 900ms hold, hard cut →
[work scene]
  - sphere centered
  - face-centroid labels (nous mono)
  - face hover halo + category name
  - double-click or Enter → facet unfold
  - J/K = next/prev category
  - drag = spin
```

### Face-centroid labels

Rendered as HTML (not WebGL) projected to screen space each frame.

```
[ 01 ] · AGENT MEMORY · 2 systems
```

Label style:
- mono, `--text-xs`, `--color-ink-dim`
- left-aligned from label anchor
- shows on hover of face; always shown for active face
- ~120ms fade in/out

## 2. Facet unfold

Interaction:

1. user double-clicks face
2. face detaches, unfolds flat toward camera (rotates around its shared edge with adjacent face, then translates forward)
3. behind: the micro-experience for that category
4. other sphere dims to 12% opacity, blurs 8px
5. close button (top-right) folds face back

Animation: 720ms on `--ease-long`. Reverse on close.

### Multi-repo category

If category has multiple repos (Agent Memory: memd + claude-dream), unfolded face shows a **grid of sub-triangles**, each labeled with repo name. Click sub-triangle → repo micro-experience.

For categories with one repo, skip the grid and go straight to micro-experience.

## 3. Micro-experience implementations (flagships)

### 3.1 memd — `GHOST IN THE SHELL`

- live memory-graph visualization
- nodes = memories (dummy dataset for V1, tagged `fact | decision | preference | checkpoint`)
- edges = references (directed)
- force-directed layout (d3-force)
- drag nodes; double-click node → expands its content panel
- legend bottom-left
- 2d canvas render (cheaper than WebGL, matches the panel context)

Assets needed: 1 demo dataset `public/data/memd-demo.json` (40 nodes, 60 edges, hand-authored)

### 3.2 security-sweep — `BOUNTY HUNTER`

- 19 agent badges in a 5×4 grid (one empty slot)
- each badge: ID, name, tier (1 or 2), role
- hover badge: flip animation (CSS `preserve-3d`), back shows sample finding
- click: pinned detail panel with scrollable findings list (mock data, static)

Assets: 19 role icons (SVG, hand-drawn minimal)

### 3.3 claude-autoresearch — `THE REAL FOLK BLUES`

- loop diagram auto-plays: research → plan → execute → verify → rest → loop
- 5 nodes arranged in a pentagon
- animated glow moves node-to-node every 1.2s on `--ease-long`
- active node shows a short log line of fake activity
- pause/play controls
- mock phase log scroll below

## 4. Non-flagship micro-experiences (stubs in E1, finished in G1)

| repo | stub content for E1 |
|------|---------------------|
| Bjorn | session card + SVG G-code tracer placeholder + photos |
| homelab-cli | session card + text "16 CLIs" + static list + screenshot |
| AgentSecrets | session card + flowchart SVG static |
| claude-dream | session card + concept diagram |
| mac-bridge | session card + API endpoint list |

## 5. Data binding

- `src/data/projects.ts` generated per [[docs/plans/v1/data-pipeline.md]]
- Astro component `<ProjectDrawer repoSlug="memd" />` reads data and mounts the right micro-experience
- micro-experience components lazy-loaded via dynamic import (`client:visible`)

## 6. About section update

Copy changes:
- nameplate tagline → `building tools for autonomous agents & the systems they run on`
- about-body paragraphs → thesis-aligned
- handle → `@Josue7211`
- email → decided per ROADMAP decision #3

## 7. Files

```
src/components/work/
  FaceLabel.astro         NEW  screen-space projected label
  CategoryGrid.astro      NEW  sub-triangle grid for multi-repo categories
  ProjectDrawer.astro     NEW  drawer shell
src/components/experiences/
  MemoryGraph.astro       NEW  memd
  MemoryGraph.ts          NEW  force-directed logic
  BountyHunter.astro      NEW  security-sweep
  RealFolkBlues.astro     NEW  claude-autoresearch
  HeavyMetalQueen.astro   STUB Bjorn
  WaltzForVenus.astro     STUB homelab-cli
  JupiterJazz.astro       STUB AgentSecrets
  SympathyForTheDevil.astro STUB claude-dream
  StrayDogStrut.astro     STUB mac-bridge
src/scene/three/
  FacetUnfold.ts          NEW  unfold animation + state
  CategoryLabels.ts       NEW  per-face projection logic
public/data/
  memd-demo.json          NEW
  bounty-hunter.json      NEW
scripts/
  fetch-github.mjs        NEW  per data-pipeline.md
  overrides.ts            NEW  per data-pipeline.md
src/data/
  projects.ts             GEN  generated
```

## 8. Build order

1. data pipeline + projects.ts end-to-end (2d)
2. face-centroid labels (1d)
3. facet unfold animation (2d)
4. ProjectDrawer shell (1d)
5. memd memory-graph (2d)
6. security-sweep bounty-hunter (2d)
7. claude-autoresearch loop (2d)
8. 5 stub micro-experiences (2d, parallel)
9. about section copy update (0.5d)
10. handle + email sweep (0.5d)
11. J/K keyboard shortcuts (0.5d)
12. verification + screenshots (1.5d)

## 9. Verification checklist

- [ ] projects.ts generated with real github data, including stars + lastCommit
- [ ] fallback cache path works when `gh api` throttles
- [ ] all 8 category faces show labels on hover
- [ ] facet unfold works for every face including diagonal ones
- [ ] multi-repo category (Agent Memory) shows sub-triangle grid
- [ ] all 3 flagship micro-experiences visually match spec
- [ ] 5 stubs present with session card + static content
- [ ] about copy matches thesis; `@Josue7211` everywhere; email is the chosen one
- [ ] `J`/`K` cycle faces
- [ ] no console errors; fetch-github script doesn't leak token

## 10. Risks

- Multi-repo category UX — sub-triangle grid may feel cramped; mitigate with generous hover
- memd graph performance with larger datasets later — keep to 40 nodes in V1
- Facet unfold on non-equilateral sub-triangles (geodesic subdivisions aren't all equilateral at subdivision 3) — may need per-face calibration
