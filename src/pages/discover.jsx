import PopularThisSeason from "../components/PopularThisSeason.jsx";
import PopularAllTime from "../components/PopularAllTime.jsx";
import UpcomingNextSeason from "../components/Upcoming.jsx";
import "../css/Discover.css";
import TrendingAnime from "../components/TrendingAnime.jsx";

function Discover() {
  return (
    <div className="discover">
      <TrendingAnime />
      <PopularThisSeason />
      <UpcomingNextSeason />
      <PopularAllTime />
    </div>
  );
}

export default Discover;
