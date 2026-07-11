import { useAuth } from "../context/AuthContext";
import TripsFeed from "./Feed";
import LandingPage from "../Landing/LandingPage";

export default function Home() {

const { user } = useAuth();

return user ? <TripsFeed /> : <LandingPage />;

}