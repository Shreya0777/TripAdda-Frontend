import { motion, AnimatePresence } from "framer-motion";
import { useAuthModal } from "../../context/AuthModalContext";
import { useEffect } from "react";

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import LeftPanel from "./LeftPanel";

export default function AuthModal() {
  const { isOpen, mode, closeModal } = useAuthModal();

  // ESC key close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") closeModal();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999]
          bg-black/60 backdrop-blur-md
          flex justify-center items-center
          p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 40,
              scale: 0.9,
            }}
            transition={{
              duration: 0.35,
            }}
            onClick={(e) => e.stopPropagation()}
            className="
                relative
             bg-cardBg
              rounded-[28px]
              overflow-hidden
              shadow-2xl
              w-full
              max-w-5xl
              h-[620px]
              grid
           lg:grid-cols-[42%_58%]"
          >
            {/* Close */}

            <button
              onClick={closeModal}
              className="absolute

              right-6

              top-5

              text-3xl

              text-mutedText

              hover:text-headingText

              transition"
            >
              ×
            </button>

            {/* Left */}

            <LeftPanel />

            {/* Right */}

            <div
  className="
  h-[620px]
  overflow-y-auto
  px-8
  py-8
  scrollbar-thin
  scrollbar-thumb-gray-300
  scrollbar-track-transparent
  "
>
  <div className="min-h-full flex items-center justify-center">
    {mode === "login" ? <LoginForm /> : <SignupForm />}
  </div>
</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
