import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-linkText font-semibold"
      : "text-bodyText hover:text-linkText";

  return (
    <nav className="bg-cardBg shadow-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-5 md:px-8">
        <h1
          onClick={() => navigate("/home")}
          className="cursor-pointer text-xl font-bold text-linkText sm:text-2xl"
        >
          TripAdda
        </h1>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <NavLink to="/home" className={linkClass}>Home</NavLink>
          <NavLink to="/create-trip" className={linkClass}>Add Trip</NavLink>
          <NavLink to="/my-trips" className={linkClass}>My Trips</NavLink>
        </div>

        {/* Desktop profile / signup */}
        <div className="hidden md:block">
          {user ? (
            <div className="flex items-center gap-5 relative" ref={dropdownRef}>
              <span className="text-xl cursor-pointer">🔔</span>
              <span className="text-xl cursor-pointer">⚙️</span>

              <div onClick={() => setProfileOpen(!profileOpen)} className="cursor-pointer">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-activeBg flex items-center justify-center text-sm font-semibold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 bg-cardBg shadow-xl rounded-xl border overflow-hidden">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium text-headingText">{user.name}</p>
                    <p className="text-xs text-mutedText truncate">{user.email}</p>
                  </div>

                  <button onClick={() => navigate("/profile")} className="w-full text-left px-4 py-2 hover:bg-hoverBg">
                    👤 Profile
                  </button>

                  <button onClick={() => navigate("/create-trip")} className="w-full text-left px-4 py-2 hover:bg-hoverBg">
                    ➕ Add Trip
                  </button>

                  <button
                    onClick={() => {
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-dangerText hover:bg-hoverBg"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate("/signup")} className="bg-buttonPrimaryBg text-inverseText px-4 py-2 rounded-lg">
              Signup
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-1 text-3xl text-headingText md:hidden"
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="space-y-2 border-t bg-cardBg px-4 py-4 shadow md:hidden">
          <NavLink onClick={() => setMobileOpen(false)} to="/home" className="block rounded-lg px-2 py-2 font-medium text-bodyText hover:bg-hoverBg">
            Home
          </NavLink>

          <NavLink onClick={() => setMobileOpen(false)} to="/create-trip" className="block rounded-lg px-2 py-2 font-medium text-bodyText hover:bg-hoverBg">
            Add Trip
          </NavLink>

          <NavLink onClick={() => setMobileOpen(false)} to="/my-trips" className="block rounded-lg px-2 py-2 font-medium text-bodyText hover:bg-hoverBg">
            My Trips
          </NavLink>

          {user ? (
            <>
              <NavLink onClick={() => setMobileOpen(false)} to="/profile" className="block rounded-lg px-2 py-2 font-medium text-bodyText hover:bg-hoverBg">
                Profile
              </NavLink>

              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="block rounded-lg px-2 py-2 font-medium text-dangerText hover:bg-hoverBg"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setMobileOpen(false);
                navigate("/signup");
              }}
              className="bg-buttonPrimaryBg text-inverseText px-4 py-2 rounded-lg"
            >
              Signup
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;