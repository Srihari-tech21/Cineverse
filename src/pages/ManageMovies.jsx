// ==========================================================
// ManageMovies Page - CineVerse
// Admin table for viewing, editing, deleting movies
// Demonstrates: useState, useEffect, CRUD, ConfirmDialog
// ==========================================================

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Eye, Edit, Trash2, Star, Film } from "lucide-react";
import { getMovies, getGenres, getReviews, deleteMovie, deleteReview } from "../services/api";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import GenreFilter from "../components/GenreFilter";
import { Loading } from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../components/Toast";
import { calculateAverageRating } from "../utils/calculations";
import { getPosterUrl, handleImageError } from "../utils/imageUtils";

const ManageMovies = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    movieId: null,
    movieTitle: "",
  });

  // Fetch data from JSON Server
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
      console.error("Fetch error:", err);
      addToast("Failed to load movies", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get genre name by ID
  const getGenreName = (genreId) => {
    const genre = genres.find((g) => String(g.id) === String(genreId));
    return genre ? genre.name : "Unknown";
  };

  // Handle delete movie with associated reviews cleanup
  const handleDelete = async () => {
    try {
      const { movieId } = deleteDialog;

      // Delete all reviews associated with this movie to prevent orphaned review records
      const movieReviews = reviews.filter((r) => String(r.movieId) === String(movieId));
      for (const review of movieReviews) {
        await deleteReview(review.id);
      }

      // Delete the movie itself
      await deleteMovie(movieId);

      // Refresh data after deletion
      await fetchData();
      addToast("Movie deleted successfully", "success");
    } catch (err) {
      addToast("Failed to delete movie", "error");
    } finally {
      setDeleteDialog({ isOpen: false, movieId: null, movieTitle: "" });
    }
  };

  // Filter movies based on search and genre
  let filteredMovies = [...movies];

  if (search.trim()) {
    const q = search.toLowerCase();
    filteredMovies = filteredMovies.filter((m) =>
      m.title?.toLowerCase().includes(q) ||
      m.director?.toLowerCase().includes(q) ||
      (Array.isArray(m.cast) && m.cast.join(" ").toLowerCase().includes(q))
    );
  }

  if (genreFilter) {
    filteredMovies = filteredMovies.filter(
      (m) => String(m.genreId) === String(genreFilter)
    );
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        {/* Page Header */}
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Manage Movies</h1>
            <p className="admin-page-subtitle">
              {movies.length} movies in the database
            </p>
          </div>
          <Link to="/admin/movies/add" className="btn btn-primary">
            <Plus size={16} /> Add Movie
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="filters-bar">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search movies..."
          />
          <GenreFilter
            genres={genres}
            value={genreFilter}
            onChange={setGenreFilter}
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <Loading message="Loading movies..." />
        ) : filteredMovies.length === 0 ? (
          <EmptyState
            icon={<Film size={36} />}
            title="No movies found"
            message={
              search || genreFilter
                ? "Try adjusting your search or filters."
                : "Add your first movie to get started."
            }
            action={
              !search && !genreFilter ? (
                <Link to="/admin/movies/add" className="btn btn-primary">
                  <Plus size={16} /> Add Movie
                </Link>
              ) : null
            }
          />
        ) : (
          /* Movie Data Table */
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Poster</th>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Industry / Lang</th>
                  <th>Year</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovies.map((movie) => {
                  const avgRating = calculateAverageRating(reviews, movie.id);
                  return (
                    <tr key={movie.id}>
                      <td>
                        <img
                          src={getPosterUrl(movie.poster)}
                          alt={movie.title}
                          className="table-poster"
                          onError={(e) => handleImageError(e)}
                          loading="lazy"
                        />
                      </td>
                      <td style={{ fontWeight: 600 }}>{movie.title}</td>
                      <td>
                        <span className="movie-card-genre">
                          {getGenreName(movie.genreId)}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: "12px", color: movie.language === "Telugu" ? "var(--accent-gold)" : "var(--text-secondary)", fontWeight: 600 }}>
                          {movie.industry || movie.language || "Cinema"}
                        </span>
                      </td>
                      <td>{movie.releaseYear}</td>
                      <td>
                        {avgRating > 0 ? (
                          <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--accent-gold)" }}>
                            <Star size={14} fill="currentColor" />
                            {avgRating}
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>—</span>
                        )}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-ghost btn-icon"
                            onClick={() => navigate(`/movies/${movie.id}`)}
                            title="View Movie"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="btn btn-ghost btn-icon"
                            onClick={() => navigate(`/admin/movies/edit/${movie.id}`)}
                            title="Edit Movie"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="btn btn-ghost btn-icon"
                            onClick={() =>
                              setDeleteDialog({
                                isOpen: true,
                                movieId: movie.id,
                                movieTitle: movie.title,
                              })
                            }
                            title="Delete Movie"
                            style={{ color: "var(--danger)" }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          title="Delete Movie"
          message={`Are you sure you want to delete "${deleteDialog.movieTitle}"? This will also remove all associated reviews. This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() =>
            setDeleteDialog({ isOpen: false, movieId: null, movieTitle: "" })
          }
        />
      </div>
    </div>
  );
};

export default ManageMovies;
