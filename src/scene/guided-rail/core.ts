import type { GuidedRailSectionConfig, GuidedRailSectionId } from './sections'

export type GuidedRailState = 'free' | 'attract' | 'capture' | 'hold' | 'release'

export type SectionSnapshot = {
  id: GuidedRailSectionId
  distanceToTarget: number
  direction: -1 | 1
}

export type ActiveSectionChoice = {
  snapshot: SectionSnapshot
  weight: number
}

export function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

export function computeCaptureProgress(distanceToTarget: number, radius: number) {
  if (radius <= 0) return 0
  return clamp01(1 - Math.abs(distanceToTarget) / radius)
}

export function shouldBreakOut(deltaY: number, breakoutDelta: number) {
  return Math.abs(deltaY) >= breakoutDelta
}

export function chooseActiveSection(
  snapshots: SectionSnapshot[],
  config: Record<GuidedRailSectionId, GuidedRailSectionConfig>
): ActiveSectionChoice | null {
  return (
    snapshots
      .filter((snapshot) => snapshot.id !== 'hero')
      .map((snapshot) => ({
        snapshot,
        weight:
          computeCaptureProgress(snapshot.distanceToTarget, config[snapshot.id].captureRadiusPx) *
          config[snapshot.id].strength,
      }))
      .sort((left, right) => right.weight - left.weight)[0] ?? null
  )
}

export function nextGuidedRailState(args: {
  current: GuidedRailState
  captureProgress: number
  deltaY: number
  holdElapsedMs: number
  holdMs: number
  breakoutDelta: number
}): GuidedRailState {
  if (shouldBreakOut(args.deltaY, args.breakoutDelta)) return 'release'
  if (args.captureProgress < 0.08) return 'free'
  if (args.captureProgress < 0.45) return 'attract'
  if (args.current === 'hold' && args.holdElapsedMs < args.holdMs) return 'hold'
  if (args.captureProgress >= 0.92 && args.holdElapsedMs === 0) return 'capture'
  if (args.current === 'capture' && args.captureProgress >= 0.92) return 'hold'
  return 'release'
}
