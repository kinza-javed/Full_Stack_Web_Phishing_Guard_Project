import React from "react";
import { Link } from "react-router-dom";
import "./NavbarPublic.css";

export default function NavbarPublic() {
  return (
    <nav className="public-nav">
      <div className="nav-left">
        <Link to="/" className="logo">
          <span className="logo-text">Phishing Guard</span>
        </Link>

        <Link to="#" className="nav-item">Docs</Link>
        <Link to="#" className="nav-item">API</Link>
      </div>

      <div className="nav-right">
        <Link to="/login" className="nav-btn">Sign In</Link>
        <Link to="/signup" className="nav-btn-outline">Create Account</Link>
      </div>
    </nav>
  );
}
