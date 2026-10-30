// ==========================================================
// CineVerse Watchlist & User Experience Context
// Centralizes real-time watchlist status, watched tracking,
// and user preferences across the entire application.
// ==========================================================

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getWatchlist,
  addToWatchlist,
  updateWatchlistItem,
  removeFromWatchlist,
  getUserPreferences,
  updateUserPreferences,
} from "../services/api";

const WatchlistContext = createContext(null);

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const DEMO_USER_ID = "demo-user-1";

  // Fetch initial watchlist and preferences
  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [watchlistData, prefsData] = await Promise.all([
        getWatchlist(DEMO_USER_ID).catch(() => []),
        getUserPreferences(DEMO_USER_ID).catch(() => null),
      ]);
      setWatchlist(Array.isArray(watchlistData) ? watchlistData : []);
      setPreferences(
        prefsData || {
          id: DEMO_USER_ID,
          name: "Cinema Enthusiast",
          email: "alex.turner@cineverse.io",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          favoriteGenres: ["1", "2"],
          bio: "Movie critic & sci-fi buff exploring great stories.",
        }
      );
    } catch (err) {
      console.error("Failed to load user watchlist/preferences:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Check if a movie is in the user's watchlist
  const isWatchlisted = useCallback(
    (movieId) => {
      return watchlist.some((item) => String(item.movieId) === String(movieId));
    },
    [watchlist]
  );

  // Check if a movie has been marked as watched
  const isWatched = useCallback(
    (movieId) => {
      const entry = watchlist.find((item) => String(item.movieId) === String(movieId));
      return Boolean(entry?.watched);
    },
    [watchlist]
  );

  // Get raw entry
  const getWatchlistEntry = useCallback(
    (movieId) => {
      return watchlist.find((item) => String(item.movieId) === String(movieId));
    },
    [watchlist]
  );

  // Toggle watchlist state (Add / Remove)
  const toggleWatchlist = useCallback(
    async (movieOrId) => {
      const movieId = typeof movieOrId === "object" ? movieOrId.id : movieOrId;
      const existing = watchlist.find((item) => String(item.movieId) === String(movieId));

      try {
        if (existing) {
          // Optimistic remove
          setWatchlist((prev) => prev.filter((item) => String(item.id) !== String(existing.id)));
          await removeFromWatchlist(existing.id);
          return { added: false, message: "Removed from watchlist" };
        } else {
          // Optimistic add
          const newItem = {
            userId: DEMO_USER_ID,
            movieId: String(movieId),
            addedDate: new Date().toISOString().split("T")[0],
            watched: false,
            watchedDate: null,
          };
          const created = await addToWatchlist(newItem);
          setWatchlist((prev) => [...prev, created]);
          return { added: true, message: "Added to watchlist" };
        }
      } catch (err) {
        console.error("Watchlist toggle failed, refreshing:", err);
        refresh();
        throw err;
      }
    },
    [watchlist, refresh]
  );

  // Toggle watched status
  const toggleWatched = useCallback(
    async (movieId) => {
      const existing = watchlist.find((item) => String(item.movieId) === String(movieId));
      const today = new Date().toISOString().split("T")[0];

      try {
        if (existing) {
          const nextWatched = !existing.watched;
          const updates = {
            watched: nextWatched,
            watchedDate: nextWatched ? today : null,
          };

          // Optimistic update
          setWatchlist((prev) =>
            prev.map((item) =>
              String(item.id) === String(existing.id) ? { ...item, ...updates } : item
            )
          );

          await updateWatchlistItem(existing.id, updates);
          return {
            watched: nextWatched,
            message: nextWatched ? "Marked as watched" : "Marked as unwatched",
          };
        } else {
          // If not in watchlist, add it directly as watched
          const newItem = {
            userId: DEMO_USER_ID,
            movieId: String(movieId),
            addedDate: today,
            watched: true,
            watchedDate: today,
          };
          const created = await addToWatchlist(newItem);
          setWatchlist((prev) => [...prev, created]);
          return { watched: true, message: "Added to watchlist & marked as watched" };
        }
      } catch (err) {
        console.error("Toggle watched failed, refreshing:", err);
        refresh();
        throw err;
      }
    },
    [watchlist, refresh]
  );

  // Remove directly
  const removeMovie = useCallback(
    async (movieId) => {
      const existing = watchlist.find((item) => String(item.movieId) === String(movieId));
      if (!existing) return;
      try {
        setWatchlist((prev) => prev.filter((item) => String(item.id) !== String(existing.id)));
        await removeFromWatchlist(existing.id);
      } catch (err) {
        refresh();
        throw err;
      }
    },
    [watchlist, refresh]
  );

  // Update preferences
  const updatePrefs = useCallback(
    async (newPrefs) => {
      try {
        const updated = await updateUserPreferences(DEMO_USER_ID, newPrefs);
        setPreferences(updated);
        return updated;
      } catch (err) {
        console.error("Failed to update preferences:", err);
        throw err;
      }
    },
    []
  );

  const watchlistCount = watchlist.length;
  const watchedCount = watchlist.filter((w) => w.watched).length;
  const unwatchedCount = watchlistCount - watchedCount;

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        preferences,
        loading,
        error,
        isWatchlisted,
        isWatched,
        getWatchlistEntry,
        toggleWatchlist,
        toggleWatched,
        removeMovie,
        updatePreferences: updatePrefs,
        refresh,
        watchlistCount,
        watchedCount,
        unwatchedCount,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
};

export default WatchlistContext;
