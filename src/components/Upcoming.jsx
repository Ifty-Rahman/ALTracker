import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { GET_UPCOMING_SEASONAL_ANIME } from "../services/queries";
import AnimeCard from "./AnimeCard";

function UpcomingNextSeason() {
  const { error, data } = useQuery(GET_UPCOMING_SEASONAL_ANIME);
  const [upcoming_seasonal_anime, setUpcomingAnime] = useState([]);

  useEffect(() => {
    if (data) {
      setUpcomingAnime(data.Page.media);
    }
  }, [data]);
  if (error) return <p>Error :(</p>;

  return (
    <>
      <button className="discover-btn2">
        Upcoming Next Season
        <div className="arrow-wrapper">
          <div className="arrow"></div>
        </div>
      </button>
      <div className="anime-grid">
        {upcoming_seasonal_anime.map((anime) => (
          <AnimeCard anime={anime} key={anime.id} />
        ))}
      </div>
    </>
  );
}

export default UpcomingNextSeason;
