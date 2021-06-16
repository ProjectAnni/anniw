import React from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import MoreIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

function PlaylistItem({ item, index, control, button }: PlaylistItemProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ListItem
      key={`${item.catalog}/${item.track}/${index}`}
      button={
        // https://github.com/mui-org/material-ui/issues/14971#issuecomment-675588395
        button as any
      }
    >
      {
        // Render index when provided
        index !== undefined && (
          <ListItemIcon>
            <ListItemText primary={index} />
          </ListItemIcon>
        )
      }
      <ListItemText
        primary={
          // TODO: Render music title & artist
          `${item.catalog}/${item.track}`
        }
      />
      {control && (
        <ListItemSecondaryAction>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleClick}
          >
            <MoreIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Remove</MenuItem>
            <MenuItem onClick={handleClose}>Details</MenuItem>
            <MenuItem onClick={handleClose}>Show Artist</MenuItem>
            <MenuItem onClick={handleClose}>Show Album</MenuItem>
            <MenuItem onClick={handleClose}>Add To Playlist</MenuItem>
          </Menu>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
}

export const Playlist: React.FC<PlaylistProps> = ({
  playlist,
  showIndex = true,
  control = true,
  button = true,
}) => {
  return (
    <List>
      {playlist.map((music, index) => (
        <PlaylistItem
          item={music}
          index={showIndex ? index + 1 : undefined}
          control={control}
          button={button}
        />
      ))}
    </List>
  );
};

export interface PlaylistProps {
  playlist: MusicIndex[];
  showIndex?: boolean;
  control?: boolean;
  button?: boolean;
}

interface PlaylistItemProps {
  item: MusicIndex;
  index?: number;
  control: boolean;
  button: boolean;
}
