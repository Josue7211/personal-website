// docs-site/astro.config.ts
// Starlight-only Astro project. Deployed to docs.aparcedo.org.
// Main cinematic site lives in the parent repo's astro.config.ts.
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import starlight from '@astrojs/starlight'

export default defineConfig({
  site: 'https://docs.aparcedo.org',
  integrations: [
    starlight({
      title: 'Signals & Mind',
      description:
        'A notebook of notes to my future self — signal processing, hardware, and the systems beneath the software I write.',
      logo: { src: './src/assets/docs-logo.svg', replacesTitle: false },
      customCss: ['./src/styles/starlight-theme.css'],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/Josue7211' },
        { icon: 'email', label: 'Email', href: 'mailto:josue@aparcedo.org' },
      ],
      lastUpdated: true,
      pagination: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Readme', link: '/' },
            { label: 'Why this notebook exists', slug: 'why' },
          ],
        },
        {
          label: 'Signals',
          items: [
            { label: 'A slow intro to the FFT', slug: 'signals/fft' },
            { label: 'Windowing, in plain English', slug: 'signals/windowing' },
            { label: 'Why phase matters more than you think', slug: 'signals/phase' },
            {
              label: 'Noise, thermal & otherwise',
              slug: 'signals/noise',
              badge: { text: 'draft', variant: 'caution' },
            },
          ],
        },
        {
          label: 'Hardware',
          items: [
            { label: 'KiCad, my way', slug: 'hardware/kicad' },
            { label: 'PicoSynth build log', slug: 'hardware/picosynth' },
            { label: 'Rust on the iCE40', slug: 'hardware/fpga' },
            { label: 'Soldering without tears', slug: 'hardware/solder' },
          ],
        },
        {
          label: 'Systems',
          items: [
            { label: 'Learning Zig by writing a kernel', slug: 'systems/zig' },
            { label: 'A mental model for memory', slug: 'systems/memory' },
            {
              label: 'Async, synchronously explained',
              slug: 'systems/async',
              badge: { text: 'wip', variant: 'note' },
            },
          ],
        },
        {
          label: 'Off-topic',
          items: [
            { label: 'Metering Portra 400', slug: 'off-topic/portra' },
            { label: 'Books worth rereading', slug: 'off-topic/reading' },
            { label: 'How I take notes', slug: 'off-topic/notes' },
          ],
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/Josue7211/personal-website/edit/main/docs-site/',
      },
    }),
    sitemap(),
  ],
})
