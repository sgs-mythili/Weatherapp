import { ApiService } from "./ApiService";

import type { WeatherData, CityForecast } from "../types/weather";

export async function getWeather(
  city: string
): Promise<WeatherData> {
  return ApiService.weather.getCurrent(city);
}

export async function getFiveDayForecast(
  city: string
): Promise<CityForecast> {
  return ApiService.weather.getForecast(city);
}

export async function getFavorites(
  page = 1,
  limit: number | "all" = 5,
  search = ""
) {
  return ApiService.favorites.getAll(page, limit, search);
}

export async function addFavorite(
  city: string,
  temperature: number,
  nickname: string,
  notes: string
) {
  return ApiService.favorites.add(
    city,
    temperature,
    nickname,
    notes
  );
}

export async function patchFavorite(
  id: string,
  updates: {
    city?: string;
    nickname?: string;
    notes?: string;
  }
) {
  return ApiService.favorites.update(id, updates);
}

export async function deleteFavorite(id: string) {
  return ApiService.favorites.delete(id);
}