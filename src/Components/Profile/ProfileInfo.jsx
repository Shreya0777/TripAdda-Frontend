const ProfileInfo = ({ user }) => {
  const joinDate = new Date(user.createdAt).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });

  return (
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
          📅 Joined {joinDate}
        </div>
        <div className="badge bg-hoverBg text-bodyText border-borderMain gap-1">
          📍 {user.location || "India"}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;