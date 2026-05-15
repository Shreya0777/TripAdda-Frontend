import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";

const TripDetails = () => {
  const { id } = useParams();
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

  const Section = ({ id, icon, title, summary, children }) => (
    <div className="bg-cardBg border border-borderMain rounded-xl overflow-hidden">
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-4">
          <span className="text-xl">{icon}</span>

          <div>
            <h3 className="font-semibold text-headingText">{title}</h3>
            {summary && <p className="text-sm text-mutedText">{summary}</p>}
          </div>
        </div>

        <span className="text-xl text-mutedText">
          {openSection === id ? "⌃" : "›"}
        </span>
      </button>

      {openSection === id && (
        <div className="px-4 pb-4 text-bodyText border-t border-borderMain">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-pageBg p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">

        {/* LEFT SIDEBAR */}
        <div className="bg-cardBg rounded-2xl p-4 shadow-sm h-fit">
          <img
            src={
              trip.media?.[0]?.url ||
              "https://source.unsplash.com/500x400/?travel"
            }
            alt="trip"
            className="w-full h-52 object-cover rounded-xl"
          />

          <div className="mt-4">
            <span className="text-xs bg-hoverBg text-primary px-3 py-1 rounded-full">
              {trip.tripType || "Trip"}
            </span>

            <h1 className="text-2xl font-bold text-headingText mt-3">
              {trip.title}
            </h1>

            <p className="text-sm text-mutedText mt-2">
              📍 {trip.destination?.city}, {trip.destination?.state}
            </p>

            <p className="text-sm text-mutedText">
              🚏 From {trip.boardingPoint}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-hoverBg rounded-xl p-3 text-center">
              <p className="font-bold text-headingText">
                ₹{trip.budgetDetails?.costPerPerson}
              </p>
              <p className="text-xs text-mutedText">Per Person</p>
            </div>

            <div className="bg-hoverBg rounded-xl p-3 text-center">
              <p className="font-bold text-headingText">{trip.duration}</p>
              <p className="text-xs text-mutedText">Days</p>
            </div>

            <div className="bg-hoverBg rounded-xl p-3 text-center">
              <p className="font-bold text-headingText">
                ⭐ {trip.ratings?.overall}
              </p>
              <p className="text-xs text-mutedText">Rating</p>
            </div>

            <div className="bg-hoverBg rounded-xl p-3 text-center capitalize">
              <p className="font-bold text-headingText">{trip.tripType}</p>
              <p className="text-xs text-mutedText">Trip Type</p>
            </div>
          </div>

          <p className="text-sm text-bodyText mt-5 leading-6">
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
            <p>{trip.destination?.city}, {trip.destination?.state}, {trip.destination?.country}</p>
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
            summary={`${trip.transportInfo?.transportName || ""} ${trip.transportInfo?.route || ""}`}
          >
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <p><strong>Mode:</strong> {trip.transportInfo?.mode}</p>
              <p><strong>Name:</strong> {trip.transportInfo?.transportName}</p>
              <p><strong>Route:</strong> {trip.transportInfo?.route}</p>
              <p><strong>Duration:</strong> {trip.transportInfo?.duration}</p>
              <p><strong>Fare:</strong> ₹{trip.transportInfo?.fare}</p>
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
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <p><strong>Per Person:</strong> ₹{trip.budgetDetails?.costPerPerson}</p>
              <p><strong>Stay:</strong> ₹{trip.budgetDetails?.stayCost}</p>
              <p><strong>Food:</strong> ₹{trip.budgetDetails?.foodCost}</p>
              <p><strong>Transport:</strong> ₹{trip.budgetDetails?.transportCost}</p>
              <p><strong>Sightseeing:</strong> ₹{trip.budgetDetails?.sightseeingCost}</p>
              <p><strong>Other:</strong> ₹{trip.budgetDetails?.otherCost}</p>
            </div>
          </Section>

          <Section
            id="stay"
            icon="🏨"
            title="Stay Details"
            summary={`${trip.stayDetails?.hotelName || ""} ${trip.stayDetails?.location || ""}`}
          >
            <div className="space-y-2 mt-4">
              <p><strong>Hotel:</strong> {trip.stayDetails?.hotelName}</p>
              <p><strong>Location:</strong> {trip.stayDetails?.location}</p>
              <p><strong>Type:</strong> {trip.stayDetails?.stayType}</p>
              <p><strong>Price:</strong> ₹{trip.stayDetails?.pricePerNight}/night</p>
              <p><strong>Rating:</strong> ⭐ {trip.stayDetails?.rating}</p>
              <p>{trip.stayDetails?.stayReview}</p>
            </div>
          </Section>

          <Section
            id="food"
            icon="🍜"
            title="Food Recommendation"
            summary={trip.foodRecommendations?.mustTryFoods?.join(", ")}
          >
            <div className="space-y-3 mt-4">
              <p><strong>Must Try:</strong> {trip.foodRecommendations?.mustTryFoods?.join(", ")}</p>
              <p><strong>Cafes:</strong> {trip.foodRecommendations?.cafes?.join(", ")}</p>
              <p><strong>Budget Options:</strong> {trip.foodRecommendations?.budgetFoodOptions?.join(", ")}</p>
            </div>
          </Section>

          <Section
            id="hidden"
            icon="🌄"
            title="Hidden Spots"
            summary={`${trip.hiddenSpots?.length || 0} hidden gems`}
          >
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              {trip.hiddenSpots?.map((spot, index) => (
                <div key={index} className="bg-hoverBg p-3 rounded-xl">
                  <h4 className="font-semibold text-headingText">{spot.title}</h4>
                  <p className="text-sm text-mutedText">{spot.description}</p>
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
            {trip.itinerary?.itineraryType === "video" && trip.itinerary?.videoUrl ? (
              <video controls className="w-full rounded-xl mt-4 max-h-[400px] object-cover">
                <source src={trip.itinerary.videoUrl} />
              </video>
            ) : (
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {trip.itinerary?.days?.map((item, index) => (
                  <div key={index} className="bg-hoverBg p-4 rounded-xl">
                    <p className="text-sm text-primary font-medium">
                      Day {item.day}
                    </p>
                    <h4 className="font-semibold text-headingText mt-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-mutedText mt-1">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {trip.media?.map((item, index) => (
                item.type === "video" ? (
                  <video key={index} controls className="h-32 w-full object-cover rounded-xl">
                    <source src={item.url} />
                  </video>
                ) : (
                  <img
                    key={index}
                    src={item.url}
                    alt=""
                    className="h-32 w-full object-cover rounded-xl"
                  />
                )
              ))}
            </div>
          </Section>

          <Section
            id="tips"
            icon="💡"
            title="Tips from the Traveler"
            summary={`${trip.travelerTips?.length || 0} tips`}
          >
            <ul className="list-disc pl-5 mt-4 space-y-2">
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
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <p><strong>Budget:</strong> {trip.ratings?.budget}</p>
              <p><strong>Safety:</strong> {trip.ratings?.safety}</p>
              <p><strong>Food:</strong> {trip.ratings?.food}</p>
              <p><strong>Stay:</strong> {trip.ratings?.stay}</p>
              <p><strong>Transport:</strong> {trip.ratings?.transport}</p>
              <p><strong>Experience:</strong> {trip.ratings?.experience}</p>
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
};

export default TripDetails;