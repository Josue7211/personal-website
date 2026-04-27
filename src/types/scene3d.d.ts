import type * as ThreeNamespace from 'three'

export {}

type SceneMode = 'hero' | 'work' | 'past'

type SceneProject = Record<string, unknown>

type FaceScreenBasis = {
  visible: boolean
  facing: number
  ux: number
  uy: number
  vx: number
  vy: number
  ox: number
  oy: number
}

type Scene3DInstance = {
  setMode(mode: SceneMode): void
  setScrollProg(progress: number): void
  setAboutProg(progress: number): void
  getFaceScreenPos(index: number): {
    x: number
    y: number
    visible: boolean
    facing: number
  } | null
  getFaceScreenBasis(index: number): FaceScreenBasis | null
  getHoveredFace(): unknown
  getFaceMeshes(): unknown[]
  setHoveredFace(index: number | null): void
  setPaused(paused: boolean): void
  getActiveProjectIndex(): number | null
  getSubFacetBasis(
    face: number,
    a: number,
    b: number,
    c: number
  ): FaceScreenBasis | null
}

declare global {
  interface Window {
    THREE?: typeof ThreeNamespace
    initScene3D?: (
      canvas: HTMLCanvasElement,
      opts: {
        projects: SceneProject[]
        onFaceClick: (project: SceneProject, index: number) => void
      }
    ) => Scene3DInstance | undefined
    initExperimentTile?: (
      canvas: Element,
      variant?: string
    ) => void
    __scene3d?: Scene3DInstance
  }
}
