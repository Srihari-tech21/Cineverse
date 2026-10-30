// ==========================================================
// CineVerse 2.0 - MovieForm Component
// Reusable form for Add/Edit movie operations with
// validation, poster URL, backdrop URL, language, and featured toggle.
// ==========================================================

import { useState, useEffect } from "react";
import { Save, Sparkles } from "lucide-react";

/**
 * @param {Object} props
 * @param {Object} [props.movie] - Existing movie data (for edit mode)
 * @param {Array} props.genres - Array of genres from API
 * @param {Function} props.onSubmit - Handler called with validated movie data
 * @param {boolean} [props.isEditing] - Whether this is an edit form
 */
const MovieForm = ({ movie, genres = [], onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    poster: "",
    backdrop: "",
    genreId: "",
    releaseYear: "",
    director: "",
    cast: "",
    duration: "",
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || "",
        description: movie.description || "",
        poster: movie.poster || "",
        backdrop: movie.backdrop || "",
        genreId: movie.genreId || "",
        releaseYear: movie.releaseYear?.toString() || "",
        director: movie.director || "",
        cast: Array.isArray(movie.cast) ? movie.cast.join(", ") : movie.cast || "",
        duration: movie.duration?.toString() || "",
        language: movie.language || "Telugu",
        industry: movie.industry || "Tollywood",
        featured: Boolean(movie.featured),
      });
    }
  }, [movie]);

  // Generic change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Form validation
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.genreId) newErrors.genreId = "Genre is required";

    const year = parseInt(formData.releaseYear);
    if (!formData.releaseYear) {
      newErrors.releaseYear = "Release year is required";
    } else if (isNaN(year) || year < 1888 || year > new Date().getFullYear() + 5) {
      newErrors.releaseYear =
        "Enter a valid release year (1888 - " + (new Date().getFullYear() + 5) + ")";
    }

    const dur = parseInt(formData.duration);
    if (formData.duration && (isNaN(dur) || dur <= 0)) {
      newErrors.duration = "Duration must be a positive number";
    }

    // Validate URLs if provided
    if (formData.poster && formData.poster.trim()) {
      const val = formData.poster.trim();
      const isTmdbPath = /^\/[a-zA-Z0-9_\-]+\.(jpg|jpeg|png|webp)$/i.test(val);
      if (!isTmdbPath) {
        try {
          new URL(val);
        } catch {
          newErrors.poster = "Enter a valid URL (e.g. https://...) or TMDB path (/poster.jpg)";
        }
      }
    }
    if (formData.backdrop && formData.backdrop.trim()) {
      const val = formData.backdrop.trim();
      const isTmdbPath = /^\/[a-zA-Z0-9_\-]+\.(jpg|jpeg|png|webp)$/i.test(val);
      if (!isTmdbPath) {
        try {
          new URL(val);
        } catch {
          newErrors.backdrop = "Enter a valid URL (e.g. https://...) or TMDB path (/backdrop.jpg)";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    try {
      const movieData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        poster: formData.poster.trim(),
        backdrop: formData.backdrop.trim(),
        genreId: String(formData.genreId),
        releaseYear: parseInt(formData.releaseYear),
        director: formData.director.trim(),
        cast: formData.cast
          .split(",")
          .map((name) => name.trim())
          .filter((name) => name.length > 0),
        duration: parseInt(formData.duration) || 0,
        language: formData.language.trim() || "Telugu",
        industry: formData.industry?.trim() || "Tollywood",
        featured: Boolean(formData.featured),
      };

      await onSubmit(movieData);
    } catch (err) {
      console.error("Failed to save movie:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="movie-form-container">
      <form onSubmit={handleSubmit}>
        <div className="movie-form-grid">
          {/* Movie Title */}
          <div className="form-group">
            <label className="form-label">Movie Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="Enter movie title"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          {/* Genre Select */}
          <div className="form-group">
            <label className="form-label">Genre *</label>
            <select
              name="genreId"
              className="form-select"
              value={formData.genreId}
              onChange={handleChange}
            >
              <option value="">Select a genre</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            {errors.genreId && <span className="form-error">{errors.genreId}</span>}
          </div>

          {/* Release Year */}
          <div className="form-group">
            <label className="form-label">Release Year *</label>
            <input
              type="number"
              name="releaseYear"
              className="form-input"
              placeholder="e.g. 2024"
              value={formData.releaseYear}
              onChange={handleChange}
            />
            {errors.releaseYear && (
              <span className="form-error">{errors.releaseYear}</span>
            )}
          </div>

          {/* Duration */}
          <div className="form-group">
            <label className="form-label">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              className="form-input"
              placeholder="e.g. 148"
              value={formData.duration}
              onChange={handleChange}
            />
            {errors.duration && (
              <span className="form-error">{errors.duration}</span>
            )}
          </div>

          {/* Language */}
          <div className="form-group">
            <label className="form-label">Primary Language</label>
            <select
              name="language"
              className="form-select"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="Telugu">Telugu</option>
              <option value="Tamil">Tamil</option>
              <option value="Hindi">Hindi</option>
              <option value="Malayalam">Malayalam</option>
              <option value="Kannada">Kannada</option>
              <option value="English">English</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Film Industry */}
          <div className="form-group">
            <label className="form-label">Film Industry</label>
            <select
              name="industry"
              className="form-select"
              value={formData.industry}
              onChange={handleChange}
            >
              <option value="Tollywood">Tollywood (Telugu Cinema)</option>
              <option value="Bollywood">Bollywood (Hindi Cinema)</option>
              <option value="Kollywood">Kollywood (Tamil Cinema)</option>
              <option value="Mollywood">Mollywood (Malayalam Cinema)</option>
              <option value="Sandalwood">Sandalwood (Kannada Cinema)</option>
              <option value="Hollywood">Hollywood (International)</option>
            </select>
          </div>

          {/* Director */}
          <div className="form-group">
            <label className="form-label">Director</label>
            <input
              type="text"
              name="director"
              className="form-input"
              placeholder="e.g. Christopher Nolan"
              value={formData.director}
              onChange={handleChange}
            />
          </div>

          {/* Cast */}
          <div className="form-group full-width">
            <label className="form-label">Cast (comma-separated)</label>
            <input
              type="text"
              name="cast"
              className="form-input"
              placeholder="Actor 1, Actor 2, Actor 3"
              value={formData.cast}
              onChange={handleChange}
            />
          </div>

          {/* Poster URL */}
          <div className="form-group">
            <label className="form-label">Poster URL</label>
            <input
              type="text"
              name="poster"
              className="form-input"
              placeholder="https://image.tmdb.org/t/p/w500/..."
              value={formData.poster}
              onChange={handleChange}
            />
            {errors.poster && (
              <span className="form-error">{errors.poster}</span>
            )}
          </div>

          {/* Backdrop URL */}
          <div className="form-group">
            <label className="form-label">Backdrop Banner URL (16:9)</label>
            <input
              type="text"
              name="backdrop"
              className="form-input"
              placeholder="https://image.tmdb.org/t/p/original/..."
              value={formData.backdrop}
              onChange={handleChange}
            />
            {errors.backdrop && (
              <span className="form-error">{errors.backdrop}</span>
            )}
          </div>

          {/* Featured Toggle */}
          <div className="form-group full-width" style={{ marginTop: 8 }}>
            <label className="toggle-label" style={{ cursor: "pointer" }}>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              <span style={{ fontWeight: 600 }}>
                <Sparkles size={14} style={{ verticalAlign: "middle", marginRight: 6, color: "var(--accent-primary)" }} />
                Feature in Spotlight (Hero Section on Homepage)
              </span>
            </label>
          </div>

          {/* Description */}
          <div className="form-group full-width">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              className="form-textarea"
              placeholder="Movie synopsis and overview..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
            {errors.description && (
              <span className="form-error">{errors.description}</span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: "var(--space-lg)" }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            <Save size={16} />
            {submitting
              ? "Saving..."
              : isEditing
              ? "Update Movie"
              : "Add Movie"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MovieForm;
