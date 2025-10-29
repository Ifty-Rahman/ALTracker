import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { GET_POPULAR_SEASONAL_ANIME } from "../services/queries";
import AnimeCard from "./AnimeCard";

function PopularThisSeason() {
  const { loading, error, data } = useQuery(GET_POPULAR_SEASONAL_ANIME);
  const [popular_seasonal_anime, setPopularSeasonalAnime] = useState([]);
  useEffect(() => {
    if (data) {
      setPopularSeasonalAnime(data.Page.media);
    }
  }, [data]);
  if (error) return <p className="error-msg">Error: {error.message}</p>;
  if (loading) return;

  return (
    <>
      <div className="button-row">
        <button>Popular This Season</button>
        <button className="view-all">
          view all
          <div className="arrow-wrapper">
            <div className="arrow"></div>
          </div>
        </button>
      </div>
      <div className="anime-grid">
        {popular_seasonal_anime.map((anime) => (
          <AnimeCard anime={anime} key={anime.id} />
        ))}
      </div>
    </>
  );
}

export default PopularThisSeason;
