import React from "react";
import {  Grid } from "@material-ui/core";
import LoginForm from "./LoginForm";
import "./index.scss";


function Login() {
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
