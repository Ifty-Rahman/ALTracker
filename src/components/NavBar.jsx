import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/Navbar.css";

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("anilist_token");
      window.dispatchEvent(new Event("authChange"));
      setIsLoggedIn(!!token);
    };

    checkAuth();

    // Listen for storage (other tabs)
    window.addEventListener("storage", checkAuth);

    // Listen for authChange (same tab)
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">AL</Link>
      </div>
      <div className="navbar-links">
        <Link to="/Dashboard" className="nav-link">
          Dashboard
        </Link>
        <Link to="/" className="nav-link">
          Discover
        </Link>
        <Link to="/Userlist" className="nav-link">
          Lists
        </Link>
        <Link to={isLoggedIn ? "/profile" : "/login"} className="nav-link">
          {isLoggedIn ? "Profile" : "Login"}
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
