import type { Request, ResponseToolkit } from "@hapi/hapi";
import Boom from "@hapi/boom";

import { validateTenant } from "../utils/validateTenant";

import {
  createFavorite,
  getFavorites,
  updateFavorite,
  patchFavorite,
  deleteFavorite,
} from "../services/favoriteService";

// POST /favorites
export async function createFavoriteHandler(
  request: Request,
  h: ResponseToolkit
) {
  const tenantId = validateTenant(request);

  const { city, temperature, nickname, notes } =
    request.payload as {
      city: string;
      temperature: number;
      nickname?: string;
      notes?: string;
    };

  const favorite = await createFavorite(
    city,
    temperature,
    tenantId,
    nickname,
    notes
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

  const { page, limit, search } = request.query as {
    page: number;
    limit: number | "all";
    search?: string;
  };

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

  const { nickname, notes } = request.payload as {
    nickname?: string;
    notes?: string;
  };

  const favorite = await updateFavorite(
    id,
    tenantId,
    nickname,
    notes
  );

  if (!favorite) {
    throw Boom.notFound("Favorite city not found");
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

  const { city, nickname, notes } = request.payload as {
    city?: string;
    nickname?: string;
    notes?: string;
  };

  const favorite = await patchFavorite(id, tenantId, {
    city,
    nickname,
    notes,
  });

  if (!favorite) {
    throw Boom.notFound("Favorite city not found");
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

  const { id } = request.params as { id: number };

  const deletedId = await deleteFavorite(id, tenantId);

  if (!deletedId) {
    throw Boom.notFound("Favorite city not found");
  }

  return h.response({
    status: "success",
    message: "Favorite city deleted",
    data: {
      id: deletedId,
    },
  });
}