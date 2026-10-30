// ==========================================================
// Sidebar Component
// Admin panel side navigation for CineVerse
// Demonstrates: Link, useLocation for active state
// ==========================================================

import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Film,
  PlusCircle,
  Tags,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  // Determine active link based on current route
  const isActive = (path) => location.pathname === path;

  const links = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/movies", icon: Film, label: "Manage Movies" },
    { to: "/admin/movies/add", icon: PlusCircle, label: "Add Movie" },
    { to: "/admin/genres", icon: Tags, label: "Manage Genres" },
    { to: "/admin/reviews", icon: MessageSquare, label: "Manage Reviews" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-title">Admin Panel</div>
      <nav className="sidebar-nav">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`sidebar-link ${isActive(to) ? "active" : ""}`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-divider" />
      <nav className="sidebar-nav">
        <Link to="/" className="sidebar-link">
          <ArrowLeft size={18} />
          Back to Website
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
