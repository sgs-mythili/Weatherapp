import { Op, type WhereOptions } from "sequelize";
import FavoriteModel from "../models/favoriteModel";

// CREATE
export async function createFavorite(
  city: string,
  temperature: number,
  tenantId: string,
  nickname?: string,
  notes?: string
) {
  const favorite = await FavoriteModel.create({
    city,
    temperature,
    tenant_id: tenantId,
    nickname: nickname || null,
    notes: notes || null,
  });

  return favorite.get({ plain: true });
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
    limit: number| "all";
    search?: string;
  }
) {
  const keyword = search?.trim();

  const pattern = keyword ? `%${keyword.replace(/[\\%_]/g, "\\$&")}%` : "";

const where: WhereOptions = keyword
  ? {
      [Op.and]: [
        { tenant_id: tenantId },
        {
          [Op.or]: [
            {
              city: {
                [Op.iLike]: pattern,
              },
            },
            {
              nickname: {
                [Op.iLike]: pattern,
              },
            },
          ],
        },
      ],
    }
  : {
      tenant_id: tenantId,
    };

  
  const isAll = limit === "all";

  const queryOptions = {
    where,
    order: [
      ["created_at", "DESC"],
      ["id", "DESC"],
    ] as [string, "DESC"][],
    ...(!isAll
      ? {
          limit,
          offset: (page - 1) * limit,
        }
      : {}),
  };

   const { count, rows } =
    await FavoriteModel.findAndCountAll(queryOptions);


  return {
    data: rows.map((favorite) =>
      favorite.get({ plain: true })
    ),
    totalCount: count,
    totalPages: isAll ? 1 : Math.ceil(count / (typeof limit === "number" ? limit : 5)),
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
  const favorite = await FavoriteModel.findOne({
    where: {
      id,
      tenant_id: tenantId,
    },
  });

  if (!favorite) {
    return null;
  }

  await favorite.update({
    nickname: nickname || null,
    notes: notes || null,
  });

  return favorite.get({ plain: true });
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
  const favorite = await FavoriteModel.findOne({
    where: {
      id,
      tenant_id: tenantId,
    },
  });

  if (!favorite) {
    return null;
  }

  const changes: {
    city?: string;
    nickname?: string | null;
    notes?: string | null;
  } = {};

  if (updates.city !== undefined) {
    changes.city = updates.city;
  }

  if (updates.nickname !== undefined) {
    changes.nickname = updates.nickname || null;
  }

  if (updates.notes !== undefined) {
    changes.notes = updates.notes || null;
  }

  if (Object.keys(changes).length > 0) {
    await favorite.update(changes);
  }

  return favorite.get({ plain: true });
}

// DELETE
export async function deleteFavorite(
  id: number,
  tenantId: string
): Promise<number | null> {
  const deletedCount = await FavoriteModel.destroy({
    where: {
      id,
      tenant_id: tenantId,
    },
  });

  return deletedCount > 0 ? id : null;
}