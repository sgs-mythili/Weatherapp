import { z } from "zod";

export const weatherDataSchema = z.object({
  city: z.string(),
  temperature: z.number(),
  humidity: z.number(),
  windSpeed: z.number(),
  feelsLike: z.number(),
});

export const forecastDaySchema = z.object({
  date: z.string(),
  temperatureMax: z.number(),
  temperatureMin: z.number(),
  weatherCode: z.number(),
  precipitationProbability: z.number().nullable(),
});

export const cityForecastSchema = z.object({
  city: z.string(),
  days: z.array(forecastDaySchema),
});

export const favoriteCityResponseSchema = z.object({
  id: z.number(),
  city: z.string(),
  temperature: z.union([z.string(), z.number()]),
  nickname: z.string().nullable(),
  notes: z.string().nullable(),
  tenant_id: z.string(),
  created_at: z.string(),
});

export const favoritesListResponseSchema = z.object({
  status: z.string(),
  data: z.array(favoriteCityResponseSchema),
  pagination: z.object({
    totalCount: z.number(),
    totalPages: z.number(),
    page: z.number(),
    limit: z.number(),
  }),
});

export const apiMessageResponseSchema = z.object({
  status: z.string(),
  message: z.string().optional(),
  data: z.unknown().optional(),
});