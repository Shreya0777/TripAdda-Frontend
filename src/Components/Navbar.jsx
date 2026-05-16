import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between px-8 py-3 bg-white shadow-sm sticky top-0 z-50">

      {/* 🔵 LOGO */}
      <h1
        onClick={() => navigate("/")}
        className="text-blue-600 font-bold text-xl cursor-pointer"
      >
        TripAdda
      </h1>

      {/* 🔵 CENTER NAV LINKS */}
      <div className="hidden md:flex items-center gap-8 font-medium">

        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 border-b-2 border-blue-600 pb-1"
              : "text-gray-600 hover:text-blue-600"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/create-trip"
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 border-b-2 border-blue-600 pb-1"
              : "text-gray-600 hover:text-blue-600"
          }
        >
          Add Trip
        </NavLink>

        <NavLink
          to="/my-trips"
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 border-b-2 border-blue-600 pb-1"
              : "text-gray-600 hover:text-blue-600"
          }
        >
          My Trips
        </NavLink>
        <NavLink
        to="/my-trips" className="text-heading hover:text-primary">
  
        

        </NavLink>

      </div>

      {/* 🔵 RIGHT SECTION */}
      {user ? (
        <div className="flex items-center gap-5 relative" ref={dropdownRef}>

          {/* 🔔 Notification */}
          <span className="text-xl cursor-pointer">🔔</span>

          {/* ⚙️ Settings */}
          <span className="text-xl cursor-pointer">⚙️</span>

          {/* 👤 Avatar */}
          <div
            onClick={() => setOpen(!open)}
            className="cursor-pointer"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* 🔽 DROPDOWN */}
          {open && (
            <div className="absolute right-0 top-12 w-48 bg-white shadow-xl rounded-xl border overflow-hidden">

              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium text-gray-800">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>

              <button
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                👤 Profile
              </button>

              <button
                onClick={() => {
                  navigate("/create-trip");
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
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
        <button
          onClick={() => navigate("/signup")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Signup
        </button>
      )}
    </div>
  );
};

export default Navbar;