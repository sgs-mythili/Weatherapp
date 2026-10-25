import type { ServerRoute } from "@hapi/hapi";

import {
  weatherQuerySchema,
  forecastQuerySchema,
} from "../schemas/weatherSchemas";

import {
  getWeatherHandler,
  getForecastHandler,
} from "../handlers/weatherHandler";

import { inputValidationJoiFailAction } from "../utils/joiFailAction";

// GET /weather
export const weatherRoute: ServerRoute = {
  method: "GET",
  path: "/weather",

  options: {
    validate: {
      query: weatherQuerySchema,
      options: {
        abortEarly: false,
      },
      failAction: inputValidationJoiFailAction,
    },
  },

  handler: getWeatherHandler,
};

// GET /weather/forecast
export const forecastRoutes: ServerRoute = {
  method: "GET",
  path: "/weather/forecast",

  options: {
    validate: {
      query: forecastQuerySchema,
      options: {
        abortEarly: false,
      },
      failAction: inputValidationJoiFailAction,
    },
  },

  handler: getForecastHandler,
};