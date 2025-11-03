import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaListUl } from "react-icons/fa";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { GoCheck } from "react-icons/go";
import {
  GET_MEDIA_DETAILS,
  GET_USER_MEDIA_STATUS,
} from "../services/Queries.jsx";
import { SAVE_MEDIA_TO_LIST, TOGGLE_FAVOURITE } from "../services/Mutation.jsx";
import "../css/Details.css";

const LIST_STATUSES = [
  "CURRENT",
  "PLANNING",
  "COMPLETED",
  "PAUSED",
  "DROPPED",
  "REPEATING",
];

const STATUS_LABELS = {
  CURRENT: { ANIME: "Currently Watching", MANGA: "Currently Reading" },
  PLANNING: { default: "Planning" },
  COMPLETED: { default: "Completed" },
  PAUSED: { default: "On Hold" },
  DROPPED: { default: "Dropped" },
  REPEATING: { ANIME: "Rewatching", MANGA: "Rereading", default: "Rewatching" },
};

const toDisplayText = (label) =>
  label
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

const formatStatus = (status, mediaType) => {
  if (!status) return "";
  const formattedStatus = STATUS_LABELS[status];
  if (!formattedStatus) return toDisplayText(status.replace(/_/g, " "));
  return (
    formattedStatus[mediaType] ||
    formattedStatus.default ||
    toDisplayText(status.replace(/_/g, " "))
  );
};

const formatRelation = (relation) => toDisplayText(relation.replace(/_/g, " "));

function Details() {
  const [searchParams] = useSearchParams();
  const id = parseInt(searchParams.get("id"));
  const rawType = searchParams.get("type");
  const type = rawType ? rawType.toUpperCase() : null;

  const [currentStatus, setCurrentStatus] = useState(null);
  const [isFavourite, setIsFavourite] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const listMenuOpen = Boolean(anchorEl);

  const skipQuery = Number.isNaN(id) || !type;

  // 🔹 Fetch main media details
  const { loading, error, data, refetch } = useQuery(GET_MEDIA_DETAILS, {
    variables: { id, type },
    skip: skipQuery,
  });

  // 🔹 Fetch user's list status for this media
  const { data: userListData, refetch: refetchUserStatus } = useQuery(
    GET_USER_MEDIA_STATUS,
    {
      variables: { mediaId: id },
      skip: skipQuery,
      fetchPolicy: "cache-and-network",
    },
  );

  const [saveToList, { loading: listUpdating }] =
    useMutation(SAVE_MEDIA_TO_LIST);
  const [toggleFavouriteMutation, { loading: favouriteUpdating }] =
    useMutation(TOGGLE_FAVOURITE);

  // 🔹 Update UI when media details or user list data changes
  useEffect(() => {
    if (data?.Media) {
      const { isFavourite: favFlag } = data.Media;
      setIsFavourite(Boolean(favFlag));
    }
    if (userListData?.MediaList) {
      setCurrentStatus(userListData.MediaList.status);
    } else {
      setCurrentStatus(null);
    }
  }, [data, userListData]);

  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  // 🔹 Handle list status change
  const handleStatusSelect = async (status) => {
    if (!id) return;
    try {
      await saveToList({ variables: { mediaId: id, status } });
      setCurrentStatus(status);
      setActionMessage(`Updated as ${formatStatus(status, type)}.`);
      await refetchUserStatus();
    } catch (err) {
      setActionError("Unable to update list right now.");
      console.error(err);
    } finally {
      handleCloseMenu();
    }
  };

  // 🔹 Toggle favourite
  const handleToggleFavourite = async () => {
    if (!id || !type) return;
    try {
      const favVars = type === "ANIME" ? { animeId: id } : { mangaId: id };
      await toggleFavouriteMutation({ variables: favVars });
      setIsFavourite((prev) => !prev);
      setActionMessage(
        !isFavourite ? "Added to favourites." : "Removed from favourites.",
      );
      await refetch();
    } catch (err) {
      setActionError("Unable to update favourites right now.");
      console.error(err);
    }
  };

  const media = data?.Media;
  const cleanDescription = useMemo(() => {
    if (!media?.description) return "No description available.";
    return media.description.replace(/<[^>]+>/g, "");
  }, [media?.description]);

  const listButtonLabel = currentStatus
    ? formatStatus(currentStatus, type)
    : "Add to List";

  if (skipQuery)
    return (
      <Box className="details-page">
        <Box className="details-feedback error">Missing media identifier.</Box>
      </Box>
    );

  if (loading)
    return (
      <Box className="details-page loading-state">
        <CircularProgress color="inherit" size={48} />
      </Box>
    );

  if (error)
    return (
      <Box className="details-page">
        <Box className="details-feedback error">Error: {error.message}</Box>
      </Box>
    );

  if (!media)
    return (
      <Box className="details-page">
        <Box className="details-feedback error">
          Media not found. Please try again.
        </Box>
      </Box>
    );

  return (
    <Box className="details-page">
      {media.bannerImage && (
        <Box
          className="details-banner"
          style={{ backgroundImage: `url(${media.bannerImage})` }}
        >
          <Box className="banner-overlay" />
        </Box>
      )}

      <Box className="details-container">
        <Box className="details-card">
          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <Box className="cover-section">
              <img
                src={media.coverImage?.large}
                alt={media.title?.romaji}
                className="cover-img"
              />
              <Stack direction="row" spacing={1.5} className="cover-actions">
                <Button
                  id="list-menu-button"
                  variant="contained"
                  color="primary"
                  startIcon={<FaListUl size={16} />}
                  endIcon={<MdKeyboardArrowDown size={18} />}
                  onClick={handleOpenMenu}
                  disabled={listUpdating}
                >
                  {listUpdating ? "Saving..." : listButtonLabel}
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={listMenuOpen}
                  onClose={handleCloseMenu}
                >
                  {LIST_STATUSES.map((status) => (
                    <MenuItem
                      key={status}
                      selected={status === currentStatus}
                      onClick={() => handleStatusSelect(status)}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%"
                      >
                        <span>{formatStatus(status, type)}</span>
                        {status === currentStatus && <GoCheck size={16} />}
                      </Stack>
                    </MenuItem>
                  ))}
                </Menu>

                <IconButton
                  onClick={handleToggleFavourite}
                  disabled={favouriteUpdating}
                >
                  {isFavourite ? (
                    <AiFillHeart size={22} className="heart-icon filled" />
                  ) : (
                    <AiOutlineHeart size={22} className="heart-icon" />
                  )}
                </IconButton>
              </Stack>
              {(actionMessage || actionError) && (
                <Typography
                  variant="caption"
                  className={`action-feedback ${
                    actionError ? "error" : "success"
                  }`}
                >
                  {actionError || actionMessage}
                </Typography>
              )}
            </Box>

            <Box className="details-info">
              <Typography variant="h3" className="details-title">
                {media.title?.userPreferred || media.title?.romaji}
              </Typography>
              <Typography variant="body1" className="description">
                {cleanDescription}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {media.genres?.map((genre) => (
                  <Chip key={genre} label={genre} className="genre-chip" />
                ))}
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default Details;
