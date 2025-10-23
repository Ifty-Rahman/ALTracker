import "../css/profile.css";
import LogOut from "../components/LogoutButton";
import ProfileMedia from "../components/ProfileMedia";
import UserStats from "../components/UserStats";
import { GET_CURRENT_USER, GET_USER_STATISTICS } from "../services/queries";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

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
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const stats = useMemo(() => {
    return data?.Viewer?.statistics?.anime;
  }, [data]);

  if (userLoading || loading) return <p>Loading...</p>;
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
