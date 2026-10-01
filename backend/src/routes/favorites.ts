import Hapi from "@hapi/hapi";
import Joi from "joi";
import { validateTenant } from "../utils/validateTenant";
import { pool } from "../database/db";
import  Boom  from "@hapi/boom";

export const favoritesRoute: Hapi.ServerRoute = {
  method: "POST",
  path: "/favorites",

  options: {
    validate: {
      payload: Joi.object({
        city: Joi.string().trim().min(1).required(),
        temperature: Joi.number().required(),
        nickname: Joi.string().trim().allow("").optional(),
        notes: Joi.string().trim().max(100).allow("").optional()
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
    
    console.log("Favorite payload:", {
      city,
      temperature,
      nickname,
      notes,
      tenantId,
    })

    const result = await pool.query(
      `INSERT INTO favorites (city, temperature, tenant_id, nickname, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, city, temperature, nickname, notes, tenant_id, created_at`,
      [city, temperature, tenantId, nickname || null, notes || null]
    );
   console.log("Inserted favorite:", result.rows[0])
    return h.response({
        status: "success",
        message: "Favorite city added",
        data: result.rows[0],
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

    const result = await pool.query(
      `SELECT id, city, temperature, nickname, notes, tenant_id, created_at
       FROM favorites
       WHERE tenant_id = $1
       ORDER BY created_at DESC`,
      [tenantId]
    );

    return h.response({
      status: "success",
      data: result.rows,
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

    const result = await pool.query(
      `UPDATE favorites
       SET nickname = $1,
           notes = $2
       WHERE id = $3
       AND tenant_id = $4
       RETURNING
         id,
         city,
         temperature,
         nickname,
         notes,
         tenant_id,
         created_at`,
      [
        nickname || null,
        notes || null,
        id,
        tenantId,
      ]
    );

    if (result.rowCount === 0) {
      throw Boom.notFound(
        "Favorite city not found"
      );
    }

    return h.response({
      status: "success",
      message: "Favorite city updated",
      data: result.rows[0],
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

    const result = await pool.query(
      `DELETE FROM favorites
       WHERE id = $1
       AND tenant_id = $2
       RETURNING id`,
      [id, tenantId]
    );

    if (result.rowCount === 0) {
      throw Boom.notFound(
        "Favorite city not found"
      );
    }

    return h.response({
      status: "success",
      message: "Favorite city deleted",
      data: {
        id,
      },
    });
  },
};