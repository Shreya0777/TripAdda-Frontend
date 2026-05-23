import { Link } from "react-router-dom";

const TripCard = ({ trip }) => {
  return (
    <Link to={`/trips/${trip._id}`}>
      <div className="h-full overflow-hidden rounded-2xl bg-cardBg shadow-sm transition hover:shadow-md">
        {/* IMAGE */}
        <img
          src={
            trip.media?.[0]?.url
              ? trip.media[0].url
              : "https://source.unsplash.com/400x300/?travel"
          }
          alt={trip.title}
          className="h-44 w-full object-cover sm:h-52"
        />

        {/* CONTENT */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
           <h2 className="mb-4 text-lg font-semibold sm:mb-5 sm:text-xl">{trip.title}</h2>
            <span className="text-sm text-accent">
              ⭐ {trip.rating || 4.5}
            </span>
          </div>

          <p className="text-mutedText text-sm mt-2 line-clamp-2">
            {trip.description}
          </p>

          {/* FOOTER */}
          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs text-lightText">TOTAL BUDGET</p>
              <p className="text-linkText font-semibold">
                ₹{trip.costPerPerson}/per
              </p>
            </div>

            <div className="text-sm text-mutedText">{trip.duration} Days</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TripCard;
