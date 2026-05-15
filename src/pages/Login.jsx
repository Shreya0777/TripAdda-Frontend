import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return false;
    }

    if (!password) {
      toast.error("Password is required");
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await axios.post("/login", { email, password });

      toast.success("Login successful 🎉");
      login(res.data);
      navigate("/home");
      window.location.reload();
    } catch (err) {
      const message = err.response?.data?.message;

      if (message === "Invalid credentials") {
        toast.error("Incorrect email or password");
      } else if (message === "User not found") {
        toast.error("User not found. Please signup.");
      } else {
        toast.error(message || "Login failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="travel"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-overlaySoft flex flex-col justify-end p-10 text-white">
          <h1 className="text-3xl font-bold leading-tight">
            "The real voyage of discovery consists not in seeking new landscapes,
            but in having new eyes."
          </h1>
          <p className="mt-3 text-sm opacity-80">— Marcel Proust</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-pageBg px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-cardBg p-8 rounded-2xl shadow-md"
        >
          <h2 className="text-3xl font-bold text-headingText mb-2">
            Welcome back
          </h2>

          <p className="text-mutedText mb-6 text-sm">
            Sign in to access your curated travel journal and expert guides.
          </p>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-borderMain rounded-lg py-2 mb-4 hover:bg-hoverBg transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-4">
            <hr className="flex-1 border-borderMain" />
            <span className="text-softText text-sm">OR</span>
            <hr className="flex-1 border-borderMain" />
          </div>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-3 border border-borderMain rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryFocus"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-3 border border-borderMain rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryFocus"
          />

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primaryHover transition"
          >
            Sign In
          </button>

          <p className="text-center mt-4 text-sm text-bodyText">
            New to HelloTrips?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-primary font-medium cursor-pointer hover:underline"
            >
              Create an Account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;