import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Link } from "react-router";

import SearchBar from "../components/SearchComponent";
import WeatherCard from "../components/WeatherCard";

import type { WeatherData } from "../types/weather";

import {getWeather,addFavorite as addFavoriteApi,} from "../services/weatherApi";

import { weatherKeys } from "../queries/weatherkeys";
import { useWeatherStore } from "../store/weatherStore";

export default function DashboardPage() {
  const [city, setCity] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [favoriteError, setFavoriteError] = useState("");

  const queryClient = useQueryClient();

  const unit = useWeatherStore(
    (state) => state.unit
  );

  const toggleUnit = useWeatherStore(
    (state) => state.actions.toggleUnit
  );

  // Fetch current weather only after Search is clicked
  const {
    data: weather,
    isLoading,
    error,
  } = useQuery({
    queryKey: weatherKeys.city(searchCity),
    queryFn: () => getWeather(searchCity),
    enabled: Boolean(searchCity.trim()),
    refetchOnWindowFocus: true,
  });

  // Add city to favorites
  const addFavoriteMutation = useMutation({
    mutationFn: (weatherData: WeatherData) =>
      addFavoriteApi(
        weatherData.city,
        weatherData.temperature,
        "",
        ""
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });

      setFavoriteError("");
    },

    onError: (error: Error) => {
      setFavoriteError(error.message);
    },
  });

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
    addFavoriteMutation.mutate(weatherData);
  };

  return (
    <section className="dashboard-page">
      <h2 className="page-title">Dashboard</h2>

      <button
        type="button"
        onClick={toggleUnit}
        className="unit-button"
      >
        Switch to °{unit === "C" ? "F" : "C"}
      </button>

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

      {addFavoriteMutation.isSuccess && (
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