import { useQuery, useMutation } from "@apollo/client/react";
import "../css/dashboard.css";
import { GET_CURRENTLY_WATCHING, GET_CURRENT_USER } from "../services/queries";
import { UPDATE_ANIME_ENTRY } from "../services/mutation";
import { toast } from "react-toastify";

function Dashboard() {
  const { data: viewerData } = useQuery(GET_CURRENT_USER);
  const username = viewerData?.Viewer?.name;

  const { loading, error, data } = useQuery(GET_CURRENTLY_WATCHING, {
    variables: { userName: username },
    skip: !username,
  });

  const [updateAnimeEntry] = useMutation(UPDATE_ANIME_ENTRY, {
    update(cache, { data: { SaveMediaListEntry } }) {
      cache.modify({
        id: cache.identify({
          __typename: "MediaList",
          id: SaveMediaListEntry.id,
        }),
        fields: {
          progress: () => SaveMediaListEntry.progress,
        },
      });
    },
  });

  if (loading) return <div className="dashboard-loading">Loading...</div>;
  if (error)
    return <div className="dashboard-error">Error: {error.message}</div>;

  const entries = data?.MediaListCollection?.lists?.[0]?.entries || [];

  const handleProgressChange = async (entry, delta) => {
    const newProgress = entry.progress + delta;
    if (newProgress < 0 || newProgress > (entry.media.episodes || Infinity))
      return;

    try {
      await updateAnimeEntry({
        variables: { mediaId: entry.media.id, progress: newProgress },
        optimisticResponse: {
          SaveMediaListEntry: {
            __typename: "MediaList",
            id: entry.id,
            progress: newProgress,
            status: entry.status,
            updatedAt: Date.now(),
          },
        },
      });
    } catch (err) {
      if (err.message.includes("429")) {
        // 429 is usually "Too Many Requests"
        toast.error("API limit reached. Please try again later.");
      } else {
        toast.error("Failed to update progress.");
      }
    }
  };

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
                      onClick={() => handleProgressChange(entry, -1)}
                    >
                      −
                    </button>
                    <span className="dashboard-progress-text">
                      {entry.progress} / {entry.media.episodes || "?"}
                    </span>
                    <button
                      className="dashboard-button"
                      onClick={() => handleProgressChange(entry, 1)}
                      disabled={
                        entry.media.episodes &&
                        entry.progress >= entry.media.episodes
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="dashboard-score-section"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
