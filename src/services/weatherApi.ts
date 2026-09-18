import type { WeatherData } from "../types/weather";

export async function getWeather(city: string): Promise<WeatherData> {
  const locationResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);

  if (!locationResponse.ok) {
    throw new Error("Unable to find city");
  }

  const locationData = await locationResponse.json();

  if (!locationData.results || locationData.results.length === 0) {
    throw new Error("City not found");
  }

  const location = locationData.results[0];

  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m`
  );

  if (!weatherResponse.ok) {
    throw new Error("Unable to fetch weather");
  }

  const weatherData = await weatherResponse.json();

  return {
    city: location.name,
    temperature: weatherData.current.temperature_2m,
    description: "Current weather",
    humidity: weatherData.current.relative_humidity_2m,
    windSpeed: weatherData.current.wind_speed_10m,
    feelsLike: weatherData.current.apparent_temperature,
  };
}