import React from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText, Collapse } from "@material-ui/core";
import { LocalLibrary, Home } from "@material-ui/icons";

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
                <ListItemText primary="Home"></ListItemText>
            </ListItem>
            <ListItem button component={Link} to="/library">
                <ListItemIcon>
                    <LocalLibrary />
                </ListItemIcon>
                <ListItemText primary="Library"></ListItemText>
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
