import { useQuery } from "@apollo/client/react";
import { GET_CURRENT_USER, GET_USER_ANIME_LIST } from "../services/queries";
import "../css/Userlist.css";
import { TrophySpin } from "react-loading-indicators";

function UserList() {
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

  if (userLoading || loading)
    return (
      <div className="loading-indicator">
        <TrophySpin color="#6e35ff" size="large" />
      </div>
    );
  if (userError) return <p>Error: {userError.message}</p>;
  if (error) return <p>Error: {error.message}</p>;

  const userlists = data?.MediaListCollection?.lists || [];

  return (
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
                  <div className="anime-card-image-overlay" />
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
  );
}

export default UserList;
