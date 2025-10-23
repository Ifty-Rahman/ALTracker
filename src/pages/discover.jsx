import PopularThisSeason from "../components/PopularThisSeason.jsx";
import PopularAllTime from "../components/PopularAllTime.jsx";
import UpcomingNextSeason from "../components/Upcoming.jsx";
import "../css/Discover.css";

function Discover() {
  return (
    <div className="discover">
      <PopularThisSeason />
      <UpcomingNextSeason />
      <PopularAllTime />
    </div>
  );
}

export default Discover;
