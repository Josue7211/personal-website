// Starlight-only Astro project. Deployed to docs.aparcedo.org.
// Main cinematic site lives in the parent repo's astro.config.ts.
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import starlight from '@astrojs/starlight'

export default defineConfig({
  site: 'https://docs.aparcedo.org',
  integrations: [
    starlight({
      title: 'JOSUE / DOCS',
      description:
        'Project docs for agent tooling, Claude Code workflows, and homelab systems.',
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
          label: 'Overview',
          items: [
            { label: 'Overview', link: '/' },
            { label: 'About these docs', slug: 'about' },
          ],
        },
        {
          label: 'Agent stack',
          items: [
            {
              label: 'memd',
              items: [
                { label: 'Overview', slug: 'agent-stack/memd/overview' },
                { label: 'Memory model', slug: 'agent-stack/memd/memory-model' },
                { label: 'Runtime workflow', slug: 'agent-stack/memd/runtime-workflow' },
              ],
            },
            {
              label: 'AgentSecrets',
              items: [
                { label: 'Overview', slug: 'agent-stack/agentsecrets/overview' },
                { label: 'Security model', slug: 'agent-stack/agentsecrets/security-model' },
                { label: 'Request flow', slug: 'agent-stack/agentsecrets/request-flow' },
              ],
            },
            {
              label: 'AgentShell',
              items: [
                { label: 'Overview', slug: 'agent-stack/agentshell/overview' },
                { label: 'Command lifecycle', slug: 'agent-stack/agentshell/command-lifecycle' },
                { label: 'Permission model', slug: 'agent-stack/agentshell/permission-model' },
              ],
            },
            {
              label: 'claw control',
              items: [
                { label: 'Overview', slug: 'agent-stack/claw-control/overview' },
                { label: 'Control surface', slug: 'agent-stack/claw-control/control-surface' },
                { label: 'Run state model', slug: 'agent-stack/claw-control/run-state-model' },
              ],
            },
          ],
        },
        {
          label: 'Claude Code skills',
          items: [
            { label: 'security-sweep', slug: 'claude-code-skills/security-sweep' },
            { label: 'claude-dream', slug: 'claude-code-skills/claude-dream' },
            { label: 'claude-autoresearch', slug: 'claude-code-skills/claude-autoresearch' },
            { label: 'claude-sync', slug: 'claude-code-skills/claude-sync' },
          ],
        },
        {
          label: 'Homelab',
          items: [
            { label: 'Topology', slug: 'homelab/topology' },
            { label: 'Cloudflare tunnels', slug: 'homelab/cloudflare-tunnels' },
            { label: 'homelab-cli', slug: 'homelab/homelab-cli' },
            { label: 'mac-bridge', slug: 'homelab/mac-bridge' },
            { label: 'Security model', slug: 'homelab/security-model' },
            { label: 'How this site is deployed', slug: 'homelab/deployment' },
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
