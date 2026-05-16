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
        console.log("Google auth verify failed:", error);
        window.location.replace("/login");
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