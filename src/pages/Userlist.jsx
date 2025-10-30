import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_CURRENT_USER, GET_USER_ANIME_LIST } from "../services/queries";
import { TrophySpin } from "react-loading-indicators";
import "../css/Userlist.css";

function UserList() {
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("anilist_token"),
  );

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthToken(localStorage.getItem("anilist_token"));
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_CURRENT_USER, {
    skip: !authToken,
  });

  const username = userData?.Viewer?.name;

  const { loading, error, data } = useQuery(GET_USER_ANIME_LIST, {
    variables: { userName: username },
    skip: !authToken || !username,
  });

  if (userLoading || loading)
    return (
      <div className="loading-indicator">
        <TrophySpin color="#6e35ff" size="large" />
      </div>
    );

  if (userError || error) return <p>Error: {userError?.message}</p>;

  const userlists = data?.MediaListCollection?.lists || [];

  return (
    <div>
      {authToken ? (
        <div className="anime-list-container">
          {userlists.map((list) => (
            <div key={list.name} className="anime-list">
              <h1>{list.name}</h1>
              <div className="anime-grid-list">
                {list.entries.map(({ media, score }) => (
                  <div className="anime-card-list" key={media.id}>
                    <div
                      className="anime-card-image"
                      style={{
                        backgroundImage: `url(${media.coverImage.large})`,
                      }}
                    >
                      <h3 className="anime-card-title">
                        {media.title.english || media.title.romaji}
                      </h3>
                    </div>
                    <div className="anime-info-list">
                      <p>Episodes: {media.episodes}</p>
                      <p>Score: {score}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="Not-Logged-In">
          <p>Please log in to see your lists</p>
        </div>
      )}
    </div>
  );
}

export default UserList;
