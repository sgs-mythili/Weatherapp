export interface FavoriteCity {
  id: string;
  name: string;
  temperature: number|null;
  nickname: string | null;
  notes: string | null;
}

export interface FavoriteCityResponse {
id: number;
city: string;
temperature: string|number|null;
nickname: string | null;
notes: string | null;
tenant_id: string;
created_at: string;
}