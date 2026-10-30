// ==========================================================
// CineVerse API Service Layer
// Centralized REST API functions using Fetch API
// All components use this service instead of direct fetch calls
// ==========================================================

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ----------------------------------------------------------
// Helper: Generic fetch wrapper with robust error handling
// Ensures failed API requests throw descriptive errors
// ----------------------------------------------------------
async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `Server responded with status ${response.status}`;
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(`API Error (${response.status}): ${errorMessage}`);
    }

    // DELETE or 204 responses may have no body
    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`[CineVerse API Error] ${options.method || "GET"} ${endpoint}:`, error.message);
    throw error;
  }
}

// ==========================================================
// MOVIES API - GET, POST, PUT, DELETE
// ==========================================================

/** GET /movies - Retrieve all movies */
export const getMovies = () => request("/movies");

/** GET /movies/:id - Retrieve a single movie by ID */
export const getMovieById = (id) => request(`/movies/${id}`);

/** POST /movies - Create a new movie */
export const addMovie = (movie) =>
  request("/movies", {
    method: "POST",
    body: JSON.stringify(movie),
  });

/** PUT /movies/:id - Update an existing movie */
export const updateMovie = (id, movie) =>
  request(`/movies/${id}`, {
    method: "PUT",
    body: JSON.stringify(movie),
  });

/** DELETE /movies/:id - Delete a movie */
export const deleteMovie = (id) =>
  request(`/movies/${id}`, {
    method: "DELETE",
  });

// ==========================================================
// GENRES API - GET, POST, PUT, DELETE
// ==========================================================

/** GET /genres - Retrieve all genres */
export const getGenres = () => request("/genres");

/** POST /genres - Create a new genre */
export const addGenre = (genre) =>
  request("/genres", {
    method: "POST",
    body: JSON.stringify(genre),
  });

/** PUT /genres/:id - Update an existing genre */
export const updateGenre = (id, genre) =>
  request(`/genres/${id}`, {
    method: "PUT",
    body: JSON.stringify(genre),
  });

/** DELETE /genres/:id - Delete a genre */
export const deleteGenre = (id) =>
  request(`/genres/${id}`, {
    method: "DELETE",
  });

// ==========================================================
// REVIEWS API - GET, POST, PUT, DELETE
// ==========================================================

/** GET /reviews - Retrieve all reviews */
export const getReviews = () => request("/reviews");

/** GET /reviews/:id - Retrieve a single review by ID */
export const getReviewById = (id) => request(`/reviews/${id}`);

/** POST /reviews - Create a new review */
export const addReview = (review) =>
  request("/reviews", {
    method: "POST",
    body: JSON.stringify(review),
  });

/** PUT /reviews/:id - Update an existing review */
export const updateReview = (id, review) =>
  request(`/reviews/${id}`, {
    method: "PUT",
    body: JSON.stringify(review),
  });

/** DELETE /reviews/:id - Delete a review */
export const deleteReview = (id) =>
  request(`/reviews/${id}`, {
    method: "DELETE",
  });

/** GET /reviews?movieId=:id - Retrieve reviews for a specific movie */
export const getReviewsByMovie = (movieId) =>
  request(`/reviews?movieId=${movieId}`);

// ==========================================================
// WATCHLIST API - GET, POST, PATCH, DELETE
// ==========================================================

/** GET /watchlists - Retrieve watchlist entries */
export const getWatchlist = (userId = "demo-user-1") =>
  request(`/watchlists?userId=${userId}`);

/** POST /watchlists - Add movie to watchlist */
export const addToWatchlist = (watchlistItem) =>
  request("/watchlists", {
    method: "POST",
    body: JSON.stringify(watchlistItem),
  });

/** PATCH /watchlists/:id - Update watchlist item (e.g. toggle watched) */
export const updateWatchlistItem = (id, updates) =>
  request(`/watchlists/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });

/** DELETE /watchlists/:id - Remove item from watchlist */
export const removeFromWatchlist = (id) =>
  request(`/watchlists/${id}`, {
    method: "DELETE",
  });

// ==========================================================
// USER PREFERENCES API - GET, PUT/PATCH
// ==========================================================

/** GET /userPreferences/:id - Retrieve preferences for demo user */
export const getUserPreferences = (userId = "demo-user-1") =>
  request(`/userPreferences/${userId}`);

/** PATCH /userPreferences/:id - Update user preferences (e.g. favorite genres) */
export const updateUserPreferences = (userId, preferences) =>
  request(`/userPreferences/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(preferences),
  });

