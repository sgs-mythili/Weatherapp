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

import { inputValidationJoiFailAction,} from "../utils/joiFailAction";

export const favoritesRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/favorites",
    options: {
      validate: {
        payload: createFavoritePayloadSchema,
        options: {
          abortEarly: false,
        },
        failAction: inputValidationJoiFailAction,
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
        options: {
          abortEarly: false,
        },
        failAction: inputValidationJoiFailAction,
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
        options: {
          abortEarly: false,
        },
        failAction: inputValidationJoiFailAction,
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
        options: {
          abortEarly: false,
        },
        failAction: inputValidationJoiFailAction,
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
        options: {
          abortEarly: false,
        },
        failAction: inputValidationJoiFailAction,
      },
    },
    handler: deleteFavoriteHandler,
  },
];