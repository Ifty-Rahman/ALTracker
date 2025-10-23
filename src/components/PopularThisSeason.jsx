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
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <button class="discover-btn2">
        Popular This Season
        <div class="arrow-wrapper">
          <div class="arrow"></div>
        </div>
      </button>
      <div className="anime-grid">
        {popular_seasonal_anime.map((anime) => (
          <AnimeCard anime={anime} key={anime.id} />
        ))}
      </div>
    </>
  );
}

export default PopularThisSeason;
