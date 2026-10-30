// ==========================================================
// CineVerse API Service Layer
// Hybrid Resilient Architecture:
// - Live REST API (when VITE_API_URL or local JSON Server is available)
// - Seamless Embedded / LocalStorage Fallback (ensures 100% uptime on
//   Vercel / Render / Cloud deployments with full CRUD persistence)
// ==========================================================

import initialDb from "../../db.json";

// Environment variable or local fallback
const ENV_API_URL = import.meta.env.VITE_API_URL;
const isBrowser = typeof window !== "undefined";
const isLocalhost =
  isBrowser &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

// Determine active API URL:
// - Explicit VITE_API_URL if configured
// - http://localhost:3000 if running locally in dev mode
// - null (auto-mock fallback) if deployed in production without an external backend
const API_URL = ENV_API_URL
  ? ENV_API_URL.replace(/\/+$/, "")
  : isLocalhost
  ? "http://localhost:3000"
  : null;

// LocalStorage Persistence Keys
const STORAGE_KEYS = {
  movies: "cineverse_movies",
  genres: "cineverse_genres",
  reviews: "cineverse_reviews",
  watchlists: "cineverse_watchlists",
  userPreferences: "cineverse_userPreferences",
};

// Initialize localStorage from initialDb on first run
function initLocalStorage() {
  if (!isBrowser) return;
  try {
    if (!localStorage.getItem(STORAGE_KEYS.movies)) {
      localStorage.setItem(STORAGE_KEYS.movies, JSON.stringify(initialDb.movies || []));
    }
    if (!localStorage.getItem(STORAGE_KEYS.genres)) {
      localStorage.setItem(STORAGE_KEYS.genres, JSON.stringify(initialDb.genres || []));
    }
    if (!localStorage.getItem(STORAGE_KEYS.reviews)) {
      localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(initialDb.reviews || []));
    }
    if (!localStorage.getItem(STORAGE_KEYS.watchlists)) {
      localStorage.setItem(STORAGE_KEYS.watchlists, JSON.stringify(initialDb.watchlists || []));
    }
    if (!localStorage.getItem(STORAGE_KEYS.userPreferences)) {
      localStorage.setItem(STORAGE_KEYS.userPreferences, JSON.stringify(initialDb.userPreferences || []));
    }
  } catch (e) {
    console.warn("[CineVerse] LocalStorage initialization notice:", e);
  }
}

initLocalStorage();

function getStored(key) {
  if (!isBrowser) return initialDb[key] || [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[key]);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(`[CineVerse] Failed to read ${key} from storage:`, e);
  }
  return initialDb[key] || [];
}

function setStored(key, data) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
  } catch (e) {
    console.warn(`[CineVerse] Failed to write ${key} to storage:`, e);
  }
}

// ----------------------------------------------------------
// Offline / Embedded Mock API Router
// Handles GET, POST, PUT, PATCH, DELETE operations locally
// ----------------------------------------------------------
function handleLocalRequest(endpoint, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const parsedUrl = new URL(endpoint, "http://cineverse.internal");
  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;
  const body = options.body ? JSON.parse(options.body) : null;

  // 1. MOVIES
  if (pathname === "/movies") {
    const list = getStored("movies");
    if (method === "GET") {
      return Promise.resolve([...list]);
    }
    if (method === "POST") {
      const newId = String(Date.now());
      const newItem = { id: newId, ...body };
      const updated = [newItem, ...list];
      setStored("movies", updated);
      return Promise.resolve(newItem);
    }
  }

  const movieMatch = pathname.match(/^\/movies\/([^/]+)$/);
  if (movieMatch) {
    const id = movieMatch[1];
    const list = getStored("movies");
    const index = list.findIndex((m) => String(m.id) === String(id));

    if (method === "GET") {
      if (index === -1) {
        return Promise.reject(new Error(`Movie with ID ${id} not found`));
      }
      return Promise.resolve(list[index]);
    }
    if (method === "PUT" || method === "PATCH") {
      if (index === -1) {
        return Promise.reject(new Error(`Movie with ID ${id} not found`));
      }
      const updatedItem = { ...list[index], ...body, id: list[index].id };
      list[index] = updatedItem;
      setStored("movies", list);
      return Promise.resolve(updatedItem);
    }
    if (method === "DELETE") {
      const filtered = list.filter((m) => String(m.id) !== String(id));
      setStored("movies", filtered);
      return Promise.resolve(null);
    }
  }

  // 2. GENRES
  if (pathname === "/genres") {
    const list = getStored("genres");
    if (method === "GET") {
      return Promise.resolve([...list]);
    }
    if (method === "POST") {
      const newId = String(Date.now());
      const newItem = { id: newId, ...body };
      const updated = [...list, newItem];
      setStored("genres", updated);
      return Promise.resolve(newItem);
    }
  }

  const genreMatch = pathname.match(/^\/genres\/([^/]+)$/);
  if (genreMatch) {
    const id = genreMatch[1];
    const list = getStored("genres");
    const index = list.findIndex((g) => String(g.id) === String(id));

    if (method === "GET") {
      if (index === -1) return Promise.reject(new Error(`Genre ${id} not found`));
      return Promise.resolve(list[index]);
    }
    if (method === "PUT" || method === "PATCH") {
      if (index === -1) return Promise.reject(new Error(`Genre ${id} not found`));
      const updatedItem = { ...list[index], ...body, id: list[index].id };
      list[index] = updatedItem;
      setStored("genres", list);
      return Promise.resolve(updatedItem);
    }
    if (method === "DELETE") {
      const filtered = list.filter((g) => String(g.id) !== String(id));
      setStored("genres", filtered);
      return Promise.resolve(null);
    }
  }

  // 3. REVIEWS
  if (pathname === "/reviews") {
    const list = getStored("reviews");
    if (method === "GET") {
      const movieId = searchParams.get("movieId");
      if (movieId) {
        return Promise.resolve(list.filter((r) => String(r.movieId) === String(movieId)));
      }
      return Promise.resolve([...list]);
    }
    if (method === "POST") {
      const newId = String(Date.now());
      const newItem = {
        id: newId,
        ...body,
        createdAt: body.createdAt || new Date().toISOString(),
      };
      const updated = [newItem, ...list];
      setStored("reviews", updated);
      return Promise.resolve(newItem);
    }
  }

  const reviewMatch = pathname.match(/^\/reviews\/([^/]+)$/);
  if (reviewMatch) {
    const id = reviewMatch[1];
    const list = getStored("reviews");
    const index = list.findIndex((r) => String(r.id) === String(id));

    if (method === "GET") {
      if (index === -1) return Promise.reject(new Error(`Review ${id} not found`));
      return Promise.resolve(list[index]);
    }
    if (method === "PUT" || method === "PATCH") {
      if (index === -1) return Promise.reject(new Error(`Review ${id} not found`));
      const updatedItem = { ...list[index], ...body, id: list[index].id };
      list[index] = updatedItem;
      setStored("reviews", list);
      return Promise.resolve(updatedItem);
    }
    if (method === "DELETE") {
      const filtered = list.filter((r) => String(r.id) !== String(id));
      setStored("reviews", filtered);
      return Promise.resolve(null);
    }
  }

  // 4. WATCHLISTS
  if (pathname === "/watchlists") {
    const list = getStored("watchlists");
    if (method === "GET") {
      const userId = searchParams.get("userId");
      if (userId) {
        return Promise.resolve(list.filter((w) => String(w.userId) === String(userId)));
      }
      return Promise.resolve([...list]);
    }
    if (method === "POST") {
      const newId = String(Date.now());
      const newItem = {
        id: newId,
        ...body,
        addedDate: body.addedDate || new Date().toISOString().split("T")[0],
      };
      const updated = [newItem, ...list];
      setStored("watchlists", updated);
      return Promise.resolve(newItem);
    }
  }

  const watchlistMatch = pathname.match(/^\/watchlists\/([^/]+)$/);
  if (watchlistMatch) {
    const id = watchlistMatch[1];
    const list = getStored("watchlists");
    const index = list.findIndex((w) => String(w.id) === String(id));

    if (method === "PATCH" || method === "PUT") {
      if (index === -1) return Promise.reject(new Error(`Watchlist item ${id} not found`));
      const updatedItem = { ...list[index], ...body, id: list[index].id };
      list[index] = updatedItem;
      setStored("watchlists", list);
      return Promise.resolve(updatedItem);
    }
    if (method === "DELETE") {
      const filtered = list.filter((w) => String(w.id) !== String(id));
      setStored("watchlists", filtered);
      return Promise.resolve(null);
    }
  }

  // 5. USER PREFERENCES
  const prefMatch = pathname.match(/^\/userPreferences\/([^/]+)$/);
  if (prefMatch) {
    const userId = prefMatch[1];
    const list = getStored("userPreferences");
    const userPref =
      list.find((p) => String(p.id) === String(userId)) || {
        id: userId,
        name: "Cinema Enthusiast",
        email: "alex.turner@cineverse.io",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        favoriteGenres: ["1", "2"],
        bio: "Movie critic & sci-fi buff exploring great stories.",
      };

    if (method === "GET") {
      return Promise.resolve(userPref);
    }
    if (method === "PATCH" || method === "PUT") {
      const updated = { ...userPref, ...body, id: userId };
      const filtered = list.filter((p) => String(p.id) !== String(userId));
      setStored("userPreferences", [...filtered, updated]);
      return Promise.resolve(updated);
    }
  }

  // Fallback
  return Promise.resolve([]);
}

// ----------------------------------------------------------
// Helper: Generic fetch wrapper with graceful fallback
// ----------------------------------------------------------
async function request(endpoint, options = {}) {
  // If no live backend is configured (e.g. deployed statically on Vercel),
  // immediately serve from local dataset without network failure
  if (!API_URL) {
    return handleLocalRequest(endpoint, options);
  }

  try {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 6000) : null;

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      signal: controller ? controller.signal : undefined,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (timeoutId) clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Server responded with status ${response.status}`;
      try {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(`API Error (${response.status}): ${errorMessage}`);
    }

    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn(`[CineVerse API] Live API unreachable (${error.message}). Serving from local dataset.`);
    // Graceful fallback to embedded local data
    return handleLocalRequest(endpoint, options);
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
