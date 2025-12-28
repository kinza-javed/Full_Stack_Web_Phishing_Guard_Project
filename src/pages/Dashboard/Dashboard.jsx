import React from "react";
import URLScanner from "../scanner/urlscanner";
import EmailScanner from "../scanner/EmailScanner";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dash-wrapper">
      <h1>Dashboard</h1>
      <p className="muted">Quick security tools at your fingertips.</p>

      <div className="dash-grid">
        {/* URL Scanner LEFT */}
        <div className="dash-card">
          <URLScanner />
        </div>

        {/* Email Scanner RIGHT */}
        <div className="dash-card">
          <EmailScanner />
        </div>
      </div>
    </div>
  );
}
