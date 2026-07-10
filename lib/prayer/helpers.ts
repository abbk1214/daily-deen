const DEG_TO_RAD = Math.PI / 180
const RAD_TO_DEG = 180 / Math.PI

export function dmsToDeg(d: number, m: number, s: number): number {
  return d + m / 60 + s / 3600
}

export function fixAngle(a: number): number {
  return fix(a, 360)
}

export function fixHour(a: number): number {
  return fix(a, 24)
}

function fix(a: number, b: number): number {
  a = a - b * Math.floor(a / b)
  return a < 0 ? a + b : a
}

export function julianDate(year: number, month: number, day: number): number {
  const y = month <= 2 ? year - 1 : year
  const m = month <= 2 ? month + 12 : month
  const A = Math.floor(y / 100)
  const B = 2 - A + Math.floor(A / 4)
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    B -
    1524.5
  )
}

export function julianCentury(jd: number): number {
  return (jd - 2451545.0) / 36525.0
}

export function sunDeclination(tc: number): number {
  const L0 = fixAngle(280.46646 + tc * (36000.76983 + 0.0003032 * tc))
  const M = fixAngle(357.52911 + tc * (35999.05029 - 0.0001537 * tc))
  const Mrad = M * DEG_TO_RAD
  const C =
    (1.9146 - tc * (0.004817 + 0.000014 * tc)) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * tc) * Math.sin(2 * Mrad) +
    0.00029 * Math.sin(3 * Mrad)
  const sunLong = L0 + C
  const epsilon = 23.439 - 0.00000036 * tc
  const epsilonRad = epsilon * DEG_TO_RAD
  const lambda = (sunLong - 0.00569) * DEG_TO_RAD
  const sinLambda = Math.sin(lambda)
  const sinEpsilon = Math.sin(epsilonRad)
  return Math.asin(sinLambda * sinEpsilon) * RAD_TO_DEG
}

export function equationOfTime(tc: number): number {
  const L0 = fixAngle(280.46646 + tc * (36000.76983 + 0.0003032 * tc))
  const M = fixAngle(357.52911 + tc * (35999.05029 - 0.0001537 * tc))
  const Mrad = M * DEG_TO_RAD
  const C =
    (1.9146 - tc * (0.004817 + 0.000014 * tc)) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * tc) * Math.sin(2 * Mrad) +
    0.00029 * Math.sin(3 * Mrad)
  const sunLong = L0 + C
  const epsilon = 23.439 - 0.00000036 * tc
  const epsilonRad = epsilon * DEG_TO_RAD
  const lambda = (sunLong - 0.00569) * DEG_TO_RAD
  const alpha = Math.atan2(
    Math.cos(epsilonRad) * Math.sin(lambda),
    Math.cos(lambda),
  )
  return (L0 - alpha * RAD_TO_DEG) * 4 / 60
}

export function midDay(tc: number, time: number): number {
  const eqt = equationOfTime(tc + time / 1440)
  return fixHour(12 + time / 60 - eqt / 60)
}

export function sunAngleTime(
  tc: number,
  angle: number,
  time: number,
  direction: 'ccw' | 'cw',
): number {
  const mid = midDay(tc, time)
  const decl = sunDeclination(tc)
  const latRad = 0
  const declRad = decl * DEG_TO_RAD
  const angleRad = -angle * DEG_TO_RAD
  const cosHA =
    (Math.sin(angleRad) - Math.sin(latRad) * Math.sin(declRad)) /
    (Math.cos(latRad) * Math.cos(declRad))
  const ha = Math.acos(cosHA) * RAD_TO_DEG / 15
  return direction === 'cw' ? mid + ha : mid - ha
}

export function asrAngle(factor: number, decl: number, latitude: number): number {
  const declRad = decl * DEG_TO_RAD
  const latRad = latitude * DEG_TO_RAD
  const angle = Math.atan(1 / (factor + Math.abs(Math.tan(latRad - declRad))))
  return angle * RAD_TO_DEG
}

export function computeAsrTime(
  tc: number,
  factor: number,
  decl: number,
  latitude: number,
): number {
  const asrAng = asrAngle(factor, decl, latitude)
  const mid = midDay(tc, 0)
  const declRad = decl * DEG_TO_RAD
  const latRad = latitude * DEG_TO_RAD
  const angleRad = -asrAng * DEG_TO_RAD
  const cosHA =
    (Math.sin(angleRad) - Math.sin(latRad) * Math.sin(declRad)) /
    (Math.cos(latRad) * Math.cos(declRad))
  const ha = Math.acos(Math.max(-1, Math.min(1, cosHA))) * RAD_TO_DEG / 15
  return mid + ha
}

export { DEG_TO_RAD, RAD_TO_DEG }
