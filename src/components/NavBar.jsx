import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_CURRENT_USER } from "../services/queries";
import "../css/Navbar.css";

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
      </div>
      <div className="nav-profile">
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
          <Link to="/login" className="nav-link">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
