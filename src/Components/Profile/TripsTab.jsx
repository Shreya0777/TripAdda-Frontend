import TripCard from "./TripCard";
import EmptyState from "./EmptyState";

const TripsTab = ({ trips }) => {
  if (trips.length === 0) {
    return (
      <div className="mt-5">
        <EmptyState
          icon="🧳"
          title="No trips yet"
          description="Share your first trip!"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 mt-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
        {trips.map((trip) => (
          <TripCard key={trip._id} trip={trip} />
        ))}
      </div>
      
      <div className="lg:w-60 flex justify-center lg:block">
        <div className="bg-sectionBg rounded-2xl p-4 text-center shadow-md sticky top-20">
          <p className="text-sm mb-2">Got a new journey?</p>
          <button className="btn btn-primary btn-sm w-full">
            Share your next trip ✈
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripsTab;
