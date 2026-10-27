import type { WeatherData } from "../types/weather";
import { convertTemperature } from "../utils/temperature";
import { cn } from "../utils/cn";

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
    <section
      className={cn(
        "w-full max-w-2xl mx-auto",
        "rounded-2xl border border-border",
        "bg-surface p-6 shadow-md",
        "transition-shadow duration-200 hover:shadow-lg"
      )}
      aria-labelledby="weather-city"
    >
      <div className="text-center mb-6">
        <h2
          id="weather-city"
          className="text-2xl font-bold tracking-tight text-gray-900"
        >
          {weather.city}
        </h2>

        <p className="mt-3 text-5xl font-semibold tracking-tight text-primary">
          {convertTemperature(weather.temperature, unit)}°{unit}
        </p>

        <p className="mt-2 text-base capitalize text-muted">
          {weather.description}
        </p>
      </div>

      <div
        className={cn(
          "grid grid-cols-1 gap-3",
          "sm:grid-cols-3"
        )}
      >
        <div className="rounded-xl bg-page p-4">
          <p className="text-sm font-medium text-muted">
            Humidity
          </p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {weather.humidity}%
          </p>
        </div>

        <div className="rounded-xl bg-page p-4">
          <p className="text-sm font-medium text-muted">
            Wind
          </p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {weather.windSpeed} km/h
          </p>
        </div>

        <div className="rounded-xl bg-page p-4">
          <p className="text-sm font-medium text-muted">
            Feels like
          </p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {convertTemperature(weather.feelsLike, unit)}°{unit}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onAddFavorite(weather)}
        className={cn(
          "mt-6 w-full rounded-lg px-4 py-3",
          "bg-primary text-white font-semibold",
          "transition-colors duration-200",
          "hover:bg-primary-hover",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-primary focus-visible:ring-offset-2",
          "active:scale-[0.99]"
        )}
      >
        Add to Favorites
      </button>
    </section>
  );
}

export default WeatherCard;