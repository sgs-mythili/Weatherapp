export interface Favorite {
  id: number;
  city: string;
  temperature: string | number;
  nickname: string | null;
  notes: string | null;
  tenant_id: string;
  created_at: Date;
}