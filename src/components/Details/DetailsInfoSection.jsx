import { useMemo } from "react";
import { Box, Chip, Stack, Typography, useMediaQuery } from "@mui/material";

function DetailsInfoSection({ media, type }) {
  const isMobile = useMediaQuery("(max-width: 480px)");
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

  if (!media) return null;

  return (
    <Box className="details-info">
      <Typography
        variant="h3"
        fontSize={isMobile ? 25 : 50}
        className="details-title"
      >
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
  );
}

export default DetailsInfoSection;
