import { Op, type WhereOptions } from "sequelize";
import FavoriteModel from "../models/favoriteModel";

export type FavoriteChanges = {
  city?: string;
  nickname?: string | null;
  notes?: string | null;
};

// CREATE
export async function createFavoriteRecord(data: {
  city: string;
  temperature: number;
  tenant_id: string;
  nickname: string | null;
  notes: string | null;
}) {
  const favorite = await FavoriteModel.create(data);

  return favorite.get({ plain: true });
}

// GET WITH SEARCH AND PAGINATION
export async function findFavorites(
  tenantId: string,
  page: number,
  limit: number | "all",
  search?: string
) {
  const keyword = search?.trim();

  const pattern = keyword
    ? `%${keyword.replace(/[\\%_]/g, "\\$&")}%`
    : "";

  const where: WhereOptions = keyword
    ? {
        [Op.and]: [
          { tenant_id: tenantId },
          {
            [Op.or]: [
              { city: { [Op.iLike]: pattern } },
              { nickname: { [Op.iLike]: pattern } },
            ],
          },
        ],
      }
    : { tenant_id: tenantId };

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
    count,
    rows: rows.map((favorite) =>
      favorite.get({ plain: true })
    ),
  };
}

// FIND ONE
export async function findFavoriteById(
  id: number,
  tenantId: string
) {
  return FavoriteModel.findOne({
    where: {
      id,
      tenant_id: tenantId,
    },
  });
}

// UPDATE
export async function updateFavoriteRecord(
  id: number,
  tenantId: string,
  changes: FavoriteChanges
) {
  const favorite = await findFavoriteById(id, tenantId);

  if (!favorite) {
    return null;
  }

  if (Object.keys(changes).length > 0) {
    await favorite.update(changes);
  }

  return favorite.get({ plain: true });
}

// DELETE
export async function deleteFavoriteRecord(
  id: number,
  tenantId: string
) {
  return FavoriteModel.destroy({
    where: {
      id,
      tenant_id: tenantId,
    },
  });
}

export async function findByCity(
  tenantId: string,
  city: string
) {
  return FavoriteModel.findOne({
    where: {
      tenant_id: tenantId,
      city: {
        [Op.iLike]: city.trim()
      }
    },
  });
}