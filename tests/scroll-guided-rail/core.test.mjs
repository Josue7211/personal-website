import assert from 'node:assert/strict'
import test from 'node:test'

import {
  chooseActiveSection,
  computeCaptureProgress,
  nextGuidedRailState,
  shouldBreakOut,
} from '../../src/scene/guided-rail/core.ts'
import { SECTION_CONFIG } from '../../src/scene/guided-rail/sections.ts'

test('chooseActiveSection prefers work when work and about are both nearby', () => {
  const chosen = chooseActiveSection(
    [
      { id: 'work', distanceToTarget: 60, direction: 1 },
      { id: 'about', distanceToTarget: 40, direction: 1 },
    ],
    SECTION_CONFIG
  )

  assert.equal(chosen?.snapshot.id, 'work')
})

test('shouldBreakOut returns true for strong deltas', () => {
  assert.equal(shouldBreakOut(42, 30), true)
  assert.equal(shouldBreakOut(18, 30), false)
})

test('nextGuidedRailState reaches hold after a strong capture', () => {
  const state = nextGuidedRailState({
    current: 'capture',
    captureProgress: 0.98,
    deltaY: 4,
    holdElapsedMs: 100,
    holdMs: 420,
    breakoutDelta: 30,
  })

  assert.equal(state, 'hold')
})

test('computeCaptureProgress clamps values into the 0..1 range', () => {
  assert.equal(computeCaptureProgress(0, 120), 1)
  assert.equal(computeCaptureProgress(120, 120), 0)
  assert.equal(computeCaptureProgress(300, 120), 0)
})
