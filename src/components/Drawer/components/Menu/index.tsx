import React from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { LocalLibrary, Home, Search, Favorite } from "@mui/icons-material";

const Menu = () => {
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
            <ListItem button component={Link} to="/fav">
                <ListItemIcon>
                    <Favorite />
                </ListItemIcon>
                <ListItemText primary="喜欢"></ListItemText>
            </ListItem>
            {/* <Collapse in={true} timeout="auto">
                <List
                    component="div"
                    disablePadding
                    sx={{
                        paddingLeft: "10px",
                    }}
                >
                    <ListItem button component={Link} to="/library">
                        <ListItemText primary="Library"></ListItemText>
                    </ListItem>
                </List>
            </Collapse> */}
        </List>
    );
};

export default Menu;
