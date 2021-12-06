import React from "react";
import { useRecoilValue } from "recoil";
import { Button, TextField, Typography, Grid, Box } from "@material-ui/core";
import { SiteEnabled2FA } from "../../state/site";
import LoginForm from "./LoginForm";
import "./index.scss";

function Login() {
    const enabled2fa = useRecoilValue(SiteEnabled2FA);

    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            component="div"
            className="login-form-container"
        >
            <LoginForm />
        </Grid>
    );
}

export default Login;
