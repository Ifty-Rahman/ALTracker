import { useState } from "react";
import "../css/AnimeCard.css";

function ContentCard({ anime }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const title = anime.title.english || anime.title.romaji || "Untitled";

  const handleTitleClick = (event) => {
    event.stopPropagation();
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="anime-card" onMouseLeave={closePopup}>
      <img src={anime.coverImage.large} alt={title} className="anime-image" />
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

export default ContentCard;
