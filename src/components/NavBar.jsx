import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_CURRENT_USER } from "../services/queries";
import "../css/Navbar.css";

function NavBar() {
  const location = useLocation();
  const clientId = 31288;
  const loginUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&response_type=token`;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("anime");
  const navigate = useNavigate();
  const { data } = useQuery(GET_CURRENT_USER, {
    skip: !isLoggedIn,
    fetchPolicy: "cache-first",
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("anilist_token");
      setIsLoggedIn(!!token);
    };

    checkAuth();

    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

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
      <div className="navbar-links">
        <Link
          to="/Dashboard"
          className={`nav-link ${location.pathname === "/Dashboard" ? "active" : ""}`}
        >
          Dashboard
        </Link>
        <Link
          to="/"
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        >
          Discover
        </Link>
        <Link
          to="/Userlist"
          className={`nav-link ${location.pathname === "/Userlist" ? "active" : ""}`}
        >
          Lists
        </Link>
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
        {isLoggedIn ? (
          <Link to="/profile" className="nav-avatar">
            {data?.Viewer?.avatar?.large ? (
              <img
                src={data.Viewer.avatar.large}
                alt={data.Viewer.name ?? "Profile"}
              />
            ) : (
              "Profile"
            )}
          </Link>
        ) : (
          <a href={loginUrl} className="nav-link">
            <div className="login-button">
              Login with &nbsp;
              <img
                className="anilist-icon"
                src="/anilist-icon.svg"
                alt="Anilist Icon"
              />
            </div>
          </a>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
