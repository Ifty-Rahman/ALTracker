import { useQuery } from "@apollo/client/react";
import "../css/dashboard.css";
import { GET_CURRENTLY_WATCHING } from "../services/queries";
import { UPDATE_ANIME_ENTRY } from "../services/mutation";
import { GET_CURRENT_USER } from "../services/queries";
import ElasticSlider from "../components/ElasticSlider";

function Dashboard() {
  const { data: viewerData } = useQuery(GET_CURRENT_USER);
  const username = viewerData?.Viewer?.name;

  const { loading, error, data } = useQuery(GET_CURRENTLY_WATCHING, {
    variables: { userName: username },
    skip: !username,
  });

  if (loading) return <div className="dashboard-loading">Loading...</div>;
  if (error)
    return <div className="dashboard-error">Error: {error.message}</div>;

  const entries = data?.MediaListCollection?.lists?.[0]?.entries || [];
  const scoreformat = data?.Viewer?.mediaListOptions?.scoreFormat;

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        {entries.map((entry) => {
          const title = entry.media.title.english || entry.media.title.romaji;
          const cover = entry.media.coverImage.large;

          return (
            <div key={entry.id} className="dashboard-card">
              <div
                className="dashboard-card-image"
                style={{ backgroundImage: `url(${cover})` }}
              >
                <div className="dashboard-card-image-overlay" />
                <h3 className="dashboard-anime-title">{title}</h3>
              </div>

              <div className="dashboard-card-content">
                <div className="dashboard-progress-section">
                  <div className="dashboard-progress-controls">
                    <button
                      className="dashboard-button"
                      disabled={entry.progress <= 0}
                    >
                      −
                    </button>
                    <span className="dashboard-progress-text">
                      {entry.progress} / {entry.media.episodes || "?"}
                    </span>
                    <button className="dashboard-button">+</button>
                  </div>
                </div>

                <div className="dashboard-score-section">{entry.score}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
