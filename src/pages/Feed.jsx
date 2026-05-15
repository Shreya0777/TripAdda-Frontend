import { useEffect, useState } from "react";
import axios from "../api/axios";
import TripCard from "../Components/Profile/TripCard";

const TripsFeed = () => {
  const [trips, setTrips] = useState([]);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);

  // FILTERS
  const [filters, setFilters] = useState({
    destination: "",
    transportMode: "",
    minBudget: "",
    maxBudget: "",
    minRating: "",
    sortBy: "",
  });

  // HANDLE FILTER CHANGE
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // FETCH TRIPS
  const fetchTrips = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams({
        page,
        limit: 6,

        ...(filters.destination && {
          destination: filters.destination,
        }),

        ...(filters.transportMode && {
          transportMode: filters.transportMode,
        }),

        ...(filters.minBudget && {
          minBudget: filters.minBudget,
        }),

        ...(filters.maxBudget && {
          maxBudget: filters.maxBudget,
        }),

        ...(filters.minRating && {
          minRating: filters.minRating,
        }),

        ...(filters.sortBy && {
          sortBy: filters.sortBy,
        }),
      }).toString();

      const res = await axios.get(
        `/trips/feed?${query}`
      );

      setTrips(res.data.Trips);

      setTotalPages(res.data.totalPages);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // FETCH ON PAGE/FILTER CHANGE
  useEffect(() => {
    fetchTrips();
  }, [page, filters]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Explore Travel Experiences
          </h1>

          <p className="text-gray-500 mt-2">
            Discover real trips, hidden gems and
            travel budgets shared by travelers ✨
          </p>

        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-2xl p-5 shadow mb-8">

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">

            {/* Destination */}
            <input
              type="text"
              name="destination"
              placeholder="Destination"
              value={filters.destination}
              onChange={handleChange}
              className="border p-3 rounded-xl"
            />

            {/* Transport */}
            <select
              name="transportMode"
              value={filters.transportMode}
              onChange={handleChange}
              className="border p-3 rounded-xl"
            >
              <option value="">
                Transport
              </option>

              <option value="train">
                Train
              </option>

              <option value="flight">
                Flight
              </option>

              <option value="bus">
                Bus
              </option>

              <option value="car">
                Car
              </option>

              <option value="bike">
                Bike
              </option>

            </select>

            {/* Min Budget */}
            <input
              type="number"
              name="minBudget"
              placeholder="Min Budget"
              value={filters.minBudget}
              onChange={handleChange}
              className="border p-3 rounded-xl"
            />

            {/* Max Budget */}
            <input
              type="number"
              name="maxBudget"
              placeholder="Max Budget"
              value={filters.maxBudget}
              onChange={handleChange}
              className="border p-3 rounded-xl"
            />

            {/* Rating */}
            <select
              name="minRating"
              value={filters.minRating}
              onChange={handleChange}
              className="border p-3 rounded-xl"
            >
              <option value="">
                Rating
              </option>

              <option value="5">
                5 Star
              </option>

              <option value="4">
                4+ Star
              </option>

              <option value="3">
                3+ Star
              </option>

            </select>

            {/* Sort */}
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleChange}
              className="border p-3 rounded-xl"
            >
              <option value="">
                Sort By
              </option>

              <option value="budget_low">
                Budget Low
              </option>

              <option value="budget_high">
                Budget High
              </option>

              <option value="rating_high">
                Highest Rated
              </option>

            </select>

          </div>

        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-20">
            Loading Trips...
          </div>
        ) : (
          <>
            {/* TRIPS GRID */}
            {trips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {trips.map((trip) => (
                  <TripCard
                    key={trip._id}
                    trip={trip}
                  />
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

            {/* PAGINATION */}
            {trips.length > 0 && (
              <div className="flex justify-center items-center gap-4 mt-10">

                <button
                  onClick={() =>
                    setPage((prev) => prev - 1)
                  }
                  disabled={page === 1}
                  className="px-5 py-2 bg-gray-300 rounded-xl disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="font-medium">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setPage((prev) => prev + 1)
                  }
                  disabled={page === totalPages}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl disabled:opacity-50"
                >
                  Next
                </button>

              </div>
            )}
          </>
        )}

      </div>

    </div>
  );
};

export default TripsFeed;