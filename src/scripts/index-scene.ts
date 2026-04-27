import Lenis from 'lenis'

import { createGuidedRailController } from '../scene/guided-rail/controller'

type Project = {
  id: string
  num: string
  title: string
  tags: string[]
  desc: string
  problem: string
  built: string
  impact: string
  meta: Array<[string, string]>
  url: string
}

type QuickLink = {
  face: number
  bary: [number, number, number]
  href: string
  label: string
  kicker: string
}

type Scene3DInstance = {
  setMode(mode: 'hero' | 'work' | 'past'): void
  setScrollProg(progress: number): void
  setAboutProg(progress: number): void
  getFaceScreenPos(index: number): {
    x: number
    y: number
    visible: boolean
    facing: number
  } | null
  getHoveredFace(): unknown
  getFaceMeshes(): unknown[]
  setHoveredFace(index: number | null): void
  setPaused(paused: boolean): void
  getActiveProjectIndex(): number | null
  getFaceScreenBasis(
    face: number
  ): {
    visible: boolean
    facing: number
    ux: number
    uy: number
    vx: number
    vy: number
    ox: number
    oy: number
  } | null
  getSubFacetBasis(
    face: number,
    a: number,
    b: number,
    c: number
  ): {
    visible: boolean
    facing: number
    ux: number
    uy: number
    vx: number
    vy: number
    ox: number
    oy: number
  } | null
}

const PROJECTS: Project[] = [
  {
    id: 'memd',
    num: '001 / 2026',
    title: 'memd',
    tags: ['RUST', 'AGENTS', 'MEMORY'],
    desc: 'Memory and retrieval control plane for LLM coding agents. Repo-scoped wake files, lookup, checkpoints, and handoffs.',
    problem: 'Long agent sessions lose decisions, corrections, and project context when the transcript gets compacted or a tool changes.',
    built: 'A Rust CLI and file-backed memory layer with wake files, semantic lookup, checkpoints, and repo-level state.',
    impact: 'Turns scattered session history into durable project context that can survive handoffs and long implementation runs.',
    meta: [['Stack', 'Rust'], ['Role', 'Creator'], ['Surface', 'CLI + memory store']],
    url: 'https://github.com/Josue7211/memd',
  },
  {
    id: 'security-sweep',
    num: '002 / 2026',
    title: 'security-sweep',
    tags: ['SECURITY', 'AGENTS', 'RED-TEAM'],
    desc: 'Multi-pass security review workflow for Claude Code projects. Threat modeling, dependency checks, secret scanning, and exploit-minded review.',
    problem: 'AI-assisted code still needs adversarial review; generic linting misses design flaws, unsafe defaults, and workflow leaks.',
    built: 'A tiered audit system that assigns focused review passes across secrets, dependencies, auth, data handling, and deployment risk.',
    impact: 'Makes security review repeatable enough to run before shipping instead of waiting for a post-launch scramble.',
    meta: [['Agents', '19'], ['Role', 'Creator'], ['Focus', 'Security review']],
    url: 'https://github.com/Josue7211/security-sweep',
  },
  {
    id: 'claude-autoresearch',
    num: '003 / 2026',
    title: 'claude-autoresearch',
    tags: ['SHELL', 'AGENTS', 'LOOP'],
    desc: 'Autonomous overnight improvement loop for Claude Code. Runs research, captures findings, and resumes with useful context.',
    problem: 'Research loops stall when they depend on a person babysitting every prompt, checkpoint, and restart.',
    built: 'Shell automation for repeated research passes, capture files, resumable context, and next-step handoff notes.',
    impact: 'Converts idle machine time into structured investigation work that is ready to review the next morning.',
    meta: [['Stack', 'Shell'], ['Role', 'Creator'], ['Mode', 'Research loop']],
    url: 'https://github.com/Josue7211/claude-autoresearch',
  },
  {
    id: 'bjorn',
    num: '004 / 2025',
    title: 'Bjorn',
    tags: ['HARDWARE', '3D-PRINT', 'FIRMWARE'],
    desc: 'Modified Ender 3 V2 NEO build: firmware, slicer profiles, mechanical changes, and calibration notes.',
    problem: 'Stock hobby printers hit limits fast: inconsistent motion, narrow material range, and tuning that does not transfer.',
    built: 'Firmware changes, slicer profiles, mechanical upgrades, and repeatable calibration notes for higher-speed material experiments.',
    impact: 'Shows hardware debugging in the real world: thermals, motion, materials, tolerances, and failure analysis.',
    meta: [['Base', 'Ender 3 V2 NEO'], ['Role', 'Firmware + mods'], ['Focus', 'High-speed materials']],
    url: 'https://github.com/Josue7211/Bjorn',
  },
  {
    id: 'homelab-cli',
    num: '005 / 2025',
    title: 'homelab-cli',
    tags: ['SHELL', 'INFRA', 'SELF-HOSTED'],
    desc: 'Sixteen Bash CLIs for operating a self-hosted stack: media, DNS, containers, downloads, and service recovery.',
    problem: 'Homelab services sprawl into too many dashboards, ports, log locations, and manual recovery steps.',
    built: 'Focused terminal commands for Sonarr, Radarr, Plex, AdGuard, qBittorrent, Portainer, and related service checks.',
    impact: 'Makes the homelab easier to operate under pressure because common fixes become explicit commands.',
    meta: [['CLIs', '16'], ['Stack', 'Shell'], ['Focus', 'Homelab ops']],
    url: 'https://github.com/Josue7211/homelab-cli',
  },
  {
    id: 'agentsecrets',
    num: '006 / 2026',
    title: 'AgentSecrets',
    tags: ['RUST', 'SECURITY', 'SECRETS'],
    desc: 'Self-hosted secret broker for agent workflows: masked responses, human approval, and audit trails.',
    problem: 'Agent workflows often need credentials, but putting raw secrets in prompts or logs is the wrong boundary.',
    built: 'A Rust broker that mediates secret requests, masks returned values, asks for approval, and records sensitive access.',
    impact: 'Keeps credential use explicit and auditable while still letting automation complete real tasks.',
    meta: [['Stack', 'Rust'], ['Role', 'Creator'], ['Focus', 'Secret broker']],
    url: 'https://github.com/Josue7211/AgentSecrets',
  },
  {
    id: 'claude-dream',
    num: '007 / 2026',
    title: 'claude-dream',
    tags: ['SHELL', 'AGENTS', 'MEMORY'],
    desc: 'Memory consolidation skills for Claude Code. Session recap, durable lessons, and carry-forward notes.',
    problem: 'Useful corrections and lessons disappear unless they are converted into a compact memory artifact.',
    built: 'Shell skills that summarize session state, extract reusable lessons, and write carry-forward notes for future work.',
    impact: 'Cuts repeated mistakes by making important session knowledge available after the chat is gone.',
    meta: [['Stack', 'Shell'], ['Role', 'Creator'], ['Focus', 'Memory consolidation']],
    url: 'https://github.com/Josue7211/claude-dream',
  },
  {
    id: 'mac-bridge',
    num: '008 / 2025',
    title: 'mac-bridge',
    tags: ['JAVASCRIPT', 'MACOS', 'INFRA'],
    desc: 'REST bridge for macOS services: Reminders, Notes, Contacts, Find My, and Messages over Tailscale.',
    problem: 'macOS apps hold useful personal data, but they are awkward to automate safely from remote machines.',
    built: 'A small JavaScript service that exposes selected local actions over a private Tailscale network.',
    impact: 'Turns a Mac into a controlled automation endpoint without exposing personal services to the public internet.',
    meta: [['Stack', 'JavaScript'], ['Transport', 'Tailscale'], ['Focus', 'macOS bridge']],
    url: 'https://github.com/Josue7211/mac-bridge',
  },
  {
    id: 'agent-shell',
    num: '009 / 2026',
    title: 'AgentShell',
    tags: ['RUST', 'AGENTS', 'TERMINAL'],
    desc: 'Rust agent shell project for local automation experiments and command-oriented agent workflows.',
    problem: 'Agent tooling needs a controlled execution surface that is closer to a real terminal than a toy prompt loop.',
    built: 'A Rust codebase focused on shell-style agent operation, local control boundaries, and repeatable command execution.',
    impact: 'Explores the interface between autonomous agents and the operating system where most real developer work happens.',
    meta: [['Stack', 'Rust'], ['Role', 'Creator'], ['Focus', 'Agent shell']],
    url: 'https://github.com/Josue7211/AgentShell',
  },
  {
    id: 'cornerstone',
    num: '010 / 2026',
    title: 'cornerstone',
    tags: ['JAVASCRIPT', 'OS', 'AI'],
    desc: 'AI 98 OS experiment: a desktop-inspired interface for agentic workflows and personal computing ideas.',
    problem: 'Most AI tools live as chat boxes instead of operating environments with persistent state, windows, and workflows.',
    built: 'A JavaScript interface prototype that treats agent work like an operating system surface instead of a single panel.',
    impact: 'Pushes portfolio work beyond utility scripts into product-shaped interface exploration.',
    meta: [['Stack', 'JavaScript'], ['Role', 'Creator'], ['Focus', 'AI OS']],
    url: 'https://github.com/Josue7211/cornerstone',
  },
  {
    id: 'clawcontrol',
    num: '011 / 2026',
    title: 'clawcontrol',
    tags: ['TYPESCRIPT', 'TOOLS', 'CONTROL'],
    desc: 'TypeScript control surface for Claude/agent workflow experiments.',
    problem: 'Agent workflows need more direct controls for running, watching, and steering background work.',
    built: 'A TypeScript project exploring operator controls and workflow surfaces for agent-assisted development.',
    impact: 'Adds a product layer around raw automation so agent work becomes easier to supervise.',
    meta: [['Stack', 'TypeScript'], ['Role', 'Creator'], ['Focus', 'Agent control']],
    url: 'https://github.com/Josue7211/clawcontrol',
  },
  {
    id: 'claude-sync',
    num: '012 / 2026',
    title: 'claude-sync',
    tags: ['SHELL', 'SYNC', 'HOMELAB'],
    desc: 'Sync Claude Code config through Syncthing and project mounts through NAS paths without SSH dependency.',
    problem: 'Working across machines gets messy when config, projects, and local agent setup drift apart.',
    built: 'Shell automation for syncing Claude Code config and project access across a local/self-hosted workflow.',
    impact: 'Keeps multi-machine development usable without turning every setup step into manual dotfile surgery.',
    meta: [['Stack', 'Shell'], ['Transport', 'Syncthing'], ['Focus', 'Config sync']],
    url: 'https://github.com/Josue7211/claude-sync',
  },
  {
    id: 'spotify-takeover',
    num: '013 / 2026',
    title: 'spotify-takeover',
    tags: ['MUSIC', 'CROSS-PLATFORM', 'APP'],
    desc: 'Cross-platform music app concept for iOS, Linux, macOS, and Windows.',
    problem: 'Music ownership and playback workflows often split between closed services, local libraries, and separate devices.',
    built: 'An app experiment aimed at unifying music playback across desktop and mobile platforms.',
    impact: 'Shows product thinking around daily-use media software instead of only developer tooling.',
    meta: [['Surface', 'Cross-platform app'], ['Role', 'Creator'], ['Focus', 'Music']],
    url: 'https://github.com/Josue7211/spotify-takeover',
  },
  {
    id: 'sunshine-detailing',
    num: '014 / 2024',
    title: 'SunshineDetailing',
    tags: ['TYPESCRIPT', 'BUSINESS', 'BOOKING'],
    desc: 'Business website for booking appointments and presenting auto detailing services.',
    problem: 'Small service businesses need a clean web presence that converts visitors into scheduled work.',
    built: 'A TypeScript website with booking-oriented content and customer-facing service structure.',
    impact: 'Grounds the portfolio in practical client-style web work, not only personal tooling.',
    meta: [['Stack', 'TypeScript'], ['Role', 'Builder'], ['Surface', 'Business site']],
    url: 'https://github.com/Josue7211/SunshineDetailing',
  },
  {
    id: 'business-dashboard',
    num: '015 / 2023',
    title: 'business-dashboard',
    tags: ['JAVASCRIPT', 'DASHBOARD', 'FINANCE'],
    desc: 'Client and financial dashboard with real-time updates for business management.',
    problem: 'Operational data becomes hard to act on when client records, financial views, and status updates are split apart.',
    built: 'A JavaScript dashboard focused on secure client views, financial information, and business update flows.',
    impact: 'Shows early full-stack product thinking around internal tools and business operations.',
    meta: [['Stack', 'JavaScript'], ['Role', 'Builder'], ['Surface', 'Dashboard']],
    url: 'https://github.com/Josue7211/business-dashboard',
  },
  {
    id: 'alice',
    num: '016 / 2023',
    title: 'Alice',
    tags: ['ASSISTANT', 'AUTOMATION', 'AI'],
    desc: 'Personal virtual assistant project exploring automation, helper workflows, and user-facing assistant behavior.',
    problem: 'Useful personal assistants need to connect real tasks, context, and commands instead of staying as demos.',
    built: 'An assistant experiment around task handling, automation surfaces, and personal workflow support.',
    impact: 'Connects older assistant ideas to the newer agent tooling direction across the portfolio.',
    meta: [['Role', 'Creator'], ['Surface', 'Assistant'], ['Focus', 'Automation']],
    url: 'https://github.com/Josue7211/Alice',
  },
  {
    id: 'personal-website',
    num: '017 / 2026',
    title: 'personal-website',
    tags: ['ASTRO', 'PORTFOLIO', 'DESIGN'],
    desc: 'Cinematic Astro portfolio with a 3D project orb, resume surface, contact links, and separate docs integration.',
    problem: 'A normal portfolio grid would undersell the mix of systems, agent tooling, hardware, and design work.',
    built: 'An Astro site with custom Three.js interaction, responsive sections, social metadata, and deploy-focused polish.',
    impact: 'Makes the portfolio itself a proof-of-work project instead of a wrapper around the projects.',
    meta: [['Stack', 'Astro + Three.js'], ['Role', 'Creator'], ['Surface', 'Portfolio']],
    url: 'https://github.com/Josue7211/personal-website',
  },
  {
    id: 'docs',
    num: '018 / 2026',
    title: 'docs',
    tags: ['MDX', 'NOTES', 'KNOWLEDGE'],
    desc: 'docs.aparcedo.org source: a separate MDX notes site for systems, signals, hardware, and off-topic writing.',
    problem: 'Portfolio pages and durable technical notes want different structures, URLs, and reading experiences.',
    built: 'A standalone docs site with MDX content, topic sections, and deployment wiring for docs.aparcedo.org.',
    impact: 'Keeps long-form learning material out of the portfolio while still making it easy to find.',
    meta: [['Stack', 'MDX'], ['Domain', 'docs.aparcedo.org'], ['Focus', 'Knowledge base']],
    url: 'https://github.com/Josue7211/docs',
  },
]

const QUICK_LINKS: QuickLink[] = [
  { face: 2, bary: [1, 0, 0], href: '#about', label: 'About', kicker: '-> me' },
  { face: 4, bary: [0, 1, 0], href: 'https://docs.aparcedo.org', label: 'Docs', kicker: '-> docs site' },
  { face: 6, bary: [0, 0, 1], href: '#contact', label: 'Contact', kicker: '-> say hi' },
]

const TWEAK_DEFAULTS = {
  typeVibe: 'serif-sans',
  accent: 'default',
} as const

const PAGE_LABELS = ['Top', 'Work', 'About', 'Contact'] as const

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function smoothProgress(value: number) {
  const t = clamp01(value)
  return t * t * t * (t * (t * 6 - 15) + 10)
}

function cinematicEase(value: number) {
  const t = clamp01(value)
  return 1 - Math.pow(1 - t, 3)
}

function mountLenis(lenis: Lenis | null) {
  if (!lenis) return

  const raf = (time: number) => {
    lenis.raf(time)
    window.requestAnimationFrame(raf)
  }

  window.requestAnimationFrame(raf)
}

function getScrollY(lenis: Lenis | null) {
  return lenis ? lenis.animatedScroll : window.scrollY
}

function getScrollRect(element: HTMLElement | null, scrollY: number) {
  if (!element) return null

  const rect = element.getBoundingClientRect()
  const scrollDelta = window.scrollY - scrollY

  return {
    top: rect.top + scrollDelta,
    bottom: rect.bottom + scrollDelta,
    height: rect.height,
  }
}

function getDocumentMaxScroll() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
}

function clampScrollTarget(value: number) {
  return Math.max(0, Math.min(getDocumentMaxScroll(), value))
}

function getSectionTop(element: HTMLElement, offsetVh = 0) {
  return clampScrollTarget(
    window.scrollY + element.getBoundingClientRect().top - window.innerHeight * offsetVh
  )
}

function getContentCenterTarget(element: HTMLElement, selectors: string[]) {
  const rootTop = window.scrollY + element.getBoundingClientRect().top
  const bounds = selectors
    .map((selector) => element.querySelector<HTMLElement>(selector))
    .filter((child): child is HTMLElement => child instanceof HTMLElement)
    .map((child) => {
      return {
        top: rootTop + child.offsetTop,
        bottom: rootTop + child.offsetTop + child.offsetHeight,
      }
    })

  if (bounds.length === 0) {
    return clampScrollTarget(rootTop + element.offsetHeight / 2 - window.innerHeight / 2)
  }

  const top = Math.min(...bounds.map((bound) => bound.top))
  const bottom = Math.max(...bounds.map((bound) => bound.bottom))

  return clampScrollTarget((top + bottom) / 2 - window.innerHeight / 2)
}

function nearestIndex(values: number[], current: number) {
  return values.reduce((bestIndex, value, index) => {
    const bestDistance = Math.abs(values[bestIndex] - current)
    const distance = Math.abs(value - current)
    return distance < bestDistance ? index : bestIndex
  }, 0)
}

function getSnapTiming(fromIndex: number, toIndex: number) {
  const key = `${fromIndex}-${toIndex}`
  const timings: Record<string, { duration: number; lockMs: number }> = {
    '0-1': { duration: 0.82, lockMs: 940 },
    '1-2': { duration: 0.9, lockMs: 1040 },
    '2-3': { duration: 0.82, lockMs: 940 },
    '1-0': { duration: 0.76, lockMs: 880 },
    '2-1': { duration: 0.84, lockMs: 980 },
    '3-2': { duration: 0.78, lockMs: 900 },
  }

  return timings[key] ?? { duration: 0.82, lockMs: 940 }
}

export default function initIndexScene() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  if (!document.body.classList.contains('index-scene')) return
  if (document.body.dataset.indexSceneBooted === 'true') return

  document.body.dataset.indexSceneBooted = 'true'
  const shouldSkipIntro =
    document.documentElement.dataset.skipIntro === 'true' ||
    window.location.hash.length > 1 ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (shouldSkipIntro) {
    document.body.classList.remove('intro-active')
  } else {
    document.body.classList.add('intro-active')
  }

  const intro = document.getElementById('intro')
  const typer = document.getElementById('intro-typer')
  const barFill = document.getElementById('intro-bar-fill')
  const countEl = document.getElementById('intro-count')
  const statusEl = document.getElementById('intro-status')

  function runIntro() {
    if (!intro) {
      document.body.classList.remove('intro-active')
      return
    }

    if (shouldSkipIntro) {
      document.body.classList.remove('intro-active')
      intro.classList.add('done')
      intro.classList.add('gone')
      return
    }

    const line = 'boot --user josue --role computer_engineer'
    let index = 0
    const typeInterval = window.setInterval(() => {
      if (typer) typer.textContent = line.slice(0, index)
      index += 1
      if (index > line.length) window.clearInterval(typeInterval)
    }, 30)

    const statuses = [
      'booting threejs runtime...',
      'compiling shaders...',
      'rigging nameplate...',
      'calibrating cursor...',
      'ready.',
    ]
    const durationMs = 1600
    const start = performance.now()

    const step = (time: number) => {
      const elapsed = time - start
      const progress = clamp01(elapsed / durationMs)

      if (barFill) barFill.style.width = `${progress * 100}%`
      if (countEl) countEl.textContent = String(Math.round(progress * 99)).padStart(2, '0')
      if (statusEl) {
        const statusIndex = Math.min(
          statuses.length - 1,
          Math.floor(progress * statuses.length)
        )
        statusEl.textContent = statuses[statusIndex]
      }

      if (progress < 1) {
        window.requestAnimationFrame(step)
        return
      }

      window.setTimeout(() => {
        intro.classList.add('done')
        document.body.classList.remove('intro-active')
        window.setTimeout(() => intro.classList.add('gone'), 1100)
      }, 250)
    }

    window.requestAnimationFrame(step)
  }

  window.requestAnimationFrame(runIntro)
  window.setTimeout(() => {
    document.body.classList.remove('intro-active')
    if (!intro) return
    intro.classList.add('done')
    intro.classList.add('gone')
  }, 4000)

  document.querySelectorAll<HTMLElement>('.name-big').forEach((heading) => {
    if (heading.querySelector('.name-char')) return

    const text = heading.textContent ?? ''
    heading.textContent = ''

    for (const [index, char] of Array.from(text).entries()) {
      const span = document.createElement('span')
      span.className = 'name-char'
      span.textContent = char

      const angle = Math.random() * Math.PI * 2
      const distance = 80 + Math.random() * 220
      span.style.setProperty('--dx', `${Math.cos(angle) * distance}px`)
      span.style.setProperty('--dy', `${Math.sin(angle) * distance - 60}px`)
      span.style.setProperty('--rot', `${(Math.random() - 0.5) * 60}deg`)
      span.style.setProperty('--delay', `${index * 0.015}s`)

      heading.appendChild(span)
    }
  })

  const cursor = document.createElement('div')
  cursor.className = 'cursor'
  const ring = document.createElement('div')
  ring.className = 'cursor-ring'
  document.body.append(cursor, ring)

  let mouseX = window.innerWidth / 2
  let mouseY = window.innerHeight / 2
  let ringX = mouseX
  let ringY = mouseY

  window.addEventListener('pointermove', (event) => {
    mouseX = event.clientX
    mouseY = event.clientY
  })

  const tickCursor = () => {
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
    ringX += (mouseX - ringX) * 0.18
    ringY += (mouseY - ringY) * 0.18
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
    window.requestAnimationFrame(tickCursor)
  }
  tickCursor()

  const hoverSelector = 'a, button, .face-label, .mobile-project-card, .experiment'
  document.addEventListener('pointerover', (event) => {
    const target = event.target instanceof Element ? event.target : null
    if (!target?.closest(hoverSelector)) return
    cursor.classList.add('hover')
    ring.classList.add('hover')
  })
  document.addEventListener('pointerout', (event) => {
    const target = event.target instanceof Element ? event.target : null
    if (!target?.closest(hoverSelector)) return
    cursor.classList.remove('hover')
    ring.classList.remove('hover')
  })

  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add('in')
      revealObserver.unobserve(entry.target)
    }
  }, { threshold: 0.12 })

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element))

  const clock = document.getElementById('clock')
  const heroClock = document.getElementById('hero-clock')

  const updateClocks = () => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).formatToParts(new Date())

    const getPart = (type: string) => parts.find((part) => part.type === type)?.value ?? '00'
    const time = `${getPart('hour')}:${getPart('minute')}:${getPart('second')}`

    if (clock) clock.textContent = `${time} EST`
    if (heroClock) heroClock.textContent = time
  }

  if (clock || heroClock) {
    updateClocks()
    window.setInterval(updateClocks, 1000)
  }

  const sceneCanvas = document.getElementById('scene-canvas')
  const hero = document.getElementById('top')
  const work = document.getElementById('work')
  const about = document.getElementById('about')
  const contact = document.getElementById('contact')
  const labelsContainer = document.getElementById('face-labels')
  const quickLinksContainer = document.getElementById('quick-links')
  const mobileProjectsContainer = document.getElementById('mobile-projects')
  const rouletteContainer = document.getElementById('project-roulette')
  const rouletteList = document.getElementById('project-roulette-list')
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    document.body.dataset.guidedState = 'free'
    delete document.body.dataset.guidedSection
  }

  const lenis = prefersReducedMotion
    ? null
    : new Lenis({
        duration: 1.28,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.82,
        touchMultiplier: 1,
      })

  mountLenis(lenis)

  let scene3D: Scene3DInstance | undefined

  const mountGuidedRail = () => {
    if (!lenis || !(hero instanceof HTMLElement) || !(work instanceof HTMLElement) || !(about instanceof HTMLElement) || !(contact instanceof HTMLElement) || !scene3D) {
      return
    }

    createGuidedRailController({
      lenis,
      hero,
      work,
      about,
      contact,
      scene3D,
    }).mount()
  }

  const mountScene3D = async () => {
    if (!(sceneCanvas instanceof HTMLCanvasElement) || !window.initScene3D) return
    if (!window.THREE) {
      window.addEventListener('three-ready', () => void mountScene3D(), { once: true })
      return
    }

    scene3D = window.initScene3D(sceneCanvas, {
      projects: PROJECTS,
      onFaceClick: (project, index) => openProject(project as Project, index),
    })
    if (scene3D) {
      window.__scene3d = scene3D
      mountGuidedRail()
    }
  }

  void mountScene3D()

  if (lenis && hero instanceof HTMLElement && work instanceof HTMLElement && about instanceof HTMLElement && contact instanceof HTMLElement) {
    const sections = [
      { getTarget: () => getSectionTop(hero, 0) },
      { getTarget: () => getSectionTop(work, 0.08) },
      { getTarget: () => getContentCenterTarget(about, ['.section-head', '.about']) },
      {
        getTarget: () =>
          getContentCenterTarget(contact, [
            '.contact-kicker',
            '.contact-title',
            '.contact-email',
            '.contact-socials',
          ]),
      },
    ]
    let snapLockedUntil = 0
    let wheelAccumulator = 0
    let lastWheelAt = 0
    let snapStateTimer = 0
    let nowPlayingTimer = 0
    let activeSnapIndex = nearestIndex(
      sections.map((section) => section.getTarget()),
      lenis.targetScroll ?? lenis.animatedScroll ?? window.scrollY
    )

    const getTargets = () => sections.map((section) => section.getTarget())
    const rail = document.createElement('nav')
    rail.className = 'section-rail'
    rail.setAttribute('aria-label', 'Page sections')

    const railButtons = PAGE_LABELS.map((label, index) => {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'section-rail-dot'
      button.setAttribute('aria-label', `Go to ${label}`)
      button.dataset.index = String(index)
      button.innerHTML = `<span>${label}</span>`
      button.addEventListener('click', () => {
        const targets = getTargets()
        const fromIndex = activeSnapIndex
        const timing = getSnapTiming(fromIndex, index)
        activeSnapIndex = index
        document.body.dataset.scrollDirection = index >= fromIndex ? 'down' : 'up'
        document.body.dataset.transitionKey = `${fromIndex}-${index}`
        document.body.dataset.snapState = 'snapping'
        document.body.dataset.activePage = PAGE_LABELS[index].toLowerCase()
        window.clearTimeout(snapStateTimer)
        lenis.scrollTo(targets[index], {
          immediate: false,
          duration: timing.duration,
          easing: cinematicEase,
          lock: true,
          force: true,
        })
        snapStateTimer = window.setTimeout(() => {
          document.body.dataset.snapState = 'free'
        }, timing.lockMs + 120)
      })
      rail.appendChild(button)
      return button
    })

    document.body.appendChild(rail)

    const writeActivePage = (index: number) => {
      railButtons.forEach((button, buttonIndex) => {
        const active = buttonIndex === index
        button.classList.toggle('active', active)
        button.setAttribute('aria-current', active ? 'true' : 'false')
      })
      document.body.dataset.activePage = PAGE_LABELS[index].toLowerCase()
    }

    writeActivePage(activeSnapIndex)

    window.addEventListener(
      'wheel',
      (event) => {
        if (event.ctrlKey || event.metaKey) return
        if (document.getElementById('project-drawer')?.classList.contains('open')) return

        const now = performance.now()
        event.preventDefault()

        if (now < snapLockedUntil) return

        if (now - lastWheelAt > 220) wheelAccumulator = 0
        lastWheelAt = now
        wheelAccumulator += event.deltaY

        if (Math.abs(wheelAccumulator) < 42) return

        const direction = wheelAccumulator > 0 ? 1 : -1
        wheelAccumulator = 0

        const targets = getTargets()
        const currentIndex = activeSnapIndex
        const nextIndex = Math.max(0, Math.min(targets.length - 1, currentIndex + direction))
        if (nextIndex === currentIndex) return

        const timing = getSnapTiming(currentIndex, nextIndex)
        activeSnapIndex = nextIndex
        snapLockedUntil = now + timing.lockMs
        document.body.dataset.scrollDirection = direction > 0 ? 'down' : 'up'
        document.body.dataset.transitionKey = `${currentIndex}-${nextIndex}`
        document.body.dataset.snapState = 'snapping'
        document.body.dataset.nowPlayingState = nextIndex === 1 ? 'waiting' : 'ready'
        writeActivePage(nextIndex)
        window.clearTimeout(snapStateTimer)
        window.clearTimeout(nowPlayingTimer)

        lenis.scrollTo(targets[nextIndex], {
          immediate: false,
          duration: timing.duration,
          easing: cinematicEase,
          lock: true,
          force: true,
        })

        if (nextIndex === 1) {
          nowPlayingTimer = window.setTimeout(() => {
            document.body.dataset.nowPlayingState = 'ready'
          }, Math.min(260, timing.lockMs * 0.3))
        }

        snapStateTimer = window.setTimeout(() => {
          if (performance.now() >= snapLockedUntil) document.body.dataset.snapState = 'free'
        }, timing.lockMs + 120)
      },
      { passive: false, capture: true }
    )
  }

  const faceLabels: HTMLButtonElement[] = []
  if (labelsContainer) {
    PROJECTS.forEach((project, index) => {
      const element = document.createElement('button')
      element.className = 'face-label'
      element.type = 'button'
      element.innerHTML = `
        <span class="fl-num">0${index + 1}</span>
        <span class="fl-title">${project.title}</span>
        <span class="fl-tag">${project.tags[0]}</span>
        <span class="fl-line"></span>
      `
      element.addEventListener('click', () => openProject(project, index))
      element.addEventListener('pointerenter', () => scene3D?.setHoveredFace(index))
      element.addEventListener('pointerleave', () => scene3D?.setHoveredFace(null))
      element.addEventListener('focus', () => scene3D?.setHoveredFace(index))
      element.addEventListener('blur', () => scene3D?.setHoveredFace(null))
      labelsContainer.appendChild(element)
      faceLabels.push(element)
    })
  }

  if (mobileProjectsContainer) {
    const mobileProjectCards = PROJECTS.map((project, index) => {
      const button = document.createElement('button')
      button.className = 'mobile-project-card'
      button.type = 'button'
      button.setAttribute('aria-label', `Open ${project.title} project details`)

      const topRow = document.createElement('span')
      topRow.className = 'mobile-project-top'

      const num = document.createElement('span')
      num.className = 'mobile-project-num'
      num.textContent = project.num

      const tag = document.createElement('span')
      tag.className = 'mobile-project-tag'
      tag.textContent = project.tags[0] ?? 'PROJECT'

      const title = document.createElement('span')
      title.className = 'mobile-project-title'
      title.textContent = project.title

      const copy = document.createElement('span')
      copy.className = 'mobile-project-copy'
      copy.textContent = project.impact

      topRow.append(num, tag)
      button.append(topRow, title, copy)
      button.addEventListener('click', () => openProject(project, index))
      return button
    })

    mobileProjectsContainer.replaceChildren(...mobileProjectCards)
  }

  const rouletteRows: HTMLButtonElement[] = []
  let rouletteActiveIndex = -1

  const getRouletteOffset = (projectIndex: number, activeIndex: number) => {
    const count = PROJECTS.length
    let offset = projectIndex - activeIndex
    if (offset > count / 2) offset -= count
    if (offset < count / -2) offset += count
    return offset
  }

  const renderRoulette = (activeIndex: number) => {
    if (!rouletteList || activeIndex === rouletteActiveIndex) return
    rouletteActiveIndex = activeIndex

    rouletteRows.forEach((row, projectIndex) => {
      const offset = getRouletteOffset(projectIndex, activeIndex)
      const distance = Math.abs(offset)
      row.dataset.active = projectIndex === activeIndex ? 'true' : 'false'
      row.style.setProperty('--row-offset', String(offset))
      row.style.setProperty('--row-distance', String(distance))
      row.setAttribute('aria-current', projectIndex === activeIndex ? 'true' : 'false')
    })
  }

  if (rouletteContainer && rouletteList && PROJECTS.length > 0) {
    rouletteRows.push(
      ...PROJECTS.map((project, projectIndex) => {
        const row = document.createElement('button')
        row.type = 'button'
        row.className = 'project-roulette-row'
        row.addEventListener('click', () => {
          scene3D?.setHoveredFace(projectIndex)
          openProject(project, projectIndex)
        })
        row.addEventListener('pointerenter', () => scene3D?.setHoveredFace(projectIndex))
        row.addEventListener('pointerleave', () => scene3D?.setHoveredFace(null))
        row.addEventListener('focus', () => scene3D?.setHoveredFace(projectIndex))
        row.addEventListener('blur', () => scene3D?.setHoveredFace(null))
        row.innerHTML = `
          <span class="roulette-num">${project.num.split(' ')[0]}</span>
          <span class="roulette-title">${project.title}</span>
          <span class="roulette-tag">${project.tags[0] ?? 'PROJECT'}</span>
        `
        return row
      })
    )
    rouletteList.replaceChildren(...rouletteRows)
    renderRoulette(0)
  }

  const quickLinkElements: Array<{ el: HTMLAnchorElement; conf: QuickLink }> = []
  if (quickLinksContainer) {
    QUICK_LINKS.forEach((linkConfig) => {
      const anchor = document.createElement('a')
      anchor.className = 'quick-link'
      anchor.href = linkConfig.href
      if (linkConfig.href.startsWith('http')) {
        anchor.target = '_blank'
        anchor.rel = 'noopener noreferrer'
      }
      anchor.innerHTML = `
        <span class="ql-kicker">${linkConfig.kicker}</span>
        <span class="ql-label">${linkConfig.label}</span>
      `
      quickLinksContainer.appendChild(anchor)
      quickLinkElements.push({ el: anchor, conf: linkConfig })
    })
  }

  const onScroll = () => {
    const scrollY = getScrollY(lenis)
    const viewportHeight = window.innerHeight

    const heroHeight = hero?.offsetHeight ?? viewportHeight
    const workRect = getScrollRect(work instanceof HTMLElement ? work : null, scrollY)
    const aboutRect = getScrollRect(about instanceof HTMLElement ? about : null, scrollY)
    const contactRect = getScrollRect(contact instanceof HTMLElement ? contact : null, scrollY)

    const heroExit = smoothProgress(scrollY / (viewportHeight * 0.68))
    document.documentElement.style.setProperty('--hero-exit', String(heroExit))
    hero?.classList.toggle('exiting', heroExit > 0.02)
    hero?.classList.toggle('exited', heroExit > 0.98)
    document.body.classList.toggle('past-hero', heroExit > 0.52)

    let workIn = 0
    if (workRect) {
      workIn = smoothProgress((viewportHeight * 1.04 - workRect.top) / (viewportHeight * 0.9))
    }
    document.documentElement.style.setProperty('--work-in', String(workIn))

    let aboutProgress = 0
    if (aboutRect) {
      const zoomStart = viewportHeight * 1.5
      const zoomEnd = viewportHeight * -0.08
      aboutProgress = smoothProgress((zoomStart - aboutRect.top) / (zoomStart - zoomEnd))
    }
    document.documentElement.style.setProperty('--about-zoom', String(aboutProgress))
    document.body.classList.toggle('zooming-about', aboutProgress > 0.02 && aboutProgress < 0.98)
    document.body.classList.toggle('in-about', aboutProgress > 0.86)

    let contactProgress = 0
    if (contactRect) {
      const contactEnter = viewportHeight * 0.86
      const contactSettle = viewportHeight * 0.18
      contactProgress = smoothProgress((contactEnter - contactRect.top) / (contactEnter - contactSettle))
    }
    document.documentElement.style.setProperty('--contact-in', String(contactProgress))
    document.body.classList.toggle('in-contact', contactProgress > 0.82)

    let mode: 'hero' | 'work' | 'past' = 'hero'
    if (aboutProgress > 0.42) {
      mode = 'past'
    } else if (heroExit > 0.7 && (!workRect || workRect.bottom > viewportHeight * 0.3)) {
      mode = 'work'
    } else if (workRect && workRect.bottom < viewportHeight * 0.3) {
      mode = 'past'
    }

    if (scene3D) {
      scene3D.setMode(mode)
      const totalProgress = clamp01(
        scrollY / (heroHeight + (work?.offsetHeight ?? viewportHeight))
      )
      scene3D.setScrollProg(totalProgress)
      scene3D.setAboutProg(aboutProgress)
    }

    document.body.dataset.sceneMode = mode
  }

  if (lenis) {
    lenis.on('scroll', onScroll)
  } else {
    window.addEventListener('scroll', onScroll, { passive: true })
  }
  window.addEventListener('resize', onScroll)
  onScroll()

  const positionLabels = () => {
    if (!scene3D || faceLabels.length === 0) {
      window.requestAnimationFrame(positionLabels)
      return
    }

    const showLabels = document.body.dataset.sceneMode === 'work'

    faceLabels.forEach((element, index) => {
      const basis = scene3D?.getFaceScreenBasis(index)
      if (!basis || !showLabels || !basis.visible) {
        element.style.opacity = '0'
        return
      }

      const alpha = Math.min(1, Math.max(0, basis.facing) * 1.5)
      const lift = (1 - alpha) * 18
      const scale = 0.88 + alpha * 0.12
      const blur = (1 - alpha) * 6
      const half = 90
      const a = basis.ux / half
      const b = basis.uy / half
      const c = basis.vx / half
      const d = basis.vy / half

      element.style.opacity = String(alpha)
      element.style.filter = `blur(${blur}px)`
      element.style.transform = `matrix(${a}, ${b}, ${c}, ${d}, ${basis.ox}, ${basis.oy}) translate(-50%, -50%) translateY(${-lift}px) scale(${scale})`
    })

    quickLinkElements.forEach(({ el, conf }) => {
      const basis = scene3D?.getSubFacetBasis(
        conf.face,
        conf.bary[0],
        conf.bary[1],
        conf.bary[2]
      )
      if (!basis || !showLabels || !basis.visible) {
        el.style.opacity = '0'
        el.style.pointerEvents = 'none'
        return
      }

      const alpha = Math.min(1, Math.max(0, basis.facing) * 1.8)
      const lift = (1 - alpha) * 12
      const scale = 0.92 + alpha * 0.08
      const blur = (1 - alpha) * 4

      el.style.opacity = String(alpha)
      el.style.filter = `blur(${blur}px)`
      el.style.pointerEvents = alpha > 0.5 ? 'auto' : 'none'
      el.style.transform = `translate(${basis.ox}px, ${basis.oy}px) translate(-50%, -50%) translateY(${-lift}px) scale(${scale})`
    })

    window.requestAnimationFrame(positionLabels)
  }
  window.requestAnimationFrame(positionLabels)

  const updateRoulette = () => {
    if (scene3D && rouletteContainer && document.body.dataset.sceneMode === 'work') {
      const activeIndex = scene3D.getActiveProjectIndex()
      if (activeIndex != null && PROJECTS[activeIndex]) renderRoulette(activeIndex)
    }

    window.requestAnimationFrame(updateRoulette)
  }
  window.requestAnimationFrame(updateRoulette)

  const drawer = document.getElementById('project-drawer')
  const drawerClose = document.getElementById('drawer-close')
  const drawerTitle = document.getElementById('drawer-title')
  const drawerIndex = document.getElementById('drawer-index')
  const drawerDesc = document.getElementById('drawer-desc')
  const drawerTags = document.getElementById('drawer-tags')
  const drawerProof = document.getElementById('drawer-proof')
  const drawerMeta = document.getElementById('drawer-meta')
  const drawerCta = document.getElementById('drawer-cta')
  let drawerReturnFocus: HTMLElement | null = null

  const drawerFocusableSelector =
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

  const getDrawerFocusables = () => {
    if (!drawer) return []
    return Array.from(drawer.querySelectorAll<HTMLElement>(drawerFocusableSelector)).filter(
      (element) => !element.hasAttribute('disabled') && element.offsetParent !== null
    )
  }

  const renderDrawerTags = (tags: string[]) => {
    if (!drawerTags) return
    drawerTags.replaceChildren(
      ...tags.map((tag) => {
        const span = document.createElement('span')
        span.textContent = tag
        return span
      })
    )
  }

  const renderDrawerMeta = (meta: Array<[string, string]>) => {
    if (!drawerMeta) return
    drawerMeta.replaceChildren(
      ...meta.map(([key, value]) => {
        const wrapper = document.createElement('div')
        const dt = document.createElement('dt')
        dt.textContent = key
        const dd = document.createElement('dd')
        dd.textContent = value
        wrapper.append(dt, dd)
        return wrapper
      })
    )
  }

  const renderDrawerProof = (project: Project) => {
    if (!drawerProof) return

    const rows: Array<[string, string]> = [
      ['Problem', project.problem],
      ['Built', project.built],
      ['Impact', project.impact],
    ]

    drawerProof.replaceChildren(
      ...rows.map(([label, copy]) => {
        const section = document.createElement('section')
        section.className = 'drawer-proof-section'

        const kicker = document.createElement('span')
        kicker.className = 'drawer-proof-kicker'
        kicker.textContent = label

        const body = document.createElement('p')
        body.className = 'drawer-proof-copy'
        body.textContent = copy

        section.append(kicker, body)
        return section
      })
    )
  }

  function openProject(project: Project | null | undefined, index: number) {
    if (!drawer || !project) return
    scene3D?.setHoveredFace(index)
    scene3D?.setPaused(true)

    drawerReturnFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    if (drawerTitle) drawerTitle.textContent = project.title
    if (drawerIndex) drawerIndex.textContent = project.num
    if (drawerDesc) drawerDesc.textContent = project.desc
    renderDrawerTags(project.tags)
    renderDrawerProof(project)
    renderDrawerMeta(project.meta)

    if (drawerCta instanceof HTMLAnchorElement) {
      drawerCta.href = project.url
      drawerCta.target = '_blank'
      drawerCta.rel = 'noopener noreferrer'
      drawerCta.textContent = 'VIEW ON GITHUB \u2197'
      drawerCta.style.display = ''
    }

    drawer.classList.add('open')
    drawer.setAttribute('aria-hidden', 'false')
    window.setTimeout(() => {
      const focusTarget =
        drawerClose instanceof HTMLElement ? drawerClose : getDrawerFocusables()[0] ?? drawer
      focusTarget.focus()
    }, 0)
  }

  const closeDrawer = () => {
    if (!drawer) return
    drawer.classList.remove('open')
    drawer.setAttribute('aria-hidden', 'true')
    scene3D?.setHoveredFace(null)
    scene3D?.setPaused(false)
    drawerReturnFocus?.focus()
    drawerReturnFocus = null
  }

  drawerClose?.addEventListener('click', closeDrawer)
  document.addEventListener('keydown', (event) => {
    if (!drawer?.classList.contains('open')) return

    if (event.key === 'Escape') {
      closeDrawer()
      return
    }

    if (event.key !== 'Tab') return

    const focusables = getDrawerFocusables()
    if (focusables.length === 0) {
      event.preventDefault()
      drawer.focus()
      return
    }

    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement

    if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  })

  if (window.initExperimentTile) {
    document.querySelectorAll('.experiment-canvas').forEach((canvas) => {
      window.initExperimentTile?.(canvas, canvas.getAttribute('data-variant') ?? undefined)
    })
  }

  const state: { typeVibe: string; accent: string } = { ...TWEAK_DEFAULTS }

  const applyTweaks = () => {
    document.body.dataset.typeVibe = state.typeVibe
    document.body.dataset.accent = state.accent
  }
  applyTweaks()

  const panel = document.createElement('div')
  panel.className = 'tweaks-panel'
  panel.innerHTML = `
    <div class="tweak-title">Tweaks</div>
    <div class="tweak-group">
      <h4>Typography</h4>
      <div class="tweak-options" data-key="typeVibe">
        <button data-v="serif-sans">Serif + Sans (default)</button>
        <button data-v="all-sans">All sans, big &amp; bold</button>
        <button data-v="mono">Mono display</button>
      </div>
    </div>
    <div class="tweak-group">
      <h4>Accent intensity</h4>
      <div class="tweak-options" data-key="accent">
        <button data-v="subtle">Subtle</button>
        <button data-v="default">Default</button>
        <button data-v="intense">Intense</button>
      </div>
    </div>
  `
  document.body.appendChild(panel)

  const syncActive = () => {
    panel.querySelectorAll<HTMLElement>('.tweak-options').forEach((group) => {
      const key = group.dataset.key
      if (!key) return
      group.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
        button.classList.toggle('active', button.dataset.v === state[key as keyof typeof state])
      })
    })
  }
  syncActive()

  panel.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('button[data-v]') : null
    if (!(target instanceof HTMLButtonElement)) return

    const group = target.parentElement
    const key = group?.getAttribute('data-key')
    const value = target.dataset.v
    if (!key || !value) return

    state[key as keyof typeof state] = value
    applyTweaks()
    syncActive()
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: value } }, '*')
  })

  window.addEventListener('message', (event) => {
    if (!event.data || typeof event.data !== 'object') return
    const data = event.data as { type?: string }
    if (data.type === '__activate_edit_mode') panel.classList.add('visible')
    if (data.type === '__deactivate_edit_mode') panel.classList.remove('visible')
  })

  window.parent.postMessage({ type: '__edit_mode_available' }, '*')
}
