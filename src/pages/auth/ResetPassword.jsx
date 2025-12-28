// src/pages/Auth/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { isValidPassword } from "../../utils/validators";
import "./Login.css";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const { token } = useParams(); // expects /reset/:token
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e) {
    e.preventDefault();
    if (!isValidPassword(password)) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      toast.success("Password updated — please sign in");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page auth-center">
      <form className="auth-card" onSubmit={handleReset}>
        <h2 className="auth-title">Set a new password</h2>

        <label className="field">
          <div className="label">New password</div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" required />
        </label>

        <label className="field">
          <div className="label">Confirm password</div>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-type password" required />
        </label>

        <button className="btn primary" type="submit" disabled={loading}>{loading ? "Updating..." : "Update password"}</button>

        <div className="auth-footer">
          <Link to="/login" className="link">Back to login</Link>
        </div>
      </form>
    </div>
  );
}
