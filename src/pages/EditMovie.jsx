// ==========================================================
// EditMovie Page - CineVerse
// Fetch movie by ID, populate form, submit PUT /movies/:id
// Demonstrates: useParams, useEffect, PUT API, Forms
// ==========================================================

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getMovieById, getGenres, updateMovie } from "../services/api";
import Sidebar from "../components/Sidebar";
import MovieForm from "../components/MovieForm";
import { Loading } from "../components/Loading";
import { useToast } from "../components/Toast";

const EditMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [movie, setMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movie data and genres when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [movieData, genresData] = await Promise.all([
          getMovieById(id),
          getGenres(),
        ]);
        setMovie(movieData);
        setGenres(genresData || []);
      } catch (err) {
        setError("Movie not found");
        addToast("Failed to load movie data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Handle form submission - PUT updated movie to JSON Server
  const handleSubmit = async (movieData) => {
    try {
      await updateMovie(id, { ...movieData, id: String(id) });
      addToast("Movie updated successfully!", "success");
      navigate("/admin/movies");
    } catch (err) {
      addToast("Failed to update movie. Please try again.", "error");
      throw err;
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        {/* Page Header */}
        <div className="admin-page-header">
          <div>
            <button
              className="btn btn-ghost"
              onClick={() => navigate("/admin/movies")}
              style={{ marginBottom: 8 }}
            >
              <ArrowLeft size={16} /> Back to Movies
            </button>
            <h1 className="admin-page-title">
              Edit Movie{movie ? `: ${movie.title}` : ""}
            </h1>
            <p className="admin-page-subtitle">
              Update the movie details below
            </p>
          </div>
        </div>

        {/* Conditional rendering: loading, error, or form */}
        {loading ? (
          <Loading message="Loading movie data..." />
        ) : error ? (
          <div className="loading-container">
            <p>{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/admin/movies")}
              style={{ marginTop: 16 }}
            >
              Back to Movies
            </button>
          </div>
        ) : (
          <MovieForm
            movie={movie}
            genres={genres}
            onSubmit={handleSubmit}
            isEditing={true}
          />
        )}
      </div>
    </div>
  );
};

export default EditMovie;
