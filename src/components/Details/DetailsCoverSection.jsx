import { useEffect, useState } from "react";
import {
  Box,
  Button,
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
import { useMutation, useQuery } from "@apollo/client/react";
import { useAuth } from "../../contexts/AuthContext.js";
import {
  GET_CURRENT_MEDIA,
  GET_CURRENT_USER,
  GET_USER_MEDIA_STATUS,
} from "../../services/Queries.jsx";
import {
  SAVE_MEDIA_TO_LIST,
  TOGGLE_FAVOURITE,
  DELETE_MEDIA_LIST_ENTRY,
} from "../../services/Mutation.jsx";
import { LIST_STATUSES, formatStatus } from "../../utils/detailsHelpers.js";

function DetailsCoverSection({ media, type, mediaId, onMediaRefetch }) {
  const resolvedMediaId = media?.id ?? mediaId;
  const { authToken } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const listMenuOpen = Boolean(anchorEl);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [currentListEntryId, setCurrentListEntryId] = useState(null);
  const [isFavourite, setIsFavourite] = useState(Boolean(media?.isFavourite));
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const { data: viewerData } = useQuery(GET_CURRENT_USER, {
    skip: !authToken,
  });
  const viewerId = viewerData?.Viewer?.id;
  const username = viewerData?.Viewer?.name;

  const skipStatusQuery = !viewerId || !resolvedMediaId;
  const { data: userMediaStatusData, refetch: refetchUserMediaStatus } =
    useQuery(GET_USER_MEDIA_STATUS, {
      variables: { userId: viewerId, mediaId: resolvedMediaId },
      skip: skipStatusQuery,
    });

  const [saveToList, { loading: listUpdating }] =
    useMutation(SAVE_MEDIA_TO_LIST);
  const [deleteMediaListEntry, { loading: deleteListEntryLoading }] =
    useMutation(DELETE_MEDIA_LIST_ENTRY);
  const [toggleFavouriteMutation, { loading: favouriteUpdating }] =
    useMutation(TOGGLE_FAVOURITE);

  useEffect(() => {
    setIsFavourite(Boolean(media?.isFavourite));
  }, [media?.isFavourite]);

  const statusFromListQuery = userMediaStatusData
    ? (userMediaStatusData.MediaList?.status ?? null)
    : undefined;
  const entryIdFromListQuery = userMediaStatusData
    ? (userMediaStatusData.MediaList?.id ?? null)
    : undefined;
  const derivedStatus =
    statusFromListQuery !== undefined
      ? statusFromListQuery
      : (media?.mediaListEntry?.status ?? null);
  const derivedEntryId =
    entryIdFromListQuery !== undefined
      ? entryIdFromListQuery
      : (media?.mediaListEntry?.id ?? null);

  useEffect(() => {
    if (derivedStatus === undefined) return;
    if (derivedStatus !== currentStatus) {
      setCurrentStatus(derivedStatus);
    }
  }, [derivedStatus, currentStatus]);

  useEffect(() => {
    if (derivedEntryId === undefined) return;
    if (derivedEntryId !== currentListEntryId) {
      setCurrentListEntryId(derivedEntryId);
    }
  }, [derivedEntryId, currentListEntryId]);

  useEffect(() => {
    if (!actionMessage && !actionError) return undefined;
    const timeout = setTimeout(() => {
      setActionMessage("");
      setActionError("");
    }, 4000);

    return () => clearTimeout(timeout);
  }, [actionError, actionMessage]);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const getRefetchListQueries = () =>
    username && type
      ? [
          {
            query: GET_CURRENT_MEDIA,
            variables: { userName: username, type },
          },
        ]
      : [];

  const handleStatusSelect = async (status) => {
    if (!resolvedMediaId) return;
    setActionError("");
    setActionMessage("");

    const refetchListQueries = getRefetchListQueries();

    try {
      const previousStatus = currentStatus;
      const { data: saveResult } = await saveToList({
        variables: { mediaId: resolvedMediaId, status },
        refetchQueries: refetchListQueries,
      });
      const updatedEntryId =
        saveResult?.SaveMediaListEntry?.id ?? currentListEntryId ?? null;
      setCurrentListEntryId(updatedEntryId);
      setCurrentStatus(status);
      setActionMessage(
        status === previousStatus
          ? `Updated list as ${status}.`
          : `Moved to ${status}.`,
      );
      await onMediaRefetch?.();
      if (!skipStatusQuery) {
        await refetchUserMediaStatus?.();
      }
    } catch (mutationError) {
      setActionError("Unable to update the list right now.");
      console.error(mutationError);
    } finally {
      handleCloseMenu();
    }
  };

  const handleRemoveFromList = async () => {
    if (!currentListEntryId) {
      handleCloseMenu();
      return;
    }
    setActionError("");
    setActionMessage("");

    const refetchListQueries = getRefetchListQueries();

    try {
      await deleteMediaListEntry({
        variables: { id: currentListEntryId },
        refetchQueries: refetchListQueries,
      });
      setCurrentStatus(null);
      setCurrentListEntryId(null);
      setActionMessage("Removed from list.");
      await onMediaRefetch?.();
      if (!skipStatusQuery) {
        await refetchUserMediaStatus?.();
      }
    } catch (mutationError) {
      setActionError("Unable to remove from the list right now.");
      console.error(mutationError);
    } finally {
      handleCloseMenu();
    }
  };

  const handleToggleFavourite = async () => {
    if (!resolvedMediaId || !type) return;
    setActionError("");
    setActionMessage("");
    try {
      const favouriteVars =
        type === "ANIME"
          ? { animeId: resolvedMediaId }
          : { mangaId: resolvedMediaId };
      await toggleFavouriteMutation({
        variables: favouriteVars,
      });
      const nextFavourite = !isFavourite;
      setIsFavourite(nextFavourite);
      setActionMessage(
        nextFavourite ? "Added to favourites." : "Removed from favourites.",
      );
      await onMediaRefetch?.();
    } catch (mutationError) {
      setActionError("Unable to update favourites right now.");
      console.error(mutationError);
    }
  };

  const listButtonLabel = currentStatus
    ? formatStatus(currentStatus, type)
    : "Add to List";
  const listMutationInFlight = listUpdating || deleteListEntryLoading;

  if (!media) {
    return null;
  }

  return (
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
          disabled={listMutationInFlight}
          className="list-button"
        >
          {listMutationInFlight ? "Saving..." : listButtonLabel}
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
              disabled={listMutationInFlight}
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
          <MenuItem
            key="none"
            selected={!currentStatus}
            onClick={handleRemoveFromList}
            disabled={listMutationInFlight}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
              gap={1.5}
            >
              <span>None</span>
              {!currentStatus && <GoCheck size={16} />}
            </Stack>
          </MenuItem>
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
          className={`action-feedback ${actionError ? "error" : "success"}`}
        >
          {actionError || actionMessage}
        </Typography>
      )}
    </Box>
  );
}

export default DetailsCoverSection;
