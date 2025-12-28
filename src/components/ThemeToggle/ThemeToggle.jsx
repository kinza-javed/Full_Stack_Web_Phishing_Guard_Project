import React from "react";
import { useTheme } from "../../hooks/useTheme";
import "./ThemeToggle.css";

export default function ThemeToggle({ small = false }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`theme-toggle ${small ? "small" : ""}`}
      onClick={toggleTheme}
      aria-label="Toggle dark / light theme"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <span className="icon">{theme === "light" ? "🌙" : "☀️"}</span>
      {!small && <span className="label">{theme === "light" ? "Dark" : "Light"}</span>}
    </button>
  );
}
