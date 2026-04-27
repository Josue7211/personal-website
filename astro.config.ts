// astro.config.ts — main cinematic site only.
// Docs notebook lives in docs-site/ (separate Astro project, deployed to docs.aparcedo.org).
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://josue.aparcedo.org',
  integrations: [sitemap()],
})
