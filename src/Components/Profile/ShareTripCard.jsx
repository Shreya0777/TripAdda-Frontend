import { useNavigate } from "react-router-dom";


const ShareTripCard = () => {

  const navigate= useNavigate();
  return (
    <div className="flex justify-center lg:block">
      <div className="sticky top-20 rounded-2xl bg-sectionBg p-4 text-center shadow-md">
        <p className="text-sm mb-2">Got a new journey?</p>
        <button className="btn btn-primary btn-sm w-full" onClick={()=>navigate("/create-trip")}>
          Share your next trip ✈
        </button>
      </div>
    </div>
  );
};

export default ShareTripCard;