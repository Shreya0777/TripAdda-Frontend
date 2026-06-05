import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/verify-login-otp", {
        email,
        otp,
      });

      await login();

      toast.success("Login successful");
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-md rounded-2xl bg-cardBg p-6 shadow"
      >
        <h1 className="text-2xl font-bold text-headingText">
          Verify OTP
        </h1>

        <p className="mt-2 text-mutedText">
          Enter the OTP sent to {email}
        </p>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="mt-5 w-full rounded-xl border border-borderMain bg-inputBg px-4 py-3 text-inputText"
        />

        <button className="mt-5 w-full rounded-xl bg-buttonPrimaryBg px-5 py-3 text-inverseText">
          Verify & Login
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;