import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.js";
import { GET_CURRENT_USER, GET_USER_ANIME_LIST } from "../services/Queries.jsx";
import { TrophySpin } from "react-loading-indicators";
import "../css/Userlist.css";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

function UserList() {
  const navigate = useNavigate();
  const { authToken } = useAuth();
  const [mediaType, setMediaType] = useState("ANIME");
  const [selectedListName, setSelectedListName] = useState("Completed");

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
    fetchPolicy: "network-only",
  });

  const isAnime = mediaType === "ANIME";
  const animeLists = data?.anime?.lists || [];
  const mangaLists = data?.manga?.lists || [];
  const activeLists = isAnime ? animeLists : mangaLists;
  const listOptions = activeLists
    .map((list) => list.name)
    .filter((name) => Boolean(name));

  useEffect(() => {
    if (!activeLists.length) {
      if (selectedListName !== "Completed") {
        setSelectedListName("Completed");
      }
      return;
    }

    const nextCompleted = activeLists.find(
      (list) => list.name?.toLowerCase() === "completed",
    );
    const fallbackName =
      nextCompleted?.name ?? activeLists[0]?.name ?? "Completed";
    const hasSelected = activeLists.some(
      (list) => list.name === selectedListName,
    );

    if (!hasSelected) {
      setSelectedListName(fallbackName);
    } else if (
      selectedListName?.toLowerCase() === "completed" &&
      !nextCompleted
    ) {
      setSelectedListName(fallbackName);
    }
  }, [activeLists, selectedListName]);

  const completedList = activeLists.find(
    (list) => list.name?.toLowerCase() === "completed",
  );

  const selectedList =
    activeLists.find((list) => list.name === selectedListName) ??
    completedList ??
    activeLists[0];
  const selectedEntries = selectedList?.entries ?? [];
  const hasLists = activeLists.length > 0;
  const hasSelectedEntries = selectedEntries.length > 0;
  const selectedListDisplayName = selectedList?.name ?? selectedListName;

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
          <div className="userlist-header">
            <ToggleButtonGroup
              className="userlist-toggle-group"
              value={mediaType}
              exclusive
              onChange={(_, value) => {
                if (value) {
                  setMediaType(value);
                  setSelectedListName("Completed");
                }
              }}
            >
              <ToggleButton value="ANIME" aria-label="anime lists">
                Anime
              </ToggleButton>
              <ToggleButton value="MANGA" aria-label="manga lists">
                Manga
              </ToggleButton>
            </ToggleButtonGroup>
            {listOptions.length > 0 && (
              <FormControl
                size="small"
                className="userlist-select"
                variant="outlined"
              >
                <InputLabel id="userlist-select-label">List</InputLabel>
                <Select
                  labelId="userlist-select-label"
                  label="List"
                  value={selectedListName}
                  onChange={(event) => setSelectedListName(event.target.value)}
                >
                  {listOptions.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </div>
          {hasLists ? (
            hasSelectedEntries ? (
              <div className="anime-grid-list">
                {selectedEntries.map(
                  ({ media, score, progress, progressVolumes }) => {
                    const totalEpisodes = media.episodes ?? "?";
                    const totalChapters = media.chapters ?? "?";
                    const totalVolumes = media.volumes ?? "?";
                    const progressCount = progress ?? 0;
                    const progressText = isAnime
                      ? `Ep: ${progressCount}/${totalEpisodes}`
                      : `Ch: ${progressCount}/${totalChapters}`;
                    const volumeText = `Vol: ${progressVolumes ?? 0}/${totalVolumes}`;
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
                          <p> {scoreText}</p>
                          {!isAnime && <p>{volumeText}</p>}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            ) : (
              <div className="userlist-empty">
                <p>
                  {selectedListDisplayName
                    ? `No entries in "${selectedListDisplayName}" yet.`
                    : "No entries in this list yet."}
                </p>
                <div className="userlist-empty-actions">
                  <Link to="/">Go to Discover</Link>
                </div>
              </div>
            )
          ) : (
            <div className="userlist-empty">
              <p>
                You don&apos;t have any {isAnime ? "anime" : "manga"} here yet.
                Visit Discover or Search to add some titles to your lists.
              </p>
              <div className="userlist-empty-actions">
                <Link to="/">Go to Discover</Link>
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
