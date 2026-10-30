// ==========================================================
// CineVerse 2.0 - MovieDetails Page
// Features: Full widescreen cinematic backdrop, Watchlist toggle,
// Watched status tracking, Rating distribution breakdown,
// Similar Movies recommendations, and Interactive Review submission.
// ==========================================================

import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Users,
  Star,
  ArrowLeft,
  MessageSquare,
  Film,
  Bookmark,
  Check,
  Eye,
  Globe,
  Sparkles,
} from "lucide-react";
import { getMovieById, getMovies, getGenres, getReviews, addReview } from "../services/api";
import { RatingStarsDisplay } from "../components/RatingStars";
import ReviewForm from "../components/ReviewForm";
import ReviewCard from "../components/ReviewCard";
import MovieCard from "../components/MovieCard";
import { Loading } from "../components/Loading";
import Footer from "../components/Footer";
import { useToast } from "../components/Toast";
import { calculateAverageRating } from "../utils/calculations";
import { getSimilarMovies } from "../utils/recommendations";
import { useWatchlist } from "../context/WatchlistContext";
import { getPosterUrl, getBackdropUrl, FALLBACK_POSTER } from "../utils/imageUtils";

const MovieDetails = () => {
  const { id } = useParams();
  const { addToast } = useToast();
  const { isWatchlisted, isWatched, toggleWatchlist, toggleWatched } = useWatchlist();

  const [movie, setMovie] = useState(null);
  const [allMovies, setAllMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  // Fetch movie details, catalogue, and reviews when ID changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [movieData, allMoviesData, genresData, reviewsData] = await Promise.all([
          getMovieById(id),
          getMovies(),
          getGenres(),
          getReviews(),
        ]);
        setMovie(movieData);
        setAllMovies(allMoviesData || []);
        setGenres(genresData || []);
        setReviews(reviewsData || []);
      } catch {
        setError("Movie not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Derived state
  const genreMap = useMemo(() => {
    return new Map(genres.map((g) => [String(g.id), g.name]));
  }, [genres]);

  const genreName = movie ? genreMap.get(String(movie.genreId)) || "General" : "";

  // Filter reviews for this movie
  const movieReviews = useMemo(() => {
    if (!movie) return [];
    return reviews.filter((r) => String(r.movieId) === String(movie.id));
  }, [reviews, movie]);

  const avgRating = movie ? calculateAverageRating(reviews, movie.id) : 0;
  const reviewCount = movieReviews.length;

  // Rating distribution breakdown (5 stars to 1 star)
  const ratingDistribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    movieReviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      counts[star] = (counts[star] || 0) + 1;
    });

    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: counts[star],
      percentage: reviewCount > 0 ? Math.round((counts[star] / reviewCount) * 100) : 0,
    }));
  }, [movieReviews, reviewCount]);

  // Similar movies
  const similarMovies = useMemo(() => {
    if (!movie || allMovies.length === 0) return [];
    return getSimilarMovies(movie, allMovies, 4);
  }, [movie, allMovies]);

  // Watchlist status
  const inWatchlist = movie ? isWatchlisted(movie.id) : false;
  const watched = movie ? isWatched(movie.id) : false;

  const handleWatchlistToggle = async () => {
    if (!movie) return;
    try {
      const res = await toggleWatchlist(movie);
      addToast(
        res.added
          ? `Added "${movie.title}" to your Watchlist`
          : `Removed "${movie.title}" from Watchlist`,
        "success"
      );
    } catch {
      addToast("Failed to update watchlist", "error");
    }
  };

  const handleWatchedToggle = async () => {
    if (!movie) return;
    try {
      const res = await toggleWatched(movie.id);
      addToast(res.message, "success");
    } catch {
      addToast("Failed to update watched status", "error");
    }
  };

  // Submit review
  const handleSubmitReview = async (reviewData) => {
    try {
      await addReview({
        ...reviewData,
        movieId: String(movie.id),
      });

      // Refresh reviews
      const updatedReviews = await getReviews();
      setReviews(updatedReviews || []);

      addToast("Review submitted successfully! Thank you for sharing.", "success");
    } catch (err) {
      addToast("Failed to submit review. Please try again.", "error");
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <Loading message="Loading movie details & community reviews..." />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="page-content container" style={{ padding: "80px 20px", textAlign: "center" }}>
        <Film size={54} style={{ color: "var(--accent-primary)", opacity: 0.5, marginBottom: 16 }} />
        <h2>{error || "Movie Not Found"}</h2>
        <p style={{ color: "var(--text-secondary)", margin: "12px 0 24px" }}>
          The movie you are looking for may have been removed or the ID is invalid.
        </p>
        <Link to="/discover" className="btn btn-primary">
          <ArrowLeft size={16} /> Explore All Movies
        </Link>
      </div>
    );
  }

  const backdropUrl = getBackdropUrl(movie.backdrop || movie.poster);
  const posterUrl = getPosterUrl(movie.poster);
  const castList = Array.isArray(movie.cast) ? movie.cast.join(", ") : movie.cast || "";

  return (
    <div className="page-content" style={{ paddingTop: 0 }}>
      {/* ===== Backdrop Hero Banner ===== */}
      <div className="movie-backdrop-header">
        <div
          className="movie-backdrop-bg"
          style={{
            backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none",
          }}
        />
        <div className="movie-backdrop-gradient" />
      </div>

      <div className="container" style={{ position: "relative", zIndex: 2, marginTop: "-160px" }}>
        {/* Navigation Breadcrumb */}
        <Link to="/discover" className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }}>
          <ArrowLeft size={15} /> Back to Discover
        </Link>

        {/* ===== Main Movie Info Card ===== */}
        <div className="movie-details-hero">
          {/* Poster Column */}
          <div className="movie-details-poster">
            {!imgError ? (
              <img
                src={posterUrl}
                alt={movie.title}
                onError={(e) => {
                  if (!e.currentTarget.dataset.hasFailed) {
                    e.currentTarget.dataset.hasFailed = "true";
                    e.currentTarget.src = FALLBACK_POSTER;
                  } else {
                    setImgError(true);
                  }
                }}
              />
            ) : (
              <div className="poster-fallback" style={{ height: "100%", minHeight: 380 }}>
                <Film size={48} />
                <span>{movie.title}</span>
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="movie-details-info">
            <div className="details-badge-row">
              <span className="movie-details-genre">{genreName}</span>
              {movie.industry && (
                <span className="movie-details-pill" style={{ borderColor: "var(--accent-gold)", color: "var(--accent-gold)" }}>
                  <Film size={12} /> {movie.industry}
                </span>
              )}
              {movie.language && (
                <span className="movie-details-pill">
                  <Globe size={12} /> {movie.language}
                </span>
              )}
            </div>

            <h1 className="movie-details-title">{movie.title}</h1>

            {/* Meta Row */}
            <div className="movie-details-meta">
              <div className="movie-details-meta-item">
                <Calendar size={16} />
                {movie.releaseYear}
              </div>
              {movie.duration > 0 && (
                <div className="movie-details-meta-item">
                  <Clock size={16} />
                  {movie.duration} min
                </div>
              )}
              {avgRating > 0 ? (
                <div className="movie-details-meta-item highlight-rating">
                  <Star size={16} fill="currentColor" />
                  <strong>{avgRating}</strong> / 5 ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                </div>
              ) : (
                <div className="movie-details-meta-item">
                  <MessageSquare size={16} />
                  No reviews yet
                </div>
              )}
            </div>

            {/* Actions: Watchlist and Mark as Watched */}
            <div className="movie-details-actions">
              <button
                type="button"
                className={`btn ${inWatchlist ? "btn-secondary" : "btn-primary"}`}
                onClick={handleWatchlistToggle}
              >
                {inWatchlist ? (
                  <>
                    <Check size={16} /> In Watchlist
                  </>
                ) : (
                  <>
                    <Bookmark size={16} /> Add to Watchlist
                  </>
                )}
              </button>

              <button
                type="button"
                className={`btn ${watched ? "btn-success-outline" : "btn-outline"}`}
                onClick={handleWatchedToggle}
              >
                {watched ? (
                  <>
                    <Check size={16} /> Watched
                  </>
                ) : (
                  <>
                    <Eye size={16} /> Mark as Watched
                  </>
                )}
              </button>
            </div>

            {/* Description */}
            <p className="movie-details-description">{movie.description}</p>

            {/* Cast & Crew Specs */}
            <div className="movie-details-crew">
              {movie.director && (
                <div className="movie-details-crew-item">
                  <div className="movie-details-crew-label">Director</div>
                  <div className="movie-details-crew-value">
                    <User size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
                    {movie.director}
                  </div>
                </div>
              )}
              {castList && (
                <div className="movie-details-crew-item" style={{ gridColumn: "span 2" }}>
                  <div className="movie-details-crew-label">Starring Cast</div>
                  <div className="movie-details-crew-value">
                    <Users size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
                    {castList}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== Similar Movies Recommendations ===== */}
        {similarMovies.length > 0 && (
          <div className="similar-movies-section" style={{ marginTop: "var(--space-3xl)" }}>
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  <Sparkles size={22} style={{ color: "var(--accent-primary)", verticalAlign: "middle", marginRight: 8 }} />
                  Similar <span>Titles You Might Like</span>
                </h2>
                <p className="section-subtitle">
                  Selected because they share genre, director, or cast with {movie.title}
                </p>
              </div>
            </div>
            <div className="movie-grid">
              {similarMovies.map((similar) => (
                <MovieCard
                  key={similar.id}
                  movie={similar}
                  genreName={genreMap.get(String(similar.genreId)) || "Film"}
                  avgRating={calculateAverageRating(reviews, similar.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ===== Ratings & Reviews Section ===== */}
        <div className="reviews-section" style={{ marginTop: "var(--space-3xl)" }}>
          <div className="reviews-header-block">
            <div>
              <h2 className="section-title">
                Audience <span>Reviews & Ratings</span>
              </h2>
              <p className="section-subtitle">
                Read what CineVerse members think or share your own thoughts
              </p>
            </div>
          </div>

          <div className="reviews-layout">
            {/* Left: Overall Score & Distribution */}
            <div className="rating-overview-card">
              <div className="rating-big-number">{avgRating > 0 ? avgRating : "—"}</div>
              <div style={{ margin: "8px 0" }}>
                <RatingStarsDisplay rating={avgRating} size={22} />
              </div>
              <div className="rating-total-text">
                Based on {reviewCount} {reviewCount === 1 ? "verified review" : "verified reviews"}
              </div>

              {/* Rating Bars Breakdown */}
              <div className="rating-breakdown-list">
                {ratingDistribution.map(({ star, count, percentage }) => (
                  <div key={star} className="rating-bar-row">
                    <span className="rating-bar-label">{star}★</span>
                    <div className="rating-bar-track">
                      <div
                        className="rating-bar-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="rating-bar-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Submission Form */}
            <div className="review-form-wrapper">
              <ReviewForm onSubmit={handleSubmitReview} />
            </div>
          </div>

          {/* Existing Reviews List */}
          <div className="reviews-list-container" style={{ marginTop: "var(--space-2xl)" }}>
            <h3 style={{ marginBottom: "var(--space-lg)", fontSize: "var(--font-size-xl)" }}>
              Community Reviews ({reviewCount})
            </h3>
            {movieReviews.length > 0 ? (
              <div className="reviews-feed">
                {movieReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="empty-reviews-box">
                <MessageSquare size={36} style={{ marginBottom: 12, opacity: 0.5 }} />
                <h4>No reviews yet</h4>
                <p>Be the first member of CineVerse to write a review for {movie.title}!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MovieDetails;
