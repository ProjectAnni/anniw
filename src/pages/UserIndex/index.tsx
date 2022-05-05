import React from "react";
import { BottomNavigation, BottomNavigationAction, Grid } from "@mui/material";
import UserIntroForm from "./UserInfoForm";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PasswordIcon from "@mui/icons-material/Password";
import ChangePasswordForm from "./ChangePasswordForm";

const UserIndex = () => {
    const [tab, setTab] = React.useState(0);
    let content;
    switch (tab) {
        case 0: {
            content = <UserIntroForm />;
            break;
        }
        case 1: {
            content = <ChangePasswordForm />;
        }
    }
    return (
        <Grid container justifyContent="center" alignItems="center">
            <Grid item>
                <BottomNavigation showLabels value={tab} onChange={(_, val) => setTab(val)}>
                    <BottomNavigationAction
                        label="信息"
                        icon={<AccountCircleIcon />}
                    ></BottomNavigationAction>
                    <BottomNavigationAction
                        label="密码"
                        icon={<PasswordIcon />}
                    ></BottomNavigationAction>
                </BottomNavigation>
            </Grid>
            {content}
        </Grid>
    );
};

export default UserIndex;
