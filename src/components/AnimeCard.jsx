import { useState } from "react";
import Popup from "./Popup";
import "../css/AnimeCard.css";

function AnimeCard({ anime }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const title = anime.title.english || anime.title.romaji || "Untitled";

  const handleTitleClick = (event) => {
    event.stopPropagation();
    setIsPopupOpen(true);
  };

  const closePopup = () => setIsPopupOpen(false);

  return (
    <div className="anime-card" onMouseLeave={closePopup}>
      <img src={anime.coverImage.large} alt={title} />

      <Popup isOpen={isPopupOpen} onClose={closePopup}>
        <p>{title}</p>
      </Popup>

      <h3
        onClick={handleTitleClick}
        aria-label={`Show full title for ${title}`}
      >
        {title}
      </h3>
    </div>
  );
}

export default AnimeCard;
