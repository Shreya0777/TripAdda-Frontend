import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../context/AuthModalContext";

import {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  HiOutlineMenuAlt3,
  HiOutlineBell,
  HiOutlineCog,
} from "react-icons/hi";

const Navbar = () => {

  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const {
    openLogin,
    openSignup,
  } = useAuthModal();

  const [profileOpen, setProfileOpen] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);

  // ----------------------------
  // Logout
  // ----------------------------

  const handleLogout = async () => {
    await logout();

    setProfileOpen(false);
    setMobileOpen(false);

    navigate("/");

    setTimeout(() => {
      openLogin();
    }, 200);
  };

  // ----------------------------
  // Close dropdown outside click
  // ----------------------------

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  // ----------------------------
  // Navbar Blur on Scroll
  // ----------------------------

  useEffect(() => {

    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-primary font-semibold"
      : "text-bodyText hover:text-primary transition-colors";

  return (

    <motion.nav

      initial={{ y: -70 }}

      animate={{ y: 0 }}

      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}

      className={`

      sticky
      top-0
      z-50
      transition-all
      duration-500

      ${
        scrolled
          ? "bg-cardBg/80 backdrop-blur-xl shadow-lg border-b border-borderSoft"
          : "bg-cardBg"
      }

      `}
    >

      <div className=" mx-auto px-5 lg:px-8">

        <div className="h-20 flex items-center justify-between">

          {/* Logo */}

          <motion.div

            whileHover={{
              scale: 1.05,
              rotate: -2,
            }}

            whileTap={{
              scale: 0.95,
            }}

            onClick={() => navigate("/")}

            className="cursor-pointer flex items-center gap-3"

          >

            <div
              className="
              w-11
              h-11
              rounded-xl
              bg-primary
              text-white
              flex
              items-center
              justify-center
              text-xl
              shadow-lg
              "
            >
              ✈
            </div>

            <div>

              <h2 className="text-2xl font-bold text-headingText">

                Trip
                <span className="text-primary">
                  Adda
                </span>

              </h2>

              <p className="text-xs text-mutedText -mt-1">
                Travel Together
              </p>

            </div>

          </motion.div>
                    {/* Desktop Navigation */}

          <div className="hidden lg:flex items-center gap-10">

            <NavLink to="/home">
              {({ isActive }) => (
                <motion.div
                  whileHover={{ y: -2 }}
                  className={`relative pb-1 font-medium transition-colors

                  ${
                    isActive
                      ? "text-primary"
                      : "text-bodyText hover:text-primary"
                  }`}
                >
                  Home

                  {isActive && (
                    <motion.div
                      layoutId="navbarUnderline"
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
                  className={`relative pb-1 font-medium transition-colors

                  ${
                    isActive
                      ? "text-primary"
                      : "text-bodyText hover:text-primary"
                  }`}
                >
                  Create Trip

                  {isActive && (
                    <motion.div
                      layoutId="navbarUnderline"
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
                  className={`relative pb-1 font-medium transition-colors

                  ${
                    isActive
                      ? "text-primary"
                      : "text-bodyText hover:text-primary"
                  }`}
                >
                  My Trips

                  {isActive && (
                    <motion.div
                      layoutId="navbarUnderline"
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
                className="relative flex items-center gap-5"
                ref={dropdownRef}
              >

                {/* Bell */}

                <motion.button
                  whileHover={{
                    scale: 1.15,
                    rotate: -8,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  className="text-2xl text-bodyText hover:text-primary transition"
                >
                  <HiOutlineBell />
                </motion.button>

                {/* Settings */}

                <motion.button
                  whileHover={{
                    scale: 1.15,
                    rotate: 90,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  transition={{
                    duration: .25,
                  }}
                  className="text-2xl text-bodyText hover:text-primary transition"
                >
                  <HiOutlineCog />
                </motion.button>

                {/* Avatar */}

                <motion.div

                  whileHover={{
                    scale: 1.08,
                  }}

                  whileTap={{
                    scale: .95,
                  }}

                  onClick={() =>
                    setProfileOpen(!profileOpen)
                  }

                  className="cursor-pointer"

                >

                  {user.photoURL ? (

                    <img
                      src={user.photoURL}
                      alt="profile"
                      className="w-11 h-11 rounded-full object-cover border-2 border-primary shadow-md"
                    />

                  ) : (

                    <div
                      className="
                      w-11
                      h-11
                      rounded-full
                      bg-primary
                      text-white
                      flex
                      justify-center
                      items-center
                      font-bold
                      shadow-md
                      "
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </div>

                  )}

                </motion.div>

                {/* Dropdown */}

                <AnimatePresence>

                  {profileOpen && (

                    <motion.div

                      initial={{
                        opacity: 0,
                        scale: .95,
                        y: -15,
                      }}

                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                      }}

                      exit={{
                        opacity: 0,
                        scale: .95,
                        y: -15,
                      }}

                      transition={{
                        duration: .2,
                      }}

                      className="
                      absolute
                      right-0
                      top-16
                      w-64
                      bg-cardBg
                      border
                      border-borderSoft
                      rounded-2xl
                      overflow-hidden
                      shadow-2xl
                      "

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
                        onClick={handleLogout}
                        className="w-full text-left px-5 py-3 text-danger hover:bg-red-50 transition"
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
                  scale: .95,
                }}

                onClick={openSignup}

                className="
                bg-buttonPrimaryBg
                hover:bg-buttonPrimaryHoverBg
                text-buttonPrimaryText
                px-7
                py-3
                rounded-full
                font-semibold
                shadow-lg
                transition
                "

              >
                Get Started
              </motion.button>

            )}

          </div>

          {/* Mobile Menu Button */}

          <button

            onClick={() =>
              setMobileOpen(!mobileOpen)
            }

            className="
            lg:hidden
            text-3xl
            text-headingText
            "

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
              duration: .3,
            }}

            className="
            lg:hidden
            bg-cardBg
            border-t
            border-borderSoft
            overflow-hidden
            "

          >

            <div className="px-6 py-5 flex flex-col gap-5">

              <NavLink
                to="/home"
                className={linkClass}
                onClick={() =>
                  setMobileOpen(false)
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/create-trip"
                className={linkClass}
                onClick={() =>
                  setMobileOpen(false)
                }
              >
                Create Trip
              </NavLink>

              <NavLink
                to="/my-trips"
                className={linkClass}
                onClick={() =>
                  setMobileOpen(false)
                }
              >
                My Trips
              </NavLink>

              {user ? (

                <>
                  <NavLink
                    to="/profile"
                    className={linkClass}
                    onClick={() =>
                      setMobileOpen(false)
                    }
                  >
                    Profile
                  </NavLink>

                  <button

                    onClick={handleLogout}

                    className="
                    text-left
                    text-danger
                    font-medium
                    "

                  >
                    Logout
                  </button>

                </>

              ) : (

                <motion.button

                  whileHover={{
                    scale: 1.03,
                  }}

                  whileTap={{
                    scale: .95,
                  }}

                  onClick={() => {

                    openSignup();

                    setMobileOpen(false);

                  }}

                  className="
                  bg-buttonPrimaryBg
                  text-buttonPrimaryText
                  rounded-full
                  py-3
                  font-semibold
                  "

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