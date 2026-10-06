import { pool } from "../database/db";
import type { Favorite } from "../types/favorite";
const favoriteColumns = "id,city,temperature,nickname,notes,tenant_id,created_at";
export async function createFavorite(
  city: string,
  temperature: number,
  tenantId: string,
  nickname?: string,
  notes?: string
): Promise<Favorite> {
  const result = await pool.query(
    `INSERT INTO favorites (city, temperature, tenant_id, nickname, notes)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${favoriteColumns}`,
    [city, temperature, tenantId, nickname || null, notes || null]
  );
  return result.rows[0];
}
export async function getFavorites(tenantId: string): Promise<Favorite[]> {
  const result = await pool.query(
    `SELECT ${favoriteColumns}
     FROM favorites
     WHERE tenant_id = $1
     ORDER BY created_at DESC`,
    [tenantId]
  );
  return result.rows;
}
export async function updateFavorite(
  id: number,
  tenantId: string,
  nickname?: string,
  notes?: string
): Promise<Favorite | null> {
  const result = await pool.query(
    `UPDATE favorites
     SET nickname = $1,
         notes = $2
     WHERE id = $3
     AND tenant_id = $4
     RETURNING ${favoriteColumns}`,
    [nickname || null, notes || null, id, tenantId]
  );
  return result.rows[0] ?? null;
}
export async function patchFavorite(
  id: number,
  tenantId: string,
  updates: {
    city?: string;
    nickname?: string;
    notes?: string;
  }
): Promise<Favorite | null> {
  const fields: string[] = [];
  const values: Array<string | number | null> = [];
  if (updates.city !== undefined) {
    values.push(updates.city);
    fields.push(`city = $${values.length}`);
  }
  if (updates.nickname !== undefined) {
    values.push(updates.nickname || null);
    fields.push(`nickname = $${values.length}`);
  }
  if (updates.notes !== undefined) {
    values.push(updates.notes || null);
    fields.push(`notes = $${values.length}`);
  }
  values.push(id);
  const idIndex = values.length;
  values.push(tenantId);
  const tenantIndex = values.length;
  const result = await pool.query(
    `UPDATE favorites
     SET ${fields.join(", ")}
     WHERE id = $${idIndex}
     AND tenant_id = $${tenantIndex}
     RETURNING ${favoriteColumns}`,
    values
  );
  return result.rows[0] ?? null;
}
export async function deleteFavorite(
  id: number,
  tenantId: string
): Promise<number | null> {
  const result = await pool.query(
    `DELETE FROM favorites
     WHERE id = $1
     AND tenant_id = $2
     RETURNING id`,
    [id, tenantId]
  );
  return result.rows[0]?.id ?? null;
}