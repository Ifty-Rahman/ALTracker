import React from "react";
import { useQuery } from "@apollo/client/react";
import { GET_CURRENT_USER, GET_USER_ANIME_LIST } from "../services/queries";
import AnimeCard from "../components/AnimeCard";

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

  if (userLoading || loading) return <p>Loading...</p>;
  if (userError) return <p>Error: {userError.message}</p>;
  if (error) return <p>Error: {error.message}</p>;

  const userlists = data?.MediaListCollection?.lists || [];

  return (
    <>
      <div className="anime-grid">
        {userlists.map((list) =>
          list.entries.map(({ media, score, progress }) => (
            <div className="anime-card" key={media.id}>
              <img src={media.coverImage.large} alt={media.title.romaji} />
              <div className="anime-info">
                <h3>{media.title.english || media.title.romaji}</h3>
                <p>Episodes: {media.episodes}</p>
                <p>Progress: {progress}</p>
                <p>Score: {score}</p>
              </div>
            </div>
          )),
        )}
      </div>
    </>
  );
}

export default UserList;
