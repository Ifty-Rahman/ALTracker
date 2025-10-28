import "../css/AnimeCard.css";

function AnimeCard({ anime }) {
  return (
    <div className="anime-card">
      <img
        src={anime.coverImage.large}
        alt={anime.title.english}
        className="anime-image"
      />
      <div className="anime-image-overlay" />
      <h3 className="anime-title">
        {anime.title.english || anime.title.romaji}
      </h3>
    </div>
  );
}

export default AnimeCard;
