import "../css/AnimeCard.css";

function AnimeCard({ anime }) {
  return (
    <div className="anime-card">
      <img
        src={anime.coverImage.large}
        alt={anime.title.romaji}
        className="anime-image"
      />
      <h3 className="anime-title">{anime.title.romaji}</h3>
    </div>
  );
}

export default AnimeCard;
