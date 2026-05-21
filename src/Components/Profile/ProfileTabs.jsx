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
    <div className="mt-6 flex gap-2 overflow-x-auto rounded-2xl border border-borderMain bg-cardBg p-2 shadow-sm">

      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`min-w-[110px] flex-1 rounded-xl py-3 font-medium transition-all duration-200 flex items-center justify-center gap-2
          
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