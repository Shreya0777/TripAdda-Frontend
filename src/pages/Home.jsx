import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TripsFeed from "./Feed";
import RouteLoading from "../Components/RouteLoading";

// FIX: this only checked `user`, not `loading`. Right after Google login
// redirects here, the app does a full reload (window.location.replace),
// so AuthContext's own profile check is still in-flight for a moment —
// during that moment `user` is still null even though login actually
// succeeded, so this immediately bounced back to the landing page
// before the check had a chance to finish. Now it waits for `loading`
// to resolve first, same as the create-trip/my-trips routes already do.
export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return <RouteLoading />;

  return user ? <TripsFeed /> : <Navigate to="/" replace />;
}