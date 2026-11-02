export interface FavoriteFilters {
  page: number;
  limit: number | "all";
  search?: string;
}

export const favoriteKeys = {
  all: ["favorites"] as const,

  lists: () => [...favoriteKeys.all, "list"] as const,

  list: (filters: FavoriteFilters, tenantId: string) =>
    [...favoriteKeys.lists(), filters, tenantId] as const,

  details: () => [...favoriteKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...favoriteKeys.details(), id] as const,
};