import Hapi from "@hapi/hapi";
import Joi from "joi";

import { validateTenant } from "../utils/validateTenant";
import { getWeather } from "../services/weatherService";

export const weatherRoute: Hapi.ServerRoute = {
  method: "GET",
  path: "/weather",

  options: {
    validate: {
      query: Joi.object({
        city: Joi.string().trim().min(1).required(),
      }),
    },
  },

  handler: async (request, h) => {
    validateTenant(request);

    const { city } = request.query as {
      city: string;
    };

    const weather = await getWeather(city);

    return h.response({
      status: "success",
      data: weather,
    });
  },
};