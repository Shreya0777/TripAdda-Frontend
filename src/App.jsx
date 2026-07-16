import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

import eruda from "eruda";

import Body from "./Components/Body";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreateTrip from "./pages/CreateTrip";
import AuthSuccess from "./pages/AuthSuccess";
import LandingPage from "./Landing/LandingPage";

import TripDetails from "./Components/TripDetails";
import MyTrips from "./Components/My-Trips";
import AuthModal from "./Components/auth/AuthModal";

import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading } = useAuth();

  useEffect(() => {
    eruda.init();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-blue-500">Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AuthModal />

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />

      <Routes>

        {/* Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Login OTP */}
        {/* <Route path="/verify-otp" element={<VerifyOtp />} /> */}

        {/* Google Login */}
        <Route path="/auth/success" element={<AuthSuccess />} />

        {/* Protected Layout */}
        <Route path="/" element={<Body />}>

          <Route path="home" element={<Home />} />

          <Route
            path="create-trip"
            element={
              user ? (
                <CreateTrip />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="my-trips"
            element={
              user ? (
                <MyTrips />
              ) : (
                <Navigate to="/" replace />
              )
            }
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