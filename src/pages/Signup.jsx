import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username,setusername]= useState("");
  const [agree, setAgree] = useState(false);


  const { login } = useAuth();
  const navigate = useNavigate();

  // ✅ VALIDATION FUNCTION
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

  // ✅ SIGNUP HANDLER
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
    <div className="min-h-screen flex">

      {/* LEFT IMAGE SECTION */}
      <div className="hidden md:flex w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="travel"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-10 text-white">
          <h1 className="text-xl font-semibold">HelloTrips</h1>

          <div>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
              NEW HORIZON
            </span>

            <h2 className="text-4xl font-bold mt-4 leading-tight">
              Curate your next <br /> great escape.
            </h2>

            <p className="mt-3 text-sm opacity-80 max-w-sm">
              Join a global community of digital curators discovering the world’s most intentional destinations.
            </p>
          </div>

          <p className="text-sm opacity-80">
            12k+ curators joined this week
          </p>
        </div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-6">
        <form
          onSubmit={handleSignup}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md"
        >
          <h2 className="text-3xl font-bold text-gray-800">
            Join HelloTrips
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Begin your journey into curated travel experiences.
          </p>

          {/* GOOGLE BUTTON UI */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 mb-4 hover:bg-gray-100 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          {/* OR */}
          <div className="flex items-center gap-3 my-4">
            <hr className="flex-1 border-gray-300" />
            <span className="text-gray-400 text-sm">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* NAME */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {/* username*/}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e)=>setusername(e.target.value)}
             className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* TERMS */}
          <div className="flex items-start gap-2 mb-3">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="mt-1"
            />
            <p className="text-sm text-gray-600">
              I agree to the{" "}
              <span className="text-blue-600 cursor-pointer">Terms of Service</span>{" "}
              and{" "}
              <span className="text-blue-600 cursor-pointer">Privacy Policy</span>
            </p>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Create Account
          </button>

          {/* LOGIN LINK */}
          <p className="text-center mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 font-medium cursor-pointer hover:underline"
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