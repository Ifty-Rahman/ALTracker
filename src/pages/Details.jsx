import { useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { Box, Stack } from "@mui/material";
import { GET_MEDIA_DETAILS } from "../services/Queries.jsx";
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
  const id = parseInt(searchParams.get("id"));
  const rawType = searchParams.get("type");
  const type = rawType ? rawType.toUpperCase() : null;

  const skipQuery = Number.isNaN(id) || !type;

  const { loading, error, data, refetch } = useQuery(GET_MEDIA_DETAILS, {
    variables: { id, type },
    skip: skipQuery,
  });

  const media = data?.Media;

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
              mediaId={id}
              onMediaRefetch={refetch}
            />
            <DetailsInfoSection media={media} type={type} />
          </Stack>
        </Box>

        <DetailsRelationsSection media={media} />
        <DetailsCharactersSection media={media} />
        <DetailsStaffSection media={media} />
      </Box>
    </Box>
  );
}

export default Details;
