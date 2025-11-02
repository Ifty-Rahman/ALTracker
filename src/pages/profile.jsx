import "../css/profile.css";
import { useState, useEffect } from "react";
import LogOut from "../components/LogoutButton";
import ProfileMedia from "../components/ProfileMedia";
import UserStats from "../components/UserStats";
import { GET_CURRENT_USER, GET_USER_STATISTICS } from "../services/queries";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import { TrophySpin } from "react-loading-indicators";

function ProfilePage() {
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("anilist_token"),
  );

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthToken(localStorage.getItem("anilist_token"));
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: "cache-first",
    skip: !authToken,
  });

  const user = userData?.Viewer;
  const username = user?.name;

  const { loading, error, data } = useQuery(GET_USER_STATISTICS, {
    variables: { userName: username },
    skip: !authToken || !username,
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
    <div className="profile-main">
      {authToken ? (
        <div className="profile-container">
          <ProfileMedia user={user} />
          <UserStats stats={stats} />
          <LogOut />
        </div>
      ) : (
        <div className="Not-Logged-In">
          <p>Please log in to see your profile</p>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
