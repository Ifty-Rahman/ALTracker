import { useQuery } from "@apollo/client/react";
import { GET_UPCOMING_SEASONAL_ANIME } from "../services/queries";
import AnimeCard from "./AnimeCard";

function UpcomingNextSeason() {
  const { loading, error, data } = useQuery(GET_UPCOMING_SEASONAL_ANIME);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const upcoming_seasonal_anime = data.Page.media;

  return (
    <>
      <p className="Popular-Season-Heading">Upcoming Next Season</p>
      <div className="anime-grid">
        {upcoming_seasonal_anime.map((anime) => (
          <AnimeCard anime={anime} key={anime.id} />
        ))}
      </div>
    </>
  );
}

export default UpcomingNextSeason;
