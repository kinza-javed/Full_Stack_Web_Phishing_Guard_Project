// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

export const AuthContext = createContext();

const STORAGE_KEY = "pg_user"; // stored as { user: {...}, expiresAt: 123456789 }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return parsed.user || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Whenever user changes we update localStorage; when null we remove
    if (user) {
      // default expiry: if no expiresAt was set externally, keep 24h
      const raw = localStorage.getItem(STORAGE_KEY);
      let expiresAt = Date.now() + 24 * 3600 * 1000;
      try {
        const parsed = raw ? JSON.parse(raw) : null;
        if (parsed?.expiresAt) expiresAt = parsed.expiresAt;
      } catch {}
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, expiresAt }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    toast.success("Logged out");
  };

  // loginUser accepts remember flag; if remember=true set expiry to 30 days else default 24h
  async function loginUser({ email, password, remember = false }) {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const userObj = res?.data?.user || res?.data?.data;
      
      if (!userObj) {
        throw new Error('Invalid response from server');
      }
      
      setUser(userObj);

      const expiresAt = Date.now() + (remember ? 30 * 24 * 3600 * 1000 : 24 * 3600 * 1000);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userObj, expiresAt }));

      setLoading(false);
      toast.success("Signed in");
      return { ok: true, user: userObj };
    } catch (err) {
      setLoading(false);
      const message = err?.response?.data?.error || err?.response?.data?.message || err.message || "Login failed";
      toast.error(message);
      return { ok: false, message };
    }
  }

  async function registerUser({ name, email, password }) {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password });
      const userObj = res?.data?.user || res?.data?.data;
      
      if (!userObj) {
        throw new Error('Invalid response from server');
      }
      
      setUser(userObj);

      // default 30-day persistence for new accounts
      const expiresAt = Date.now() + 30 * 24 * 3600 * 1000;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userObj, expiresAt }));

      setLoading(false);
      toast.success("Account created");
      return { ok: true, user: userObj };
    } catch (err) {
      setLoading(false);
      const message = err?.response?.data?.error || err?.response?.data?.message || err.message || "Signup failed";
      toast.error(message);
      return { ok: false, message };
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loginUser, registerUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
