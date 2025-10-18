import { useQuery } from "@apollo/client/react";
import { GET_CURRENT_USER } from "../services/queries";
import "../css/profile.css";

function ProfileMedia() {
  const { loading, error, data } = useQuery(GET_CURRENT_USER);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const user = data.Viewer;

  return (
    <div className="profile-banner-section">
      {user.bannerImage ? (
        <>
          <img
            src={user.bannerImage}
            alt={`${user.name}'s banner`}
            className="profile-banner"
          />
          <div className="profile-info-overlay">
            <img
              src={user.avatar.large}
              alt={`${user.name}'s avatar`}
              className="profile-avatar"
            />
            <h1 className="profile-name">{user.name}</h1>
          </div>
        </>
      ) : (
        <div className="profile-info-overlay no-banner">
          <img
            src={user.avatar.large}
            alt={`${user.name}'s avatar`}
            className="profile-avatar"
          />
          <h1 className="profile-name">{user.name}</h1>
        </div>
      )}
    </div>
  );
}

export default ProfileMedia;
