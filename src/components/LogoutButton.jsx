import { useNavigate } from "react-router-dom";
import "../css/LogoutButtton.css";

function LogOut() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("anilist_token");
    window.dispatchEvent(new Event("authChange")); // 🔔 notify listeners
    navigate("/");
  }

  return (
    <div className="profile">
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}

export default LogOut;
