import { useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useAuthModal } from "../../context/AuthModalContext";

export default function LoginForm() {
  const {
    switchToSignup,
    openForgotPassword,
    openVerifyLoginOtp,
    setEmail,
  } = useAuthModal();

  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!emailInput.trim()) {
      toast.error("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailInput)) {
      toast.error("Invalid email");
      return false;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await axios.post("/login", {
        email: emailInput,
        password,
      });

      toast.success("OTP sent successfully 📩");

      // Save email in context
      setEmail(emailInput);

      // Open Verify OTP modal
      openVerifyLoginOtp();

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      onSubmit={handleLogin}
      className="w-full max-w-md"
    >
      <h2 className="text-4xl font-bold text-headingText">
        Welcome Back
      </h2>

      <p className="mt-2 text-bodyText">
        Login to continue your journey.
      </p>

      {/* Google Login */}

      <button
        type="button"
        onClick={() => {
          window.location.href =
            `${import.meta.env.VITE_API_URL}/auth/google`;
        }}
        className="mt-8 w-full rounded-xl border border-borderMain bg-cardBg py-3 font-medium transition hover:bg-hoverBg flex items-center justify-center gap-3"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          className="h-5 w-5"
          alt=""
        />

        Continue with Google
      </button>

      <div className="my-7 flex items-center gap-4">
        <hr className="flex-1 border-borderMain" />

        <span className="text-sm text-mutedText">
          OR
        </span>

        <hr className="flex-1 border-borderMain" />
      </div>

      {/* Email */}

      <input
        type="email"
        placeholder="Email Address"
        value={emailInput}
        onChange={(e) => setEmailInput(e.target.value)}
        className="mb-4 w-full rounded-xl border border-borderMain bg-cardBg px-4 py-3 outline-none transition focus:ring-2 focus:ring-primary"
      />

      {/* Password */}

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-2 w-full rounded-xl border border-borderMain bg-cardBg px-4 py-3 outline-none transition focus:ring-2 focus:ring-primary"
      />

      {/* Forgot Password */}

      <div className="flex justify-end mb-6">
        <button
          type="button"
          onClick={openForgotPassword}
          className="text-primary text-sm hover:underline"
        >
          Forgot Password?
        </button>
      </div>

      {/* Login */}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
        type="submit"
        className="w-full rounded-xl bg-buttonPrimaryBg py-3 text-buttonPrimaryText font-semibold transition hover:bg-buttonPrimaryHoverBg disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Sending OTP..." : "Sign In"}
      </motion.button>

      {/* Signup */}

      <p className="mt-6 text-center text-sm text-bodyText">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={switchToSignup}
          className="font-semibold text-primary hover:underline"
        >
          Create Account
        </button>
      </p>
    </motion.form>
  );
}