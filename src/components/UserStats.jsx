import "../css/UserStats.css";

function UserStats({ stats }) {
  return (
    <div className="user-stats-container">
      <h2 className="overview-title">Overview</h2>

      <div className="stats-box">
        <div className="stats-section left">
          <p className="section-title">Anime</p>
          <div className="stat-item">
            <p className="stat-label">Total Entries</p>
            <p className="stat-value">{stats?.anime.count}</p>
          </div>
          <div className="stat-item">
            <p className="stat-label">Time Watched</p>
            <p className="stat-value">
              {(stats?.anime.minutesWatched / 60).toFixed()} hr
            </p>
          </div>
          <div className="stat-item">
            <p className="stat-label">Mean Score</p>
            <p className="stat-value">{stats?.anime.meanScore}</p>
          </div>
        </div>

        <div className="divider"></div>

        <div className="stats-section right">
          <p className="section-title">Manga</p>
          <div className="stat-item">
            <p className="stat-label">Total Entries</p>
            <p className="stat-value">{stats?.manga.count}</p>
          </div>
          <div className="stat-item">
            <p className="stat-label">Chapters Read</p>
            <p className="stat-value">{stats?.manga.chaptersRead}</p>
          </div>
          <div className="stat-item">
            <p className="stat-label">Mean Score</p>
            <p className="stat-value">{stats?.manga.meanScore}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserStats;
