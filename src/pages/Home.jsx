import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import TripsFeed from "./Feed";

const Home = () => {
  const { user } = useAuth();

  const [filters, setFilters] = useState({
    destination: "",
    transportMode: "",
    minBudget: "",
    maxBudget: "",
    minRating: "",
    sortBy: "",
  });

  const [appliedFilters, setAppliedFilters] =
    useState({
      destination: "",
      transportMode: "",
      minBudget: "",
      maxBudget: "",
      minRating: "",
      sortBy: "",
    });

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // APPLY FILTERS
  const handleApplyFilters = () => {
    setAppliedFilters(filters);
  };

  // CLEAR FILTERS
  const handleClearFilters = () => {
    const resetFilters = {
      destination: "",
      transportMode: "",
      minBudget: "",
      maxBudget: "",
      minRating: "",
      sortBy: "",
    };

    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex p-6 gap-6">
        {/* SIDEBAR */}
        <div className="w-72 bg-white p-5 rounded-2xl shadow-sm h-fit sticky top-24">
          <h2 className="font-bold text-xl mb-5">
            Explore
          </h2>

          {/* DESTINATION */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 block mb-2">
              Destination
            </label>

            <input
              type="text"
              name="destination"
              value={filters.destination}
              onChange={handleChange}
              placeholder="Where to?"
              className="w-full px-3 py-3 border rounded-xl outline-none focus:border-blue-500"
            />
          </div>

          {/* TRANSPORT */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 block mb-2">
              Transport
            </label>

            <select
              name="transportMode"
              value={filters.transportMode}
              onChange={handleChange}
              className="w-full border rounded-xl px-3 py-3"
            >
              <option value="">
                Any Transport
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
          </div>

          {/* MIN BUDGET */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 block mb-2">
              Min Budget
            </label>

            <input
              type="number"
              name="minBudget"
              value={filters.minBudget}
              onChange={handleChange}
              placeholder="₹ 1000"
              className="w-full px-3 py-3 border rounded-xl"
            />
          </div>

          {/* MAX BUDGET */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 block mb-2">
              Max Budget
            </label>

            <input
              type="number"
              name="maxBudget"
              value={filters.maxBudget}
              onChange={handleChange}
              placeholder="₹ 50000"
              className="w-full px-3 py-3 border rounded-xl"
            />
          </div>

          {/* RATING */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 block mb-2">
              Rating
            </label>

            <select
              name="minRating"
              value={filters.minRating}
              onChange={handleChange}
              className="w-full border rounded-xl px-3 py-3"
            >
              <option value="">
                Any Rating
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
          </div>

          {/* SORT */}
          <div className="mb-6">
            <label className="text-sm text-gray-500 block mb-2">
              Sort By
            </label>

            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleChange}
              className="w-full border rounded-xl px-3 py-3"
            >
              <option value="">
                Default
              </option>

              <option value="budget_low">
                Budget Low to High
              </option>

              <option value="budget_high">
                Budget High to Low
              </option>

              <option value="rating_high">
                Highest Rated
              </option>
            </select>
          </div>

          {/* BUTTONS */}
          <button
            onClick={handleApplyFilters}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition"
          >
            Apply Filters
          </button>

          <button
            onClick={handleClearFilters}
            className="w-full mt-3 border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-100 transition"
          >
            Clear Filters
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              Curated Journeys
            </h1>

            <p className="text-gray-500 mt-2">
              Handpicked travel experiences designed
              for the modern explorer.
            </p>
          </div>

          {!user ? (
            <div className="bg-white rounded-2xl p-10 shadow text-center">
              <h2 className="text-2xl font-semibold">
                Please Login
              </h2>

              <p className="text-gray-500 mt-2">
                Login to explore amazing trips ✈️
              </p>
            </div>
          ) : (
            <TripsFeed filters={appliedFilters} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;