import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { ROUTES } from "../../router";
import { useAuth } from "../../hooks/useAuth";

/* Inline SVG icons as components (so no external assets needed) */
const IconDashboard = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" fill="currentColor"/>
  </svg>
);

const IconSearch = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconHistory = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M21 12a9 9 0 10-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconMail = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M3 7.5l9 6 9-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);

const IconContact = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M21 21v-2a4 4 0 00-3-3.87" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 7a4 4 0 118 0 4 4 0 01-8 0z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="2" y="3" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
);

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const v = localStorage.getItem("pg_sidebar_collapsed");
    setCollapsed(v === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("pg_sidebar_collapsed", collapsed ? "true" : "false");
    // toggle a class on body for layout tweaks
    document.documentElement.setAttribute("data-sidebar-collapsed", collapsed ? "true" : "false");
  }, [collapsed]);

  const toggleCollapsed = () => setCollapsed(prev => !prev);

  const NavItem = ({ to, label, Icon, exact }) => (
    <NavLink
      to={to}
      className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
      title={collapsed ? label : undefined}
      end={exact}
    >
      <span className="nav-icon"><Icon className="svg-icon" /></span>
      {!collapsed && <span className="nav-label">{label}</span>}
    </NavLink>
  );

  const initials = user?.name ? user.name.split(" ").map(n=>n[0]).slice(0,2).join("") : (user?.email ? user.email[0].toUpperCase() : "PG");

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`} aria-label="Main navigation">
      <div className="sidebar-top">
        <div className="brand">
          <div className="logo" aria-hidden>
            {/* Crab emoji placeholder — swap with image if desired */}
            🦀
          </div>
          {!collapsed && <div className="brand-text">
            <div className="brand-title">Phishing Guard</div>
            <div className="brand-sub">Protect & Explain</div>
          </div>}
        </div>

        <button
          className="collapse-btn"
          onClick={toggleCollapsed}
          aria-pressed={collapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <span className="chev">{collapsed ? "»" : "«"}</span>
        </button>
      </div>

      <nav className="nav-list" role="navigation">
        <NavItem to={ROUTES.HOME} label="Dashboard" Icon={IconDashboard} exact={true} />
        {/* <NavItem to="/scanner" label="Scan URL" Icon={IconSearch} /> */}

        <NavItem to={ROUTES.HISTORY} label="History" Icon={IconHistory} />
        {/* <NavItem to="/mail-scan" label="Scan Email" Icon={IconMail} /> */}
        <NavItem to={ROUTES.CONTACT} label="Contact Us" Icon={IconContact} />
        {/* more items can be added here */}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-actions">
          <ThemeToggle small />
          <button
            className="profile-btn"
            title={collapsed ? (user?.email || "Profile") : "Open profile menu"}
            onClick={() => {
              // simple logout action or expand profile actions in future
              if (!collapsed) {
                // show a small confirmation
                if (confirm("Logout?")) logout();
              } else {
                // collapsed: show a tooltip for logout
                logout();
              }
            }}
          >
            <span className="profile-initials">{initials}</span>
            {!collapsed && <div className="profile-meta">
              <div className="profile-name">{user?.name || user?.email || "Guest"}</div>
              <div className="profile-action">Logout</div>
            </div>}
          </button>
        </div>
        <div className="sidebar-footer">
          {!collapsed && <small className="copyright">© {new Date().getFullYear()} Phishing Guard</small>}
        </div>
      </div>
    </aside>
  );
}