import type { Coordinates, GeocodedLocation } from './types'
import tzlookup from 'tz-lookup'

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
    return tzlookup(lat, lon)
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
