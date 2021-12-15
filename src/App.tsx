import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { RecoilRoot, useRecoilValue } from "recoil";
import { Container, AppBar, Toolbar, CssBaseline } from "@material-ui/core";
import { AnniwAppBar } from "./components/AppBar";
import { AnniwDrawer } from "./components/Drawer";
import { PlayerController } from "./components/PlayerController";
import { ActivePlaylistPopup } from "./components/ActivePlaylistPopup";
import ErrorBoundary from "./components/ErrorBoundary";
import GlobalMessage from "./components/GlobalMessage";
import NotFound from "./pages/NotFound";
import Loading from "./components/Loading";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import Library from "./pages/Library";
import { DrawerIsOpen } from "./state/ui";
import "./index.scss";

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
            <Container component="main" className="main-container">
                <Switch>
                    <Route path="/" exact>
                        Home
                    </Route>
                    <Route path="/user/login" exact>
                        <Login />
                    </Route>
                    <Route path="/user/register" exact>
                        <Register />
                    </Route>
                    <Route path="/user/logout" exact>
                        <Logout />
                    </Route>
                    <Route path="/library" exact>
                        <Library />
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
            <>
                <Router>
                    <React.Suspense fallback={<Loading />}>
                        <CssBaseline />
                        <ErrorBoundary>
                            <AnniwAppBar />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <AnniwDrawer />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <AppBody />
                        </ErrorBoundary>
                    </React.Suspense>
                </Router>
                <GlobalMessage />
            </>
        </RecoilRoot>
    );
}

export default App;
