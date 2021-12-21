import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useRequest from "@/hooks/useRequest";
import { DrawerIsOpen } from "@/state/ui";
import { SiteInfoState, SiteCanRegister } from "@/state/site";
import { CurrentLoginStatus, CurrentUserInfo } from "@/state/user";
import { LoginStatus } from "@/types/common";
import { getSiteInfo } from "./services";

export const AnniwAppBar: React.FC = () => {
    const setOpen = useSetRecoilState(DrawerIsOpen);
    const [globalSiteInfo, setGlobalSiteInfo] = useRecoilState(SiteInfoState);
    const currentUserInfo = useRecoilValue(CurrentUserInfo);
    const canRegister = useRecoilValue(SiteCanRegister);
    const currentLoginStatus = useRecoilValue(CurrentLoginStatus);
    const [siteInfo] = useRequest(getSiteInfo);
    const { nickname } = currentUserInfo || {};
    const { siteName, description } = globalSiteInfo || {};
    useEffect(() => {
        siteInfo && setGlobalSiteInfo(siteInfo);
    }, [siteInfo, setGlobalSiteInfo]);

    useEffect(() => {
        if (siteName) {
            document.title = `${siteName}${description ? ` | ${description}` : ""}`;
        }
    }, [siteName, description]);

    return (
        <AppBar position="relative" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={() => setOpen((open) => !open)}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" flexGrow={1}>
                    {siteName}
                </Typography>
                {currentLoginStatus !== LoginStatus.UNKNOWN &&
                    (currentLoginStatus === LoginStatus.LOGGED_IN ? (
                        <>
                            <Button color="inherit" component={Link} to="/user/index">
                                {nickname}
                            </Button>
                            <Button color="inherit" component={Link} to="/user/logout">
                                注销
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/user/login">
                                登录
                            </Button>
                            {canRegister && (
                                <Button color="inherit" component={Link} to="/user/register">
                                    注册
                                </Button>
                            )}
                        </>
                    ))}
            </Toolbar>
        </AppBar>
    );
};
