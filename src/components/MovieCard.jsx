// ==========================================================
// CineVerse 2.0 MovieCard Component
// Enhanced with direct Watchlist toggle, Watched status,
// Match Score indicators, and fallback handling.
// ==========================================================

import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Film, Bookmark, Check, Eye } from "lucide-react";
import { useWatchlist } from "../context/WatchlistContext";
import { useToast } from "./Toast";
import { getPosterUrl, FALLBACK_POSTER } from "../utils/imageUtils";

/**
 * @param {Object} props
 * @param {Object} props.movie - Movie data from API
 * @param {string} props.genreName - Resolved genre name
 * @param {number|string} props.avgRating - Calculated average rating
 * @param {number} [props.matchScore] - Optional recommendation match %
 * @param {string} [props.recommendationReason] - Reason for recommendation
 */
const MovieCard = ({ movie, genreName, avgRating, matchScore, recommendationReason }) => {
  const [imgError, setImgError] = useState(false);
  const { isWatchlisted, isWatched, toggleWatchlist, toggleWatched } = useWatchlist();
  const { addToast } = useToast();

  if (!movie) return null;

  const inWatchlist = isWatchlisted(movie.id);
  const watched = isWatched(movie.id);
  const score = matchScore || movie.matchScore;

  const handleWatchlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleWatchedClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await toggleWatched(movie.id);
      addToast(res.message, "success");
    } catch {
      addToast("Failed to update watched status", "error");
    }
  };

  const posterSource = getPosterUrl(movie.poster);

  return (
    <div className="movie-card-wrapper">
      <Link to={`/movies/${movie.id}`} className="movie-card">
        {/* Movie Poster with resilient fallback */}
        <div className="movie-card-poster">
          {!imgError ? (
            <img
              src={posterSource}
              alt={movie.title}
              onError={(e) => {
                if (!e.currentTarget.dataset.hasFailed) {
                  e.currentTarget.dataset.hasFailed = "true";
                  e.currentTarget.src = FALLBACK_POSTER;
                } else {
                  setImgError(true);
                }
              }}
              loading="lazy"
            />
          ) : (
            <div className="poster-fallback">
              <Film size={36} />
              <span>{movie.title}</span>
            </div>
          )}

          {/* Bottom gradient on poster */}
          <div className="movie-card-poster-gradient" />

          {/* Language / Industry Tag (Top Left) */}
          {(movie.language || movie.industry) && (
            <div className={`movie-card-lang-tag ${movie.language === "Telugu" ? "telugu-tag" : ""}`}>
              {movie.language || movie.industry}
            </div>
          )}

          {/* Recommendation Match Badge */}
          {score && (
            <div className="movie-card-match" title="Recommendation Match Score">
              {score}% Match
            </div>
          )}

          {/* Rating badge */}
          {avgRating > 0 && (
            <div className="movie-card-rating">
              <Star size={12} fill="currentColor" />
              <span>{avgRating}</span>
            </div>
          )}

          {/* Quick Action Buttons (Top Right) */}
          <div className="movie-card-actions">
            <button
              type="button"
              className={`card-action-btn ${inWatchlist ? "active" : ""}`}
              onClick={handleWatchlistClick}
              title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              aria-label="Toggle Watchlist"
            >
              <Bookmark size={15} fill={inWatchlist ? "currentColor" : "none"} />
            </button>
            <button
              type="button"
              className={`card-action-btn ${watched ? "watched-active" : ""}`}
              onClick={handleWatchedClick}
              title={watched ? "Marked as Watched" : "Mark as Watched"}
              aria-label="Toggle Watched"
            >
              {watched ? <Check size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Hover overlay with View Details */}
          <div className="movie-card-overlay">
            <span className="btn btn-primary btn-sm">View Details</span>
          </div>
        </div>

        {/* Movie Info */}
        <div className="movie-card-info">
          <h3 className="movie-card-title" title={movie.title}>
            {movie.title}
          </h3>
          <div className="movie-card-meta">
            <span className="movie-year">{movie.releaseYear}</span>
            {genreName && <span className="movie-card-genre">{genreName}</span>}
            {movie.duration && <span className="movie-duration">{movie.duration}m</span>}
          </div>

          {recommendationReason && (
            <p className="card-recommendation-note" title={recommendationReason}>
              {recommendationReason}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
