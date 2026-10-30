// ==========================================================
// CineVerse 2.0 - Personal Watchlist & Tracking Page
// Features: All / To Watch / Watched tabs, Progress statistics,
// Quick watched status toggle, Remove from watchlist,
// and Empty states with recommendations link.
// ==========================================================

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  Check,
  Eye,
  Trash2,
  Film,
  Sparkles,
  ArrowRight,
  Clock,
  Compass,
} from "lucide-react";
import { getMovies, getGenres, getReviews } from "../services/api";
import { useWatchlist } from "../context/WatchlistContext";
import { useToast } from "../components/Toast";
import { Loading } from "../components/Loading";
import EmptyState from "../components/EmptyState";
import Footer from "../components/Footer";
import { calculateAverageRating } from "../utils/calculations";
import { getPosterUrl, handleImageError } from "../utils/imageUtils";

const Watchlist = () => {
  const {
    watchlist,
    toggleWatched,
    removeMovie,
    loading: watchlistLoading,
    watchlistCount,
    watchedCount,
    unwatchedCount,
  } = useWatchlist();

  const { addToast } = useToast();

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter tab: "all", "unwatched", "watched"
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("added-desc");

  // Load movies catalogue
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
        console.error("Failed to load movies for watchlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const genreMap = useMemo(() => {
    return new Map(genres.map((g) => [String(g.id), g.name]));
  }, [genres]);

  // Combine watchlist item with movie details
  const enrichedWatchlist = useMemo(() => {
    const movieMap = new Map(movies.map((m) => [String(m.id), m]));

    return watchlist
      .map((item) => {
        const movie = movieMap.get(String(item.movieId));
        if (!movie) return null;

        const avgRating = calculateAverageRating(reviews, movie.id);

        return {
          ...item,
          movie,
          avgRating,
          genreName: genreMap.get(String(movie.genreId)) || "General",
        };
      })
      .filter(Boolean);
  }, [watchlist, movies, reviews, genreMap]);

  // Filter by Tab and Sort
  const displayItems = useMemo(() => {
    let list = [...enrichedWatchlist];

    if (activeTab === "watched") {
      list = list.filter((item) => item.watched);
    } else if (activeTab === "unwatched") {
      list = list.filter((item) => !item.watched);
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === "added-desc") {
        return (b.addedDate || "").localeCompare(a.addedDate || "");
      }
      if (sortBy === "added-asc") {
        return (a.addedDate || "").localeCompare(b.addedDate || "");
      }
      if (sortBy === "rating-desc") {
        return (parseFloat(b.avgRating) || 0) - (parseFloat(a.avgRating) || 0);
      }
      if (sortBy === "title-asc") {
        return a.movie.title.localeCompare(b.movie.title);
      }
      return 0;
    });

    return list;
  }, [enrichedWatchlist, activeTab, sortBy]);

  // Calculate completion percentage
  const completionPercentage =
    watchlistCount > 0 ? Math.round((watchedCount / watchlistCount) * 100) : 0;

  // Handle watched toggle
  const handleToggleWatched = async (movieId, movieTitle) => {
    try {
      const res = await toggleWatched(movieId);
      addToast(
        res.watched
          ? `Marked "${movieTitle}" as watched!`
          : `Moved "${movieTitle}" back to watch queue`,
        "success"
      );
    } catch {
      addToast("Failed to update status", "error");
    }
  };

  // Handle remove
  const handleRemove = async (movieId, movieTitle) => {
    try {
      await removeMovie(movieId);
      addToast(`Removed "${movieTitle}" from your watchlist`, "info");
    } catch {
      addToast("Failed to remove item", "error");
    }
  };

  if (loading || watchlistLoading) {
    return (
      <div className="page-content">
        <Loading message="Loading your personal watchlist..." />
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Banner */}
      <div className="page-banner">
        <div className="container">
          <div className="banner-badge">
            <Bookmark size={14} /> Personal Movie Queue
          </div>
          <h1 className="page-banner-title">My Watchlist</h1>
          <p className="page-banner-subtitle">
            Track movies you plan to watch, log completed viewings, and organize your personal cinema queue
          </p>
        </div>
      </div>

      <div
        className="container"
        style={{ paddingTop: "var(--space-xl)", paddingBottom: "var(--space-3xl)" }}
      >
        {/* Watchlist Statistics Card */}
        <div className="watchlist-stats-card">
          <div className="watchlist-stats-grid">
            <div className="watchlist-stat-box">
              <span className="stat-num">{watchlistCount}</span>
              <span className="stat-label">Saved in Queue</span>
            </div>
            <div className="watchlist-stat-box">
              <span className="stat-num highlight-accent">{watchedCount}</span>
              <span className="stat-label">Movies Watched</span>
            </div>
            <div className="watchlist-stat-box">
              <span className="stat-num">{unwatchedCount}</span>
              <span className="stat-label">Remaining to Watch</span>
            </div>
            <div className="watchlist-stat-box">
              <span className="stat-num">{completionPercentage}%</span>
              <span className="stat-label">Progress</span>
            </div>
          </div>

          <div className="watchlist-progress-track">
            <div
              className="watchlist-progress-fill"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Filters and Tabs Toolbar */}
        <div className="watchlist-toolbar">
          <div className="watchlist-tabs">
            <button
              className={`watchlist-tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Titles ({watchlistCount})
            </button>
            <button
              className={`watchlist-tab-btn ${activeTab === "unwatched" ? "active" : ""}`}
              onClick={() => setActiveTab("unwatched")}
            >
              <Clock size={14} /> To Watch ({unwatchedCount})
            </button>
            <button
              className={`watchlist-tab-btn ${activeTab === "watched" ? "active" : ""}`}
              onClick={() => setActiveTab("watched")}
            >
              <Check size={14} /> Watched ({watchedCount})
            </button>
          </div>

          <div className="watchlist-sort-wrapper">
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort watchlist"
            >
              <option value="added-desc">Recently Added</option>
              <option value="added-asc">Oldest Added</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="title-asc">Title: A - Z</option>
            </select>
          </div>
        </div>

        {/* Watchlist Items Grid */}
        {displayItems.length > 0 ? (
          <div className="watchlist-cards-grid">
            {displayItems.map(({ id: entryId, movie, watched, addedDate, watchedDate, avgRating, genreName }) => (
              <div key={entryId} className={`watchlist-item-card ${watched ? "is-watched" : ""}`}>
                {/* Poster */}
                <div className="watchlist-item-poster">
                  <img
                    src={getPosterUrl(movie.poster)}
                    alt={movie.title}
                    onError={(e) => handleImageError(e)}
                    loading="lazy"
                  />
                  {watched && (
                    <div className="watched-badge-overlay">
                      <Check size={14} /> Watched
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="watchlist-item-content">
                  <div className="watchlist-item-header">
                    <span className="movie-card-genre">{genreName}</span>
                    <span className="watchlist-date-text">
                      Added {addedDate}
                    </span>
                  </div>

                  <Link to={`/movies/${movie.id}`} className="watchlist-item-title">
                    {movie.title}
                  </Link>

                  <div className="watchlist-item-meta">
                    <span>{movie.releaseYear}</span>
                    {movie.duration && <span>• {movie.duration}m</span>}
                    {movie.director && <span>• Dir. {movie.director}</span>}
                    {avgRating > 0 && <span className="highlight-rating">★ {avgRating}</span>}
                  </div>

                  <p className="watchlist-item-desc">{movie.description}</p>

                  {/* Actions footer */}
                  <div className="watchlist-item-actions">
                    <button
                      type="button"
                      className={`btn btn-sm ${watched ? "btn-secondary" : "btn-primary"}`}
                      onClick={() => handleToggleWatched(movie.id, movie.title)}
                    >
                      {watched ? (
                        <>
                          <Check size={14} /> Watched (Mark Unwatched)
                        </>
                      ) : (
                        <>
                          <Eye size={14} /> Mark as Watched
                        </>
                      )}
                    </button>

                    <Link to={`/movies/${movie.id}`} className="btn btn-outline btn-sm">
                      Details <ArrowRight size={13} />
                    </Link>

                    <button
                      type="button"
                      className="btn btn-ghost btn-sm btn-icon-danger"
                      onClick={() => handleRemove(movie.id, movie.title)}
                      title="Remove from Watchlist"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Bookmark size={46} />}
            title={
              activeTab === "watched"
                ? "No watched movies yet"
                : activeTab === "unwatched"
                ? "All caught up!"
                : "Your watchlist is empty"
            }
            message={
              activeTab === "watched"
                ? "When you watch movies from your queue, mark them as watched to track your viewing history."
                : "Explore the catalogue to discover great films and save them to your queue."
            }
            action={
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <Link to="/discover" className="btn btn-primary">
                  <Compass size={16} /> Discover Movies
                </Link>
                <Link to="/recommendations" className="btn btn-secondary">
                  <Sparkles size={16} /> Get Recommendations
                </Link>
              </div>
            }
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Watchlist;
