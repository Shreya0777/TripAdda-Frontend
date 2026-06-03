import { useEffect, useState } from "react";
import axios from "../api/axios";
import TripCard from "../Components/TripCard";

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
    <div className="min-h-screen bg-sectionBg px-3 py-5 sm:px-4 lg:px-6">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-6 sm:mb-8">

          <h1 className="text-2xl font-bold text-headingText sm:text-3xl">
            Explore Travel Experiences
          </h1>

          <p className="mt-2 text-sm text-mutedText sm:text-base">
            Discover real trips, hidden gems and
            travel budgets shared by travelers ✨
          </p>

        </div>

        {/* FILTERS */}
        <div className="mb-6 rounded-2xl bg-cardBg p-4 shadow sm:mb-8 sm:p-5">

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">

            {/* Destination */}
            <input
              type="text"
              name="destination"
              placeholder="Destination"
              value={filters.destination}
              onChange={handleChange}
              className="w-full rounded-xl border border-borderMain bg-cardBg p-3 text-sm text-headingText outline-none focus:ring-2 focus:ring-focusRing"
            />

            {/* Transport */}
            <select
              name="transportMode"
              value={filters.transportMode}
              onChange={handleChange}
              className="w-full rounded-xl border border-borderMain bg-cardBg p-3 text-sm text-headingText outline-none focus:ring-2 focus:ring-focusRing"
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
              className="w-full rounded-xl border border-borderMain bg-cardBg p-3 text-sm text-headingText outline-none focus:ring-2 focus:ring-focusRing"
            />

            {/* Max Budget */}
            <input
              type="number"
              name="maxBudget"
              placeholder="Max Budget"
              value={filters.maxBudget}
              onChange={handleChange}
              className="w-full rounded-xl border border-borderMain bg-cardBg p-3 text-sm text-headingText outline-none focus:ring-2 focus:ring-focusRing"
            />

            {/* Rating */}
            <select
              name="minRating"
              value={filters.minRating}
              onChange={handleChange}
              className="w-full rounded-xl border border-borderMain bg-cardBg p-3 text-sm text-headingText outline-none focus:ring-2 focus:ring-focusRing"
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
              className="w-full rounded-xl border border-borderMain bg-cardBg p-3 text-sm text-headingText outline-none focus:ring-2 focus:ring-focusRing"
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
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

                {trips.map((trip) => (
                  <TripCard
                    key={trip._id}
                    trip={trip}
                  />
                ))}

              </div>
            ) : (
              <div className="rounded-2xl bg-cardBg p-6 text-center shadow sm:p-10">
                <h2 className="text-2xl font-semibold">
                  No Trips Found 😢
                </h2>

                <p className="mt-2 text-sm text-mutedText sm:text-base">
                  Try changing filters
                </p>
              </div>
            )}

            {/* PAGINATION */}
            {trips.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4">

                <button
                  onClick={() =>
                    setPage((prev) => prev - 1)
                  }
                  disabled={page === 1}
                  className="rounded-xl bg-activeBg px-4 py-2 disabled:opacity-50 sm:px-5"
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
                  className="rounded-xl bg-buttonPrimaryBg px-4 py-2 text-inverseText disabled:opacity-50 sm:px-5"
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