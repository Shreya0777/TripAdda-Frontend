import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";

const PublicProfile = () => {
  const { id } = useParams();
  const [profileUser, setProfileUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users/profile/${id}`, {
        withCredentials: true,
      });

      setProfileUser(res.data);
    };

    fetchUser();
  }, [id]);

  if (!profileUser) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-page p-6">
      <div className="mx-auto max-w-xl rounded-2xl bg-cardBg p-6 shadow">
        <img
          src={profileUser.photoURL}
          alt={profileUser.name}
          className="h-24 w-24 rounded-full object-cover"
        />

        <h1 className="mt-4 text-2xl font-bold text-headingText">
          {profileUser.name}
        </h1>

        <p className="text-mutedText">@{profileUser.username}</p>
        <p className="mt-4 text-bodyText">{profileUser.About}</p>
      </div>
    </div>
  );
};

export default PublicProfile;