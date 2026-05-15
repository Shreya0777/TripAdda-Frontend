import { useEffect, useState } from "react";
import axios from "../api/axios";

import TripCard from "../Components/Profile/TripCard";

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyTrips = async () => {
      try {
        const res = await axios.get("/trips/my-trips", {
          withCredentials: true,
        });

        console.log("MY TRIPS RESPONSE:", res.data);

        const tripsData = Array.isArray(res.data)
          ? res.data
          : res.data.trips || [];

        setTrips(tripsData);
      } catch (error) {
        console.log("My trips error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTrips();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <p className="text-muted text-lg">
          Loading your trips...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page px-4 md:px-8 py-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-heading">
            My Trips
          </h1>

          <p className="text-muted mt-1">
            {trips.length} trip
            {trips.length !== 1 && "s"} shared
          </p>
        </div>
      </div>

      {/* EMPTY STATE */}
      {trips.length === 0 ? (
        <div className="bg-card rounded-2xl p-10 text-center border border-borderColor">
          <h2 className="text-2xl font-semibold text-heading">
            No trips shared yet ✈
          </h2>

          <p className="text-muted mt-3">
            Start sharing your travel experiences with the world.
          </p>
        </div>
      ) : (
        /* TRIPS GRID */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={{
                ...trip,

                rating:
                  trip.ratings?.overall || 4.5,

                costPerPerson:
                  trip.budgetDetails?.costPerPerson ||
                  0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrips;