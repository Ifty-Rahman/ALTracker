import { ToggleButton, ToggleButtonGroup } from "@mui/material";

function UserListToggleGroup({ value, onChange, className }) {
  return (
    <ToggleButtonGroup
      className={className}
      value={value}
      exclusive
      onChange={onChange}
    >
      <ToggleButton value="ANIME" aria-label="anime lists">
        Anime
      </ToggleButton>
      <ToggleButton value="MANGA" aria-label="manga lists">
        Manga
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default UserListToggleGroup;
