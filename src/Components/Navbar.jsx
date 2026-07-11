import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthModal } from "../context/AuthModalContext";
import { HiOutlineMenuAlt3, HiOutlineBell, HiOutlineCog } from "react-icons/hi";


const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openLogin, openSignup } = useAuthModal();

  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-primary font-semibold"
      : "text-bodyText hover:text-primary transition-colors";

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 transition-all duration-500

      ${
        scrolled
          ? "bg-cardBg/80 backdrop-blur-xl border-b border-borderSoft shadow-lg"
          : "bg-cardBg"
      }`}
    >
      <div className=" mx-auto px-5 lg:px-8">
        <div className="h-20 flex justify-between items-center">
          {/* Logo */}

          <motion.div
            whileHover={{
              scale: 1.05,
              rotate: -2,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={() => navigate("/home")}
            className="cursor-pointer flex items-center gap-2"
          >
            <div className="w-11 h-11 rounded-xl bg-primary text-buttonPrimaryText flex justify-center items-center font-bold text-xl shadow-lg">
              ✈
            </div>

            <div>
              <h2 className="font-bold text-2xl text-headingText">
                Trip
                <span className="text-primary">Adda</span>
              </h2>

              <p className="text-xs text-mutedText -mt-1">Travel Together</p>
            </div>
          </motion.div>

          {/* Desktop Links */}

          <div className="hidden lg:flex items-center gap-10">
            <NavLink to="/home">
              {({ isActive }) => (
                <motion.div
                  whileHover={{ y: -2 }}
                  className={`relative pb-1 font-medium

                  ${
                    isActive
                      ? "text-primary"
                      : "text-bodyText hover:text-primary"
                  }`}
                >
                  Home
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-0 right-0 -bottom-1 h-[2px] bg-primary rounded-full"
                    />
                  )}
                </motion.div>
              )}
            </NavLink>

            <NavLink to="/create-trip">
              {({ isActive }) => (
                <motion.div
                  whileHover={{ y: -2 }}
                  className={`relative pb-1 font-medium

                  ${
                    isActive
                      ? "text-primary"
                      : "text-bodyText hover:text-primary"
                  }`}
                >
                  Create Trip
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-0 right-0 -bottom-1 h-[2px] bg-primary rounded-full"
                    />
                  )}
                </motion.div>
              )}
            </NavLink>

            <NavLink to="/my-trips">
              {({ isActive }) => (
                <motion.div
                  whileHover={{ y: -2 }}
                  className={`relative pb-1 font-medium

                  ${
                    isActive
                      ? "text-primary"
                      : "text-bodyText hover:text-primary"
                  }`}
                >
                  My Trips
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-0 right-0 -bottom-1 h-[2px] bg-primary rounded-full"
                    />
                  )}
                </motion.div>
              )}
            </NavLink>
          </div>

          {/* Right Side */}

          <div className="hidden lg:flex items-center gap-5">
            {user ? (
              <div
                className="flex items-center gap-5 relative"
                ref={dropdownRef}
              >
                <motion.div
                  whileHover={{
                    scale: 1.15,
                  }}
                  className="cursor-pointer text-xl text-bodyText"
                >
                  <HiOutlineBell />
                </motion.div>

                <motion.div
                  whileHover={{
                    scale: 1.15,
                  }}
                  className="cursor-pointer text-xl text-bodyText"
                >
                  <HiOutlineCog />
                </motion.div>

                <motion.div
                  whileTap={{
                    scale: 0.95,
                  }}
                  whileHover={{
                    scale: 1.08,
                  }}
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="cursor-pointer"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt=""
                      className="w-11 h-11 rounded-full object-cover border-2 border-primary"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-primary text-buttonPrimaryText flex justify-center items-center font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </motion.div>

                {/* Profile Dropdown */}

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0.9,
                        y: -10,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.9,
                        y: -10,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className="absolute right-0 top-16 w-64 bg-cardBg border border-borderSoft rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <div className="px-5 py-4 border-b border-borderSoft">
                        <p className="font-semibold text-headingText">
                          {user.name}
                        </p>

                        <p className="text-sm text-mutedText truncate mt-1">
                          {user.email}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          navigate("/profile");
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-5 py-3 hover:bg-hoverBg transition"
                      >
                        👤 My Profile
                      </button>

                      <button
                        onClick={() => {
                          navigate("/create-trip");
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-5 py-3 hover:bg-hoverBg transition"
                      >
                        ✈ Create Trip
                      </button>

                      <button
                        onClick={() => {
                          navigate("/my-trips");
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-5 py-3 hover:bg-hoverBg transition"
                      >
                        🧳 My Trips
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-5 py-3 text-dangerText hover:bg-hoverBg transition"
                      >
                        🚪 Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={() => navigate("/signup")}
                className="bg-buttonPrimaryBg hover:bg-buttonPrimaryHoverBg text-buttonPrimaryText px-6 py-3 rounded-full shadow-lg font-medium transition"
              >
                Get Started
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-3xl text-headingText"
          >
            <HiOutlineMenuAlt3 />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="overflow-hidden lg:hidden bg-cardBg border-t border-borderSoft"
          >
            <div className="px-6 py-5 flex flex-col gap-5">
              <NavLink
                to="/home"
                onClick={() => setMobileOpen(false)}
                className={linkClass}
              >
                Home
              </NavLink>

              <NavLink
                to="/create-trip"
                onClick={() => setMobileOpen(false)}
                className={linkClass}
              >
                Create Trip
              </NavLink>

              <NavLink
                to="/my-trips"
                onClick={() => setMobileOpen(false)}
                className={linkClass}
              >
                My Trips
              </NavLink>

              {user ? (
                <>
                  <NavLink
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className={linkClass}
                  >
                    Profile
                  </NavLink>

                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="text-left text-dangerText"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <motion.button
                  whileTap={{
                    scale: 0.95,
                  }}
                  whileHover={{
                    scale: 1.03,
                  }}
                  onClick={() => {
                    openLogin();;
                    setMobileOpen(false);
                  }}
                  className="bg-buttonPrimaryBg text-buttonPrimaryText rounded-full py-3"
                >
                  Get Started
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
