import React, { useState } from "react";
import { atom, useRecoilValue } from "recoil";

import Modal from "@material-ui/core/Modal";
import IconButton from "@material-ui/core/IconButton";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";

import { Playlist } from "./Playlist";

const ActivePlaylistState = atom<MusicIndex[]>({
  key: "ActivePlaylistState",
  default: (() => JSON.parse(localStorage.getItem("playlist_active") || "[]"))(),
});

export const ActivePlaylistPopup: React.FC<ActivePlaylistPopupProps> = () => {
  const playlist = useRecoilValue(ActivePlaylistState);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <IconButton
        color="inherit"
        onClick={() => setExpanded((expanded) => !expanded)}
      >
        {expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
      </IconButton>
      <Modal
        open={expanded}
        BackdropProps={{ open: false }}
        onClose={() => setExpanded((expanded) => !expanded)}
        disableEscapeKeyDown
        sx={{
          top: "auto",
          left: "auto",
          right: 0,
          bottom: 64,
          width: 0.3,
          height: 0.5,
          outline: 0,
          zIndex: -1,
        }}
      >
        <Slide direction="up" in={expanded} timeout={100}>
          <Paper elevation={5} square sx={{ height: 1 }}>
            <Playlist playlist={playlist} />
          </Paper>
        </Slide>
      </Modal>
    </>
  );
};

export interface ActivePlaylistPopupProps {
}
