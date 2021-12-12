import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import useRequest from "@/hooks/useRequest";
import useMessage from "@/hooks/useMessage";
import { DrawerIsOpen } from "@/state/ui";
import { SiteInfoState, SiteCanRegister } from "@/state/site";
import { CurrentUserInfo, IsLogin } from "@/state/user";
import { getSiteInfo, getUserInfo } from "./services";

export const AnniwAppBar: React.FC = () => {
    const setOpen = useSetRecoilState(DrawerIsOpen);
    const [globalSiteInfo, setGlobalSiteInfo] = useRecoilState(SiteInfoState);
    const canRegister = useRecoilValue(SiteCanRegister);
    const isLogin = useRecoilValue(IsLogin);
    const [currentUserInfo, setCurrentUserInfo] = useRecoilState(CurrentUserInfo);
    const [siteInfo] = useRequest(getSiteInfo);
    const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true);
    const [_, { addMessage }] = useMessage();
    const { nickname } = currentUserInfo || {};
    const { siteName, description } = globalSiteInfo || {};
    useEffect(() => {
        siteInfo && setGlobalSiteInfo(siteInfo);
    }, [siteInfo]);

    useEffect(() => {
        if (siteName) {
            document.title = `${siteName}${description ? ` | ${description}` : ""}`;
        }
    }, [siteName, description]);

    useEffect(() => {
        getUserInfo()
            .then((userInfo) => {
                setCurrentUserInfo(userInfo);
            })
            .catch((e) => {
                e.message && addMessage("error", e.message);
            })
            .finally(() => {
                setIsLoadingUserInfo(false);
            });
    }, []);

    return (
        <AppBar position="relative" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={() => setOpen((open) => !open)}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" flexGrow={1}>
                    {siteName}
                </Typography>
                {!isLoadingUserInfo && isLogin && (
                    <>
                        <Button color="inherit" component={Link} to="/user/index">
                            {nickname}
                        </Button>
                        <Button color="inherit" component={Link} to="/user/logout">
                            注销
                        </Button>
                    </>
                )}
                {!isLoadingUserInfo && !isLogin && (
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
                )}
            </Toolbar>
        </AppBar>
    );
};
