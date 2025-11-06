import { useNavigate } from "react-router-dom";

function DashboardCardImage({ entry, fallbackMediaType }) {
  const navigate = useNavigate();
  const handleClick = () => {
    const targetType = entry.media.type || fallbackMediaType;
    navigate(`/Details?id=${entry.media.id}&type=${targetType}`);
  };

  return (
    <div
      className="dashboard-card-image"
      style={{
        backgroundImage: `url(${entry.media.coverImage.large})`,
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <h3 className="dashboard-anime-title">
        {entry.media.title.english || entry.media.title.romaji}
      </h3>
    </div>
  );
}

export default DashboardCardImage;
