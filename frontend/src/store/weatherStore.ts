  import { create } from "zustand";
  import { persist } from "zustand/middleware";
  import type { FavoriteCity } from "../types/city";

  export type TenantId = "tenant-alpha" | "tenant-beta";

  interface WeatherStore {
    favoriteCities: FavoriteCity[];
    unit: "C" | "F";
    currentTenant: TenantId;

    actions: {
    toggleUnit: () => void;
    setCurrentTenant: (tenantId: TenantId) => void;
  };
  }

  export const useWeatherStore = create<WeatherStore>()(
    persist(
      (set) => ({
        favoriteCities: [],
        unit: "C",
        currentTenant: "tenant-alpha",

         actions: {
          toggleUnit: () =>
            set((state) => ({
              unit:state.unit === "C" ? "F" : "C",
            })),
          setCurrentTenant: (tenantId) =>
             set({ currentTenant: tenantId }),
        },
      }),
      {
        name: "weather-storage",

        partialize: (state) => ({
          favoriteCities: state.favoriteCities,
          currentTenant: state.currentTenant,
          unit: state.unit,
        }),
      },
    ),
  );
