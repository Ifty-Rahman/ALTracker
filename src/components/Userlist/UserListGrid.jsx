function UserListGrid({ entries, isAnime, onCardClick }) {
  return (
    <div className="anime-grid-list">
      {entries.map(({ media, score, progress, progressVolumes }) => {
        const totalEpisodes = media.episodes ?? "?";
        const totalChapters = media.chapters ?? "?";
        const totalVolumes = media.volumes ?? "?";
        const progressCount = progress ?? 0;
        const progressText = isAnime
          ? `Ep: ${progressCount}/${totalEpisodes}`
          : `Ch: ${progressCount}/${totalChapters}`;
        const volumeText = `Vol: ${progressVolumes ?? 0}/${totalVolumes}`;
        const scoreText = `Score: ${score ?? "-"}`;

        return (
          <div className="anime-card-list" key={media.id}>
            <div
              onClick={() => onCardClick(media)}
              className="anime-card-image"
              style={{
                backgroundImage: `url(${media.coverImage.large})`,
              }}
            >
              <h3 className="anime-card-title">
                {media.title.english || media.title.romaji}
              </h3>
            </div>
            <div className="anime-info-list">
              <p>{progressText}</p>
              <p>{scoreText}</p>
              {!isAnime && <p>{volumeText}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default UserListGrid;
