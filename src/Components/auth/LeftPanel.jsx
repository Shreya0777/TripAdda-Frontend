import { motion } from "framer-motion";
import {
  FaPlaneDeparture,
  FaUsers,
  FaWallet,
  FaMapMarkedAlt,
} from "react-icons/fa";

const benefits = [
  {
    icon: <FaPlaneDeparture />,
    title: "Smart Trip Planning",
    desc: "Create beautiful itineraries in minutes.",
  },
  {
    icon: <FaUsers />,
    title: "Group Collaboration",
    desc: "Invite friends and plan together.",
  },
  {
    icon: <FaWallet />,
    title: "Expense Split",
    desc: "Track and split trip expenses easily.",
  },
  {
    icon: <FaMapMarkedAlt />,
    title: "Travel Memories",
    desc: "Keep all your memories organized forever.",
  },
];

export default function LeftPanel() {
  return (
    <div className="relative hidden lg:flex overflow-hidden bg-gradient-to-br from-primary via-primaryHover to-blue-900 p-10 text-white">

      {/* Background Glow */}
      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

      <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>

      {/* Floating Plane */}

      <motion.div
        animate={{
          y: [-10, 10, -10],
          rotate: [-8, 8, -8],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
        }}
        className="absolute right-12 top-10 text-7xl opacity-20"
      >
        ✈️
      </motion.div>

      <div className="relative z-10 flex w-full flex-col">

        <span className="rounded-full bg-white/20 px-4 py-1 text-sm w-fit">
          Welcome to
        </span>

        <h1 className="mt-4 text-5xl font-bold">
          TripAdda
        </h1>

        <p className="mt-5 max-w-md text-white/90 leading-7">
          Plan smarter, travel better and create unforgettable memories with
          your friends — all in one place.
        </p>

        <div className="mt-12 space-y-5">

          {benefits.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{
                x: 8,
                scale: 1.02,
              }}
              transition={{
                duration: 0.25,
              }}
              className="flex items-start gap-4 rounded-2xl bg-white/10 p-5 backdrop-blur-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-primary text-xl shadow-lg">
                {item.icon}
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-white/80 leading-6">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}

        </div>

        {/* Bottom Card */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.6,
          }}
          className="mt-auto rounded-3xl bg-white p-6 text-headingText shadow-xl"
        >
          <h3 className="text-2xl font-bold">
            ✨ Join 10,000+ Travellers
          </h3>

          <p className="mt-2 text-bodyText">
            Discover destinations, manage trips and collaborate effortlessly.
          </p>
        </motion.div>

      </div>
    </div>
  );
}