import {
  chooseActiveSection,
  computeCaptureProgress,
  nextGuidedRailState,
  type GuidedRailState,
} from './core'
import { SECTION_CONFIG, type GuidedRailSectionId } from './sections'

type LenisInstance = import('lenis').default

type ControllerArgs = {
  lenis: LenisInstance | null
  hero: HTMLElement
  work: HTMLElement
  about: HTMLElement
  contact: HTMLElement
  scene3D: {
    setMode(mode: 'hero' | 'work' | 'past'): void
    setScrollProg(progress: number): void
    setAboutProg(progress: number): void
  }
}

const ACTIVE_GUIDED_STATES = new Set<GuidedRailState>(['capture', 'hold'])

export function createGuidedRailController(args: ControllerArgs) {
  let state: GuidedRailState = 'free'
  let holdStartedAt = 0
  let lastWheelDelta = 0
  let lastWheelAt = 0
  let lastCommandedSection: GuidedRailSectionId | null = null
  let lastCommandedState: GuidedRailState = 'free'
  let releasedSection: GuidedRailSectionId | null = null
  let rafId = 0

  const sectionEls: Record<GuidedRailSectionId, HTMLElement> = {
    hero: args.hero,
    work: args.work,
    about: args.about,
    contact: args.contact,
  }

  function getScrollY() {
    return args.lenis ? args.lenis.animatedScroll : window.scrollY
  }

  function getTargetTop(id: GuidedRailSectionId) {
    const el = sectionEls[id]
    const rect = el.getBoundingClientRect()
    const scrollTop = window.scrollY + rect.top

    if (id === 'work') return scrollTop - window.innerHeight * 0.08
    if (id === 'about') return scrollTop - window.innerHeight * 0.18
    if (id === 'contact') return scrollTop - window.innerHeight * 0.12
    return scrollTop
  }

  function writeBodyState(activeSection: GuidedRailSectionId | null, nextState: GuidedRailState) {
    document.body.classList.toggle(
      'is-capturing-work',
      activeSection === 'work' && ACTIVE_GUIDED_STATES.has(nextState)
    )
    document.body.classList.toggle('is-holding-work', activeSection === 'work' && nextState === 'hold')
    document.body.classList.toggle('is-guiding-about', activeSection === 'about' && nextState !== 'free')
    document.body.classList.toggle('is-guiding-contact', activeSection === 'contact' && nextState !== 'free')

    if (activeSection) {
      document.body.dataset.guidedSection = activeSection
    } else {
      delete document.body.dataset.guidedSection
    }

    document.body.dataset.guidedState = nextState
  }

  function maybeScrollToTarget(
    activeSection: GuidedRailSectionId,
    nextState: GuidedRailState,
    targetTop: number
  ) {
    if (activeSection !== 'work' || !args.lenis || !ACTIVE_GUIDED_STATES.has(nextState)) {
      lastCommandedSection = null
      lastCommandedState = 'free'
      return
    }

    const shouldIssueScroll =
      activeSection !== lastCommandedSection ||
      nextState !== lastCommandedState ||
      Math.abs(targetTop - args.lenis.targetScroll) > 6

    if (!shouldIssueScroll) return

    args.lenis.scrollTo(targetTop, {
      immediate: false,
      duration: activeSection === 'work' ? 1.24 : 1.05,
      lock: false,
      force: true,
    })

    lastCommandedSection = activeSection
    lastCommandedState = nextState
  }

  function frame(time: number) {
    const scrollY = getScrollY()
    const deltaY = time - lastWheelAt < 140 ? lastWheelDelta : 0

    const snapshots = (Object.keys(sectionEls) as GuidedRailSectionId[]).map((id) => ({
      id,
      distanceToTarget: getTargetTop(id) - scrollY,
      direction: deltaY >= 0 ? 1 : -1,
    }))

    const chosen = chooseActiveSection(snapshots, SECTION_CONFIG)

    if (chosen) {
      const activeSection = chosen.snapshot.id
      const config = SECTION_CONFIG[activeSection]
      const captureProgress = computeCaptureProgress(
        chosen.snapshot.distanceToTarget,
        config.captureRadiusPx
      )
      const holdElapsedMs = holdStartedAt ? time - holdStartedAt : 0
      let nextState = nextGuidedRailState({
        current: state,
        captureProgress,
        deltaY,
        holdElapsedMs,
        holdMs: config.holdMs,
        breakoutDelta: config.breakoutDelta,
      })

      if (releasedSection && (activeSection !== releasedSection || captureProgress < 0.08)) {
        releasedSection = null
      }

      if (releasedSection === activeSection && captureProgress >= 0.08) {
        nextState = 'release'
      } else if (nextState === 'release' && state !== 'release') {
        releasedSection = activeSection
      }

      if (nextState === 'hold' && state !== 'hold') holdStartedAt = time
      if (nextState !== 'hold') holdStartedAt = 0

      maybeScrollToTarget(activeSection, nextState, getTargetTop(activeSection))

      state = nextState
      writeBodyState(activeSection, nextState)
    } else {
      state = 'free'
      holdStartedAt = 0
      lastCommandedSection = null
      lastCommandedState = 'free'
      releasedSection = null
      writeBodyState(null, 'free')
    }

    rafId = window.requestAnimationFrame(frame)
  }

  function mount() {
    document.body.dataset.guidedState = 'free'

    window.addEventListener(
      'wheel',
      (event) => {
        lastWheelDelta = event.deltaY
        lastWheelAt = performance.now()
      },
      { passive: true }
    )

    rafId = window.requestAnimationFrame(frame)
  }

  return { mount }
}
