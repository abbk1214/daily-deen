import { describe, it, expect } from 'vitest'
import {
  calculateInitialBearing,
  calculateDistance,
  calculateQiblaDirection,
} from '../qibla/bearing'
import {
  normalizeAngle,
  formatBearing,
  getDirectionLabel,
  formatDistance,
  smoothHeading,
} from '../qibla/helpers'
import { KAABA, EARTH_RADIUS_KM } from '../qibla/constants'
import type { Coordinates } from '../location/types'

describe('bearing calculations', () => {
  describe('calculateInitialBearing', () => {
    it('calculates bearing from New York to Kaaba', () => {
      const ny: Coordinates = { latitude: 40.7128, longitude: -74.006 }
      const bearing = calculateInitialBearing(ny, KAABA)
      // From NY, Kaaba is roughly south-east (~58-62 degrees)
      expect(bearing).toBeGreaterThan(50)
      expect(bearing).toBeLessThan(70)
    })

    it('calculates bearing from London to Kaaba', () => {
      const london: Coordinates = { latitude: 51.5074, longitude: -0.1278 }
      const bearing = calculateInitialBearing(london, KAABA)
      // From London, Kaaba is roughly south-east (~118-122 degrees)
      expect(bearing).toBeGreaterThan(110)
      expect(bearing).toBeLessThan(130)
    })

    it('calculates bearing from Kaaba to Kaaba (same point)', () => {
      const bearing = calculateInitialBearing(KAABA, KAABA)
      // Same point: bearing should be 0 (or undefined, but we return 0)
      expect(bearing).toBe(0)
    })

    it('returns bearing in range [0, 360)', () => {
      const coords: Coordinates = { latitude: 33.6, longitude: 73.0 } // Islamabad
      const bearing = calculateInitialBearing(coords, KAABA)
      expect(bearing).toBeGreaterThanOrEqual(0)
      expect(bearing).toBeLessThan(360)
    })
  })

  describe('calculateDistance', () => {
    it('calculates distance from Makkah to itself as ~0', () => {
      const dist = calculateDistance(KAABA, KAABA)
      expect(dist).toBeLessThan(0.01) // essentially 0
    })

    it('calculates distance from New York to Kaaba (~10,000 km)', () => {
      const ny: Coordinates = { latitude: 40.7128, longitude: -74.006 }
      const dist = calculateDistance(ny, KAABA)
      expect(dist).toBeGreaterThan(9000)
      expect(dist).toBeLessThan(11000)
    })

    it('calculates distance from London to Kaaba (~4,800 km)', () => {
      const london: Coordinates = { latitude: 51.5074, longitude: -0.1278 }
      const dist = calculateDistance(london, KAABA)
      expect(dist).toBeGreaterThan(4500)
      expect(dist).toBeLessThan(5200)
    })

    it('calculates distance from Islamabad to Kaaba (~3,500 km)', () => {
      const islamabad: Coordinates = { latitude: 33.6, longitude: 73.0 }
      const dist = calculateDistance(islamabad, KAABA)
      expect(dist).toBeGreaterThan(3000)
      expect(dist).toBeLessThan(4000)
    })

    it('calculates distance from Kuala Lumpur to Kaaba (~7,000 km)', () => {
      const kl: Coordinates = { latitude: 3.139, longitude: 101.6869 }
      const dist = calculateDistance(kl, KAABA)
      expect(dist).toBeGreaterThan(6500)
      expect(dist).toBeLessThan(7500)
    })
  })

  describe('calculateQiblaDirection', () => {
    it('returns bearing, distance, direction, and degreesFromNorth', () => {
      const ny: Coordinates = { latitude: 40.7128, longitude: -74.006 }
      const result = calculateQiblaDirection(ny)
      expect(result).toHaveProperty('bearing')
      expect(result).toHaveProperty('distance')
      expect(result).toHaveProperty('direction')
      expect(result).toHaveProperty('degreesFromNorth')
      expect(result.degreesFromNorth).toBe(result.bearing)
    })

    it('returns a valid cardinal direction', () => {
      const ny: Coordinates = { latitude: 40.7128, longitude: -74.006 }
      const result = calculateQiblaDirection(ny)
      expect(['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']).toContain(result.direction)
    })

    it('produces consistent results for same location', () => {
      const coords: Coordinates = { latitude: 25.2048, longitude: 55.2708 } // Dubai
      const r1 = calculateQiblaDirection(coords)
      const r2 = calculateQiblaDirection(coords)
      expect(r1.bearing).toBe(r2.bearing)
      expect(r1.distance).toBe(r2.distance)
    })
  })
})

describe('helpers', () => {
  describe('normalizeAngle', () => {
    it('normalizes 0 to 0', () => {
      expect(normalizeAngle(0)).toBe(0)
    })

    it('normalizes 360 to 0', () => {
      expect(normalizeAngle(360)).toBe(0)
    })

    it('normalizes -90 to 270', () => {
      expect(normalizeAngle(-90)).toBe(270)
    })

    it('normalizes 450 to 90', () => {
      expect(normalizeAngle(450)).toBe(90)
    })

    it('normalizes -360 to 0', () => {
      expect(normalizeAngle(-360) === 0).toBe(true)
    })

    it('keeps positive angles in range', () => {
      expect(normalizeAngle(180)).toBe(180)
      expect(normalizeAngle(270)).toBe(270)
    })
  })

  describe('formatBearing', () => {
    it('formats 0 as "0°"', () => {
      expect(formatBearing(0)).toBe('0°')
    })

    it('formats 180 as "180°"', () => {
      expect(formatBearing(180)).toBe('180°')
    })

    it('formats 215.7 as "216°"', () => {
      expect(formatBearing(215.7)).toBe('216°')
    })

    it('rounds to nearest integer', () => {
      expect(formatBearing(45.4)).toBe('45°')
      expect(formatBearing(45.6)).toBe('46°')
    })
  })

  describe('getDirectionLabel', () => {
    it('returns "North" for 0°', () => {
      expect(getDirectionLabel(0)).toBe('North')
    })

    it('returns "East" for 90°', () => {
      expect(getDirectionLabel(90)).toBe('East')
    })

    it('returns "South" for 180°', () => {
      expect(getDirectionLabel(180)).toBe('South')
    })

    it('returns "West" for 270°', () => {
      expect(getDirectionLabel(270)).toBe('West')
    })

    it('returns "North-East" for 45°', () => {
      expect(getDirectionLabel(45)).toBe('North-East')
    })

    it('returns "South-West" for 225°', () => {
      expect(getDirectionLabel(225)).toBe('South-West')
    })

    it('handles edge cases at boundaries', () => {
      expect(getDirectionLabel(22.4)).toBe('North')
      expect(getDirectionLabel(22.5)).toBe('North-East')
      expect(getDirectionLabel(67.4)).toBe('North-East')
      expect(getDirectionLabel(67.5)).toBe('East')
    })

    it('wraps 360 to North', () => {
      expect(getDirectionLabel(360)).toBe('North')
    })
  })

  describe('formatDistance', () => {
    it('formats distances under 1km in meters', () => {
      expect(formatDistance(0.5)).toBe('500 m')
    })

    it('formats 0km as "0 m"', () => {
      expect(formatDistance(0)).toBe('0 m')
    })

    it('formats distances under 100km with 1 decimal', () => {
      expect(formatDistance(50.5)).toBe('50.5 km')
      expect(formatDistance(12.3)).toBe('12.3 km')
    })

    it('formats distances 100km+ rounded', () => {
      expect(formatDistance(150.7)).toBe('151 km')
      expect(formatDistance(1000)).toBe('1,000 km')
    })
  })

  describe('smoothHeading', () => {
    it('returns same heading when no smoothing (factor=1)', () => {
      expect(smoothHeading(90, 0, 1)).toBe(90)
    })

    it('returns previous heading when factor=0', () => {
      expect(smoothHeading(90, 45, 0)).toBe(45)
    })

    it('smooths between two headings', () => {
      const result = smoothHeading(90, 0, 0.5)
      expect(result).toBe(45)
    })

    it('handles wrap-around from 350 to 10', () => {
      // 350 -> 10: diff is +20, with factor 0.5 -> 350 + 10 = 360 -> 0
      const result = smoothHeading(10, 350, 0.5)
      expect(result).toBe(0)
    })

    it('handles wrap-around from 10 to 350', () => {
      // 10 -> 350: diff is -20, with factor 0.5 -> 10 - 10 = 0
      const result = smoothHeading(350, 10, 0.5)
      expect(result).toBe(0)
    })

    it('smooths a small change', () => {
      const result = smoothHeading(46, 45, 0.3)
      expect(result).toBeCloseTo(45.3, 0)
    })
  })
})

describe('constants', () => {
  it('Kaaba coordinates are correct', () => {
    expect(KAABA.latitude).toBeCloseTo(21.4225, 3)
    expect(KAABA.longitude).toBeCloseTo(39.8262, 3)
  })

  it('Earth radius is approximately correct', () => {
    expect(EARTH_RADIUS_KM).toBe(6371)
  })
})
