import "../css/profile.css";
import LogOut from "../components/LogoutButton";
import ProfileMedia from "../components/ProfileMedia";
import UserStats from "../components/UserStats";

function ProfilePage() {
  return (
    <div className="profile-container">
      <ProfileMedia />
      <UserStats />
      <LogOut />
    </div>
  );
}

export default ProfilePage;
