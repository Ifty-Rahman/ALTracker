import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GET_POPULAR_ANIME } from "../services/Queries.jsx";
import ConentCard from "./Contentcard.jsx";

function PopularAllTime() {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_POPULAR_ANIME, {
    variables: {
      page: 1,
      perPage: 15,
      sort: "POPULARITY_DESC",
    },
  });
  const [popularAnime, setPopularAnime] = useState([]);

  useEffect(() => {
    if (data) {
      setPopularAnime(data.Page.media);
    }
  }, [data]);

  const handleViewAll = () => {
    navigate("/Browse?section=popular");
  };

  const handleButton = () => {
    navigate("/Browse?section=popular");
  };

  if (error) return <p className="error-msg">Error: {error.message}</p>;
  if (loading) return;

  return (
    <>
      <div className="button-row">
        <button className="title-btn" onClick={handleButton}>
          All Time Popular
        </button>
        <button className="view-all" onClick={handleViewAll}>
          view all
          <div className="arrow-wrapper">
            <div className="arrow"></div>
          </div>
        </button>
      </div>
      <div className="content-grid">
        {popularAnime.map((content) => (
          <ConentCard content={content} key={content.id} />
        ))}
      </div>
    </>
  );
}

export default PopularAllTime;
