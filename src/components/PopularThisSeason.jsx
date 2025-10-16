import { useQuery } from "@apollo/client/react";
import { GET_POPULAR_SEASONAL_ANIME } from "../services/queries";
import AnimeCard from "./AnimeCard";

function PopularThisSeason() {
  const { loading, error, data } = useQuery(GET_POPULAR_SEASONAL_ANIME);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const popular_seasonal_anime = data.Page.media;

  return (
    <>
      <p className="Popular-Season-Heading">Popular This Season</p>
      <div className="anime-grid">
        {popular_seasonal_anime.map((anime) => (
          <AnimeCard anime={anime} key={anime.id} />
        ))}
      </div>
    </>
  );
}

export default PopularThisSeason;
