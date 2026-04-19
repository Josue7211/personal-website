---
name: About Page — content and layout
phase: cross-cutting (ships in E1, refined in G1)
status: ready
last_revised: 2026-04-19
---

# About Page

## 1. Scope

This is the content that lives inside SHOT 03 beat 5 and stays visible after the dive lands. It is one long vertical panel, not a separate route.

## 2. Layout (desktop, 1440w)

```
╭──────────────────────────────────── sphere ghost 12% opacity, behind ────────────────────────────────────╮

    [SESSION 02 · BALLAD OF ORIGIN]                                          [stats aside ─→]
                                                                             ── Now
    Notes on me.                                                             FSW · AA Computer Eng.
    ───────                                                                  sophomore · Fall '26
                                                                             Transfer → UCF
    [body paragraph 1 — thesis, 2 lines]                                     Fort Myers, FL
                                                                             eastern time
    [body paragraph 2 — what I build right now]
                                                                             ── Looking for
    [body paragraph 3 — call to action / hiring]                             SWE internship   summer '26
                                                                             HW / firmware    fall '26
    [CV button — download PDF]                                               cool people      always

    [contribution graph — github spark-grid, last 180 days]                  ── Reach me
                                                                             bobbyparzero@gmail.com
                                                                             @Josue7211
                                                                             /in/aparcedo

╰──────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

Content width: 560px. Aside: 300px. Gap: 96px. Combined max 1000px centered.

## 3. Copy (authoritative)

```
Notes on me.

I'm Josue Aparcedo — a Computer Engineering student at Florida SouthWestern,
transferring to UCF in Fall '26.

I build tools for autonomous agents and the homelab systems they live on:
memory, orchestration, secrets, red-team scanning. The occasional soldering
iron too — see Bjorn.

Right now I'm looking for SWE / firmware internships for summer and fall '26.
If you're hiring, say hi.

[ RESUME / CV — Download PDF ↓ ]
```

## 4. Stats aside (mono)

```
── Now
FSW · AA Computer Eng.          sophomore · Fall '26
Transfer → UCF                  also FGCU / FIU
Based in Fort Myers, FL         eastern time

── Looking for
SWE internship                  summer '26
Hardware / firmware             fall '26
Cool people to build with       always

── Reach me
bobbyparzero@gmail.com          email
@Josue7211                      github
/in/aparcedo                    linkedin
```

Email row is the ROADMAP-decided email. Update one place, updates both here and in contact section.

## 5. Contribution graph

Sub-component below the main body.

- data from GitHub GraphQL (see data-pipeline.md §10)
- 180 days shown, 7 days per week
- cell size 10×10px, gap 2px, total ~180×80px
- color ramp: `--color-border-soft` → `--color-violet-prime` in 5 steps
- hover cell: tooltip with date + count
- clicks: no-op (decorative)

## 6. Mobile

- single column
- aside collapses below body
- contribution graph shrinks to 30 days
- CV button full-width

## 7. Reveal timing

Entering from the dive (beat 4 → beat 5):

- `Notes on me.` serif stagger (per d1-dive.md §7)
- body paragraphs type-in (30 char/s) starting at beat 4 progress 0.82
- stats aside slides R→L 480ms at beat 4 progress 0.88
- contribution graph fades in 600ms at beat 5 progress 0.4
- CV button pulses once on first reveal

## 8. Files

```
src/components/about/
  AboutSection.astro        NEW  whole layout
  StatsAside.astro          NEW
  ContribGraph.astro        NEW  + .ts
  CvButton.astro            NEW
src/data/
  contribs.json             GEN  from data pipeline
public/
  resume/josue-aparcedo-2026.pdf  NEW  actual resume
```

## 9. Verification

- [ ] copy matches authoritative block above
- [ ] contribution graph shows realistic last-180-days data
- [ ] CV PDF actually downloads, < 1MB
- [ ] reveal timing matches spec on first scroll-in
- [ ] scrolling up + back re-triggers reveal with zero flash
- [ ] email consistent with contact section
