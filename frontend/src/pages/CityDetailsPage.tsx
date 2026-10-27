import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router";

import { getFiveDayForecast } from "../services/weatherApi";
import { useWeatherStore } from "../store/weatherStore";
import { convertTemperature } from "../utils/temperature";

import type { CityForecast } from "../types/weather";

function CityDetailsPage() {
  const { cityName } = useParams<{cityName: string}>();

  const navigate = useNavigate();

  const [searchCity, setSearchCity] = useState("");

  const unit = useWeatherStore(
    (state) => state.unit
  );

  const toggleUnit = useWeatherStore(
    (state) => state.actions.toggleUnit
  );

  const {
    data: forecast,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery<CityForecast>({
    queryKey: ["forecast", cityName],
    queryFn: () => getFiveDayForecast(cityName!),
    enabled: Boolean(cityName?.trim()),
    retry: 1,
  });

  const handleSearch = (event: React.SubmitEvent) => {
    event.preventDefault();

    const city = searchCity.trim();

    if (!city) {
      return;
    }

    navigate(`/city/${encodeURIComponent(city)}`);
    setSearchCity("");
  };

  return (
    <section className="city-details-page">
      <div className="city-details-header">
        <Link
          to="/favorites"
          className="navigation-link"
        >
          ← Back to Favorites
        </Link>

        <h2 className="page-title">
          {cityName} - 5 Days Forecast
        </h2>

        <button
          type="button"
          onClick={toggleUnit}
          className="unit-button"
        >
          Switch to °{unit === "C" ? "F" : "C"}
        </button>
      </div>

      <form
        onSubmit={handleSearch}
        className="search-container"
      >
        <input
          type="text"
          value={searchCity}
          onChange={(event) =>
            setSearchCity(event.target.value)
          }
          placeholder="Search another city"
          aria-label="Search another city"
          className="search-input"
        />

        <button
          type="submit"
          className="search-button"
        >
          Search
        </button>
      </form>

      {!cityName?.trim() ? (
        <p className="error-message">
          City name is missing.
        </p>
      ) : isPending ? (
        <p className="loading-message">
          Loading five-day forecast...
        </p>
      ) : isError ? (
        <div className="forecast-error">
          <h3>Unable to load forecast</h3>

          <p className="error-message" role="alert">
            {error instanceof Error
              ? error.message
              : "Something went wrong"}
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            className="search-button"
          >
            Try Again
          </button>
        </div>
      ) : forecast.days.length === 0 ? (
        <p className="empty-message">
          No forecast data available.
        </p>
      ) : (
        <div className="forecast-grid">
          {forecast.days.map((day) => (
            <article
              key={day.date}
              className="forecast-card"
            >
              <h3 className="forecast-date">
                {new Date(
                  `${day.date}T12:00:00`
                ).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </h3>

              <div className="forecast-temperature">
                <p>
                  High:{" "}
                  {convertTemperature(
                    day.temperatureMax,
                    unit
                  )}
                  °{unit}
                </p>

                <p>
                  Low:{" "}
                  {convertTemperature(
                    day.temperatureMin,
                    unit
                  )}
                  °{unit}
                </p>
              </div>

              {/* <p className="forecast-condition">
                Weather code: {day.weatherCode}
              </p> */}

              <p className="forecast-rain">
                Rain chance:{" "}
                {day.precipitationProbability === null
                  ? "N/A"
                  : `${day.precipitationProbability}%`}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default CityDetailsPage;