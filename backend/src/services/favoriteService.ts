import * as favoritesRepository from "../repositories/favoritesRepository";

// CREATE
export async function createFavorite(
  city: string,
  temperature: number,
  tenantId: string,
  nickname?: string,
  notes?: string
) {
  return favoritesRepository.createFavoriteRecord({
    city,
    temperature,
    tenant_id: tenantId,
    nickname: nickname || null,
    notes: notes || null,
  });
}

// GET WITH PAGINATION AND SEARCH
export async function getFavorites(
  tenantId: string,
  {
    page,
    limit,
    search,
  }: {
    page: number;
    limit: number | "all";
    search?: string;
  }
) {
  const { count, rows } =
    await favoritesRepository.findFavorites(
      tenantId,
      page,
      limit,
      search
    );

  const isAll = limit === "all";

  return {
    data: rows,
    totalCount: count,
    totalPages: isAll? 1: Math.ceil(count / limit),
    page,
    limit,
  };
}

// PUT
export async function updateFavorite(
  id: number,
  tenantId: string,
  nickname?: string,
  notes?: string
) {
  return favoritesRepository.updateFavoriteRecord(
    id,
    tenantId,
    {
      nickname: nickname || null,
      notes: notes || null,
    }
  );
}

// PATCH
export async function patchFavorite(
  id: number,
  tenantId: string,
  updates: {
    city?: string;
    nickname?: string;
    notes?: string;
  }
) {
  const changes: favoritesRepository.FavoriteChanges = {};

  if (updates.city !== undefined) {
    changes.city = updates.city;
  }

  if (updates.nickname !== undefined) {
    changes.nickname = updates.nickname || null;
  }

  if (updates.notes !== undefined) {
    changes.notes = updates.notes || null;
  }

  return favoritesRepository.updateFavoriteRecord(
    id,
    tenantId,
    changes
  );
}

// DELETE
export async function deleteFavorite(
  id: number,
  tenantId: string
): Promise<number | null> {
  const deletedCount =
    await favoritesRepository.deleteFavoriteRecord(
      id,
      tenantId
    );

  return deletedCount > 0 ? id : null;
}