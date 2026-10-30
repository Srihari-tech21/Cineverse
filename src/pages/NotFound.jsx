// ==========================================================
// NotFound Page (404)
// Displayed for any unmatched routes
// ==========================================================

import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-code">404</div>
      <h1 className="not-found-title">Page Not Found</h1>
      <p className="not-found-text">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        <Home size={16} /> Go Home
      </Link>
    </div>
  );
};

export default NotFound;
