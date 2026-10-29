import { useState } from "react";
import {useMutation,useQueryClient,} from "@tanstack/react-query";
import { useNavigate } from "react-router";

import FavoriteCities from "../components/FavoriteCities";
import FavoriteForm from "../components/FavoriteForm";

import type {FavoriteCity, FavoriteCityResponse,} from "../types/city";

import type { FavoriteFormData } from "../schemas/favoriteSchema";
import ConfirmModal from "../components/ConfirmModal";

import {
  patchFavorite as patchFavoriteApi,
  deleteFavorite as deleteFavoriteApi,
} from "../services/weatherApi";

import { useWeatherStore } from "../store/weatherStore";
import {useFavorites} from "../queries/favorites/useFavorites";
import {favoriteKeys} from "../queries/favorites/favoriteKeys";

interface FavoriteUpdates {
  city?: string;
  nickname?: string;
  notes?: string;
}

export default function FavoritesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [favoritePage, setFavoritePage] = useState(1);
  const [favoriteLimit, setFavoriteLimit] = useState< 5|10| "all">(5);
  const [favoriteSearch, setFavoriteSearch] = useState("");
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formDefaults, setFormDefaults] =
    useState<FavoriteFormData>({
      city: "",
      nickname: "",
      notes: "",
    });
  const [favoriteError, setFavoriteError] = useState("");
  const [favoriteToDelete, setFavoriteToDelete] = useState<FavoriteCity | null>(null);

  const unit = useWeatherStore(
    (state) => state.unit
  );

  // GET /favorites
  const {data: favoritesData,isLoading: favoritesLoading,error: favoritesQueryError,} = useFavorites({
    page: favoritePage,
    limit: favoriteLimit,
    search: favoriteSearch,
  });

  // Convert API response to FavoriteCity[]
  const favoriteCities: FavoriteCity[] =
    favoritesData?.data.map(
      (favorite: FavoriteCityResponse) => ({
        id: favorite.id.toString(),
        name: favorite.city,
        temperature: Number(favorite.temperature),
        nickname: favorite.nickname,
        notes: favorite.notes,
      })
    ) ?? [];

  // PATCH /favorites/{id}
  const updateFavoriteMutation = useMutation({
    mutationFn: (updates: FavoriteUpdates) => {
      if (!editingId) {
        throw new Error("No favorite selected");
      }

      return patchFavoriteApi(editingId, updates);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: favoriteKeys.all,
      });

      setFormMode(null);
      setEditingId(null);
      setFavoriteError("");
    },

    onError: (error: Error) => {
      setFavoriteError(error.message);
    },
  });

  // DELETE /favorites/{id}
  const deleteFavoriteMutation = useMutation({
    mutationFn: (id: string) =>
      deleteFavoriteApi(id),

    onSuccess: async () => {
      if (
        favoriteCities.length === 1 &&
        favoritePage > 1
      ) {
        setFavoritePage((previous) => previous - 1);
      }

      await queryClient.invalidateQueries({
        queryKey: favoriteKeys.all,
      });

      setFavoriteError("");
    },

    onError: (error: Error) => {
      setFavoriteError(error.message);
    },
  });

  // Navigate to city details
  const handleSelectFavorite = (cityName: string) => {
    navigate(
      `/city/${encodeURIComponent(cityName)}`
    );
  };

  // Open edit form
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

  // Submit edited favorite
  const handleFormSubmit = (data: FavoriteFormData) => {
    if (formMode !== "edit") {
      return;
    }

    const updates: FavoriteUpdates = {};

    if (data.city !== formDefaults.city) {
      updates.city = data.city;
    }

    if ((data.nickname ?? "") !== (formDefaults.nickname ?? "")) {
      updates.nickname = data.nickname ?? "";
    }

    if ((data.notes ?? "") !==(formDefaults.notes ?? "")) {
      updates.notes = data.notes ?? "";
    }

    // Nothing changed
    if (Object.keys(updates).length === 0) {
      setFormMode(null);
      setEditingId(null);
      return;
    }

    updateFavoriteMutation.mutate(updates);
  };

  // Search favorites
  const handleSearchChange = (value: string) => {
    setFavoriteSearch(value);
    setFavoritePage(1);
  };

  return (
    <section className="favorites-page">
      <h2 className="page-title">Favorite Cities</h2>

      {favoriteError && (
        <p className="error-message" role="alert">
          {favoriteError}
        </p>
      )}

      {favoritesQueryError && (
        <p className="error-message" role="alert">
          {favoritesQueryError instanceof Error
            ? favoritesQueryError.message
            : "Unable to load favorites"}
        </p>
      )}

      <FavoriteCities
        cities={favoriteCities}
        unit={unit}
        onDeleteFavorite={(id) => {
          const selectedCity = favoriteCities.find((city) => city.id === id);
          if (selectedCity) {
            setFavoriteToDelete(selectedCity);
          }
        }}
        onSelectCity={handleSelectFavorite}
        onEditFavorite={openEditForm}
        search={favoriteSearch}
        onSearchChange={handleSearchChange}
        page={favoritesData?.pagination.page ?? favoritePage}
        totalPages={favoritesData?.pagination.totalPages ?? 0}
        totalCount={favoritesData?.pagination.totalCount ?? 0}
        onPageChange={setFavoritePage}
        isLoading={favoritesLoading}
        limit={favoriteLimit}
        onLimitChange={(value) => {
          setFavoriteLimit(value);
          setFavoritePage(1);
        }}
      />

      {deleteFavoriteMutation.isPending && (
        <p className="loading-message">Deleting favorite...</p>
      )}

      {formMode === "edit" && (
        <FavoriteForm
          mode="edit"
          defaultValues={formDefaults}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setFormMode(null);
            setEditingId(null);
          }}
          isSubmitting={updateFavoriteMutation.isPending}
        />
      )}

      <ConfirmModal
        isOpen={favoriteToDelete !== null}
        title="Remove favorite?"
        description={`Are you sure you want to remove ${
          favoriteToDelete?.name ?? ""
        } from favorites?`}
        confirmText="Delete"
        cancelText="Cancel"
        isConfirming={deleteFavoriteMutation.isPending}
        onClose={() => {
          if (!deleteFavoriteMutation.isPending) {
            setFavoriteToDelete(null);
          }
        }}
        onConfirm={async () => {
          if (!favoriteToDelete) {
            return;
          }

          try {
            await deleteFavoriteMutation.mutateAsync(favoriteToDelete.id);

            setFavoriteToDelete(null);
          } catch(error) {
              console.error("Failed to delete favorite:", error);
          }
        }}
      />
    </section>
  );
}