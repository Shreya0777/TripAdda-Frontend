import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useAuthModal } from "../../context/AuthModalContext";
import { useAuth } from "../../context/AuthContext";

export default function VerifyLoginOtpForm() {
  const {
    email,
    openLogin,
    closeModal,
  } = useAuthModal();

  const { login } = useAuth();

  const navigate = useNavigate();

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [loading, setLoading] = useState(false);

  const [resendLoading, setResendLoading] = useState(false);

  const [timer, setTimer] = useState(60);

  const inputs = useRef([]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .trim()
      .slice(0, 6);

    if (!/^\d+$/.test(pasted)) return;

    const arr = pasted.split("");

    while (arr.length < 6) {
      arr.push("");
    }

    setOtp(arr);

    const last = Math.min(arr.length - 1, 5);

    inputs.current[last]?.focus();
  };

  const finalOtp = otp.join("");

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (finalOtp.length !== 6) {
      return toast.error("Please enter a valid OTP");
    }

    try {
      setLoading(true);

      await axios.post("/verify-login-otp", {
        email,
        otp: finalOtp,
      });

      await login();

      toast.success("Login Successful 🎉");

      closeModal();

      navigate("/home");

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };
    const handleResendOtp = async () => {
    try {
      setResendLoading(true);

      await axios.post("/resend-login-otp", {
        email,
      });

      toast.success("OTP sent again 📩");

      setTimer(60);

      setOtp(["", "", "", "", "", ""]);

      inputs.current[0]?.focus();

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Unable to resend OTP"
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      onSubmit={handleVerifyOtp}
      className="w-full max-w-md"
    >
      <h2 className="text-4xl font-bold text-headingText">
        Verify Login OTP
      </h2>

      <p className="mt-2 text-bodyText">
        We've sent a verification code to
      </p>

      <p className="mt-1 font-semibold text-primary break-all">
        {email}
      </p>

      <div className="mt-8 flex justify-between gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            value={digit}
            maxLength={1}
            onPaste={handlePaste}
            onChange={(e) =>
              handleChange(e.target.value, index)
            }
            onKeyDown={(e) =>
              handleKeyDown(e, index)
            }
            className="w-12 h-14 rounded-xl border border-borderMain bg-cardBg text-center text-xl font-bold outline-none focus:ring-2 focus:ring-primary"
          />
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
        type="submit"
        className="mt-8 w-full rounded-xl bg-buttonPrimaryBg py-3 text-buttonPrimaryText font-semibold transition hover:bg-buttonPrimaryHoverBg disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </motion.button>

      <div className="mt-6 text-center">
        {timer > 0 ? (
          <p className="text-sm text-bodyText">
            Resend OTP in <span className="font-semibold">{timer}s</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendLoading}
            className="font-semibold text-primary hover:underline disabled:opacity-60"
          >
            {resendLoading ? "Sending..." : "Resend OTP"}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={openLogin}
        className="mt-5 w-full text-center text-primary hover:underline"
      >
        ← Back to Login
      </button>
    </motion.form>
  );
}