// ==========================================================
// useMovies Custom Hook - CineVerse
// Centralizes movie, genre, and review data fetching
// Demonstrates: useState, useEffect, custom hooks
// ==========================================================

import { useState, useEffect } from "react";
import { getMovies, getGenres, getReviews } from "../services/api";

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data from JSON Server on mount
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch movies, genres, and reviews in parallel using Promise.all
      const [moviesData, genresData, reviewsData] = await Promise.all([
        getMovies(),
        getGenres(),
        getReviews(),
      ]);

      setMovies(moviesData || []);
      setGenres(genresData || []);
      setReviews(reviewsData || []);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect: Fetch data when the hook is first used
  useEffect(() => {
    fetchData();
  }, []);

  // Expose a refetch function so components can refresh data after CRUD operations
  return { movies, genres, reviews, loading, error, refetch: fetchData };
};

export default useMovies;
