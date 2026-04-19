---
phase: F1
name: Shot 04 Transmit + Docs Section
version: v1
status: pending
depends_on:
  - B1
  - C1
backlog_items:
  - "2026-04-18-docs-section-still-shell-only"
---

# Phase F1: Shot 04 Transmit + Docs Section

## Goal

Close the homepage film with the transmitter contact shot, and turn the docs shell into a real public knowledge base. Both ship together because they share typography + shell.

## Deliver

- SHOT 04 transmitter UI per [[docs/plans/cinematic-treatment.md#shot-04-the-transmission-contact]]
- Contact form fields `TO` / `FROM` / `MESSAGE`
- Handshake animation `SYN → SYN-ACK → ACK → queued → delivered` (1.2s total)
- Form submission path: minimal serverless endpoint OR `mailto:` fallback for V1 (decision in detailed plan)
- Docs content collection: `src/content/docs/` with schema (title, slug, category, repo, published, summary)
- Docs IA: sidebar nav, sections per flagship case study + essays index
- Docs search: client-side (Pagefind vs Fuse — decided in detailed plan)
- Docs reading shell: aesthetic pick per ROADMAP open decision #5
- Mobile docs nav: drawer + reachable search
- Docs bundle stays free of Three.js per project CLAUDE.md

## Pass Gate

- contact form submits; handshake animation runs; success state holds
- at least three real case studies published (memd, security-sweep, Bjorn)
- docs search returns < 100ms on a populated index
- keyboard nav works across sidebar
- docs pages do not load the immersive stack
- mobile docs usable; reduced-motion respected
- no console errors; lighthouse docs perf ≥ 95

## Detailed Plan

See [[docs/plans/v1/f1-transmit-and-docs.md]].
