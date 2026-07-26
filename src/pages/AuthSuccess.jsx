import { useEffect } from "react";
import axios from "../api/axios";

const AuthSuccess = () => {
  useEffect(() => {
    const verifyLogin = async () => {
      try {
        const res = await axios.get("/users/profile/view", {
          withCredentials: true,
        });

        window.location.replace("/home");
      } catch (error) {
        // FIX: logged only to the console before, then redirected to
        // "/login" — a route that doesn't exist in this app (auth is
        // modal-based, not page-based), producing a real "Page Not
        // Found." Redirecting to "/" instead, since that's a route that
        // actually exists and where the login modal can be reopened.
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