import Joi from "joi";

// POST /favorites
export const createFavoritePayloadSchema = Joi.object({
  city: Joi.string().trim().min(1).required(),
  temperature: Joi.number().required(),
  nickname: Joi.string().trim().allow("").optional(),
  notes: Joi.string().trim().max(100).allow("").optional(),
});

// GET /favorites
export const getFavoritesQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),

  limit: Joi.alternatives()
    .try(
      Joi.number().integer().valid(5, 10),
      Joi.string().valid("all")
    )
    .default(5),

  search: Joi.string().trim().allow("").optional(),
});

// Shared by PUT, PATCH and DELETE
export const favoriteIdParamsSchema = Joi.object({
  id: Joi.number().integer().required(),
});

// PUT /favorites/{id}
export const updateFavoritePayloadSchema = Joi.object({
  nickname: Joi.string().trim().allow("").optional(),
  notes: Joi.string().trim().max(100).allow("").optional(),
});

// PATCH /favorites/{id}
export const patchFavoritePayloadSchema = Joi.object({
  city: Joi.string().trim().min(1).optional(),
  nickname: Joi.string().trim().allow("").optional(),
  notes: Joi.string().trim().max(100).allow("").optional(),
}).min(1);