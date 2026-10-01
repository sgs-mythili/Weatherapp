  import { create } from "zustand";
  import { persist } from "zustand/middleware";
  import type { FavoriteCity } from "../types/city";

  interface WeatherStore {
    favoriteCities: FavoriteCity[];
    unit: "C" | "F";

    actions: {
    toggleUnit: () => void;
  };
  }

  export const useWeatherStore = create<WeatherStore>()(
    persist(
      (set) => ({
        favoriteCities: [],
        unit: "C",

         actions: {
          toggleUnit: () =>
            set((state) => ({
              unit:
                state.unit === "C"
                  ? "F"
                  : "C",
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
