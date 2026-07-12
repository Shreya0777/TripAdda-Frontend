import { createContext, useContext, useState } from "react";

const AuthModalContext = createContext();

export const useAuthModal = () => useContext(AuthModalContext);

export default function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  /*
    Modes

    login
    signup
    verify-login-otp
    forgot-password
    verify-reset-otp
    reset-password
  */

  const [mode, setMode] = useState("login");

  // Shared data between forms

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");

  //-------------------------
  // Open Modal
  //-------------------------

  const openLogin = () => {
    setMode("login");
    setIsOpen(true);
  };

  const openSignup = () => {
    setMode("signup");
    setIsOpen(true);
  };

  const openForgotPassword = () => {
    setMode("forgot-password");
    setIsOpen(true);
  };

  const openVerifyLoginOtp = () => {
    setMode("verify-login-otp");
  };

  const openVerifyResetOtp = () => {
    setMode("verify-reset-otp");
  };

  const openResetPassword = () => {
    setMode("reset-password");
  };

  //-------------------------
  // Switch
  //-------------------------

  const switchToLogin = () => {
    setMode("login");
  };

  const switchToSignup = () => {
    setMode("signup");
  };

  //-------------------------
  // Close
  //-------------------------

  const closeModal = () => {
    setIsOpen(false);

    setMode("login");

    setEmail("");

    setOtp("");
  };

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        mode,

        email,
        setEmail,

        otp,
        setOtp,

        openLogin,
        openSignup,
        openForgotPassword,
        openVerifyLoginOtp,
        openVerifyResetOtp,
        openResetPassword,

        switchToLogin,
        switchToSignup,

        closeModal,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}