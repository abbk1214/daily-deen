import type { CalculationMethodParams } from './types'

export const CALCULATION_METHODS: Record<string, CalculationMethodParams> = {
  MuslimWorldLeague: {
    name: 'Muslim World League',
    fajrAngle: 18,
    ishaAngle: 17,
  },
  NorthAmerica: {
    name: 'ISNA',
    fajrAngle: 15,
    ishaAngle: 15,
  },
  Egyptian: {
    name: 'Egyptian',
    fajrAngle: 19.5,
    ishaAngle: 17.5,
  },
  UmmAlQura: {
    name: 'Umm Al-Qura',
    fajrAngle: 18.5,
    ishaMinutes: 90,
  },
  Karachi: {
    name: 'Karachi',
    fajrAngle: 18,
    ishaAngle: 18,
  },
  Tehran: {
    name: 'Tehran',
    fajrAngle: 17.7,
    ishaAngle: 14,
    maghribMinutes: 4.5,
  },
  Dubai: {
    name: 'Gulf Region',
    fajrAngle: 18.2,
    ishaAngle: 18.2,
  },
  Kuwait: {
    name: 'Kuwait',
    fajrAngle: 18,
    ishaAngle: 17.5,
  },
  Qatar: {
    name: 'Qatar',
    fajrAngle: 18,
    ishaAngle: 18,
  },
  Singapore: {
    name: 'Singapore',
    fajrAngle: 20,
    ishaAngle: 18,
  },
  Turkey: {
    name: 'Turkey',
    fajrAngle: 18,
    ishaAngle: 17,
  },
}

export function getCalculationMethod(key: string): CalculationMethodParams {
  return CALCULATION_METHODS[key] ?? CALCULATION_METHODS.MuslimWorldLeague
}
