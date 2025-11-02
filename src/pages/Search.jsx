import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useSearchParams } from "react-router-dom";
import { GET_SEARCH_DATA } from "../services/queries";
import ContentCard from "../components/Contentcard";
import { TrophySpin } from "react-loading-indicators";
import "../css/Search.css";

function Search() {
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
        <TrophySpin color="#6e35ff" size="large" />
      </div>
    );
  if (error) return <p className="error-msg">Error: {error.message}</p>;

  return (
    <div className="search-results">
      <h2 className="search-title">Showing results for "{query}"</h2>
      <div className="search-grid">
        {searchResults.map((content) => (
          <ContentCard content={content} key={content.id} />
        ))}
      </div>
    </div>
  );
}

export default Search;
