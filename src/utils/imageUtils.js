// ==========================================================
// CineVerse 2.0 - Image Utility
// Resilient image resolution, TMDB base URL construction,
// format normalization, and infinite-loop-safe fallbacks.
// ==========================================================

export const FALLBACK_POSTER = "/assets/poster-fallback.svg";
export const FALLBACK_BACKDROP = "/assets/backdrop-fallback.svg";

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

/**
 * Resolves a movie poster URL to a fully-qualified, verified display URL.
 * Handles:
 * - Full HTTPS URLs (TMDB, IMDb/Amazon CDN, etc.)
 * - TMDB relative paths (e.g. "/wWba3TaojhK7NdycRhoQpsG0FaH.jpg")
 * - Local asset paths (e.g. "/assets/..." or "/posters/...")
 * - Missing / empty paths with elegant CineVerse branded fallback
 *
 * @param {string|null|undefined} pathOrUrl - Poster path or full URL
 * @param {'w185'|'w342'|'w500'|'original'} [size='w500'] - Preferred TMDB image size
 * @returns {string} Fully qualified URL or local fallback path
 */
export function getPosterUrl(pathOrUrl, size = "w500") {
  if (!pathOrUrl || typeof pathOrUrl !== "string") {
    return FALLBACK_POSTER;
  }

  const trimmed = pathOrUrl.trim();
  if (!trimmed || trimmed === "N/A" || trimmed === "null" || trimmed === "undefined") {
    return FALLBACK_POSTER;
  }

  // Already a full external URL or data URI
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  // Local assets in public folder
  if (trimmed.startsWith("/assets/") || trimmed.startsWith("/posters/") || trimmed.startsWith("/images/")) {
    return trimmed;
  }

  // TMDB relative path (e.g. "/rstcAnBeCkxNQjNp3YXrF6IP1tW.jpg")
  if (trimmed.startsWith("/")) {
    return `${TMDB_IMAGE_BASE}/${size}${trimmed}`;
  }

  // Unprefixed TMDB hash (e.g. "rstcAnBeCkxNQjNp3YXrF6IP1tW.jpg")
  if (/^[a-zA-Z0-9_\-]+\.(jpg|jpeg|png|webp)$/i.test(trimmed)) {
    return `${TMDB_IMAGE_BASE}/${size}/${trimmed}`;
  }

  return FALLBACK_POSTER;
}

/**
 * Resolves a movie backdrop URL to a fully-qualified display URL.
 *
 * @param {string|null|undefined} pathOrUrl - Backdrop path or full URL
 * @param {'w780'|'w1280'|'original'} [size='w1280'] - Preferred TMDB backdrop size
 * @returns {string} Fully qualified URL or local fallback path
 */
export function getBackdropUrl(pathOrUrl, size = "w1280") {
  if (!pathOrUrl || typeof pathOrUrl !== "string") {
    return FALLBACK_BACKDROP;
  }

  const trimmed = pathOrUrl.trim();
  if (!trimmed || trimmed === "N/A" || trimmed === "null" || trimmed === "undefined") {
    return FALLBACK_BACKDROP;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  if (trimmed.startsWith("/assets/") || trimmed.startsWith("/backdrops/") || trimmed.startsWith("/images/")) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return `${TMDB_IMAGE_BASE}/${size}${trimmed}`;
  }

  if (/^[a-zA-Z0-9_\-]+\.(jpg|jpeg|png|webp)$/i.test(trimmed)) {
    return `${TMDB_IMAGE_BASE}/${size}/${trimmed}`;
  }

  return FALLBACK_BACKDROP;
}

/**
 * Error handler for HTML <img> elements.
 * Replaces broken images with the CineVerse local fallback
 * while preventing infinite error loops if the fallback itself errors.
 *
 * @param {Event} event - Native image error event
 * @param {string} [fallback=FALLBACK_POSTER] - Target fallback asset
 */
export function handleImageError(event, fallback = FALLBACK_POSTER) {
  const target = event.currentTarget || event.target;
  if (!target) return;

  if (target.dataset.hasFailed) {
    // Already swapped once; prevent infinite loop
    return;
  }

  target.dataset.hasFailed = "true";
  target.src = fallback;
}
