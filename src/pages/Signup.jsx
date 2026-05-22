import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setusername] = useState("");
  const [agree, setAgree] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // VALIDATION
  const validate = () => {
    if (!name.trim()) {
      toast.error("Full name is required");
      return false;
    }

    if (!username.trim()) {
      toast.error("Username is required");
      return false;
    }

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

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be 8+ chars with uppercase, lowercase, number & special character"
      );
      return false;
    }

    if (!agree) {
      toast.error("Please accept Terms & Conditions");
      return false;
    }

    return true;
  };

  // SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await axios.post("/signup", {
        name,
        username,
        email,
        password,
      });

      toast.success("Account created successfully 🎉");

      login(res.data);

      navigate("/home");

      window.location.reload();
    } catch (err) {
      const message = err.response?.data?.message;

      if (message === "User already exists") {
        toast.error("User already exists. Please login.");
      } else {
        toast.error(message || "Signup failed");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* LEFT IMAGE */}
      <div className="relative hidden w-1/2 md:flex">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="travel"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 flex flex-col justify-between bg-black/40 p-10 text-white">
          <h1 className="text-xl font-semibold">TripAdda</h1>

          <div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
              NEW HORIZON
            </span>

            <h2 className="mt-4 text-4xl font-bold leading-tight">
              Curate your next <br /> great escape.
            </h2>

            <p className="mt-3 max-w-sm text-sm opacity-80">
              Join a global community of digital curators discovering the
              world’s most intentional destinations.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="flex w-full items-center justify-center px-4 py-8 sm:px-6 md:w-1/2">
        <form
          onSubmit={handleSignup}
          className="w-full max-w-md rounded-2xl bg-white p-5 shadow-md sm:p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Join TripAdda
          </h2>

          <p className="mb-6 mt-2 text-sm text-gray-500">
            Begin your journey into curated travel experiences.
          </p>

          {/* GOOGLE BUTTON */}
          <button
            type="button"
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-2 font-medium text-gray-800 transition hover:bg-gray-100"
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_API_URL}/google`;
            }}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="h-5 w-5"
            />

            Continue with Google
          </button>

          {/* OR */}
          <div className="my-4 flex items-center gap-3">
            <hr className="flex-1 border-gray-300" />

            <span className="text-sm text-gray-400">OR</span>

            <hr className="flex-1 border-gray-300" />
          </div>

          {/* FULL NAME */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* USERNAME */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            className="mb-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* TERMS */}
          <div className="mb-4 flex items-start gap-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="mt-1"
            />

            <p className="text-sm text-gray-600">
              I agree to the{" "}
              <span className="cursor-pointer text-blue-600">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="cursor-pointer text-blue-600">
                Privacy Policy
              </span>
            </p>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Create Account
          </button>

          {/* LOGIN */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="cursor-pointer font-medium text-blue-600 hover:underline"
            >
              Sign In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;