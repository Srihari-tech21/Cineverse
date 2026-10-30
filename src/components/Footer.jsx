// ==========================================================
// Footer Component
// Site-wide footer with branding, links, and copyright
// ==========================================================

import { Link } from "react-router-dom";
import { Film } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-brand-name">
              <Film size={20} style={{ display: "inline", marginRight: 8, verticalAlign: "middle", color: "var(--accent-primary)" }} />
              Cine<span style={{ color: "var(--accent-primary)" }}>Verse</span>
            </div>
            <p className="footer-brand-desc">
              Your ultimate destination for discovering, exploring, and managing
              movies. CineVerse brings the magic of cinema to your fingertips.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Discover</h4>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/movies">Browse Movies</Link>
              <Link to="/genres">Genres</Link>
            </div>
          </div>

          {/* Admin Links */}
          <div>
            <h4 className="footer-heading">Administration</h4>
            <div className="footer-links">
              <Link to="/admin">Dashboard</Link>
              <Link to="/admin/movies">Manage Movies</Link>
              <Link to="/admin/genres">Manage Genres</Link>
              <Link to="/admin/reviews">Manage Reviews</Link>
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="footer-heading">About</h4>
            <div className="footer-links">
              <span>CineVerse is a full-featured movie discovery and management application powered by React and JSON Server.</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} CineVerse. All rights reserved.</span>
          <span>Built with React.js & JSON Server</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
