// ==========================================================
// CineVerse 2.0 - Premium Discovery Home Page
// Rich Dark Mode & Editorial Brown Aesthetic with Glassmorphism
// Prominently showcasing Telugu Cinema, Indian Cinema,
// Hollywood Favorites, Personal Watchlist, and Recommendations.
// ==========================================================

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Calendar,
  Clock,
  Tag,
  ChevronRight,
  TrendingUp,
  Award,
  Sparkles,
  Bookmark,
  Check,
  Compass,
  Film,
  Gem,
  Globe,
  Flame,
} from "lucide-react";
import { getMovies, getGenres, getReviews } from "../services/api";
import MovieCard from "../components/MovieCard";
import { Loading } from "../components/Loading";
import Footer from "../components/Footer";
import { calculateAverageRating } from "../utils/calculations";
import { getPersonalizedRecommendations } from "../utils/recommendations";
import { useWatchlist } from "../context/WatchlistContext";
import { useToast } from "../components/Toast";
import { getBackdropUrl } from "../utils/imageUtils";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { watchlist, isWatchlisted, toggleWatchlist, preferences } = useWatchlist();
  const { addToast } = useToast();

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
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper to map genre name
  const genreMap = useMemo(() => {
    return new Map(genres.map((g) => [String(g.id), g.name]));
  }, [genres]);

  const getGenreName = (genreId) => genreMap.get(String(genreId)) || "Cinema";

  // Featured Movie: pick a prominent blockbuster (e.g. Kalki 2898 AD, RRR, or Baahubali)
  const featured = useMemo(() => {
    if (movies.length === 0) return null;
    return (
      movies.find((m) => m.title === "Kalki 2898 AD" || m.title === "RRR") ||
      movies.find((m) => m.featured && m.backdrop) ||
      movies[0]
    );
  }, [movies]);

  const featuredRating = featured
    ? calculateAverageRating(reviews, featured.id)
    : 0;

  const isFeaturedWatchlisted = featured ? isWatchlisted(featured.id) : false;

  const handleHeroWatchlistToggle = async () => {
    if (!featured) return;
    try {
      const res = await toggleWatchlist(featured);
      addToast(
        res.added
          ? `Added "${featured.title}" to your Watchlist`
          : `Removed "${featured.title}" from Watchlist`,
        "success"
      );
    } catch {
      addToast("Failed to update watchlist", "error");
    }
  };

  // 1. TELUGU BLOCKBUSTERS (Priority showcase)
  const teluguBlockbusters = useMemo(() => {
    return movies
      .filter((m) => m.language === "Telugu" && m.releaseYear >= 2009 && m.genreId !== "11")
      .slice(0, 10);
  }, [movies]);

  // 2. TIMELESS TELUGU CLASSICS
  const teluguClassics = useMemo(() => {
    return movies
      .filter((m) => m.language === "Telugu" && (m.genreId === "11" || m.releaseYear <= 2007))
      .slice(0, 8);
  }, [movies]);

  // 3. MADE IN INDIA (Pan-Indian cinema from Tamil, Hindi, Malayalam, Kannada)
  const indianCinema = useMemo(() => {
    const indianLangs = new Set(["Tamil", "Hindi", "Malayalam", "Kannada"]);
    return movies.filter((m) => indianLangs.has(m.language)).slice(0, 10);
  }, [movies]);

  // 4. TRENDING (Most reviewed across industries)
  const trending = useMemo(() => {
    return [...movies]
      .map((movie) => ({
        ...movie,
        reviewCount: reviews.filter((r) => String(r.movieId) === String(movie.id)).length,
      }))
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 10);
  }, [movies, reviews]);

  // 5. CRITICALLY ACCLAIMED (Highest rated)
  const topRated = useMemo(() => {
    return [...movies]
      .map((movie) => ({
        ...movie,
        avgRating: calculateAverageRating(reviews, movie.id),
      }))
      .filter((m) => m.avgRating >= 4)
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 8);
  }, [movies, reviews]);

  // 6. HIDDEN GEMS (Underrated treasures & indie triumphs)
  const hiddenGems = useMemo(() => {
    const gemTitles = new Set([
      "Agent Sai Srinivasa Athreya",
      "Mathu Vadalara",
      "Kumbalangi Nights",
      "Jersey",
      "Hi Nanna",
      "12th Fail",
      "777 Charlie",
      "Manjummel Boys"
    ]);
    return movies.filter((m) => gemTitles.has(m.title));
  }, [movies]);

  // 7. HOLLYWOOD & INTERNATIONAL FAVORITES
  const hollywoodFavorites = useMemo(() => {
    return movies.filter((m) => m.language === "English").slice(0, 8);
  }, [movies]);

  // 8. WATCHLIST PREVIEW
  const watchlistMovies = useMemo(() => {
    if (movies.length === 0 || watchlist.length === 0) return [];
    const idSet = new Set(watchlist.map((w) => String(w.movieId)));
    return movies.filter((m) => idSet.has(String(m.id))).slice(0, 8);
  }, [movies, watchlist]);

  // 9. RECOMMENDATIONS
  const recommendedMovies = useMemo(() => {
    if (movies.length === 0) return [];
    return getPersonalizedRecommendations(
      movies,
      genres,
      reviews,
      watchlist,
      preferences,
      { limit: 8 }
    );
  }, [movies, genres, reviews, watchlist, preferences]);

  if (loading) return <Loading message="Loading CineVerse Cinema Discovery..." />;
  if (error) {
    return (
      <div className="page-content container" style={{ textAlign: "center", padding: "60px 20px" }}>
        <h2>Unable to load CineVerse</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  const heroBackdrop = getBackdropUrl(featured?.backdrop || featured?.poster);

  return (
    <div className="page-content" style={{ paddingTop: 0 }}>
      {/* ===== 1. Featured Tonight (Cinematic Hero with Glass Panel) ===== */}
      {featured && (
        <section className="hero">
          <div
            className="hero-backdrop"
            style={{
              backgroundImage: heroBackdrop ? `url(${heroBackdrop})` : "none",
              backgroundColor: !heroBackdrop ? "var(--bg-secondary)" : undefined,
            }}
          />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-badge-row">
              <span className="hero-badge">
                <Sparkles size={13} /> Featured Tonight
              </span>
              {featured.language && (
                <span className="hero-pill">{featured.industry || featured.language}</span>
              )}
            </div>

            <h1 className="hero-title">{featured.title}</h1>
            <p className="hero-description">{featured.description}</p>

            <div className="hero-meta">
              <div className="hero-meta-item">
                <Calendar size={15} />
                {featured.releaseYear}
              </div>
              <div className="hero-meta-item">
                <Tag size={15} />
                {getGenreName(featured.genreId)}
              </div>
              {featured.duration && (
                <div className="hero-meta-item">
                  <Clock size={15} />
                  {featured.duration} min
                </div>
              )}
              {featuredRating > 0 && (
                <div className="hero-rating">
                  <Star size={15} fill="currentColor" />
                  {featuredRating} / 5
                </div>
              )}
            </div>

            <div className="hero-actions">
              <Link to={`/movies/${featured.id}`} className="btn btn-primary">
                View Details
              </Link>

              <button
                type="button"
                className={`btn ${isFeaturedWatchlisted ? "btn-secondary" : "btn-outline"}`}
                onClick={handleHeroWatchlistToggle}
              >
                {isFeaturedWatchlisted ? (
                  <>
                    <Check size={16} /> In Watchlist
                  </>
                ) : (
                  <>
                    <Bookmark size={16} /> Add to Watchlist
                  </>
                )}
              </button>

              <Link to="/discover?lang=Telugu" className="btn btn-ghost">
                <Film size={16} /> Explore Telugu Cinema
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== 2. Telugu Blockbusters (Prominent Showcase) ===== */}
      {teluguBlockbusters.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  <Flame
                    size={24}
                    style={{
                      verticalAlign: "middle",
                      marginRight: 8,
                      color: "var(--accent-gold)",
                    }}
                  />
                  Telugu <span>Blockbusters</span>
                </h2>
                <p className="section-subtitle">
                  High-octane spectacles, record-breaking pan-Indian epics, and modern Tollywood masterworks
                </p>
              </div>
              <Link to="/discover?lang=Telugu" className="section-link">
                View All Telugu ({movies.filter((m) => m.language === "Telugu").length}) <ChevronRight size={16} />
              </Link>
            </div>
            <div className="movie-scroll">
              {teluguBlockbusters.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  genreName={getGenreName(movie.genreId)}
                  avgRating={calculateAverageRating(reviews, movie.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== 3. Trending Now across Industries ===== */}
      {trending.length > 0 && (
        <section className="section" style={{ background: "var(--bg-secondary)" }}>
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  <TrendingUp
                    size={24}
                    style={{
                      verticalAlign: "middle",
                      marginRight: 8,
                      color: "var(--accent-bronze)",
                    }}
                  />
                  Trending <span>Now</span>
                </h2>
                <p className="section-subtitle">
                  Most talked about, watched, and reviewed films across all film industries
                </p>
              </div>
              <Link to="/discover?sort=popular" className="section-link">
                Explore All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="movie-scroll">
              {trending.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  genreName={getGenreName(movie.genreId)}
                  avgRating={calculateAverageRating(reviews, movie.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== 4. Timeless Telugu Classics ===== */}
      {teluguClassics.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  <Film
                    size={24}
                    style={{
                      verticalAlign: "middle",
                      marginRight: 8,
                      color: "var(--accent-gold)",
                    }}
                  />
                  Timeless <span>Telugu Classics</span>
                </h2>
                <p className="section-subtitle">
                  Golden age legends and beloved Telugu cinema milestones that shaped generations
                </p>
              </div>
              <Link to="/discover?lang=Telugu" className="section-link">
                Browse Classics <ChevronRight size={16} />
              </Link>
            </div>
            <div className="movie-scroll">
              {teluguClassics.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  genreName={getGenreName(movie.genreId)}
                  avgRating={calculateAverageRating(reviews, movie.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== 5. Made in India (Pan-Indian Highlights) ===== */}
      {indianCinema.length > 0 && (
        <section className="section" style={{ background: "var(--bg-secondary)" }}>
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  <Sparkles
                    size={24}
                    style={{
                      verticalAlign: "middle",
                      marginRight: 8,
                      color: "var(--accent-gold)",
                    }}
                  />
                  Made in <span>India</span>
                </h2>
                <p className="section-subtitle">
                  Exceptional storytelling from Tamil, Hindi, Malayalam, and Kannada cinema
                </p>
              </div>
              <Link to="/discover" className="section-link">
                Explore Indian Cinema <ChevronRight size={16} />
              </Link>
            </div>
            <div className="movie-scroll">
              {indianCinema.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  genreName={getGenreName(movie.genreId)}
                  avgRating={calculateAverageRating(reviews, movie.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== 6. Critically Acclaimed ===== */}
      {topRated.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  <Award
                    size={24}
                    style={{
                      verticalAlign: "middle",
                      marginRight: 8,
                      color: "var(--accent-gold)",
                    }}
                  />
                  Critically <span>Acclaimed</span>
                </h2>
                <p className="section-subtitle">
                  Masterpieces holding top ratings and verified community acclaim
                </p>
              </div>
              <Link to="/discover?sort=rating-high" className="section-link">
                View Top Rated <ChevronRight size={16} />
              </Link>
            </div>
            <div className="movie-grid">
              {topRated.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  genreName={getGenreName(movie.genreId)}
                  avgRating={movie.avgRating}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== 7. Hidden Gems ===== */}
      {hiddenGems.length > 0 && (
        <section className="section" style={{ background: "var(--bg-secondary)" }}>
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  <Gem
                    size={24}
                    style={{
                      verticalAlign: "middle",
                      marginRight: 8,
                      color: "var(--accent-bronze)",
                    }}
                  />
                  Hidden <span>Gems</span>
                </h2>
                <p className="section-subtitle">
                  Lesser-known, inventive, and deeply rewarding cinematic treasures
                </p>
              </div>
              <Link to="/discover" className="section-link">
                Discover More <ChevronRight size={16} />
              </Link>
            </div>
            <div className="movie-scroll">
              {hiddenGems.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  genreName={getGenreName(movie.genreId)}
                  avgRating={calculateAverageRating(reviews, movie.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== 8. Hollywood & International Favorites ===== */}
      {hollywoodFavorites.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  <Globe
                    size={24}
                    style={{
                      verticalAlign: "middle",
                      marginRight: 8,
                      color: "var(--accent-primary)",
                    }}
                  />
                  Hollywood & <span>Global Cinema</span>
                </h2>
                <p className="section-subtitle">
                  Celebrated international epics, mind-bending sci-fi, and Hollywood masterworks
                </p>
              </div>
              <Link to="/discover?lang=English" className="section-link">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="movie-grid">
              {hollywoodFavorites.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  genreName={getGenreName(movie.genreId)}
                  avgRating={calculateAverageRating(reviews, movie.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== 9. From Your Watchlist ===== */}
      {watchlistMovies.length > 0 && (
        <section className="section" style={{ background: "var(--bg-secondary)" }}>
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  <Bookmark
                    size={24}
                    style={{
                      verticalAlign: "middle",
                      marginRight: 8,
                      color: "var(--accent-gold)",
                    }}
                  />
                  From Your <span>Watchlist</span>
                </h2>
                <p className="section-subtitle">
                  Titles queued up for your next movie night
                </p>
              </div>
              <Link to="/watchlist" className="section-link">
                Manage Watchlist ({watchlist.length}) <ChevronRight size={16} />
              </Link>
            </div>
            <div className="movie-scroll">
              {watchlistMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  genreName={getGenreName(movie.genreId)}
                  avgRating={calculateAverageRating(reviews, movie.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== 10. Browse by Genre ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                Explore by <span>Genre</span>
              </h2>
              <p className="section-subtitle">
                Filter our diverse library by your favorite storytelling themes
              </p>
            </div>
            <Link to="/genres" className="section-link">
              All Genres ({genres.length}) <ChevronRight size={16} />
            </Link>
          </div>
          <div className="genre-grid">
            {genres.map((genre) => {
              const count = movies.filter((m) => String(m.genreId) === String(genre.id)).length;
              return (
                <Link
                  key={genre.id}
                  to={`/discover?genre=${genre.id}`}
                  className="genre-card"
                >
                  <div className="genre-card-icon">
                    <Tag size={24} />
                  </div>
                  <h3 className="genre-card-name">{genre.name}</h3>
                  <p className="genre-card-count">
                    {count} {count === 1 ? "Movie" : "Movies"}
                  </p>
                  <span className="btn btn-secondary btn-sm">
                    Browse <ChevronRight size={14} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
