// ==========================================================
// CineVerse 2.0 - App.jsx
// React Router configuration with User Discovery, Personal
// Watchlist, Recommendations, Profile, and Admin Panel routes.
// ==========================================================

import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastProvider } from "./components/Toast";
import { WatchlistProvider } from "./context/WatchlistContext";
import { ThemeProvider } from "./context/ThemeContext";

// Page imports
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Genres from "./pages/Genres";
import Watchlist from "./pages/Watchlist";
import Recommendations from "./pages/Recommendations";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/AdminDashboard";
import ManageMovies from "./pages/ManageMovies";
import AddMovie from "./pages/AddMovie";
import EditMovie from "./pages/EditMovie";
import ManageGenres from "./pages/ManageGenres";
import ManageReviews from "./pages/ManageReviews";
import NotFound from "./pages/NotFound";

// ScrollToTop: scrolls window to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

/**
 * AppLayout - renders Navbar + all CineVerse 2.0 routes
 */
const AppLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        {/* ===== User Discovery & Community Routes ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Movies />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/genres" element={<Genres />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/profile" element={<Profile />} />

        {/* ===== Admin Management Routes ===== */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/movies" element={<ManageMovies />} />
        <Route path="/admin/movies/add" element={<AddMovie />} />
        <Route path="/admin/movies/edit/:id" element={<EditMovie />} />
        <Route path="/admin/genres" element={<ManageGenres />} />
        <Route path="/admin/reviews" element={<ManageReviews />} />

        {/* ===== 404 Catch-All Route ===== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <WatchlistProvider>
            <AppLayout />
          </WatchlistProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
