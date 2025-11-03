import { useQuery, useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import "../css/Dashboard.css";
import { GET_CURRENT_MEDIA, GET_CURRENT_USER } from "../services/Queries.jsx";
import {
  UPDATE_ANIME_ENTRY,
  UPDATE_MANGA_ENTRY,
} from "../services/Mutation.jsx";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { GoCheck, GoX } from "react-icons/go";
import { TrophySpin } from "react-loading-indicators";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

function Dashboard() {
  const navigate = useNavigate();
  const [mediaType, setMediaType] = useState("ANIME");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace("#", ""));
      const token = params.get("access_token");
      if (token) {
        localStorage.setItem("anilist_token", token);
        window.dispatchEvent(new Event("authChange"));
        window.history.replaceState(null, null, window.location.pathname);
        window.location.reload();
      }
    }
  }, []);

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

  const { data: viewerData } = useQuery(GET_CURRENT_USER, {
    skip: !authToken,
  });
  const username = viewerData?.Viewer?.name;

  const [editingId, setEditingId] = useState(null);
  const [tempScore, setTempScore] = useState("");

  const { loading, error, data } = useQuery(GET_CURRENT_MEDIA, {
    variables: { userName: username, type: mediaType },
    skip: !authToken || !username,
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
    const num = parseFloat(value);
    switch (format) {
      case "POINT_100":
        return /^\d{1,3}$/.test(value) && num >= 0 && num <= 100;
      case "POINT_10":
        return /^\d{1,2}$/.test(value) && num >= 0 && num <= 10;
      case "POINT_10_DECIMAL":
        return /^\d{1,2}(\.\d)?$/.test(value) && num >= 0 && num <= 10;
      case "POINT_5":
        return /^[0-5]$/.test(value) && num >= 0 && num <= 5;
      case "POINT_3":
        return /^[1-3]$/.test(value) && num >= 1 && num <= 3;
      default:
        return true;
    }
  }

  async function handleScoreUpdate(entry, newScore, scoreFormat, updateEntry) {
    const value = newScore.trim();
    if (!validateScore(value, scoreFormat)) {
      toast.error("Enter a valid score for your format!");
      return;
    }

    try {
      await updateEntry({
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
            progressVolumes: entry.progressVolumes,
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

  const [updateMangaEntry] = useMutation(UPDATE_MANGA_ENTRY, {
    update(cache, { data: { SaveMediaListEntry } }) {
      cache.modify({
        id: cache.identify({
          __typename: "MediaList",
          id: SaveMediaListEntry.id,
        }),
        fields: {
          progress: () => SaveMediaListEntry.progress,
          progressVolumes: () => SaveMediaListEntry.progressVolumes,
        },
      });
    },
  });

  if (loading)
    return (
      <div className="loading-indicator">
        <TrophySpin color="#6e35ff" size="large" />
      </div>
    );
  if (error)
    return <div className="dashboard-error">Error: {error.message}</div>;

  const entries = data?.MediaListCollection?.lists?.[0]?.entries || [];
  const scoreFormat = data?.User?.mediaListOptions?.scoreFormat;
  const hasEntries = entries.length > 0;

  const handleProgressChange = async (entry, delta, isVolume = false) => {
    const updateEntry =
      mediaType === "ANIME" ? updateAnimeEntry : updateMangaEntry;

    if (mediaType === "ANIME") {
      const newProgress = entry.progress + delta;
      if (newProgress < 0 || newProgress > (entry.media.episodes || Infinity))
        return;

      try {
        await updateEntry({
          variables: { mediaId: entry.media.id, progress: newProgress },
          optimisticResponse: {
            SaveMediaListEntry: {
              __typename: "MediaList",
              id: entry.id,
              progress: newProgress,
              score: entry.score,
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
    } else {
      if (isVolume) {
        const newVolumes = (entry.progressVolumes || 0) + delta;
        if (newVolumes < 0 || newVolumes > (entry.media.volumes || Infinity))
          return;

        try {
          await updateEntry({
            variables: { mediaId: entry.media.id, progressVolumes: newVolumes },
            optimisticResponse: {
              SaveMediaListEntry: {
                __typename: "MediaList",
                id: entry.id,
                progress: entry.progress,
                progressVolumes: newVolumes,
                score: entry.score,
                status: entry.status,
                updatedAt: Date.now(),
              },
            },
          });
        } catch (err) {
          if (err.message.includes("429")) {
            toast.error("API limit reached. Please try again 1 minute later.");
          } else {
            toast.error("Failed to update volumes.");
          }
        }
      } else {
        const newProgress = entry.progress + delta;
        if (newProgress < 0 || newProgress > (entry.media.chapters || Infinity))
          return;

        try {
          await updateEntry({
            variables: { mediaId: entry.media.id, progress: newProgress },
            optimisticResponse: {
              SaveMediaListEntry: {
                __typename: "MediaList",
                id: entry.id,
                progress: newProgress,
                progressVolumes: entry.progressVolumes,
                score: entry.score,
                status: entry.status,
                updatedAt: Date.now(),
              },
            },
          });
        } catch (err) {
          if (err.message.includes("429")) {
            toast.error("API limit reached. Please try again 1 minute later.");
          } else {
            toast.error("Failed to update chapters.");
          }
        }
      }
    }
  };

  const handleCardClick = (media) => {
    const targetType = media.type || mediaType;
    navigate(`/Details?id=${media.id}&type=${targetType}`);
  };

  const redirectToDiscover = () => navigate("/");

  return (
    <div>
      {authToken ? (
        <div className="dashboard-container">
          <div className="dashboard-toggle">
            <ToggleButtonGroup
              className="toggle-group"
              value={mediaType}
              exclusive
              color="white"
              onChange={(e, value) => {
                if (value) setMediaType(value);
              }}
            >
              <ToggleButton
                className="toggle-anime"
                value="ANIME"
                aria-label="anime"
              >
                Anime
              </ToggleButton>
              <ToggleButton
                className="toggle-manga"
                value="MANGA"
                aria-label="manga"
              >
                Manga
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          {hasEntries ? (
            <div className="dashboard-grid">
              {entries.map((entry) => {
                return (
                  <div key={entry.id} className="dashboard-card">
                    <div
                      className="dashboard-card-image"
                      style={{
                        backgroundImage: `url(${entry.media.coverImage.large})`,
                        cursor: "pointer",
                      }}
                      onClick={() => handleCardClick(entry.media)}
                    >
                      <h3 className="dashboard-anime-title">
                        {entry.media.title.english || entry.media.title.romaji}
                      </h3>
                    </div>

                    <div className="dashboard-card-content">
                      {mediaType === "ANIME" ? (
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
                      ) : (
                        <>
                          <div className="dashboard-progress-section">
                            <div className="dashboard-progress-label">
                              Chapters
                            </div>
                            <div className="dashboard-progress-controls">
                              <button
                                className="dashboard-button"
                                disabled={entry.progress <= 0}
                                onClick={() =>
                                  handleProgressChange(entry, -1, false)
                                }
                              >
                                −
                              </button>
                              <span className="dashboard-progress-text">
                                {entry.progress} / {entry.media.chapters || "?"}
                              </span>
                              <button
                                className="dashboard-button"
                                onClick={() =>
                                  handleProgressChange(entry, 1, false)
                                }
                                disabled={
                                  entry.media.chapters &&
                                  entry.progress >= entry.media.chapters
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="dashboard-progress-section">
                            <div className="dashboard-progress-label">
                              Volumes
                            </div>
                            <div className="dashboard-progress-controls">
                              <button
                                className="dashboard-button"
                                disabled={(entry.progressVolumes || 0) <= 0}
                                onClick={() =>
                                  handleProgressChange(entry, -1, true)
                                }
                              >
                                −
                              </button>
                              <span className="dashboard-progress-text">
                                {entry.progressVolumes || 0} /{" "}
                                {entry.media.volumes || "?"}
                              </span>
                              <button
                                className="dashboard-button"
                                onClick={() =>
                                  handleProgressChange(entry, 1, true)
                                }
                                disabled={
                                  entry.media.volumes &&
                                  (entry.progressVolumes || 0) >=
                                    entry.media.volumes
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="dashboard-score-section">
                        <span className="dashboard-score-text">Score:</span>
                        {editingId === entry.id ? (
                          <div className="dashboard-score-edit-container">
                            <input
                              type="text"
                              className="dashboard-score-input"
                              defaultValue={entry.score || ""}
                              onChange={(e) => setTempScore(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleScoreUpdate(
                                    entry,
                                    tempScore,
                                    scoreFormat,
                                    mediaType === "ANIME"
                                      ? updateAnimeEntry
                                      : updateMangaEntry,
                                  );
                                  setEditingId(null);
                                } else if (e.key === "Escape") {
                                  setEditingId(null);
                                }
                              }}
                              autoFocus
                            />

                            <button
                              className="dashboard-score-save-btn"
                              onClick={() => {
                                handleScoreUpdate(
                                  entry,
                                  tempScore,
                                  scoreFormat,
                                  mediaType === "ANIME"
                                    ? updateAnimeEntry
                                    : updateMangaEntry,
                                );
                                setEditingId(null);
                              }}
                            >
                              <GoCheck size={18} />
                            </button>

                            <button
                              className="dashboard-score-close-btn"
                              onClick={() => setEditingId(null)}
                            >
                              <GoX size={18} />
                            </button>
                          </div>
                        ) : (
                          <span
                            className="dashboard-score-display"
                            onClick={() => {
                              setEditingId(entry.id);
                              setTempScore(entry.score?.toString() || "");
                            }}
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
          ) : (
            <div className="dashboard-empty-state">
              <p>
                Nothing here yet. Discover new titles or use Search to add anime
                and manga to your list.
              </p>
              <div className="dashboard-empty-actions">
                <button type="button" onClick={redirectToDiscover}>
                  Go to Discover
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="Not-Logged-In">
          <p>Please log in to see dashboard</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
