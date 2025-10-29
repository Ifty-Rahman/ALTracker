import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { GET_UPCOMING_SEASONAL_ANIME } from "../services/queries";
import AnimeCard from "./AnimeCard";

function UpcomingNextSeason() {
  const { loading, error, data } = useQuery(GET_UPCOMING_SEASONAL_ANIME);
  const [upcoming_seasonal_anime, setUpcomingAnime] = useState([]);

  useEffect(() => {
    if (data) {
      setUpcomingAnime(data.Page.media);
    }
  }, [data]);
  if (error) return <p className="error-msg">Error: {error.message}</p>;
  if (loading) return;

  return (
    <>
      <div className="button-row">
        <button>Upcoming Next Season</button>
        <button className="view-all">
          view all
          <div className="arrow-wrapper">
            <div className="arrow"></div>
          </div>
        </button>
      </div>
      <div className="anime-grid">
        {upcoming_seasonal_anime.map((anime) => (
          <AnimeCard anime={anime} key={anime.id} />
        ))}
      </div>
    </>
  );
}

export default UpcomingNextSeason;
