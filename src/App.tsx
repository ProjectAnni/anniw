import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { RecoilRoot, useRecoilValue } from "recoil";
import { Container, AppBar, Toolbar, CssBaseline, createTheme, ThemeProvider } from "@mui/material";
import { AnniwAppBar } from "./components/AppBar";
import { AnniwDrawer } from "./components/Drawer";
import ErrorBoundary from "./components/ErrorBoundary";
import GlobalMessage from "./components/GlobalMessage";
import LoginStatus from "./components/LoginStatus";
import NeedLoginPage from "./components/NeedLoginPage";
import Player from "./components/Player";
import NotFound from "./pages/NotFound";
import Loading from "./components/Loading";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import Library from "./pages/Library";
import AlbumList from "./pages/AlbumList";
import AlbumDetail from "./pages/AlbumDetail";
import PlayQueue from "./pages/PlayQueue";
import Search from "./pages/Search";
import Favorite from "./pages/Favorite";
import UserIndex from "./pages/UserIndex";
import { DrawerIsOpen } from "./state/ui";
import "./index.scss";
import TagDetail from "./pages/TagDetail";
import Tags from "./pages/Tags";

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
                        <div style={{ padding: "20px" }}>空无一物的主页</div>
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
                    <Route path={"/user/index"} exact>
                        <NeedLoginPage>
                            <UserIndex />
                        </NeedLoginPage>
                    </Route>
                    <Route path="/library" exact>
                        <NeedLoginPage>
                            <Library />
                        </NeedLoginPage>
                    </Route>
                    <Route path="/album/list" exact>
                        <NeedLoginPage>
                            <AlbumList />
                        </NeedLoginPage>
                    </Route>
                    <Route path="/album/:id">
                        <NeedLoginPage>
                            <AlbumDetail />
                        </NeedLoginPage>
                    </Route>
                    <Route path="/tag/:tag">
                        <NeedLoginPage>
                            <TagDetail />
                        </NeedLoginPage>
                    </Route>
                    <Route path="/tags">
                        <NeedLoginPage>
                            <Tags />
                        </NeedLoginPage>
                    </Route>
                    <Route path="/queue" exact>
                        <NeedLoginPage>
                            <PlayQueue />
                        </NeedLoginPage>
                    </Route>
                    <Route path="/search" exact>
                        <NeedLoginPage>
                            <Search />
                        </NeedLoginPage>
                    </Route>
                    <Route path="/fav" exact>
                        <NeedLoginPage>
                            <Favorite />
                        </NeedLoginPage>
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
                        <Player />
                    </Toolbar>
                </AppBar>
            </Container>
        </div>
    );
}

const theme = createTheme({
    palette: {
        secondary: {
            main: "#ffffff",
        },
    },
});

function App() {
    return (
        <RecoilRoot>
            <>
                <Router>
                    <React.Suspense fallback={<Loading />}>
                        <ThemeProvider theme={theme}>
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
                        </ThemeProvider>
                    </React.Suspense>
                </Router>
                <GlobalMessage />
                <LoginStatus />
            </>
        </RecoilRoot>
    );
}

export default App;
