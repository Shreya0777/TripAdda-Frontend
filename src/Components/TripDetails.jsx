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

        setTrip(res.data.trip || res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTrip();
  }, [id]);

  if (!trip) {
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">

      <div className="max-w-6xl mx-auto space-y-6">

        {/* HERO IMAGE */}
        <div className="bg-white rounded-2xl overflow-hidden shadow">

          <img
            src={
              trip.media?.[0]?.url
                ? trip.media[0].url
                : "https://source.unsplash.com/1200x500/?travel"
            }
            alt="trip"
            className="w-full h-[400px] object-cover"
          />

          <div className="p-6">

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {trip.title}
                </h1>

                <p className="text-gray-500 mt-2">
                  📍 {trip.destination?.city},{" "}
                  {trip.destination?.state}
                </p>

                <p className="text-gray-500">
                  🚏 From {trip.boardingPoint}
                </p>
              </div>

              <div className="bg-blue-50 px-5 py-3 rounded-xl">

                <p className="text-sm text-gray-500">
                  Overall Rating
                </p>

                <h2 className="text-2xl font-bold">
                  ⭐ {trip.ratings?.overall}/5
                </h2>

              </div>
            </div>

          </div>
        </div>

        {/* QUICK INFO */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500 text-sm">
              Duration
            </p>

            <h3 className="font-semibold text-lg">
              ⏳ {trip.duration} Days
            </h3>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500 text-sm">
              Budget
            </p>

            <h3 className="font-semibold text-lg">
              💰 ₹
              {
                trip.budgetDetails
                  ?.costPerPerson
              }
              /person
            </h3>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500 text-sm">
              Trip Type
            </p>

            <h3 className="font-semibold text-lg capitalize">
              👥 {trip.tripType}
            </h3>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500 text-sm">
              Best Time
            </p>

            <h3 className="font-semibold text-lg">
              🌤 {trip.bestTimeToVisit}
            </h3>
          </div>

        </div>

        {/* ABOUT */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-2xl font-semibold mb-4">
            ✨ About This Trip
          </h2>

          <p className="text-gray-600 leading-8">
            {trip.description}
          </p>

        </div>

        {/* TRANSPORT */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-2xl font-semibold mb-5">
            🚗 Transport Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-500 text-sm">
                Transport Mode
              </p>

              <h3 className="font-semibold text-lg capitalize">
                {
                  trip.transportInfo
                    ?.mode
                }
              </h3>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-500 text-sm">
                Transport Name
              </p>

              <h3 className="font-semibold text-lg">
                {
                  trip.transportInfo
                    ?.transportName
                }
              </h3>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-500 text-sm">
                Route
              </p>

              <h3 className="font-semibold text-lg">
                {
                  trip.transportInfo
                    ?.route
                }
              </h3>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-500 text-sm">
                Fare
              </p>

              <h3 className="font-semibold text-lg">
                ₹
                {
                  trip.transportInfo
                    ?.fare
                }
              </h3>
            </div>

          </div>

        </div>

        {/* BUDGET */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-2xl font-semibold mb-5">
            💰 Budget Breakdown
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <div className="bg-blue-50 p-4 rounded-xl">
              Stay Cost <br />

              <strong>
                ₹
                {
                  trip.budgetDetails
                    ?.stayCost
                }
              </strong>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              Food Cost <br />

              <strong>
                ₹
                {
                  trip.budgetDetails
                    ?.foodCost
                }
              </strong>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              Transport Cost <br />

              <strong>
                ₹
                {
                  trip.budgetDetails
                    ?.transportCost
                }
              </strong>
            </div>

          </div>

        </div>

        {/* STAY */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-2xl font-semibold mb-5">
            🏨 Stay Details
          </h2>

          <div className="space-y-3">

            <p>
              <strong>Hotel:</strong>{" "}
              {
                trip.stayDetails
                  ?.hotelName
              }
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {
                trip.stayDetails
                  ?.location
              }
            </p>

            <p>
              <strong>Stay Type:</strong>{" "}
              {
                trip.stayDetails
                  ?.stayType
              }
            </p>

            <p>
              <strong>Price Per Night:</strong> ₹
              {
                trip.stayDetails
                  ?.pricePerNight
              }
            </p>

            <p>
              <strong>Rating:</strong> ⭐
              {
                trip.stayDetails
                  ?.rating
              }
            </p>

            <p className="text-gray-600">
              {
                trip.stayDetails
                  ?.stayReview
              }
            </p>

          </div>

        </div>

        {/* FOOD */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-2xl font-semibold mb-5">
            🍜 Food Recommendations
          </h2>

          <div className="space-y-5">

            <div>
              <h3 className="font-semibold mb-2">
                Must Try Foods
              </h3>

              <div className="flex flex-wrap gap-2">
                {trip
                  .foodRecommendations
                  ?.mustTryFoods?.map(
                    (food, idx) => (
                      <span
                        key={idx}
                        className="bg-orange-100 px-3 py-1 rounded-full text-sm"
                      >
                        {food}
                      </span>
                    )
                  )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Cafes
              </h3>

              <div className="flex flex-wrap gap-2">
                {trip
                  .foodRecommendations
                  ?.cafes?.map(
                    (cafe, idx) => (
                      <span
                        key={idx}
                        className="bg-yellow-100 px-3 py-1 rounded-full text-sm"
                      >
                        {cafe}
                      </span>
                    )
                  )}
              </div>
            </div>

          </div>

        </div>

        {/* TIPS */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-2xl font-semibold mb-5">
            💡 Traveler Tips
          </h2>

          <ul className="space-y-3 list-disc pl-5 text-gray-600">

            {trip.travelerTips?.map(
              (tip, idx) => (
                <li key={idx}>{tip}</li>
              )
            )}

          </ul>

        </div>

        {/* GALLERY */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-2xl font-semibold mb-5">
            🖼 Travel Gallery
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

            {trip.media?.map(
              (item, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-xl"
                >

                  {item.type === "video" ? (
                    <video
                      controls
                      className="w-full h-60 object-cover"
                    >
                      <source
                        src={item.url}
                      />
                    </video>
                  ) : (
                    <img
                      src={item.url}
                      alt=""
                      className="w-full h-60 object-cover"
                    />
                  )}

                </div>
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default TripDetails;