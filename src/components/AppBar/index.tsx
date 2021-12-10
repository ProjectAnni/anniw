import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import useRequest from "../../hooks/useRequest";
import { DrawerIsOpen } from "../../state/ui";
import { SiteInfoState, SiteCanRegister } from "../../state/site";
import { getSiteInfo } from "./services";

export const AnniwAppBar: React.FC = () => {
    const setOpen = useSetRecoilState(DrawerIsOpen);
    const [globalSiteInfo, setGlobalSiteInfo] = useRecoilState(SiteInfoState);
    const canRegister = useRecoilValue(SiteCanRegister);
    const [siteInfo] = useRequest(getSiteInfo);
    const { siteName, description } = globalSiteInfo || {};
    useEffect(() => {
        siteInfo && setGlobalSiteInfo(siteInfo);
    }, [siteInfo]);

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
                <Button color="inherit" component={Link} to="/user/login">
                    登录
                </Button>
                {canRegister && (
                    <Button color="inherit" component={Link} to="/user/register">
                        注册
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};
