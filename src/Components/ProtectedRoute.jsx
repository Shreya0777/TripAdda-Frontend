import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("/users/profile/view", {
          withCredentials: true,
        });

        setIsAuth(true);
      } catch (error) {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <p>Loading...</p>;

  return isAuth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;