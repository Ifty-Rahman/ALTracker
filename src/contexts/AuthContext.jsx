import { useState } from "react";
import { AuthContext } from "./AuthContext.js";

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("anilist_token"),
  );

  const login = (token) => {
    localStorage.setItem("anilist_token", token);
    setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem("anilist_token");
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
