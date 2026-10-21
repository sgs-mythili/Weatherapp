import type { ServerRoute } from "@hapi/hapi";

import {
  createFavoritePayloadSchema,
  getFavoritesQuerySchema,
  favoriteIdParamsSchema,
  updateFavoritePayloadSchema,
  patchFavoritePayloadSchema,
} from "../schemas/favoriteSchemas";

import {
  createFavoriteHandler,
  getFavoritesHandler,
  updateFavoriteHandler,
  patchFavoriteHandler,
  deleteFavoriteHandler,
} from "../handlers/favoriteHandlers";

export const favoritesRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/favorites",
    options: {
      validate: {
        payload: createFavoritePayloadSchema,
      },
    },
    handler: createFavoriteHandler,
  },

  {
    method: "GET",
    path: "/favorites",
    options: {
      validate: {
        query: getFavoritesQuerySchema,
      },
    },
    handler: getFavoritesHandler,
  },

  {
    method: "PUT",
    path: "/favorites/{id}",
    options: {
      validate: {
        params: favoriteIdParamsSchema,
        payload: updateFavoritePayloadSchema,
      },
    },
    handler: updateFavoriteHandler,
  },

  {
    method: "PATCH",
    path: "/favorites/{id}",
    options: {
      validate: {
        params: favoriteIdParamsSchema,
        payload: patchFavoritePayloadSchema,
      },
    },
    handler: patchFavoriteHandler,
  },

  {
    method: "DELETE",
    path: "/favorites/{id}",
    options: {
      validate: {
        params: favoriteIdParamsSchema,
      },
    },
    handler: deleteFavoriteHandler,
  },
];