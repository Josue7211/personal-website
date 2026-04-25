// astro.config.ts — main cinematic site only.
// Docs notebook lives in docs-site/ (separate Astro project, deployed to docs.josue.aparcedo.org).
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://josue.aparcedo.org',
  integrations: [sitemap()],
  vite: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins: [tailwindcss() as any],
  },
})
