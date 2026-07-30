import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  if (!trip) return <div className="p-10 text-center">Loading...</div>;

  const userName = trip.userId?.name || trip.userId?.username || "Traveler";
  const userImage =
    trip.userId?.photoURL ||
    "https://tse2.mm.bing.net/th/id/OIP.9k6NZTQk5G6g5PVDDDeLiAHaHa?pid=Api&P=0&h=180";

  // A small "kicker" label above a heading — the editorial convention of
  // a short all-caps line that frames what's coming, instead of an
  // icon-in-a-box that made every section look like a settings panel.
  const SectionHeading = ({ eyebrow, title }) => (
    <div className="mb-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
      <h2 className="mt-1 text-xl font-bold text-headingText sm:text-2xl">{title}</h2>
    </div>
  );

  // Renders "text" mode itinerary as a day-by-day timeline when the raw
  // text follows a "Day 1 - ..." / "Day 2 - ..." pattern (which is what
  // the create form's placeholder guides people toward), and falls back
  // to plain flowing paragraphs otherwise — so it never looks broken for
  // someone who just wrote free-form prose instead.
  const parseDayLines = (text) => {
    if (!text) return null;
    const lines = text.split("\n").filter((l) => l.trim());
    const dayPattern = /^day\s*\d+/i;
    const dayLines = lines.filter((l) => dayPattern.test(l.trim()));
    if (dayLines.length < 2) return null;
    return lines.map((line, i) => {
      const match = line.trim().match(/^day\s*(\d+)\s*[-:]?\s*(.*)$/i);
      return match
        ? { day: match[1], text: match[2] || line }
        : { day: null, text: line };
    });
  };

  const dayLines = trip.itinerary?.itineraryType === "text" ? parseDayLines(trip.itinerary?.rawText) : null;

  const budgetRows = [
    { label: "Stay", value: trip.budgetDetails?.stayCost },
    { label: "Food", value: trip.budgetDetails?.foodCost },
    { label: "Transport", value: trip.budgetDetails?.transportCost },
    { label: "Sightseeing", value: trip.budgetDetails?.sightseeingCost },
    { label: "Other", value: trip.budgetDetails?.otherCost },
  ].filter((row) => row.value);
  const budgetMax = Math.max(1, ...budgetRows.map((r) => Number(r.value) || 0));

  return (
    <div className="min-h-screen bg-page px-3 py-5 sm:px-4 lg:px-6">
      <div className="mx-auto grid grid-cols-1 gap-5 lg:grid-cols-[300px_1fr] lg:gap-10">
        {/* LEFT SIDEBAR — the "facts" panel, kept compact and scannable
            so the right column is free to read like an article. */}
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

        {/* RIGHT — the actual story, read top to bottom rather than
            scanned box by box. */}
        <article className="space-y-10">
          {/* THE STORY — full description, no truncation, set with
              generous line-height and a drop-cap opening letter, the way
              a travel feature would actually open. */}
          <section>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">The Story</p>
            <p className="mt-3 whitespace-pre-line text-[17px] leading-8 text-bodyText first-letter:float-left first-letter:mr-3 first-letter:text-5xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-primary">
              {trip.description}
            </p>
          </section>

          <hr className="border-borderMain" />

          {/* ITINERARY — a day-by-day timeline for text/photos modes,
              instead of an isolated grid of boxes that reads more like a
              spreadsheet than a trip. */}
          <section>
            <SectionHeading eyebrow="Day by Day" title="Itinerary" />

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
          </section>

          <hr className="border-borderMain" />

          {/* BUDGET — a proportional bar reads faster than five separate
              boxed numbers with nothing to compare them against. */}
          {budgetRows.length > 0 && (
            <section>
              <SectionHeading eyebrow={`₹${trip.budgetDetails?.totalBudget} total`} title="Where the money went" />
              <div className="space-y-3">
                {budgetRows.map((row) => (
                  <div key={row.label}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-bodyText">{row.label}</span>
                      <span className="font-medium text-headingText">₹{row.value}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-hoverBg">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${Math.max((Number(row.value) / budgetMax) * 100, 4)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <hr className="border-borderMain" />

          {/* GALLERY — already visual, kept as a grid. */}
          {trip.media?.length > 0 && (
            <section>
              <SectionHeading eyebrow={`${trip.media.length} photos/videos`} title="Trip Gallery" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                {trip.media.map((item, index) =>
                  item.type === "video" ? (
                    <video key={index} controls className="h-40 w-full rounded-xl object-cover sm:h-32">
                      <source src={item.url} />
                    </video>
                  ) : (
                    <img key={index} src={item.url} alt="" className="h-40 w-full rounded-xl object-cover sm:h-32" />
                  ),
                )}
              </div>
            </section>
          )}

          {/* TIPS — pull-quote cards read like advice from a person, not
              bullet points in a form field. */}
          {trip.travelerTips?.length > 0 && (
            <section>
              <SectionHeading eyebrow="In their words" title="Tips from the Traveler" />
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
            </section>
          )}

          <hr className="border-borderMain" />

          {/* VERDICT — the single overall rating, framed as a closing
              takeaway rather than one more boxed stat. */}
          <section className="flex items-center gap-4 rounded-2xl bg-cardBg p-6">
            <span className="text-4xl">⭐</span>
            <div>
              <p className="text-2xl font-bold text-headingText">{trip.ratings?.overall}/5</p>
              <p className="text-sm text-mutedText">This traveler's overall rating for the trip</p>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
};

export default TripDetails;