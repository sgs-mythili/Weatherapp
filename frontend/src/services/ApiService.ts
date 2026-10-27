import { z } from "zod";

import {
  weatherDataSchema,
  cityForecastSchema,
  favoritesListResponseSchema,
  favoriteCityResponseSchema,
} from "./apiSchemas";

const API_URL = import.meta.env.VITE_API_URL;
const TENANT_ID = import.meta.env.VITE_TENANT_ID;

async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "x-tenant-id": TENANT_ID,
      ...(options.body
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    },
  });

  let body: unknown;

  try {
    body = await response.json();
  } catch {
    throw new Error(
      `API ${path} returned invalid JSON (HTTP ${response.status})`
    );
  }

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : `API request failed (HTTP ${response.status})`;

    throw new Error(message);
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw new Error(
      `Invalid API response for ${path}: ${JSON.stringify(parsed.error.message)}`
    );
  }

  return parsed.data;
}

// const successSchema = z.object({
//   status: z.string(),
//   data: z.unknown(),
// });

const weatherResponseSchema = z.object({
  status: z.string(),
  data: weatherDataSchema,
});

const forecastResponseSchema = z.object({
  status: z.string(),
  data: cityForecastSchema,
});

const favoriteResponseSchema = z.object({
  status: z.string(),
  message: z.string().optional(),
  data: favoriteCityResponseSchema,
});

const deleteFavoriteResponseSchema = z.object({
  status: z.string(),
  message: z.string().optional(),
  data: z.object({
    id: z.number(),
  }),
});

export const ApiService = {
  weather: {
    async getCurrent(city: string) {
      const result = await request(
        `/weather?city=${encodeURIComponent(city)}`,
        weatherResponseSchema
      );

      return {
        ...result.data,
        description: "Current weather",
      };
    },

    async getForecast(city: string) {
      const result = await request(
        `/weather/forecast?city=${encodeURIComponent(city)}`,
        forecastResponseSchema
      );

      return result.data;
    },
  },

  favorites: {
    getAll(
      page = 1,
      limit: number | "all" = 5,
      search = ""
    ) {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (search.trim()) {
        params.set("search", search.trim());
      }

      return request(
        `/favorites?${params.toString()}`,
        favoritesListResponseSchema
      );
    },

    add(
      city: string,
      temperature: number,
      nickname: string,
      notes: string
    ) {
      return request(
        "/favorites",
        favoriteResponseSchema,
        {
          method: "POST",
          body: JSON.stringify({
            city,
            temperature,
            nickname,
            notes,
          }),
        }
      );
    },

    update(
      id: string,
      updates: {
        city?: string;
        nickname?: string;
        notes?: string;
      }
    ) {
      return request(
        `/favorites/${encodeURIComponent(id)}`,
        favoriteResponseSchema,
        {
          method: "PATCH",
          body: JSON.stringify(updates),
        }
      );
    },

    delete(id: string) {
      return request(
        `/favorites/${encodeURIComponent(id)}`,
        deleteFavoriteResponseSchema,
        { method: "DELETE" }
      );
    },
  },
};