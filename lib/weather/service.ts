import type { WeatherData, WeatherCache } from './types'
import { getWeatherDescription } from './weather-codes'

const CACHE_KEY = 'dd-weather-cache'
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

function readCache(): WeatherCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as WeatherCache
  } catch {
    return null
  }
}

function writeCache(cache: WeatherCache): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    // Storage full or unavailable — degrade silently
  }
}

function coordsMatch(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): boolean {
  return (
    Math.abs(a.latitude - b.latitude) < 0.05 &&
    Math.abs(a.longitude - b.longitude) < 0.05
  )
}

export async function fetchWeather(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`

  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`)

  const json = await res.json()
  const current = json.current

  const { description, icon } = getWeatherDescription(current.weather_code)

  return {
    temperature: Math.round(current.temperature_2m),
    weatherCode: current.weather_code,
    description,
    icon,
    humidity: current.relative_humidity_2m,
    windSpeed: Math.round(current.wind_speed_10m),
    feelsLike: Math.round(current.apparent_temperature),
  }
}

export async function getWeather(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<WeatherData> {
  const cached = readCache()

  if (cached && coordsMatch(cached, { latitude, longitude }) && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  const data = await fetchWeather(latitude, longitude, signal)

  writeCache({
    data,
    latitude,
    longitude,
    timestamp: Date.now(),
  })

  return data
}

export function getCachedWeather(
  latitude: number,
  longitude: number,
): WeatherData | null {
  const cached = readCache()
  if (!cached) return null
  if (!coordsMatch(cached, { latitude, longitude })) return null
  return cached.data
}
