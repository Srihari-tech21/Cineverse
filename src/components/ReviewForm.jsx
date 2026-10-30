// ==========================================================
// ReviewForm Component
// Form for submitting movie reviews
// Demonstrates: useState, Forms, Validation, Events, Props
// ==========================================================

import { useState } from "react";
import { RatingStarsInput } from "./RatingStars";
import { Send } from "lucide-react";

/**
 * @param {Object} props
 * @param {Function} props.onSubmit - Handler called with validated review data
 */
const ReviewForm = ({ onSubmit }) => {
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Form validation function
  const validate = () => {
    const newErrors = {};

    if (!reviewerName.trim()) {
      newErrors.reviewerName = "Name is required";
    }

    if (rating === 0) {
      newErrors.rating = "Please select a rating";
    } else if (rating < 1 || rating > 5) {
      newErrors.rating = "Rating must be between 1 and 5";
    }

    if (!comment.trim()) {
      newErrors.comment = "Review text is required";
    } else if (comment.trim().length < 10) {
      newErrors.comment = "Review must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    try {
      const reviewData = {
        reviewerName: reviewerName.trim(),
        rating,
        comment: comment.trim(),
        date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      };

      await onSubmit(reviewData);

      // Reset form after successful submission
      setReviewerName("");
      setRating(0);
      setComment("");
      setErrors({});
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-form-card">
      <h3 className="review-form-title">Write a Review</h3>
      <form onSubmit={handleSubmit}>
        {/* Reviewer Name Input */}
        <div className="form-group">
          <label className="form-label">Your Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter your name"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
          />
          {errors.reviewerName && (
            <span className="form-error">{errors.reviewerName}</span>
          )}
        </div>

        {/* Star Rating Input */}
        <div className="form-group">
          <label className="form-label">Rating</label>
          <RatingStarsInput value={rating} onChange={setRating} />
          {errors.rating && (
            <span className="form-error">{errors.rating}</span>
          )}
        </div>

        {/* Review Comment Textarea */}
        <div className="form-group">
          <label className="form-label">Your Review</label>
          <textarea
            className="form-textarea"
            placeholder="Share your thoughts about this movie..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
          {errors.comment && (
            <span className="form-error">{errors.comment}</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          <Send size={16} />
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
