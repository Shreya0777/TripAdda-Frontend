import { motion, AnimatePresence } from "framer-motion";
import { useAuthModal } from "../../context/AuthModalContext";
import { useEffect } from "react";

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import LeftPanel from "./LeftPanel";

export default function AuthModal() {
  const {
    open,
    mode,
    closeModal,
  } = useAuthModal();

  // ESC key close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") closeModal();
    };

    if (open) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <AnimatePresence>

      {open && (

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
              y: 40,
              scale: .9,
            }}

            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}

            exit={{
              opacity: 0,
              y: 40,
              scale: .9,
            }}

            transition={{
              duration: .35
            }}

            onClick={(e)=>e.stopPropagation()}

            className="relative

            bg-cardBg

            rounded-[32px]

            overflow-hidden

            shadow-2xl

            w-full

            max-w-6xl

            min-h-[700px]

            grid

            lg:grid-cols-2"

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

            <div className="flex items-center justify-center p-8 lg:p-12">

              {mode === "login" ? (
                <LoginForm />
              ) : (
                <SignupForm />
              )}

            </div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>
  );
}