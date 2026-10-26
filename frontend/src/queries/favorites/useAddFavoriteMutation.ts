import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { addFavorite } from "../../services/weatherApi";
import { favoriteKeys } from "./favoriteKeys";
import type { WeatherData } from "../../types/weather";

export function useAddFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (weather: WeatherData) =>
      addFavorite(
        weather.city,
        weather.temperature,
        "",
        ""
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: favoriteKeys.all,
      });
    },
  });
}