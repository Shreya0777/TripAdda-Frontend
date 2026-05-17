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
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600";

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-5 md:px-8 py-3">
        <h1
          onClick={() => navigate("/home")}
          className="text-blue-600 font-bold text-2xl cursor-pointer"
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
                  <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white shadow-xl rounded-xl border overflow-hidden">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  <button onClick={() => navigate("/profile")} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                    👤 Profile
                  </button>

                  <button onClick={() => navigate("/create-trip")} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                    ➕ Add Trip
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate("/signup")} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Signup
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-3xl text-gray-800"
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t px-5 py-4 space-y-4 shadow">
          <NavLink onClick={() => setMobileOpen(false)} to="/home" className="block text-gray-700 font-medium">
            Home
          </NavLink>

          <NavLink onClick={() => setMobileOpen(false)} to="/create-trip" className="block text-gray-700 font-medium">
            Add Trip
          </NavLink>

          <NavLink onClick={() => setMobileOpen(false)} to="/my-trips" className="block text-gray-700 font-medium">
            My Trips
          </NavLink>

          {user ? (
            <>
              <NavLink onClick={() => setMobileOpen(false)} to="/profile" className="block text-gray-700 font-medium">
                Profile
              </NavLink>

              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                  navigate("/login");
                }}
                className="block text-red-500 font-medium"
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
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
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