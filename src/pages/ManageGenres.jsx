// ==========================================================
// ManageGenres Page - CineVerse
// Full CRUD for genres with validation
// Demonstrates: useState, useEffect, POST/PUT/DELETE, Forms
// ==========================================================

import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, X, Save, Tag } from "lucide-react";
import { getGenres, getMovies, addGenre, updateGenre, deleteGenre } from "../services/api";
import Sidebar from "../components/Sidebar";
import { Loading } from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../components/Toast";

const ManageGenres = () => {
  const { addToast } = useToast();
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state for add/edit
  const [showForm, setShowForm] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [genreName, setGenreName] = useState("");
  const [formError, setFormError] = useState("");

  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    genreId: null,
    genreName: "",
  });

  // Fetch genres and movies
  const fetchData = async () => {
    try {
      setLoading(true);
      const [genresData, moviesData] = await Promise.all([
        getGenres(),
        getMovies(),
      ]);
      setGenres(genresData || []);
      setMovies(moviesData || []);
    } catch (err) {
      addToast("Failed to load genres", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Validate genre name
  const validateGenre = () => {
    if (!genreName.trim()) {
      setFormError("Genre name is required");
      return false;
    }

    // Check for duplicate genre names (case-insensitive)
    const duplicate = genres.find(
      (g) =>
        g.name.toLowerCase() === genreName.trim().toLowerCase() &&
        String(g.id) !== String(editingGenre?.id)
    );
    if (duplicate) {
      setFormError("A genre with this name already exists");
      return false;
    }

    setFormError("");
    return true;
  };

  // Handle add/edit genre submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateGenre()) return;

    try {
      if (editingGenre) {
        // PUT /genres/:id - Update existing genre
        await updateGenre(editingGenre.id, {
          ...editingGenre,
          name: genreName.trim(),
        });
        addToast("Genre updated successfully", "success");
      } else {
        // POST /genres - Create new genre
        await addGenre({ name: genreName.trim() });
        addToast("Genre added successfully", "success");
      }

      // Reset form and refresh data
      setShowForm(false);
      setEditingGenre(null);
      setGenreName("");
      await fetchData();
    } catch (err) {
      addToast("Failed to save genre", "error");
    }
  };

  // Start editing a genre
  const startEdit = (genre) => {
    setEditingGenre(genre);
    setGenreName(genre.name);
    setShowForm(true);
    setFormError("");
  };

  // Cancel form
  const cancelForm = () => {
    setShowForm(false);
    setEditingGenre(null);
    setGenreName("");
    setFormError("");
  };

  // Handle genre deletion
  const handleDelete = async () => {
    try {
      const { genreId } = deleteDialog;

      // Check if any movies use this genre
      const moviesInGenre = movies.filter((m) => String(m.genreId) === String(genreId));
      if (moviesInGenre.length > 0) {
        addToast(
          `Cannot delete this genre. ${moviesInGenre.length} movie(s) are using it. Reassign or remove those movies first.`,
          "error"
        );
        setDeleteDialog({ isOpen: false, genreId: null, genreName: "" });
        return;
      }

      // DELETE /genres/:id
      await deleteGenre(genreId);
      addToast("Genre deleted successfully", "success");
      await fetchData();
    } catch (err) {
      addToast("Failed to delete genre", "error");
    } finally {
      setDeleteDialog({ isOpen: false, genreId: null, genreName: "" });
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        {/* Page Header */}
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Manage Genres</h1>
            <p className="admin-page-subtitle">
              {genres.length} genres in the database
            </p>
          </div>
          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowForm(true);
                setEditingGenre(null);
                setGenreName("");
                setFormError("");
              }}
            >
              <Plus size={16} /> Add Genre
            </button>
          )}
        </div>

        {/* Add/Edit Genre Form */}
        {showForm && (
          <div
            className="review-form-card"
            style={{ marginBottom: "var(--space-xl)" }}
          >
            <h3 className="review-form-title">
              {editingGenre ? "Edit Genre" : "Add New Genre"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Genre Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter genre name"
                  value={genreName}
                  onChange={(e) => {
                    setGenreName(e.target.value);
                    setFormError("");
                  }}
                  autoFocus
                />
                {formError && (
                  <span className="form-error">{formError}</span>
                )}
              </div>
              <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  {editingGenre ? "Update" : "Add Genre"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelForm}
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Genre List */}
        {loading ? (
          <Loading message="Loading genres..." />
        ) : genres.length === 0 ? (
          <EmptyState
            title="No genres yet"
            message="Create your first genre to organize your movies."
          />
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Genre Name</th>
                  <th>Movies</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {genres.map((genre) => {
                  const movieCount = movies.filter(
                    (m) => String(m.genreId) === String(genre.id)
                  ).length;
                  return (
                    <tr key={genre.id}>
                      <td>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontWeight: 600,
                          }}
                        >
                          <Tag size={16} color="var(--accent-primary)" />
                          {genre.name}
                        </span>
                      </td>
                      <td>
                        {movieCount} {movieCount === 1 ? "movie" : "movies"}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-ghost btn-icon"
                            onClick={() => startEdit(genre)}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="btn btn-ghost btn-icon"
                            onClick={() =>
                              setDeleteDialog({
                                isOpen: true,
                                genreId: genre.id,
                                genreName: genre.name,
                              })
                            }
                            title="Delete"
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
          title="Delete Genre"
          message={`Are you sure you want to delete the genre "${deleteDialog.genreName}"? Genres with associated movies cannot be deleted.`}
          onConfirm={handleDelete}
          onCancel={() =>
            setDeleteDialog({ isOpen: false, genreId: null, genreName: "" })
          }
        />
      </div>
    </div>
  );
};

export default ManageGenres;
