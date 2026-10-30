// ==========================================================
// CineVerse 2.0 Navbar Component
// Sticky navigation with Watchlist badge, Recommendations,
// User Profile menu, and responsive mobile drawer.
// ==========================================================

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Film,
  Home,
  Compass,
  Tags,
  Bookmark,
  Sparkles,
  User,
  Shield,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useWatchlist } from "../context/WatchlistContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { watchlistCount, preferences } = useWatchlist();
  const { theme, toggleTheme, isDark } = useTheme();

  // Check if current path matches
  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMobile}>
          <div className="logo-icon">
            <Film size={20} />
          </div>
          <span>
            Cine<span className="logo-accent">Verse</span>
          </span>
          <span className="logo-version">2.0</span>
        </Link>

        {/* Navigation Links */}
        <div className={`navbar-links ${mobileOpen ? "open" : ""}`}>
          <Link
            to="/"
            className={isActive("/") ? "active" : ""}
            onClick={closeMobile}
          >
            <Home size={16} /> Home
          </Link>

          <Link
            to="/discover"
            className={isActive("/discover") || isActive("/movies") ? "active" : ""}
            onClick={closeMobile}
          >
            <Compass size={16} /> Discover
          </Link>

          <Link
            to="/genres"
            className={isActive("/genres") ? "active" : ""}
            onClick={closeMobile}
          >
            <Tags size={16} /> Genres
          </Link>

          <Link
            to="/watchlist"
            className={`nav-watchlist-link ${isActive("/watchlist") ? "active" : ""}`}
            onClick={closeMobile}
          >
            <Bookmark size={16} />
            <span>Watchlist</span>
            {watchlistCount > 0 && (
              <span className="nav-badge" title={`${watchlistCount} movies in watchlist`}>
                {watchlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/recommendations"
            className={isActive("/recommendations") ? "active" : ""}
            onClick={closeMobile}
          >
            <Sparkles size={16} /> Recommendations
          </Link>

          <div className="nav-divider" />

          {/* User Profile */}
          <Link
            to="/profile"
            className={`nav-profile-btn ${isActive("/profile") ? "active" : ""}`}
            onClick={closeMobile}
          >
            {preferences?.avatar ? (
              <img
                src={preferences.avatar}
                alt="Profile"
                className="nav-avatar"
              />
            ) : (
              <User size={16} />
            )}
            <span className="nav-user-name">{preferences?.name?.split(" ")[0] || "Profile"}</span>
          </Link>

          {/* Admin link */}
          <Link
            to="/admin"
            className={`nav-admin-link ${isActive("/admin") ? "active" : ""}`}
            onClick={closeMobile}
          >
            <Shield size={15} /> Admin
          </Link>
        </div>

        {/* Actions Group: Theme Toggle & Mobile Drawer Button */}
        <div className="nav-actions-group">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to Warm Editorial Light" : "Switch to Cinematic Dark Mode"}
          >
            {isDark ? (
              <Sun size={18} className="theme-icon sun-icon" />
            ) : (
              <Moon size={18} className="theme-icon moon-icon" />
            )}
            <span className="theme-toggle-label">{isDark ? "Light" : "Dark"}</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
