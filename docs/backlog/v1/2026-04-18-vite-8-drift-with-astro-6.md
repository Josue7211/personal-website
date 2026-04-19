---
title: Astro 6 currently resolves Vite 8 instead of the expected Vite 7 line
severity: high
status: open
opened: 2026-04-18
version: v1
phase: B1
---

# Astro 6 currently resolves Vite 8 instead of the expected Vite 7 line

## Why this matters

The local dev server warns that Astro 6 expects Vite 7, but this repo currently resolves Vite 8. That creates avoidable toolchain uncertainty right before scroll and animation infrastructure work.

## Evidence

- `npm run dev -- --host 127.0.0.1`
- Astro warning: add `"overrides": { "vite": "^7" }` to `package.json`

## Desired fix

Pin the repo to the Vite 7 line Astro expects and verify dev/build still pass cleanly.
