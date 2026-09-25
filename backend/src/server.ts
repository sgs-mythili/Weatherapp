import Hapi from "@hapi/hapi";
import Joi from "joi";
import Boom from "@hapi/boom";

const favorites: string[] = [];

const server = Hapi.server({
  port: 3000,
  host: "localhost",

  routes: {
    cors: {
      origin: ["http://localhost:5173"],
      additionalHeaders: ["x-tenant-id"],
    },
  },
});

server.route({
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
    const tenantId = request.headers["x-tenant-id"];

    if (!tenantId) {
      throw Boom.unauthorized("Tenant ID is required");
    }

    const { city } = request.query as {
      city: string;
    };

    try {
      const locationResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}&count=1`
      );

      if (!locationResponse.ok) {
        throw new Error("Unable to find city");
      }

      const locationData = await locationResponse.json();

      if (!locationData.results || locationData.results.length === 0) {
        throw Boom.notFound("City not found");
      }

      const location = locationData.results[0];

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m`
      );

      if (!weatherResponse.ok) {
        throw new Error("Unable to fetch weather");
      }

      const weatherData = await weatherResponse.json();

      return h.response({
        city: location.name,
        temperature: weatherData.current.temperature_2m,
        humidity: weatherData.current.relative_humidity_2m,
        feelsLike: weatherData.current.apparent_temperature,
        windSpeed: weatherData.current.wind_speed_10m,
      });
    } catch (error) {
      console.error("Weather API error:", error);

      if (Boom.isBoom(error)) {
        throw error;
      }

      throw Boom.badGateway("Unable to fetch weather data");
    }
  },
});

// POST /favorites
server.route({
  method: "POST",
  path: "/favorites",

  options: {
    validate: {
      payload: Joi.object({
        city: Joi.string().trim().min(1).required(),
      }),
    },
  },

  handler: async (request, h) => {
    const tenantId = request.headers["x-tenant-id"];

    if (!tenantId) {
      throw Boom.unauthorized("Tenant ID is required");
    }

    const { city } = request.payload as {
      city: string;
    };

    favorites.push(city);

    return h.response({
      message: "Favorite city added",
      city,
    }).code(201);
  },
});

const start = async () => {
  try {
    await server.start();

    console.log(`Server running at: ${server.info.uri}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();