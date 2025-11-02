import { useState } from "react";
import "../css/Contentcard.css";

function ContentCard({ content }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const title = content.title.english || content.title.romaji || "Untitled";

  const handleTitleClick = (event) => {
    event.stopPropagation();
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="content-card" onMouseLeave={closePopup}>
      <img src={content.coverImage.large} alt={title} className="anime-image" />
      {isPopupOpen && (
        <div className="content-title-popup" onClick={closePopup}>
          <div
            className="content-title-popup-content"
            onClick={(event) => event.stopPropagation()}
          >
            <p>{title}</p>
          </div>
        </div>
      )}

      <h3 className="content-title" onClick={handleTitleClick}>
        {title}
      </h3>
    </div>
  );
}

export default ContentCard;
