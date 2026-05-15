const ProfileHeader = ({ user }) => {
  return (
    <>
      <div className="h-48 bg-gradient-to-r from-profileGradientFrom via-profileGradientVia to-profileGradientTo">
        <div className="absolute bottom-3 right-4 badge bg-cardBg/20 text-white border-white/20 text-xs opacity-60">
          ✈ {user.countries || 0} countries explored
        </div>
      </div>

      <div className="flex justify-between items-end -mt-10 px-4">
        <div className="avatar">
          <div className="w-20 rounded-full ring ring-cardBg ring-offset-cardBg ring-offset-2">
            <img
              src={
                user.photoURL ||
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              }
              alt="avatar"
            />
          </div>
        </div>
        <button className="btn btn-sm btn-outline mb-1 border-borderMain text-headingText hover:bg-hoverBg">
          Edit Profile
        </button>
      </div>

      <div className="px-4 mt-4">
        <h2 className="text-xl font-bold text-headingText">{user.name}</h2>
        <p className="text-sm text-mutedText">@{user.username}</p>

        {user.About && (
          <p className="text-sm text-bodyText mt-2 max-w-md">
            {user.About}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
          <div className="badge bg-hoverBg text-bodyText border-borderMain gap-1">
            📅 Joined{" "}
            {new Date(user.createdAt).toLocaleDateString("en-IN", {
              month: "short",
              year: "numeric",
            })}
          </div>
          <div className="badge bg-hoverBg text-bodyText border-borderMain gap-1">
            📍 {user.location || "India"}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;