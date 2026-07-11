import { useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAuthModal } from "../../context/AuthModalContext";

export default function SignupForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    switchToLogin,
    closeModal,
  } = useAuthModal();

  const [name, setName] = useState("");

  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);

  const [usernameStatus, setUsernameStatus] = useState("");

  const checkUsername = async (value) => {
    if (!value.trim()) {
      setUsernameStatus("");
      return;
    }

    try {
      const res = await axios.get(
        `/check-username/${value.trim()}`
      );

      if (res.data.available) {
        setUsernameStatus("Username available ✓");
      } else {
        setUsernameStatus("Username already exists");
      }
    } catch (err) {
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

    if (
      usernameStatus ===
      "Username already exists"
    ) {
      toast.error("Choose another username");
      return false;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Invalid email");
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
        "Password must contain uppercase, lowercase, number & special character."
      );
      return false;
    }

    if (!agree) {
      toast.error(
        "Please accept Terms & Conditions"
      );
      return false;
    }

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await axios.post("/signup", {
        name,
        username,
        email,
        password,
      });

      toast.success("Account created 🎉");

      login(res.data);

      closeModal();

      navigate("/home");

      window.location.reload();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (typeof err.response?.data === "string"
          ? err.response.data
          : "") ||
        "Signup failed";

      if (
        message.includes("User already exists")
      ) {
        toast.error(
          "User already exists. Please login."
        );
      } else if (
        message.includes(
          "Username already exists"
        )
      ) {
        setUsernameStatus(
          "Username already exists"
        );

        toast.error(
          "Username already exists"
        );
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSignup}
      initial={{
        opacity: 0,
        x: 30,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: .4,
      }}
      className="w-full max-w-md"
    >

      <h2 className="text-4xl font-bold text-headingText">
        Create Account
      </h2>

      <p className="mt-2 text-bodyText">
        Join TripAdda and start planning amazing journeys.
      </p>

      <button
        type="button"
        onClick={() => {
          window.location.href =
            `${import.meta.env.VITE_API_URL}/auth/google`;
        }}
        className="mt-8 w-full rounded-xl border border-borderMain bg-cardBg py-3 flex justify-center items-center gap-3 hover:bg-hoverBg transition"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          className="w-5 h-5"
          alt=""
        />

        Continue with Google
      </button>

      <div className="flex items-center gap-3 my-6">
        <hr className="flex-1 border-borderMain" />
        <span className="text-mutedText text-sm">
          OR
        </span>
        <hr className="flex-1 border-borderMain" />
      </div>
            <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 w-full rounded-xl border border-borderMain bg-cardBg px-4 py-3 outline-none transition focus:ring-2 focus:ring-primary"
      />

      <div className="mb-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setUsernameStatus("");
          }}
          onBlur={(e) => checkUsername(e.target.value)}
          className={`w-full rounded-xl px-4 py-3 border bg-cardBg outline-none transition focus:ring-2 focus:ring-primary
          ${
            usernameStatus === "Username already exists"
              ? "border-red-500"
              : "border-borderMain"
          }`}
        />

        {usernameStatus && (
          <p
            className={`mt-2 text-sm ${
              usernameStatus.includes("available")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {usernameStatus}
          </p>
        )}
      </div>

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 w-full rounded-xl border border-borderMain bg-cardBg px-4 py-3 outline-none transition focus:ring-2 focus:ring-primary"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 w-full rounded-xl border border-borderMain bg-cardBg px-4 py-3 outline-none transition focus:ring-2 focus:ring-primary"
      />

      <label className="mb-6 flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agree}
          onChange={() => setAgree(!agree)}
          className="mt-1 accent-primary"
        />

        <span className="text-sm text-bodyText leading-6">
          I agree to the{" "}
          <span className="font-semibold text-primary cursor-pointer hover:underline">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="font-semibold text-primary cursor-pointer hover:underline">
            Privacy Policy
          </span>
        </span>
      </label>

      <motion.button
        whileHover={{
          scale: 1.02,
        }}
        whileTap={{
          scale: 0.98,
        }}
        disabled={
          loading ||
          usernameStatus === "Username already exists"
        }
        type="submit"
        className="w-full rounded-xl bg-buttonPrimaryBg py-3 text-buttonPrimaryText font-semibold transition hover:bg-buttonPrimaryHoverBg disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </motion.button>

      <p className="mt-6 text-center text-sm text-bodyText">
        Already have an account?{" "}
        <button
          type="button"
          onClick={switchToLogin}
          className="font-semibold text-primary hover:underline"
        >
          Sign In
        </button>
      </p>

    </motion.form>
  );
}