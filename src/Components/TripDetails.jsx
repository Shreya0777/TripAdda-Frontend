import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";

const TripDetails = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await axios.get(`/trips/${id}`);
        setTrip(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTrip();
  }, [id]);

  if (!trip) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Image */}
      <img
        src={
          trip.media?.[0]?.url
            ? trip.media[0].url
            : "https://source.unsplash.com/400x300/?travel"
        }
        className="w-full h-72 object-cover rounded-xl"
      />

      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold">{trip.destination}</h1>
        <p className="text-gray-500">Best place: {trip.bestPlace}</p>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 bg-gray-100 rounded-lg">
          💰 Budget <br />
          <strong>₹{trip.totalBudget}</strong>
        </div>

        <div className="p-3 bg-gray-100 rounded-lg">
          🚗 Transport <br />
          <strong>{trip.transportation}</strong>
        </div>

        <div className="p-3 bg-gray-100 rounded-lg">
          ⭐ Rating <br />
          <strong>{trip.overallRating}</strong>
        </div>

        <div className="p-3 bg-gray-100 rounded-lg">
          ⏳ Duration <br />
          <strong>{trip.duration} days</strong>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold mb-2">About Trip</h2>
        <p className="text-gray-600">{trip.description}</p>
      </div>

      {/* Tips */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Tips</h2>
        <p className="text-gray-600">{trip.tips}</p>
      </div>

      {/* Pros & Cons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="font-semibold">👍 Pros</h3>
          <p>{trip.pros}</p>
        </div>

        <div className="bg-red-100 p-4 rounded-lg">
          <h3 className="font-semibold">👎 Cons</h3>
          <p>{trip.cons}</p>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
