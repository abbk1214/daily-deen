import type { CompassState } from './types'
import { CALIBRATION_THRESHOLD, CALIBRATION_STABILITY_FRAMES } from './constants'
import { normalizeAngle, smoothHeading } from './helpers'

declare global {
  interface DeviceOrientationEvent {
    webkitCompassHeading?: number
  }
}

type HeadingCallback = (heading: number) => void
type ErrorCallback = (error: string) => void

let headingHistory: number[] = []
let lastHeading = 0
let animationFrame: number | null = null

function getEffectiveHeading(event: DeviceOrientationEvent): number | null {
  if (event.webkitCompassHeading !== undefined) {
    return event.webkitCompassHeading
  }
  if (event.alpha !== null) {
    return (360 - event.alpha) % 360
  }
  return null
}

function calculateAccuracy(headings: number[]): number {
  if (headings.length < 3) return 0
  const recent = headings.slice(-CALIBRATION_STABILITY_FRAMES)
  const diffs: number[] = []
  for (let i = 1; i < recent.length; i++) {
    let diff = Math.abs(recent[i] - recent[i - 1])
    if (diff > 180) diff = 360 - diff
    diffs.push(diff)
  }
  const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length
  return Math.max(0, 100 - avgDiff * 5)
}

export function isCompassSupported(): boolean {
  if (typeof window === 'undefined') return false
  return 'DeviceOrientationEvent' in window
}

export function requestCompassPermission(): Promise<boolean> {
  const DOE = DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<'granted' | 'denied' | 'prompt'>
  }
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DOE.requestPermission === 'function') {
    return DOE.requestPermission()
      .then((state: string) => state === 'granted')
      .catch(() => false)
  }
  return Promise.resolve(true)
}

export function startCompassListener(
  onHeading: HeadingCallback,
  onError: ErrorCallback,
  smoothing: number = 0.3,
): () => void {
  headingHistory = []
  lastHeading = 0

  const handler = (event: DeviceOrientationEvent) => {
    const raw = getEffectiveHeading(event)
    if (raw === null) return

    headingHistory.push(raw)
    if (headingHistory.length > 50) headingHistory.shift()

    const smoothed = smoothHeading(raw, lastHeading, smoothing)
    lastHeading = smoothed

    onHeading(normalizeAngle(smoothed))
  }

  window.addEventListener('deviceorientation', handler, { capture: true })

  const checkInterval = setInterval(() => {
    const accuracy = calculateAccuracy(headingHistory)
    if (headingHistory.length > CALIBRATION_STABILITY_FRAMES && accuracy < CALIBRATION_THRESHOLD) {
      onError('Compass may need calibration. Move your phone in a figure-eight motion.')
    }
  }, 5000)

  return () => {
    window.removeEventListener('deviceorientation', handler, { capture: true })
    clearInterval(checkInterval)
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame)
      animationFrame = null
    }
  }
}

export function getCompassState(heading: number, supported: boolean): CompassState {
  const accuracy = calculateAccuracy(headingHistory)
  return {
    heading,
    accuracy,
    isCalibrated: accuracy >= CALIBRATION_THRESHOLD || headingHistory.length < CALIBRATION_STABILITY_FRAMES,
    isSupported: supported,
    permissionState: 'granted',
  }
}
