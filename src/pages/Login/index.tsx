import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import { CurrentLoginStatus } from "@/state/user";
import { LoginStatus } from "@/types/common";
import LoginForm from "./LoginForm";
import "./index.scss";

function Login() {
    const navigate = useNavigate();
    const currentLoginStatus = useRecoilValue(CurrentLoginStatus);
    useEffect(() => {
        if (currentLoginStatus === LoginStatus.LOGGED_IN) {
            navigate("/");
        }
    }, [currentLoginStatus, navigate]);
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
