import DashboardCardImage from "./DashboardCardImage";
import DashboardProgressSection from "./DashboardProgressSection";
import DashboardScoreSection from "./DashboardScoreSection";

function DashboardCard({
  entry,
  mediaType,
  scoreFormat,
  updateAnimeEntry,
  updateMangaEntry,
}) {
  return (
    <div key={entry.id} className="dashboard-card">
      <DashboardCardImage entry={entry} fallbackMediaType={mediaType} />
      <div className="dashboard-card-content">
        <DashboardProgressSection entry={entry} mediaType={mediaType} />
        <DashboardScoreSection
          entry={entry}
          mediaType={mediaType}
          scoreFormat={scoreFormat}
          updateAnimeEntry={updateAnimeEntry}
          updateMangaEntry={updateMangaEntry}
        />
      </div>
    </div>
  );
}

export default DashboardCard;
