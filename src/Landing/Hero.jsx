import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthModal } from "../context/AuthModalContext";

export default function Hero() {
  const { openLogin, openSignup } = useAuthModal();
  return (
    <section className="relative overflow-hidden bg-pageBg">
      {/* Background Blur Circle */}

      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-accent/10 blur-3xl"></div>

      <div className=" mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[85vh]">
          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
              ✈ Smart Travel Planning
            </span>

            <h1 className="mt-6 text-5xl lg:text-6xl font-extrabold leading-tight text-headingText">
              Plan Trips
              <span className="text-primary"> Together</span>
              <br />
              Without The Chaos
            </h1>

            <p className="mt-7 text-bodyText text-xl leading-9 max-w-xl">
              Create itineraries, invite friends, manage expenses and keep every
              travel memory in one beautiful place.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <button
                onClick={openSignup}
                className="bg-buttonPrimaryBg hover:bg-buttonPrimaryHoverBg text-buttonPrimaryText px-7 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Get Started
              </button>

              <button
                onClick={openLogin}
                className="border-2 border-primary text-primary px-7 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-hoverBg"
              >
                Login
              </button>
            </div>
          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            className="relative flex justify-center"
          >
            <motion.img
              animate={{ y: [0, -12, 0] }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
              }}
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80"
              alt="Travel"
              className="rounded-[32px] shadow-2xl w-full max-w-[580px] object-cover"
            />

            {/* Floating Card */}

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 4,
              }}
              className="absolute top-8 left-12 bg-cardBg shadow-xl rounded-2xl px-6 py-4 border border-borderSoft"
            >
              🌍 Find your Destinations
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 5,
              }}
              className="absolute bottom-8 right-12 bg-cardBg shadow-xl rounded-2xl px-4 py-2 border border-borderSoft"
            >
              ⭐ Happy Travellers
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
