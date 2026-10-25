import type { Request, ResponseToolkit } from "@hapi/hapi";

import { validateTenant } from "../utils/validateTenant";

import {
  createFavorite,
  getFavorites,
  updateFavorite,
  patchFavorite,
  deleteFavorite,
} from "../services/favoriteService";

import type {
  CreateFavoritePayload,
  GetFavoritesQuery,
  UpdateFavoritePayload,
  PatchFavoritePayload,
  FavoriteIdParams,
} from "../types/favorite";
import { NotFoundError } from "../errors";

// POST /favorites
export async function createFavoriteHandler(
  request: Request,
  h: ResponseToolkit
) {
  const tenantId = validateTenant(request);

  const { city, temperature, nickname, notes } =
    request.payload as CreateFavoritePayload;

  const favorite = await createFavorite(
    city,
    temperature,
    tenantId,
    nickname??undefined,
    notes??undefined
  );

  return h
    .response({
      status: "success",
      message: "Favorite city added",
      data: favorite,
    })
    .code(201);
}

// GET /favorites
export async function getFavoritesHandler(
  request: Request,
  h: ResponseToolkit
) {
  const tenantId = validateTenant(request);

  const { page=1, limit=5, search } = request.query as GetFavoritesQuery;

  const favorites = await getFavorites(tenantId, {
    page,
    limit,
    search,
  });

  return h.response({
    status: "success",
    data: favorites.data,
    pagination: {
      totalCount: favorites.totalCount,
      totalPages: favorites.totalPages,
      page: favorites.page,
      limit: favorites.limit,
    },
  });
}

// PUT /favorites/{id}
export async function updateFavoriteHandler(
  request: Request,
  h: ResponseToolkit
) {
  const tenantId = validateTenant(request);

  const { id } = request.params as { id: number };

  const { nickname, notes } = request.payload as UpdateFavoritePayload;

  const favorite = await updateFavorite(
    id,
    tenantId,
    nickname??undefined,
    notes??undefined
  );

  if (!favorite) {
    throw NotFoundError("CITY_NOT_FOUND", "Favorite city not found");
  }

  return h.response({
    status: "success",
    message: "Favorite city updated",
    data: favorite,
  });
}

// PATCH /favorites/{id}
export async function patchFavoriteHandler(
  request: Request,
  h: ResponseToolkit
) {
  const tenantId = validateTenant(request);

  const { id } = request.params as { id: number };

  const { city, nickname, notes } = request.payload as PatchFavoritePayload;

  const favorite = await patchFavorite(id, tenantId, {
    city,
    nickname: nickname??undefined,
    notes: notes??undefined,
  });

  if (!favorite) {
    throw NotFoundError("CITY_NOT_FOUND", "Favorite city not found");
  }

  return h.response({
    status: "success",
    message: "Favorite city updated",
    data: favorite,
  });
}

// DELETE /favorites/{id}
export async function deleteFavoriteHandler(
  request: Request,
  h: ResponseToolkit
) {
  const tenantId = validateTenant(request);

  const idParam: FavoriteIdParams["id"] = String(request.params.id);
  const id = Number(idParam); 

  const deletedId = await deleteFavorite(id, tenantId);

  if (!deletedId) {
    throw NotFoundError("CITY_NOT_FOUND", "Favorite city not found");
  }

  return h.response({
    status: "success",
    message: "Favorite city deleted",
    data: {
      id: deletedId,
    },
  });
}