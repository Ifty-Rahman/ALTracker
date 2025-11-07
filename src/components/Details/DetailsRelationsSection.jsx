import { useCallback, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatRelation } from "../../utils/detailsHelpers.js";

function DetailsRelationsSection({ media }) {
  const relations = useMemo(
    () => media?.relations?.edges?.filter((edge) => edge?.node) || [],
    [media?.relations?.edges],
  );
  const navigate = useNavigate();

  const handleNavigate = useCallback(
    (targetId, targetType) => {
      if (!targetId || !targetType) return;
      navigate({
        pathname: "/Details",
        search: `?id=${targetId}&type=${targetType}`,
      });
    },
    [navigate],
  );

  if (!relations.length) return null;

  return (
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
            onClick={() => handleNavigate(relation.node.id, relation.node.type)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" ||
                event.key === " " ||
                event.key === "Spacebar"
              ) {
                event.preventDefault();
                handleNavigate(relation.node.id, relation.node.type);
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
  );
}

export default DetailsRelationsSection;
