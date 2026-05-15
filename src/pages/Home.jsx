import { useAuth } from "../context/AuthContext";
import TripsFeed from "./Feed";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-4">

      <div className="max-w-7xl mx-auto">

      {/* CONTENT */}
      {/* <div className="flex p-6 gap-6"> */}
        
        {/* SIDEBAR */}
        {/* <div className="w-64 bg-white p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Explore</h2>

          <input
            type="text"
            placeholder="Where to?"
            className="w-full px-3 py-2 border rounded-lg mb-4"
          />

          <p className="text-sm text-gray-500 mb-2">BUDGET RANGE</p>
          <input type="range" className="w-full mb-4" />

          <p className="text-sm text-gray-500 mb-2">DURATION</p>
          <select className="w-full border rounded-lg px-2 py-2 mb-4">
            <option>Any duration</option>
            <option>1-3 days</option>
            <option>4-7 days</option>
          </select>

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
            Apply Filters
          </button>
        </div> */}

        {/* MAIN SECTION */}
        

          {!user ? (
            <p>Please login to see trips</p>
          ) : (
            <TripsFeed />
          )}
        
      </div>
     </div>
  );
};

export default Home;