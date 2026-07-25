import axios from "axios";

// FIX: the request interceptor read a "token" from localStorage and
// attached it as a Bearer header — but nowhere in the app is a token
// ever written to localStorage. Auth is entirely cookie-based
// (httpOnly cookie set by the backend), so this was dead code that
// just added a no-op header check to every request. Removed.
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default instance;