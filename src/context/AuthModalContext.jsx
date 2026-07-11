import { createContext, useContext, useState } from "react";

const AuthModalContext = createContext();

export const useAuthModal = () => useContext(AuthModalContext);

export default function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("login");

  const openLogin = () => {
    setMode("login");
    setIsOpen(true);
  };

  const openSignup = () => {
    setMode("signup");
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const switchToLogin = () => {
    setMode("login");
  };

  const switchToSignup = () => {
    setMode("signup");
  };

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        mode,
        openLogin,
        openSignup,
        closeModal,
        switchToLogin,
        switchToSignup,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}