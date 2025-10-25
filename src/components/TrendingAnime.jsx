import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { GET_TRENDING_ANIME } from "../services/queries";
import AnimeCard from "./AnimeCard";

function TrendingAnime() {
  const { loading, error, data } = useQuery(GET_TRENDING_ANIME);
  const [trendingAnime, setTrendingAnime] = useState([]);

  useEffect(() => {
    if (data) {
      setTrendingAnime(data.Page.media);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <button className="discover-btn2">
        Trending Now
        <div className="arrow-wrapper">
          <div className="arrow"></div>
        </div>
      </button>
      <div className="anime-grid">
        {trendingAnime.map((anime) => (
          <AnimeCard anime={anime} key={anime.id} />
        ))}
      </div>
    </>
  );
}

export default TrendingAnime;
