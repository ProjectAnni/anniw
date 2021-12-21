import React from "react";
import { useRecoilValue } from "recoil";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import { DrawerIsOpen } from "@/state/ui";
import Menu from "./components/Menu";

const drawerWidth = 240;

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
            <Menu />
        </Drawer>
    );
};
