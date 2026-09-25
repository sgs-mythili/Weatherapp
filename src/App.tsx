import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import SearchBar from "./components/SearchComponent";
import WeatherCard from "./components/WeatherCard";
import FavoriteCities from "./components/FavoriteCities";

import type { WeatherData } from "./types/weather";
import type { FavoriteCity } from "./types/city";

import { getWeather, addFavorite as addFavoriteApi } from "./services/weatherApi";
import { weatherKeys } from "./queries/weatherkeys"
import { useWeatherStore } from "./store/weatherStore";
function App() {
  const [city, setCity] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [favoriteError, setFavoriteError] = useState("");
const {data: weather, isLoading, error, refetch,} = useQuery({
  queryKey: weatherKeys.city(searchCity),
  queryFn: () => getWeather(searchCity),
  enabled: !!searchCity.trim(),
  refetchOnWindowFocus: true,
});
  const favoriteCities = useWeatherStore(
  (state) => state.favoriteCities
);
  const addFavorite = useWeatherStore(
  (state) => state.actions.addFavorite
);

  const removeFavorite = useWeatherStore(
  (state) => state.actions.removeFavorite
);
  const updateFavoriteTemperature = useWeatherStore(
  (state) => state.actions.updateFavoriteTemperature
);
  const handleSearch = () => {
  if (!city.trim()) {
    return;
  }

  setSearchCity(city);
};


  const handleAddFavorite = async (weatherData: WeatherData) => {
  const alreadyExists = favoriteCities.some(
    (city) =>
      city.name.toLowerCase() === weatherData.city.toLowerCase()
  );

  if (alreadyExists) {
    setFavoriteError("City is already in favorites");
    return;
  }

  setFavoriteError("");

  try {
    await addFavoriteApi(weatherData.city);

    const newCity: FavoriteCity = {
      id: Date.now().toString(),
      name: weatherData.city,
      temperature: weatherData.temperature,
    };

    addFavorite(newCity);
  } catch (error) {
    setFavoriteError(
      error instanceof Error
        ? error.message
        : "Unable to add favorite"
    );
  }
};

  const handleDeleteFavorite = ( id: string ) => {
   removeFavorite(id);
  };


  const handleSelectFavorite = (cityName: string) => {
  setCity(cityName);

   if (searchCity.toLowerCase() === cityName.toLowerCase()) {
    refetch();
    return;
  }
  setSearchCity(cityName);
};

  const unit = useWeatherStore(
  (state) => state.unit
);
  
  const toggleUnit = useWeatherStore(
  (state) => state.actions.toggleUnit
);

useEffect(() => {
  if (!weather) {
    return;
  }

  updateFavoriteTemperature(
    weather.city,
    weather.temperature
  );
}, [weather, updateFavoriteTemperature]);

  return (
    <div className="weather-container">
      <h1 className="weather-title">Weather Dashboard</h1>

      <button onClick={toggleUnit} className="unit-button">
        Switch to °{unit === "C" ? "F" : "C"}
      </button>

      <SearchBar city={city} onCityChange={setCity} onSearch={handleSearch} />

      {isLoading && <p className="loading-message">Loading weather...</p>}

      {error && (
        <p className="error-message">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      )}

      {favoriteError && <p className="error-message">{favoriteError}</p>}

      {weather && !isLoading && (
        <WeatherCard
          weather={weather}
          unit={unit}
          onAddFavorite={handleAddFavorite}
        />
      )}

      <FavoriteCities
        cities={favoriteCities}
        unit={unit}
        onDeleteFavorite={handleDeleteFavorite}
        onSelectCity={handleSelectFavorite}
      />
    </div>
  );
}

export default App;