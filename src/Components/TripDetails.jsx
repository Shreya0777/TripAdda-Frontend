import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";

// Small fixed palette just for the budget legend/segmented-bar — the
// app's theme tokens give one accent color, but a multi-category legend
// (Stay/Food/Transport/Sightseeing/Other) needs several distinguishable
// hues, the same way the reference design uses blue for Accommodation
// and orange for Flights.
const BUDGET_COLORS = [
  { bar: "bg-blue-500", dot: "bg-blue-500" },
  { bar: "bg-orange-500", dot: "bg-orange-500" },
  { bar: "bg-emerald-500", dot: "bg-emerald-500" },
  { bar: "bg-violet-500", dot: "bg-violet-500" },
  { bar: "bg-gray-400", dot: "bg-gray-400" },
];

const TABS = ["Overview", "Itinerary", "Budget", "Gallery", "Tips"];

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");

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

  const userName = trip.userId?.name || trip.userId?.username || "Traveler";
  const userImage =
    trip.userId?.photoURL ||
    "https://tse2.mm.bing.net/th/id/OIP.9k6NZTQk5G6g5PVDDDeLiAHaHa?pid=Api&P=0&h=180";

  const parseDayLines = (text) => {
    if (!text) return null;
    const lines = text.split("\n").filter((l) => l.trim());
    const dayPattern = /^day\s*\d+/i;
    const dayLines = lines.filter((l) => dayPattern.test(l.trim()));
    if (dayLines.length < 2) return null;
    return lines.map((line) => {
      const match = line.trim().match(/^day\s*(\d+)\s*[-:]?\s*(.*)$/i);
      return match ? { day: match[1], text: match[2] || line } : { day: null, text: line };
    });
  };

  const dayLines = trip.itinerary?.itineraryType === "text" ? parseDayLines(trip.itinerary?.rawText) : null;

  const budgetRows = [
    { label: "Stay", value: trip.budgetDetails?.stayCost },
    { label: "Food", value: trip.budgetDetails?.foodCost },
    { label: "Transport", value: trip.budgetDetails?.transportCost },
    { label: "Sightseeing", value: trip.budgetDetails?.sightseeingCost },
    { label: "Other", value: trip.budgetDetails?.otherCost },
  ]
    .filter((row) => row.value)
    .map((row, i) => ({ ...row, color: BUDGET_COLORS[i % BUDGET_COLORS.length] }));

  const budgetTotal = budgetRows.reduce((sum, r) => sum + (Number(r.value) || 0), 0) || 1;

  return (
    <div className="min-h-screen bg-page px-3 py-5 sm:px-4 lg:px-6">
      <div className="mx-auto grid grid-cols-1 gap-5 lg:grid-cols-[300px_1fr] lg:gap-10">
        {/* LEFT SIDEBAR — unchanged */}
        <div className="h-fit rounded-2xl bg-cardBg p-4 shadow-sm">
          <img
            src={trip.media?.[0]?.url || "https://source.unsplash.com/500x400/?travel"}
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

            <div className="mt-4 flex items-center gap-3 rounded-xl bg-hoverBg p-3">
              <img src={userImage} alt={userName} className="h-10 w-10 rounded-full object-cover" />
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

            <p className="mt-4 break-words text-sm text-mutedText">🚏 From {trip.boardingPoint}</p>
            {trip.country && <p className="text-sm text-mutedText">🌍 {trip.country}</p>}
            {trip.bestTimeToVisit && (
              <p className="text-sm text-mutedText">📅 Best time: {trip.bestTimeToVisit}</p>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-hoverBg p-3 text-center">
              <p className="font-bold text-headingText">₹{trip.budgetDetails?.totalBudget}</p>
              <p className="text-xs text-mutedText">Total Budget</p>
            </div>
            <div className="rounded-xl bg-hoverBg p-3 text-center">
              <p className="font-bold text-headingText">{trip.duration}</p>
              <p className="text-xs text-mutedText">Days</p>
            </div>
            <div className="rounded-xl bg-hoverBg p-3 text-center">
              <p className="font-bold text-headingText">⭐ {trip.ratings?.overall}</p>
              <p className="text-xs text-mutedText">Rating</p>
            </div>
            <div className="rounded-xl bg-hoverBg p-3 text-center capitalize">
              <p className="font-bold text-headingText">{trip.tripType}</p>
              <p className="text-xs text-mutedText">Trip Type</p>
            </div>
          </div>

          {(trip.transportInfo?.mode || trip.transportInfo?.fare) && (
            <p className="mt-5 text-sm text-mutedText">
              <span className="capitalize">{trip.transportInfo?.mode}</span>
              {trip.transportInfo?.fare ? ` · ₹${trip.transportInfo.fare}` : ""}
            </p>
          )}
        </div>

        {/* RIGHT — tabbed card layout */}
        <div>
          {/* Tab bar — pill-style, active tab filled, like the reference's
              bottom nav but placed at the top of this column since this
              is a web page, not a native app shell. */}
          <div className="mb-6 flex flex-wrap gap-2 rounded-2xl bg-cardBg p-2 shadow-sm">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab
                    ? "bg-primary text-inverseText shadow"
                    : "text-mutedText hover:bg-hoverBg"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {activeTab === "Overview" && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-cardBg p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-mutedText">The Story</p>
                <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-bodyText">
                  {trip.description}
                </p>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-cardBg p-5 shadow-sm">
                <span className="text-3xl">⭐</span>
                <div>
                  <p className="text-xl font-bold text-headingText">{trip.ratings?.overall}/5 Overall Rating</p>
                  <p className="text-sm text-mutedText">As rated by {userName}</p>
                </div>
              </div>
            </div>
          )}

          {/* ITINERARY */}
          {activeTab === "Itinerary" && (
            <div className="rounded-2xl bg-cardBg p-5 shadow-sm">
              {trip.itinerary?.itineraryType === "video" && trip.itinerary?.videoUrl ? (
                <video controls className="w-full rounded-xl object-cover">
                  <source src={trip.itinerary.videoUrl} />
                </video>
              ) : trip.itinerary?.itineraryType === "photos" ? (
                <div className="relative space-y-8 border-l-2 border-borderMain pl-6">
                  {trip.itinerary?.days
                    ?.slice()
                    .sort((a, b) => (a.day || 0) - (b.day || 0))
                    .map((item, index) => (
                      <div key={index} className="relative">
                        <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-inverseText">
                          {item.day}
                        </span>
                        {item.image && (
                          <img
                            src={item.image}
                            alt={`Day ${item.day}`}
                            className="mb-3 h-56 w-full rounded-xl object-cover"
                          />
                        )}
                        <p className="text-[15px] leading-7 text-bodyText">{item.description}</p>
                      </div>
                    ))}
                  {(!trip.itinerary?.days || trip.itinerary.days.length === 0) && (
                    <p className="text-sm text-mutedText">No day-log entries were added.</p>
                  )}
                </div>
              ) : dayLines ? (
                <div className="relative space-y-6 border-l-2 border-borderMain pl-6">
                  {dayLines.map((line, index) => (
                    <div key={index} className="relative">
                      {line.day && (
                        <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-inverseText">
                          {line.day}
                        </span>
                      )}
                      <p className="text-[15px] leading-7 text-bodyText">{line.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="whitespace-pre-line text-[15px] leading-7 text-bodyText">
                  {trip.itinerary?.rawText || "No itinerary details were added."}
                </p>
              )}
            </div>
          )}

          {/* BUDGET — closest match to the reference: big total, a
              segmented multi-color bar, and a colored-dot legend with
              amounts per category. */}
          {activeTab === "Budget" && (
            <div className="rounded-2xl bg-cardBg p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-mutedText">Total Budget</p>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-3xl font-bold text-headingText">₹{trip.budgetDetails?.totalBudget}</p>
                {trip.budgetDetails?.costPerPerson && (
                  <span className="rounded-full bg-hoverBg px-3 py-1 text-xs font-semibold text-primary">
                    ₹{trip.budgetDetails.costPerPerson} / person
                  </span>
                )}
              </div>

              {budgetRows.length > 0 ? (
                <>
                  <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full">
                    {budgetRows.map((row) => (
                      <div
                        key={row.label}
                        className={row.color.bar}
                        style={{ width: `${(Number(row.value) / budgetTotal) * 100}%` }}
                      />
                    ))}
                  </div>

                  <div className="mt-5 space-y-3">
                    {budgetRows.map((row) => (
                      <div key={row.label} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-bodyText">
                          <span className={`h-2.5 w-2.5 rounded-full ${row.color.dot}`} />
                          {row.label}
                        </span>
                        <span className="font-semibold text-headingText">₹{row.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="mt-4 text-sm text-mutedText">No cost breakdown was added for this trip.</p>
              )}
            </div>
          )}

          {/* GALLERY */}
          {activeTab === "Gallery" && (
            <div className="rounded-2xl bg-cardBg p-5 shadow-sm">
              {trip.media?.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {trip.media.map((item, index) =>
                    item.type === "video" ? (
                      <video key={index} controls className="h-40 w-full rounded-xl object-cover">
                        <source src={item.url} />
                      </video>
                    ) : (
                      <img key={index} src={item.url} alt="" className="h-40 w-full rounded-xl object-cover" />
                    ),
                  )}
                </div>
              ) : (
                <p className="text-sm text-mutedText">No photos or videos were added.</p>
              )}
            </div>
          )}

          {/* TIPS */}
          {activeTab === "Tips" && (
            <div className="rounded-2xl bg-cardBg p-5 shadow-sm">
              {trip.travelerTips?.length > 0 ? (
                <div className="space-y-3">
                  {trip.travelerTips.map((tip, index) => (
                    <blockquote
                      key={index}
                      className="relative rounded-xl bg-hoverBg py-4 pl-10 pr-4 text-[15px] italic leading-6 text-bodyText"
                    >
                      <span className="absolute left-3 top-1 text-3xl leading-none text-primary">&ldquo;</span>
                      {tip}
                    </blockquote>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-mutedText">No tips were added for this trip.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetails;