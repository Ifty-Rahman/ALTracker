import { useQuery } from "@apollo/client/react";
import { GET_CURRENT_USER } from "../services/queries";

function ProfilePage() {
  const { loading, error, data } = useQuery(GET_CURRENT_USER);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const user = data.Viewer;

  return (
    <div>
      <h1>User Profile</h1>
      <div className="profile-card">
        <img
          src={user.avatar.large}
          alt={`${user.name}'s avatar`}
          className="profile-avatar"
        />
        <h2>{user.name}</h2>
        {user.bannerImage && (
          <img
            src={user.bannerImage}
            alt={`${user.name}'s banner`}
            className="profile-banner"
          />
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
