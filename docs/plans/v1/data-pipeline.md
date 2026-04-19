---
name: Data Pipeline — GitHub build-time fetch, projects.ts
phase: cross-cutting (ships in E1, hooks in C1 nameplate "observed" count)
status: ready
last_revised: 2026-04-19
---

# Data Pipeline

## 1. Goal

Single source of truth for project data is `src/data/projects.ts`, rebuilt at build time from GitHub. Never hit GitHub from the client.

## 2. Shape

```ts
// src/data/projects.ts (generated)
export interface Category {
  id: CategoryId
  face: number            // 0..7 on the base octahedron
  title: string           // 'AGENT MEMORY'
  blurb: string           // one-liner for face hover
  repos: string[]         // repo names in priority order
}

export interface Repo {
  name: string            // 'memd'
  slug: string            // 'memd'
  owner: 'Josue7211'
  url: string             // https://github.com/Josue7211/memd
  description: string
  language: string | null
  stars: number
  lastCommit: string      // ISO-8601
  topics: string[]
  archived: boolean
  fork: boolean
  sizeKb: number
  // curated fields (hand-written in overrides.ts):
  tagline?: string
  microExperience?: MicroExperienceId
  sessionTitle?: string   // 'GHOST IN THE SHELL'
  caseStudyPath?: string  // 'docs/case-studies/memd'
}

export type CategoryId =
  | 'agent-memory' | 'agent-orchestration' | 'agent-security'
  | 'homelab-systems' | 'hardware' | 'products' | 'experiments' | 'meta'

export type MicroExperienceId =
  | 'memory-graph' | 'bounty-hunter' | 'autoloop'
  | 'gcode-tracer' | 'faux-terminal' | 'secret-flow'
  | 'dream-sequence' | 'bubble-bridge'

export const CATEGORIES: Category[]
export const REPOS: Record<string, Repo>
```

## 3. Fetch

Script: `scripts/fetch-github.ts` (Node, run at build).

```bash
# .env (build)
GITHUB_TOKEN=ghp_xxx   # read-only, public_repo scope
```

GraphQL query (one request, all needed fields):

```graphql
query ProfileRepos($owner: String!) {
  user(login: $owner) {
    repositories(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
      nodes {
        name
        description
        url
        primaryLanguage { name }
        stargazerCount
        pushedAt
        repositoryTopics(first: 10) { nodes { topic { name } } }
        isArchived
        isFork
        diskUsage
      }
    }
  }
}
```

## 4. Merge with overrides

`scripts/overrides.ts` — hand-curated fields per repo (tagline, microExperience, sessionTitle, caseStudyPath). Generator merges: `{...apiData, ...override}`.

## 5. Output

`src/data/projects.ts` — TypeScript file, imported by:
- `src/pages/index.astro` at build time to seed DOM
- `public/scene/app.js` via a runtime fetch of `/data/projects.json` (also generated)

Two outputs so the plain-JS scene can stay `is:inline` + unbundled.

## 6. Cache + fallback

- `.cache/github.json` committed to repo with the last known good API response (updated by CI)
- if build-time fetch fails (rate limit, network), generator falls back to `.cache/github.json`
- if `.cache/github.json` missing, generator fails loudly (do not ship stale UI silently)

## 7. CI

GitHub Action `build.yml`:

```yaml
- name: Fetch GitHub data
  run: node scripts/fetch-github.mjs
  env:
    GITHUB_TOKEN: ${{ secrets.GH_READONLY }}
- name: Build
  run: npm run build
```

Rebuild nightly via scheduled workflow so star counts and lastCommit stay fresh.

## 8. Initial seed (manual, before CI)

Run once locally:

```bash
GITHUB_TOKEN=<token> node scripts/fetch-github.mjs
git add .cache/github.json src/data/projects.ts public/data/projects.json
git commit -m "data: seed initial github fetch"
```

## 9. Privacy

- only public repos are fetched
- archived repos included but flagged; UI may hide them
- email addresses in commit data are not pulled
- no tokens in the bundle

## 10. Contribution graph (about page)

Separate GraphQL query, same script:

```graphql
query ContribGraph($login: String!, $from: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from) {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date color contributionCount } }
      }
    }
  }
}
```

Output: `src/data/contribs.json`. Consumed by the about page spark-grid.
