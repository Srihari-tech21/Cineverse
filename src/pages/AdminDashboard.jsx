// ==========================================================
// CineVerse 2.0 - Admin Dashboard Page
// KPI metrics, Recharts visual analytics, recently added
// movie logs, and most-reviewed community rankings.
// ==========================================================

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Film,
  Star,
  Award,
  MessageSquare,
  Bookmark,
  TrendingUp,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getMovies, getGenres, getReviews, getWatchlist } from "../services/api";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";
import { Loading } from "../components/Loading";
import {
  calculateOverallAverage,
  getHighestRatedMovie,
  getMoviesByGenreData,
  getMoviesByYearData,
  getRatingDistribution,
} from "../utils/calculations";

const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [moviesData, genresData, reviewsData, watchlistData] =
          await Promise.all([
            getMovies(),
            getGenres(),
            getReviews(),
            getWatchlist().catch(() => []),
          ]);
        setMovies(moviesData || []);
        setGenres(genresData || []);
        setReviews(reviewsData || []);
        setWatchlist(Array.isArray(watchlistData) ? watchlistData : []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ===== DASHBOARD CALCULATIONS =====
  const totalMovies = movies.length;
  const avgRating = calculateOverallAverage(reviews);
  const highestRated = getHighestRatedMovie(movies, reviews);
  const totalReviews = reviews.length;
  const totalWatchlisted = watchlist.length;

  // Chart Data
  const genreChartData = useMemo(() => getMoviesByGenreData(movies, genres), [movies, genres]);
  const yearChartData = useMemo(() => getMoviesByYearData(movies), [movies]);
  const ratingData = useMemo(() => getRatingDistribution(reviews), [reviews]);

  // Most Reviewed Movies
  const mostReviewed = useMemo(() => {
    return [...movies]
      .map((movie) => ({
        ...movie,
        reviewCount: reviews.filter((r) => String(r.movieId) === String(movie.id)).length,
      }))
      .filter((m) => m.reviewCount > 0)
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 5);
  }, [movies, reviews]);

  // Recently Added
  const recentlyAdded = useMemo(() => {
    return [...movies].reverse().slice(0, 5);
  }, [movies]);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const genreMap = useMemo(() => {
    return new Map(genres.map((g) => [String(g.id), g.name]));
  }, [genres]);

  const CHART_COLORS = isDark
    ? ["#D0AA7A", "#B58A62", "#A0704E", "#8E603E", "#695246", "#E5C396", "#C49A6C", "#9A7B56"]
    : ["#AA9174", "#695246", "#93755A", "#697884", "#2D6A4F", "#C89B3C", "#7C6354", "#A3866A"];

  const customTooltipStyle = {
    backgroundColor: isDark ? "#2B211A" : "#FFFFFF",
    border: isDark ? "1px solid rgba(205, 170, 130, 0.25)" : "1px solid rgba(105, 82, 70, 0.15)",
    borderRadius: "12px",
    padding: "10px 16px",
    color: isDark ? "#F7F0E8" : "#0E0C0A",
    fontSize: "13px",
    boxShadow: isDark ? "0 8px 24px rgba(0, 0, 0, 0.5)" : "0 8px 24px rgba(14, 12, 10, 0.08)",
  };

  const axisStroke = isDark ? "#B7A99B" : "#93755A";
  const gridStroke = isDark ? "rgba(205, 170, 130, 0.1)" : "rgba(105, 82, 70, 0.08)";

  if (loading) {
    return (
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-content">
          <Loading message="Loading analytics dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-content">
        {/* Page Header */}
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Dashboard & Analytics</h1>
            <p className="admin-page-subtitle">
              Real-time metrics, catalogue distribution, and community engagement statistics
            </p>
          </div>
          <Link to="/admin/movies/add" className="btn btn-primary btn-sm">
            + Add New Movie
          </Link>
        </div>

        {/* ===== KPI Cards ===== */}
        <div className="kpi-grid">
          {/* Total Movies */}
          <div className="kpi-card">
            <div className="kpi-card-header">
              <div className="kpi-card-icon purple">
                <Film size={22} />
              </div>
              <span className="kpi-card-label">Total Movies</span>
            </div>
            <div className="kpi-card-value">{totalMovies}</div>
            <div className="kpi-card-desc">Active in database</div>
          </div>

          {/* Average Rating */}
          <div className="kpi-card">
            <div className="kpi-card-header">
              <div className="kpi-card-icon gold">
                <Star size={22} />
              </div>
              <span className="kpi-card-label">Average Rating</span>
            </div>
            <div className="kpi-card-value">
              {avgRating > 0 ? avgRating : "N/A"}
            </div>
            <div className="kpi-card-desc">
              {avgRating > 0 ? "Out of 5 stars" : "No reviews yet"}
            </div>
          </div>

          {/* Highest Rated Movie */}
          <div className="kpi-card">
            <div className="kpi-card-header">
              <div className="kpi-card-icon green">
                <Award size={22} />
              </div>
              <span className="kpi-card-label">Highest Rated</span>
            </div>
            <div className="kpi-card-value" style={{ fontSize: "var(--font-size-lg)" }}>
              {highestRated ? highestRated.movie?.title : "N/A"}
            </div>
            <div className="kpi-card-desc">
              {highestRated ? `${highestRated.rating} / 5 stars` : "No reviews yet"}
            </div>
          </div>

          {/* Total Reviews */}
          <div className="kpi-card">
            <div className="kpi-card-header">
              <div className="kpi-card-icon pink">
                <MessageSquare size={22} />
              </div>
              <span className="kpi-card-label">Community Reviews</span>
            </div>
            <div className="kpi-card-value">{totalReviews}</div>
            <div className="kpi-card-desc">User-submitted ratings</div>
          </div>

          {/* Watchlist Queue Entries */}
          <div className="kpi-card">
            <div className="kpi-card-header">
              <div className="kpi-card-icon" style={{ background: "rgba(6, 182, 212, 0.15)", color: "var(--accent-cyan)" }}>
                <Bookmark size={22} />
              </div>
              <span className="kpi-card-label">Watchlist Adds</span>
            </div>
            <div className="kpi-card-value">{totalWatchlisted}</div>
            <div className="kpi-card-desc">Saved by members</div>
          </div>
        </div>

        {/* ===== Charts Section ===== */}
        <div className="charts-grid">
          {/* Chart 1: Movies by Genre (Donut Chart) */}
          <div className="chart-card">
            <h3 className="chart-card-title">Movies by Genre</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={genreChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {genreChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2: Movies by Release Year (Bar Chart) */}
          <div className="chart-card">
            <h3 className="chart-card-title">Movies by Release Year</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={yearChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="year" stroke={axisStroke} fontSize={12} />
                <YAxis stroke={axisStroke} fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="count" fill={isDark ? "#D0AA7A" : "#AA9174"} radius={[6, 6, 0, 0]} name="Movies" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 3: Rating Distribution (Bar Chart) */}
          <div className="chart-card">
            <h3 className="chart-card-title">Rating Distribution (1 - 5 Stars)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ratingData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="rating" stroke={axisStroke} fontSize={12} />
                <YAxis stroke={axisStroke} fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="count" fill={isDark ? "#B58A62" : "#C89B3C"} radius={[6, 6, 0, 0]} name="Reviews" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===== Tables Row: Most Reviewed & Recently Added ===== */}
        <div className="admin-tables-grid" style={{ marginTop: "var(--space-2xl)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "var(--space-xl)" }}>
          {/* Most Reviewed */}
          <div className="chart-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 className="chart-card-title" style={{ margin: 0 }}>
                <TrendingUp size={16} style={{ color: "var(--accent-primary)", verticalAlign: "middle", marginRight: 8 }} />
                Most Reviewed Titles
              </h3>
              <Link to="/admin/reviews" className="section-link" style={{ fontSize: 13 }}>
                View All <ArrowRight size={13} />
              </Link>
            </div>
            <div className="mini-table-list">
              {mostReviewed.map((m) => (
                <div key={m.id} className="mini-table-row">
                  <div className="mini-row-info">
                    <span className="mini-row-title">{m.title}</span>
                    <span className="mini-row-sub">{genreMap.get(String(m.genreId)) || "General"} • {m.releaseYear}</span>
                  </div>
                  <span className="mini-badge-pill">{m.reviewCount} reviews</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Added */}
          <div className="chart-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 className="chart-card-title" style={{ margin: 0 }}>
                <Clock size={16} style={{ color: "var(--accent-gold)", verticalAlign: "middle", marginRight: 8 }} />
                Recently Added Movies
              </h3>
              <Link to="/admin/movies" className="section-link" style={{ fontSize: 13 }}>
                Manage <ArrowRight size={13} />
              </Link>
            </div>
            <div className="mini-table-list">
              {recentlyAdded.map((m) => (
                <div key={m.id} className="mini-table-row">
                  <div className="mini-row-info">
                    <span className="mini-row-title">{m.title}</span>
                    <span className="mini-row-sub">{m.director ? `Dir. ${m.director}` : `${m.releaseYear}`}</span>
                  </div>
                  <span className="movie-card-genre" style={{ margin: 0 }}>{genreMap.get(String(m.genreId)) || "Film"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
