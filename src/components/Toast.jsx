// ==========================================================
// Toast Notification Component
// Auto-dismissing success/error/warning notifications
// Demonstrates: useState, useEffect, Props, Events
// ==========================================================

import { useState, useEffect, createContext, useContext } from "react";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

// Create context so any component can trigger toasts
const ToastContext = createContext(null);

/**
 * Toast Provider - wraps the app to provide toast functionality
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add a new toast notification
  const addToast = (message, type = "success") => {
    const id = Date.now(); // Unique ID using timestamp
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Remove a specific toast
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Icon mapping for different toast types
  const getIcon = (type) => {
    switch (type) {
      case "success": return <CheckCircle size={20} />;
      case "error": return <XCircle size={20} />;
      case "warning": return <AlertTriangle size={20} />;
      default: return <CheckCircle size={20} />;
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container - renders all active toasts */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span className="toast-icon">{getIcon(toast.type)}</span>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

/**
 * Custom hook to access toast functionality from any component
 * Usage: const { addToast } = useToast();
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
