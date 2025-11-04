import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.js";
import "../css/LogoutButtton.css";

function LogOut() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
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
