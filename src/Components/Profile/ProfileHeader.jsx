const ProfileHeader = ({ user }) => {
  return (
    <>
      <div className="relative h-36 rounded-2xl bg-gradient-to-r from-profileGradientFrom via-profileGradientVia to-profileGradientTo sm:h-48">
        <div className="badge absolute bottom-3 right-3 border-borderInverse/20 bg-cardBg/20 text-xs text-inverseText opacity-80 sm:right-4">
          ✈ {user.countries || 0} countries explored
        </div>
      </div>

      <div className="-mt-10 flex items-end justify-between px-3 sm:px-4">
        <div className="avatar">
          <div className="w-20 rounded-full ring ring-cardBg ring-offset-2 ring-offset-cardBg">
            <img
              src={
                user.photoURL ||
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              }
              alt="avatar"
            />
          </div>
        </div>
        <button className="btn btn-outline btn-sm mb-1 border-borderMain text-headingText hover:bg-hoverBg">
          Edit Profile
        </button>
      </div>

      <div className="mt-4 px-3 sm:px-4">
        <h2 className="break-words text-xl font-bold text-headingText">{user.name}</h2>
        <p className="break-words text-sm text-mutedText">@{user.username}</p>

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