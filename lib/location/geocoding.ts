import type { Coordinates, GeocodedLocation } from './types'

interface NominatimResult {
  lat: string
  lon: string
  address: {
    city?: string
    town?: string
    village?: string
    county?: string
    state?: string
    country?: string
    country_code?: string
  }
  display_name: string
}

function getTimezoneFromCoords(lat: number, lon: number): string {
  try {
    // Use a fallback mapping for common regions
    const timezones: Array<{ lat: number; lon: number; tz: string }> = [
      { lat: 21.42, lon: 39.82, tz: 'Asia/Riyadh' },
      { lat: 24.47, lon: 46.67, tz: 'Asia/Riyadh' },
      { lat: 25.29, lon: 51.53, tz: 'Asia/Qatar' },
      { lat: 25.23, lon: 55.27, tz: 'Asia/Dubai' },
      { lat: 33.89, lon: 35.5, tz: 'Asia/Beirut' },
      { lat: 30.04, lon: 31.24, tz: 'Africa/Cairo' },
      { lat: 39.93, lon: 32.85, tz: 'Europe/Istanbul' },
      { lat: 35.68, lon: 51.39, tz: 'Asia/Tehran' },
      { lat: 33.6, lon: 73.0, tz: 'Asia/Karachi' },
      { lat: 1.35, lon: 103.82, tz: 'Asia/Singapore' },
      { lat: 51.51, lon: -0.13, tz: 'Europe/London' },
      { lat: 40.71, lon: -74.01, tz: 'America/New_York' },
      { lat: 34.05, lon: -118.24, tz: 'America/Los_Angeles' },
      { lat: 55.76, lon: 37.62, tz: 'Europe/Moscow' },
      { lat: 48.86, lon: 2.35, tz: 'Europe/Paris' },
      { lat: 52.52, lon: 13.41, tz: 'Europe/Berlin' },
    ]

    let closest = timezones[0]
    let minDist = Infinity
    for (const tz of timezones) {
      const d = Math.hypot(lat - tz.lat, lon - tz.lon)
      if (d < minDist) {
        minDist = d
        closest = tz
      }
    }
    return closest.tz
  } catch {
    return 'UTC'
  }
}

export async function reverseGeocode(
  coords: Coordinates,
  signal?: AbortSignal,
): Promise<GeocodedLocation> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.searchParams.set('lat', String(coords.latitude))
  url.searchParams.set('lon', String(coords.longitude))
  url.searchParams.set('format', 'json')
  url.searchParams.set('zoom', '10')

  const response = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'DailyDeen/1.0 (islamic-app)',
    },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Geocoding failed: ${response.status}`)
  }

  const data: NominatimResult = await response.json()
  const city =
    data.address.city ??
    data.address.town ??
    data.address.village ??
    data.address.county ??
    data.address.state ??
    'Unknown'

  const country = data.address.country ?? 'Unknown'
  const timezone = getTimezoneFromCoords(coords.latitude, coords.longitude)

  return { city, country, timezone, coordinates: coords }
}

export async function forwardGeocode(
  query: string,
  signal?: AbortSignal,
): Promise<GeocodedLocation[]> {
  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '5')
  url.searchParams.set('addressdetails', '1')

  const response = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'DailyDeen/1.0 (islamic-app)',
    },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Geocoding failed: ${response.status}`)
  }

  const results: NominatimResult[] = await response.json()

  return results.map((r) => {
    const lat = parseFloat(r.lat) || 0
    const lon = parseFloat(r.lon) || 0
    return {
      city:
        r.address.city ??
        r.address.town ??
        r.address.village ??
        r.address.county ??
        r.address.state ??
        'Unknown',
      country: r.address.country ?? 'Unknown',
      timezone: getTimezoneFromCoords(lat, lon),
      coordinates: { latitude: lat, longitude: lon },
    }
  })
}
