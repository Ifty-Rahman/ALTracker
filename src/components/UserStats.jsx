import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { GET_USER_STATISTICS, GET_CURRENT_USER } from "../services/queries";

function UserStats() {
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_CURRENT_USER);

  const username = userData?.Viewer?.name;

  const { loading, error, data } = useQuery(GET_USER_STATISTICS, {
    variables: { userName: username },
    skip: !username,
  });

  const [stats, setStats] = useState();

  useEffect(() => {
    if (data) {
      setStats(data.Viewer.statistics.anime);
    }
  }, [data]);

  if (userLoading || loading) return <p>Loading...</p>;
  if (userError) return <p>Error: {userError.message}</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="user-stats">
      <h2>Overview</h2>
      <p>Anime</p>
      <p>Total Entries</p>
      <p>{stats?.count}</p>
      <p>Time Watched</p>
      <p>{(stats?.minutesWatched / 60).toFixed()} hours</p>
      <p>Mean Score</p>
      <p>{stats?.meanScore}</p>
    </div>
  );
}

export default UserStats;
