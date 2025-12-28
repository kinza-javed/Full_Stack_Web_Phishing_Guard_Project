// src/pages/auth/ForgotPassword.jsx
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    const res = await requestPasswordReset(email);

    if (res.ok) toast.success("A password reset link has been sent to your email!");
    else toast.error(res.message);
  }

  return (
    <div className="auth-page auth-center">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="auth-title">Reset your password</h2>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <button className="btn primary" type="submit">Send Reset Link</button>
      </form>
    </div>
  );
}
