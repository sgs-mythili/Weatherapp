import "dotenv/config";

export const config = {
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST || "localhost",
  frontendUrl:
    process.env.FRONTEND_URL || "http://localhost:5173",

  geocodingApiUrl:
    process.env.GEOCODING_API_URL ||
    "https://geocoding-api.open-meteo.com/v1/search",

  weatherApiUrl:
    process.env.WEATHER_API_URL ||
    "https://api.open-meteo.com/v1/forecast",
};