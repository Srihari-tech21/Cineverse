// ==========================================================
// CineVerse 2.0 - Personal Profile & Statistics Page
// Displays user viewing activity, watchlist metrics,
// favorite genres customization, and user reviews history.
// ==========================================================

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Bookmark,
  Check,
  Star,
  MessageSquare,
  Sparkles,
  Settings,
  Clock,
  Film,
  Trash2,
} from "lucide-react";
import { getMovies, getGenres, getReviews, deleteReview } from "../services/api";
import { useWatchlist } from "../context/WatchlistContext";
import { useToast } from "../components/Toast";
import { Loading } from "../components/Loading";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import { RatingStarsDisplay } from "../components/RatingStars";
import { calculateAverageRating } from "../utils/calculations";

const Profile = () => {
  const {
    watchlist,
    preferences,
    updatePreferences,
    watchlistCount,
    watchedCount,
    unwatchedCount,
  } = useWatchlist();

  const { addToast } = useToast();

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Preference editing state
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [savingPrefs, setSavingPrefs] = useState(false);

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
        console.error("Failed to load profile data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sync initial favorite genres
  useEffect(() => {
    if (preferences?.favoriteGenres) {
      setSelectedGenres(preferences.favoriteGenres);
    }
  }, [preferences]);

  const genreMap = useMemo(() => {
    return new Map(genres.map((g) => [String(g.id), g.name]));
  }, [genres]);

  // Watched movies
  const watchedMovies = useMemo(() => {
    const watchedIds = new Set(
      watchlist.filter((w) => w.watched).map((w) => String(w.movieId))
    );
    return movies.filter((m) => watchedIds.has(String(m.id)));
  }, [watchlist, movies]);

  // User's reviews (demo user reviews)
  const userReviews = useMemo(() => {
    const nameMatch = preferences?.name || "Cinema";
    return reviews.filter(
      (r) =>
        r.reviewerName?.toLowerCase().includes("cinema") ||
        r.reviewerName?.toLowerCase().includes("alex")
    );
  }, [reviews, preferences]);

  // Personal average rating given
  const personalAvgRating = useMemo(() => {
    if (userReviews.length === 0) return null;
    const total = userReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    return (total / userReviews.length).toFixed(1);
  }, [userReviews]);

  // Toggle genre in preferences
  const handleGenreToggle = (genreId) => {
    const gIdStr = String(genreId);
    setSelectedGenres((prev) =>
      prev.includes(gIdStr)
        ? prev.filter((id) => id !== gIdStr)
        : [...prev, gIdStr]
    );
  };

  // Save genre preferences
  const handleSavePreferences = async () => {
    try {
      setSavingPrefs(true);
      await updatePreferences({
        ...preferences,
        favoriteGenres: selectedGenres,
      });
      addToast("Genre preferences saved successfully!", "success");
    } catch {
      addToast("Failed to save preferences", "error");
    } finally {
      setSavingPrefs(false);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => String(r.id) !== String(reviewId)));
      addToast("Review deleted", "info");
    } catch {
      addToast("Failed to delete review", "error");
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <Loading message="Loading profile & personal stats..." />
      </div>
    );
  }

  const completionRate =
    watchlistCount > 0 ? Math.round((watchedCount / watchlistCount) * 100) : 0;

  return (
    <div className="page-content">
      {/* Profile Header Banner */}
      <div className="page-banner">
        <div className="container">
          <div className="profile-banner-content">
            <img
              src={preferences?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
              alt="User Avatar"
              className="profile-large-avatar"
            />
            <div className="profile-banner-info">
              <div className="profile-role-badge">Demo Member • CineVerse Enthusiast</div>
              <h1 className="page-banner-title" style={{ margin: "4px 0" }}>
                {preferences?.name || "Cinema Enthusiast"}
              </h1>
              <p className="page-banner-subtitle">
                {preferences?.bio || "Movie lover exploring great cinema stories"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="container"
        style={{ paddingTop: "var(--space-xl)", paddingBottom: "var(--space-3xl)" }}
      >
        {/* Personal Statistics Grid */}
        <div className="profile-stats-grid">
          <div className="profile-stat-card">
            <div className="stat-card-icon" style={{ color: "var(--accent-primary)" }}>
              <Bookmark size={22} />
            </div>
            <div className="stat-card-val">{watchlistCount}</div>
            <div className="stat-card-label">Watchlist Titles</div>
          </div>

          <div className="profile-stat-card">
            <div className="stat-card-icon" style={{ color: "var(--accent-green)" }}>
              <Check size={22} />
            </div>
            <div className="stat-card-val">{watchedCount}</div>
            <div className="stat-card-label">Movies Watched</div>
          </div>

          <div className="profile-stat-card">
            <div className="stat-card-icon" style={{ color: "var(--accent-gold)" }}>
              <Star size={22} />
            </div>
            <div className="stat-card-val">{personalAvgRating || "—"}</div>
            <div className="stat-card-label">Avg Rating Given</div>
          </div>

          <div className="profile-stat-card">
            <div className="stat-card-icon" style={{ color: "var(--accent-cyan)" }}>
              <MessageSquare size={22} />
            </div>
            <div className="stat-card-val">{userReviews.length}</div>
            <div className="stat-card-label">Reviews Written</div>
          </div>
        </div>

        {/* Favorite Genres Preference Selector */}
        <div className="profile-section-card">
          <div className="section-card-header">
            <div>
              <h3 className="section-card-title">
                <Sparkles size={18} style={{ color: "var(--accent-primary)", verticalAlign: "middle", marginRight: 8 }} />
                Your Favorite Genres
              </h3>
              <p className="section-card-desc">
                Select your preferred genres to tune your personalized recommendation engine
              </p>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSavePreferences}
              disabled={savingPrefs}
            >
              {savingPrefs ? "Saving..." : "Save Preferences"}
            </button>
          </div>

          <div className="genre-chips-selector">
            {genres.map((genre) => {
              const isSelected = selectedGenres.includes(String(genre.id));
              return (
                <button
                  key={genre.id}
                  type="button"
                  className={`genre-selector-chip ${isSelected ? "selected" : ""}`}
                  onClick={() => handleGenreToggle(genre.id)}
                >
                  {genre.name} {isSelected && <Check size={14} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Watched Movies Showcase */}
        <div className="profile-section-card" style={{ marginTop: "var(--space-2xl)" }}>
          <div className="section-card-header">
            <div>
              <h3 className="section-card-title">
                <Check size={18} style={{ color: "var(--accent-green)", verticalAlign: "middle", marginRight: 8 }} />
                Movies You've Watched ({watchedMovies.length})
              </h3>
              <p className="section-card-desc">
                Titles logged in your viewing history
              </p>
            </div>
            <Link to="/watchlist" className="btn btn-ghost btn-sm">
              Manage Queue
            </Link>
          </div>

          {watchedMovies.length > 0 ? (
            <div className="movie-grid">
              {watchedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  genreName={genreMap.get(String(movie.genreId)) || "Film"}
                  avgRating={calculateAverageRating(reviews, movie.id)}
                />
              ))}
            </div>
          ) : (
            <div className="profile-empty-block">
              <Film size={36} opacity={0.4} />
              <p>You haven't marked any movies as watched yet.</p>
              <Link to="/discover" className="btn btn-secondary btn-sm">
                Explore Movies
              </Link>
            </div>
          )}
        </div>

        {/* User's Reviews Showcase */}
        <div className="profile-section-card" style={{ marginTop: "var(--space-2xl)" }}>
          <div className="section-card-header">
            <div>
              <h3 className="section-card-title">
                <MessageSquare size={18} style={{ color: "var(--accent-cyan)", verticalAlign: "middle", marginRight: 8 }} />
                Your Community Reviews ({userReviews.length})
              </h3>
              <p className="section-card-desc">
                Ratings and reviews submitted from your account
              </p>
            </div>
          </div>

          {userReviews.length > 0 ? (
            <div className="profile-reviews-list">
              {userReviews.map((rev) => {
                const reviewedMovie = movies.find((m) => String(m.id) === String(rev.movieId));
                return (
                  <div key={rev.id} className="profile-review-item">
                    <div className="profile-review-top">
                      <div>
                        {reviewedMovie ? (
                          <Link to={`/movies/${reviewedMovie.id}`} className="review-movie-link">
                            {reviewedMovie.title} ({reviewedMovie.releaseYear})
                          </Link>
                        ) : (
                          <span className="review-movie-link">Movie #{rev.movieId}</span>
                        )}
                        <div style={{ marginTop: 4 }}>
                          <RatingStarsDisplay rating={rev.rating} size={15} />
                        </div>
                      </div>

                      <div className="review-meta-actions">
                        <span className="review-date-text">{rev.date}</span>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm btn-icon-danger"
                          onClick={() => handleDeleteReview(rev.id)}
                          title="Delete Review"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <p className="profile-review-comment">"{rev.comment}"</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="profile-empty-block">
              <MessageSquare size={36} opacity={0.4} />
              <p>You haven't written any movie reviews yet.</p>
              <Link to="/discover" className="btn btn-secondary btn-sm">
                Review a Movie
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
