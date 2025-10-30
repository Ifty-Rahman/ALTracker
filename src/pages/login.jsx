import "../css/Login.css";

function Login() {
  const clientId = 31288;

  const loginUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&response_type=token`;

  return (
    <div className="login-container">
      <a href={loginUrl} className="login-button">
        Login with AniList
      </a>
    </div>
  );
}

export default Login;
