import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import PopularThisSeason from "../components/PopularThisSeason.jsx";
import PopularAllTime from "../components/PopularAllTime.jsx";
import UpcomingNextSeason from "../components/Upcoming.jsx";
import Trending from "../components/Trending.jsx";
import PopularManhwa from "../components/PopularManhwa.jsx";
import "../css/Discover.css";

function Discover() {
  const [mediaType, setMediaType] = useState("ANIME");

  return (
    <div className="discover">
      <div className="discover-toggle">
        <ToggleButtonGroup
          className="toggle-group"
          value={mediaType}
          exclusive
          onChange={(e, value) => value && setMediaType(value)}
        >
          <ToggleButton value="ANIME" aria-label="anime">
            Anime
          </ToggleButton>
          <ToggleButton value="MANGA" aria-label="manga">
            Manga
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <Trending type={mediaType} />
      {mediaType === "ANIME" ? (
        <>
          <PopularThisSeason />
          <UpcomingNextSeason />
        </>
      ) : (
        <>
          <PopularManhwa />
        </>
      )}
      <PopularAllTime type={mediaType} />
    </div>
  );
}

export default Discover;
