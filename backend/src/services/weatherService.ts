import Boom from "@hapi/boom";
import { config } from "../config/env";
import type { WeatherData } from "../types/weather";

export async function getWeather(city: string): Promise<WeatherData> {
  try {
    const locationResponse = await fetch(
      `${config.geocodingApiUrl}?name=${encodeURIComponent(city)}&count=1`,
    );

    if (!locationResponse.ok) {
      throw new Error("Unable to find city");
    }

    const locationData = await locationResponse.json();

    if (!locationData.results || locationData.results.length === 0) {
      throw Boom.notFound("City not found");
    }

    const location = locationData.results[0];

    const weatherResponse = await fetch(
      `${config.weatherApiUrl}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m`,
    );

    if (!weatherResponse.ok) {
      throw new Error("Unable to fetch weather");
    }

    const weatherData = await weatherResponse.json();

    return {
      city: location.name,
      temperature: weatherData.current.temperature_2m,
      humidity: weatherData.current.relative_humidity_2m,
      feelsLike: weatherData.current.apparent_temperature,
      windSpeed: weatherData.current.wind_speed_10m,
    };
  } catch (error) {
    console.error("Weather API error:", error);

    if (Boom.isBoom(error)) {
      throw error;
    }

    throw Boom.badGateway("Unable to fetch weather data");
  }
}