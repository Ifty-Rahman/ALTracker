import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { useAuth } from "../contexts/AuthContext.js";
import {
  Box,
  Button,
  Chip,
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
  GET_CURRENT_USER,
  GET_MEDIA_DETAILS,
  GET_USER_MEDIA_STATUS,
} from "../services/Queries.jsx";
import { SAVE_MEDIA_TO_LIST, TOGGLE_FAVOURITE } from "../services/Mutation.jsx";
import {
  LIST_STATUSES,
  formatStatus,
  formatRelation,
} from "../utils/detailsHelpers.js";
import "../css/Details.css";
import { TrophySpin } from "react-loading-indicators";

function Details() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = parseInt(searchParams.get("id"));
  const rawType = searchParams.get("type");
  const type = rawType ? rawType.toUpperCase() : null;

  const { authToken } = useAuth();
  const [currentStatus, setCurrentStatus] = useState(null);
  const [isFavourite, setIsFavourite] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const listMenuOpen = Boolean(anchorEl);

  const skipQuery = Number.isNaN(id) || !type;

  const { loading, error, data, refetch } = useQuery(GET_MEDIA_DETAILS, {
    variables: { id, type },
    skip: skipQuery,
  });

  const { data: viewerData } = useQuery(GET_CURRENT_USER, {
    skip: !authToken,
  });
  const viewerId = viewerData?.Viewer?.id;

  const skipStatusQuery = skipQuery || !viewerId;
  const { data: userMediaStatusData, refetch: refetchUserMediaStatus } =
    useQuery(GET_USER_MEDIA_STATUS, {
      variables: { userId: viewerId, mediaId: id },
      skip: skipStatusQuery,
    });

  const [saveToList, { loading: listUpdating }] =
    useMutation(SAVE_MEDIA_TO_LIST);
  const [toggleFavouriteMutation, { loading: favouriteUpdating }] =
    useMutation(TOGGLE_FAVOURITE);

  useEffect(() => {
    if (!data?.Media) return;
    const { isFavourite: favouriteFlag } = data.Media;
    setIsFavourite(Boolean(favouriteFlag));
  }, [data]);

  const statusFromListQuery = userMediaStatusData
    ? (userMediaStatusData.MediaList?.status ?? null)
    : undefined;
  const derivedStatus =
    statusFromListQuery !== undefined
      ? statusFromListQuery
      : (data?.Media?.mediaListEntry?.status ?? null);

  useEffect(() => {
    if (derivedStatus === undefined) return;
    if (derivedStatus !== currentStatus) {
      setCurrentStatus(derivedStatus);
    }
  }, [derivedStatus, currentStatus]);

  useEffect(() => {
    if (!actionMessage && !actionError) return undefined;
    const timeout = setTimeout(() => {
      setActionMessage("");
      setActionError("");
    }, 4000);

    return () => clearTimeout(timeout);
  }, [actionError, actionMessage]);

  useEffect(() => {
    if (skipQuery) {
      setActionError("Missing media identifier. Please return and try again.");
    }
  }, [skipQuery]);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleStatusSelect = async (status) => {
    if (!id) return;
    setActionError("");
    setActionMessage("");
    try {
      await saveToList({
        variables: { mediaId: id, status },
      });
      setCurrentStatus(status);
      setActionMessage(
        status === currentStatus
          ? `Updated list as ${formatStatus(status, type)}.`
          : `Moved to ${formatStatus(status, type)}.`,
      );
      await refetch();
      if (!skipStatusQuery) {
        await refetchUserMediaStatus();
      }
    } catch (mutationError) {
      setActionError("Unable to update the list right now.");
      console.error(mutationError);
    } finally {
      handleCloseMenu();
    }
  };

  const handleToggleFavourite = async () => {
    if (!id || !type) return;
    setActionError("");
    setActionMessage("");
    try {
      const favouriteVars =
        type === "ANIME" ? { animeId: id } : { mangaId: id };
      await toggleFavouriteMutation({
        variables: favouriteVars,
      });
      const nextFavourite = !isFavourite;
      setIsFavourite(nextFavourite);
      setActionMessage(
        nextFavourite ? "Added to favourites." : "Removed from favourites.",
      );
      await refetch();
    } catch (mutationError) {
      setActionError("Unable to update favourites right now.");
      console.error(mutationError);
    }
  };

  const media = data?.Media;

  const cleanDescription = useMemo(() => {
    if (!media?.description) return "No description available.";
    return media.description.replace(/<[^>]+>/g, "");
  }, [media?.description]);

  const alternateTitleLine = useMemo(() => {
    if (!media?.title) return "";
    const parts = [];
    const seenTitles = new Set();

    const pushPart = (label, value) => {
      if (!value) return;
      const normalized = value.trim().toLowerCase();
      if (seenTitles.has(normalized)) return;
      seenTitles.add(normalized);
      parts.push(`${label}: ${value}`);
    };

    pushPart("Native title", media.title.native);
    pushPart("Romaji title", media.title.romaji);
    pushPart("English title", media.title.english);

    return parts.join(", ");
  }, [media?.title]);

  const metaDetails = useMemo(() => {
    if (!media) return [];
    const seasonLabel =
      media.season && media.seasonYear
        ? `${media.season.charAt(0) + media.season.slice(1).toLowerCase()} ${media.seasonYear}`
        : null;
    const startDate = media.startDate
      ? [media.startDate.year, media.startDate.month, media.startDate.day]
          .filter(Boolean)
          .join("/")
      : null;
    const endDate = media.endDate
      ? [media.endDate.year, media.endDate.month, media.endDate.day]
          .filter(Boolean)
          .join("/")
      : null;

    const durationLabel =
      type === "ANIME" && media.duration
        ? `${media.duration} min / episode`
        : null;
    const countLabel =
      media.episodes || media.chapters || media.volumes
        ? media.episodes || media.chapters || media.volumes
        : "N/A";

    const statusText = media.status
      ? media.status.charAt(0) +
        media.status.slice(1).toLowerCase().replace(/_/g, " ")
      : "Unknown";

    return [
      { label: "Type", value: media.format || media.type },
      {
        label: type === "ANIME" ? "Episodes" : "Chapters/Volumes",
        value: countLabel,
      },
      { label: "Status", value: statusText },
      {
        label: "Average Score",
        value: media.averageScore ? `${media.averageScore}%` : "N/A",
      },
      {
        label: "Popularity",
        value: media.popularity?.toLocaleString?.() || "N/A",
      },
      { label: "Season", value: seasonLabel || "Unknown" },
      {
        label: "Airing",
        value: startDate ? `${startDate} - ${endDate || "?"}` : "TBD",
      },
      {
        label: "Studio",
        value: media.studios?.edges?.[0]?.node?.name || "Unknown",
      },
      { label: "Duration", value: durationLabel },
    ].filter((item) => item.value);
  }, [media, type]);

  const relations = media?.relations?.edges?.filter((edge) => edge?.node) || [];
  const characters =
    media?.characters?.edges?.filter((edge) => edge?.node) || [];
  const staff = media?.staff?.edges?.filter((edge) => edge?.node) || [];

  const listButtonLabel = currentStatus
    ? formatStatus(currentStatus, type)
    : "Add to List";

  const handleNavigateToMedia = (targetId, targetType) => {
    if (!targetId || !targetType) return;
    navigate({
      pathname: "/Details",
      search: `?id=${targetId}&type=${targetType}`,
    });
  };

  if (skipQuery) {
    return (
      <Box className="details-page">
        <Box className="details-feedback error">
          Unable to load media details without a valid identifier.
        </Box>
      </Box>
    );
  }

  if (loading)
    return (
      <div className="loading-indicator">
        <TrophySpin color="#6e35ff" size="large" />
      </div>
    );

  if (error) {
    return (
      <Box className="details-page">
        <Box className="details-feedback error">Error: {error.message}</Box>
      </Box>
    );
  }

  if (!media) {
    return (
      <Box className="details-page">
        <Box className="details-feedback error">
          Media not found. Please try another title.
        </Box>
      </Box>
    );
  }

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
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 3, md: 4 }}
          >
            <Box className="cover-section">
              <img
                src={media.coverImage?.large || media.coverImage?.medium}
                alt={
                  media.title?.userPreferred ||
                  media.title?.romaji ||
                  media.title?.english ||
                  "Cover art"
                }
                className="cover-img"
              />
              <Stack
                spacing={{ xs: 1, sm: 1.5 }}
                direction="row"
                className="cover-actions"
              >
                <Button
                  id="list-menu-button"
                  aria-haspopup="true"
                  aria-expanded={listMenuOpen ? "true" : undefined}
                  aria-controls={listMenuOpen ? "list-menu" : undefined}
                  variant="contained"
                  color="primary"
                  startIcon={<FaListUl size={16} />}
                  endIcon={<MdKeyboardArrowDown size={18} />}
                  onClick={handleOpenMenu}
                  disabled={listUpdating}
                  className="list-button"
                >
                  {listUpdating ? "Saving..." : listButtonLabel}
                </Button>
                <Menu
                  id="list-menu"
                  anchorEl={anchorEl}
                  open={listMenuOpen}
                  onClose={handleCloseMenu}
                  MenuListProps={{ "aria-labelledby": "list-menu-button" }}
                  className="list-menu"
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
                        gap={1.5}
                      >
                        <span>{formatStatus(status, type)}</span>
                        {status === currentStatus && <GoCheck size={16} />}
                      </Stack>
                    </MenuItem>
                  ))}
                </Menu>
                <IconButton
                  onClick={handleToggleFavourite}
                  className={`favourite-button ${isFavourite ? "active" : ""}`}
                  aria-label={
                    isFavourite ? "Remove from favourites" : "Add to favourites"
                  }
                  disabled={favouriteUpdating}
                >
                  {isFavourite ? (
                    <AiFillHeart className="heart-icon filled" size={22} />
                  ) : (
                    <AiOutlineHeart className="heart-icon" size={22} />
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
                {media.title?.userPreferred ||
                  media.title?.romaji ||
                  media.title?.english}
              </Typography>
              {alternateTitleLine && (
                <Typography variant="subtitle2" className="alt-titles">
                  {alternateTitleLine}
                </Typography>
              )}
              {media.genres?.length > 0 && (
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  className="genre-stack"
                >
                  {media.genres.map((genre) => (
                    <Chip
                      key={genre}
                      label={genre}
                      className="genre-chip"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Stack>
              )}
              <Typography variant="body1" className="description">
                {cleanDescription}
              </Typography>
              <Box className="meta-grid">
                {metaDetails.map((item) => (
                  <Box key={item.label} className="meta-item">
                    <Typography variant="overline" className="meta-label">
                      {item.label}
                    </Typography>
                    <Typography variant="body2" className="meta-value">
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Stack>
        </Box>

        {relations.length > 0 && (
          <Box className="details-section">
            <Box className="section-header">
              <Typography variant="h5">Relations</Typography>
            </Box>
            <Box className="card-row">
              {relations.slice(0, 12).map((relation) => (
                <Box
                  key={relation.node.id}
                  className="media-card"
                  role="link"
                  tabIndex={0}
                  onClick={() =>
                    handleNavigateToMedia(relation.node.id, relation.node.type)
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " " ||
                      event.key === "Spacebar"
                    ) {
                      event.preventDefault();
                      handleNavigateToMedia(
                        relation.node.id,
                        relation.node.type,
                      );
                    }
                  }}
                >
                  <img
                    src={relation.node.coverImage?.medium}
                    alt={relation.node.title?.romaji}
                    className="media-card-img"
                  />
                  <Typography variant="subtitle2" className="media-card-title">
                    {relation.node.title?.userPreferred ||
                      relation.node.title?.romaji ||
                      relation.node.title?.english}
                  </Typography>
                  <Typography variant="caption" className="media-card-subtitle">
                    {formatRelation(relation.relationType)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {characters.length > 0 && (
          <Box className="details-section">
            <Box className="section-header">
              <Typography variant="h5">Characters</Typography>
            </Box>
            <Box className="card-row">
              {characters.slice(0, 12).map((character) => (
                <Box key={character.node.id} className="person-card">
                  <img
                    src={character.node.image?.medium}
                    alt={character.node.name?.full}
                    className="person-card-img"
                  />
                  <Typography variant="subtitle2" className="person-card-name">
                    {character.node.name?.full}
                  </Typography>
                  <Typography variant="caption" className="person-card-role">
                    {formatRelation(character.role)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {staff.length > 0 && (
          <Box className="details-section">
            <Box className="section-header">
              <Typography variant="h5">Staff</Typography>
            </Box>
            <Box className="card-row">
              {staff.slice(0, 12).map((staffMember) => (
                <Box key={staffMember.node.id} className="person-card">
                  <img
                    src={staffMember.node.image?.medium}
                    alt={staffMember.node.name?.full}
                    className="person-card-img"
                  />
                  <Typography variant="subtitle2" className="person-card-name">
                    {staffMember.node.name?.full}
                  </Typography>
                  <Typography variant="caption" className="person-card-role">
                    {staffMember.role}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Details;
