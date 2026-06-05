import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("");
  const [agree, setAgree] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const checkUsername = async (value) => {
    if (!value.trim()) {
      setUsernameStatus("");
      return;
    }

    try {
      const res = await axios.get(`/check-username/${value.trim()}`);

      if (!res.data.available) {
        setUsernameStatus("Username already exists");
      } else {
        setUsernameStatus("Username available ✓");
      }
    } catch (err) {
      console.log(err);
      setUsernameStatus("");
    }
  };

  const validate = () => {
    if (!name.trim()) {
      toast.error("Full name is required");
      return false;
    }

    if (!username.trim()) {
      toast.error("Username is required");
      return false;
    }

    if (usernameStatus === "Username already exists") {
      toast.error("Please choose another username");
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
      } else if (message === "Username already exists") {
        setUsernameStatus("Username already exists");
        toast.error("Username already exists");
      } else {
        toast.error(message || "Signup failed");
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="travel"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-darkBg/40 flex flex-col justify-between p-10 text-inverseText">
          <h1 className="text-xl font-semibold">TripAdda</h1>

          <div>
            <span className="text-xs bg-cardBg/20 px-3 py-1 rounded-full">
              NEW HORIZON
            </span>

            <h2 className="text-4xl font-bold mt-4 leading-tight">
              Curate your next <br /> great escape.
            </h2>

            <p className="mt-3 text-sm opacity-80 max-w-sm">
              Join a global community of digital curators discovering the
              world’s most intentional destinations.
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-pageBg px-3 py-8 sm:px-6 md:w-1/2">
        <form
          onSubmit={handleSignup}
          className="w-full max-w-md rounded-2xl bg-cardBg p-5 shadow-md sm:p-8"
        >
          <h2 className="text-2xl font-bold text-headingText sm:text-3xl">
            Join HelloTrips
          </h2>

          <p className="text-mutedText text-sm mb-6">
            Begin your journey into curated travel experiences.
          </p>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-borderMain bg-cardBg text-bodyText rounded-lg py-2 mb-4 hover:bg-hoverBg transition font-medium"
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
            }}
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
            <span className="text-lightText text-sm">OR</span>
            <hr className="flex-1 border-borderMain" />
          </div>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 mb-3 border border-borderMain rounded-lg bg-cardBg text-inputText placeholder:text-lightText focus:outline-none focus:ring-2 focus:ring-focusRingSoft"
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameStatus("");
            }}
            onBlur={(e) => checkUsername(e.target.value)}
            className={`w-full px-4 py-2 mb-3 border border-borderMain rounded-lg bg-cardBg text-inputText placeholder:text-lightText focus:outline-none focus:ring-2 focus:ring-focusRingSoft ${
              usernameStatus === "Username already exists"
                ? "border-red-500"
                : "border-borderMain"
            }`}
          />

          {usernameStatus && (
            <p
              className={`mt-1 mb-3 text-sm ${
                usernameStatus.includes("available")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {usernameStatus}
            </p>
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-3 border border-borderMain rounded-lg bg-cardBg text-inputText placeholder:text-lightText focus:outline-none focus:ring-2 focus:ring-focusRingSoft"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-3 border border-borderMain rounded-lg bg-cardBg text-inputText placeholder:text-lightText focus:outline-none focus:ring-2 focus:ring-focusRingSoft"
          />

          <div className="flex items-start gap-2 mb-3">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="mt-1"
            />

            <p className="text-sm text-bodyText">
              I agree to the{" "}
              <span className="text-linkText cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-linkText cursor-pointer">
                Privacy Policy
              </span>
            </p>
          </div>

          <button
            type="submit"
            disabled={usernameStatus === "Username already exists"}
            className="w-full py-2 rounded-lg bg-buttonPrimaryBg text-inverseText font-semibold hover:bg-buttonPrimaryHoverBg transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            Create Account
          </button>

          <p className="text-center mt-4 text-sm text-bodyText">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-linkText font-medium cursor-pointer hover:underline"
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