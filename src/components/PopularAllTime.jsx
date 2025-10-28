import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { GET_POPULAR_ANIME } from "../services/queries";
import AnimeCard from "./AnimeCard";

function PopularAllTime() {
  const { error, data } = useQuery(GET_POPULAR_ANIME);
  const [popularAnime, setPopularAnime] = useState([]);

  useEffect(() => {
    if (data) {
      setPopularAnime(data.Page.media);
    }
  }, [data]);

  if (error) return <p>Error :(</p>;

  return (
    <>
      <div className="button-row">
        <button>All Time Popular</button>
        <button className="view-all">
          view all
          <div className="arrow-wrapper">
            <div className="arrow"></div>
          </div>
        </button>
      </div>
      <div className="anime-grid">
        {popularAnime.map((anime) => (
          <AnimeCard anime={anime} key={anime.id} />
        ))}
      </div>
    </>
  );
}

export default PopularAllTime;
