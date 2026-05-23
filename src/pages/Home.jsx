import { useAuth } from "../context/AuthContext";
import TripsFeed from "./Feed";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-sectionBg p-4">
      <div className="max-w-7xl mx-auto">
        {/* MAIN SECTION */}

        {!user ? <p>Please login to see trips</p> : <TripsFeed />}
      </div>
    </div>
  );
};

export default Home;
