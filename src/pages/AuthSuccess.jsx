import { useEffect } from "react";
import axios from "../api/axios";

const AuthSuccess = () => {
  useEffect(() => {
    const verifyLogin = async () => {
      try {
        // FIX: the backend now also sends the token in this URL
        // (?token=...) as a fallback, since the cookie set right before
        // this redirect is cross-site (Render backend, Vercel frontend)
        // and browsers can silently drop it. Storing it here means the
        // axios interceptor can attach it as a header on the very next
        // request, instead of that request depending on a cookie that
        // may not have survived the redirect.
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        if (token) {
          localStorage.setItem("token", token);
        }

        const res = await axios.get("/users/profile/view", {
          withCredentials: true,
        });

        window.location.replace("/home");
      } catch (error) {
        console.error(
          "Google auth verify failed:",
          error.response?.status,
          error.response?.data || error.message,
        );
        window.location.replace("/?authError=google");
      }
    };

    verifyLogin();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Logging you in...</p>
    </div>
  );
};

export default AuthSuccess;