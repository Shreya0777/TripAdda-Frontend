const EmptyState = ({ icon, title, text }) => {
  return (
    <div className="hero bg-cardBg border border-borderMain rounded-2xl mt-5 py-12">
      <div className="hero-content text-center">
        <div>
          <p className="text-4xl mb-3">{icon}</p>
          <h3 className="font-bold text-lg text-headingText">{title}</h3>
          <p className="text-sm text-mutedText mt-1">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;