import { useQuery } from "@apollo/client/react";
import { useEffect } from "react";
import { GET_CURRENT_USER, GET_USER_ANIME_LIST } from "../services/queries";
import "../css/Userlist.css";

function UserList() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace("#", ""));
      const token = params.get("access_token");
      if (token) {
        localStorage.setItem("anilist_token", token);
        window.history.replaceState(null, null, window.location.pathname);
      }
    }
  }, []);

  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_CURRENT_USER);

  const username = userData?.Viewer?.name;
  const { loading, error, data } = useQuery(GET_USER_ANIME_LIST, {
    variables: { userName: username },
    skip: !username,
  });

  if (userLoading || loading) return <p>Loading...</p>;
  if (userError) return <p>Error: {userError.message}</p>;
  if (error) return <p>Error: {error.message}</p>;

  const userlists = data?.MediaListCollection?.lists || [];

  return (
    <div className="anime-list-container">
      {userlists.map((list) => (
        <div key={list.name} className="anime-list">
          <h1>{list.name}</h1>
          <div className="anime-grid-list">
            {list.entries.map(({ media, score, progress }) => (
              <div className="anime-card-list" key={media.id}>
                <img src={media.coverImage.large} alt={media.title.english} />
                <div className="anime-info-list">
                  <h3>{media.title.english}</h3>
                  <p>Episodes: {media.episodes}</p>
                  <p>Progress: {progress}</p>
                  <p>Score: {score}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserList;
