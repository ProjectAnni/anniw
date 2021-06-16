import React, { useState } from "react";
import { atom, useRecoilValue } from "recoil";
import styles from "./ActivePlaylistPopup.module.scss";

import Modal from "@material-ui/core/Modal";
import IconButton from "@material-ui/core/IconButton";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";

import { Playlist } from "./Playlist";

const ActivePlaylistState = atom<MusicIndex[]>({
  key: "ActivePlaylistState",
  default: [
    { catalog: "TEST-001", track: 1 },
    { catalog: "TEST-001", track: 2 },
  ] as MusicIndex[],
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
        className={styles.modal}
      >
        <Slide direction="up" in={expanded} timeout={100}>
          <Paper elevation={5} square className={styles.body}>
            <Playlist playlist={playlist} />
          </Paper>
        </Slide>
      </Modal>
    </>
  );
};

export interface ActivePlaylistPopupProps {
}
