import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { atom, useRecoilValue } from "recoil";

import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem, { ListItemProps } from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Home from "@material-ui/icons/Home";
import LocalLibrary from "@material-ui/icons/LocalLibrary";
import Toolbar from "@material-ui/core/Toolbar";
import Collapse from "@material-ui/core/Collapse";
import PlaylistPlay from "@material-ui/icons/PlaylistPlay";

const drawerWidth = 240;
const DrawerItems: DrawerItem[] = [
    { text: "Home", icon: <Home />, route: "/" },
    { text: "Library", icon: <LocalLibrary />, route: "/library" },
    {
        text: "Playlist",
        icon: <PlaylistPlay />,
        route: [],
    },
];

export const DrawerIsOpen = atom({
    key: "DrawerIsOpen",
    default: true,
});

function ListItemRoute(props: ListItemProps<RouterLink, { to?: string; button?: true }>) {
    return <ListItem button component={RouterLink} {...props} />;
}

export const AnniwDrawer: React.FC = () => {
    const open = useRecoilValue(DrawerIsOpen);
    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={open}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: "border-box",
                },
            }}
        >
            {/* Placeholder Toolbar for the space of AppBar*/}
            <Toolbar />
            <div>
                <List component="nav" style={{ padding: 0 }}>
                    {DrawerItems.filter((item) => {
                        if (typeof item.show === "function") {
                            return item.show();
                        } else if (typeof item.show === "undefined") {
                            return true;
                        } else {
                            return item.show;
                        }
                    }).map((item) => {
                        if (typeof item.route === "string") {
                            return (
                                <ListItemRoute key={item.text} to={item.route}>
                                    {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                                    <ListItemText primary={item.text} />
                                </ListItemRoute>
                            );
                        } else {
                            return (
                                <>
                                    <ListItemRoute key={item.text}>
                                        {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                                        <ListItemText primary={item.text} />
                                    </ListItemRoute>
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {item.route.map((r) => (
                                                <ListItemRoute key={r.text} to={r.route as string}>
                                                    {r.icon && (
                                                        <ListItemIcon>{r.icon}</ListItemIcon>
                                                    )}
                                                    <ListItemText primary={r.text} />
                                                </ListItemRoute>
                                            ))}
                                        </List>
                                    </Collapse>
                                </>
                            );
                        }
                    })}
                </List>
            </div>
        </Drawer>
    );
};

interface DrawerItem {
    text: string;
    icon?: React.ReactNode;
    route: string | DrawerItem[];
    show?: boolean | (() => boolean);
}
