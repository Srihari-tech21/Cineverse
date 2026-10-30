// ==========================================================
// CineVerse 2.0 - Advanced Movie Discovery Page
// Features: Search by title/director/actor, filters for language,
// Indian film industry (Tollywood, Bollywood, Kollywood, etc.),
// genre, release year, minimum rating, multi-sorting,
// active filter pills, and real-time result counters.
// ==========================================================

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { X, Film, Compass, SlidersHorizontal, RotateCcw, Sparkles } from "lucide-react";
import { getMovies, getGenres, getReviews } from "../services/api";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import GenreFilter from "../components/GenreFilter";
import YearFilter from "../components/YearFilter";
import { MovieCardSkeleton } from "../components/Loading";
import EmptyState from "../components/EmptyState";
import Footer from "../components/Footer";
import { calculateAverageRating } from "../utils/calculations";

const QUICK_LANGUAGES = [
  "All",
  "Telugu",
  "Tamil",
  "Hindi",
  "Malayalam",
  "Kannada",
  "English",
];

const INDUSTRIES = [
  { value: "", label: "All Industries" },
  { value: "Tollywood", label: "Tollywood (Telugu)" },
  { value: "Bollywood", label: "Bollywood (Hindi)" },
  { value: "Kollywood", label: "Kollywood (Tamil)" },
  { value: "Mollywood", label: "Mollywood (Malayalam)" },
  { value: "Sandalwood", label: "Sandalwood (Kannada)" },
  { value: "Hollywood", label: "Hollywood (English/Intl)" },
];

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filters State
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sortBy, setSortBy] = useState("rating-high");

  const [searchParams, setSearchParams] = useSearchParams();

  // Fetch initial catalogue data
  useEffect(() => {
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
        setError(err.message || "Failed to load movies");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sync URL parameters
  useEffect(() => {
    const genreParam = searchParams.get("genre");
    const sortParam = searchParams.get("sort");
    const qParam = searchParams.get("q");
    const langParam = searchParams.get("lang");
    const indParam = searchParams.get("industry");

    if (genreParam) setSelectedGenre(genreParam);
    if (sortParam) setSortBy(sortParam);
    if (qParam) setSearch(qParam);
    if (langParam) setSelectedLanguage(langParam);
    if (indParam) setSelectedIndustry(indParam);
  }, [searchParams]);

  // Unique languages extracted from movies
  const availableLanguages = useMemo(() => {
    const langs = new Set();
    movies.forEach((m) => {
      if (m.language) langs.add(m.language);
    });
    return Array.from(langs).sort();
  }, [movies]);

  // Genre map helper
  const genreMap = useMemo(() => {
    return new Map(genres.map((g) => [String(g.id), g.name]));
  }, [genres]);

  const getGenreName = (genreId) => genreMap.get(String(genreId)) || "Cinema";

  // Quick Language Toggle
  const handleQuickLanguage = (lang) => {
    if (lang === "All") {
      setSelectedLanguage("");
      const params = new URLSearchParams(searchParams);
      params.delete("lang");
      setSearchParams(params);
    } else {
      setSelectedLanguage(lang);
      const params = new URLSearchParams(searchParams);
      params.set("lang", lang);
      setSearchParams(params);
    }
  };

  // Toggle prominent Telugu filter
  const toggleTeluguShortcut = () => {
    if (selectedLanguage === "Telugu") {
      handleQuickLanguage("All");
    } else {
      handleQuickLanguage("Telugu");
    }
  };

  // ===== FILTERING & SORTING PIPELINE =====
  const filteredMovies = useMemo(() => {
    let result = movies.map((movie) => ({
      ...movie,
      avgRating: calculateAverageRating(reviews, movie.id),
    }));

    // 1. Text Search (Title, Director, Cast, Industry)
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.title?.toLowerCase().includes(q) ||
          m.director?.toLowerCase().includes(q) ||
          m.industry?.toLowerCase().includes(q) ||
          (Array.isArray(m.cast) && m.cast.join(" ").toLowerCase().includes(q))
      );
    }

    // 2. Genre Filter
    if (selectedGenre) {
      result = result.filter(
        (m) => String(m.genreId) === String(selectedGenre)
      );
    }

    // 3. Release Year Filter
    if (selectedYear) {
      result = result.filter(
        (m) => String(m.releaseYear) === String(selectedYear)
      );
    }

    // 4. Language Filter
    if (selectedLanguage) {
      result = result.filter(
        (m) => m.language?.toLowerCase() === selectedLanguage.toLowerCase()
      );
    }

    // 5. Industry Filter
    if (selectedIndustry) {
      result = result.filter(
        (m) => m.industry?.toLowerCase() === selectedIndustry.toLowerCase()
      );
    }

    // 6. Minimum Rating Filter
    if (minRating) {
      const threshold = parseFloat(minRating);
      result = result.filter((m) => (m.avgRating ? parseFloat(m.avgRating) >= threshold : false));
    }

    // 7. Sorting
    result.sort((a, b) => {
      if (sortBy === "rating-high") {
        return (parseFloat(b.avgRating) || 0) - (parseFloat(a.avgRating) || 0);
      }
      if (sortBy === "rating-low") {
        return (parseFloat(a.avgRating) || 0) - (parseFloat(b.avgRating) || 0);
      }
      if (sortBy === "newest") {
        return (b.releaseYear || 0) - (a.releaseYear || 0);
      }
      if (sortBy === "oldest") {
        return (a.releaseYear || 0) - (b.releaseYear || 0);
      }
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
      }
      if (sortBy === "duration-desc") {
        return (b.duration || 0) - (a.duration || 0);
      }
      if (sortBy === "popular") {
        const aReviews = reviews.filter((r) => String(r.movieId) === String(a.id)).length;
        const bReviews = reviews.filter((r) => String(r.movieId) === String(b.id)).length;
        return bReviews - aReviews;
      }
      return 0;
    });

    return result;
  }, [
    movies,
    reviews,
    search,
    selectedGenre,
    selectedYear,
    selectedLanguage,
    selectedIndustry,
    minRating,
    sortBy,
  ]);

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    search.trim() ||
      selectedGenre ||
      selectedYear ||
      selectedLanguage ||
      selectedIndustry ||
      minRating
  );

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setSelectedGenre("");
    setSelectedYear("");
    setSelectedLanguage("");
    setSelectedIndustry("");
    setMinRating("");
    setSortBy("rating-high");
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="container" style={{ paddingTop: "var(--space-2xl)" }}>
          <div className="movie-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content container" style={{ padding: "60px 20px", textAlign: "center" }}>
        <h2>Failed to load catalogue</h2>
        <p style={{ color: "var(--text-secondary)", margin: "16px 0" }}>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  const teluguCount = movies.filter((m) => m.language === "Telugu").length;

  return (
    <div className="page-content">
      {/* Page Header Banner */}
      <div className="page-banner">
        <div className="container">
          <div className="banner-badge">
            <Compass size={14} /> CineVerse Discovery Hub
          </div>
          <h1 className="page-banner-title">Explore Cinema</h1>
          <p className="page-banner-subtitle">
            Search across {movies.length} titles including {teluguCount} Telugu films, Pan-Indian masterworks, and international cinema with live multi-criteria filtering
          </p>
        </div>
      </div>

      <div
        className="container"
        style={{ paddingTop: "var(--space-xl)", paddingBottom: "var(--space-3xl)" }}
      >
        {/* ===== Multi-Criteria Filters Bar ===== */}
        <div className="discovery-filters-panel">
          {/* Top Row: Search + Telugu Shortcut + Sort */}
          <div className="filters-row-top">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by title, director, actor, or industry..."
            />

            {/* Prominent Telugu Shortcut Button */}
            <button
              type="button"
              className={`telugu-shortcut-btn ${selectedLanguage === "Telugu" ? "active" : ""}`}
              onClick={toggleTeluguShortcut}
              title="Filter directly for Telugu Cinema (Tollywood)"
            >
              <Sparkles size={16} />
              {selectedLanguage === "Telugu" ? "Telugu Cinema (Active)" : `Telugu Cinema (${teluguCount})`}
            </button>

            <select
              className="filter-select sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort movies"
            >
              <option value="rating-high">Rating: High to Low</option>
              <option value="rating-low">Rating: Low to High</option>
              <option value="popular">Most Reviewed</option>
              <option value="newest">Release: Newest First</option>
              <option value="oldest">Release: Oldest First</option>
              <option value="title-asc">Title: A - Z</option>
              <option value="title-desc">Title: Z - A</option>
              <option value="duration-desc">Runtime: Longest First</option>
            </select>
          </div>

          {/* Quick Language Tabs Bar */}
          <div className="language-tabs-row">
            {QUICK_LANGUAGES.map((lang) => {
              const isSelected =
                (lang === "All" && !selectedLanguage) ||
                selectedLanguage.toLowerCase() === lang.toLowerCase();
              return (
                <button
                  key={lang}
                  type="button"
                  className={`language-tab-btn ${lang === "Telugu" ? "telugu-tab" : ""} ${isSelected ? "active" : ""}`}
                  onClick={() => handleQuickLanguage(lang)}
                >
                  {lang === "All" ? "All Languages" : lang}
                </button>
              );
            })}
          </div>

          {/* Secondary Filters: Industry, Genre, Year, Min Rating */}
          <div className="filters-row-secondary">
            {/* Industry Filter Dropdown */}
            <select
              className="filter-select"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              aria-label="Filter by industry"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind.value} value={ind.value}>
                  {ind.label}
                </option>
              ))}
            </select>

            {/* Genre Filter */}
            <GenreFilter
              genres={genres}
              value={selectedGenre}
              onChange={(val) => {
                setSelectedGenre(val);
                const params = new URLSearchParams(searchParams);
                if (val) params.set("genre", val);
                else params.delete("genre");
                setSearchParams(params);
              }}
            />

            {/* Year Filter */}
            <YearFilter
              movies={movies}
              value={selectedYear}
              onChange={setSelectedYear}
            />

            {/* Minimum Rating Filter */}
            <select
              className="filter-select"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              aria-label="Filter by minimum rating"
            >
              <option value="">All Ratings</option>
              <option value="4.5">★ 4.5+ Stars</option>
              <option value="4.0">★ 4.0+ Stars</option>
              <option value="3.5">★ 3.5+ Stars</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn-ghost btn-sm clear-filters-btn"
                onClick={clearFilters}
              >
                <RotateCcw size={14} /> Clear Filters
              </button>
            )}
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="active-filters-chips">
              <span className="chips-label">
                <SlidersHorizontal size={13} /> Active Filters:
              </span>
              {search && (
                <span className="filter-chip">
                  Search: "{search}"
                  <button onClick={() => setSearch("")}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedLanguage && (
                <span className="filter-chip">
                  Language: {selectedLanguage}
                  <button onClick={() => handleQuickLanguage("All")}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedIndustry && (
                <span className="filter-chip">
                  Industry: {selectedIndustry}
                  <button onClick={() => setSelectedIndustry("")}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedGenre && (
                <span className="filter-chip">
                  Genre: {getGenreName(selectedGenre)}
                  <button onClick={() => { setSelectedGenre(""); }}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedYear && (
                <span className="filter-chip">
                  Year: {selectedYear}
                  <button onClick={() => setSelectedYear("")}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {minRating && (
                <span className="filter-chip">
                  Rating ≥ {minRating}★
                  <button onClick={() => setMinRating("")}>
                    <X size={12} />
                  </button>
                </span>
              )}
              <button
                type="button"
                className="chip-clear-all"
                onClick={clearFilters}
              >
                Reset All
              </button>
            </div>
          )}
        </div>

        {/* Results Count Bar */}
        <div className="discovery-status-bar">
          <p className="discovery-count">
            Showing <strong>{filteredMovies.length}</strong> of {movies.length} movies
            {selectedLanguage && ` in ${selectedLanguage}`}
            {selectedIndustry && ` • ${selectedIndustry}`}
            {selectedGenre && ` • ${getGenreName(selectedGenre)}`}
          </p>
        </div>

        {/* Movie Results Grid or Empty State */}
        {filteredMovies.length > 0 ? (
          <div className="movie-grid">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                genreName={getGenreName(movie.genreId)}
                avgRating={movie.avgRating}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Film size={44} />}
            title="No movies found"
            message={
              hasActiveFilters
                ? "No titles match your current filter combination. Try clearing some filters or searching with different terms."
                : "No movies are currently available in the catalogue."
            }
            action={
              hasActiveFilters && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={clearFilters}
                  style={{ marginTop: 16 }}
                >
                  <RotateCcw size={16} /> Reset All Filters
                </button>
              )
            }
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Movies;
