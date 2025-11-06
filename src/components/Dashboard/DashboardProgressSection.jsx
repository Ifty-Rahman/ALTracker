import { useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import {
  UPDATE_ANIME_ENTRY,
  UPDATE_MANGA_ENTRY,
} from "../../services/Mutation.jsx";

function DashboardProgressSection({ entry, mediaType }) {
  const [updateAnimeEntry] = useMutation(UPDATE_ANIME_ENTRY);
  const [updateMangaEntry] = useMutation(UPDATE_MANGA_ENTRY);

  const handleProgressChange = async (delta, isVolume = false) => {
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
        toast.error(
          err.message.includes("429")
            ? "API limit reached. Please try again later."
            : "Failed to update progress.",
        );
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
          toast.error(
            err.message.includes("429")
              ? "API limit reached. Please try again later."
              : "Failed to update volumes.",
          );
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
          toast.error(
            err.message.includes("429")
              ? "API limit reached. Please try again later."
              : "Failed to update chapters.",
          );
        }
      }
    }
  };

  if (mediaType === "ANIME") {
    return (
      <div className="dashboard-progress-section">
        <div className="dashboard-progress-controls">
          <button
            className="dashboard-button"
            disabled={entry.progress <= 0}
            onClick={() => handleProgressChange(-1)}
          >
            −
          </button>
          <span className="dashboard-progress-text">
            {entry.progress} / {entry.media.episodes || "?"}
          </span>
          <button
            className="dashboard-button"
            onClick={() => handleProgressChange(1)}
            disabled={
              entry.media.episodes && entry.progress >= entry.media.episodes
            }
          >
            +
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-progress-section">
        <div className="dashboard-progress-label">Chapters</div>
        <div className="dashboard-progress-controls">
          <button
            className="dashboard-button"
            disabled={entry.progress <= 0}
            onClick={() => handleProgressChange(-1, false)}
          >
            −
          </button>
          <span className="dashboard-progress-text">
            {entry.progress} / {entry.media.chapters || "?"}
          </span>
          <button
            className="dashboard-button"
            onClick={() => handleProgressChange(1, false)}
            disabled={
              entry.media.chapters && entry.progress >= entry.media.chapters
            }
          >
            +
          </button>
        </div>
      </div>
      <div className="dashboard-progress-section">
        <div className="dashboard-progress-label">Volumes</div>
        <div className="dashboard-progress-controls">
          <button
            className="dashboard-button"
            disabled={(entry.progressVolumes || 0) <= 0}
            onClick={() => handleProgressChange(-1, true)}
          >
            −
          </button>
          <span className="dashboard-progress-text">
            {entry.progressVolumes || 0} / {entry.media.volumes || "?"}
          </span>
          <button
            className="dashboard-button"
            onClick={() => handleProgressChange(1, true)}
            disabled={
              entry.media.volumes &&
              (entry.progressVolumes || 0) >= entry.media.volumes
            }
          >
            +
          </button>
        </div>
      </div>
    </>
  );
}

export default DashboardProgressSection;
