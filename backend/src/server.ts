import Hapi from "@hapi/hapi";
import Joi from "joi";
import Boom from "@hapi/boom";
import { validateTenant } from "./utils/validateTenant";
import { getWeather } from "./services/weatherService";
import { weatherRoute } from "./routes/weather";
import { favoritesRoute } from "./routes/favorites";
import { config } from "./config/env";
const favorites: string[] = [];

const server = Hapi.server({  
  port: config.port,
  host: config.host,

  routes: {
    cors: {
      origin: [config.frontendUrl],
      additionalHeaders: ["x-tenant-id"],
    },
  },
});

server.route(weatherRoute);
server.route(favoritesRoute);

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