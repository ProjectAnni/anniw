import React from "react";
import { Grid, Tab, Box } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import UserIntroForm from "./UserInfoForm";
import ChangePasswordForm from "./ChangePasswordForm";
import Settings from './Settings';

const UserIndex = () => {
    const [value, setValue] = React.useState("1");

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    return (
        <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={8}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="个人信息" value="1" />
                            <Tab label="密码" value="2" />
                            <Tab label="设置" value="3" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <UserIntroForm />
                    </TabPanel>
                    <TabPanel value="2">
                        <ChangePasswordForm />
                    </TabPanel>
                    <TabPanel value="3">
                        <Settings />
                    </TabPanel>
                </TabContext>
            </Grid>
        </Grid>
    );
};

export default UserIndex;
