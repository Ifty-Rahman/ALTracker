import "../css/UserStats.css";

function UserStats({ stats }) {
  const animeGenres = stats?.anime?.genres || [];
  const mangaGenres = stats?.manga?.genres || [];
  const topAnimeGenres = [...animeGenres]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const topMangaGenres = [...mangaGenres]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="user-stats-container">
      <h2 className="overview-title">Overview</h2>

      <div className="stats-box">
        <div className="stats-section left">
          <p className="section-title">Anime</p>
          <div className="stat-item">
            <span className="stat-label">Total Entries</span>
            <span className="stat-value">{stats?.anime.count}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Time Watched</span>
            <span className="stat-value">
              {(stats?.anime.minutesWatched / 60).toFixed()} hr
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Mean Score</span>
            <span className="stat-value">{stats?.anime.meanScore}</span>
          </div>
        </div>

        <div className="divider"></div>

        <div className="stats-section right">
          <p className="section-title">Manga</p>
          <div className="stat-item">
            <span className="stat-label">Total Entries</span>
            <span className="stat-value">{stats?.manga.count}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Chapters Read</span>
            <span className="stat-value">{stats?.manga.chaptersRead}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Mean Score</span>
            <span className="stat-value">{stats?.manga.meanScore}</span>
          </div>
        </div>
      </div>

      <h2 className="genre-title">Top Genres</h2>

      <div className="genres-box">
        <div className="top-genres">
          <h3>Anime</h3>
          {topAnimeGenres.map((g) => (
            <div key={g.genre} className="genre-row">
              <div className="genre-name">{g.genre}</div>
              <div className="genre-count">{g.count}</div>
            </div>
          ))}
        </div>

        <div className="divider genres-divider"></div>

        <div className="top-genres">
          <h3>Manga</h3>
          {topMangaGenres.map((g) => (
            <div key={g.genre} className="genre-row">
              <div className="genre-name">{g.genre}</div>
              <div className="genre-count">{g.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserStats;
