import { useQuery } from "@tanstack/react-query";

import { getFavorites } from "../../services/weatherApi";
import { favoriteKeys, type FavoriteFilters } from "./favoriteKeys";

export function useFavorites(params: FavoriteFilters) {
  return useQuery({
    queryKey: favoriteKeys.list(params),
    queryFn: () =>
      getFavorites(
        params.page,
        params.limit,
        params.search ?? ""
      ),
  });
}