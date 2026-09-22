import type { FavoriteCity } from "../types/city";
import { convertTemperature } from "../utils/temperature";
interface FavoriteCitiesProps {
  cities: FavoriteCity[];
  unit: "C" | "F";
  onDeleteFavorite: (id: string) => void;
  onSelectCity: (city: string) => void;
}

function FavoriteCities({cities,unit,onDeleteFavorite,onSelectCity,}: FavoriteCitiesProps) {
  return (  
    <div className="favorite-cities">
      <h2 className="favorite-title">
         Cities
      </h2>

      {cities.length === 0 ? (
        <p className="empty-message">
          No cities added yet.
        </p>
      ) : (
        <div className="favorite-list">
          {cities.map((city) => (
            <div
              key={city.id}
              className="favorite-city"
            >
              <button
                onClick={() =>
                  onSelectCity(city.name)
                }
                className="favorite-city-button"
              >
                {city.name} - {convertTemperature(city.temperature, unit)}°{unit}
              </button>

              <button
                onClick={() =>
                  onDeleteFavorite(city.id)
                }
                className="delete-button"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoriteCities;