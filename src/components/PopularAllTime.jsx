import { useQuery } from "@apollo/client/react";
import { GET_POPULAR_ANIME } from "../services/queries";
import AnimeCard from "./AnimeCard";

function PopularAllTime() {
  const { loading, error, data } = useQuery(GET_POPULAR_ANIME);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const popular_all_time = data.Page.media;

  return (
    <>
      <p>Popular All Time</p>
      <div className="anime-grid">
        {popular_all_time.map((anime) => (
          <AnimeCard anime={anime} key={anime.id} />
        ))}
      </div>
    </>
  );
}

export default PopularAllTime;
