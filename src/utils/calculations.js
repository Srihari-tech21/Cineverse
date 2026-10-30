// ==========================================================
// CineVerse Utility Functions
// Dashboard calculations and helper functions
// Uses ES6+ array methods: reduce(), filter(), map()
// ==========================================================

/**
 * Calculate the average rating for a specific movie from its reviews
 * @param {Array} reviews - All reviews array
 * @param {string|number} movieId - The movie ID to calculate for
 * @returns {number} Average rating (0 if no reviews)
 */
export const calculateAverageRating = (reviews = [], movieId) => {
  if (!reviews || !Array.isArray(reviews)) return 0;
  const movieReviews = reviews.filter((r) => String(r.movieId) === String(movieId));
  if (movieReviews.length === 0) return 0;

  const totalRating = movieReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
  return parseFloat((totalRating / movieReviews.length).toFixed(1));
};

/**
 * Get the count of reviews for a specific movie
 * @param {Array} reviews - All reviews array
 * @param {string|number} movieId - The movie ID
 * @returns {number} Number of reviews
 */
export const getReviewCount = (reviews = [], movieId) => {
  if (!reviews || !Array.isArray(reviews)) return 0;
  return reviews.filter((r) => String(r.movieId) === String(movieId)).length;
};

/**
 * Calculate overall average rating across all reviews
 * @param {Array} reviews - All reviews array
 * @returns {number} Overall average rating
 */
export const calculateOverallAverage = (reviews = []) => {
  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return 0;
  const total = reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
  return parseFloat((total / reviews.length).toFixed(1));
};

/**
 * Find the highest rated movie based on average review ratings
 * @param {Array} movies - All movies array
 * @param {Array} reviews - All reviews array
 * @returns {Object|null} { movie, rating } or null if no reviews exist
 */
export const getHighestRatedMovie = (movies = [], reviews = []) => {
  if (!movies || !reviews || movies.length === 0 || reviews.length === 0) return null;

  let highestRating = 0;
  let highestMovie = null;

  movies.forEach((movie) => {
    const avgRating = calculateAverageRating(reviews, movie.id);
    if (avgRating > highestRating) {
      highestRating = avgRating;
      highestMovie = movie;
    }
  });

  return highestMovie ? { movie: highestMovie, rating: highestRating } : null;
};

/**
 * Calculate movies count per genre for pie/donut chart
 * @param {Array} movies - All movies array
 * @param {Array} genres - All genres array
 * @returns {Array} [{ name, value, fill }]
 */
export const getMoviesByGenreData = (movies = [], genres = []) => {
  const colors = ["#8B5CF6", "#F5C451", "#EC4899", "#06B6D4", "#10B981", "#F97316"];

  return genres.map((genre, index) => ({
    name: genre.name,
    value: movies.filter((m) => String(m.genreId) === String(genre.id)).length,
    fill: colors[index % colors.length],
  }));
};

/**
 * Calculate movies count by release year for bar chart
 * @param {Array} movies - All movies array
 * @returns {Array} [{ year, count }] sorted by year
 */
export const getMoviesByYearData = (movies = []) => {
  if (!movies || !Array.isArray(movies)) return [];

  const yearCounts = movies.reduce((acc, movie) => {
    const year = movie.releaseYear;
    if (year) {
      acc[year] = (acc[year] || 0) + 1;
    }
    return acc;
  }, {});

  return Object.entries(yearCounts)
    .map(([year, count]) => ({ year: parseInt(year), count }))
    .sort((a, b) => a.year - b.year);
};

/**
 * Calculate rating distribution (1-5 stars) for chart
 * @param {Array} reviews - All reviews array
 * @returns {Array} [{ rating, count }]
 */
export const getRatingDistribution = (reviews = []) => {
  if (!reviews || !Array.isArray(reviews)) return [];

  return [1, 2, 3, 4, 5].map((rating) => ({
    rating: `${rating} Star${rating > 1 ? "s" : ""}`,
    count: reviews.filter((r) => Math.round(Number(r.rating)) === rating).length,
  }));
};

/**
 * Get unique release years from movies for year filter dropdown
 * @param {Array} movies - All movies array
 * @returns {Array} Sorted array of unique years descending
 */
export const getUniqueYears = (movies = []) => {
  if (!movies || !Array.isArray(movies)) return [];
  const years = [...new Set(movies.map((m) => m.releaseYear).filter(Boolean))];
  return years.sort((a, b) => b - a);
};

/**
 * Format a date string to a readable format
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
