import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Body from "./Components/Body";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreateTrip from "./pages/CreateTrip";
import AuthSuccess from "./pages/AuthSuccess";
import LandingPage from "./Landing/LandingPage";
import RouteLoading from "./Components/RouteLoading";

import TripDetails from "./Components/TripDetails";
import MyTrips from "./Components/My-Trips";
import AuthModal from "./Components/auth/AuthModal";

import { useAuth } from "./context/AuthContext";

// FIX: eruda.init() was called here AND in main.jsx, unconditionally,
// shipping a mobile debug console to every production user. It's now
// initialized once, dev-only, in main.jsx.

function App() {
  const { user, loading } = useAuth();

  // FIX: this used to block the ENTIRE app — including the public
  // landing page — behind one full-screen "Loading..." until the
  // /users/profile/view auth check resolved. On Render's free tier,
  // a cold backend can take 30-50s to wake up, so every visitor
  // (logged in or not) stared at a blank loading screen for up to a
  // minute before seeing anything at all. The landing page and other
  // public routes don't need to know login state to render, so they
  // no longer wait on it — only the specific routes below (create-trip,
  // my-trips) that actually branch on `user` show a brief spinner,
  // and only while `loading` is still true.

  return (
    <BrowserRouter>
      <AuthModal />
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/success" element={<AuthSuccess />} />

        <Route path="/" element={<Body />}>
          <Route path="home" element={<Home />} />
          <Route
            path="create-trip"
            element={loading ? <RouteLoading /> : user ? <CreateTrip /> : <Navigate to="/" replace />}
          />
          <Route
            path="my-trips"
            element={loading ? <RouteLoading /> : user ? <MyTrips /> : <Navigate to="/" replace />}
          />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="trips/:id" element={<TripDetails />} />
        </Route>

        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;