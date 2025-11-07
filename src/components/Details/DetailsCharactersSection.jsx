import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { formatRelation } from "../../utils/detailsHelpers.js";

function DetailsCharactersSection({ media }) {
  const characters = useMemo(
    () => media?.characters?.edges?.filter((edge) => edge?.node) || [],
    [media?.characters?.edges],
  );

  if (!characters.length) return null;

  return (
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
  );
}

export default DetailsCharactersSection;
