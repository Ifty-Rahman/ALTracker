import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { GET_SEARCH_DATA } from "../services/Queries.jsx";
import ContentCard from "../components/Contentcard.jsx";
import { TrophySpin } from "react-loading-indicators";
import "../css/Search.css";

function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const type = (searchParams.get("type") || "anime").toUpperCase();

  const { loading, error, data } = useQuery(GET_SEARCH_DATA, {
    variables: {
      page: 1,
      perPage: 15,
      search: query,
      type: type,
    },
  });

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (data) {
      setSearchResults(data?.Page?.media);
    }
  }, [data]);

  if (loading)
    return (
      <div className="loading-indicator">
        <TrophySpin color="var(--primary)" size="large" />
      </div>
    );
  if (error) return <p className="error-msg">Error: {error.message}</p>;

  const handleCardClick = (content) => {
    navigate(`/Details?id=${content.id}&type=${content.type}`);
  };

  return (
    <div className="search-results">
      <h2 className="search-title">Showing results for "{query}"</h2>
      <div className="search-grid">
        {searchResults.map((content) => (
          <div key={content.id} onClick={() => handleCardClick(content)}>
            <ContentCard content={content} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
