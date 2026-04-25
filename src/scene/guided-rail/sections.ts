export type GuidedRailSectionId = 'hero' | 'work' | 'about' | 'contact'

export type GuidedRailSectionConfig = {
  id: GuidedRailSectionId
  strength: number
  captureRadiusPx: number
  holdMs: number
  breakoutDelta: number
}

export const SECTION_CONFIG: Record<GuidedRailSectionId, GuidedRailSectionConfig> = {
  hero: {
    id: 'hero',
    strength: 0.15,
    captureRadiusPx: 0,
    holdMs: 0,
    breakoutDelta: 0,
  },
  work: {
    id: 'work',
    strength: 1,
    captureRadiusPx: 320,
    holdMs: 360,
    breakoutDelta: 36,
  },
  about: {
    id: 'about',
    strength: 0.42,
    captureRadiusPx: 220,
    holdMs: 120,
    breakoutDelta: 28,
  },
  contact: {
    id: 'contact',
    strength: 0.4,
    captureRadiusPx: 240,
    holdMs: 120,
    breakoutDelta: 28,
  },
}
