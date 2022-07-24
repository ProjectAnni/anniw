import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
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
import Playlist from "./pages/Playlist";
import PlaylistDetail from "./pages/PlaylistDetail";
import Tags from "./pages/Tags";
import TagDetail from "./pages/TagDetail";
import NowPlaying from "./pages/NowPlaying";
import { DrawerIsOpen } from "./state/ui";
import styles from "./index.module.scss";
import ShareDetail from "@/pages/ShareDetail";

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
            <Container component="main" className={styles.mainContainer}>
                <Routes>
                    <Route
                        path="/"
                        element={<div style={{ padding: "20px" }}>空无一物的主页</div>}
                    />
                    <Route path="/user/login" element={<Login />} />
                    <Route path="/user/register" element={<Register />} />
                    <Route path="/user/logout" element={<Logout />} />
                    <Route
                        path="/user/index"
                        element={
                            <NeedLoginPage>
                                <UserIndex />
                            </NeedLoginPage>
                        }
                    />
                    <Route
                        path="/library"
                        element={
                            <NeedLoginPage>
                                <Library />
                            </NeedLoginPage>
                        }
                    />
                    <Route
                        path="/album/list"
                        element={
                            <NeedLoginPage>
                                <AlbumList />
                            </NeedLoginPage>
                        }
                    />
                    <Route
                        path="/album/:id"
                        element={
                            <NeedLoginPage>
                                <AlbumDetail />
                            </NeedLoginPage>
                        }
                    />
                    <Route
                        path="/tag/:tag"
                        element={
                            <NeedLoginPage>
                                <TagDetail />
                            </NeedLoginPage>
                        }
                    />
                    <Route
                        path="/tags"
                        element={
                            <NeedLoginPage>
                                <Tags />
                            </NeedLoginPage>
                        }
                    />
                    <Route
                        path="/queue"
                        element={
                            <PlayQueue />
                        }
                    />
                    <Route
                        path="/playlist"
                        element={
                            <NeedLoginPage>
                                <Playlist />
                            </NeedLoginPage>
                        }
                    />
                    <Route
                        path="/playlist/:id"
                        element={
                            <NeedLoginPage>
                                <PlaylistDetail />
                            </NeedLoginPage>
                        }
                    />
                    <Route
                        path="/search"
                        element={
                            <NeedLoginPage>
                                <Search />
                            </NeedLoginPage>
                        }
                    />
                    <Route
                        path="/fav"
                        element={
                            <NeedLoginPage>
                                <Favorite />
                            </NeedLoginPage>
                        }
                    />
                    <Route
                        path="/now"
                        element={
                            <NeedLoginPage>
                                <NowPlaying />
                            </NeedLoginPage>
                        }
                    />
                    <Route
                        path="/s/:shareId"
                        element={
                            <ShareDetail />
                        }
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
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
