import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { useAuth } from "../contexts/AuthContext.js";
import { Box, Stack } from "@mui/material";
import {
  GET_CURRENT_USER,
  GET_MEDIA_DETAILS,
  GET_USER_MEDIA_STATUS,
} from "../services/Queries.jsx";
import { SAVE_MEDIA_TO_LIST, TOGGLE_FAVOURITE } from "../services/Mutation.jsx";
import DetailsBanner from "../components/Details/DetailsBanner.jsx";
import DetailsCoverSection from "../components/Details/DetailsCoverSection.jsx";
import DetailsInfoSection from "../components/Details/DetailsInfoSection.jsx";
import DetailsRelationsSection from "../components/Details/DetailsRelationsSection.jsx";
import DetailsCharactersSection from "../components/Details/DetailsCharactersSection.jsx";
import DetailsStaffSection from "../components/Details/DetailsStaffSection.jsx";
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
          ? `Updated list as ${status}.`
          : `Moved to ${status}.`,
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
      <DetailsBanner bannerImage={media.bannerImage} />
      <Box className="details-container">
        <Box className="details-card">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 3, md: 4 }}
          >
            <DetailsCoverSection
              media={media}
              type={type}
              currentStatus={currentStatus}
              isFavourite={isFavourite}
              listUpdating={listUpdating}
              favouriteUpdating={favouriteUpdating}
              anchorEl={anchorEl}
              listMenuOpen={listMenuOpen}
              actionMessage={actionMessage}
              actionError={actionError}
              onOpenMenu={handleOpenMenu}
              onCloseMenu={handleCloseMenu}
              onStatusSelect={handleStatusSelect}
              onToggleFavourite={handleToggleFavourite}
            />
            <DetailsInfoSection
              media={media}
              alternateTitleLine={alternateTitleLine}
              cleanDescription={cleanDescription}
              metaDetails={metaDetails}
            />
          </Stack>
        </Box>

        <DetailsRelationsSection
          relations={relations}
          onNavigate={handleNavigateToMedia}
        />
        <DetailsCharactersSection characters={characters} />
        <DetailsStaffSection staff={staff} />
      </Box>
    </Box>
  );
}

export default Details;
