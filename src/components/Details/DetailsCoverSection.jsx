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
import { LIST_STATUSES, formatStatus } from "../../utils/detailsHelpers.js";

function DetailsCoverSection({
  media,
  type,
  currentStatus,
  isFavourite,
  listUpdating,
  favouriteUpdating,
  anchorEl,
  listMenuOpen,
  actionMessage,
  actionError,
  onOpenMenu,
  onCloseMenu,
  onStatusSelect,
  onToggleFavourite,
}) {
  const listButtonLabel = currentStatus
    ? formatStatus(currentStatus, type)
    : "Add to List";

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
          onClick={onOpenMenu}
          disabled={listUpdating}
          className="list-button"
        >
          {listUpdating ? "Saving..." : listButtonLabel}
        </Button>
        <Menu
          id="list-menu"
          anchorEl={anchorEl}
          open={listMenuOpen}
          onClose={onCloseMenu}
          MenuListProps={{ "aria-labelledby": "list-menu-button" }}
          className="list-menu"
        >
          {LIST_STATUSES.map((status) => (
            <MenuItem
              key={status}
              selected={status === currentStatus}
              onClick={() => onStatusSelect(status)}
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
        </Menu>
        <IconButton
          onClick={onToggleFavourite}
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
