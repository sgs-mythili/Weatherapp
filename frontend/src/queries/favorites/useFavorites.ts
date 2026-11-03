import { useQuery } from "@tanstack/react-query";

import { getFavorites } from "../../services/weatherApi";
import { useWeatherStore } from "../../store/weatherStore";

import {
  favoriteKeys,
  type FavoriteFilters,
} from "./favoriteKeys";

export function useFavorites(params: FavoriteFilters) {
  const currentTenant = useWeatherStore(
    (state) => state.currentTenant
  );

  return useQuery({
    queryKey: favoriteKeys.list(params, currentTenant),

    queryFn: () =>
      getFavorites(
        params.page,
        params.limit,
        params.search ?? ""
      ),
  });
}