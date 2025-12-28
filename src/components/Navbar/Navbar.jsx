import React from "react";
import "./Navbar.css";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

export default function Navbar() {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <header className="pg-navbar" role="banner">
      <div className="nav-left">
        <button className="hamburger" aria-label="Toggle sidebar">☰</button>
        <div className="app-title">Phishing Guard</div>
      </div>

      <div className="nav-right">
        <div className="nav-user">
          <div className="user-name">{user?.name || user?.email || "Guest"}</div>
          <div className="user-meta">{theme === "light" ? "Light Mode" : "Dark Mode"}</div>
        </div>
      </div>
    </header>
  );
}
