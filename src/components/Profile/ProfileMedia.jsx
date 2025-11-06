import "../../css/Profile.css";

function ProfileMedia({ user }) {
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
