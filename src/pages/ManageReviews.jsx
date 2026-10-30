// ==========================================================
// ManageReviews Page - CineVerse
// Admin table for viewing and deleting reviews
// Demonstrates: useState, useEffect, DELETE API, Filters
// ==========================================================

import { useState, useEffect } from "react";
import { Trash2, Star, MessageSquare } from "lucide-react";
import { getMovies, getReviews, deleteReview } from "../services/api";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import { Loading } from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../components/Toast";
import { formatDate } from "../utils/calculations";

const ManageReviews = () => {
  const { addToast } = useToast();
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [movieFilter, setMovieFilter] = useState("");

  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    reviewId: null,
  });

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [moviesData, reviewsData] = await Promise.all([
        getMovies(),
        getReviews(),
      ]);
      setMovies(moviesData || []);
      setReviews(reviewsData || []);
    } catch (err) {
      addToast("Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get movie title by ID
  const getMovieTitle = (movieId) => {
    const movie = movies.find((m) => String(m.id) === String(movieId));
    return movie ? movie.title : "Unknown Movie";
  };

  // Handle review deletion
  const handleDelete = async () => {
    try {
      await deleteReview(deleteDialog.reviewId);
      addToast("Review deleted successfully", "success");
      await fetchData();
    } catch (err) {
      addToast("Failed to delete review", "error");
    } finally {
      setDeleteDialog({ isOpen: false, reviewId: null });
    }
  };

  // Apply filters using filter()
  let filteredReviews = [...reviews];

  // Search by reviewer name or comment text
  if (search.trim()) {
    const searchLower = search.toLowerCase();
    filteredReviews = filteredReviews.filter(
      (r) =>
        r.reviewerName?.toLowerCase().includes(searchLower) ||
        r.comment?.toLowerCase().includes(searchLower)
    );
  }

  // Filter by rating
  if (ratingFilter) {
    filteredReviews = filteredReviews.filter(
      (r) => Math.round(Number(r.rating)) === parseInt(ratingFilter)
    );
  }

  // Filter by movie
  if (movieFilter) {
    filteredReviews = filteredReviews.filter(
      (r) => String(r.movieId) === String(movieFilter)
    );
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        {/* Page Header */}
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Manage Reviews</h1>
            <p className="admin-page-subtitle">
              {reviews.length} reviews in the database
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by reviewer name or comment..."
          />
          <select
            className="filter-select"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            aria-label="Filter by rating"
          >
            <option value="">All Ratings</option>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Star{r > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <select
            className="filter-select"
            value={movieFilter}
            onChange={(e) => setMovieFilter(e.target.value)}
            aria-label="Filter by movie"
          >
            <option value="">All Movies</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <Loading message="Loading reviews..." />
        ) : filteredReviews.length === 0 ? (
          <EmptyState
            icon={<MessageSquare size={32} />}
            title="No reviews found"
            message={
              search || ratingFilter || movieFilter
                ? "Try adjusting your filters."
                : "No reviews have been submitted yet."
            }
          />
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Reviewer</th>
                  <th>Movie</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review) => (
                  <tr key={review.id}>
                    <td style={{ fontWeight: 600 }}>{review.reviewerName}</td>
                    <td>
                      <span style={{ color: "var(--accent-secondary)" }}>
                        {getMovieTitle(review.movieId)}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          color: "var(--accent-gold)",
                        }}
                      >
                        <Star size={14} fill="currentColor" />
                        {review.rating}
                      </span>
                    </td>
                    <td
                      style={{
                        maxWidth: 300,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {review.comment}
                    </td>
                    <td style={{ whiteSpace: "nowrap", color: "var(--text-muted)" }}>
                      {review.date ? formatDate(review.date) : "—"}
                    </td>
                    <td>
                      <button
                        className="btn btn-ghost btn-icon"
                        onClick={() =>
                          setDeleteDialog({
                            isOpen: true,
                            reviewId: review.id,
                          })
                        }
                        title="Delete Review"
                        style={{ color: "var(--danger)" }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          title="Delete Review"
          message="Are you sure you want to delete this review? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() =>
            setDeleteDialog({ isOpen: false, reviewId: null })
          }
        />
      </div>
    </div>
  );
};

export default ManageReviews;
