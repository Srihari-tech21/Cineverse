// ==========================================================
// RatingStars Component
// Interactive 1-5 star rating OR display-only stars
// Demonstrates: Props, Events, Conditional Rendering, useState
// ==========================================================

import { useState } from "react";
import { Star } from "lucide-react";

/**
 * Interactive rating stars (for forms)
 * @param {Object} props
 * @param {number} props.value - Current rating value (1-5)
 * @param {Function} props.onChange - Handler when user clicks a star
 */
export const RatingStarsInput = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={star <= (hovered || value) ? "active" : ""}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            size={24}
            fill={star <= (hovered || value) ? "currentColor" : "none"}
          />
        </button>
      ))}
    </div>
  );
};

/**
 * Display-only rating stars (for reviews and cards)
 * @param {Object} props
 * @param {number} props.rating - Rating value to display
 * @param {number} [props.size] - Star icon size
 */
export const RatingStarsDisplay = ({ rating, size = 16 }) => {
  return (
    <div className="rating-stars-display">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= Math.round(rating) ? "star-filled" : "star-empty"}
          fill={star <= Math.round(rating) ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
};
