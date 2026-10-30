// ==========================================================
// SearchBar Component
// Reusable search input with icon
// Demonstrates: Props, Events (onChange)
// ==========================================================

import { Search } from "lucide-react";

/**
 * @param {Object} props
 * @param {string} props.value - Current search value
 * @param {Function} props.onChange - Handler for search input changes
 * @param {string} [props.placeholder] - Placeholder text
 */
const SearchBar = ({ value, onChange, placeholder = "Search movies by title..." }) => {
  return (
    <div className="search-input-wrapper">
      <Search size={18} />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search movies"
      />
    </div>
  );
};

export default SearchBar;
