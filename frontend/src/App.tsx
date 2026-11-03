import {
  BrowserRouter,
  NavLink,
  Navigate,
  Route,
  Routes,
} from "react-router";

import {useQueryClient} from "@tanstack/react-query";
import DashboardPage from "./pages/DashboardPage";
import FavoritesPage from "./pages/FavoritesPage";
import CityDetailsPage from "./pages/CityDetailsPage";
import {useWeatherStore} from "./store/weatherStore";
import TenantSelector from "./components/TenantSelector";

function App() {
 const queryClient = useQueryClient();
 const unit = useWeatherStore(
    (state) => state.unit
  );

  const toggleUnit = useWeatherStore(
  (state) => state.actions.toggleUnit
 );

  const setCurrentTenant = useWeatherStore(
    (state) => state.actions.setCurrentTenant
  );

  const handleTenantChange = async (tenantId: "tenant-alpha" | "tenant-beta") => { 
  setCurrentTenant(tenantId);
  await queryClient.invalidateQueries();
}

  return (
    <BrowserRouter>
      <div className="weather-container">
        <header className="app-header">
          <h1 className="weather-title">Weather Dashboard</h1>

          <nav className="app-navigation">
            <NavLink to="/" end>
              Dashboard
            </NavLink>

            <NavLink to="/favorites">Favorites</NavLink>
          </nav>
          <TenantSelector onTenantChange={handleTenantChange} />
          <button type="button" onClick={toggleUnit} className="unit-button" aria-label={`Switch to ${unit === "C" ? "Fahrenheit" : "Celsius"}`}>
            Switch to °{unit === "C" ? "F" : "C"}
          </button>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<DashboardPage />} />

            <Route path="/favorites" element={<FavoritesPage />} />

            <Route path="/city/:cityName" element={<CityDetailsPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;