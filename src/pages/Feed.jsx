import { useEffect, useState } from "react";
import axios from "../api/axios";
import TripCard from "../Components/Profile/TripCard";

const TripsFeed = () => {
  const [trips, setTrips] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTrips = async (pageNumber) => {
    try {
      const res = await axios.get(`/trips/feed?page=${pageNumber}&limit=4`);

      setTrips(res.data.Trips);
      setTotalPages(res.data.totalPages);
      console.log(res.data.totalPages);

    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
  console.log("Trips:", trips);
}, [trips]);

  useEffect(() => {
    fetchTrips(page);
  }, [page]);

  return (
    <div>
      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {trips.map((trip) => (
          <TripCard key={trip._id} trip={trip} />
        ))}
      </div>

      {/* PAGINATION BUTTONS */}
      <div className="flex justify-center gap-4 mt-6">
        
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TripsFeed;