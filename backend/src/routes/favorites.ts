import Hapi from "@hapi/hapi";
import Joi from "joi";
import Boom from "@hapi/boom";
import { validateTenant } from "../utils/validateTenant";
import {createFavorite,getFavorites,updateFavorite,patchFavorite,deleteFavorite,} from "../services/favoriteService";

export const favoritesRoute: Hapi.ServerRoute = {
  method: "POST",
  path: "/favorites",

  options: {
    validate: {
      payload: Joi.object({
        city: Joi.string().trim().min(1).required(),
        temperature: Joi.number().required(),
        nickname: Joi.string().trim().allow("").optional(),
        notes: Joi.string().trim().max(100).allow("").optional(),
      }),
    },
  },

  handler: async (request, h) => {
    try{
      const tenantId = validateTenant(request);

      const { city, temperature, nickname, notes } = request.payload as {
        city: string;
        temperature: number;
        nickname?: string;
        notes?: string;
      };

      console.log("Favorite payload:", {city,temperature,nickname,notes,tenantId,});

      const favorite = await createFavorite( city, temperature, tenantId, nickname, notes);
      console.log("Inserted favorite:", favorite);

      return h.response({
          status: "success",
          message: "Favorite city added",
          data: favorite,
        })
        .code(201);
    }catch(error){
      console.error("Error adding favorite city:", error);
      throw error 
    }
  },
};

export const getFavoritesRoute: Hapi.ServerRoute = {
  method: "GET",
  path: "/favorites",

  handler: async (request, h) => {
    const tenantId = validateTenant(request);

    const favorites = await getFavorites(tenantId);

    return h.response({
      status: "success",
      data: favorites,
    });
  },
};

export const updateFavoriteRoute: Hapi.ServerRoute = {
  method: "PUT",
  path: "/favorites/{id}",

  options: {
    validate: {
      params: Joi.object({
        id: Joi.number().integer().required(),
      }),

      payload: Joi.object({
        nickname: Joi.string().trim().allow("").optional(),
        notes: Joi.string().trim().max(100).allow("").optional(),
      }),
    },
  },

  handler: async (request, h) => {
    const tenantId = validateTenant(request);

    const { id } = request.params as {
      id: number;
    };

    const {nickname,notes} = request.payload as {
      nickname?: string;
      notes?: string;
    };

    const favorite = await updateFavorite(id, tenantId, nickname, notes);

    if (!favorite) {
      throw Boom.notFound("Favorite city not found");
    }

    return h.response({
      status: "success",
      message: "Favorite city updated",
      data: favorite,
    });
  },
};

export const patchFavoriteRoute: Hapi.ServerRoute = {
  method: "PATCH",
  path: "/favorites/{id}",

  options: {
    validate: {
      params: Joi.object({
        id: Joi.number().integer().required(),
      }),

      payload: Joi.object({
        city: Joi.string().trim().min(1).optional(),
        nickname: Joi.string().trim().allow("").optional(),
        notes: Joi.string().trim().max(100).allow("").optional(),
      }).min(1),
    },
  },

  handler: async (request, h) => {
    const tenantId = validateTenant(request);

    const { id } = request.params as {
      id: number;
    };

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
  },
};


export const deleteFavoriteRoute: Hapi.ServerRoute = {
  method: "DELETE",
  path: "/favorites/{id}",

  options: {
    validate: {
      params: Joi.object({
        id: Joi.number().integer().required(),
      }),
    },
  },

  handler: async (request, h) => {
    const tenantId = validateTenant(request);

    const { id } = request.params as {
      id: number;
    };

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
  },
};