import React from "react";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import { DrawerIsOpen } from "./AnniwDrawer";
import { SiteCanRegister, SiteInfoState } from "../api";

export const AnniwAppBar: React.FC = () => {
  const setOpen = useSetRecoilState(DrawerIsOpen);
  const info = useRecoilValue(SiteInfoState);
  const canRegister = useRecoilValue(SiteCanRegister);

  document.title = `${info.site_name} | ${info.description}`;

  return (
    <AppBar position="relative" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => setOpen((open) => !open)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          {info.site_name}
        </Typography>
        <Button color="inherit" component={Link} to="/user/login">Login</Button>
        {canRegister && <Button color="inherit">Register</Button>}
      </Toolbar>
    </AppBar>
  );
};
