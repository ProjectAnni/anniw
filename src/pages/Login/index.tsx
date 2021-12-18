import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useHistory } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { CurrentLoginStatus } from "@/state/user";
import { LoginStatus } from "@/types/common";
import LoginForm from "./LoginForm";
import "./index.scss";

function Login() {
    const history = useHistory();
    const currentLoginStatus = useRecoilValue(CurrentLoginStatus);
    useEffect(() => {
        if (currentLoginStatus === LoginStatus.LOGGED_IN) {
            history.push("/");
        }
    }, [currentLoginStatus, history]);
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
