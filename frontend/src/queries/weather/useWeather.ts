import { useQuery } from "@tanstack/react-query";

import { getWeather } from "../../services/weatherApi";
import { weatherKeys } from "../weatherkeys";

export function useWeather(city: string) {
  return useQuery({
    queryKey: weatherKeys.city(city),
    queryFn: () => getWeather(city),
    enabled: Boolean(city.trim()),
    refetchOnWindowFocus: true,
  });
}