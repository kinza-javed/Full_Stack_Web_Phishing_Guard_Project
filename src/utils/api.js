import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// Attach token and user ID if present
api.interceptors.request.use(config => {
  const raw = localStorage.getItem("pg_user");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      const user = parsed?.user;
      if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
      if (user?.id) config.headers['x-user-id'] = user.id;
    } catch {}
  } else {
    // For guest users
    config.headers['x-user-id'] = 'guest';
  }
  return config;
});

export default api;
