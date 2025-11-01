import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GET_TRENDING_ANIME } from "../services/queries";
import AnimeCard from "./AnimeCard";
import { TrophySpin } from "react-loading-indicators";

function TrendingAnime() {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_TRENDING_ANIME, {
    variables: {
      page: 1,
      perPage: 15,
      sort: "TRENDING_DESC",
    },
  });
  const [trendingAnime, setTrendingAnime] = useState([]);

  useEffect(() => {
    if (data) {
      setTrendingAnime(data.Page.media);
    }
  }, [data]);

  const handleViewAll = () => {
    navigate("/Browse?section=trending");
  };

  const handleButton = () => {
    navigate("/Browse?section=trending");
  };

  if (loading)
    return (
      <div className="loading-indicator">
        <TrophySpin color="#6e35ff" size="large" />
      </div>
    );
  if (error) return <p className="error-msg">Error: {error.message}</p>;

  return (
    <>
      <div className="button-row">
        <button className="title-btn" onClick={handleButton}>
          Trending Now
        </button>
        <button className="view-all" onClick={handleViewAll}>
          view all
          <div className="arrow-wrapper">
            <div className="arrow"></div>
          </div>
        </button>
      </div>
      <div className="anime-grid">
        {trendingAnime.map((anime) => (
          <AnimeCard anime={anime} key={anime.id} />
        ))}
      </div>
    </>
  );
}

export default TrendingAnime;
