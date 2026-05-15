import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Body from "./Components/Body";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import CreateTrip from "./pages/CreateTrip";
import TripDetails from "./Components/TripDetails";
import MyTrips from "./Components/My-Trips";

// Auth
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading } = useAuth();

  // 🔄 Wait until auth loads
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-blue-500">Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* ✅ Toast should be OUTSIDE Routes */}
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* 🔥 FIRST TIME USER → SIGNUP */}
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <Signup />}
        />

        {/* 🔐 AUTH ROUTES */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/home" />}
        />


        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/home" />}
        />

        {/* 🔥 LAYOUT ROUTES (WITH NAVBAR + FOOTER) */}
        <Route path="/" element={<Body />}>
          <Route path="home" element={<Home />} />

          <Route
            path="profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />

          <Route
            path="create-trip"
            element={user ? <CreateTrip /> : <Navigate to="/login" />}
          />

          <Route path="trips/:id" element={<TripDetails />} />
          <Route path="/my-trips" element={<MyTrips />} />
        </Route>

        {/* ❌ 404 PAGE */}
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;