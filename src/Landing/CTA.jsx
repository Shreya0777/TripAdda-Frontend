import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPlaneDeparture } from "react-icons/fa";

export default function CTA() {
  return (
    <section className="relative py-28 overflow-hidden bg-pageBg">

      {/* Background Glow */}

      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl"></div>

      <div className="absolute -bottom-24 -right-20 w-96 h-96 rounded-full bg-accent/10 blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative max-w-5xl mx-auto overflow-hidden rounded-[32px] bg-buttonPrimaryBg text-buttonPrimaryText p-16 text-center shadow-2xl"
      >
        {/* Floating Plane */}

        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
            rotate: [0, 8, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
          className="absolute top-8 right-10 text-4xl opacity-20"
        >
          <FaPlaneDeparture />
        </motion.div>

        {/* Heading */}

        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-4xl lg:text-5xl font-bold leading-tight"
        >
          Ready For Your Next Adventure?
        </motion.h2>

        {/* Description */}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-6 text-lg opacity-90 max-w-2xl mx-auto"
        >
          Start planning unforgettable journeys with your friends,
          manage expenses and create memories together.
        </motion.p>

        {/* Button */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <Link
            to="/signup"
            className="inline-flex items-center gap-3 bg-cardBg text-primary px-8 py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            Create Free Account ✈️
          </Link>
        </motion.div>

        {/* Bottom Decorative Dots */}

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 opacity-30">
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <div className="w-2 h-2 rounded-full bg-white"></div>
        </div>

      </motion.div>

    </section>
  );
}