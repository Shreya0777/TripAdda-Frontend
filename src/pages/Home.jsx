import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TripsFeed from "./Feed";

// The real single-header landing page already exists as its own
// top-level route ("/") outside Body. So logged-out visitors to /home
// are redirected there instead of getting a second, duplicated copy.
export default function Home() {
  const { user } = useAuth();

  return user ? <TripsFeed /> : <Navigate to="/" replace />;
}