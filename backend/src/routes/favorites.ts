import Hapi from "@hapi/hapi";
import Joi from "joi";

import { validateTenant } from "../utils/validateTenant";

const favorites: {city: string,temperature: number}[] = [];

export const favoritesRoute: Hapi.ServerRoute = {
  method: "POST",
  path: "/favorites",

  options: {
    validate: {
      payload: Joi.object({
        city: Joi.string().trim().min(1).required(),
        temperature: Joi.number().required(),
      }),
    },
  },

  handler: async (request, h) => {
    validateTenant(request);

    const { city, temperature  } = request.payload as {
      city: string;
      temperature: number;
    };

    favorites.push({ city, temperature });

    return h
      .response({
        status: "success",
        message: "Favorite city added",
        data: {
          city,
        },
      })
      .code(201);
  },
};