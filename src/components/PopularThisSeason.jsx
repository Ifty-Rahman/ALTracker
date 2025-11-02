import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GET_POPULAR_SEASONAL_ANIME } from "../services/queries";
import ContentCard from "./Contentcard";

function PopularThisSeason() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  let season = "WINTER";
  if (month >= 3 && month <= 5) season = "SPRING";
  else if (month >= 6 && month <= 8) season = "SUMMER";
  else if (month >= 9 && month <= 11) season = "FALL";
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_POPULAR_SEASONAL_ANIME, {
    variables: {
      page: 1,
      perPage: 15,
      sort: "POPULARITY_DESC",
      season: season,
      seasonYear: year,
    },
  });
  const [popular_seasonal_anime, setPopularSeasonalAnime] = useState([]);

  useEffect(() => {
    if (data) {
      setPopularSeasonalAnime(data.Page.media);
    }
  }, [data]);

  const handleViewAll = () => {
    navigate("/Browse?section=seasonal");
  };

  const handleButton = () => {
    navigate("/Browse?section=seasonal");
  };

  if (error) return <p className="error-msg">Error: {error.message}</p>;
  if (loading) return;

  return (
    <>
      <div className="button-row">
        <button className="title-btn" onClick={handleButton}>
          Popular This Season
        </button>
        <button className="view-all" onClick={handleViewAll}>
          view all
          <div className="arrow-wrapper">
            <div className="arrow"></div>
          </div>
        </button>
      </div>
      <div className="anime-grid">
        {popular_seasonal_anime.map((anime) => (
          <ContentCard anime={anime} key={anime.id} />
        ))}
      </div>
    </>
  );
}

export default PopularThisSeason;
