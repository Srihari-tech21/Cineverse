// ==========================================================
// CineVerse 2.0 - Smart Movie Recommendations Page
// Content-based recommendation system that analyzes taste profiles,
// watched history, favorite genres, and ratings with match scores
// and contextual explanations.
// ==========================================================

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  SlidersHorizontal,
  Bookmark,
  Check,
  Compass,
  User,
  Heart,
  Eye,
  ArrowRight,
} from "lucide-react";
import { getMovies, getGenres, getReviews } from "../services/api";
import { useWatchlist } from "../context/WatchlistContext";
import { useToast } from "../components/Toast";
import { Loading } from "../components/Loading";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import { calculateAverageRating } from "../utils/calculations";
import {
  getPersonalizedRecommendations,
  buildUserTasteProfile,
} from "../utils/recommendations";

const Recommendations = () => {
  const { watchlist, preferences, isWatchlisted, toggleWatchlist } = useWatchlist();
  const { addToast } = useToast();

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Recommendation configuration options
  const [excludeWatched, setExcludeWatched] = useState(true);
  const [excludeWatchlist, setExcludeWatchlist] = useState(false);
  const [filterGenre, setFilterGenre] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [moviesData, genresData, reviewsData] = await Promise.all([
          getMovies(),
          getGenres(),
          getReviews(),
        ]);
        setMovies(moviesData || []);
        setGenres(genresData || []);
        setReviews(reviewsData || []);
      } catch (err) {
        console.error("Failed to load recommendation data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const genreMap = useMemo(() => {
    return new Map(genres.map((g) => [String(g.id), g.name]));
  }, [genres]);

  // Build taste profile summary for explanation banner
  const tasteProfile = useMemo(() => {
    return buildUserTasteProfile(movies, watchlist, reviews, preferences);
  }, [movies, watchlist, reviews, preferences]);

  // Top preferred genres names
  const preferredGenreNames = useMemo(() => {
    const sorted = Object.entries(tasteProfile.genreWeights)
      .sort(([, a], [, b]) => b - a)
      .map(([id]) => genreMap.get(id))
      .filter(Boolean);
    return sorted.slice(0, 3);
  }, [tasteProfile, genreMap]);

  // Top preferred directors
  const preferredDirectors = useMemo(() => {
    return Object.entries(tasteProfile.directorWeights)
      .sort(([, a], [, b]) => b - a)
      .map(([dir]) => dir)
      .slice(0, 2);
  }, [tasteProfile]);

  // Calculate recommendations
  const recommendedMovies = useMemo(() => {
    if (movies.length === 0) return [];

    let recs = getPersonalizedRecommendations(
      movies,
      genres,
      reviews,
      watchlist,
      preferences,
      {
        excludeWatched,
        excludeWatchlist,
        limit: 20,
      }
    );

    if (filterGenre) {
      recs = recs.filter((m) => String(m.genreId) === String(filterGenre));
    }

    return recs;
  }, [movies, genres, reviews, watchlist, preferences, excludeWatched, excludeWatchlist, filterGenre]);

  if (loading) {
    return (
      <div className="page-content">
        <Loading message="Curating personalized movie recommendations..." />
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Banner */}
      <div className="page-banner">
        <div className="container">
          <div className="banner-badge">
            <Sparkles size={14} /> AI & Content-Based Matching
          </div>
          <h1 className="page-banner-title">Personalized Recommendations</h1>
          <p className="page-banner-subtitle">
            Smart film suggestions calculated from your watchlist activity, preferred genres, and review ratings
          </p>
        </div>
      </div>

      <div
        className="container"
        style={{ paddingTop: "var(--space-xl)", paddingBottom: "var(--space-3xl)" }}
      >
        {/* Taste Profile Insight Box */}
        <div className="recommendations-insight-box">
          <div className="insight-header">
            <User size={18} className="insight-icon" />
            <h3 className="insight-title">Your Taste Profile Insights</h3>
          </div>
          <p className="insight-text">
            {preferredGenreNames.length > 0 ? (
              <>
                Based on your interest in{" "}
                <strong>{preferredGenreNames.join(", ")}</strong>
                {preferredDirectors.length > 0 && (
                  <>
                    {" "}and films directed by <strong>{preferredDirectors.join(" & ")}</strong>
                  </>
                )}
                . CineVerse matches these patterns against the whole catalogue.
              </>
            ) : (
              "You're just getting started! We've generated recommendations based on top-rated community classics."
            )}
          </p>
          <div className="insight-links">
            <Link to="/profile" className="insight-link">
              <SlidersHorizontal size={13} /> Customize Genre Preferences
            </Link>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="recommendations-toolbar">
          <div className="rec-toggles">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={excludeWatched}
                onChange={(e) => setExcludeWatched(e.target.checked)}
              />
              <span>Exclude Watched Movies</span>
            </label>

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={excludeWatchlist}
                onChange={(e) => setExcludeWatchlist(e.target.checked)}
              />
              <span>Exclude Current Watchlist</span>
            </label>
          </div>

          <div className="rec-genre-select">
            <select
              className="filter-select"
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              aria-label="Filter recommendations by genre"
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recommendations Grid */}
        {recommendedMovies.length > 0 ? (
          <div className="movie-grid">
            {recommendedMovies.map((movie) => (
              <div key={movie.id} className="recommendation-card-container">
                <MovieCard
                  movie={movie}
                  genreName={genreMap.get(String(movie.genreId)) || "General"}
                  avgRating={calculateAverageRating(reviews, movie.id)}
                  matchScore={movie.matchScore}
                  recommendationReason={movie.reason}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Sparkles size={46} style={{ color: "var(--accent-primary)", opacity: 0.7 }} />
            <h3>No matches found with current filters</h3>
            <p>Try unchecking "Exclude Watched" or select "All Genres" to see more matches.</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setExcludeWatched(false);
                setExcludeWatchlist(false);
                setFilterGenre("");
              }}
            >
              Reset Recommendation Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Recommendations;
