import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Collapse, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import {
    LocalLibrary,
    Home,
    Search,
    Favorite,
    LocalOffer,
    PlaylistPlay,
    ExpandMore,
    ExpandLess,
    Audiotrack,
} from "@mui/icons-material";
import Album from '@mui/icons-material/Album';

const Menu = () => {
    const [favOpen, setFavOpen] = useState(false);
    const navigate = useNavigate();
    return (
        <List
            component="nav"
            sx={{
                padding: 0,
            }}
        >
            <ListItem button component={Link} to="/">
                <ListItemIcon>
                    <Home />
                </ListItemIcon>
                <ListItemText primary="主页"></ListItemText>
            </ListItem>
            <ListItem button component={Link} to="/library">
                <ListItemIcon>
                    <LocalLibrary />
                </ListItemIcon>
                <ListItemText primary="音频仓库"></ListItemText>
            </ListItem>
            <ListItem button component={Link} to="/search">
                <ListItemIcon>
                    <Search />
                </ListItemIcon>
                <ListItemText primary="搜索"></ListItemText>
            </ListItem>
            <ListItem
                button
                onClick={() => {
                    if (!favOpen) navigate("/fav");
                    setFavOpen(!favOpen);
                }}
            >
                <ListItemIcon>
                    <Favorite />
                </ListItemIcon>
                <ListItemText primary="喜欢"></ListItemText>
                {favOpen ? <ExpandMore /> : <ExpandLess />}
            </ListItem>
            <Collapse in={favOpen} timeout="auto" unmountOnExit>
                <ListItem sx={{ pl: 4 }} button component={Link} to="/fav">
                    <ListItemIcon>
                        <Audiotrack />
                    </ListItemIcon>
                    <ListItemText primary="单曲"></ListItemText>
                </ListItem>
                <ListItem sx={{ pl: 4 }} button component={Link} to="/fav/albums">
                    <ListItemIcon>
                        <Album />
                    </ListItemIcon>
                    <ListItemText primary="专辑"></ListItemText>
                </ListItem>
            </Collapse>
            <ListItem button component={Link} to="/playlist">
                <ListItemIcon>
                    <PlaylistPlay />
                </ListItemIcon>
                <ListItemText primary="播放列表"></ListItemText>
            </ListItem>
            <ListItem button component={Link} to="/tags">
                <ListItemIcon>
                    <LocalOffer />
                </ListItemIcon>
                <ListItemText primary="标签"></ListItemText>
            </ListItem>
        </List>
    );
};

export default Menu;
