import PopularThisSeason from "../components/PopularThisSeason.jsx";
import PopularAllTime from "../components/PopularAllTime.jsx";
import UpcomingNextSeason from "../components/Upcoming.jsx";
import "../css/Discover.css";

function Discover() {
  return (
    <div className="discover">
      <PopularAllTime />
      <PopularThisSeason />
      <UpcomingNextSeason />
    </div>
  );
}

export default Discover;
