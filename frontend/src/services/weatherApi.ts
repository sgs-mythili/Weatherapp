import type { WeatherData } from "../types/weather";

const API_URL = import.meta.env.VITE_API_URL;
const TENANT_ID = import.meta.env.VITE_TENANT_ID;

export async function getWeather(city: string): Promise<WeatherData> {
  const response = await fetch(
    `${API_URL}/weather?city=${encodeURIComponent(city)}`,
    {
      method: "GET",
      headers: {
        "x-tenant-id": TENANT_ID,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to fetch weather");
  }

  return {
    city: data.data.city,
    temperature: data.data.temperature,
    description: "Current weather",
    humidity: data.data.humidity,
    windSpeed: data.data.windSpeed,
    feelsLike: data.data.feelsLike,
  };
}

export async function addFavorite(city: string,temperature: number) {
  const response = await fetch(`${API_URL}/favorites`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": "tenant-123",
    },

    body: JSON.stringify({
      city,
      temperature,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to add favorite");
  }

  return data;
}