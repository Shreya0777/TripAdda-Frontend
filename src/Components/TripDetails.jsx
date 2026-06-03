import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [openSection, setOpenSection] = useState("itinerary");

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

  if (!trip) return <div className="p-10 text-center">Loading...</div>;

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const userName = trip.userId?.name || trip.userId?.username || "Traveler";
  const userImage =
    trip.userId?.photoURL ||
    "https://tse2.mm.bing.net/th/id/OIP.9k6NZTQk5G6g5PVDDDeLiAHaHa?pid=Api&P=0&h=180";

  const Section = ({ id, icon, title, summary, children }) => (
    <div className="overflow-hidden rounded-xl border border-borderMain bg-cardBg">
      <button
        onClick={() => toggleSection(id)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
      >
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <span className="text-xl">{icon}</span>

          <div>
            <h3 className="break-words font-semibold text-headingText">
              {title}
            </h3>
            {summary && (
              <p className="break-words text-sm text-mutedText">{summary}</p>
            )}
          </div>
        </div>

        <span className="text-xl text-mutedText">
          {openSection === id ? "⌃" : "›"}
        </span>
      </button>

      {openSection === id && (
        <div className="border-t border-borderMain px-4 pb-4 text-bodyText">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-page px-3 py-5 sm:px-4 lg:px-6">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 lg:grid-cols-[300px_1fr] lg:gap-6">
        {/* LEFT SIDEBAR */}
        <div className="h-fit rounded-2xl bg-cardBg p-4 shadow-sm">
          <img
            src={
              trip.media?.[0]?.url ||
              "https://source.unsplash.com/500x400/?travel"
            }
            alt="trip"
            className="h-48 w-full rounded-xl object-cover sm:h-52"
          />

          <div className="mt-4">
            <span className="rounded-full bg-hoverBg px-3 py-1 text-xs text-primary">
              {trip.tripType || "Trip"}
            </span>

            <h1 className="mt-3 break-words text-xl font-bold text-headingText sm:text-2xl">
              {trip.title}
            </h1>

            {/* POSTED BY */}
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-hoverBg p-3">
              <img
                src={userImage}
                alt={userName}
                className="h-10 w-10 rounded-full object-cover"
              />

              <div className="min-w-0">
                <p className="text-xs text-mutedText">Posted by</p>

                <p
                  onClick={() => navigate(`/profile/${trip.userId?._id}`)}
                  className="cursor-pointer truncate font-semibold text-primary hover:underline"
                >
                  {userName}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-mutedText">
              📍 {trip.destination?.city}, {trip.destination?.state}
            </p>

            <p className="break-words text-sm text-mutedText">
              🚏 From {trip.boardingPoint}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-hoverBg p-3 text-center">
              <p className="font-bold text-headingText">
                ₹{trip.budgetDetails?.totalBudget}
              </p>
              <p className="text-xs text-mutedText">Total Budget</p>
            </div>

            <div className="rounded-xl bg-hoverBg p-3 text-center">
              <p className="font-bold text-headingText">{trip.duration}</p>
              <p className="text-xs text-mutedText">Days</p>
            </div>

            <div className="rounded-xl bg-hoverBg p-3 text-center">
              <p className="font-bold text-headingText">
                ⭐ {trip.ratings?.overall}
              </p>
              <p className="text-xs text-mutedText">Rating</p>
            </div>

            <div className="rounded-xl bg-hoverBg p-3 text-center capitalize">
              <p className="font-bold text-headingText">{trip.tripType}</p>
              <p className="text-xs text-mutedText">Trip Type</p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-bodyText">
            {trip.description?.slice(0, 130)}...
          </p>
        </div>

        {/* RIGHT CONTENT */}
        <div className="space-y-4">
          <Section
            id="destination"
            icon="📍"
            title="Destination"
            summary={`${trip.destination?.city}, ${trip.destination?.state}`}
          >
            <p>
              {trip.destination?.city}, {trip.destination?.state},{" "}
              {trip.destination?.country}
            </p>
          </Section>

          <Section
            id="boarding"
            icon="🚏"
            title="Boarding Point"
            summary={trip.boardingPoint}
          >
            <p>{trip.boardingPoint}</p>
          </Section>

          <Section
            id="transport"
            icon="🚌"
            title="Transport Info"
            summary={`${trip.transportInfo?.transportName || ""} ${
              trip.transportInfo?.route || ""
            }`}
          >
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <p>
                <strong>Mode:</strong> {trip.transportInfo?.mode}
              </p>
              <p>
                <strong>Name:</strong> {trip.transportInfo?.transportName}
              </p>
              <p>
                <strong>Route:</strong> {trip.transportInfo?.route}
              </p>
              <p>
                <strong>Duration:</strong> {trip.transportInfo?.duration}
              </p>
              <p>
                <strong>Fare:</strong> ₹{trip.transportInfo?.fare}
              </p>
            </div>
          </Section>

          <Section
            id="bestTime"
            icon="📅"
            title="Best Time to Visit"
            summary={trip.bestTimeToVisit}
          >
            <p>{trip.bestTimeToVisit}</p>
          </Section>

          <Section
            id="budget"
            icon="💰"
            title="Budget Details"
            summary={`Total Budget: ₹${trip.budgetDetails?.totalBudget}`}
          >
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <p>
                <strong>Per Person:</strong> ₹
                {trip.budgetDetails?.costPerPerson}
              </p>
              <p>
                <strong>Stay:</strong> ₹{trip.budgetDetails?.stayCost}
              </p>
              <p>
                <strong>Food:</strong> ₹{trip.budgetDetails?.foodCost}
              </p>
              <p>
                <strong>Transport:</strong> ₹{trip.budgetDetails?.transportCost}
              </p>
              <p>
                <strong>Sightseeing:</strong> ₹
                {trip.budgetDetails?.sightseeingCost}
              </p>
              <p>
                <strong>Other:</strong> ₹{trip.budgetDetails?.otherCost}
              </p>
            </div>
          </Section>

          <Section
            id="stay"
            icon="🏨"
            title="Stay Details"
            summary={`${trip.stayDetails?.hotelName || ""} ${
              trip.stayDetails?.location || ""
            }`}
          >
            <div className="mt-4 space-y-2">
              <p>
                <strong>Hotel:</strong> {trip.stayDetails?.hotelName}
              </p>
              <p>
                <strong>Location:</strong> {trip.stayDetails?.location}
              </p>
              <p>
                <strong>Type:</strong> {trip.stayDetails?.stayType}
              </p>
              <p>
                <strong>Price:</strong> ₹{trip.stayDetails?.pricePerNight}/night
              </p>
              <p>
                <strong>Rating:</strong> ⭐ {trip.stayDetails?.rating}
              </p>
              <p>{trip.stayDetails?.stayReview}</p>
            </div>
          </Section>

          <Section
            id="food"
            icon="🍜"
            title="Food Recommendation"
            summary={trip.foodRecommendations?.mustTryFoods?.join(", ")}
          >
            <div className="mt-4 space-y-3">
              <p>
                <strong>Must Try:</strong>{" "}
                {trip.foodRecommendations?.mustTryFoods?.join(", ")}
              </p>
              <p>
                <strong>Cafes:</strong>{" "}
                {trip.foodRecommendations?.cafes?.join(", ")}
              </p>
              <p>
                <strong>Budget Options:</strong>{" "}
                {trip.foodRecommendations?.budgetFoodOptions?.join(", ")}
              </p>
            </div>
          </Section>

          <Section
            id="hidden"
            icon="🌄"
            title="Hidden Spots"
            summary={`${trip.hiddenSpots?.length || 0} hidden gems`}
          >
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {trip.hiddenSpots?.map((spot, index) => (
                <div key={index} className="rounded-xl bg-hoverBg p-3">
                  <h4 className="break-words font-semibold text-headingText">
                    {spot.title}
                  </h4>
                  <p className="break-words text-sm text-mutedText">
                    {spot.description}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Section
            id="itinerary"
            icon="🗓"
            title={`Itinerary (${trip.itinerary?.days?.length || 0} Days)`}
            summary="Day-wise plan with places to visit"
          >
            {trip.itinerary?.itineraryType === "video" &&
            trip.itinerary?.videoUrl ? (
              <video
                controls
                className="mt-4 max-h-[400px] w-full rounded-xl object-cover"
              >
                <source src={trip.itinerary.videoUrl} />
              </video>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {trip.itinerary?.days?.map((item, index) => (
                  <div key={index} className="rounded-xl bg-hoverBg p-4">
                    <p className="text-sm font-medium text-primary">
                      Day {item.day}
                    </p>
                    <h4 className="mt-1 font-semibold text-headingText">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm text-mutedText">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section
            id="gallery"
            icon="🖼"
            title="Trip Gallery"
            summary={`${trip.media?.length || 0} photos/videos`}
          >
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
              {trip.media?.map((item, index) =>
                item.type === "video" ? (
                  <video
                    key={index}
                    controls
                    className="h-40 w-full rounded-xl object-cover sm:h-32"
                  >
                    <source src={item.url} />
                  </video>
                ) : (
                  <img
                    key={index}
                    src={item.url}
                    alt=""
                    className="h-40 w-full rounded-xl object-cover sm:h-32"
                  />
                )
              )}
            </div>
          </Section>

          <Section
            id="tips"
            icon="💡"
            title="Tips from the Traveler"
            summary={`${trip.travelerTips?.length || 0} tips`}
          >
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {trip.travelerTips?.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </Section>

          <Section
            id="ratings"
            icon="⭐"
            title="Overall Ratings"
            summary={`${trip.ratings?.overall}/5 overall rating`}
          >
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <p>
                <strong>Budget:</strong> {trip.ratings?.budget}
              </p>
              <p>
                <strong>Safety:</strong> {trip.ratings?.safety}
              </p>
              <p>
                <strong>Food:</strong> {trip.ratings?.food}
              </p>
              <p>
                <strong>Stay:</strong> {trip.ratings?.stay}
              </p>
              <p>
                <strong>Transport:</strong> {trip.ratings?.transport}
              </p>
              <p>
                <strong>Experience:</strong> {trip.ratings?.experience}
              </p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;