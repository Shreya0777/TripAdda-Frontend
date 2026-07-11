import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Aarav Sharma",
    location: "Delhi",
    review:
      "TripAdda made planning our Goa trip incredibly easy. Expense tracking and itinerary features saved us so much time.",
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Priya Singh",
    location: "Lucknow",
    review:
      "The collaborative planning feature is amazing. Everyone in our group stayed updated throughout the trip.",
    image: "https://i.pravatar.cc/150?img=32",
  },
  {
    name: "Rohan Verma",
    location: "Bengaluru",
    review:
      "Beautiful UI, smooth experience and everything was organized in one place. Highly recommended!",
    image: "https://i.pravatar.cc/150?img=15",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const card = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export default function Testimonials() {
  return (
    <section className="relative py-24 bg-sectionBg overflow-hidden">

      {/* Background Glow */}
      <div className="absolute -left-32 top-10 w-80 h-80 rounded-full bg-primary/10 blur-3xl"></div>
      <div className="absolute -right-32 bottom-0 w-96 h-96 rounded-full bg-accent/10 blur-3xl"></div>

      <div className="relative  mx-auto px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false }}
        >
          <h2 className="text-5xl font-bold text-center text-headingText">
            Loved by Travellers ❤️
          </h2>

          <p className="text-bodyText text-center mt-5 max-w-2xl mx-auto">
            Thousands of travellers trust TripAdda to organize unforgettable
            journeys.
          </p>
        </motion.div>

        {/* Cards */}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16"
        >
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              variants={card}
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden bg-cardBg border border-borderSoft rounded-3xl p-8 shadow-lg hover:shadow-2xl group"
            >
              {/* Glow */}

              <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition duration-500"></div>

              {/* Quote */}

              <FaQuoteLeft className="text-primary text-3xl mb-6 relative z-10" />

              {/* Stars */}

              <div className="flex gap-1 text-yellow-400 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>

              {/* Review */}

              <p className="mt-6 text-bodyText leading-8 relative z-10">
                "{item.review}"
              </p>

              {/* User */}

              <div className="flex items-center gap-4 mt-8 relative z-10">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                />

                <div>
                  <h3 className="font-bold text-headingText">
                    {item.name}
                  </h3>

                  <p className="text-mutedText text-sm">
                    {item.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

    </section>
  );
}