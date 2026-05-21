const ProfileStats = ({ user, trips }) => {
  return (
    <div className="stats stats-vertical mt-6 w-full border border-borderMain bg-cardBg shadow sm:stats-horizontal">
      <div className="stat place-items-center">
        <div className="stat-value text-lg text-headingText sm:text-xl">{trips.length}</div>
        <div className="stat-desc text-mutedText">Trips shared</div>
      </div>

      <div className="stat place-items-center">
        <div className="stat-value text-lg text-headingText sm:text-xl">{user.countries || 0}</div>
        <div className="stat-desc text-mutedText">Countries</div>
      </div>

      <div className="stat place-items-center">
        <div className="stat-value text-lg text-headingText sm:text-xl">4.8</div>
        <div className="stat-desc text-mutedText">Avg rating</div>
      </div>

      <div className="stat place-items-center">
        <div className="stat-value text-lg text-headingText sm:text-xl">2.1k</div>
        <div className="stat-desc text-mutedText">Helped</div>
      </div>
    </div>
  );
};

export default ProfileStats;