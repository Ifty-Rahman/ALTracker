import "../css/profile.css";
import LogOut from "../components/LogoutButton";
import ProfileMedia from "../components/ProfileMedia";
import UserStats from "../components/UserStats";
import { GET_CURRENT_USER, GET_USER_STATISTICS } from "../services/queries";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import { TrophySpin } from "react-loading-indicators";

function ProfilePage() {
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: "cache-first",
  });

  const user = userData?.Viewer;
  const username = user?.name;

  const { loading, error, data } = useQuery(GET_USER_STATISTICS, {
    variables: { userName: username },
    skip: !username,
    fetchPolicy: "cache-first",
  });

  const stats = useMemo(() => {
    return data?.Viewer?.statistics;
  }, [data]);

  if (userLoading || loading)
    return (
      <div className="loading-indicator">
        <TrophySpin color="#6e35ff" size="large" />
      </div>
    );
  if (userError) return <p>Error: {userError.message}</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="profile-container">
      <ProfileMedia user={user} />
      <UserStats stats={stats} />
      <LogOut />
    </div>
  );
}

export default ProfilePage;
