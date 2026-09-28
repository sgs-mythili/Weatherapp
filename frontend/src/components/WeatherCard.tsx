import type { WeatherData } from "../types/weather";
import { convertTemperature } from "../utils/temperature";

interface WeatherCardProps {
  weather: WeatherData;
  unit: "C" | "F";
  onAddFavorite: (weather: WeatherData) => void;
}

function WeatherCard({
  weather,
  unit,
  onAddFavorite,
}: WeatherCardProps) {
  return (
    <div className="weather-card">
      <h2 className="weather-city">{weather.city}</h2>

      <p className="weather-temperature">
        {convertTemperature(weather.temperature, unit)}°{unit}
      </p>

      <p className="weather-description">{weather.description}</p>

      <div className="weather-details">
        <p>Humidity: {weather.humidity}%</p>

        <p>Wind: {weather.windSpeed} km/h</p>

        <p>
          Feels like: {" "}
          {convertTemperature(weather.feelsLike, unit)}°{unit}
        </p>
      </div>

      <button
        onClick={() => onAddFavorite(weather)}
        className="favorite-button"
      >
        Add to Favorites
      </button>
    </div>
  );
}

export default WeatherCard;