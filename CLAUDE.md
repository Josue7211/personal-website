<!-- memd-managed:claude-import:start -->
@.memd/agents/CLAUDE_IMPORTS.md
<!-- memd-managed:claude-import:end -->

**Personal Website — josue.aparcedo.org**
Immersive Astro portfolio site with a cinematic main experience and a separate docs/knowledge-base section.

- `memd` is the project memory source of truth. Do not recreate `.planning` or GSD workflow files.
- Status: foundation-only scaffold exists; immersive feature work is still ahead.
- Stack: Astro 6, Tailwind v4 via `@tailwindcss/vite`, GSAP, Lenis, Three.js.
- Keep docs lightweight; avoid loading the immersive stack there unless needed.
- Preserve graceful degradation, especially for docs and reduced-motion behavior.
- NAS builds may need temporary cache/output under `/tmp/personal-website-target`.
- Design reference: [docs/superpowers/specs/2026-03-30-personal-website-design.md](docs/superpowers/specs/2026-03-30-personal-website-design.md)
- Work inside `src/layouts`, `src/pages`, and `src/styles`.
