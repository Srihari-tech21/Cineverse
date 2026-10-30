// ==========================================================
// ConfirmDialog Component
// Modal confirmation dialog for destructive actions
// Demonstrates: Props, Events, Conditional Rendering
// ==========================================================

import { AlertTriangle } from "lucide-react";

/**
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the dialog is visible
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message
 * @param {Function} props.onConfirm - Handler for confirm button
 * @param {Function} props.onCancel - Handler for cancel button
 * @param {string} [props.confirmText] - Text for confirm button
 * @param {string} [props.cancelText] - Text for cancel button
 */
const ConfirmDialog = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  onConfirm,
  onCancel,
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  // Conditional rendering: don't render if dialog is not open
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-icon">
          <AlertTriangle size={28} />
        </div>
        <h3 className="dialog-title">{title}</h3>
        <p className="dialog-message">{message}</p>
        <div className="dialog-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
