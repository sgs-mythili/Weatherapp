  import { create } from "zustand";
  import { persist } from "zustand/middleware";
  import type { FavoriteCity } from "../types/city";

  interface WeatherStore {
    favoriteCities: FavoriteCity[];
    unit: "C" | "F";

    actions: {
      addFavorite: (city: FavoriteCity) => void;
      removeFavorite: (id: string) => void;
      updateFavoriteTemperature: (name: string, temperature: number) => void;
      toggleUnit: () => void;
    };
  }

  export const useWeatherStore = create<WeatherStore>()(
    persist(
      (set) => ({
        favoriteCities: [],
        unit: "C",

        actions: {
          addFavorite: (city) =>
            set((state) => ({
              favoriteCities: [...state.favoriteCities, city],
            })),

          removeFavorite: (id) =>
            set((state) => ({
              favoriteCities: state.favoriteCities.filter(
                (city) => city.id !== id,
              ),
            })),

          updateFavoriteTemperature: (name, temperature) =>
            set((state) => ({
              favoriteCities: state.favoriteCities.map((city) =>
                city.name.toLowerCase() === name.toLowerCase()
                  ? {
                      ...city,
                      temperature,
                    }
                  : city,
              ),
            })),

          toggleUnit: () =>
            set((state) => ({
              unit: state.unit === "C" ? "F" : "C",
            })),
        },
      }),
      {
        name: "weather-storage",

        partialize: (state) => ({
          favoriteCities: state.favoriteCities,
          unit: state.unit,
        }),
      },
    ),
  );
