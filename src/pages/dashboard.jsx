import { useQuery, useMutation } from "@apollo/client/react";
import "../css/dashboard.css";
import { GET_CURRENTLY_WATCHING, GET_CURRENT_USER } from "../services/queries";
import { UPDATE_ANIME_ENTRY } from "../services/mutation";
import { toast } from "react-toastify";
import { InlineEdit } from "rsuite";
import { useState } from "react";
import "rsuite/dist/rsuite.min.css";

function Dashboard() {
  const { data: viewerData } = useQuery(GET_CURRENT_USER);
  const username = viewerData?.Viewer?.name;

  const [editingId, setEditingId] = useState(null);
  const [tempScore, setTempScore] = useState("");

  const { loading, error, data } = useQuery(GET_CURRENTLY_WATCHING, {
    variables: { userName: username },
    skip: !username,
  });

  function getScoreDisplay(entry, scoreFormat) {
    const score = entry?.score ?? 0;

    switch (scoreFormat) {
      case "POINT_100":
        return `${score} / 100`;
      case "POINT_10":
        return `${score} / 10`;
      case "POINT_10_DECIMAL":
        return `${score.toFixed(1)} / 10`;
      case "POINT_5":
        return `${score} / 5`;
      case "POINT_3":
        return `${score} / 3`;
      default:
        return `${score}`;
    }
  }

  function validateScore(value, format) {
    switch (format) {
      case "POINT_100":
        return /^\d{1,3}$/.test(value) && value >= 0 && value <= 100;
      case "POINT_10":
        return /^\d{1,2}$/.test(value) && value >= 0 && value <= 10;
      case "POINT_10_DECIMAL":
        return /^\d{1,2}(\.\d)?$/.test(value) && value >= 0 && value <= 10;
      case "POINT_5":
        return /^[0-5]$/.test(value);
      case "POINT_3":
        return /^[1-3]$/.test(value);
      default:
        return true;
    }
  }

  async function handleScoreUpdate(
    entry,
    newScore,
    scoreFormat,
    updateAnimeEntry,
  ) {
    const value = newScore.trim();
    if (!validateScore(value, scoreFormat)) {
      toast.error("Enter a valid score for your format!");
      return;
    }

    try {
      await updateAnimeEntry({
        variables: {
          mediaId: entry.media.id,
          score: parseFloat(value),
        },
        optimisticResponse: {
          SaveMediaListEntry: {
            __typename: "MediaList",
            id: entry.id,
            score: parseFloat(value),
            progress: entry.progress,
            status: entry.status,
            updatedAt: Date.now(),
          },
        },
      });
      toast.success("Score updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update score.");
    }
  }

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
  const scoreFormat = data?.User?.mediaListOptions?.scoreFormat;

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
        toast.error("API limit reached. Please try again 1 minute later.");
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

                <div className="dashboard-score-section">
                  <span className="dashboard-score-text">Score:</span>
                  {editingId === entry.id ? (
                    <input
                      type="text"
                      defaultValue={entry.score || ""}
                      onChange={(e) => setTempScore(e.target.value)}
                      onBlur={() => {
                        handleScoreUpdate(
                          entry,
                          tempScore,
                          scoreFormat,
                          updateAnimeEntry,
                        );
                        setEditingId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.target.blur();
                        }
                      }}
                      autoFocus
                      style={{ width: "60px", padding: "2px 6px" }}
                    />
                  ) : (
                    <span
                      className="dashboard-score-display"
                      onClick={() => {
                        setEditingId(entry.id);
                        setTempScore(entry.score?.toString() || "");
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {getScoreDisplay(entry, scoreFormat)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
