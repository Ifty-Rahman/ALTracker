import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import PopularThisSeason from "../components/Discover/PopularThisSeason.jsx";
import PopularAllTime from "../components/Discover/PopularAllTime.jsx";
import UpcomingNextSeason from "../components/Discover/Upcoming.jsx";
import Trending from "../components/Discover/Trending.jsx";
import PopularManhwa from "../components/Discover/PopularManhwa.jsx";
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
          onChange={(_, value) => value && setMediaType(value)}
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
          <PopularThisSeason type={mediaType} />
          <UpcomingNextSeason type={mediaType} />
        </>
      ) : (
        <>
          <PopularManhwa type={mediaType} />
        </>
      )}
      <PopularAllTime type={mediaType} />
    </div>
  );
}

export default Discover;
