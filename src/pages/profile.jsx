import { useQuery } from "@apollo/client/react";
import { GET_CURRENT_USER } from "../services/queries";

function ProfilePage() {
  const { loading, error, data } = useQuery(GET_CURRENT_USER);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const user = data.Viewer;

  return (
    <div>
      <div className="profile-card">
        {user.bannerImage && (
          <img
            src={user.bannerImage}
            alt={`${user.name}'s banner`}
            className="profile-banner"
          />
        )}
        <img
          src={user.avatar.large}
          alt={`${user.name}'s avatar`}
          className="profile-avatar"
        />
        <p>{user.name}</p>
      </div>
    </div>
  );
}

export default ProfilePage;
