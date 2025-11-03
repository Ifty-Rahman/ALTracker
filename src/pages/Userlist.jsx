import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { Link, useNavigate } from "react-router-dom";
import { GET_CURRENT_USER, GET_USER_ANIME_LIST } from "../services/Queries.jsx";
import { TrophySpin } from "react-loading-indicators";
import "../css/Userlist.css";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

function UserList() {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("anilist_token"),
  );
  const [mediaType, setMediaType] = useState("ANIME");

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

  const {
    loading: listsLoading,
    error: listsError,
    data,
  } = useQuery(GET_USER_ANIME_LIST, {
    variables: { userName: username },
    skip: !authToken || !username,
  });

  const isAnime = mediaType === "ANIME";
  const animeLists = data?.anime?.lists || [];
  const mangaLists = data?.manga?.lists || [];
  const activeLists = isAnime ? animeLists : mangaLists;
  const hasEntries = activeLists.some(
    (list) => (list.entries ?? []).length > 0,
  );

  if (userLoading || listsLoading)
    return (
      <div className="loading-indicator">
        <TrophySpin color="#6e35ff" size="large" />
      </div>
    );

  const activeError = userError || listsError;

  if (activeError)
    return <p>Error: {activeError?.message || "Unable to load lists."}</p>;

  const handleCardClick = (media) => {
    const targetType = media.type || mediaType;
    navigate(`/Details?id=${media.id}&type=${targetType}`);
  };

  return (
    <div>
      {authToken ? (
        <div className="anime-list-container">
          <div className="userlist-toggle">
            <ToggleButtonGroup
              className="userlist-toggle-group"
              value={mediaType}
              exclusive
              onChange={(event, value) => {
                if (value) setMediaType(value);
              }}
            >
              <ToggleButton value="ANIME" aria-label="anime lists">
                Anime
              </ToggleButton>
              <ToggleButton value="MANGA" aria-label="manga lists">
                Manga
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          {hasEntries ? (
            activeLists.map((list) => {
              const entries = list.entries ?? [];
              return (
                <div key={list.name} className="anime-list">
                  <h1>{list.name}</h1>
                  <div className="anime-grid-list">
                    {entries.map(
                      ({ media, score, progress, progressVolumes }) => {
                        const totalEpisodes = media.episodes ?? "?";
                        const totalChapters = media.chapters ?? "?";
                        const totalVolumes = media.volumes ?? "?";
                        const progressCount = progress ?? 0;
                        const progressText = isAnime
                          ? `Ep: ${progressCount} / ${totalEpisodes}`
                          : `Ch: ${progressCount} / ${totalChapters}`;
                        const volumeText = `Vol: ${progressVolumes ?? 0} / ${totalVolumes}`;
                        const scoreText = `Score: ${score ?? "-"}`;

                        return (
                          <div className="anime-card-list" key={media.id}>
                            <div
                              onClick={() => handleCardClick(media)}
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
                              <p>{progressText}</p>
                              {!isAnime && <p>{volumeText}</p>}
                              <p>{scoreText}</p>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="userlist-empty">
              <p>
                You don&apos;t have any {isAnime ? "anime" : "manga"} here yet.
                Visit Discover or Search to add some titles to your lists.
              </p>
              <div className="userlist-empty-actions">
                <Link to="/Discover">Go to Discover</Link>
              </div>
            </div>
          )}
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
