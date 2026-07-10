export interface QiblaResult {
  bearing: number
  distance: number
  direction: string
  degreesFromNorth: number
}

export interface CompassState {
  heading: number
  accuracy: number
  isCalibrated: boolean
  isSupported: boolean
  permissionState: 'granted' | 'denied' | 'prompt'
}

export interface QiblaSettings {
  autoCalibration: boolean
  showDegrees: boolean
  useMagneticNorth: boolean
  compassSmoothing: number
}
