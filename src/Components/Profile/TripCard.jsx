import { Link } from "react-router-dom";

const TripCard = ({ trip }) => {
  return (
    <Link to={`/trips/${trip._id}`}>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer">
        {/* IMAGE */}
        <img
          src={
            trip.media?.[0]?.url
              ? trip.media[0].url
              : "https://source.unsplash.com/400x300/?travel"
          }
          alt={trip.title}
          className="w-full h-52 object-cover"
        />

        {/* CONTENT */}
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">{trip.title}</h2>
            <span className="text-sm text-orange-500">
              ⭐ {trip.rating || 4.5}
            </span>
          </div>

          <p className="text-gray-500 text-sm mt-2 line-clamp-2">
            {trip.description}
          </p>

          {/* FOOTER */}
          <div className="flex justify-between items-center mt-4">
            <div>
              <p className="text-xs text-gray-400">TOTAL BUDGET</p>
              <p className="text-blue-600 font-semibold">
                ₹{trip.costPerPerson}/per
              </p>
            </div>

            <div className="text-sm text-gray-500">{trip.duration} Days</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TripCard;
