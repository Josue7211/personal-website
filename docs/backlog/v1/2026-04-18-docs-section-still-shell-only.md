---
title: Docs section is still shell-only with no real content system or navigation
severity: high
status: open
opened: 2026-04-18
version: v1
phase: F1
---

# Docs section is still shell-only with no real content system or navigation

## Why this matters

The product promise includes a real knowledge base, but the current docs area is only a layout shell with no collections, navigation tree, search, or sample guides.

## Evidence

- `src/layouts/DocsLayout.astro` is still a minimal shell
- `src/pages/docs/index.astro` is only a placeholder landing page

## Desired fix

Build the real docs IA: content collections, sidebar navigation, guide pages, search, and mobile behavior.
