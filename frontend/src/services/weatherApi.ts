import type { WeatherData } from "../types/weather";
import type { FavoriteCityResponse } from "../types/city";

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

export async function addFavorite(
  city: string,
  temperature: number,
  nickname: string,
  notes: string

) {
  const response = await fetch(`${API_URL}/favorites`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": TENANT_ID,
    },

    body: JSON.stringify({
      city,
      temperature,
      nickname,
      notes
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to add favorite");
  }

  return data;
}

export async function getFavorites(
  page = 1,
  limit = 5,
  search = ""
): Promise<{
  status: string;
  data: FavoriteCityResponse[];
  pagination: {
    totalCount: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search.trim()) {
    params.set("search", search.trim());
  }

  const response = await fetch(`${API_URL}/favorites?${params.toString()}`, {
    method: "GET",
    headers: {
      "x-tenant-id": TENANT_ID,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to fetch favorites");
  }

  return data;
}

export async function deleteFavorite(id: string) {
  const response = await fetch(`${API_URL}/favorites/${id}`, {
    method: "DELETE",

    headers: {
      "x-tenant-id": TENANT_ID,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to delete favorite");
  }

  return data;
}

export async function updateFavorite(id: string,nickname: string,notes: string) {
  const response = await fetch(`${API_URL}/favorites/${id}`,{
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        "x-tenant-id": TENANT_ID,
      },

      body: JSON.stringify({
        nickname,
        notes,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to update favorite"
    );
  }

  return data;
}

export async function patchFavorite(
  id: string,
  updates: {
    city?: string;
    nickname?: string;
    notes?: string;
  }
) {
  const response = await fetch(`${API_URL}/favorites/${id}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": TENANT_ID,
    },

    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to update favorite");
  }

  return data;
}


