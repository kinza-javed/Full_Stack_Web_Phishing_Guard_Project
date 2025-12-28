// src/pages/Auth/Signup.jsx
import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { isValidEmail, isValidPassword, isValidName, passwordStrength } from "../../utils/validators";
import "./Signup.css";

function StrengthBar({ score = 0 }) {
  const labels = ["Very weak", "Weak", "Okay", "Good", "Strong"];
  const width = Math.min(100, Math.max(6, (score / 4) * 100));
  const color =
    score < 2 ? "var(--danger)" : score === 2 ? "#f59e0b" : score === 3 ? "#fbbf24" : score >= 4 ? "#10b981" : "#e5e7eb";
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ height: 8, background: "rgba(0,0,0,0.06)", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ width: `${width}%`, height: "100%", background: color, transition: "width .2s" }} />
      </div>
      <div style={{ marginTop: 6, fontSize: 12, color: "var(--muted)" }}>{labels[Math.max(0, Math.min(4, score))]}</div>
    </div>
  );
}

export default function Signup() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const strengthScore = useMemo(() => passwordStrength(password), [password]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValidName(name)) return alert("Enter a valid name.");
    if (!isValidEmail(email)) return alert("Enter a valid email.");
    if (!isValidPassword(password)) return alert("Password must be at least 6 characters.");
    if (password !== confirm) return alert("Passwords do not match.");

    setSubmitting(true);
    const res = await registerUser({ name, email, password });
    setSubmitting(false);
    if (res.ok) navigate("/", { replace: true });
    // errors shown by AuthContext
  }

  return (
    <div className="auth-page auth-center">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h2 className="auth-title">Create your account</h2>

        <label className="field">
          <div className="label">Full name</div>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" required />
        </label>

        <label className="field">
          <div className="label">Email</div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@domain.com" required />
        </label>

        <label className="field">
          <div className="label">Password</div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 characters" required />
          <StrengthBar score={strengthScore} />
        </label>

        <label className="field">
          <div className="label">Confirm password</div>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-type password" required />
        </label>

        <button className="btn primary" type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create account"}
        </button>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <Link to="/login" className="link">Sign in</Link>
        </div>

        <div style={{ marginTop: 12, textAlign: "center", color: "var(--muted)" }}>
          <small>Or sign up with</small>
          <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 8 }}>
            <button className="btn" type="button" onClick={() => alert("Google OAuth not wired yet")}>Google</button>
            <button className="btn" type="button" onClick={() => alert("GitHub OAuth not wired yet")}>GitHub</button>
          </div>
        </div>
      </form>
    </div>
  );
}
