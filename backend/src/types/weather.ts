export interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

export interface WeatherQuery {
  city: string;
}

export interface ForecastDay {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  weatherCode: number;
  precipitationProbability: number | null;
}

export interface CityForecast {
  city: string;
  days: ForecastDay[];
}