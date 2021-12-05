import React from "react";
import { Button, TextField, Grid } from "@material-ui/core";
import "./index.scss";

const LoginForm = () => {
    return (
        <Grid
            container
            component="form"
            direction="column"
            alignItems="center"
            sx={{
                width: "40%",
            }}
        >
            <TextField variant="outlined" label="Email" name="email" fullWidth></TextField>
            <br />
            <TextField
                variant="outlined"
                label="Password"
                name="password"
                type="password"
                fullWidth
            ></TextField>
            <br />
            <Button
                color="primary"
                variant="contained"
                sx={{
                    width: "128px",
                }}
            >
                Login
            </Button>
        </Grid>
    );
};

export default LoginForm;
