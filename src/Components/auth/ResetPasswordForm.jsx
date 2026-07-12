import { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "../../api/axios";
import { useAuthModal } from "../../context/AuthModalContext";

export default function ResetPasswordForm() {
  const {
    email,
    otp,
    closeModal,
    openLogin,
  } = useAuthModal();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const validatePassword = () => {
    if (!password) {
      toast.error("Password is required");
      return false;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    try {
      setLoading(true);

      await axios.post("/reset-password", {
        email,
        otp,
        password,
      });

      toast.success("Password updated successfully 🎉");

      closeModal();

      setTimeout(() => {
        openLogin();
      }, 300);

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to reset password"
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
        Create New Password
      </h2>

      <p className="mt-2 text-bodyText">
        Your identity has been verified.
        Create a new secure password.
      </p>

      {/* Password */}

      <div className="relative mt-8">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="
          w-full
          rounded-xl
          border
          border-borderMain
          bg-cardBg
          px-4
          py-3
          pr-12
          outline-none
          focus:ring-2
          focus:ring-primary
          "
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(!showPassword)
          }
          className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-gray-500
          "
        >
          {showPassword ? (
            <FaEyeSlash />
          ) : (
            <FaEye />
          )}
        </button>
      </div>

      {/* Confirm Password */}

      <div className="relative mt-5">
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          className="
          w-full
          rounded-xl
          border
          border-borderMain
          bg-cardBg
          px-4
          py-3
          pr-12
          outline-none
          focus:ring-2
          focus:ring-primary
          "
        />

        <button
          type="button"
          onClick={() =>
            setShowConfirm(!showConfirm)
          }
          className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-gray-500
          "
        >
          {showConfirm ? (
            <FaEyeSlash />
          ) : (
            <FaEye />
          )}
        </button>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
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
        {loading
          ? "Updating Password..."
          : "Update Password"}
      </motion.button>

      <button
        type="button"
        onClick={openLogin}
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