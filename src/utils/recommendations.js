// ==========================================================
// CineVerse Smart Movie Recommendation Engine
// Lightweight content-based filtering algorithm
// Analyzes user preferences, watchlist, ratings, genres, and directors
// ==========================================================

import { calculateAverageRating } from "./calculations";

/**
 * Builds a dynamic taste profile for the user based on:
 * 1. Explicit user preferences (favorite genres, directors)
 * 2. Movies in the user's watchlist (especially watched ones)
 * 3. High-rated reviews written by the user
 */
export function buildUserTasteProfile(movies = [], watchlist = [], reviews = [], userPreferences = null) {
  const genreWeights = {};
  const directorWeights = {};
  const actorWeights = {};
  const watchedMovieIds = new Set();
  const watchlistMovieIds = new Set();

  // 1. Process explicit user preferences if available
  if (userPreferences?.favoriteGenres && Array.isArray(userPreferences.favoriteGenres)) {
    userPreferences.favoriteGenres.forEach((genreId) => {
      genreWeights[genreId] = (genreWeights[genreId] || 0) + 5;
    });
  }

  // 2. Process watchlist & watched movies
  watchlist.forEach((item) => {
    watchlistMovieIds.add(String(item.movieId));
    if (item.watched) {
      watchedMovieIds.add(String(item.movieId));
    }

    const movie = movies.find((m) => String(m.id) === String(item.movieId));
    if (movie) {
      const weight = item.watched ? 4 : 2;
      if (movie.genreId) {
        genreWeights[movie.genreId] = (genreWeights[movie.genreId] || 0) + weight;
      }
      if (movie.director) {
        directorWeights[movie.director] = (directorWeights[movie.director] || 0) + weight;
      }
      if (Array.isArray(movie.cast)) {
        movie.cast.forEach((actor) => {
          actorWeights[actor] = (actorWeights[actor] || 0) + (item.watched ? 2 : 1);
        });
      }
    }
  });

  // 3. Process positive reviews (4 or 5 stars) from demo user or general reviews
  reviews.forEach((review) => {
    if (review.rating >= 4) {
      const movie = movies.find((m) => String(m.id) === String(review.movieId));
      if (movie) {
        if (movie.genreId) {
          genreWeights[movie.genreId] = (genreWeights[movie.genreId] || 0) + (review.rating === 5 ? 4 : 2);
        }
        if (movie.director) {
          directorWeights[movie.director] = (directorWeights[movie.director] || 0) + 3;
        }
      }
    }
  });

  return {
    genreWeights,
    directorWeights,
    actorWeights,
    watchedMovieIds,
    watchlistMovieIds,
    hasHistory: Object.keys(genreWeights).length > 0 || watchlist.length > 0,
  };
}

/**
 * Generates personalized recommendations for a user.
 * 
 * @param {Array} movies - All movies in the catalogue
 * @param {Array} genres - All genres
 * @param {Array} reviews - All reviews
 * @param {Array} watchlist - Current user's watchlist
 * @param {Object} userPreferences - Demo user preferences
 * @param {Object} options - Filtering options { excludeWatched, excludeWatchlist, limit }
 * @returns {Array} List of movies with matchScore and reason
 */
export function getPersonalizedRecommendations(
  movies = [],
  genres = [],
  reviews = [],
  watchlist = [],
  userPreferences = null,
  options = {}
) {
  const {
    excludeWatched = true,
    excludeWatchlist = false,
    limit = 10,
  } = options;

  if (!movies || movies.length === 0) return [];

  const genreMap = new Map(genres.map((g) => [String(g.id), g.name]));
  const profile = buildUserTasteProfile(movies, watchlist, reviews, userPreferences);

  // If user has no taste profile yet, fallback to top-rated critically acclaimed movies
  if (!profile.hasHistory) {
    return movies
      .map((movie) => {
        const avg = calculateAverageRating(reviews, movie.id);
        const rating = avg ? parseFloat(avg) : 4.5;
        const genreName = genreMap.get(String(movie.genreId)) || "Cinema";
        return {
          ...movie,
          matchScore: Math.round(75 + rating * 4),
          reason: `Critically acclaimed ${genreName} masterpiece with a ${rating}/5 rating`,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }

  // Find max weights for normalization
  const maxGenreWeight = Math.max(1, ...Object.values(profile.genreWeights));
  const maxDirectorWeight = Math.max(1, ...Object.values(profile.directorWeights));

  // Score candidate movies
  const scored = [];

  for (const movie of movies) {
    const movieIdStr = String(movie.id);

    // Apply exclusions
    if (excludeWatched && profile.watchedMovieIds.has(movieIdStr)) {
      continue;
    }
    if (excludeWatchlist && profile.watchlistMovieIds.has(movieIdStr)) {
      continue;
    }

    let score = 30; // Baseline score
    const reasons = [];

    // Genre matching (up to 35 points)
    const genreWeight = profile.genreWeights[movie.genreId] || 0;
    if (genreWeight > 0) {
      const genreScore = (genreWeight / maxGenreWeight) * 35;
      score += genreScore;
      const genreName = genreMap.get(String(movie.genreId));
      if (genreName) {
        reasons.push(`matches your interest in ${genreName}`);
      }
    }

    // Director matching (up to 25 points)
    const dirWeight = profile.directorWeights[movie.director] || 0;
    if (dirWeight > 0 && movie.director) {
      const dirScore = (dirWeight / maxDirectorWeight) * 25;
      score += dirScore;
      reasons.push(`directed by ${movie.director}`);
    }

    // Cast overlap matching (up to 15 points)
    if (Array.isArray(movie.cast)) {
      const matchingActors = movie.cast.filter((actor) => (profile.actorWeights[actor] || 0) > 0);
      if (matchingActors.length > 0) {
        score += Math.min(15, matchingActors.length * 6);
        reasons.push(`starring ${matchingActors.slice(0, 2).join(" & ")}`);
      }
    }

    // Quality boost from reviews (up to 15 points)
    const avg = calculateAverageRating(reviews, movie.id);
    if (avg) {
      const numAvg = parseFloat(avg);
      score += (numAvg / 5) * 15;
    } else {
      score += 10;
    }

    // Normalize matchScore to 60 - 99% range
    const finalScore = Math.min(99, Math.max(62, Math.round(score)));

    // Construct human-readable reason
    let reasonText = "";
    if (reasons.length > 0) {
      reasonText = `Recommended because it ${reasons.join(", and ")}.`;
    } else {
      const gName = genreMap.get(String(movie.genreId)) || "film";
      reasonText = `Popular ${gName} recommended for movie enthusiasts.`;
    }

    scored.push({
      ...movie,
      matchScore: finalScore,
      reason: reasonText,
    });
  }

  // Sort by highest match score
  scored.sort((a, b) => b.matchScore - a.matchScore);

  return scored.slice(0, limit);
}

/**
 * Finds similar movies for a specific target movie.
 * Used on the MovieDetails page.
 */
export function getSimilarMovies(targetMovie, allMovies = [], limit = 4) {
  if (!targetMovie || !allMovies || allMovies.length === 0) return [];

  const candidates = allMovies.filter((m) => String(m.id) !== String(targetMovie.id));

  const scored = candidates.map((movie) => {
    let similarity = 0;

    // 1. Same Genre (50 points)
    if (movie.genreId && targetMovie.genreId && String(movie.genreId) === String(targetMovie.genreId)) {
      similarity += 50;
    }

    // 2. Same Director (30 points)
    if (movie.director && targetMovie.director && movie.director.toLowerCase() === targetMovie.director.toLowerCase()) {
      similarity += 30;
    }

    // 3. Shared Cast (10 points per shared actor, up to 20 points)
    if (Array.isArray(movie.cast) && Array.isArray(targetMovie.cast)) {
      const targetCastLower = targetMovie.cast.map((c) => c.toLowerCase());
      const sharedActors = movie.cast.filter((c) => targetCastLower.includes(c.toLowerCase()));
      similarity += Math.min(20, sharedActors.length * 10);
    }

    // 4. Same Era (within 5 years = 10 points)
    if (movie.releaseYear && targetMovie.releaseYear) {
      const yearDiff = Math.abs(movie.releaseYear - targetMovie.releaseYear);
      if (yearDiff <= 3) similarity += 10;
      else if (yearDiff <= 6) similarity += 5;
    }

    return {
      movie,
      similarity,
    };
  });

  // Sort by highest similarity
  scored.sort((a, b) => b.similarity - a.similarity);

  return scored.slice(0, limit).map((s) => s.movie);
}
