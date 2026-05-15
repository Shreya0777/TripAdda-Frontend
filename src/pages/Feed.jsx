import { useEffect, useState } from "react";
import axios from "../api/axios";
import TripCard from "../Components/Profile/TripCard";

const TripsFeed = ({ filters }) => {
  const [trips, setTrips] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchTrips = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams({
        page,
        limit: 6,

        ...(filters?.destination && {
          destination: filters.destination,
        }),

        ...(filters?.transportMode && {
          transportMode: filters.transportMode,
        }),

        ...(filters?.minBudget && {
          minBudget: filters.minBudget,
        }),

        ...(filters?.maxBudget && {
          maxBudget: filters.maxBudget,
        }),

        ...(filters?.minRating && {
          minRating: filters.minRating,
        }),

        ...(filters?.sortBy && {
          sortBy: filters.sortBy,
        }),
      }).toString();

      const res = await axios.get(`/trips/feed?${query}`, {
        withCredentials: true,
      });

      setTrips(res.data.Trips || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.log("Trips feed error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    fetchTrips();
  }, [page, filters]);

  if (loading) {
    return (
      <div className="text-center py-20">
        Loading Trips...
      </div>
    );
  }

  return (
    <>
      {trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard key={trip._id} trip={trip} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center shadow">
          <h2 className="text-2xl font-semibold">
            No Trips Found 😢
          </h2>

          <p className="text-gray-500 mt-2">
            Try changing filters
          </p>
        </div>
      )}

      {trips.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1}
            className="px-5 py-2 bg-gray-300 rounded-xl disabled:opacity-50"
          >
            Prev
          </button>

          <span className="font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === totalPages}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default TripsFeed;