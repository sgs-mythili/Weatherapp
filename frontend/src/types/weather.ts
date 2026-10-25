export interface WeatherData {
  city: string
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  feelsLike: number
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