function UserStats({ stats }) {
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
