import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/Navbar.css";

function NavBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("anime");
  const navigate = useNavigate();

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();

    const params = new URLSearchParams();
    if (trimmedQuery) {
      params.set("query", trimmedQuery);
    }
    params.set("type", searchType);

    navigate(`/Search?${params.toString()}`);
  };

  const toggleSearchType = () => {
    setSearchType((prevType) => (prevType === "anime" ? "manga" : "anime"));
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">AL</Link>
      </div>
      <div className="nav-profile">
        <form className="nav-search" onSubmit={handleSearchSubmit}>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={`Search ${searchType}...`}
            aria-label={`Search ${searchType}`}
          />
          <button
            type="button"
            className={`nav-search-toggle nav-search-toggle--${searchType}`}
            onClick={toggleSearchType}
            aria-label={`Toggle search type (currently ${searchType})`}
          >
            {searchType === "anime" ? "Anime" : "Manga"}
          </button>
        </form>
      </div>
    </nav>
  );
}

export default NavBar;
