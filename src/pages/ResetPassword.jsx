import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!otp.trim()) {
      toast.error("OTP is required");
      return false;
    }

    if (!password) {
      toast.error("Password is required");
      return false;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must contain uppercase, lowercase, number and special character."
      );
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await axios.post("/reset-password", {
        email,
        otp,
        password,
      });

      toast.success(res.data.message || "Password updated successfully");

      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pageBg px-4">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md bg-cardBg rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-3xl font-bold text-headingText">
          Reset Password
        </h2>

        <p className="text-mutedText mt-2 mb-6">
          Enter the OTP sent to your email and choose a new password.
        </p>

        <input
          type="email"
          value={email}
          readOnly
          className="w-full mb-4 rounded-xl border border-borderMain bg-sectionBg px-4 py-3"
        />

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full mb-4 rounded-xl border border-borderMain px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 rounded-xl border border-borderMain px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-6 rounded-xl border border-borderMain px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-buttonPrimaryBg py-3 font-semibold text-buttonPrimaryText hover:bg-buttonPrimaryHoverBg disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full mt-4 text-primary hover:underline"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}