import type { WeatherData } from "../types/weather";

const API_URL = "http://localhost:3000";

export async function getWeather(city: string): Promise<WeatherData> {
  const response = await fetch(
    `${API_URL}/weather?city=${encodeURIComponent(city)}`,
    {
      method: "GET",
      headers: {
        "x-tenant-id": "tenant-123",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to fetch weather");
  }

  return {
    city: data.city,
    temperature: data.temperature,
    description: "Current weather",
    humidity: data.humidity,
    windSpeed: data.windSpeed,
    feelsLike: data.feelsLike,
  };
}

export async function addFavorite(city: string) {
  const response = await fetch(`${API_URL}/favorites`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": "tenant-123",
    },

    body: JSON.stringify({
      city,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to add favorite");
  }

  return data;
}