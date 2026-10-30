// ==========================================================
// ReviewCard Component
// Displays a single review with author, rating, and comment
// Demonstrates: Props, Destructuring, Conditional Rendering
// ==========================================================

import { RatingStarsDisplay } from "./RatingStars";
import { formatDate } from "../utils/calculations";

/**
 * @param {Object} props
 * @param {Object} props.review - Review data from API
 * @param {Function} [props.onDelete] - Optional delete handler (admin mode)
 * @param {string} [props.movieTitle] - Optional movie title (admin reviews page)
 */
const ReviewCard = ({ review, onDelete, movieTitle }) => {
  // Get first letter of reviewer name for avatar
  const initial = review.reviewerName
    ? review.reviewerName.charAt(0).toUpperCase()
    : "?";

  return (
    <div className="review-card">
      <div className="review-card-header">
        <div className="review-card-author">
          <div className="review-card-avatar">{initial}</div>
          <div>
            <div className="review-card-name">{review.reviewerName}</div>
            <div className="review-card-date">
              {review.date ? formatDate(review.date) : "Unknown date"}
              {/* Conditionally show movie title in admin view */}
              {movieTitle && (
                <span style={{ color: "var(--accent-secondary)", marginLeft: 8 }}>
                  on {movieTitle}
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <RatingStarsDisplay rating={review.rating} size={14} />
          {/* Conditionally render delete button for admin */}
          {onDelete && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onDelete(review.id)}
              style={{ color: "var(--danger)" }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
      <p className="review-card-comment">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;
