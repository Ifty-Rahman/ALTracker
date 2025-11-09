import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.js";
import { GET_CURRENT_USER, GET_USER_MEDIA_LIST } from "../services/Queries.jsx";
import { TrophySpin } from "react-loading-indicators";
import "../css/Userlist.css";
import UserListGrid from "../components/Userlist/UserListGrid.jsx";
import UserListSelect from "../components/Userlist/UserListSelect.jsx";
import UserListToggleGroup from "../components/Userlist/UserListToggleGroup.jsx";

const DEFAULT_LIST_NAME = "Planning";
const NORMALIZED_DEFAULT_NAME = DEFAULT_LIST_NAME.toLowerCase();

function UserList() {
  const navigate = useNavigate();
  const { authToken } = useAuth();
  const [mediaType, setMediaType] = useState("ANIME");
  const [selectedListName, setSelectedListName] = useState(DEFAULT_LIST_NAME);

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
  } = useQuery(GET_USER_MEDIA_LIST, {
    variables: { userName: username },
    skip: !authToken || !username,
    fetchPolicy: "cache-first",
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
      if (selectedListName !== DEFAULT_LIST_NAME) {
        setSelectedListName(DEFAULT_LIST_NAME);
      }
      return;
    }

    const nextDefault = activeLists.find(
      (list) => list.name?.toLowerCase() === NORMALIZED_DEFAULT_NAME,
    );
    const fallbackName =
      nextDefault?.name ?? activeLists[0]?.name ?? DEFAULT_LIST_NAME;
    const hasSelected = activeLists.some(
      (list) => list.name === selectedListName,
    );

    if (!hasSelected) {
      setSelectedListName(fallbackName);
    } else if (
      selectedListName?.toLowerCase() === NORMALIZED_DEFAULT_NAME &&
      !nextDefault
    ) {
      setSelectedListName(fallbackName);
    }
  }, [activeLists, selectedListName]);

  const defaultList = activeLists.find(
    (list) => list.name?.toLowerCase() === NORMALIZED_DEFAULT_NAME,
  );

  const selectedList =
    activeLists.find((list) => list.name === selectedListName) ??
    defaultList ??
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
            <UserListToggleGroup
              className="userlist-toggle-group"
              value={mediaType}
              onChange={(_, value) => {
                if (value) {
                  setMediaType(value);
                  setSelectedListName(DEFAULT_LIST_NAME);
                }
              }}
            />
            {listOptions.length > 0 && (
              <UserListSelect
                className="userlist-select"
                value={selectedListName}
                options={listOptions}
                onChange={(event) => setSelectedListName(event.target.value)}
              />
            )}
          </div>
          {hasLists ? (
            hasSelectedEntries ? (
              <UserListGrid
                entries={selectedEntries}
                isAnime={isAnime}
                onCardClick={handleCardClick}
              />
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
          <p>Please log in with you Anilist account to see your lists</p>
        </div>
      )}
    </div>
  );
}

export default UserList;
