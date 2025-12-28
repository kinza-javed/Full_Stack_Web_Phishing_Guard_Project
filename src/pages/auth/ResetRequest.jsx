// src/pages/Auth/ResetRequest.jsx
import React, { useState } from "react";
import api from "../../utils/api";
import { isValidEmail } from "../../utils/validators";
import "./Login.css"; // reuse auth css
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function ResetRequest() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRequest(e) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast.error("Enter a valid email");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset-password-request", { email });
      toast.success("If that email exists, a reset link has been sent.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page auth-center">
      <form className="auth-card" onSubmit={handleRequest}>
        <h2 className="auth-title">Reset your password</h2>
        <p style={{ color: "var(--muted)", marginBottom: 8 }}>Enter your email to receive a password reset link.</p>

        <label className="field">
          <div className="label">Email</div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@domain.com" required />
        </label>

        <button className="btn primary" type="submit" disabled={loading}>{loading ? "Sending..." : "Send reset link"}</button>

        <div className="auth-footer">
          <Link to="/login" className="link">Back to login</Link>
        </div>
      </form>
    </div>
  );
}
