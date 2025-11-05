import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { PiHandTapBold } from "react-icons/pi";
import "../css/NavBar.css";
import { IoNotificationsSharp, IoSearchSharp } from "react-icons/io5";

function NavBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("Anime");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search when clicking outside (mobile only)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target) &&
        isMobile &&
        isSearchOpen
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();

    const params = new URLSearchParams();
    if (trimmedQuery) params.set("query", trimmedQuery);
    params.set("type", searchType);

    navigate(`/Search?${params.toString()}`);

    if (isMobile) {
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const toggleSearchType = () => {
    setSearchType((prevType) => (prevType === "Anime" ? "Manga" : "Anime"));
  };

  const openSearch = () => setIsSearchOpen(true);
  const clearSearch = () => setSearchQuery("");

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="AL">AL</span>Track
        </Link>
      </div>

      {/* Desktop Search */}
      {!isMobile && (
        <div className="nav-search-desktop" ref={searchContainerRef}>
          <form className="nav-search-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <IoSearchSharp className="search-icon" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${searchType}...`}
                className="search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-btn-mobile"
                  onClick={clearSearch}
                >
                  ✕
                </button>
              )}
              <button
                type="button"
                className={`search-type-toggle search-type-toggle--${searchType}`}
                onClick={toggleSearchType}
              >
                {searchType === "Anime" ? "Anime" : "Manga"}
                <PiHandTapBold size={15} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Search Overlay */}
      {isMobile && isSearchOpen && (
        <div className="search-overlay-mobile">
          <div className="search-modal-mobile" ref={searchContainerRef}>
            <form
              className="nav-search-form-mobile"
              onSubmit={handleSearchSubmit}
            >
              <div className="search-header-mobile">
                <IoSearchSharp className="search-icon-mobile" size={24} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${searchType}...`}
                  className="search-input-mobile"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-btn-mobile"
                    onClick={clearSearch}
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="search-footer-mobile">
                <button
                  type="button"
                  className="search-type-toggle-mobile"
                  onClick={toggleSearchType}
                >
                  {searchType === "Anime" ? "Anime" : "Manga"}
                </button>
                <button type="submit" className="search-submit-mobile">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="settings">
        {isMobile && !isSearchOpen && (
          <button className="search-trigger-mobile" onClick={openSearch}>
            <IoSearchSharp
              color="var(--text)"
              className="search-icon"
              size={24}
            />
          </button>
        )}
        <IoNotificationsSharp color="var(--text)" size={24} />
      </div>
    </nav>
  );
}

export default NavBar;
