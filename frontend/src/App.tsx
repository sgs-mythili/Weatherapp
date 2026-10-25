import {
  BrowserRouter,
  NavLink,
  Navigate,
  Route,
  Routes,
} from "react-router";

import DashboardPage from "./pages/DashboardPage";
import FavoritesPage from "./pages/FavoritesPage";
import CityDetailsPage from "./pages/CityDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="weather-container">
        <header className="app-header">
          <h1 className="weather-title">
            Weather Dashboard
          </h1>

          <nav className="app-navigation">
            <NavLink to="/" end>
              Dashboard
            </NavLink>

            <NavLink to="/favorites">
              Favorites
            </NavLink>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route
              path="/"
              element={<DashboardPage />}
            />

            <Route
              path="/favorites"
              element={<FavoritesPage />}
            />

            <Route
              path="/city/:cityName"
              element={<CityDetailsPage />}
            />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;