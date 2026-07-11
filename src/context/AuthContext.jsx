import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged in user
  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `/users/profile/view?t=${Date.now()}`,
        {
          withCredentials: true,
        }
      );

      setUser(res.data.user || res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Refresh user after login/signup
  const login = async () => {
    await fetchProfile();
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post(
        "/logout",
        {},
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.log(err);
    }

    setUser(null);

    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);