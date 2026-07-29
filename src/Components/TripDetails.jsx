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
      <div className="mx-auto grid  grid-cols-1 gap-5 lg:grid-cols-[300px_1fr] lg:gap-6">
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
            <span className="rounded-full bg-hoverBg px-3 py-1 text-xs capitalize text-primary">
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

            {/* FIX: destination used to be city/state, which we no longer
                collect on the create form — boardingPoint + country are
                the only location fields that actually exist now. */}
            <p className="mt-4 break-words text-sm text-mutedText">
              🚏 From {trip.boardingPoint}
            </p>

            {trip.country && (
              <p className="text-sm text-mutedText">🌍 {trip.country}</p>
            )}

            {trip.bestTimeToVisit && (
              <p className="text-sm text-mutedText">
                📅 Best time: {trip.bestTimeToVisit}
              </p>
            )}
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
            id="boarding"
            icon="🚏"
            title="Boarding Point"
            summary={trip.boardingPoint}
          >
            <p>{trip.boardingPoint}</p>
            {trip.country && (
              <p className="mt-1 text-sm text-mutedText">{trip.country}</p>
            )}
          </Section>

          {/* FIX: transportInfo now only carries mode + fare — the create
              form dropped transportName/route/duration, so those are gone
              from here too rather than silently rendering "undefined". */}
          {(trip.transportInfo?.mode || trip.transportInfo?.fare) && (
            <Section
              id="transport"
              icon="🚌"
              title="Transport Info"
              summary={trip.transportInfo?.mode}
            >
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <p className="capitalize">
                  <strong>Mode:</strong> {trip.transportInfo?.mode}
                </p>
                <p>
                  <strong>Fare:</strong> ₹{trip.transportInfo?.fare}
                </p>
              </div>
            </Section>
          )}

          {trip.bestTimeToVisit && (
            <Section
              id="bestTime"
              icon="📅"
              title="Best Time to Visit"
              summary={trip.bestTimeToVisit}
            >
              <p>{trip.bestTimeToVisit}</p>
            </Section>
          )}

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
            id="itinerary"
            icon="🗓"
            title={
              trip.itinerary?.itineraryType === "photos"
                ? `Itinerary (${trip.itinerary?.days?.length || 0} Days)`
                : "Itinerary"
            }
            summary="Day-wise plan with places to visit"
          >
            {/* FIX: this only ever handled "video" (via videoUrl) and
                otherwise assumed itinerary.days always existed with a
                title/description — but the backend now sends itinerary in
                one of three shapes depending on itineraryType: a plain
                rawText string ("text" mode), day-log entries with a photo
                per day ("photos" mode), or a video URL ("video" mode,
                unchanged). Each is rendered on its own terms now instead of
                assuming the "days" shape for anything that isn't video. */}
            {trip.itinerary?.itineraryType === "video" && trip.itinerary?.videoUrl ? (
              <video
                controls
                className="mt-4 max-h-[400px] w-full rounded-xl object-cover"
              >
                <source src={trip.itinerary.videoUrl} />
              </video>
            ) : trip.itinerary?.itineraryType === "photos" ? (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {trip.itinerary?.days
                  ?.slice()
                  .sort((a, b) => (a.day || 0) - (b.day || 0))
                  .map((item, index) => (
                    <div key={index} className="overflow-hidden rounded-xl bg-hoverBg">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={`Day ${item.day}`}
                          className="h-40 w-full object-cover"
                        />
                      )}
                      <div className="p-4">
                        <p className="text-sm font-medium text-primary">Day {item.day}</p>
                        <p className="mt-1 text-sm text-mutedText">{item.description}</p>
                      </div>
                    </div>
                  ))}
                {(!trip.itinerary?.days || trip.itinerary.days.length === 0) && (
                  <p className="text-sm text-mutedText">No day-log entries were added.</p>
                )}
              </div>
            ) : (
              <p className="mt-4 whitespace-pre-line text-sm text-bodyText">
                {trip.itinerary?.rawText || "No itinerary details were added."}
              </p>
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

          {/* FIX: the create form only collects a single overall rating
              now (budget/safety/food/stay/transport/experience sub-ratings
              were dropped), so this section no longer renders a grid of
              fields that will always be blank. */}
          <Section
            id="ratings"
            icon="⭐"
            title="Overall Rating"
            summary={`${trip.ratings?.overall}/5 overall rating`}
          >
            <p className="text-lg font-semibold text-headingText">
              ⭐ {trip.ratings?.overall}/5
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;