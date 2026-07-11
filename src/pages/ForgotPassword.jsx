import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      await axios.post("/forgot-password", {
        email,
      });

      toast.success("OTP Sent");

      navigate("/reset-password", {
        state: {
          email,
        },
      });
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-[420px] bg-cardBg rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold">Forgot Password</h2>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border rounded-xl p-3 mt-6"
        />

        <button
          onClick={sendOtp}
          className="w-full mt-5 bg-primary text-white rounded-xl p-3"
        >
          Send OTP
        </button>
      </div>
    </div>
  );
}
