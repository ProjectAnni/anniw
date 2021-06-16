import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { RecoilRoot, useRecoilValue } from "recoil";
import clsx from "clsx";

import { StylesProvider } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import { AnniwAppBar } from "./components/AnniwAppBar";
import { AnniwDrawer, DrawerIsOpen } from "./components/AnniwDrawer";
import { PlayerController } from "./components/PlayerController";
import { ActivePlaylistPopup } from "./components/ActivePlaylistPopup";
import styles from "./App.module.scss";
import NotFound from "./pages/NotFound";

function AppBody() {
  const open = useRecoilValue(DrawerIsOpen);
  return (
    <div
      className={clsx(styles.body, {
        [styles.drawerOpen]: open,
        [styles.drawerClose]: !open,
      })}
    >
      <Switch>
        <Route path="/" exact>
          Home
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
      <AppBar position="relative" color="primary" component="div">
        <Toolbar>
          <div className={styles.grow} />
          <PlayerController />
          <ActivePlaylistPopup />
        </Toolbar>
      </AppBar>
    </div>
  );
}

function App() {
  return (
    <RecoilRoot>
      <Router>
        <StylesProvider injectFirst>
          <AnniwAppBar />
          <AnniwDrawer />
          <AppBody />
        </StylesProvider>
      </Router>
    </RecoilRoot>
  );
}

export default App;
