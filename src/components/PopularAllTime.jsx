import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { GET_POPULAR_ANIME } from "../services/queries";
import AnimeCard from "./AnimeCard";

function PopularAllTime() {
  const { loading, error, data } = useQuery(GET_POPULAR_ANIME);
  const [popularAnime, setPopularAnime] = useState([]);

  useEffect(() => {
    if (data) {
      setPopularAnime(data.Page.media);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <button class="discover-btn2">
        All Time Popular
        <div class="arrow-wrapper">
          <div class="arrow"></div>
        </div>
      </button>
      <div className="anime-grid">
        {popularAnime.map((anime) => (
          <AnimeCard anime={anime} key={anime.id} />
        ))}
      </div>
    </>
  );
}

export default PopularAllTime;
