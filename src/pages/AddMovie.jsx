// ==========================================================
// AddMovie Page - CineVerse
// Form to create a new movie via POST /movies
// Demonstrates: Forms, Validation, POST API, useNavigate
// ==========================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getGenres, addMovie } from "../services/api";
import Sidebar from "../components/Sidebar";
import MovieForm from "../components/MovieForm";
import { Loading } from "../components/Loading";
import { useToast } from "../components/Toast";

const AddMovie = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch genres for the genre dropdown
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres();
        setGenres(data || []);
      } catch (err) {
        addToast("Failed to load genres", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  // Handle form submission - POST new movie to JSON Server
  const handleSubmit = async (movieData) => {
    try {
      await addMovie(movieData);
      addToast("Movie added successfully!", "success");
      navigate("/admin/movies");
    } catch (err) {
      addToast("Failed to add movie. Please try again.", "error");
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
            <h1 className="admin-page-title">Add New Movie</h1>
            <p className="admin-page-subtitle">
              Fill in the details to add a new movie to the database
            </p>
          </div>
        </div>

        {loading ? (
          <Loading message="Loading form..." />
        ) : (
          <MovieForm
            genres={genres}
            onSubmit={handleSubmit}
            isEditing={false}
          />
        )}
      </div>
    </div>
  );
};

export default AddMovie;
