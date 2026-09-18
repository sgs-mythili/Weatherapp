import type { WeatherData } from "../types/weather";

interface WeatherCardProps {
  weather: WeatherData;
  onAddFavorite: (weather: WeatherData) => void;
}

function WeatherCard({
  weather,
  onAddFavorite,
}: WeatherCardProps) {
  return (
    <div className="weather-card">
      <h2 className="weather-city">
        {weather.city}
      </h2>

      <p className="weather-temperature">
        {weather.temperature}°C
      </p>

      <p className="weather-description">
        {weather.description}
      </p>

      <div className="weather-details">
        <p>
          Humidity: {weather.humidity}%
        </p>

        <p>
          Wind: {weather.windSpeed} km/h
        </p>

        <p>
          Feels like: {weather.feelsLike}°C
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