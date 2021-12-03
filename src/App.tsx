import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { RecoilRoot, useRecoilValue } from "recoil";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import { AnniwAppBar } from "./components/AnniwAppBar";
import { AnniwDrawer, DrawerIsOpen } from "./components/AnniwDrawer";
import { PlayerController } from "./components/PlayerController";
import { ActivePlaylistPopup } from "./components/ActivePlaylistPopup";
import NotFound from "./pages/NotFound";
import Loading from "./pages/Loading";
import Login from "./pages/Login";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Container } from "@material-ui/core";

function AppBody() {
    const open = useRecoilValue(DrawerIsOpen);
    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <Container
                style={{
                    transition: "width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
                    width: open ? "240px" : 0,
                    minWidth: open ? "240px" : 0,
                    padding: 0,
                    margin: 0,
                }}
            />
            <Container component="main" style={{ padding: 0 }}>
                <Switch>
                    <Route path="/" exact>
                        Home
                    </Route>
                    <Route path="/user/login" exact>
                        <Login />
                    </Route>
                    <Route path="*">
                        <NotFound />
                    </Route>
                </Switch>
                <AppBar
                    position="fixed"
                    color="primary"
                    component="div"
                    style={{ bottom: 0, top: "auto" }}
                >
                    <Toolbar
                        style={{
                            transition: "margin-left 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
                            marginLeft: open ? "241px" : 0,
                        }}
                    >
                        <div className="grow" />
                        <PlayerController />
                        <ActivePlaylistPopup />
                    </Toolbar>
                </AppBar>
            </Container>
        </div>
    );
}

function App() {
    return (
        <RecoilRoot>
            <Router>
                <React.Suspense fallback={<Loading />}>
                    <CssBaseline />
                    <AnniwAppBar />
                    <>
                        <AnniwDrawer />
                        <AppBody />
                    </>
                </React.Suspense>
            </Router>
        </RecoilRoot>
    );
}

export default App;
