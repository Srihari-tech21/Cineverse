// ==========================================================
// Genres Page - CineVerse
// Browse all genres with movie counts
// Demonstrates: useEffect, useState, Lists & Keys, Props
// ==========================================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tag, ChevronRight } from "lucide-react";
import { getMovies, getGenres } from "../services/api";
import { Loading } from "../components/Loading";
import Footer from "../components/Footer";

const Genres = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch genres and movies from JSON Server
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [moviesData, genresData] = await Promise.all([
          getMovies(),
          getGenres(),
        ]);
        setMovies(moviesData || []);
        setGenres(genresData || []);
      } catch (err) {
        setError(err.message || "Failed to load genres");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="page-content"><Loading message="Loading genres..." /></div>;
  if (error) return <div className="page-content"><div className="loading-container"><p>Error: {error}</p></div></div>;

  return (
    <div className="page-content">
      {/* Page Header */}
      <div className="page-banner">
        <div className="container">
          <h1 className="page-banner-title">Browse by Genre</h1>
          <p className="page-banner-subtitle">
            Explore {genres.length} genres across our movie collection
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "var(--space-xl)", paddingBottom: "var(--space-3xl)" }}>
        <div className="genre-grid">
          {genres.map((genre) => {
            const movieCount = movies.filter((m) => String(m.genreId) === String(genre.id)).length;

            return (
              <Link
                key={genre.id}
                to={`/movies?genre=${genre.id}`}
                className="genre-card"
              >
                <div className="genre-card-icon">
                  <Tag size={24} />
                </div>
                <h3 className="genre-card-name">{genre.name}</h3>
                <p className="genre-card-count">
                  {movieCount} {movieCount === 1 ? "Movie" : "Movies"}
                </p>
                <span className="btn btn-primary btn-sm">
                  Browse Movies <ChevronRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Genres;
