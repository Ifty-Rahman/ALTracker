import { Box } from "@mui/material";

function DetailsBanner({ bannerImage }) {
  if (!bannerImage) return null;

  return (
    <Box
      className="details-banner"
      style={{ backgroundImage: `url(${bannerImage})` }}
    >
      <Box className="banner-overlay" />
    </Box>
  );
}

export default DetailsBanner;
