export interface WeatherData {
  temperature: number
  weatherCode: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
  feelsLike: number
}

export interface WeatherCache {
  data: WeatherData
  latitude: number
  longitude: number
  timestamp: number
}
