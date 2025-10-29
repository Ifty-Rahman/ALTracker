import { useState } from "react";
import StatusDropdown from "./StatusDropdown";
import "../css/AnimeCard.css";

function AnimeCard({ anime }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [animeStatus, setAnimeStatus] = useState(null);
  const title = anime.title.english || anime.title.romaji || "Untitled";

  const handleTitleClick = (event) => {
    event.stopPropagation();
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleStatusSelect = (status) => {
    setAnimeStatus(status);
    console.log(`Selected status for ${title}: ${status}`);
    // You can add additional logic here, like updating the backend
  };

  return (
    <div className="anime-card" onMouseLeave={closePopup}>
      <img src={anime.coverImage.large} alt={title} className="anime-image" />

      <StatusDropdown
        onStatusSelect={handleStatusSelect}
        currentStatus={animeStatus}
      />

      {isPopupOpen && (
        <div className="anime-title-popup" onClick={closePopup}>
          <div
            className="anime-title-popup-content"
            onClick={(event) => event.stopPropagation()}
          >
            <p>{title}</p>
          </div>
        </div>
      )}

      <h3 className="anime-title" onClick={handleTitleClick}>
        {title}
      </h3>
    </div>
  );
}

export default AnimeCard;
