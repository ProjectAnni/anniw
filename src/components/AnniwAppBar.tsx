import React from "react";
import { useRecoilState } from "recoil";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import { DrawerIsOpen } from "./AnniwDrawer";
import styles from "./AnniwAppBar.module.scss";

export const AnniwAppBar: React.FC<{}> = () => {
  const [, setOpen] = useRecoilState(DrawerIsOpen);

  return (
    <AppBar position="relative" className={styles.appBar}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => setOpen((open) => !open)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={styles.title}>
          {/* Website title */}
          Anniw
        </Typography>
        <Button color="inherit">Login</Button>
        <Button color="inherit">Register</Button>
      </Toolbar>
    </AppBar>
  );
};
