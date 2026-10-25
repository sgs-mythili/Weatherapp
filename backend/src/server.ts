import Hapi from "@hapi/hapi";
import { validateTenant } from "./utils/validateTenant";
import { getWeather } from "./services/weatherService";
import { weatherRoute,forecastRoutes } from "./routes/weather";
import { favoritesRoutes } from "./routes/favorites";
import { config } from "./config/env";
import {sequelize} from "./database/db";

const server = Hapi.server({  
  port: config.port,
  host: config.host,

  routes: {
    cors: {
      origin: [config.frontendUrl],
      additionalHeaders: ["x-tenant-id"],
      additionalExposedHeaders: ["x-tenant-id"],
      credentials: false,
    },
  },
});

server.route(weatherRoute);
server.route(favoritesRoutes);
server.route(forecastRoutes);

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully");
    await server.start();

    console.log(`Server running at: ${server.info.uri}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();