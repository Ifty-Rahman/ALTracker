import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/Navbar.css";
import PillNav from "./PillNav";

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    <>
      <PillNav
        logo={"AL"}
        logoAlt="Company Logo"
        items={[
          { label: "Discover", href: "/" },
          { label: "Dashboard", href: "/dashboard" },
          { label: "List", href: "/Userlist" },
          {
            label: isLoggedIn ? "Profile" : "Login",
            href: isLoggedIn ? "/profile" : "/login",
          },
        ]}
        activeHref="/"
        className="custom-nav"
        ease="power2.easeOut"
        baseColor="#000000"
        pillColor="#ffffff"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#000000"
      />
    </>
  );
}

export default NavBar;
