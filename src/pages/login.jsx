import { useEffect } from "react";

function Login() {
  const clientId = import.meta.env.VITE_ANILIST_CLIENT_ID;

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace("#", ""));
      const token = params.get("access_token");
      if (token) {
        // Save token to localStorage
        localStorage.setItem("anilist_token", token);
        console.log("Token saved:", token);
      }
      window.history.replaceState(
        null,
        document.title,
        window.location.pathname + window.location.search,
      );
    }
  }, []);

  const loginUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&response_type=token`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "100px",
      }}
    >
      <h1>Login with AniList</h1>
      <a
        href={loginUrl}
        style={{
          padding: "10px 20px",
          backgroundColor: "#2f6ee0",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "5px",
          marginTop: "20px",
          fontWeight: "bold",
        }}
      >
        Login with AniList
      </a>
    </div>
  );
}

export default Login;
