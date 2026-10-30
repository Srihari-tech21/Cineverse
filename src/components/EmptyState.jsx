// ==========================================================
// EmptyState Component
// Professional empty state display
// Demonstrates: Props, Conditional Rendering
// ==========================================================

import { FolderOpen } from "lucide-react";

/**
 * @param {Object} props
 * @param {string} [props.title] - Empty state heading
 * @param {string} [props.message] - Empty state description
 * @param {React.ReactNode} [props.icon] - Custom icon
 * @param {React.ReactNode} [props.action] - Optional action button
 */
const EmptyState = ({
  title = "Nothing found",
  message = "There are no items to display.",
  icon,
  action,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {icon || <FolderOpen size={32} />}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-text">{message}</p>
      {/* Conditionally render action button if provided */}
      {action && action}
    </div>
  );
};

export default EmptyState;
