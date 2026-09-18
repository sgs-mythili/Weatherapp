import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import SearchBar from "./components/SearchComponent";
import WeatherCard from "./components/WeatherCard";
import FavoriteCities from "./components/FavoriteCities";

import type { WeatherData } from "./types/weather";
import type { FavoriteCity } from "./types/city";

import { getWeather } from "./services/weatherApi";
import { weatherKeys } from "./queries/weatherkeys"
function App() {
  const [city, setCity] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [favoriteError, setFavoriteError] = useState("");
  const [favoriteCities, setFavoriteCities] = useState<FavoriteCity[]>(() => {
      const savedCities =  localStorage.getItem("favoriteCities");

      return savedCities ? JSON.parse(savedCities) : [];
    });
const {
  data: weather,
  isLoading,
  error,
  refetch,
} = useQuery({
  queryKey: weatherKeys.city(searchCity),
  queryFn: () => getWeather(searchCity),
  enabled: !!searchCity.trim(),
});

  useEffect(() => {
    localStorage.setItem(
      "favoriteCities",
      JSON.stringify(favoriteCities)
    );
  }, [favoriteCities]);

  const handleSearch = () => {
  if (!city.trim()) {
    return;
  }

  setSearchCity(city);
};


  const handleAddFavorite = ( weatherData: WeatherData ) => {
    const alreadyExists = favoriteCities.some( (city) => city.name.toLowerCase() === weatherData.city.toLowerCase());

    if (alreadyExists) {
      setFavoriteError("City is already in favorites");
      return;
    }

    setFavoriteError("");

    const newCity: FavoriteCity = {
      id: Date.now().toString(),
      name: weatherData.city,
      temperature: weatherData.temperature,
    };

    setFavoriteCities((currentCities) => [
        ...currentCities,
        newCity,
      ]
    );
  };

  const handleDeleteFavorite = ( id: string ) => {
    setFavoriteCities((currentCities) =>
      currentCities.filter(
        (city) => city.id !== id
      )
    );
  };


  const handleSelectFavorite = (
  cityName: string
) => {
  setCity(cityName);

   if (searchCity.toLowerCase() === cityName.toLowerCase()) {
    refetch();
    return;
  }
  setSearchCity(cityName);
};

useEffect(() => {
  if (!weather) {
    return;
  }

  setFavoriteCities((currentCities) =>
    currentCities.map((city) =>
      city.name.toLowerCase() === weather.city.toLowerCase()
        ? {
            ...city,
            temperature: weather.temperature,
          }
        : city,
    ),
  );
}, [weather]);

  return (
    <div className="weather-container">
      <h1 className="weather-title">Weather Dashboard</h1>

      <SearchBar city={city} onCityChange={setCity} onSearch={handleSearch} />

      {isLoading && <p className="loading-message">Loading weather...</p>}

      {error && (
        <p className="error-message">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      )}

      {favoriteError && <p className="error-message">{favoriteError}</p>}

      {weather && !isLoading && (
        <WeatherCard weather={weather} onAddFavorite={handleAddFavorite} />
      )}

      <FavoriteCities
        cities={favoriteCities}
        onDeleteFavorite={handleDeleteFavorite}
        onSelectCity={handleSelectFavorite}
      />
    </div>
  );
}

export default App;