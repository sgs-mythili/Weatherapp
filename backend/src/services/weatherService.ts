import Boom from "@hapi/boom";
import { config } from "../config/env";
import type { WeatherData } from "../types/weather";
import { NotFoundError } from "../errors";
import { InternalServerError } from "../errors";
import type { CityForecast, ForecastDay } from "../types/weather";

export async function getWeather(city: string): Promise<WeatherData> {
  try {
    const locationResponse = await fetch(
      `${config.geocodingApiUrl}?name=${encodeURIComponent(city)}&count=1`,
    );

    if (!locationResponse.ok) {
     throw InternalServerError(
      "WEATHER_SERVICE_ERROR",
      "Unable to reach the geocoding service"
    );
    }

    const locationData = await locationResponse.json();

    if (!locationData.results || locationData.results.length === 0) {
      throw NotFoundError("CITY_NOT_FOUND", "Favorite city not found");    }

    const location = locationData.results[0];

    const weatherResponse = await fetch(
      `${config.weatherApiUrl}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m`,
    );

    if (!weatherResponse.ok) {
      throw NotFoundError("WEATHER_NOT_FOUND", "Unable to fetch weather data");
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

  throw InternalServerError(
    "WEATHER_SERVICE_ERROR",
    "Unable to fetch weather data"
  );
}
}

export async function getFiveDayForecast(
  city: string
): Promise<CityForecast> {
  try {
    // STEP 1: Get city coordinates
    const locationResponse = await fetch(
      `${config.geocodingApiUrl}?name=${encodeURIComponent(city)}&count=1`
    );

    if (!locationResponse.ok) {
      throw InternalServerError(
        "WEATHER_SERVICE_ERROR",
        "Unable to reach the geocoding service"
      );
    }

    const locationData = await locationResponse.json();

    if (
      !locationData.results ||
      locationData.results.length === 0
    ) {
      throw NotFoundError(
        "CITY_NOT_FOUND",
        "City not found"
      );
    }

    const location = locationData.results[0];

    // STEP 2: Fetch five-day forecast
    const forecastUrl = new URL(config.weatherApiUrl);

    forecastUrl.searchParams.set(
      "latitude",
      String(location.latitude)
    );

    forecastUrl.searchParams.set(
      "longitude",
      String(location.longitude)
    );

    forecastUrl.searchParams.set(
      "daily",
      [
        "temperature_2m_max",
        "temperature_2m_min",
        "weather_code",
        "precipitation_probability_max",
      ].join(",")
    );

    forecastUrl.searchParams.set("forecast_days", "5");
    forecastUrl.searchParams.set("timezone", "auto");

    const forecastResponse = await fetch(forecastUrl.toString());

    if (!forecastResponse.ok) {
      throw InternalServerError(
        "WEATHER_SERVICE_ERROR",
        "Unable to fetch forecast data"
      );
    }

    const forecastData = await forecastResponse.json();

    // STEP 3: Convert daily arrays into objects
    const daily = forecastData.daily;

    if (
      !daily ||
      !Array.isArray(daily.time) ||
      daily.time.length !== 5
    ) {
      throw InternalServerError(
        "WEATHER_SERVICE_ERROR",
        "Invalid forecast response"
      );
    }

    const days: ForecastDay[] = daily.time.map(
      (date: string, index: number) => ({
        date,
        temperatureMax:
          daily.temperature_2m_max[index],
        temperatureMin:
          daily.temperature_2m_min[index],
        weatherCode:
          daily.weather_code[index],
        precipitationProbability:
          daily.precipitation_probability_max[index] ??
          null,
      })
    );

    return {
      city: location.name,
      days,
    };
  } catch (error) {
    console.error("Five-day forecast error:", error);

    // Preserve standardized domain errors
    if (Boom.isBoom(error)) {
      throw error;
    }

    throw InternalServerError(
      "WEATHER_SERVICE_ERROR",
      "Unable to fetch five-day forecast"
    );
  }
}
