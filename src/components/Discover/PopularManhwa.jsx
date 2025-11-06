import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GET_POPULAR_MANHWA } from "../../services/Queries.jsx";
import ContentCard from "../Contentcard.jsx";

function PopularManhwa({ type }) {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_POPULAR_MANHWA, {
    variables: {
      page: 1,
      perPage: 15,
    },
  });
  const [popularManhwa, setPopularManhwa] = useState([]);

  useEffect(() => {
    if (data) {
      setPopularManhwa(data.Page.media);
    }
  }, [data]);

  const handleViewAll = () => {
    navigate(`/Browse?section=manhwa&type=${type}`);
  };

  const handleButton = () => {
    navigate(`/Browse?section=manhwa&type=${type}`);
  };

  const handleCardClick = (content) => {
    navigate(`/Details?id=${content.id}&type=${content.type}`);
  };

  if (error) return <p className="error-msg">Error: {error.message}</p>;
  if (loading) return null;

  return (
    <>
      <div className="button-row">
        <button className="title-btn" onClick={handleButton}>
          Popular Manhwa
        </button>
        <button className="view-all" onClick={handleViewAll}>
          view all
          <div className="arrow-wrapper">
            <div className="arrow"></div>
          </div>
        </button>
      </div>
      <div className="content-grid">
        {popularManhwa.map((content) => (
          <div key={content.id} onClick={() => handleCardClick(content)}>
            <ContentCard content={content} />
          </div>
        ))}
      </div>
    </>
  );
}

export default PopularManhwa;
