import { useQuery } from "@tanstack/react-query";

import { getFiveDayForecast } from "../../services/weatherApi";

export const forecastKeys = {
  all: ["forecast"] as const,
  city: (city: string) =>
    [...forecastKeys.all, city] as const,
};

export function useFiveDayForecast(city: string | undefined) {
  return useQuery({
    queryKey: forecastKeys.city(city ?? ""),
    queryFn: () => getFiveDayForecast(city!),
    enabled: Boolean(city?.trim()),
    retry: 1,
  });
}