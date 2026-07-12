import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "../../api/axios";
import { useAuthModal } from "../../context/AuthModalContext";

export default function ForgotPasswordForm() {
  const {
    setEmail,
    openVerifyResetOtp,
    switchToLogin,
  } = useAuthModal();

  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailInput.trim()) {
      return toast.error("Email is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailInput)) {
      return toast.error("Enter a valid email");
    }

    try {
      setLoading(true);

      await axios.post("/forgot-password", {
        email: emailInput,
      });

      // Save email globally
      setEmail(emailInput);

      toast.success("OTP sent successfully 📩");

      // Open Verify OTP screen
      openVerifyResetOtp();

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Unable to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      onSubmit={handleSubmit}
      className="w-full max-w-md"
    >
      <h2 className="text-4xl font-bold text-headingText">
        Forgot Password
      </h2>

      <p className="mt-2 text-bodyText">
        Enter your registered email address.
      </p>

      <input
        type="email"
        placeholder="Email Address"
        value={emailInput}
        onChange={(e) => setEmailInput(e.target.value)}
        className="
          mt-8
          w-full
          rounded-xl
          border
          border-borderMain
          bg-cardBg
          px-4
          py-3
          outline-none
          transition
          focus:ring-2
          focus:ring-primary
        "
      />

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
        type="submit"
        className="
          mt-8
          w-full
          rounded-xl
          bg-buttonPrimaryBg
          py-3
          font-semibold
          text-buttonPrimaryText
          disabled:opacity-60
        "
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </motion.button>

      <button
        type="button"
        onClick={switchToLogin}
        className="
          mt-6
          w-full
          text-center
          text-primary
          hover:underline
        "
      >
        ← Back to Login
      </button>
    </motion.form>
  );
}