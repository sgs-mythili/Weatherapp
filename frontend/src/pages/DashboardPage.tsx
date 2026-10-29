import { useState } from "react";
import { Link } from "react-router";

import SearchBar from "../components/SearchComponent";
import WeatherCard from "../components/WeatherCard";

import type { WeatherData } from "../types/weather";

import { useWeatherStore } from "../store/weatherStore";
import { useAddFavoriteMutation } from "../queries/favorites/useAddFavoriteMutation";
import { useWeather } from "../queries/weather/useWeather";

export default function DashboardPage() {
  const [city, setCity] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [favoriteError, setFavoriteError] = useState("");

  const unit = useWeatherStore(
    (state) => state.unit
  );

  // Fetch current weather only after Search is clicked
  const {
    data: weather,
    isLoading,
    error,
  } = useWeather(searchCity);

  // Add city to favorites
   const addFavoriteMutation = useAddFavoriteMutation()

  const handleSearch = () => {
    const trimmedCity = city.trim();

    if (!trimmedCity) {
      return;
    }

    setSearchCity(trimmedCity);
    setFavoriteError("");
  };

  const handleAddFavorite = (weatherData: WeatherData) => {
    setFavoriteError("");
    addFavoriteMutation.mutate(weatherData),{
      onError: (error: any) => {
        setFavoriteError(
          error instanceof Error
            ? error.message
            : "Unable to add favorite"
        );
      }
    };
  };

  return (
    <section className="dashboard-page">
      <h2 className="page-title">Dashboard</h2>

      <SearchBar
        city={city}
        onCityChange={setCity}
        onSearch={handleSearch}
      />

      {isLoading && (
        <p className="loading-message">
          Loading weather...
        </p>
      )}

      {error && (
        <p className="error-message" role="alert">
          {error instanceof Error
            ? error.message
            : "Unable to fetch weather"}
        </p>
      )}

      {favoriteError && (
        <p className="error-message" role="alert">
          {favoriteError}
        </p>
      )}

      {weather && !isLoading && (
        <WeatherCard
          weather={weather}
          unit={unit}
          onAddFavorite={handleAddFavorite}
        />
      )}

      {addFavoriteMutation.isPending && (
        <p className="loading-message">
          Adding favorite...
        </p>
      )}

      {addFavoriteMutation.isSuccess && !favoriteError && (
        <p className="success-message">
          City added to favorites.
        </p>
      )}

      <div className="dashboard-actions">
        <Link to="/favorites" className="navigation-link">
          View Favorite Cities
        </Link>
      </div>
    </section>
  );
}