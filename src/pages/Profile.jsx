import { useEffect, useState } from "react";
import axios from "../api/axios";

import ProfileHeader from "../Components/Profile/ProfileHeader";
import ProfileStats from "../Components/Profile/ProfileStats";
import ProfileTabs from "../Components/Profile/ProfileTabs";
import TripsSection from "../Components/Profile/TripSection";
import EmptyState from "../Components/Profile/EmptyState";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [activeTab, setActiveTab] = useState("trips");

  useEffect(() => {
    axios.get("/users/profile/view").then((res) => setUser(res.data));
    axios.get("/trips/my-trips").then((res) => setTrips(res.data));
  }, []);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl overflow-x-hidden bg-page px-3 py-5 text-headingText sm:px-4 sm:py-8">
      <ProfileHeader user={user} />
      <ProfileStats user={user} trips={trips} />
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "trips" && <TripsSection trips={trips} />}

      {activeTab === "saved" && (
        <EmptyState
          icon="🔖"
          title="No saved trips"
          text="Bookmark trips you love!"
        />
      )}

      {activeTab === "reviews" && (
        <EmptyState
          icon="⭐"
          title="No reviews yet"
          text="Reviews will appear here."
        />
      )}
    </div>
  );
};

export default Profile;