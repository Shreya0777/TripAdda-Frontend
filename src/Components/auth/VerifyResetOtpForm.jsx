import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "../../api/axios";
import { useAuthModal } from "../../context/AuthModalContext";

export default function VerifyResetOtpForm() {
  const {
    email,
    setOtp,
    openResetPassword,
    openForgotPassword,
  } = useAuthModal();

  const [otp, setOtpInput] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [loading, setLoading] = useState(false);

  const inputs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtpInput(newOtp);

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

    setOtpInput(arr);

    const last = Math.min(arr.length - 1, 5);
    inputs.current[last]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      return toast.error("Please enter a valid OTP");
    }

    try {
      setLoading(true);

      await axios.post("/verify-reset-otp", {
        email,
        otp: finalOtp,
      });

      // Save OTP globally for ResetPasswordForm
      setOtp(finalOtp);

      toast.success("OTP verified successfully ✅");

      openResetPassword();

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "OTP verification failed"
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
        Verify OTP
      </h2>

      <p className="mt-2 text-bodyText">
        Enter the verification code sent to
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
            className="
              w-12
              h-14
              rounded-xl
              border
              border-borderMain
              bg-cardBg
              text-center
              text-xl
              font-bold
              outline-none
              focus:ring-2
              focus:ring-primary
            "
          />
        ))}
      </div>

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
        {loading ? "Verifying..." : "Verify OTP"}
      </motion.button>

      <button
        type="button"
        onClick={openForgotPassword}
        className="
          mt-6
          w-full
          text-center
          text-primary
          hover:underline
        "
      >
        ← Change Email
      </button>
    </motion.form>
  );
}