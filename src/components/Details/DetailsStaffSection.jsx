import { Box, Typography } from "@mui/material";

function DetailsStaffSection({ staff }) {
  if (!staff || staff.length === 0) return null;

  return (
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
  );
}

export default DetailsStaffSection;
