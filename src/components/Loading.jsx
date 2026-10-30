// ==========================================================
// Loading Component
// Spinner and skeleton loading states
// Demonstrates: Conditional Rendering, Props
// ==========================================================

/**
 * Full-page loading spinner
 * @param {Object} props
 * @param {string} [props.message] - Optional loading message
 */
export const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <span className="loading-text">{message}</span>
    </div>
  );
};

/**
 * Skeleton loading cards for movie grid
 * @param {Object} props
 * @param {number} [props.count] - Number of skeleton cards to show
 */
export const MovieCardSkeleton = ({ count = 8 }) => {
  return (
    <div className="movie-grid">
      {/* Create array of N elements to render skeleton cards */}
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton skeleton-poster" />
          <div className="skeleton skeleton-line" style={{ marginTop: 12 }} />
          <div className="skeleton skeleton-line short" />
        </div>
      ))}
    </div>
  );
};

export default Loading;
