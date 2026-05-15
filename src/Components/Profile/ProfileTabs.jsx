const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: "trips",
      icon: "🗺",
      label: "Trips",
    },
    {
      id: "saved",
      icon: "🔖",
      label: "Saved",
    },
    {
      id: "reviews",
      icon: "⭐",
      label: "Reviews",
    },
  ];

  return (
    <div className="mt-6 bg-cardBg border border-borderMain rounded-2xl p-2 flex gap-2 shadow-sm">

      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2
          
          ${
            activeTab === tab.id
              ? "bg-primary text-white shadow-md"
              : "bg-transparent text-bodyText hover:bg-hoverBg"
          }`}
        >
          <span>{tab.icon}</span>

          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ProfileTabs;