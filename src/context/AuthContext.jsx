import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // ==========================
  // Fetch Logged-in User
  // ==========================

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `/users/profile/view?t=${Date.now()}`
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

  // ==========================
  // Login Success
  // ==========================

  const login = async () => {
    await fetchProfile();
  };

  // ==========================
  // Logout
  // ==========================

  const logout = async () => {
    try {
      await axios.post("/logout");
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