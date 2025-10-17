import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/Navbar.css";

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("anilist_token");
      setIsLoggedIn(!!token);
    };

    checkAuth();

    // Listen for storage events (works across tabs)
    window.addEventListener("storage", checkAuth);

    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">ALTracker</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Discover
        </Link>
        <Link to="/Userlist" className="nav-link">
          List
        </Link>
        <Link to={isLoggedIn ? "/profile" : "/login"} className="nav-link">
          Profile
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
