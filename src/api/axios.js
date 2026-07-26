import axios from "axios";

// FIX: an Authorization-header interceptor was removed earlier as dead
// code (nothing wrote to localStorage at the time). It's back now for a
// real reason: this backend (onrender.com) and frontend (vercel.app) are
// on different domains, so the login cookie set after Google OAuth is a
// cross-site cookie — browsers can and do block or drop these, causing
// the very next request to come back 401 even though login succeeded.
// AuthSuccess.jsx now stores the token from the redirect URL, and this
// interceptor attaches it as a header so requests don't depend on the
// cookie surviving that cross-site hop. Regular email/password login
// still works via the cookie as before; this is purely a fallback.
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;