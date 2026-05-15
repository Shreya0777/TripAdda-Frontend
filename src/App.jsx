import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Body from "./Components/Body";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import CreateTrip from "./pages/CreateTrip";
import AuthSuccess from "./pages/AuthSuccess";

import TripDetails from "./Components/TripDetails";
import MyTrips from "./Components/My-Trips";

import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-blue-500">Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" replace /> : <Signup />}
        />

        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/home" replace />}
        />

        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/home" replace />}
        />

        <Route path="/auth/success" element={<AuthSuccess />} />

        <Route path="/" element={<Body />}>
          <Route path="home" element={<Home />} />

          <Route
            path="profile"
            element={user ? <Profile /> : <Navigate to="/login" replace />}
          />

          <Route
            path="create-trip"
            element={user ? <CreateTrip /> : <Navigate to="/login" replace />}
          />

          <Route
            path="my-trips"
            element={user ? <MyTrips /> : <Navigate to="/login" replace />}
          />

          <Route path="trips/:id" element={<TripDetails />} />
        </Route>

        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;