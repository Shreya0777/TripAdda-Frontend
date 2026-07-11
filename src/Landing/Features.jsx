import {
  FaMapMarkedAlt,
  FaUsers,
  FaWallet,
  FaCamera,
} from "react-icons/fa";
import { motion } from "framer-motion";

const features = [
  {
    icon: <FaMapMarkedAlt size={35} />,
    title: "Trip Planner",
    desc: "Plan complete itineraries with smart scheduling and route planning.",
  },
  {
    icon: <FaUsers size={35} />,
    title: "Group Trips",
    desc: "Invite friends, collaborate together and plan memorable adventures.",
  },
  {
    icon: <FaWallet size={35} />,
    title: "Expense Tracker",
    desc: "Split expenses fairly and keep everyone's budget organized.",
  },
  {
    icon: <FaCamera size={35} />,
    title: "Travel Memories",
    desc: "Capture beautiful moments and revisit them anytime.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export default function Features() {
  return (
    <section className="relative py-24 overflow-hidden bg-sectionBg">

      {/* Background Blur */}
      <div className="absolute -left-40 top-10 w-96 h-96 rounded-full bg-primary/10 blur-3xl"></div>

      <div className="absolute -right-40 bottom-0 w-[450px] h-[450px] rounded-full bg-accent/10 blur-3xl"></div>

      <div className="relative mx-auto px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false }}
        >
          <h2 className="text-5xl font-bold text-center text-headingText">
            Everything You Need
          </h2>

          <p className="text-bodyText text-center mt-5 max-w-2xl mx-auto text-lg">
            Everything required to make your trip planning simple,
            collaborative and memorable.
          </p>
        </motion.div>

        {/* Cards */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20"
        >
          {features.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -12,
                scale: 1.04,
              }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden bg-cardBg rounded-3xl p-8 border border-borderSoft shadow-lg hover:shadow-2xl group cursor-pointer"
            >
              {/* Gradient Glow */}

              <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

              {/* Icon */}

              <motion.div
                whileHover={{
                  rotate: 10,
                  scale: 1.15,
                }}
                transition={{ duration: 0.3 }}
                className="relative z-10 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"
              >
                {item.icon}
              </motion.div>

              {/* Title */}

              <h3 className="relative z-10 mt-6 text-2xl font-bold text-headingText">
                {item.title}
              </h3>

              {/* Description */}

              <p className="relative z-10 mt-4 text-bodyText leading-7">
                {item.desc}
              </p>

              {/* Animated Line */}

              <motion.div
                className="relative z-10 h-1 bg-primary rounded-full mt-6 origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4 }}
              />

              {/* Learn More */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: -15,
                }}
                whileHover={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{ duration: 0.3 }}
                className="relative z-10 mt-5 text-primary font-semibold"
              >
                Learn More →
              </motion.div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}