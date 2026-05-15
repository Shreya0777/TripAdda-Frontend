const ProfileStats = ({ user, trips }) => {
  return (
    <div className="stats stats-horizontal shadow w-full mt-6 bg-cardBg border border-borderMain">
      <div className="stat place-items-center">
        <div className="stat-value text-xl text-headingText">{trips.length}</div>
        <div className="stat-desc text-mutedText">Trips shared</div>
      </div>

      <div className="stat place-items-center">
        <div className="stat-value text-xl text-headingText">{user.countries || 0}</div>
        <div className="stat-desc text-mutedText">Countries</div>
      </div>

      <div className="stat place-items-center">
        <div className="stat-value text-xl text-headingText">4.8</div>
        <div className="stat-desc text-mutedText">Avg rating</div>
      </div>

      <div className="stat place-items-center">
        <div className="stat-value text-xl text-headingText">2.1k</div>
        <div className="stat-desc text-mutedText">Helped</div>
      </div>
    </div>
  );
};

export default ProfileStats;