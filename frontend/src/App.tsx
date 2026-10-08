import { useState } from "react";

import {useQuery, useQueryClient, useMutation} from "@tanstack/react-query";
import SearchBar from "./components/SearchComponent";
import WeatherCard from "./components/WeatherCard";
import FavoriteCities from "./components/FavoriteCities";

import type { WeatherData } from "./types/weather";
import type { FavoriteCity, FavoriteCityResponse,} from "./types/city";

import {getWeather,addFavorite as addFavoriteApi,getFavorites, deleteFavorite as deleteFavoriteApi, patchFavorite as patchFavoriteApi} from "./services/weatherApi";
import { weatherKeys } from "./queries/weatherkeys"
import { useWeatherStore } from "./store/weatherStore";
import FavoriteForm from "./components/FavoriteForm";
import {type FavoriteFormData,} from "./schemas/favoriteSchema";

function App() {
  const [city, setCity] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [favoriteError, setFavoriteError] = useState("");
  const [favoritePage, setFavoritePage] = useState(1);
  const [favoriteSearch, setFavoriteSearch] = useState("");
  const favoriteLimit = 5;
  const {data: weather, isLoading, error, refetch,} = useQuery({
  queryKey: weatherKeys.city(searchCity),
  queryFn: () => getWeather(searchCity),
  enabled: !!searchCity.trim(),
  refetchOnWindowFocus: true,
});
  const { data: favoritesData, isLoading: favoritesLoading } = useQuery({
  queryKey: ["favorites", favoritePage, favoriteLimit, favoriteSearch],
  queryFn: () => getFavorites(favoritePage, favoriteLimit, favoriteSearch),
});
const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
const [editingId, setEditingId] = useState<string | null>(null);
const [formDefaults, setFormDefaults] = useState<FavoriteFormData>({
  city: "",
  nickname: "",
  notes: "",
});
 const queryClient = useQueryClient();
 const favoriteCities: FavoriteCity[] =favoritesData?.data.map((favorite: FavoriteCityResponse) => ({
      id: favorite.id.toString(),
      name: favorite.city,
      temperature: Number(favorite.temperature),
      nickname: favorite.nickname,
      notes: favorite.notes
    })
  ) ?? [];
const addFavoriteMutation = useMutation({
  mutationFn: (data: {
    city: string;
    temperature: number;
    nickname: string;
    notes: string;
  }) =>
    addFavoriteApi(
      data.city,
      data.temperature,
      data.nickname,
      data.notes
    ),

  onSuccess: async () => {
    setFavoritePage(1);
    await queryClient.invalidateQueries({
      queryKey: ["favorites"],
    });

    setFormMode(null);
    setFavoriteError("");
  },

  onError: (error) => {
    setFavoriteError(
      error instanceof Error
        ? error.message
        : "Unable to add favorite"
    );
  },
});
const updateFavoriteMutation = useMutation({mutationFn: (updates: {city?: string;nickname?: string;notes?: string;}) => patchFavoriteApi(editingId as string, updates),
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ["favorites"] });
    setFormMode(null);
    setEditingId(null);
    setFavoriteError("");
  },
  onError: (error) => {
    setFavoriteError(
      error instanceof Error ? error.message : "Unable to update favorite"
    );
  },
});

  const handleSearch = () => {
  if (!city.trim()) {
    return;
  }

  setSearchCity(city);
};

 
  const handleAddFavorite = (weatherData: WeatherData) => {
  const alreadyExists = favoriteCities.some(
    (city) =>
      city.name.toLowerCase() === weatherData.city.toLowerCase()
  );

  if (alreadyExists) {
    setFavoriteError("City is already in favorites");
    return;
  }

  setFavoriteError("");

  addFavoriteMutation.mutate({
    city: weatherData.city,
    temperature: weatherData.temperature,
    nickname: "",
    notes: "",
  });
};

  const handleDeleteFavorite = async (id: string) => {
  try {
    await deleteFavoriteApi(id);

    if(favoriteCities.length === 1 && favoritePage > 1) {
      setFavoritePage(favoritePage - 1);
    }

    await queryClient.invalidateQueries({
      queryKey: ["favorites"],
    });
  } catch (error) {
    setFavoriteError(
      error instanceof Error
        ? error.message
        : "Unable to delete favorite"
    );
  }
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

const openEditForm = (city: FavoriteCity) => {
  setFormDefaults({
    city: city.name,
    nickname: city.nickname ?? "",
    notes: city.notes ?? "",
  });
  setEditingId(city.id);
  setFormMode("edit");
  setFavoriteError("");
};
const handleFormSubmit = (data: FavoriteFormData) => {
  if (formMode === "edit") {
  const updates: {city?: string;nickname?: string;notes?: string;} = {};
  if (data.city !== formDefaults.city) {
    updates.city = data.city;
  }
  if ((data.nickname ?? "") !== (formDefaults.nickname ?? "")) {
    updates.nickname = data.nickname ?? "";
  }
  if ((data.notes ?? "") !== (formDefaults.notes ?? "")) {
    updates.notes = data.notes ?? "";
  }
  if (Object.keys(updates).length === 0) {
    setFormMode(null);
    setEditingId(null);
    return;
  }
  updateFavoriteMutation.mutate(updates);
  return;
}
}
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
        onEditFavorite={openEditForm}
        search={favoriteSearch}
        onSearchChange={(value:any) => {
          setFavoriteSearch(value);
          setFavoritePage(1);
        }}
        page={favoritesData?.pagination.page ?? favoritePage}
        totalPages={favoritesData?.pagination.totalPages ?? 0}
        totalCount={favoritesData?.pagination.totalCount ?? 0}
        onPageChange={setFavoritePage}
        isLoading={favoritesLoading}
      />

      {formMode && (
        <FavoriteForm
          mode={formMode}
          defaultValues={formDefaults}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormMode(null)}
          isSubmitting={
            addFavoriteMutation.isPending || updateFavoriteMutation.isPending
          }
        />
      )}
    </div>
  );
}

export default App;
