// ==========================================================
// GenreFilter Component
// Dropdown filter for movie genres
// Demonstrates: Props, Events, Conditional Rendering
// ==========================================================

/**
 * @param {Object} props
 * @param {Array} props.genres - Array of genre objects from API
 * @param {string} props.value - Currently selected genre ID
 * @param {Function} props.onChange - Handler for genre selection changes
 */
const GenreFilter = ({ genres = [], value, onChange }) => {
  return (
    <select
      className="filter-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Filter by genre"
    >
      <option value="">All Genres</option>
      {genres.map((genre) => (
        <option key={genre.id} value={genre.id}>
          {genre.name}
        </option>
      ))}
    </select>
  );
};

export default GenreFilter;
