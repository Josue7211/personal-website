import Lenis from 'lenis'

import { createGuidedRailController } from '../scene/guided-rail/controller'

type Project = {
  id: string
  num: string
  title: string
  tags: string[]
  desc: string
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

const PROJECTS: Project[] = [
  {
    id: 'memd',
    num: '001 / 2026',
    title: 'memd',
    tags: ['RUST', 'AGENTS', 'MEMORY'],
    desc: 'Open-source memory manager and retrieval control plane for LLM agents. Persistent context, handoffs, recall across sessions.',
    meta: [['Stack', 'Rust'], ['Role', 'Creator / maintainer'], ['Repo', 'github.com/Josue7211/memd']],
    url: 'https://github.com/Josue7211/memd',
  },
  {
    id: 'security-sweep',
    num: '002 / 2026',
    title: 'security-sweep',
    tags: ['SECURITY', 'AGENTS', 'RED-TEAM'],
    desc: 'Pentagon-grade red-team security scanning for Claude Code. Nineteen agents, two tiers, zero gaps.',
    meta: [['Agents', '19'], ['Role', 'Creator'], ['Repo', 'github.com/Josue7211/security-sweep']],
    url: 'https://github.com/Josue7211/security-sweep',
  },
  {
    id: 'claude-autoresearch',
    num: '003 / 2026',
    title: 'claude-autoresearch',
    tags: ['SHELL', 'AGENTS', 'LOOP'],
    desc: "Autonomous overnight improvement loop for Claude Code. Inspired by Karpathy's autoresearch.",
    meta: [['Stack', 'Shell'], ['Role', 'Creator'], ['Repo', 'github.com/Josue7211/claude-autoresearch']],
    url: 'https://github.com/Josue7211/claude-autoresearch',
  },
  {
    id: 'bjorn',
    num: '004 / 2025',
    title: 'Bjorn',
    tags: ['HARDWARE', '3D-PRINT', 'FIRMWARE'],
    desc: 'Heavily modified Ender 3 V2 NEO. Firmware, slicer profiles, and mechanical mods to print most materials at high speeds.',
    meta: [['Base', 'Ender 3 V2 NEO'], ['Role', 'All of it'], ['Repo', 'github.com/Josue7211/Bjorn']],
    url: 'https://github.com/Josue7211/Bjorn',
  },
  {
    id: 'homelab-cli',
    num: '005 / 2025',
    title: 'homelab-cli',
    tags: ['SHELL', 'INFRA', 'SELF-HOSTED'],
    desc: 'Sixteen bash CLIs for running a self-hosted homelab - Sonarr, Radarr, Plex, AdGuard, qBittorrent, Portainer.',
    meta: [['CLIs', '16'], ['Stack', 'Shell'], ['Repo', 'github.com/Josue7211/homelab-cli']],
    url: 'https://github.com/Josue7211/homelab-cli',
  },
  {
    id: 'agentsecrets',
    num: '006 / 2026',
    title: 'AgentSecrets',
    tags: ['RUST', 'SECURITY', 'SECRETS'],
    desc: 'Self-hosted secret broker for agent workflows. Masked responses, human approvals, full audit trails.',
    meta: [['Stack', 'Rust'], ['Role', 'Creator'], ['Repo', 'github.com/Josue7211/AgentSecrets']],
    url: 'https://github.com/Josue7211/AgentSecrets',
  },
  {
    id: 'claude-dream',
    num: '007 / 2026',
    title: 'claude-dream',
    tags: ['SHELL', 'AGENTS', 'MEMORY'],
    desc: "Memory consolidation skills for Claude Code. Replicates Anthropic's unreleased /dream and /autodream flows.",
    meta: [['Stack', 'Shell'], ['Role', 'Creator'], ['Repo', 'github.com/Josue7211/claude-dream']],
    url: 'https://github.com/Josue7211/claude-dream',
  },
  {
    id: 'mac-bridge',
    num: '008 / 2025',
    title: 'mac-bridge',
    tags: ['JAVASCRIPT', 'MACOS', 'INFRA'],
    desc: 'REST bridge for macOS services - Reminders, Notes, Contacts, Find My, Messages. Runs on a Mac, reachable over Tailscale.',
    meta: [['Stack', 'JavaScript'], ['Transport', 'Tailscale'], ['Repo', 'github.com/Josue7211/mac-bridge']],
    url: 'https://github.com/Josue7211/mac-bridge',
  },
]

const QUICK_LINKS: QuickLink[] = [
  { face: 2, bary: [1, 0, 0], href: '#about', label: 'About', kicker: '-> me' },
  { face: 4, bary: [0, 1, 0], href: 'docs.html', label: 'Docs', kicker: '-> case studies' },
  { face: 6, bary: [0, 0, 1], href: '#contact', label: 'Contact', kicker: '-> say hi' },
]

const TWEAK_DEFAULTS = {
  typeVibe: 'serif-sans',
  accent: 'default',
} as const

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function smoothProgress(value: number) {
  const t = clamp01(value)
  return t * t * t * (t * (t * 6 - 15) + 10)
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

  const hoverSelector = 'a, button, .face-label, .experiment'
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
  if (sceneCanvas instanceof HTMLCanvasElement && window.initScene3D) {
    scene3D = window.initScene3D(sceneCanvas, {
      projects: PROJECTS,
      onFaceClick: (project, index) => openProject(project as Project, index),
    })
    if (scene3D) window.__scene3d = scene3D
  }

  if (lenis && hero instanceof HTMLElement && work instanceof HTMLElement && about instanceof HTMLElement && contact instanceof HTMLElement && scene3D) {
    createGuidedRailController({
      lenis,
      hero,
      work,
      about,
      contact,
      scene3D,
    }).mount()
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
      labelsContainer.appendChild(element)
      faceLabels.push(element)
    })
  }

  const quickLinkElements: Array<{ el: HTMLAnchorElement; conf: QuickLink }> = []
  if (quickLinksContainer) {
    QUICK_LINKS.forEach((linkConfig) => {
      const anchor = document.createElement('a')
      anchor.className = 'quick-link'
      anchor.href = linkConfig.href
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
    document.body.classList.toggle('in-about', aboutProgress > 0.78)

    let contactProgress = 0
    if (contactRect) {
      const contactEnter = viewportHeight * 1.22
      const contactSettle = viewportHeight * 0.28
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

  const drawer = document.getElementById('project-drawer')
  const drawerClose = document.getElementById('drawer-close')
  const drawerTitle = document.getElementById('drawer-title')
  const drawerIndex = document.getElementById('drawer-index')
  const drawerDesc = document.getElementById('drawer-desc')
  const drawerTags = document.getElementById('drawer-tags')
  const drawerMeta = document.getElementById('drawer-meta')
  const drawerCta = document.getElementById('drawer-cta')

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

  function openProject(project: Project | null | undefined, _index: number) {
    if (!drawer || !project) return

    if (drawerTitle) drawerTitle.textContent = project.title
    if (drawerIndex) drawerIndex.textContent = project.num
    if (drawerDesc) drawerDesc.textContent = project.desc
    renderDrawerTags(project.tags)
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
  }

  const closeDrawer = () => {
    if (!drawer) return
    drawer.classList.remove('open')
    drawer.setAttribute('aria-hidden', 'true')
  }

  drawerClose?.addEventListener('click', closeDrawer)
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeDrawer()
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
