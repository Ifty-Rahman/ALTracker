import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { GoCheck, GoX } from "react-icons/go";

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

function DashboardScoreSection({
  entry,
  mediaType,
  scoreFormat,
  updateAnimeEntry,
  updateMangaEntry,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempScore, setTempScore] = useState(entry.score?.toString() || "");

  useEffect(() => {
    setIsEditing(false);
    setTempScore(entry.score?.toString() || "");
  }, [entry.id, entry.score]);

  const handleScoreUpdate = async () => {
    const value = tempScore.trim();
    if (!validateScore(value, scoreFormat)) {
      toast.error("Enter a valid score for your format!");
      return;
    }

    const updateEntry =
      mediaType === "ANIME" ? updateAnimeEntry : updateMangaEntry;

    if (!updateEntry) {
      toast.error("Unable to update score right now.");
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
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update score.");
    }
  };

  const handleStartEdit = () => {
    setTempScore(entry.score?.toString() || "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setTempScore(entry.score?.toString() || "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="dashboard-score-section">
        <span className="dashboard-score-text">Score:</span>
        <div className="dashboard-score-edit-container">
          <input
            type="text"
            className="dashboard-score-input"
            value={tempScore}
            onChange={(e) => setTempScore(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleScoreUpdate();
              } else if (e.key === "Escape") {
                handleCancelEdit();
              }
            }}
            autoFocus
          />
          <button
            className="dashboard-score-save-btn"
            onClick={handleScoreUpdate}
          >
            <GoCheck size={18} />
          </button>
          <button
            className="dashboard-score-close-btn"
            onClick={handleCancelEdit}
          >
            <GoX size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-score-section">
      <span className="dashboard-score-text">Score:</span>
      <span className="dashboard-score-display" onClick={handleStartEdit}>
        {getScoreDisplay(entry, scoreFormat)}
      </span>
    </div>
  );
}

export default DashboardScoreSection;
