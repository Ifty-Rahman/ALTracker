import { Box, Chip, Stack, Typography } from "@mui/material";

function DetailsInfoSection({
  media,
  alternateTitleLine,
  cleanDescription,
  metaDetails,
}) {
  return (
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
  );
}

export default DetailsInfoSection;
