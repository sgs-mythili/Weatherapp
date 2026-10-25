import type { Request, ResponseToolkit } from "@hapi/hapi";
import {validateTenant} from "../utils/validateTenant";
import { getWeather,getFiveDayForecast } from "../services/weatherService";
import type { WeatherQuery } from "../types/weather";   

export async function getWeatherHandler(
  request: Request,
  h: ResponseToolkit
) {
  validateTenant(request);    
  
  const { city} = request.query as unknown as WeatherQuery;

    const weather = await getWeather(city);

    return h.response({
      status: "success",
        data: weather,
    });
}

export async function getForecastHandler(
  request: Request,
  h: ResponseToolkit
) {
  validateTenant(request);

  const { city } =
    request.query as unknown as WeatherQuery;

  const forecast = await getFiveDayForecast(city);

  return h.response({
    status: "success",
    data: forecast,
  });
}
