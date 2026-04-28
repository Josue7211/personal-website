type Track = {
  title: string
  src: string
}

const TRACKS: Track[] = [
  { title: 'Under the Moonlight', src: '/audio/under-the-moonlight.mp3' },
  { title: 'Remember', src: '/audio/remember.mp3' },
  { title: 'Cosmos', src: '/audio/cosmos.mp3' },
  { title: 'Memory', src: '/audio/memory.mp3' },
]

const TRACK_STORAGE_KEY = 'josue-site-music-track-index'

type PlayerState = 'idle' | 'loading' | 'playing' | 'paused'

let audio: HTMLAudioElement | null = null
let activeIndex = 0
let state: PlayerState = 'idle'
let mounted = false
let volume = 0.18
let userPaused = false

const readStoredTrackIndex = () => {
  try {
    const stored = window.localStorage.getItem(TRACK_STORAGE_KEY)
    if (stored == null) return null
    const index = Number(stored)
    return Number.isInteger(index) && index >= 0 && index < TRACKS.length ? index : null
  } catch {
    return null
  }
}

const writeStoredTrackIndex = () => {
  try {
    window.localStorage.setItem(TRACK_STORAGE_KEY, String(activeIndex))
  } catch {
    // Ignore private-mode/storage-denied failures; playback still works.
  }
}

const chooseInitialTrack = () => {
  const stored = readStoredTrackIndex()
  activeIndex = stored ?? Math.floor(Math.random() * TRACKS.length)
  writeStoredTrackIndex()
}

const getAudio = () => {
  if (audio) return audio

  audio = new Audio(TRACKS[activeIndex].src)
  audio.autoplay = true
  audio.preload = 'auto'
  audio.volume = volume
  audio.addEventListener('ended', () => {
    activeIndex = (activeIndex + 1) % TRACKS.length
    void playActiveTrack()
  })
  audio.addEventListener('pause', () => {
    if (state === 'playing') setState('paused')
  })

  return audio
}

const setState = (nextState: PlayerState) => {
  state = nextState
  const track = TRACKS[activeIndex]

  document.querySelectorAll<HTMLButtonElement>('[data-music-toggle]').forEach((button) => {
    button.setAttribute('aria-pressed', nextState === 'playing' ? 'true' : 'false')
    button.setAttribute(
      'aria-label',
      nextState === 'playing' ? `Pause ${track.title}` : `Play ${track.title}`
    )
  })

  document.querySelectorAll<HTMLElement>('[data-music-label]').forEach((label) => {
    label.textContent = nextState === 'playing' ? 'Ⅱ' : '▶'
  })

  document.querySelectorAll<HTMLElement>('[data-music-status]').forEach((label) => {
    label.textContent =
      nextState === 'playing' ? 'Playing' : nextState === 'loading' ? 'Loading' : 'Ready'
  })

  document.querySelectorAll<HTMLElement>('[data-music-track]').forEach((trackElement) => {
    trackElement.textContent = track.title
  })

  document.querySelectorAll<HTMLInputElement>('[data-music-volume]').forEach((slider) => {
    slider.value = String(volume)
    slider.style.setProperty('--volume-fill', `${volume * 100}%`)
  })
}

const playActiveTrack = async () => {
  const player = getAudio()
  const track = TRACKS[activeIndex]

  userPaused = false
  setState('loading')
  if (player.src !== new URL(track.src, window.location.href).toString()) {
    player.src = track.src
  }

  try {
    await player.play()
    setState('playing')
  } catch {
    setState('paused')
  }
}

const pauseTrack = (manual = false) => {
  if (manual) userPaused = true
  getAudio().pause()
  setState('paused')
}

const setTrack = (index: number) => {
  const player = getAudio()
  activeIndex = (index + TRACKS.length) % TRACKS.length
  writeStoredTrackIndex()
  player.src = TRACKS[activeIndex].src

  if (state === 'playing' || state === 'loading') {
    void playActiveTrack()
  } else {
    setState('paused')
  }
}

const nextTrack = () => {
  setTrack(activeIndex + 1)
}

const previousTrack = () => {
  const player = getAudio()
  if (player.currentTime > 3) {
    player.currentTime = 0
    return
  }

  setTrack(activeIndex - 1)
}

const setVolume = (nextVolume: number) => {
  volume = Math.min(1, Math.max(0, nextVolume))
  getAudio().volume = volume
  document.querySelectorAll<HTMLInputElement>('[data-music-volume]').forEach((slider) => {
    slider.value = String(volume)
    slider.style.setProperty('--volume-fill', `${volume * 100}%`)
  })
}

const blurControl = (element: Element | null) => {
  if (element instanceof HTMLElement) element.blur()
}

export default function initMusicPlayer() {
  chooseInitialTrack()
  setState(state)
  getAudio().load()
  if (mounted) return
  mounted = true

  const updateProximity = (x: number, y: number) => {
    const nearTopRight = x > window.innerWidth - 360 && y < 120
    document.body.classList.toggle('music-proximate', nearTopRight)
  }

  document.addEventListener('click', (event) => {
    const target = event.target
    if (!(target instanceof Element)) return

    const nextButton = target.closest('[data-music-next]')
    if (nextButton) {
      nextTrack()
      blurControl(nextButton)
      return
    }

    const previousButton = target.closest('[data-music-prev]')
    if (previousButton) {
      previousTrack()
      blurControl(previousButton)
      return
    }

    const toggle = target.closest('[data-music-toggle]')
    if (!toggle) return

    if (state === 'playing' || state === 'loading') {
      pauseTrack(true)
      blurControl(toggle)
      return
    }

    void playActiveTrack()
    blurControl(toggle)
  })

  document.addEventListener('input', (event) => {
    const target = event.target
    if (!(target instanceof HTMLInputElement) || !target.matches('[data-music-volume]')) return
    setVolume(Number(target.value))
  })

  document.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return
    updateProximity(event.clientX, event.clientY)
  })

  document.addEventListener('pointerleave', () => {
    document.body.classList.remove('music-proximate')
  })

  window.setTimeout(() => {
    void playActiveTrack()
  }, 120)

  const startOnFirstGesture = (event: Event) => {
    const target = event.target
    if (target instanceof Element && target.closest('.nav-now-playing')) return
    if (!userPaused && state !== 'playing') void playActiveTrack()
  }

  document.addEventListener('pointerdown', startOnFirstGesture, { once: true })
  document.addEventListener('keydown', startOnFirstGesture, { once: true })
}
