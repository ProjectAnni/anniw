import React from "react";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styles from "./AnniwAppBar.module.scss";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import { DrawerIsOpen } from "./AnniwDrawer";
import { SiteCanRegister, SiteInfoState } from "../api";

export const AnniwAppBar: React.FC<{}> = () => {
  const setOpen = useSetRecoilState(DrawerIsOpen);
  const info = useRecoilValue(SiteInfoState);
  const canRegister = useRecoilValue(SiteCanRegister);

  return (
    <AppBar position="relative" className={styles.appBar}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => setOpen((open) => !open)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={styles.title}>
          {info.site_name}
        </Typography>
        <Button color="inherit" component={Link} to="/user/login">Login</Button>
        {canRegister && <Button color="inherit">Register</Button>}
      </Toolbar>
    </AppBar>
  );
};
