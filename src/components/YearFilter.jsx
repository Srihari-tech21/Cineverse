// ==========================================================
// YearFilter Component
// Dropdown filter for release years
// Demonstrates: Props, ES6+ spread/Set for unique values
// ==========================================================

import { getUniqueYears } from "../utils/calculations";

/**
 * @param {Object} props
 * @param {Array} props.movies - Array of movie objects to extract years from
 * @param {string} props.value - Currently selected year
 * @param {Function} props.onChange - Handler for year selection changes
 */
const YearFilter = ({ movies = [], value, onChange }) => {
  const years = getUniqueYears(movies);

  return (
    <select
      className="filter-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Filter by release year"
    >
      <option value="">All Years</option>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
};

export default YearFilter;
