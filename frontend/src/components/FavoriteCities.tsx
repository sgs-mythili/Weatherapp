import type { FavoriteCity } from "../types/city";
import { convertTemperature } from "../utils/temperature";
interface FavoriteCitiesProps {
  cities: FavoriteCity[];
  unit: "C" | "F";
  onDeleteFavorite: (id: string) => void;
  onSelectCity: (city: string) => void;
  onEditFavorite: (city: FavoriteCity) => void;
}

function FavoriteCities({cities,unit,onDeleteFavorite,onSelectCity,onEditFavorite,}: FavoriteCitiesProps) {
  return (
    <div className="favorite-cities">
      <h2 className="favorite-title">Cities</h2>

      {cities.length === 0 ? (
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
    </div>
  );
}

export default FavoriteCities;