export interface Favorite {
  id: number;
  city: string;
  temperature: string | number;
  nickname: string | null;
  notes: string | null;
  tenant_id: string;
  created_at: Date;
}

export interface CreateFavoritePayload{
  city: string;
  temperature: number;
  nickname?: string | null;
  notes?: string | null;
}

export interface GetFavoritesQuery {
  page?: number;
  limit?: number|"all";
  search?: string;
}

export interface UpdateFavoritePayload{
  nickname?: string | null;
  notes?: string | null;
}

export interface PatchFavoritePayload{
  city?: string;
  nickname?: string | null;
  notes?: string | null;
}

export interface FavoriteIdParams{
  id: string
}