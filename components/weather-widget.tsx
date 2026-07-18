"use client";

import { useState, useEffect } from "react";
import {
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudSun,
} from "lucide-react";

interface WeatherData {
  temperature: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  description: string;
}

function getWeatherIconProps(code: number): { Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>; className: string } {
  if (code === 0) return { Icon: Sun, className: "text-lantern-gold" };
  if (code <= 3) return { Icon: CloudSun, className: "text-muted-foreground" };
  if (code <= 49) return { Icon: CloudFog, className: "text-muted-foreground" };
  if (code <= 59) return { Icon: CloudRain, className: "text-dusk-teal" };
  if (code <= 69) return { Icon: CloudRain, className: "text-dusk-teal" };
  if (code <= 79) return { Icon: CloudSnow, className: "text-muted-foreground" };
  if (code <= 82) return { Icon: CloudRain, className: "text-dusk-teal" };
  if (code <= 86) return { Icon: CloudSnow, className: "text-muted-foreground" };
  if (code <= 99) return { Icon: CloudLightning, className: "text-lantern-gold" };
  return { Icon: Sun, className: "text-lantern-gold" };
}

function getWeatherDescription(code: number): string {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 49) return "Foggy";
  if (code <= 59) return "Drizzle";
  if (code <= 69) return "Rain";
  if (code <= 79) return "Snow";
  if (code <= 82) return "Rain showers";
  if (code <= 86) return "Snow showers";
  if (code <= 99) return "Thunderstorm";
  return "Clear";
}

function getWeatherTip(code: number, temp: number): string {
  if (code === 0 && temp > 20) return "Perfect day for outdoor activities!";
  if (code === 0) return "Clear skies \u2014 great for a walk.";
  if (code <= 3) return "Nice weather \u2014 consider outdoor exercise.";
  if (code <= 59) return "Bring an umbrella if going out.";
  if (code <= 69) return "Stay dry \u2014 indoor workout today?";
  if (code <= 79) return "Bundle up if going outside.";
  if (code <= 99) return "Stay safe indoors today.";
  if (temp > 35) return "Stay hydrated \u2014 drink extra water!";
  if (temp < 5) return "Cold day \u2014 warm up with a hot drink.";
  return "";
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadWeather() {
      const cached = localStorage.getItem("weather-cache");
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < 60 * 60 * 1000) {
          setWeather(data);
          setLoading(false);
          return;
        }
      }

      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            enableHighAccuracy: false,
          });
        });

        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`,
        );

        if (!res.ok) throw new Error("Weather API error");

        const data = await res.json();
        const current = data.current;

        const weatherData: WeatherData = {
          temperature: Math.round(current.temperature_2m),
          weatherCode: current.weather_code,
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m),
          feelsLike: Math.round(current.apparent_temperature),
          description: getWeatherDescription(current.weather_code),
        };

        setWeather(weatherData);
        localStorage.setItem("weather-cache", JSON.stringify({ data: weatherData, ts: Date.now() }));
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    }

    loadWeather();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 animate-pulse">
        <div className="h-4 w-20 rounded bg-muted mb-2" />
        <div className="h-8 w-16 rounded bg-muted" />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
          Weather unavailable
        </p>
      </div>
    );
  }

  const tip = getWeatherTip(weather.weatherCode, weather.temperature);
  const { Icon: WeatherIcon, className: iconClass } = getWeatherIconProps(weather.weatherCode);

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-foreground" style={{ fontSize: "28px", fontWeight: 600, lineHeight: 1, letterSpacing: "-0.02em" }}>
            {weather.temperature}&deg;
          </p>
          <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)", marginTop: "2px" }}>
            {weather.description}
          </p>
        </div>
        <WeatherIcon size={28} strokeWidth={1.5} className={iconClass} />
      </div>
      {tip && (
        <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)", marginTop: "var(--space-3)" }}>
          {tip}
        </p>
      )}
    </div>
  );
}
