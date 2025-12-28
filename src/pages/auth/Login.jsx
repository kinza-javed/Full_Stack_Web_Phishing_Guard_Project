// src/pages/Auth/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { isValidEmail, isValidPassword } from "../../utils/validators";
import "./Login.css";

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isValidEmail(email)) return toastError("Enter a valid email.");
    if (!isValidPassword(password)) return toastError("Password must be at least 6 characters.");

    setSubmitting(true);
    const res = await loginUser({ email, password, remember });
    setSubmitting(false);

    if (res.ok) navigate("/", { replace: true });
    // errors handled by AuthContext toast
  }

  function toastError(msg) {
    // fallback if toast isn't imported here; call global toast via AuthContext already used too.
    const e = new Error(msg);
    throw e;
  }

  return (
    <div className="auth-page auth-center">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h2 className="auth-title">Sign in to Phishing Guard</h2>

        <label className="field">
          <div className="label">Email</div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            required
            autoComplete="email"
          />
        </label>

        <label className="field">
          <div className="label">Password</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
            autoComplete="current-password"
          />
        </label>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <span style={{ fontSize: 13 }}>Remember me</span>
          </label>

          <Link to="/reset-request" className="link">Forgot password?</Link>
        </div>

        <button className="btn primary" type="submit" disabled={submitting} style={{ marginTop: 14 }}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>

        <div className="auth-footer">
          <span>Don't have an account? </span>
          <Link to="/signup" className="link">Create account</Link>
        </div>

        <div style={{ marginTop: 12, textAlign: "center", color: "var(--muted)" }}>
          <small>Or continue with</small>
          <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 8 }}>
            <button className="btn" type="button" onClick={() => alert("Google OAuth not wired yet")}>Google</button>
            <button className="btn" type="button" onClick={() => alert("GitHub OAuth not wired yet")}>GitHub</button>
          </div>
        </div>
      </form>
    </div>
  );
}
