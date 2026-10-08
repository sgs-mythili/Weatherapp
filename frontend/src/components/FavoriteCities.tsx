import type { FavoriteCity } from "../types/city";
import { convertTemperature } from "../utils/temperature";
interface FavoriteCitiesProps {
  cities: FavoriteCity[];
  unit: "C" | "F";
  onDeleteFavorite: (id: string) => void;
  onSelectCity: (city: string) => void;
  onEditFavorite: (city: FavoriteCity) => void;
  search: string;
  onSearchChange: (value: string) => void;
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

function FavoriteCities({
  cities,
  unit,
  onDeleteFavorite,
  onSelectCity,
  onEditFavorite,
  search,
  onSearchChange,
  page,
  totalPages,
  totalCount,
  onPageChange,
  isLoading,
}: FavoriteCitiesProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="favorite-cities">
      <h2 className="favorite-title">Cities</h2>

      <input
        type="text"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search favorites"
        className="favorite-search"
      />

      {isLoading ? (
        <p className="loading-message">Loading favorites...</p>
      ) : cities.length === 0 ? (
        <p className="empty-message">No cities added yet.</p>
      ) : (
        <div className="favorite-list">
          {cities.map((city) => (
            <div key={city.id} className="favorite-city">
              <div className="favorite-city-info">
                <button
                  onClick={() => onSelectCity(city.name)}
                  className="favorite-city-button"
                >
                  {city.name} - {convertTemperature(city.temperature, unit)}°
                  {unit}
                </button>

                {city.nickname && <p>Nickname: {city.nickname}</p>}
                {city.notes && <p>Notes: {city.notes}</p>}
              </div>

              <div className="favorite-city-actions">
                <button
                  type="button"
                  onClick={() => onEditFavorite(city)}
                  className="edit-button"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDeleteFavorite(city.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="favorite-pagination">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="page-button"
        >
          Previous
        </button>

        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={
              pageNumber === page ? "page-button active" : "page-button"
            }
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={totalPages === 0 || page >= totalPages}
          className="page-button"
        >
          Next
        </button>

        <span className="page-count">{totalCount} cities</span>
      </div>
    </div>
  );
}

export default FavoriteCities;